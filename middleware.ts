import { updateSession } from "./lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /* Match every path except: static files, image optimizer, favicons,
       and Next.js internals. Auth check runs on /admin, /dashboard,
       and /login but skips public marketing pages by intent (cheaper). */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff2?)$).*)",
  ],
};
