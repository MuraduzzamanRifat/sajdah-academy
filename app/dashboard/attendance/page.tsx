import type { Metadata } from "next";
import { CheckCircle2, XCircle, AlertCircle, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Attendance — উপস্থিতি",
  alternates: { canonical: "/sajdah-academy/dashboard/attendance/" },
  robots: { index: false, follow: false },
};

const log = [
  { date: "১৭ মে শুক্রবার", batch: "Block 4 — Hadith Module", status: "present", note: "চারটি ক্লাসই উপস্থিত" },
  { date: "১৬ মে বৃহস্পতিবার", batch: "Block 4 — Hadith Module", status: "present", note: "Class-1 উপস্থিত" },
  { date: "১০ মে শুক্রবার", batch: "Block 3 — Aqidah Module", status: "present", note: "" },
  { date: "৯ মে বৃহস্পতিবার", batch: "Block 3 — Aqidah Module", status: "late", note: "৩০ মিনিট দেরি" },
  { date: "৩ মে শুক্রবার", batch: "Block 2 — Quran Module", status: "absent", note: "অনুমোদিত — পরিবারের কারণে" },
  { date: "২ মে বৃহস্পতিবার", batch: "Block 2 — Quran Module", status: "present", note: "" },
  { date: "২৬ এপ্রিল শুক্রবার", batch: "Block 1 — Foundation", status: "present", note: "" },
  { date: "২৫ এপ্রিল বৃহস্পতিবার", batch: "Block 1 — Foundation", status: "present", note: "" },
];

const moduleAttendance = [
  { module: "Iman & Aqidah", classes: 4, present: 4, percent: 100 },
  { module: "Quranul Kareem", classes: 4, present: 3, percent: 75 },
  { module: "Hadith e Mubarakah", classes: 2, present: 2, percent: 100 },
  { module: "Fiqh-1 (তাহারাত)", classes: 3, present: 3, percent: 100 },
];

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  present: { icon: <CheckCircle2 className="w-4 h-4" />, color: "text-emerald-700 bg-emerald-100", label: "উপস্থিত" },
  late: { icon: <AlertCircle className="w-4 h-4" />, color: "text-amber-700 bg-amber-100", label: "দেরি" },
  absent: { icon: <XCircle className="w-4 h-4" />, color: "text-rose-700 bg-rose-100", label: "অনুপস্থিত" },
};

export default function AttendancePage() {
  const total = log.length;
  const present = log.filter((l) => l.status === "present").length;
  const percent = Math.round((present / total) * 100);
  const requirementMet = percent >= 80;

  return (
    <div className="space-y-4">
        <div className={`rounded-2xl p-6 ${requirementMet ? "bg-emerald-900" : "bg-amber-700"} text-white`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-200 font-bold mb-1">
                সামগ্রিক উপস্থিতি
              </p>
              <div className="text-5xl font-bold leading-none mt-1">{percent}%</div>
              <p className="text-sm text-emerald-100 mt-2">
                {present} of {total} ক্লাসে উপস্থিত
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold mb-1">
                {requirementMet ? "✓ সার্টিফিকেট যোগ্য" : "⚠ সার্টিফিকেট ঝুঁকিতে"}
              </p>
              <p className="text-xs text-emerald-200">সার্টিফিকেটের জন্য প্রয়োজন: ৮০%+</p>
            </div>
          </div>
          <div className="relative mt-4">
            <div className="h-2 bg-emerald-950/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="absolute top-0 w-0.5 h-2 bg-white" style={{ left: "80%" }} />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h3 className="font-bold text-emerald-950 mb-4">মডিউল অনুযায়ী</h3>
          <div className="space-y-3">
            {moduleAttendance.map((m) => (
              <div key={m.module}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-emerald-950">{m.module}</span>
                  <span className="text-xs text-slate-600 font-mono">
                    {m.present}/{m.classes} · {m.percent}%
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      m.percent >= 80 ? "bg-emerald-600" : m.percent >= 60 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${m.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-950 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" /> বিস্তারিত লগ
            </h3>
            <span className="text-xs text-slate-500">গত ৪ সপ্তাহ</span>
          </div>
          <div className="space-y-2">
            {log.map((l, i) => {
              const cfg = statusConfig[l.status];
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cfg.color} shrink-0`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-emerald-950">{l.date}</p>
                    <p className="text-xs text-slate-500">{l.batch}</p>
                    {l.note && <p className="text-[11px] text-slate-400 mt-0.5">{l.note}</p>}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <h3 className="font-bold text-emerald-950 mb-2">আগাম অনুপস্থিতি জানাতে চান?</h3>
          <p className="text-sm text-emerald-800 mb-4 leading-relaxed">
            জরুরি বা পারিবারিক কারণে কোনো ক্লাসে উপস্থিত থাকতে পারবেন না? কমপক্ষে ২৪ ঘণ্টা আগে
            মেন্টরকে জানান।
          </p>
          <button
            type="button"
            disabled
            className="px-5 py-2.5 bg-emerald-700 text-white font-bold text-sm rounded-lg opacity-60 cursor-not-allowed"
          >
            অনুপস্থিতির অনুরোধ পাঠান (Preview)
          </button>
        </div>
    </div>
  );
}
