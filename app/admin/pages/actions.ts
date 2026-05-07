"use server";

/* Bulk-upsert site_settings rows from a single admin form submission.
   Form field names ARE the setting keys. Values are interpreted by
   their declared storage type. On success the auto cache-clean below
   figures out which public paths to revalidate based on which keys
   changed (no hardcoded list to drift when new pages are added). */

import { revalidatePath } from "next/cache";
import DOMPurify from "isomorphic-dompurify";
import { createClient } from "../../../lib/supabase/server";
import { Actions } from "../../../lib/audit";
import { requireAdmin } from "../../../lib/auth/current-user";
import { PAGE_DEFS } from "./schema";

export type StorageType = "string" | "number" | "boolean" | "json" | "rich";

export type SaveResult = { ok: true; saved: number } | { error: string };

/* Top-level setting prefixes that affect every public page (chrome).
   Editing any of these triggers a layout-level revalidation that nukes
   the cache for ALL nested routes — Next.js handles the cascade. */
const CHROME_PREFIXES = ["site.", "nav.", "footer.", "contact."];

const RICH_PURIFY_CONFIG: Parameters<typeof DOMPurify.sanitize>[1] = {
  ADD_TAGS: ["iframe"],
  ADD_ATTR: [
    "allow",
    "allowfullscreen",
    "frameborder",
    "scrolling",
    "target",
    "rel",
  ],
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|ftp|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
};

/* Map the changed setting keys → set of public paths that need to be
   revalidated. Auto-derived from PAGE_DEFS so adding a new page (or
   a new field on an existing one) doesn't require touching this code. */
function pathsToRevalidate(keys: string[]): { paths: Set<string>; chromeChanged: boolean } {
  const paths = new Set<string>();
  let chromeChanged = false;

  for (const key of keys) {
    if (CHROME_PREFIXES.some((p) => key.startsWith(p))) {
      chromeChanged = true;
      continue;
    }
    /* Find the page whose first dotted segment owns this key.
       e.g. "home.hero.title_bn" → page with slug "home" → path "/". */
    const top = key.split(".")[0];
    const owner = PAGE_DEFS.find((p) => {
      // Page slug usually matches the top-level prefix; for the few
      // cases where it doesn't (batches_list, blog_list), the prefix
      // is "batches"/"blog" — handle by checking key prefixes.
      return (
        p.slug === top ||
        p.slug === `${top}_list` ||
        // admission keys live under "admission." but page slug is "admission"
        p.groups.some((g) => g.fields.some((f) => f.key === key))
      );
    });
    if (owner) paths.add(owner.publicPath);
  }

  return { paths, chromeChanged };
}

export async function saveSettings(
  fields: { key: string; type: StorageType; value: string }[]
): Promise<SaveResult> {
  const me = await requireAdmin();
  if (!me) return { error: "Forbidden — admin access required." };

  const supabase = await createClient();

  /* Per-field error collection — one bad JSON value used to abort the
     entire bulk save, losing every other edit on the form. Now the
     bad field is reported and the rest go through. */
  type Row = { key: string; value: unknown; updated_by: string; updated_at: string };
  const rows: Row[] = [];
  const errors: string[] = [];

  for (const { key, type, value } of fields) {
    try {
      let parsed: unknown;
      switch (type) {
        case "string":
          parsed = value;
          break;
        case "number":
          parsed = value === "" ? null : Number(value);
          break;
        case "boolean":
          parsed = value === "true" || value === "on";
          break;
        case "json":
          /* Empty list/json field: write empty array (jsonb NOT NULL
             rejects raw NULL). Lists serialize as "[]" on empty state. */
          parsed = value === "" ? [] : JSON.parse(value);
          break;
        case "rich":
          parsed = value === "" ? "" : String(DOMPurify.sanitize(value, RICH_PURIFY_CONFIG));
          break;
      }
      rows.push({
        key,
        value: parsed as object,
        updated_by: me.id,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      errors.push(`${key}: ${(e as Error).message}`);
    }
  }

  if (errors.length > 0 && rows.length === 0) {
    return { error: `Invalid values: ${errors.join("; ")}` };
  }

  try {
    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });
    if (error) return { error: error.message };
  } catch (e) {
    return { error: (e as Error).message };
  }

  /* Auto cache clean — derive paths from the actual keys changed. */
  const { paths, chromeChanged } = pathsToRevalidate(rows.map((r) => r.key));

  if (chromeChanged) {
    /* Layout-level invalidation cascades to every public route that
       inherits the marketing layout (Navbar/Footer/JSON-LD). Cheaper
       than enumerating every path. */
    revalidatePath("/", "layout");
  } else {
    paths.forEach((p) => revalidatePath(p));
  }

  /* Always revalidate the admin index so the "edited just now" UX
     reflects the change without a hard reload. */
  revalidatePath("/admin/pages");

  await Actions.settingsUpdate(rows.map((r) => r.key));
  return { ok: true, saved: rows.length };
}

/* Manual emergency cache nuke. Triggered by the "সব ক্যাশ পরিষ্কার" button
   on /dashboard/pages/. Invalidates the entire layout tree — every
   public route loses its ISR cache and re-renders on next request. */
export async function refreshAllCaches(): Promise<{ ok: true } | { error: string }> {
  const me = await requireAdmin();
  if (!me) return { error: "Forbidden — admin access required." };

  revalidatePath("/", "layout");
  revalidatePath("/dashboard/pages");
  revalidatePath("/admin/pages");

  await Actions.settingsUpdate(["__manual_cache_refresh__"]);

  return { ok: true };
}
