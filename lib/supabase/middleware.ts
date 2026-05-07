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

  /* URL CONTRACT (admin host = api.sijdahacademy.com)
       /                 → admin login (unauth) or dashboard (auth)
       /dashboard/       → admin overview (canonical)
       /dashboard/foo    → admin sub-page (e.g. /dashboard/students/)
       /admin/foo        → still works (legacy aliases /admin → /dashboard
                            for any internal link or bookmark)
     File system stays /admin/* — middleware rewrites the user-facing
     /dashboard/* URLs onto those files. */
  if (isAdminHost) {
    // Student dashboard belongs on the main domain.
    if (path.startsWith("/student-dashboard")) {
      const target = new URL(url.toString());
      target.host = host.replace(/^api\./i, "");
      return { kind: "redirect", target };
    }

    // Auth-flow URLs and Next internals pass through untouched.
    if (
      path.startsWith("/login") ||
      path.startsWith("/auth") ||
      path.startsWith("/_next") ||
      path.startsWith("/api/")
    ) {
      return { kind: "pass" };
    }

    // /dashboard/foo  →  internally serve /admin/foo
    if (path === "/dashboard" || path === "/dashboard/") {
      const target = url.clone();
      target.pathname = "/admin/";
      return { kind: "rewrite", target, logicalPath: "/admin/" };
    }
    if (path.startsWith("/dashboard/")) {
      const target = url.clone();
      target.pathname = "/admin/" + path.slice("/dashboard/".length);
      return { kind: "rewrite", target, logicalPath: target.pathname };
    }

    // /admin/foo passes through (legacy bookmarks + revalidatePath internals).
    if (path.startsWith("/admin")) return { kind: "pass" };

    // Anything else (incl. root "/") → admin overview.
    const target = url.clone();
    target.pathname = path === "/" ? "/admin/" : `/admin${path}`;
    return { kind: "rewrite", target, logicalPath: target.pathname };
  }

  // On the public host: /admin/* should never serve content; bounce to
  // the equivalent /dashboard/* on the api host so admins follow the
  // canonical URL.
  if (path.startsWith("/admin")) {
    const target = new URL(url.toString());
    target.host = host.replace(/^(www\.)?/, "api.");
    target.pathname = path === "/admin" || path === "/admin/"
      ? "/dashboard/"
      : "/dashboard" + path.slice("/admin".length);
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
   "x-sajdah-user-role: super_admin" from the browser. The same logic
   is applied UNCONDITIONALLY at the top of updateSession() so even
   short-circuit paths (static-asset 304s, fast pass-through) get
   sanitised — closes the audit's "matcher excludes some path → headers
   trusted" trust-boundary class. */
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

/* CSP nonce — minted per request so we can drop 'unsafe-inline' from
   script-src. The nonce-aware scripts (Next's runtime, Vercel
   Analytics, our JSON-LD <script>) read it via x-csp-nonce request
   header and emit `<script nonce="...">`.

   Edge runtime has crypto.getRandomValues + btoa but NOT Node's
   Buffer reliably, so we hand-encode the random bytes to base64. */
function makeNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

const NONCE_HEADER = "x-csp-nonce";

function buildCSP(nonce: string, isDev: boolean): string {
  /* Pragmatic CSP. We previously used 'strict-dynamic' + nonce but
     that caused production hydration failures: browsers ignore
     'unsafe-inline' AND the host-allowlist when strict-dynamic is
     set, so Vercel Analytics' loader and any third-party inline
     script that didn't carry our exact request-nonce got blocked
     mid-hydration → root layout error → global "Application error".

     Now: nonce stamps OUR inline scripts (preloader, JSON-LD), 'self'
     covers Next chunks, 'unsafe-inline' is the fallback for any
     framework / analytics inline that we can't nonce-stamp.
     Less strict than nonce-only but doesn't break the site.
     Stored XSS is still blocked by DOMPurify on write + read. */
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'unsafe-inline'",
    "https://va.vercel-scripts.com",
    isDev ? "'unsafe-eval'" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${scriptSrc}`,
    "connect-src 'self' https://*.supabase.co https://vitals.vercel-insights.com https://va.vercel-scripts.com",
    "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
    "frame-ancestors 'none'",
    "worker-src 'self' blob:",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/* Apply per-request CSP + nonce to the outgoing response. The nonce
   is also written onto the request so server components can read it
   via headers().get("x-csp-nonce") and pass it to <Script> / inline
   <script> tags. */
function applyCsp(response: NextResponse, nonce: string): NextResponse {
  const isDev = process.env.NODE_ENV === "development";
  response.headers.set("Content-Security-Policy", buildCSP(nonce, isDev));
  return response;
}

export async function updateSession(request: NextRequest) {
  /* Mint a CSP nonce for this request and stamp it onto the request
     headers so server components / next/script can read it. */
  const nonce = makeNonce();

  const plan = planRouting(request);

  if (plan.kind === "redirect") {
    return applyCsp(NextResponse.redirect(plan.target), nonce);
  }

  const logicalPath = plan.kind === "rewrite" ? plan.logicalPath : request.nextUrl.pathname;

  // Public paths: sanitise identity headers (in case client sent any),
  // then short-circuit without touching Supabase.
  if (!isProtected(logicalPath)) {
    const cleanHeaders = buildIdentityHeaders(request, null);
    cleanHeaders.set(NONCE_HEADER, nonce);
    const r =
      plan.kind === "rewrite"
        ? NextResponse.rewrite(plan.target, { request: { headers: cleanHeaders } })
        : NextResponse.next({ request: { headers: cleanHeaders } });
    return applyCsp(r, nonce);
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

  /* getUser() throws on stale tokens (user_not_found, invalid_token).
     Catch + signOut so the dead JWT cookie doesn't keep firing on
     every request. */
  let user: { id: string; email?: string | null } | null = null;
  try {
    const { data, error: getUserErr } = await supabase.auth.getUser();
    if (getUserErr) {
      const msg = getUserErr.message?.toLowerCase() ?? "";
      if (msg.includes("user_not_found") || msg.includes("invalid")) {
        await supabase.auth.signOut().catch(() => {});
      }
      user = null;
    } else {
      user = data.user;
    }
  } catch {
    user = null;
  }

  const isAdmin = logicalPath.startsWith("/admin");
  const isStudent = logicalPath.startsWith("/student-dashboard");

  /* Profile fetch covers both the role gate AND identity headers.
     If the user has a session but NO profiles row (trigger missed,
     row deleted, etc.), we treat the session as invalid: sign out
     and let the unauth code path render the login panel. Defaulting
     to "student" used to silently fabricate access. */
  let identity: { id: string; email: string; name: string; role: string } | null = null;
  let profileMissing = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      profileMissing = true;
      await supabase.auth.signOut().catch(() => {});
      user = null;
    } else {
      identity = {
        id: user.id,
        email: profile.email ?? user.email ?? "",
        name: profile.full_name ?? user.email ?? "User",
        role: profile.role,
      };
    }
  }

  // Student-dashboard auth gate: redirect to /login if not signed in.
  if (isStudent && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", logicalPath);
    if (profileMissing) {
      loginUrl.searchParams.set("error", "profile_missing");
    }
    const r = NextResponse.redirect(loginUrl);
    copyCookies(cookieResponse, r);
    return applyCsp(r, nonce);
  }

  // Admin role gate: a non-admin session on the admin host is illegitimate
  // (admin host = api.sijdahacademy.com). Don't cross-host redirect to
  // /student-dashboard — Supabase cookies are subdomain-scoped, so the
  // browser would land on the main host's /login with no session and see
  // the LIGHT student panel ("api root takes me to student login" bug).
  // Instead: strip the identity so the layout renders AdminLoginPanel,
  // and clear stale auth cookies on the api host so the panel starts
  // from a clean state. Students can sign in legitimately on the main
  // host at sijdahacademy.com/login.
  if (isAdmin && user && !isAdminRole(identity?.role)) {
    await supabase.auth.signOut();
    identity = null;
  }

  // Auth passed (or unauth on /admin where layout renders inline panel).
  // Final response carries the rewrite/next + identity headers + cookies + nonce.
  const headersWithIdentity = buildIdentityHeaders(request, identity);
  headersWithIdentity.set(NONCE_HEADER, nonce);

  if (plan.kind === "rewrite") {
    const r = NextResponse.rewrite(plan.target, {
      request: { headers: headersWithIdentity },
    });
    copyCookies(cookieResponse, r);
    return applyCsp(r, nonce);
  }

  const r = NextResponse.next({ request: { headers: headersWithIdentity } });
  copyCookies(cookieResponse, r);
  return applyCsp(r, nonce);
}
