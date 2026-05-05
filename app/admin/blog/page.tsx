import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Edit3, Eye, Trash2, FileText, Calendar, User } from "lucide-react";
import { posts } from "../../data/posts";

export const metadata: Metadata = {
  title: "Admin · Blog",
  alternates: { canonical: "/sajdah-academy/admin/blog/" },
  robots: { index: false, follow: false },
};

const categoryTone: Record<string, string> = {
  Methodology: "bg-blue-100 text-blue-700",
  Spiritual: "bg-emerald-100 text-emerald-700",
  Stories: "bg-amber-100 text-amber-700",
  Guidance: "bg-purple-100 text-purple-700",
};

export default function AdminBlogPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950">{posts.length} টি পোস্ট</h2>
          <p className="text-xs text-slate-500 mt-0.5">সব প্রকাশিত · গড় পঠন: ৬ মিনিট · {new Set(posts.map((p) => p.category)).size} বিভাগ</p>
        </div>
        <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
          <Plus className="w-3.5 h-3.5" /> নতুন পোস্ট
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {posts.map((p) => (
          <article key={p.slug} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${categoryTone[p.category] ?? "bg-slate-100 text-slate-600"}`}>
                    {p.category}
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded">
                    প্রকাশিত
                  </span>
                </div>
                <h3 className="font-bold text-emerald-950 leading-tight mt-2">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5 line-clamp-2">{p.excerpt}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
              <span className="inline-flex items-center gap-1">
                <User className="w-3 h-3" /> {p.author}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {new Date(p.date).toLocaleDateString("en-GB")}
              </span>
              <span>{p.readingMinutes} মিনিট পঠন</span>
              <code className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{p.slug}</code>
            </div>

            <div className="flex justify-between items-center gap-2 mt-3">
              <Link
                href={`/blog/${p.slug}/`}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
              >
                <Eye className="w-3 h-3" /> Live দেখুন
              </Link>
              <div className="flex gap-1">
                <button type="button" className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
        <h3 className="font-bold text-emerald-950 mb-2">সিঙ্গেল সোর্স অফ ট্রুথ</h3>
        <p className="text-xs text-emerald-800 leading-relaxed">
          ব্লগ পোস্টগুলো <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[10px]">app/data/posts.ts</code> থেকে আসে।
          এখান থেকে যা যোগ/সম্পাদনা করবেন, তা <strong>/blog/</strong>, <strong>/blog/[slug]/</strong>, এবং sitemap-এ
          একসাথে আপডেট হবে। MDX সাপোর্ট পরবর্তী রিলিজে।
        </p>
      </div>
    </div>
  );
}
