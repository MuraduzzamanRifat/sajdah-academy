import { updateSession } from "./lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  /* Auth check only runs on protected and auth-related routes — public
     marketing pages skip middleware entirely (no Supabase round-trip
     per page view, no quota burn for guests). */
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/auth/:path*"],
};
