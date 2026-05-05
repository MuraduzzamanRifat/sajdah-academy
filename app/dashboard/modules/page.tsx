import type { Metadata } from "next";
import Link from "next/link";
import { Play, FileText, ChevronRight } from "lucide-react";
import { modules } from "../../data/modules";
import MedallionMark from "../../components/MedallionMark";

export const metadata: Metadata = {
  title: "My Modules — আমার মডিউল",
  alternates: { canonical: "/sajdah-academy/dashboard/modules/" },
  robots: { index: false, follow: false },
};

const enrolledProgress: Record<string, number> = {
  "fa-firru-ilallah": 100,
  "iman-aqidah": 82,
  "quranul-kareem": 75,
  "hadith-mubarakah": 58,
  "serratul-anbiya": 42,
  "usuwatun-hasanah": 25,
  "fiqh-taharat": 100,
  "fiqh-ibadat": 34,
  "fiqh-muamalat": 0,
  "fiqh-muasharat": 0,
  "tawba-istegfar": 0,
  "tazkiya-islahun-nafs": 100,
};

export default function MyModulesPage() {
  return (
    <div className="space-y-3">
        {modules.map((m) => {
          const progress = enrolledProgress[m.slug] ?? 0;
          const status =
            progress === 100 ? "complete" : progress === 0 ? "locked" : progress < 40 ? "behind" : "active";
          return (
    <article key={m.slug} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 overflow-hidden">
                <MedallionMark size={36} className="w-9 h-9" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                      Module {String(m.id).padStart(2, "0")} · {m.phase}
                    </p>
                    <h4 className="font-bold text-emerald-950 leading-tight mt-0.5">{m.title}</h4>
                    <p className="text-xs text-slate-500">{m.titleBn} · {m.duration}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
                    status === "complete" ? "bg-emerald-100 text-emerald-700" :
                    status === "locked" ? "bg-slate-100 text-slate-500" :
                    status === "behind" ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {status === "complete" ? "সম্পন্ন" : status === "locked" ? "তালাবদ্ধ" : status === "behind" ? "পিছিয়ে" : "চলমান"}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{m.summary}</p>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        status === "complete" ? "bg-emerald-600" :
                        status === "behind" ? "bg-amber-500" :
                        "bg-blue-600"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-700 shrink-0 min-w-[36px] text-right">{progress}%</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link
                    href={`/courses/${m.slug}/`}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                  >
                    Syllabus <ChevronRight className="w-3 h-3" />
                  </Link>
                  <span className="text-slate-300">·</span>
                  <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1">
                    <Play className="w-3 h-3" /> Resume
                  </button>
                  <span className="text-slate-300">·</span>
                  <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Notes
                  </button>
                </div>
              </div>
            </article>
          );
        })}
    </div>
  );
}
