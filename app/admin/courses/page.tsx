import type { Metadata } from "next";
import { Plus, Edit3, Eye, Copy, Trash2, GripVertical } from "lucide-react";
import { modules } from "../../data/modules";

export const metadata: Metadata = {
  title: "Admin · Courses",
  alternates: { canonical: "/sajdah-academy/admin/courses/" },
  robots: { index: false, follow: false },
};

const phaseTone: Record<string, string> = {
  Foundation: "bg-emerald-100 text-emerald-700",
  Understanding: "bg-amber-100 text-amber-700",
  Transformation: "bg-purple-100 text-purple-700",
};

export default function AdminCoursesPage() {
  const phases = ["Foundation", "Understanding", "Transformation"] as const;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950">{modules.length} টি মডিউল</h2>
          <p className="text-xs text-slate-500 mt-0.5">৩ ফেইজ · ১২ মাস কার্যক্রম · সব ব্যাচে সক্রিয়</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold">
            ফেইজ পুনর্বিন্যাস
          </button>
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
            <Plus className="w-3.5 h-3.5" /> নতুন মডিউল
          </button>
        </div>
      </div>

      {phases.map((phase) => {
        const phaseModules = modules.filter((m) => m.phase === phase);
        return (
          <section key={phase} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${phaseTone[phase]}`}>
                  {phase}
                </span>
                <span className="text-xs text-slate-500">{phaseModules.length} মডিউল</span>
              </div>
              <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">
                + এই ফেইজে মডিউল
              </button>
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
                    {String(m.id).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-emerald-950 leading-tight">{m.title}</h4>
                      <span className="text-xs text-slate-500">· {m.titleBn}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {m.duration} · slug: <code className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded">{m.slug}</code>
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed mt-2 line-clamp-2">{m.summary}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {m.topics.slice(0, 4).map((t) => (
                        <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                      {m.topics.length > 4 && (
                        <span className="text-[10px] text-slate-500">+{m.topics.length - 4} আরো</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded">
                      প্রকাশিত
                    </span>
                    <div className="flex gap-1">
                      <button type="button" className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded" aria-label="View">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded" aria-label="Edit">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded" aria-label="Duplicate">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded" aria-label="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
        <h3 className="font-bold text-emerald-950 mb-2">সিঙ্গেল সোর্স অফ ট্রুথ</h3>
        <p className="text-xs text-emerald-800 leading-relaxed">
          এই মডিউলগুলো <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[10px]">app/data/modules.ts</code> থেকে আসে।
          এখান থেকে যা পরিবর্তন করবেন, তা <strong>/courses/</strong>, <strong>/courses/[slug]/</strong>, হোমপেইজের
          কারিকুলাম সেকশন, sitemap, এবং ছাত্রদের My Modules — সর্বত্র একসাথে আপডেট হবে।
        </p>
      </div>
    </div>
  );
}
