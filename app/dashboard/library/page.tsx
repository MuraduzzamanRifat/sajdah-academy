import type { Metadata } from "next";
import { FileText, Play, BookOpen, Download, Headphones, Video } from "lucide-react";

export const metadata: Metadata = {
  title: "Library — রিসোর্স",
  alternates: { canonical: "/dashboard/library/" },
  robots: { index: false, follow: false },
};

const tabs = ["সকল", "ক্লাস নোট", "ভিডিও", "অডিও", "বই"];

const resources = [
  {
    type: "note",
    title: "Iman & Aqidah — Class-1 নোট",
    module: "Iman & Aqidah",
    instructor: "মাওলানা আবদুল্লাহ",
    size: "৪২ পৃষ্ঠা · PDF",
    format: "৩.২ MB",
  },
  {
    type: "video",
    title: "তাওহীদ ও শিরক — পূর্ণ ক্লাস",
    module: "Iman & Aqidah",
    instructor: "মাওলানা আবদুল্লাহ",
    size: "১:২৪:৩৬",
    format: "১২৪ MB · 720p",
  },
  {
    type: "audio",
    title: "Class-3 — Hadith অডিও রেকর্ডিং",
    module: "Hadith e Mubarakah",
    instructor: "মুফতি জাকারিয়া",
    size: "৫৬ মিনিট",
    format: "৩৪ MB · MP3",
  },
  {
    type: "book",
    title: "ফিকহ-২ — ইবাদাতের বিধান",
    module: "Fiqh-2",
    instructor: "Recommended Reading",
    size: "২৪০ পৃষ্ঠা",
    format: "৮.৫ MB · EPUB",
  },
  {
    type: "note",
    title: "Hadith — ২০টি নির্বাচিত হাদীস",
    module: "Hadith e Mubarakah",
    instructor: "মুফতি জাকারিয়া",
    size: "১৮ পৃষ্ঠা · PDF",
    format: "১.১ MB",
  },
  {
    type: "video",
    title: "Concentration in Salah — কর্মশালা",
    module: "Tazkiya",
    instructor: "ড. ইমরান হাসান",
    size: "৪২:১২",
    format: "৬৮ MB · 720p",
  },
  {
    type: "audio",
    title: "তাহাজ্জুদের ফজিলত — খুতবাহ",
    module: "Spiritual",
    instructor: "মাওলানা সাইফুল ইসলাম",
    size: "৩৪ মিনিট",
    format: "২২ MB · MP3",
  },
  {
    type: "book",
    title: "সিরাতে রাসূল ﷺ — মাক্কী যুগ",
    module: "Sirah",
    instructor: "Recommended Reading",
    size: "৪২০ পৃষ্ঠা",
    format: "১৫ MB · EPUB",
  },
  {
    type: "note",
    title: "Tazkiya — আত্মার ১০ ব্যাধি (সারসংক্ষেপ)",
    module: "Tazkiya",
    instructor: "ড. ইমরান হাসান",
    size: "১২ পৃষ্ঠা · PDF",
    format: "৭৪০ KB",
  },
];

const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  note: { icon: <FileText className="w-5 h-5" />, color: "bg-blue-100 text-blue-700", label: "নোট" },
  video: { icon: <Video className="w-5 h-5" />, color: "bg-rose-100 text-rose-700", label: "ভিডিও" },
  audio: { icon: <Headphones className="w-5 h-5" />, color: "bg-purple-100 text-purple-700", label: "অডিও" },
  book: { icon: <BookOpen className="w-5 h-5" />, color: "bg-amber-100 text-amber-700", label: "বই" },
};

export default function LibraryPage() {
  return (
    <div className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { count: "২৪", label: "ক্লাস নোট", color: "blue" },
            { count: "১৮", label: "ভিডিও", color: "rose" },
            { count: "৩১", label: "অডিও", color: "purple" },
            { count: "১২", label: "বই", color: "amber" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${
                s.color === "blue" ? "text-blue-700" :
                s.color === "rose" ? "text-rose-700" :
                s.color === "purple" ? "text-purple-700" : "text-amber-700"
              }`}>
                {s.count}
              </p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-1 flex gap-1 overflow-x-auto">
          {tabs.map((t, i) => (
            <button
              key={t}
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                i === 0
                  ? "bg-emerald-700 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r, i) => {
            const cfg = typeConfig[r.type];
            return (
              <article
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${cfg.color}`}>
                  {cfg.icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${cfg.color}`}>
                  {cfg.label}
                </span>
                <h4 className="font-bold text-emerald-950 mt-2 leading-snug">{r.title}</h4>
                <p className="text-xs text-amber-600 font-medium mt-1">{r.module}</p>
                <p className="text-xs text-slate-500 mt-1">{r.instructor}</p>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span>{r.size}</span>
                  <span>·</span>
                  <span>{r.format}</span>
                </div>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-bold transition-colors"
                >
                  {r.type === "video" || r.type === "audio" ? (
                    <>
                      <Play className="w-3 h-3" /> Play
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3" /> Download
                    </>
                  )}
                </button>
              </article>
            );
          })}
        </div>
    </div>
  );
}
