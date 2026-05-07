import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { createClient } from "../../../lib/supabase/server";

const title = "Blog — আর্টিকেল";
const description =
  "Sajdah Academy ব্লগ — দ্বীনি জ্ঞান, অভ্যাস গঠন, ও প্রাক্তন অংশগ্রহণকারীদের গল্প।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog/" },
};

export const revalidate = 60;

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  author: string | null;
  reading_minutes: number | null;
  published_at: string | null;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default async function BlogIndex() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, category, author, reading_minutes, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  const posts = (data ?? []) as PostRow[];
  const [featured, ...rest] = posts;

  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            Blog · আর্টিকেল
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">দ্বীনি জ্ঞান ও অনুপ্রেরণা</h1>
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">
            অভ্যাস গঠন, আত্মার পথ, প্রাক্তন অংশগ্রহণকারীদের গল্প — Sajdah Academy থেকে।
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {posts.length === 0 ? (
            <p className="text-center text-slate-500 py-16">নতুন পোস্ট শীঘ্রই আসছে।</p>
          ) : (
            <>
              {featured && (
                <Link
                  href={`/blog/${featured.slug}/`}
                  className="group block glass-light glass-light-hover rounded-3xl p-8 md:p-10 mb-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
                >
                  <div className="grid md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-2">
                      {featured.category && (
                        <span className="inline-block bg-amber-500 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                          Featured · {featured.category}
                        </span>
                      )}
                      <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-3 leading-tight group-hover:text-emerald-700 transition-colors">
                        {featured.title}
                      </h2>
                      {featured.excerpt && <p className="text-slate-700 leading-relaxed mb-4">{featured.excerpt}</p>}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        {featured.published_at && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" /> {formatDate(featured.published_at)}
                          </span>
                        )}
                        {featured.reading_minutes && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> {featured.reading_minutes} min read
                          </span>
                        )}
                        {featured.author && <span>· {featured.author}</span>}
                      </div>
                    </div>
                    <div className="hidden md:flex items-center justify-end">
                      <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                        <ArrowRight className="w-8 h-8" />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}/`}
                    className="group glass-light glass-light-hover rounded-2xl p-6 block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
                  >
                    {p.category && <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{p.category}</span>}
                    <h3 className="text-lg font-bold text-emerald-950 leading-tight mt-2 mb-2 group-hover:text-emerald-700 transition-colors">
                      {p.title}
                    </h3>
                    {p.excerpt && <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">{p.excerpt}</p>}
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-4 border-t border-slate-200/60">
                      {p.published_at && (
                        <>
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(p.published_at)}</span>
                          <span>·</span>
                        </>
                      )}
                      {p.reading_minutes && (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{p.reading_minutes} min</span>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-12 bg-emerald-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <BookOpen className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-emerald-950 mb-3">নতুন আর্টিকেলের আপডেট পান</h2>
          <p className="text-slate-600 mb-6">আমাদের WhatsApp ব্রডকাস্টে যুক্ত হোন।</p>
          <a
            href="https://wa.me/880180556544"
            className="inline-block px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg active:scale-[0.98]"
          >
            Join Updates
          </a>
        </div>
      </section>
    </main>
  );
}
