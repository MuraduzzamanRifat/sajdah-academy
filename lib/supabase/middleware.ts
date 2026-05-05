/* Edge middleware. Two responsibilities:

   1. SUBDOMAIN ROUTING — `api.sijdahacademy.com` is the admin panel.
      Requests to that host get internally rewritten so `/foo` serves the
      page at `/admin/foo` (users see clean URLs without `/admin/`).
      Conversely, the main domain blocks `/admin/*` and redirects to api.

   2. AUTH GATE — refresh the Supabase session on every request, then
      enforce role-based access on /admin/* (admin roles only) and
      /student-dashboard/* (any logged-in user). */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminRole } from "../roles";

const ADMIN_HOST_RE = /^api\./i;

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const isAdminHost = ADMIN_HOST_RE.test(host);

  // ---------- Step 1: subdomain routing ----------

  // On api.*: any path that doesn't already start with /admin gets
  // rewritten to /admin + path, so api.foo.com/students/ serves
  // /admin/students/. /login and /auth pass through untouched so the
  // sign-in flow works on either host.
  if (isAdminHost) {
    const path = url.pathname;
    const passThrough =
      path.startsWith("/admin") ||
      path.startsWith("/login") ||
      path.startsWith("/auth") ||
      path.startsWith("/_next") ||
      path.startsWith("/api");
    if (!passThrough) {
      const rewritten = url.clone();
      rewritten.pathname = `/admin${path === "/" ? "" : path}`;
      return continueWithAuth(request, NextResponse.rewrite(rewritten));
    }
  }

  // On the main domain: /admin/* should not be reachable. Redirect to
  // the admin host (preserve the path so a bookmarked /admin/students/
  // ends up at api.sijdahacademy.com/students/).
  if (!isAdminHost && url.pathname.startsWith("/admin")) {
    const target = new URL(url.toString());
    target.host = host.replace(/^(www\.)?/, "api.");
    target.pathname = url.pathname.replace(/^\/admin/, "") || "/";
    return NextResponse.redirect(target);
  }

  // ---------- Step 2: auth gate (everything else flows through) ----------
  return continueWithAuth(request, NextResponse.next({ request }));
}

async function continueWithAuth(request: NextRequest, baseResponse: NextResponse) {
  // Read the path first — for purely public requests on the main domain
  // we skip the Supabase round-trip entirely (huge win since the matcher
  // catches every page for subdomain-routing reasons).
  const path = request.nextUrl.pathname;
  const isAdmin = path.startsWith("/admin");
  const isStudent = path.startsWith("/student-dashboard");
  const isAuthFlow = path.startsWith("/login") || path.startsWith("/auth");

  if (!isAdmin && !isStudent && !isAuthFlow) return baseResponse;

  let response = baseResponse;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdmin && !isStudent) return response;

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!isAdminRole(profile?.role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/student-dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
