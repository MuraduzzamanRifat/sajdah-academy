/* Edge middleware helper. On every request: refresh the auth session,
   then enforce role-based access on /admin/* and /dashboard/*.
   This is the canonical Next.js + @supabase/ssr pattern — DO NOT add
   logic between createServerClient and supabase.auth.getUser(). */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminRole } from "../roles";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

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

  // Refresh the session — required on every request that touches Supabase auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAdmin = path.startsWith("/admin");
  const isDashboard = path.startsWith("/dashboard");
  const isLogin = path.startsWith("/login");
  const isAuthCallback = path.startsWith("/auth");

  // Public routes — pass through
  if (!isAdmin && !isDashboard) return response;

  // Protected route, no user → bounce to /login with return path
  if (!user && !isLogin && !isAuthCallback) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Logged in but role check needed for /admin
  if (user && isAdmin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!isAdminRole(profile?.role)) {
      // Logged-in non-admins get sent to their student dashboard
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
