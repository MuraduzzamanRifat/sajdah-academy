import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { createClient } from "../../../../lib/supabase/server";

export const revalidate = 60;
export const dynamicParams = true;

type PostDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  category: string | null;
  author: string | null;
  reading_minutes: number | null;
  published_at: string | null;
};

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: p } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .maybeSingle();
  if (!p) return { title: "Post not found" };
  return {
    title: p.title,
    description: p.excerpt ?? undefined,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      type: "article",
      title: p.title,
      description: p.excerpt ?? undefined,
    },
  };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: p }, { data: relatedRaw }] = await Promise.all([
    supabase
      .from("posts")
      .select("id, slug, title, excerpt, body, category, author, reading_minutes, published_at")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle(),
    supabase
      .from("posts")
      .select("slug, title, category, excerpt")
      .eq("is_published", true)
      .neq("slug", slug)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(2),
  ]);

  if (!p) notFound();
  const post = p as PostDetail;
  const related = (relatedRaw ?? []) as Pick<PostDetail, "slug" | "title" | "category" | "excerpt">[];

  /* Body is HTML from the rich-text editor (Tiptap). Legacy posts may
     still be plain text with \n\n paragraph breaks — detect and convert.
     Sanitize either way before injecting into the DOM. */
  const isHtml = /<\/?[a-z][\s\S]*?>/i.test(post.body);
  const rawHtml = isHtml
    ? post.body
    : post.body
        .split(/\n\n+/)
        .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br>")}</p>`)
        .join("");

  const sanitizedBody = DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "scrolling",
      "target",
      "rel",
    ],
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|ftp|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });

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
          {post.category && (
            <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-xs mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-emerald-200">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at)}
              </span>
            )}
            {post.reading_minutes && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.reading_minutes} min read
              </span>
            )}
          </div>
        </div>
      </section>

      <article className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.excerpt && (
            <p className="text-xl text-emerald-900 leading-relaxed font-medium border-l-4 border-amber-500 pl-5 italic mb-8">
              {post.excerpt}
            </p>
          )}
          <div
            className="blog-prose"
            // Sanitized via DOMPurify above — safe to inject.
            dangerouslySetInnerHTML={{ __html: sanitizedBody }}
          />
        </div>
      </article>

      {related.length > 0 && (
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
                  {r.category && <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{r.category}</span>}
                  <h3 className="text-lg font-bold text-emerald-950 mt-2 mb-2 group-hover:text-emerald-700">
                    {r.title}
                  </h3>
                  {r.excerpt && <p className="text-sm text-slate-600 leading-relaxed">{r.excerpt}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
