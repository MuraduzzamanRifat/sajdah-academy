import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Layers, Target, CheckCircle2 } from "lucide-react";
import { modules, getModuleBySlug } from "../../data/modules";

export const dynamic = "force-static";

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const m = getModuleBySlug(slug);
  if (!m) return { title: "Module not found" };
  return {
    title: `${m.title} — ${m.titleBn}`,
    description: m.summary,
    alternates: { canonical: `/sajdah-academy/courses/${m.slug}/` },
  };
}

export default async function ModulePage({ params }: Params) {
  const { slug } = await params;
  const m = getModuleBySlug(slug);
  if (!m) notFound();

  const idx = modules.findIndex((x) => x.slug === m.slug);
  const prev = idx > 0 ? modules[idx - 1] : null;
  const next = idx < modules.length - 1 ? modules[idx + 1] : null;

  return (
    <main className="pt-24 pb-24">
      {/* Hero */}
      <section className="bg-emerald-900 text-white py-16 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/courses/"
            className="inline-flex items-center gap-2 text-emerald-300 hover:text-amber-400 mb-6 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Courses
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="bg-amber-500 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Module {String(m.id).padStart(2, "0")}
            </span>
            <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full">
              Phase {modules.indexOf(m) < 3 ? "1" : modules.indexOf(m) < 7 ? "2" : "3"} · {m.phase}
            </span>
            <span className="text-emerald-300 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {m.duration}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">{m.title}</h1>
          <p className="text-2xl text-amber-300 mb-6">{m.titleBn}</p>
          <p className="text-lg text-emerald-100 leading-relaxed max-w-3xl">{m.summary}</p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-6">
          <div className="glass-light rounded-2xl p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-emerald-950">Learning Outcomes</h2>
            </div>
            <ul className="space-y-3">
              {m.learningOutcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-relaxed">{o}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-light rounded-2xl p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-emerald-950">Topics Covered</h2>
            </div>
            <ul className="space-y-3">
              {m.topics.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Prev / Next */}
      <section className="py-12 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 gap-4">
          {prev ? (
            <Link
              href={`/courses/${prev.slug}/`}
              className="glass-light glass-light-hover rounded-xl p-5 group"
            >
              <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <ArrowLeft className="w-3 h-3" />
                Previous Module
              </span>
              <p className="font-bold text-emerald-950 mt-2 group-hover:text-emerald-700">{prev.title}</p>
              <p className="text-sm text-slate-500">{prev.titleBn}</p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/courses/${next.slug}/`}
              className="glass-light glass-light-hover rounded-xl p-5 group sm:text-right"
            >
              <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2 sm:justify-end">
                Next Module
                <ArrowRight className="w-3 h-3" />
              </span>
              <p className="font-bold text-emerald-950 mt-2 group-hover:text-emerald-700">{next.title}</p>
              <p className="text-sm text-slate-500">{next.titleBn}</p>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-900 text-white relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">পূর্ণাঙ্গ ১২ মডিউল কোর্সে যোগ দিন</h2>
          <p className="text-emerald-100 mb-7">
            এই মডিউল সহ সম্পূর্ণ ৬ মাসের প্রোগ্রামে ভর্তি হতে পারেন।
          </p>
          <Link
            href="/enroll/"
            className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg active:scale-[0.98]"
          >
            Enroll Now →
          </Link>
        </div>
      </section>
    </main>
  );
}
