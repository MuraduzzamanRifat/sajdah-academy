/* Supabase client for use in Client Components ("use client" files).
   Browser-only. Reads cookies set by the server for SSR session sync. */
import { createBrowserClient } from "@supabase/ssr";

/* TODO: when the user runs `npm run db:types` (requires Supabase CLI
   + linked project), update this to `createBrowserClient<Database>(...)`
   for full result-type inference on every query.  The hand-written
   database.types.ts doesn't satisfy supabase-js's internal type
   machinery — the official generated file does. */

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
