/* Generic site_settings reader. The key namespace is dotted:
     home.hero.title_bn
     contact.phone
     footer.tagline
     faq.items   (jsonb array of {q, a})
     about.mission_body_bn
   Public pages call getSetting() in server components; the admin
   "Pages" CMS calls getSettings(prefix) to load all keys at once
   and updateSettings() (server action) to upsert them.

   ── Two-layer caching ──────────────────────────────────────
   1. React cache() — per-request dedup so NavbarServer + Footer +
      the page itself, all asking for site.* / footer.* / contact.*,
      share a single Supabase round-trip per unique key/prefix.
   2. unstable_cache() — cross-request, ISR-aware persistent cache
      with tag-based invalidation. Without this, every cold ISR
      render in every Vercel region re-hits Supabase. With ~16
      pages × ~18 regions × 60s revalidate that's ≈ 17K cold
      Supabase queries per hour at peak. The tagged cache flips
      that to "once per content edit" — admins call revalidateTag()
      from the save action and consumers see fresh data on next
      hit. */

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient } from "./supabase/server";

export type SettingValue =
  | string
  | number
  | boolean
  | null
  | SettingValue[]
  | { [k: string]: SettingValue };

/* Stable tag namespace. Public pages don't reference these directly;
   the admin save action calls invalidateSettingsTags() with the
   prefixes that actually changed. */
export const settingsTag = (prefix: string) => `settings:${prefix}`;
export const SETTINGS_GLOBAL_TAG = "settings:all";

const FETCH_TTL_SECONDS = 300; // 5 min hard ceiling — tags fire faster

/* Persistent (cross-request) prefix fetch. Keyed by prefix; tagged
   with both the per-prefix tag and a global tag so admins can blow
   the whole bag in one call. Throws are swallowed inside; the wrapper
   returns {} on failure so a Supabase outage degrades to defaults
   instead of 500'ing every public page. */
const fetchPrefix = unstable_cache(
  async (prefix: string): Promise<Record<string, SettingValue>> => {
    try {
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
    } catch {
      return {};
    }
  },
  ["site-settings:by-prefix"],
  { revalidate: FETCH_TTL_SECONDS, tags: [SETTINGS_GLOBAL_TAG] }
);

const fetchSingle = unstable_cache(
  async (key: string): Promise<SettingValue | null> => {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (data?.value === undefined || data?.value === null) return null;
      return data.value as SettingValue;
    } catch {
      return null;
    }
  },
  ["site-settings:single"],
  { revalidate: FETCH_TTL_SECONDS, tags: [SETTINGS_GLOBAL_TAG] }
);

export const getSetting = cache(async <T extends SettingValue>(
  key: string,
  fallback: T
): Promise<T> => {
  const v = await fetchSingle(key);
  return (v === null ? fallback : v) as T;
});

export const getSettingsByPrefix = cache(async (
  prefix: string
): Promise<Record<string, SettingValue>> => {
  return fetchPrefix(prefix);
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
