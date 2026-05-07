"use server";

/* Student profile self-service. RLS profiles_self_update gates the
   write at the DB; the lock_privileged_columns trigger from migration
   0004 ensures students can't escalate role/status/batch_id even if
   they craft a malicious form post.

   The profiles table only has a handful of "safe" columns; richer
   fields (address, emergency contact) live inside the `metadata` jsonb
   so the schema doesn't need a migration every time the form grows. */

import { revalidatePath } from "next/cache";
import { createClient } from "../../../lib/supabase/server";
import { getCurrentUser } from "../../../lib/auth/current-user";

export type SaveProfileResult = { ok: true } | { error: string };

function fld(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

export async function saveProfile(formData: FormData): Promise<SaveProfileResult> {
  const me = await getCurrentUser();
  if (!me) return { error: "Sign in required." };

  const supabase = await createClient();

  const fullName = fld(formData, "full_name");
  if (!fullName) return { error: "নাম আবশ্যক।" };
  if (fullName.length > 100) return { error: "নাম খুব দীর্ঘ।" };

  const phone = fld(formData, "phone") || null;
  const whatsapp = fld(formData, "whatsapp") || null;
  const city = fld(formData, "city") || null;
  const dob = fld(formData, "date_of_birth") || null;

  /* Read current metadata so we don't blow away unrelated keys when
     merging the form-submitted extras. */
  const { data: existing } = await supabase
    .from("profiles")
    .select("metadata")
    .eq("id", me.id)
    .maybeSingle();

  const currentMeta = (existing?.metadata as Record<string, unknown>) ?? {};
  const newMeta: Record<string, unknown> = {
    ...currentMeta,
    address: fld(formData, "address") || null,
    father_name: fld(formData, "father_name") || null,
    emergency_contact_name: fld(formData, "emergency_name") || null,
    emergency_contact_phone: fld(formData, "emergency_phone") || null,
  };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone,
      whatsapp,
      city,
      date_of_birth: dob,
      metadata: newMeta,
    })
    .eq("id", me.id);

  if (error) return { error: error.message };

  revalidatePath("/student-dashboard/profile");
  revalidatePath("/student-dashboard");
  return { ok: true };
}
