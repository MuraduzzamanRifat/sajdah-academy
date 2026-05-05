/* Supabase client for Server Components, Route Handlers, and Server Actions.
   Reads + writes cookies via next/headers so auth state stays in sync.
   The `set` calls inside Server Components throw, so we swallow them — the
   middleware refreshes cookies on every request anyway.
   For service-role (RLS-bypass) tasks, see ./service.ts instead. */
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component context — ignore. Middleware handles refresh.
          }
        },
      },
    }
  );
}
