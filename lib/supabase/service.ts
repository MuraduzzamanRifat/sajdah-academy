/* Service-role Supabase client. Bypasses RLS — use ONLY for trusted
   server-side admin tasks (seeding, cron jobs, signup hooks). The
   `server-only` import errors the build if a client component ever
   tries to import this file. */
import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
