/* Supabase client for use in Client Components ("use client" files).
   Browser-only. Reads cookies set by the server for SSR session sync. */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
