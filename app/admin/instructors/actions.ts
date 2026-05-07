"use server";

/* Instructor (faculty) CRUD. RLS instructors_admin_write restricts
   writes to admin roles. Public /faculty + admin overview read this
   table; revalidatePath flushes both on every change. */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { Actions } from "../../../lib/audit";

export type ActionResult = { ok: true } | { error: string };

function fld(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function revalidateAll() {
  revalidatePath("/faculty");
  revalidatePath("/admin/instructors");
  revalidatePath("/admin");
}

export async function createInstructor(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const name = fld(formData, "name");
  if (!name) return { error: "নাম দিন।" };

  const ratingRaw = fld(formData, "rating");
  const rating = ratingRaw === "" ? null : Number(ratingRaw);
  if (rating !== null && (isNaN(rating) || rating < 0 || rating > 5)) {
    return { error: "Rating ০-৫ এর মধ্যে হতে হবে।" };
  }

  const { data: created, error } = await supabase
    .from("instructors")
    .insert({
      name,
      name_bn: fld(formData, "name_bn") || null,
      role_label: fld(formData, "role_label") || null,
      bio: fld(formData, "bio") || null,
      rating,
      is_guest: formData.get("is_guest") === "on",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  if (created) await Actions.instructorCreate(created.id, { name });
  revalidateAll();
  redirect("/admin/instructors/");
}

export async function updateInstructor(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const name = fld(formData, "name");
  if (!name) return { error: "নাম খালি রাখা যাবে না।" };

  const ratingRaw = fld(formData, "rating");
  const rating = ratingRaw === "" ? null : Number(ratingRaw);
  if (rating !== null && (isNaN(rating) || rating < 0 || rating > 5)) {
    return { error: "Rating ০-৫ এর মধ্যে হতে হবে।" };
  }

  const { error } = await supabase
    .from("instructors")
    .update({
      name,
      name_bn: fld(formData, "name_bn") || null,
      role_label: fld(formData, "role_label") || null,
      bio: fld(formData, "bio") || null,
      rating,
      is_guest: formData.get("is_guest") === "on",
    })
    .eq("id", id);

  if (error) return { error: error.message };
  await Actions.instructorUpdate(id, { name });
  revalidateAll();
  redirect("/admin/instructors/");
}

export async function deleteInstructor(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("instructors").delete().eq("id", id);
  if (error) return { error: error.message };
  await Actions.instructorDelete(id);
  revalidateAll();
  return { ok: true };
}
