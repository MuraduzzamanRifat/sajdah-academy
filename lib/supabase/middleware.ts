/* Edge middleware. Two responsibilities:

   1. SUBDOMAIN ROUTING — `api.sijdahacademy.com` is the admin panel.
      Requests to that host get internally rewritten so `/foo` serves
      the page at `/admin/foo` (users see clean URLs without /admin/).
      The main domain redirects /admin/* to api so /admin can never
      be reached on the public host.

   2. AUTH GATE — refresh the Supabase session, then enforce role-
      based access on the LOGICAL path (post-rewrite). Cookies set by
      the auth refresh are carried onto whatever final response we
      return (rewrite, redirect, or pass-through). */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminRole } from "../roles";

const ADMIN_HOST_RE = /^api\./i;

type Plan =
  | { kind: "pass" }
  | { kind: "rewrite"; target: URL; logicalPath: string }
  | { kind: "redirect"; target: URL };

function planRouting(request: NextRequest): Plan {
  const url = request.nextUrl;
  const path = url.pathname;
  const host = request.headers.get("host") ?? "";
  const isAdminHost = ADMIN_HOST_RE.test(host);

  // api.*  →  rewrite "/foo" to internal "/admin/foo"
  if (isAdminHost) {
    const passThrough =
      path.startsWith("/admin") ||
      path.startsWith("/login") ||
      path.startsWith("/auth") ||
      path.startsWith("/_next") ||
      path.startsWith("/api/");
    if (passThrough) return { kind: "pass" };
    const target = url.clone();
    target.pathname = path === "/" ? "/admin/" : `/admin${path}`;
    return { kind: "rewrite", target, logicalPath: target.pathname };
  }

  // main domain  →  /admin/* should not be reachable; redirect to api host
  if (path.startsWith("/admin")) {
    const target = new URL(url.toString());
    target.host = host.replace(/^(www\.)?/, "api.");
    target.pathname = path.replace(/^\/admin/, "") || "/";
    return { kind: "redirect", target };
  }

  return { kind: "pass" };
}

function isProtected(path: string) {
  return (
    path.startsWith("/admin") ||
    path.startsWith("/student-dashboard") ||
    path.startsWith("/login") ||
    path.startsWith("/auth")
  );
}

/* Carry every cookie set on `from` onto `to`. Used so that cookies the
   auth refresh wrote onto a NextResponse.next() survive when we replace
   that response with a rewrite or redirect. */
function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((c) => {
    to.cookies.set({ ...c });
  });
}

export async function updateSession(request: NextRequest) {
  const plan = planRouting(request);

  // Redirects need no auth — short-circuit
  if (plan.kind === "redirect") {
    return NextResponse.redirect(plan.target);
  }

  const logicalPath = plan.kind === "rewrite" ? plan.logicalPath : request.nextUrl.pathname;

  // Public paths: skip Supabase round-trip entirely
  if (!isProtected(logicalPath)) {
    return plan.kind === "rewrite"
      ? NextResponse.rewrite(plan.target)
      : NextResponse.next({ request });
  }

  // Refresh session on a vanilla `next` response (the cookie callback
  // pattern requires this — it overwrites `response` with a fresh
  // NextResponse.next() each time cookies change). We'll transplant
  // the cookies onto a rewrite/redirect at the end if needed.
  let cookieResponse = NextResponse.next({ request });

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
          cookieResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = logicalPath.startsWith("/admin");
  const isStudent = logicalPath.startsWith("/student-dashboard");

  if ((isAdmin || isStudent) && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", logicalPath);
    const r = NextResponse.redirect(loginUrl);
    copyCookies(cookieResponse, r);
    return r;
  }

  if (isAdmin && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (!isAdminRole(profile?.role)) {
      const u = request.nextUrl.clone();
      u.pathname = "/student-dashboard";
      const r = NextResponse.redirect(u);
      copyCookies(cookieResponse, r);
      return r;
    }
  }

  // Auth passed — finalize. Apply the rewrite if we had one; otherwise
  // return the cookie response.
  if (plan.kind === "rewrite") {
    const r = NextResponse.rewrite(plan.target);
    copyCookies(cookieResponse, r);
    return r;
  }
  return cookieResponse;
}
