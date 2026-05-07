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

/* Single source of truth for "are we on the admin subdomain?" — used by
   the root layout (chrome decisions), login page (theme decision), and
   middleware (subdomain rewrite + auth-redirect target). The regex
   matches any `api.*` host so previews like `api-staging.example.com`
   keep working. */
export const ADMIN_HOST_RE = /^api\./i;
export const isAdminHost = (host: string | null | undefined): boolean =>
  !!host && ADMIN_HOST_RE.test(host);
