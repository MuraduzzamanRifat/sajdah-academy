import type { Metadata } from "next";
import { TrendingUp, Award } from "lucide-react";
import DashboardShell from "../_components/DashboardShell";

export const metadata: Metadata = {
  title: "Grades — মূল্যায়ন",
  alternates: { canonical: "/sajdah-academy/dashboard/grades/" },
  robots: { index: false, follow: false },
};

const grades = [
  { module: "Iman & Aqidah", quizzes: [88, 92, 94], midterm: 94, final: null, overall: "A" },
  { module: "Quranul Kareem", quizzes: [85, 89], midterm: 87, final: null, overall: "A-" },
  { module: "Hadith e Mubarakah", quizzes: [82, 87], midterm: null, final: null, overall: "B+" },
  { module: "Fiqh-1 (তাহারাত)", quizzes: [90, 91, 88], midterm: 91, final: 93, overall: "A" },
  { module: "Fiqh-2 (ইবাদাত)", quizzes: [76], midterm: null, final: null, overall: "B" },
  { module: "Tazkiya (Islahun Nafs)", quizzes: [95, 93, 96, 94], midterm: 95, final: 96, overall: "A+" },
];

const overallGPA = 3.72;
const batchAverage = 3.45;

const gradeColor: Record<string, string> = {
  "A+": "bg-emerald-700 text-white",
  A: "bg-emerald-100 text-emerald-700",
  "A-": "bg-emerald-100 text-emerald-700",
  "B+": "bg-blue-100 text-blue-700",
  B: "bg-amber-100 text-amber-700",
  "B-": "bg-amber-100 text-amber-700",
  C: "bg-rose-100 text-rose-700",
};

export default function GradesPage() {
  return (
    <DashboardShell title="মূল্যায়ন · Grades">
      <div className="space-y-4">
        {/* Overall */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="bg-emerald-900 text-white rounded-2xl p-5">
            <Award className="w-6 h-6 text-amber-400 mb-3" />
            <p className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">সামগ্রিক GPA</p>
            <p className="text-4xl font-bold mt-1">{overallGPA}</p>
            <p className="text-xs text-emerald-200 mt-2">৪.০০ এর মধ্যে</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <TrendingUp className="w-6 h-6 text-emerald-600 mb-3" />
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">ব্যাচ গড়</p>
            <p className="text-4xl font-bold text-slate-700 mt-1">{batchAverage}</p>
            <p className="text-xs text-emerald-600 mt-2">আপনি গড়ের চেয়ে ভালো</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">র‍্যাঙ্কিং</p>
            <p className="text-4xl font-bold text-amber-700 mt-3">৭ম</p>
            <p className="text-xs text-slate-500 mt-2">৪০ জনের মধ্যে</p>
          </div>
        </div>

        {/* Per-module breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 overflow-hidden">
          <h3 className="font-bold text-emerald-950 mb-4">মডিউল অনুযায়ী বিস্তারিত</h3>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="pb-3 font-medium">Module</th>
                  <th className="pb-3 font-medium text-center">Quiz Avg</th>
                  <th className="pb-3 font-medium text-center">Mid-term</th>
                  <th className="pb-3 font-medium text-center">Final</th>
                  <th className="pb-3 font-medium text-right">Overall</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => {
                  const quizAvg = g.quizzes.length
                    ? Math.round(g.quizzes.reduce((s, q) => s + q, 0) / g.quizzes.length)
                    : null;
                  return (
                    <tr key={g.module} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 font-medium text-emerald-950">{g.module}</td>
                      <td className="py-3 text-center text-slate-700 font-mono">
                        {quizAvg !== null ? `${quizAvg}%` : "—"}
                      </td>
                      <td className="py-3 text-center text-slate-700 font-mono">
                        {g.midterm !== null ? `${g.midterm}%` : "—"}
                      </td>
                      <td className="py-3 text-center text-slate-700 font-mono">
                        {g.final !== null ? `${g.final}%` : "—"}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`inline-block text-xs font-bold px-2 py-1 rounded ${gradeColor[g.overall]}`}>
                          {g.overall}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strengths */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <h3 className="font-bold text-emerald-950 mb-2">আপনার শক্তি</h3>
            <ul className="space-y-1.5 text-sm text-emerald-800">
              <li>· Tazkiya — A+ পাওয়া একমাত্র মডিউল</li>
              <li>· Iman & Aqidah — সমস্ত পরীক্ষায় ৯০%+</li>
              <li>· Fiqh-1 — চমৎকার ধারাবাহিকতা</li>
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-bold text-amber-900 mb-2">উন্নতির সুযোগ</h3>
            <ul className="space-y-1.5 text-sm text-amber-800">
              <li>· Fiqh-2 — কুইজে আরও ভালো করতে পারেন</li>
              <li>· Hadith — মুখস্থের সংখ্যা বাড়াতে পারেন</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
