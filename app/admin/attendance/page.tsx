import type { Metadata } from "next";
import { Save, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import ComingSoon from "../_components/ComingSoon";

export const metadata: Metadata = {
  title: "Admin · Attendance",
  alternates: { canonical: "/admin/attendance/" },
  robots: { index: false, follow: false },
};

const students = [
  { name: "Muhammad Ibrahim", id: "SA-2026-0418", overall: 93 },
  { name: "Abdul Hannan", id: "SA-2026-0419", overall: 88 },
  { name: "Sadman Khan", id: "SA-2025-0312", overall: 100 },
  { name: "Yousuf Reza", id: "SA-2025-0314", overall: 65 },
  { name: "Imran Khalil", id: "SA-2025-0301", overall: 95 },
  { name: "Mahdi Karim", id: "SA-2024-0210", overall: 100 },
  { name: "Tariq Aziz", id: "SA-2026-0420", overall: 0 },
  { name: "Fardin Hossain", id: "SA-2026-0421", overall: 0 },
];

const states = ["P", "L", "A", "—"] as const;
const stateLabel: Record<string, string> = {
  P: "উপস্থিত",
  L: "দেরি",
  A: "অনুপস্থিত",
  "—": "—",
};
const stateTone: Record<string, string> = {
  P: "bg-emerald-600 text-white",
  L: "bg-amber-500 text-white",
  A: "bg-rose-500 text-white",
  "—": "bg-slate-200 text-slate-500",
};

export default function AdminAttendancePage() {
  // Pre-pick deterministic states for preview
  const today = students.map((_, i) => states[i % 4]);

  return (
    <div className="space-y-4">
      <ComingSoon body="P/L/A মার্কিং সংরক্ষণ এখনো ব্যাকএন্ডে wired হয়নি — ক্লিক করলেও ডেটা স্থায়ী হবে না।" />
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950 inline-flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" /> উপস্থিতি · শুক্রবার ১০ মে ২০২৬
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Class-3 Hadith · ৬:৩০ AM · ৯০ মিনিট</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select defaultValue="b4" className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold">
            <option value="b4">ব্যাচ-৪</option>
            <option>ব্যাচ-৩</option>
          </select>
          <select defaultValue="c3" className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold">
            <option value="c3">Class-3 Hadith</option>
            <option>Class-2 Tahajjud</option>
            <option>Class-4 Fiqh-2</option>
            <option>Class-5 Tazkiyah</option>
          </select>
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
            <Save className="w-3.5 h-3.5" /> সংরক্ষণ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={<CheckCircle2 className="w-4 h-4" />} value={`${today.filter((t) => t === "P").length}`} label="উপস্থিত" tone="emerald" />
        <Stat icon={<AlertCircle className="w-4 h-4" />} value={`${today.filter((t) => t === "L").length}`} label="দেরি" tone="amber" />
        <Stat icon={<AlertCircle className="w-4 h-4" />} value={`${today.filter((t) => t === "A").length}`} label="অনুপস্থিত" tone="rose" />
        <Stat icon={<Calendar className="w-4 h-4" />} value={`${today.filter((t) => t === "—").length}`} label="মার্ক করা হয়নি" tone="slate" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-emerald-950">৩৮ ছাত্র</h3>
          <div className="flex gap-1.5 text-[10px]">
            {(["P", "L", "A", "—"] as const).map((s) => (
              <span key={s} className={`px-2 py-0.5 rounded font-bold ${stateTone[s]}`}>
                {s} = {stateLabel[s]}
              </span>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {students.map((s, i) => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-3 w-8 text-[10px] text-slate-400 font-mono">{i + 1}</td>
                <td className="py-3">
                  <p className="text-xs font-bold text-emerald-950 leading-tight">{s.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{s.id}</p>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">গড়:</span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        s.overall >= 80 ? "text-emerald-700" : s.overall >= 60 ? "text-amber-700" : s.overall === 0 ? "text-slate-400" : "text-rose-700"
                      }`}
                    >
                      {s.overall === 0 ? "—" : `${s.overall}%`}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-1">
                    {(["P", "L", "A"] as const).map((opt) => {
                      const active = today[i] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
                            active ? stateTone[opt] : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                          aria-label={`Mark ${stateLabel[opt]}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: "emerald" | "amber" | "rose" | "slate";
}) {
  const map = {
    emerald: { bg: "bg-emerald-100", fg: "text-emerald-700" },
    amber: { bg: "bg-amber-100", fg: "text-amber-700" },
    rose: { bg: "bg-rose-100", fg: "text-rose-700" },
    slate: { bg: "bg-slate-100", fg: "text-slate-500" },
  };
  const t = map[tone];
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg ${t.bg} ${t.fg} flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <div className="text-lg font-bold text-emerald-950 leading-none">{value}</div>
        <div className="text-[11px] text-slate-500 mt-1">{label}</div>
      </div>
    </div>
  );
}
