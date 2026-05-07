"use server";

/* Blog post CRUD — defense in depth: requireAdmin() on every action,
   plus RLS posts_admin_write at the DB layer. Body HTML is sanitized
   server-side before persistence so the public reader can trust it. */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { createClient } from "../../../lib/supabase/server";
import { Actions } from "../../../lib/audit";
import { requireAdmin } from "../../../lib/auth/current-user";

export type ActionResult = { ok: true } | { error: string };

function fld(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function revalidateAll() {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/dashboard/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/");
}

function estimateReadingMinutes(body: string): number {
  const words = body.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9ঀ-৿\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

const PURIFY_CONFIG: Parameters<typeof DOMPurify.sanitize>[1] = {
  /* Tighter than the previous reader config — drop iframe (use Tiptap's
     youtube node which renders via React, not raw <iframe>), restrict
     URI schemes to http/https/mailto/tel only. Defense in depth: even
     if Tiptap inserts something weird, sanitization catches it. */
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[/#])/i,
  ADD_ATTR: ["target", "rel"],
  FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
  FORBID_ATTR: ["onerror", "onclick", "onload", "onmouseover", "onfocus"],
};

function sanitizeBody(html: string): string {
  if (!html) return "";
  return String(DOMPurify.sanitize(html, PURIFY_CONFIG));
}

export async function createPost(formData: FormData): Promise<ActionResult> {
  const me = await requireAdmin();
  if (!me) return { error: "Forbidden — admin access required." };

  const supabase = await createClient();
  const title = fld(formData, "title");
  const rawBody = fld(formData, "body");
  const body = sanitizeBody(rawBody);
  const userInputSlug = fld(formData, "slug");
  const slug = slugify(userInputSlug || title);

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
  redirect("/dashboard/blog/");
}

export async function updatePost(id: string, formData: FormData): Promise<ActionResult> {
  const me = await requireAdmin();
  if (!me) return { error: "Forbidden — admin access required." };

  const supabase = await createClient();
  const title = fld(formData, "title");
  const rawBody = fld(formData, "body");
  const body = sanitizeBody(rawBody);
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
  redirect("/dashboard/blog/");
}

export async function togglePublish(id: string, currentlyPublished: boolean): Promise<ActionResult> {
  const me = await requireAdmin();
  if (!me) return { error: "Forbidden — admin access required." };

  const supabase = await createClient();
  const next = !currentlyPublished;
  const { error } = await supabase.from("posts").update({ is_published: next }).eq("id", id);
  if (error) return { error: error.message };
  await Actions.postPublish(id, next);
  revalidateAll();
  return { ok: true };
}

export async function deletePost(id: string): Promise<ActionResult> {
  const me = await requireAdmin();
  if (!me) return { error: "Forbidden — admin access required." };

  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { error: error.message };
  await Actions.postDelete(id);
  revalidateAll();
  return { ok: true };
}
