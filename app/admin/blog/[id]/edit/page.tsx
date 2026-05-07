import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { createClient } from "../../../../../lib/supabase/server";
import PostForm from "../../_components/PostForm";

export const metadata: Metadata = {
  title: "Admin · Edit Post",
  alternates: { canonical: "/admin/blog/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, body, category, author, reading_minutes, published_at, is_published")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          href="/dashboard/blog/"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeft className="w-3 h-3" /> সব পোস্ট
        </Link>
        <Link
          href={`/blog/${post.slug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900"
        >
          লাইভ পেজ <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h1 className="text-lg font-bold text-emerald-950">
          সম্পাদনা: <span className="text-emerald-700">{post.title}</span>
        </h1>
        <p className="text-xs text-slate-500 mb-5">
          slug: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{post.slug}</code>
        </p>
        <PostForm initial={post} mode="edit" />
      </div>
    </div>
  );
}
