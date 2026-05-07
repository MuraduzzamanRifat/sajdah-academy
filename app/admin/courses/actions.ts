"use server";

/* Course CRUD server actions. RLS already restricts writes to admin
   roles via courses_admin_write policy — these actions just pass
   through. We call revalidatePath on every public route that reads
   the courses table so changes appear instantly (rather than waiting
   on the 60s ISR window). */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { Actions } from "../../../lib/audit";

export type ActionResult = { ok: true } | { error: string };

const PHASES = ["Foundation", "Understanding", "Transformation"] as const;

function fld(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}
function fldArr(formData: FormData, name: string): string[] {
  return fld(formData, name)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function revalidateAll() {
  revalidatePath("/courses");
  revalidatePath("/courses/[slug]", "page");
  revalidatePath("/admin/courses");
  revalidatePath("/admin"); // overview KPIs
  revalidatePath("/"); // homepage curriculum block
}

export async function createCourse(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const slug = fld(formData, "slug").toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const title = fld(formData, "title");
  const phase = fld(formData, "phase");

  if (!slug) return { error: "Slug দিন (URL-friendly identifier)।" };
  if (!title) return { error: "Title দিন।" };
  if (!PHASES.includes(phase as (typeof PHASES)[number])) {
    return { error: "Phase: Foundation / Understanding / Transformation এর মধ্যে একটি হতে হবে।" };
  }

  const { data: created, error } = await supabase
    .from("courses")
    .insert({
      slug,
      title,
      title_bn: fld(formData, "title_bn") || null,
      phase,
      duration: fld(formData, "duration") || null,
      summary: fld(formData, "summary") || null,
      learning_outcomes: fldArr(formData, "learning_outcomes"),
      topics: fldArr(formData, "topics"),
      module_number: parseInt(fld(formData, "module_number"), 10) || null,
      display_order: parseInt(fld(formData, "display_order"), 10) || 0,
      is_published: formData.get("is_published") === "on",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  if (created) await Actions.courseCreate(created.id, { slug, title, phase });
  revalidateAll();
  redirect("/admin/courses/");
}

export async function updateCourse(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const title = fld(formData, "title");
  const phase = fld(formData, "phase");

  if (!title) return { error: "Title খালি রাখা যাবে না।" };
  if (!PHASES.includes(phase as (typeof PHASES)[number])) {
    return { error: "Phase invalid।" };
  }

  const { error } = await supabase
    .from("courses")
    .update({
      title,
      title_bn: fld(formData, "title_bn") || null,
      phase,
      duration: fld(formData, "duration") || null,
      summary: fld(formData, "summary") || null,
      learning_outcomes: fldArr(formData, "learning_outcomes"),
      topics: fldArr(formData, "topics"),
      module_number: parseInt(fld(formData, "module_number"), 10) || null,
      display_order: parseInt(fld(formData, "display_order"), 10) || 0,
      is_published: formData.get("is_published") === "on",
    })
    .eq("id", id);

  if (error) return { error: error.message };
  await Actions.courseUpdate(id, { title, phase });
  revalidateAll();
  redirect("/admin/courses/");
}

export async function togglePublish(id: string, currentlyPublished: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const next = !currentlyPublished;
  const { error } = await supabase
    .from("courses")
    .update({ is_published: next })
    .eq("id", id);
  if (error) return { error: error.message };
  await Actions.coursePublish(id, next);
  revalidateAll();
  return { ok: true };
}

export async function deleteCourse(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) return { error: error.message };
  await Actions.courseDelete(id);
  revalidateAll();
  return { ok: true };
}

export async function duplicateCourse(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: src, error: readErr } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();
  if (readErr || !src) return { error: readErr?.message ?? "মূল কোর্স পাওয়া যায়নি।" };

  const copy = {
    ...src,
    id: undefined,
    created_at: undefined,
    updated_at: undefined,
    slug: `${src.slug}-copy-${Date.now().toString(36)}`,
    title: `${src.title} (Copy)`,
    is_published: false,
  };
  delete (copy as Record<string, unknown>).id;
  delete (copy as Record<string, unknown>).created_at;
  delete (copy as Record<string, unknown>).updated_at;

  const { data: dup, error } = await supabase.from("courses").insert(copy).select("id").single();
  if (error) return { error: error.message };
  if (dup) await Actions.courseDuplicate(id, dup.id);
  revalidateAll();
  return { ok: true };
}
