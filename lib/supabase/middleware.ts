/* Edge middleware. Two responsibilities:

   1. SUBDOMAIN ROUTING — `api.sijdahacademy.com` is the admin panel.
      Requests to that host get internally rewritten so `/foo` serves
      the page at `/admin/foo` (users see clean URLs without /admin/).
      The main domain redirects /admin/* to api so /admin can never
      be reached on the public host.

   2. AUTH GATE + IDENTITY PROPAGATION — refresh the Supabase session,
      fetch the profile (role + name + email) ONCE, and set x-user-*
      headers on the request that downstream Server Components read
      via next/headers. Layouts and pages no longer need to re-call
      auth.getUser()/profile-select; they just read headers. */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminRole } from "../roles";
import { ADMIN_HOST_RE } from "../site-url";

/* Header names — single source of truth for both writer (this file)
   and readers (lib/auth/current-user.ts). Imported elsewhere so a
   typo can't silently desync. */
export const USER_ID_HEADER = "x-sajdah-user-id";
export const USER_EMAIL_HEADER = "x-sajdah-user-email";
export const USER_NAME_HEADER = "x-sajdah-user-name";
export const USER_ROLE_HEADER = "x-sajdah-user-role";
const ALL_USER_HEADERS = [USER_ID_HEADER, USER_EMAIL_HEADER, USER_NAME_HEADER, USER_ROLE_HEADER];

type Plan =
  | { kind: "pass" }
  | { kind: "rewrite"; target: URL; logicalPath: string }
  | { kind: "redirect"; target: URL };

function planRouting(request: NextRequest): Plan {
  const url = request.nextUrl;
  const path = url.pathname;
  const host = request.headers.get("host") ?? "";
  const isAdminHost = ADMIN_HOST_RE.test(host);

  if (isAdminHost) {
    if (path.startsWith("/student-dashboard")) {
      const target = new URL(url.toString());
      target.host = host.replace(/^api\./i, "");
      return { kind: "redirect", target };
    }
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

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((c) => {
    to.cookies.set({ ...c });
  });
}

/* Build the request-header bag that gets handed to downstream code.
   Always sanitise — we MUST overwrite any client-supplied x-sajdah-*
   header so a malicious request can't impersonate by sending
   "x-sajdah-user-role: super_admin" from the browser. */
function buildIdentityHeaders(
  request: NextRequest,
  identity: { id: string; email: string; name: string; role: string } | null
): Headers {
  const out = new Headers(request.headers);
  ALL_USER_HEADERS.forEach((h) => out.delete(h));
  if (identity) {
    out.set(USER_ID_HEADER, identity.id);
    out.set(USER_EMAIL_HEADER, identity.email);
    out.set(USER_NAME_HEADER, identity.name);
    out.set(USER_ROLE_HEADER, identity.role);
  }
  return out;
}

export async function updateSession(request: NextRequest) {
  const plan = planRouting(request);

  if (plan.kind === "redirect") {
    return NextResponse.redirect(plan.target);
  }

  const logicalPath = plan.kind === "rewrite" ? plan.logicalPath : request.nextUrl.pathname;

  // Public paths: sanitise identity headers (in case client sent any),
  // then short-circuit without touching Supabase.
  if (!isProtected(logicalPath)) {
    const cleanHeaders = buildIdentityHeaders(request, null);
    return plan.kind === "rewrite"
      ? NextResponse.rewrite(plan.target, { request: { headers: cleanHeaders } })
      : NextResponse.next({ request: { headers: cleanHeaders } });
  }

  // Protected — refresh session on a vanilla next response. Supabase
  // setAll callback overwrites this response when cookies change;
  // we'll transplant cookies + identity headers onto the final response.
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

  /* Single profile fetch — covers both the role gate AND the identity
     headers downstream code needs. Save 1 round-trip vs the previous
     "middleware fetches role, layout fetches name+email+role again"
     pattern. */
  let identity: { id: string; email: string; name: string; role: string } | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, role")
      .eq("id", user.id)
      .single();
    identity = {
      id: user.id,
      email: profile?.email ?? user.email ?? "",
      name: profile?.full_name ?? user.email ?? "User",
      role: profile?.role ?? "student",
    };
  }

  // Student-dashboard auth gate: redirect to /login if not signed in.
  if (isStudent && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", logicalPath);
    const r = NextResponse.redirect(loginUrl);
    copyCookies(cookieResponse, r);
    return r;
  }

  // Admin role gate: signed-in non-admins on /admin/* go to student dashboard.
  if (isAdmin && user && !isAdminRole(identity?.role)) {
    const u = request.nextUrl.clone();
    u.pathname = "/student-dashboard";
    const r = NextResponse.redirect(u);
    copyCookies(cookieResponse, r);
    return r;
  }

  // Auth passed (or unauth on /admin where layout renders inline panel).
  // Final response carries the rewrite/next + identity headers + cookies.
  const headersWithIdentity = buildIdentityHeaders(request, identity);

  if (plan.kind === "rewrite") {
    const r = NextResponse.rewrite(plan.target, {
      request: { headers: headersWithIdentity },
    });
    copyCookies(cookieResponse, r);
    return r;
  }

  const r = NextResponse.next({ request: { headers: headersWithIdentity } });
  copyCookies(cookieResponse, r);
  return r;
}
