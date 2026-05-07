"use server";

/* Blog post CRUD — same pattern as courses. RLS posts_admin_write
   restricts to admin roles. revalidatePath flushes the public /blog
   cache so edits appear immediately. */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { Actions } from "../../../lib/audit";

export type ActionResult = { ok: true } | { error: string };

function fld(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function revalidateAll() {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/admin/blog");
  revalidatePath("/");
}

function estimateReadingMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9ঀ-৿\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function createPost(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const title = fld(formData, "title");
  const body = fld(formData, "body");
  const userInputSlug = fld(formData, "slug");
  const slug = userInputSlug || slugify(title);

  if (!title) return { error: "Title দিন।" };
  if (!body) return { error: "Body দিন।" };
  if (!slug) return { error: "Slug auto-generate ব্যর্থ হয়েছে — manually লিখুন।" };

  const { data: created, error } = await supabase
    .from("posts")
    .insert({
      slug,
      title,
      excerpt: fld(formData, "excerpt") || null,
      body,
      category: fld(formData, "category") || null,
      author: fld(formData, "author") || null,
      reading_minutes: parseInt(fld(formData, "reading_minutes"), 10) || estimateReadingMinutes(body),
      published_at: fld(formData, "published_at") || new Date().toISOString().slice(0, 10),
      is_published: formData.get("is_published") === "on",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  if (created) await Actions.postCreate(created.id, { slug, title });
  revalidateAll();
  redirect("/admin/blog/");
}

export async function updatePost(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const title = fld(formData, "title");
  const body = fld(formData, "body");
  if (!title) return { error: "Title খালি রাখা যাবে না।" };
  if (!body) return { error: "Body খালি রাখা যাবে না।" };

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      excerpt: fld(formData, "excerpt") || null,
      body,
      category: fld(formData, "category") || null,
      author: fld(formData, "author") || null,
      reading_minutes: parseInt(fld(formData, "reading_minutes"), 10) || estimateReadingMinutes(body),
      published_at: fld(formData, "published_at") || null,
      is_published: formData.get("is_published") === "on",
    })
    .eq("id", id);

  if (error) return { error: error.message };
  await Actions.postUpdate(id, { title });
  revalidateAll();
  redirect("/admin/blog/");
}

export async function togglePublish(id: string, currentlyPublished: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const next = !currentlyPublished;
  const { error } = await supabase.from("posts").update({ is_published: next }).eq("id", id);
  if (error) return { error: error.message };
  await Actions.postPublish(id, next);
  revalidateAll();
  return { ok: true };
}

export async function deletePost(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { error: error.message };
  await Actions.postDelete(id);
  revalidateAll();
  return { ok: true };
}
