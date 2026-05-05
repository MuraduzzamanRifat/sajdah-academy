/* Single source of truth for the canonical site URL. Used by metadata,
   sitemap, robots, and any code that needs to build absolute URLs.
   Order: explicit env override → Vercel preview URL → localhost. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001");
