/* Email confirmation + magic-link callback. Supabase appends `?code=...`
   to the URL it sends; we exchange that code for a session and redirect.
   no-store on every response so a stale CDN can't replay a consumed code. */
import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { safeNext } from "../../../lib/safe-redirect";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"), "/student-dashboard");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`, { headers: NO_STORE });
    }
    console.error("[auth/callback] exchange failed", { code: error.code, message: error.message });
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`, { headers: NO_STORE });
}
