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

/* Convenience: read a value from a pre-fetched bag with a fallback.
   Type-checks the stored value against the fallback's runtime type.
   Without this, a CMS round-trip that stored `{}` or `[]` where a
   string was expected would surface as "Objects are not valid as a
   React child" 500s on whichever public page rendered the field
   (about, privacy, press all hit this). The blind `as T` cast was
   the original sin; the runtime check is the fix. */
export function pick<T extends SettingValue>(
  bag: Record<string, SettingValue>,
  key: string,
  fallback: T
): T {
  const v = bag[key];
  if (v === undefined || v === null) return fallback;
  // String/number/boolean fallback → require matching primitive.
  if (typeof fallback === "string" && typeof v !== "string") return fallback;
  if (typeof fallback === "number" && typeof v !== "number") return fallback;
  if (typeof fallback === "boolean" && typeof v !== "boolean") return fallback;
  // Array fallback → require array.
  if (Array.isArray(fallback) && !Array.isArray(v)) return fallback;
  // Object fallback (non-array, non-null) → require plain object.
  if (
    !Array.isArray(fallback) &&
    typeof fallback === "object" &&
    fallback !== null &&
    (typeof v !== "object" || v === null || Array.isArray(v))
  ) {
    return fallback;
  }
  return v as T;
}
