/* Generic site_settings reader. The key namespace is dotted:
     home.hero.title_bn
     contact.phone
     footer.tagline
     faq.items   (jsonb array of {q, a})
     about.mission_body_bn
   Public pages call getSetting() in server components; the admin
   "Pages" CMS calls getSettings(prefix) to load all keys at once
   and updateSettings() (server action) to upsert them.

   Both readers are wrapped in React `cache()` so multiple callers in
   the same request (e.g. NavbarServer + Footer + the page itself, all
   asking for site.* / footer.* / contact.*) share a single Supabase
   round-trip per unique key/prefix. */

import { cache } from "react";
import { createClient } from "./supabase/server";

export type SettingValue =
  | string
  | number
  | boolean
  | null
  | SettingValue[]
  | { [k: string]: SettingValue };

export const getSetting = cache(async <T extends SettingValue>(
  key: string,
  fallback: T
): Promise<T> => {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
  if (data?.value === undefined || data?.value === null) return fallback;
  return data.value as T;
});

/* Batch-fetch every setting whose key starts with a prefix.
   Returns a flat object keyed by full key (so caller can do
   `s["home.hero.title_bn"]`). Memoized per-prefix per-request. */
export const getSettingsByPrefix = cache(async (prefix: string): Promise<Record<string, SettingValue>> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .like("key", `${prefix}%`);
  const out: Record<string, SettingValue> = {};
  (data ?? []).forEach((row) => {
    out[row.key as string] = row.value as SettingValue;
  });
  return out;
});

/* Convenience: read a value from a pre-fetched bag with a fallback. */
export function pick<T extends SettingValue>(
  bag: Record<string, SettingValue>,
  key: string,
  fallback: T
): T {
  const v = bag[key];
  return (v === undefined || v === null) ? fallback : (v as T);
}
