/* Email confirmation + magic-link callback.

   Supabase appends `?code=...` to the URL it sends; we exchange that
   code for a session, then route by ROLE and HOST so admins land on
   /dashboard/ (api host) and students on /student-dashboard/ (main host).

   no-store on every response so a stale CDN can't replay a consumed code. */
import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { safeNext } from "../../../lib/safe-redirect";
import { isAdminRole } from "../../../lib/roles";
import { ADMIN_HOST, PUBLIC_HOST, isAdminHost } from "../../../lib/site-url";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const explicitNext = searchParams.get("next");
  const host = request.headers.get("host") ?? "";
  const onAdminHost = isAdminHost(host);

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`, { headers: NO_STORE });
  }

  const supabase = await createClient();
  const { data: session, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !session.user) {
    console.error("[auth/callback] exchange failed", { code: error?.code, message: error?.message });
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`, { headers: NO_STORE });
  }

  /* Honor an explicit `?next=` param when present (e.g. middleware
     redirected here from a protected page). The path is sanitized by
     safeNext to prevent open-redirect; stays on the same host. */
  if (explicitNext) {
    return NextResponse.redirect(
      `${origin}${safeNext(explicitNext, "/")}`,
      { headers: NO_STORE }
    );
  }

  /* Otherwise route by role. Admins go to /dashboard/ on the api host;
     students to /student-dashboard/ on the public host. If the
     confirmation link was opened on the wrong host (common when an
     admin clicks the email link from their phone with autoplay), we
     cross-redirect to the correct subdomain so they don't land on a
     host where their cookies don't apply. */
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  const isAdmin = isAdminRole(profile?.role);

  if (isAdmin) {
    /* Admin should be on api.* */
    const target = onAdminHost
      ? `${origin}/dashboard/`
      : `https://${ADMIN_HOST}/dashboard/`;
    return NextResponse.redirect(target, { headers: NO_STORE });
  }

  /* Student should be on the main host */
  const target = onAdminHost
    ? `https://${PUBLIC_HOST}/student-dashboard/`
    : `${origin}/student-dashboard/`;
  return NextResponse.redirect(target, { headers: NO_STORE });
}
