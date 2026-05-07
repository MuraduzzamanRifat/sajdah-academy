import type { Metadata } from "next";
import Link from "next/link";
import { Plus, FileText, Calendar, User, AlertCircle } from "lucide-react";
import { createClient } from "../../../lib/supabase/server";
import PostRowActions from "./_components/PostRowActions";

export const metadata: Metadata = {
  title: "Admin · Blog",
  alternates: { canonical: "/admin/blog/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  author: string | null;
  reading_minutes: number | null;
  published_at: string | null;
  is_published: boolean;
};

const categoryTone: Record<string, string> = {
  Methodology: "bg-blue-100 text-blue-700",
  Spiritual: "bg-emerald-100 text-emerald-700",
  Story: "bg-amber-100 text-amber-700",
  Practice: "bg-purple-100 text-purple-700",
  Guidance: "bg-purple-100 text-purple-700",
};

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, category, author, reading_minutes, published_at, is_published")
    .order("published_at", { ascending: false, nullsFirst: false });

  const posts = (data ?? []) as PostRow[];
  const categories = new Set(posts.map((p) => p.category).filter(Boolean));
  const avgReading = posts.length
    ? Math.round(posts.reduce((s, p) => s + (p.reading_minutes ?? 0), 0) / posts.length)
    : 0;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950">{posts.length} টি পোস্ট</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {posts.filter((p) => p.is_published).length} প্রকাশিত · গড় পঠন: {avgReading} মিনিট · {categories.size} বিভাগ
          </p>
        </div>
        <Link
          href="/admin/blog/new/"
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
        >
          <Plus className="w-3.5 h-3.5" /> নতুন পোস্ট
        </Link>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-700">{error.message}</p>
        </div>
      )}

      {posts.length === 0 && !error && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-sm font-bold text-slate-700">এখনো কোনো পোস্ট নেই</p>
          <p className="text-xs text-slate-500 mt-1">
            <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">0002_seed_data.sql</code> চালান অথবা নিচের বাটন দিয়ে লিখুন।
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-4">
          {posts.map((p) => (
            <article key={p.id} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {p.category && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${categoryTone[p.category] ?? "bg-slate-100 text-slate-600"}`}>
                        {p.category}
                      </span>
                    )}
                    <span className={`text-[10px] border px-2 py-0.5 rounded ${
                      p.is_published
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}>
                      {p.is_published ? "প্রকাশিত" : "খসড়া"}
                    </span>
                  </div>
                  <h3 className="font-bold text-emerald-950 leading-tight mt-2">{p.title}</h3>
                  {p.excerpt && <p className="text-xs text-slate-600 leading-relaxed mt-1.5 line-clamp-2">{p.excerpt}</p>}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                {p.author && (
                  <span className="inline-flex items-center gap-1">
                    <User className="w-3 h-3" /> {p.author}
                  </span>
                )}
                {p.published_at && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(p.published_at).toLocaleDateString("en-GB")}
                  </span>
                )}
                {p.reading_minutes && <span>{p.reading_minutes} মিনিট পঠন</span>}
                <code className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{p.slug}</code>
              </div>

              <div className="flex justify-end items-center gap-2 mt-3">
                <PostRowActions id={p.id} slug={p.slug} title={p.title} isPublished={p.is_published} />
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="text-xs text-emerald-700 text-center font-bold">
        ✓ Live data from Supabase · {posts.length} posts
      </p>
    </div>
  );
}
