import type { Metadata } from "next";
import { Award, Download, Lock, CheckCircle2, Share2 } from "lucide-react";
import MedallionMark from "../../components/MedallionMark";

export const metadata: Metadata = {
  title: "Certificates — সার্টিফিকেট",
  alternates: { canonical: "/sajdah-academy/dashboard/certificates/" },
  robots: { index: false, follow: false },
};

const earned = [
  {
    title: "Foundation Phase Certificate",
    titleBn: "ফাউন্ডেশন ফেইজ সার্টিফিকেট",
    issuedOn: "১৫ মার্চ ২০২৬",
    grade: "A",
    refNum: "SA-CERT-2026-0418",
    modules: ["Iman & Aqidah", "Quranul Kareem", "Fiqh-1 (তাহারাত)"],
  },
];

const inProgress = {
  title: "Understanding Phase Certificate",
  titleBn: "আন্ডারস্ট্যান্ডিং ফেইজ সার্টিফিকেট",
  progress: 65,
  modules: [
    { name: "Hadith e Mubarakah", done: true },
    { name: "Serratul Anbiya", done: true },
    { name: "Usuwatun Hasanah ﷺ", done: false },
    { name: "Fiqh-2 (ইবাদাত)", done: false },
  ],
};

const upcoming = [
  {
    title: "Transformation Phase Certificate",
    titleBn: "ট্রান্সফরমেশন ফেইজ",
    requirement: "Phase 2 সম্পন্ন করার পর শুরু",
  },
  {
    title: "Full 6-Month Sajdah Diploma",
    titleBn: "পূর্ণাঙ্গ ৬ মাসের সিজদাহ ডিপ্লোমা",
    requirement: "তিনটি ফেইজ ও সমাপনী মূল্যায়ন",
  },
];

export default function CertificatesPage() {
  return (
    <div className="space-y-5">
        <section>
          <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">
            Earned · অর্জিত
          </h3>
          <div className="space-y-3">
            {earned.map((c) => (
              <article
                key={c.title}
                className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                  <MedallionMark size={160} className="w-full h-full" />
                </div>
                <div className="relative">
                  <Award className="w-12 h-12 text-amber-400 mb-4" />
                  <span className="text-amber-300 text-xs font-bold tracking-widest uppercase">
                    Certificate · Grade {c.grade}
                  </span>
                  <h4 className="text-2xl font-bold mt-1">{c.title}</h4>
                  <p className="text-emerald-200 text-sm mt-1">{c.titleBn}</p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-5 text-sm">
                    <div>
                      <p className="text-emerald-300 text-[10px] uppercase tracking-wider">Issued On</p>
                      <p className="text-white font-medium mt-0.5">{c.issuedOn}</p>
                    </div>
                    <div>
                      <p className="text-emerald-300 text-[10px] uppercase tracking-wider">Reference</p>
                      <p className="text-white font-mono text-xs mt-0.5">{c.refNum}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-emerald-300 text-[10px] uppercase tracking-wider mb-1">Modules</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.modules.map((m) => (
                        <span key={m} className="bg-emerald-700/50 border border-emerald-600 text-xs px-2 py-1 rounded-full">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-5">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm rounded-lg active:scale-[0.98]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-emerald-600 text-emerald-200 hover:bg-emerald-800 font-medium text-sm rounded-lg"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Share
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-emerald-600 text-emerald-200 hover:bg-emerald-800 font-medium text-sm rounded-lg"
                    >
                      Verify URL
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">
            In Progress · চলমান
          </h3>
          <article className="bg-white border-2 border-amber-300 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-amber-600 text-xs font-bold tracking-widest uppercase">
                  Working toward · {inProgress.progress}% complete
                </span>
                <h4 className="text-xl font-bold text-emerald-950 mt-1">{inProgress.title}</h4>
                <p className="text-slate-500 text-sm mt-0.5">{inProgress.titleBn}</p>
              </div>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
                style={{ width: `${inProgress.progress}%` }}
              />
            </div>
            <div className="space-y-2">
              {inProgress.modules.map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                      m.done ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {m.done ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">○</span>}
                  </div>
                  <span className={`text-sm ${m.done ? "text-emerald-950 font-medium" : "text-slate-500"}`}>
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>
        <section>
          <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">
            Upcoming · আসন্ন
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {upcoming.map((u) => (
              <article
                key={u.title}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 opacity-75"
              >
                <Lock className="w-7 h-7 text-slate-400 mb-3" />
                <h4 className="font-bold text-slate-700 leading-tight">{u.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5 mb-3">{u.titleBn}</p>
                <p className="text-xs text-slate-600 italic">{u.requirement}</p>
              </article>
            ))}
          </div>
        </section>
    </div>
  );
}
