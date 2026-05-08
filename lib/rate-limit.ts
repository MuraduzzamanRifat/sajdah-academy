import "server-only";

import { headers } from "next/headers";

/* In-memory token bucket. Lives for the lifetime of a single Vercel
   serverless instance — across instances each gets its own bucket,
   so the effective rate limit is roughly N_instances × limit. That's
   fine for spam control on low-volume endpoints (enrollment, login,
   contact); for hard rate limits at high traffic, swap the storage
   to Vercel KV / Upstash Redis. The interface stays the same. */

type Bucket = { tokens: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/* Periodic cleanup so the map doesn't grow unbounded. Runs at most
   every minute and only if the map has > 1000 entries. */
let lastSweep = Date.now();
function maybeSweep() {
  const now = Date.now();
  if (buckets.size <= 1000 || now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, v] of buckets) {
    if (v.resetAt <= now) buckets.delete(k);
  }
}

/* Read the client IP from the platform-provided headers in this order:
     x-forwarded-for (first hop) — Vercel sets this
     x-real-ip — alt header some proxies set
     cf-connecting-ip — Cloudflare
   Falls back to "anon" so unidentifiable callers share a bucket
   (still rate-limited, just collectively). */
async function clientKey(extra?: string): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  const ip =
    (fwd ? fwd.split(",")[0].trim() : null) ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "anon";
  return extra ? `${extra}:${ip}` : ip;
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
};

/* Take one token from the bucket for `(scope, ip)`. Returns ok=false
   when the bucket is empty. Buckets refill in one shot at resetAt
   (fixed window, not sliding) — simpler than a real token bucket and
   plenty for "no more than N actions per minute from one IP". */
export async function rateLimit(
  scope: string,
  opts: { limit: number; windowSeconds: number }
): Promise<RateLimitResult> {
  maybeSweep();
  const key = await clientKey(scope);
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || b.resetAt <= now) {
    const fresh: Bucket = {
      tokens: opts.limit - 1,
      resetAt: now + opts.windowSeconds * 1000,
    };
    buckets.set(key, fresh);
    return { ok: true, remaining: fresh.tokens, resetIn: opts.windowSeconds };
  }

  if (b.tokens <= 0) {
    return {
      ok: false,
      remaining: 0,
      resetIn: Math.max(1, Math.ceil((b.resetAt - now) / 1000)),
    };
  }

  b.tokens -= 1;
  return {
    ok: true,
    remaining: b.tokens,
    resetIn: Math.max(1, Math.ceil((b.resetAt - now) / 1000)),
  };
}
