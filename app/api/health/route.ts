import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

/* Lightweight health endpoint — for uptime monitors (UptimeRobot,
   Better Uptime, Pingdom) and the Vercel deployment-readiness check.
   Returns 200 when the request loop AND the database round-trip both
   succeed; 503 if Supabase is unreachable. Marketing pages degrade
   gracefully on a Supabase outage (settings reader returns {} via
   try/catch), so this is a soft signal — don't page on 503 alone,
   look at /about or / status instead. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  let dbOk = false;
  let dbLatency = -1;

  try {
    const supabase = await createClient();
    const t0 = Date.now();
    /* Cheapest reachability probe — single-row select on the indexed
       PK column. We don't care about the value, just the round-trip. */
    const { error } = await supabase
      .from("site_settings")
      .select("key", { count: "exact", head: true })
      .limit(1);
    dbLatency = Date.now() - t0;
    dbOk = !error;
  } catch {
    dbOk = false;
  }

  const body = {
    status: dbOk ? "ok" : "degraded",
    uptime_ms: Date.now() - startedAt,
    db: { ok: dbOk, latency_ms: dbLatency },
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION ?? "local",
  };

  return NextResponse.json(body, {
    status: dbOk ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
