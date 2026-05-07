import type { Metadata } from "next";
import Link from "next/link";
import { Plus, GripVertical, AlertCircle } from "lucide-react";
import { createClient } from "../../../lib/supabase/server";
import RowActions from "./_components/RowActions";

export const metadata: Metadata = {
  title: "Admin · Courses",
  alternates: { canonical: "/admin/courses/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  title_bn: string | null;
  phase: "Foundation" | "Understanding" | "Transformation";
  duration: string | null;
  summary: string | null;
  topics: string[] | null;
  module_number: number | null;
  is_published: boolean;
  display_order: number;
};

const phaseTone: Record<string, string> = {
  Foundation: "bg-emerald-100 text-emerald-700",
  Understanding: "bg-amber-100 text-amber-700",
  Transformation: "bg-purple-100 text-purple-700",
};
const PHASES = ["Foundation", "Understanding", "Transformation"] as const;

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, title_bn, phase, duration, summary, topics, module_number, is_published, display_order")
    .order("display_order", { ascending: true });

  const courses = (data ?? []) as CourseRow[];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950">{courses.length} টি মডিউল</h2>
          <p className="text-xs text-slate-500 mt-0.5">৩ ফেইজ · {courses.filter((c) => c.is_published).length} প্রকাশিত · {courses.filter((c) => !c.is_published).length} খসড়া</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/courses/new/"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" /> নতুন মডিউল
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-rose-900">কোর্স লোড করতে সমস্যা</p>
            <p className="text-xs text-rose-700 mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {courses.length === 0 && !error && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-sm font-bold text-slate-700">এখনো কোনো কোর্স নেই</p>
          <p className="text-xs text-slate-500 mt-1">
            <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">supabase/migrations/0002_seed_data.sql</code> চালান অথবা নিচের বাটন দিয়ে যোগ করুন।
          </p>
        </div>
      )}

      {PHASES.map((phase) => {
        const phaseModules = courses.filter((m) => m.phase === phase);
        if (phaseModules.length === 0) return null;
        return (
          <section key={phase} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${phaseTone[phase]}`}>
                  {phase}
                </span>
                <span className="text-xs text-slate-500">{phaseModules.length} মডিউল</span>
              </div>
              <Link
                href={`/admin/courses/new/?phase=${encodeURIComponent(phase)}`}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
              >
                + এই ফেইজে মডিউল
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {phaseModules.map((m) => (
                <div key={m.slug} className="px-5 py-4 hover:bg-slate-50 flex items-start gap-4">
                  <button
                    type="button"
                    className="text-slate-300 hover:text-slate-500 cursor-grab mt-1"
                    aria-label="Reorder"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {String(m.module_number ?? 0).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-emerald-950 leading-tight">{m.title}</h4>
                      {m.title_bn && <span className="text-xs text-slate-500">· {m.title_bn}</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {m.duration} · slug: <code className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded">{m.slug}</code>
                    </p>
                    {m.summary && <p className="text-xs text-slate-700 leading-relaxed mt-2 line-clamp-2">{m.summary}</p>}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(m.topics ?? []).slice(0, 4).map((t) => (
                        <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                      {(m.topics?.length ?? 0) > 4 && (
                        <span className="text-[10px] text-slate-500">+{(m.topics?.length ?? 0) - 4} আরো</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] border px-2 py-0.5 rounded ${
                      m.is_published
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}>
                      {m.is_published ? "প্রকাশিত" : "খসড়া"}
                    </span>
                    <RowActions id={m.id} slug={m.slug} title={m.title} isPublished={m.is_published} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-xs text-emerald-700 text-center font-bold">
        ✓ Live data from Supabase · {courses.length} courses
      </p>
    </div>
  );
}
