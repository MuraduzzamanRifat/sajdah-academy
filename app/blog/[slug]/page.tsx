import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { posts, getPostBySlug } from "../../data/posts";

export const dynamic = "force-static";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getPostBySlug(slug);
  if (!p) return { title: "Post not found" };
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/sajdah-academy/blog/${p.slug}/` },
    openGraph: { type: "article", title: p.title, description: p.excerpt },
  };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const p = getPostBySlug(slug);
  if (!p) notFound();

  const paragraphs = p.body.split(/\n\n+/);
  const related = posts.filter((x) => x.slug !== p.slug).slice(0, 2);

  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-16 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-3xl mx-auto relative z-10">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-2 text-emerald-300 hover:text-amber-400 mb-6 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Articles
          </Link>
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-xs mb-4">
            {p.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">{p.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-emerald-200">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {p.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(p.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {p.readingMinutes} min read
            </span>
          </div>
        </div>
      </section>

      <article className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-content space-y-6">
            <p className="text-xl text-emerald-900 leading-relaxed font-medium border-l-4 border-amber-500 pl-5 italic">
              {p.excerpt}
            </p>
            {paragraphs.map((para, i) => (
              <p key={i} className="text-slate-700 leading-relaxed text-lg">
                {para}
              </p>
            ))}
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-emerald-950 mb-6">আরও পড়ুন</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}/`}
                className="glass-light glass-light-hover rounded-2xl p-6 block group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
              >
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{r.category}</span>
                <h3 className="text-lg font-bold text-emerald-950 mt-2 mb-2 group-hover:text-emerald-700">
                  {r.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
