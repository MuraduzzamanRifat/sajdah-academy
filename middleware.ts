import { updateSession } from "./lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  /* Matcher must include `/` and arbitrary paths because:
     - Subdomain routing rewrites `api.sijdahacademy.com/foo` → `/admin/foo`
       (won't trigger if middleware doesn't see `/foo`)
     - Auth gate covers `/admin/*` and `/student-dashboard/*`
     - Auth flow covers `/login` and `/auth/*`
     Static asset paths are excluded so we don't burn Supabase round-trips
     on every CSS/JS/image fetch. */
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff2?|ttf|mp4|webmanifest)$).*)",
  ],
};
