"use server";

/* Bulk-upsert site_settings rows from a single admin form submission.
   Form field names ARE the setting keys. Values are interpreted by
   their declared storage type. On success every public path that
   consumes settings gets revalidated.

   Storage types:
     string  — plain text, stored as TS string in jsonb
     number  — coerced via Number(), null on empty
     boolean — checkbox on/off
     json    — JSON.parse'd; used by `list` UI kind too (array)
     rich    — HTML string from Tiptap, sanitized via DOMPurify before
               persistence so a future malicious admin can't inject
               <script> into a public page. */

import { revalidatePath } from "next/cache";
import DOMPurify from "isomorphic-dompurify";
import { createClient } from "../../../lib/supabase/server";
import { Actions } from "../../../lib/audit";

export type StorageType = "string" | "number" | "boolean" | "json" | "rich";

export type SaveResult = { ok: true; saved: number } | { error: string };

const PUBLIC_PATHS_TO_REVALIDATE = [
  "/",
  "/about",
  "/contact",
  "/faq",
  "/courses",
  "/enroll",
  "/blog",
  "/faculty",
];

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

export async function saveSettings(
  fields: { key: string; type: StorageType; value: string }[]
): Promise<SaveResult> {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { error: "Sign in required." };

  const rows = fields.map(({ key, type, value }) => {
    let parsed: unknown;
    try {
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
          parsed = value === "" ? null : JSON.parse(value);
          break;
        case "rich":
          /* Sanitize once at write time. Public pages can then trust the
             stored HTML and skip a per-render DOMPurify pass. */
          parsed = value === "" ? "" : String(DOMPurify.sanitize(value, RICH_PURIFY_CONFIG));
          break;
      }
    } catch (e) {
      throw new Error(`Invalid value in "${key}": ${(e as Error).message}`);
    }
    return {
      key,
      value: parsed as object,
      updated_by: user.user!.id,
      updated_at: new Date().toISOString(),
    };
  });

  try {
    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });
    if (error) return { error: error.message };
  } catch (e) {
    return { error: (e as Error).message };
  }

  PUBLIC_PATHS_TO_REVALIDATE.forEach((p) => revalidatePath(p));
  revalidatePath("/admin/pages");
  await Actions.settingsUpdate(rows.map((r) => r.key));
  return { ok: true, saved: rows.length };
}
