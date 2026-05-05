/* Single source of truth for the canonical site URL. Used by metadata,
   sitemap, robots, and any code that needs to build absolute URLs.

   Resolution order:
   1. NEXT_PUBLIC_SITE_URL — explicit override (set on Vercel for prod)
   2. VERCEL_URL — auto-injected on every Vercel deployment
   3. localhost fallback for `npm run dev`

   The admin panel lives at api.sijdahacademy.com (separate Vercel domain
   alias on the same project) — see middleware.ts for host-based routing. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001");

export const ADMIN_HOST = "api.sijdahacademy.com";
export const PUBLIC_HOST = "sijdahacademy.com";
