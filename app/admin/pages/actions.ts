"use server";

/* Bulk-upsert site_settings rows from a single admin form submission.
   Form field names ARE the setting keys. Values are interpreted by
   their declared type (string / number / boolean / json). On success
   every public path that consumes settings gets revalidated. */

import { revalidatePath } from "next/cache";
import { createClient } from "../../../lib/supabase/server";

export type SaveResult = { ok: true; saved: number } | { error: string };

const PUBLIC_PATHS_TO_REVALIDATE = [
  "/",
  "/about",
  "/contact",
  "/faq",
  "/courses",
  "/enroll",
  "/blog",
];

export async function saveSettings(
  fields: { key: string; type: "string" | "number" | "boolean" | "json"; value: string }[]
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
      }
    } catch (e) {
      throw new Error(`Invalid JSON in "${key}": ${(e as Error).message}`);
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
  return { ok: true, saved: rows.length };
}
