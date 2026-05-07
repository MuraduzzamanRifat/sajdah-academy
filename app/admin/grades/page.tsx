import type { Metadata } from "next";
import { Download, Save, AlertCircle } from "lucide-react";
import ComingSoon from "../_components/ComingSoon";

export const metadata: Metadata = {
  title: "Admin · Grades",
  alternates: { canonical: "/admin/grades/" },
  robots: { index: false, follow: false },
};

const students = [
  { name: "Muhammad Ibrahim", id: "SA-2026-0418", quizzes: [88, 92, 94], midterm: 94, final: null, attendance: 93 },
  { name: "Abdul Hannan", id: "SA-2026-0419", quizzes: [85, 89, 90], midterm: 87, final: null, attendance: 88 },
  { name: "Sadman Khan", id: "SA-2025-0312", quizzes: [92, 95, 91], midterm: 95, final: 96, attendance: 100 },
  { name: "Yousuf Reza", id: "SA-2025-0314", quizzes: [60, 58, 62], midterm: 64, final: null, attendance: 65 },
  { name: "Imran Khalil", id: "SA-2025-0301", quizzes: [88, 90, 92], midterm: 91, final: 90, attendance: 95 },
  { name: "Mahdi Karim", id: "SA-2024-0210", quizzes: [95, 97, 96], midterm: 98, final: 97, attendance: 100 },
];

function avg(arr: number[]) {
  return Math.round(arr.reduce((s, q) => s + q, 0) / arr.length);
}
function letter(score: number | null) {
  if (score === null) return "—";
  if (score >= 95) return "A+";
  if (score >= 88) return "A";
  if (score >= 82) return "A-";
  if (score >= 78) return "B+";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}
function letterTone(g: string): string {
  if (g === "A+") return "bg-emerald-700 text-white";
  if (g.startsWith("A")) return "bg-emerald-100 text-emerald-700";
  if (g.startsWith("B")) return "bg-blue-100 text-blue-700";
  if (g === "C") return "bg-amber-100 text-amber-700";
  if (g === "D") return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-500";
}

export default function AdminGradesPage() {
  return (
    <div className="space-y-4">
      <ComingSoon body="স্কোর ইনপুট সংরক্ষণ / CSV এক্সপোর্ট / কম্পোজিট গ্রেড পার্সিস্টেন্স এখনো ব্যাকএন্ডে wired হয়নি।" />
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950">গ্রেডবুক · Iman & Aqidah</h2>
          <p className="text-xs text-slate-500 mt-0.5">ব্যাচ-৪ · ৩৮ ছাত্র · ৩ কুইজ + Midterm · Final অপেক্ষমাণ</p>
        </div>
        <div className="flex gap-2">
          <select defaultValue="iman" className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold">
            <option value="iman">Iman & Aqidah</option>
            <option>Hadith e Mubarakah</option>
            <option>Fiqh-2 (Ibadat)</option>
            <option>Quranul Kareem</option>
            <option>Tazkiya</option>
          </select>
          <select defaultValue="b4" className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold">
            <option value="b4">ব্যাচ-৪</option>
            <option>ব্যাচ-৩</option>
            <option>ব্যাচ-২</option>
          </select>
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold">
            <Download className="w-3 h-3" /> CSV
          </button>
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
            <Save className="w-3 h-3" /> সংরক্ষণ
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-2.5 font-bold">ছাত্র</th>
                <th className="text-center px-2 py-2.5 font-bold">Q1</th>
                <th className="text-center px-2 py-2.5 font-bold">Q2</th>
                <th className="text-center px-2 py-2.5 font-bold">Q3</th>
                <th className="text-center px-2 py-2.5 font-bold">গড়</th>
                <th className="text-center px-2 py-2.5 font-bold">Mid</th>
                <th className="text-center px-2 py-2.5 font-bold">Final</th>
                <th className="text-center px-2 py-2.5 font-bold">উপস্থিতি</th>
                <th className="text-right px-3 py-2.5 font-bold pr-5">Overall</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const qAvg = avg(s.quizzes);
                const composite = s.final !== null
                  ? Math.round(qAvg * 0.3 + s.midterm * 0.3 + s.final * 0.4)
                  : Math.round(qAvg * 0.5 + s.midterm * 0.5);
                const grade = letter(s.final !== null ? composite : null);
                return (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                    <td className="px-5 py-3">
                      <p className="text-xs font-bold text-emerald-950 leading-tight">{s.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{s.id}</p>
                    </td>
                    {s.quizzes.map((q, i) => (
                      <td key={i} className="px-2 py-3 text-center">
                        <input
                          type="number"
                          defaultValue={q}
                          className="w-12 text-center text-xs font-mono border border-slate-200 rounded px-1 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          aria-label={`Quiz ${i + 1} for ${s.name}`}
                        />
                      </td>
                    ))}
                    <td className="px-2 py-3 text-center text-xs font-mono font-bold text-emerald-950">{qAvg}</td>
                    <td className="px-2 py-3 text-center">
                      <input
                        type="number"
                        defaultValue={s.midterm}
                        className="w-12 text-center text-xs font-mono border border-slate-200 rounded px-1 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        aria-label={`Midterm for ${s.name}`}
                      />
                    </td>
                    <td className="px-2 py-3 text-center">
                      <input
                        type="number"
                        defaultValue={s.final ?? ""}
                        placeholder="—"
                        className="w-12 text-center text-xs font-mono border border-slate-200 rounded px-1 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        aria-label={`Final for ${s.name}`}
                      />
                    </td>
                    <td className="px-2 py-3 text-center">
                      <span className={`text-[11px] font-mono ${s.attendance >= 80 ? "text-emerald-700" : "text-rose-700"}`}>
                        {s.attendance}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right pr-5">
                      <span className={`inline-block text-xs font-bold px-2 py-1 rounded ${letterTone(grade)}`}>
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-900">Yousuf Reza এর গড় ৬৫% — সতর্ক করুন</p>
          <p className="text-xs text-amber-700 mt-1">
            ৭৫%-এর নিচে থাকলে সার্টিফিকেট অযোগ্য হবে। মেন্টর সংলাপ পাঠানোর জন্য{" "}
            <button type="button" className="font-bold underline">এখানে ক্লিক</button> করুন।
          </p>
        </div>
      </div>
    </div>
  );
}
