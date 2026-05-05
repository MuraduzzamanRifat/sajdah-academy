import type { Metadata } from "next";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import DashboardShell from "../_components/DashboardShell";

export const metadata: Metadata = {
  title: "Schedule — রুটিন",
  alternates: { canonical: "/sajdah-academy/dashboard/schedule/" },
  robots: { index: false, follow: false },
};

const week = [
  { day: "শনি", date: "৪", events: [] },
  { day: "রবি", date: "৫", events: [{ time: "8 PM", title: "WhatsApp Q&A", color: "blue" }] },
  { day: "সোম", date: "৬", events: [] },
  { day: "মঙ্গল", date: "৭", events: [{ time: "—", title: "Hadith Quiz Due", color: "rose" }] },
  { day: "বুধ", date: "৮", events: [{ time: "—", title: "Sirah Essay Due", color: "amber" }] },
  {
    day: "বৃহঃ",
    date: "৯",
    events: [
      { time: "6:30 PM", title: "Class-1 Welcome", color: "emerald" },
      { time: "7:30 PM", title: "Class-1 Emotional", color: "emerald" },
    ],
  },
  {
    day: "শুক্র",
    date: "১০",
    events: [
      { time: "4:30 AM", title: "Tahajjud + Class-2", color: "emerald" },
      { time: "6:30 AM", title: "Class-3 Hadith", color: "purple" },
      { time: "2:15 PM", title: "Class-4 Fiqh-2", color: "amber" },
      { time: "7 PM", title: "Class-5 Tazkiyah", color: "rose" },
    ],
  },
];

const eventColors: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-300",
  purple: "bg-purple-100 text-purple-700 border-purple-300",
  amber: "bg-amber-100 text-amber-700 border-amber-300",
  rose: "bg-rose-100 text-rose-700 border-rose-300",
  blue: "bg-blue-100 text-blue-700 border-blue-300",
};

const fullToday = [
  { time: "৪:৩০ AM", title: "তাহাজ্জুদ + Class-2", sub: "Hall A · মাওলানা আবদুল্লাহ", duration: "৪৫ মিনিট", color: "emerald" },
  { time: "৫:০০ AM", title: "Salatul Fajr & Dua", sub: "Mosque · জামাত", duration: "৩০ মিনিট", color: "emerald" },
  { time: "৫:৩০ AM", title: "Live with Nature (Walking)", sub: "Resort grounds", duration: "৩০ মিনিট", color: "blue" },
  { time: "৬:০০ AM", title: "Happy Breakfast & Ishraq", sub: "Dining hall", duration: "৩০ মিনিট", color: "amber" },
  { time: "৬:৩০ AM", title: "Class-3 — Hadith", sub: "Hall A · মুফতি জাকারিয়া", duration: "৯০ মিনিট", color: "purple" },
  { time: "৮:০০ AM", title: "Q & A", sub: "Hall A", duration: "৩০ মিনিট", color: "blue" },
  { time: "৯:৩০ AM", title: "Leisure / Personal time", sub: "Free", duration: "৪৫ মিনিট", color: "blue" },
  { time: "১১:৩০ AM", title: "Salatul Jumua", sub: "Mosque", duration: "৬০ মিনিট", color: "emerald" },
  { time: "২:১৫ PM", title: "Class-4 — Fiqh-2 Ibadat", sub: "Hall A · মুফতি জাকারিয়া", duration: "৭৫ মিনিট", color: "amber" },
  { time: "৭:০০ PM", title: "Class-5 — Tazkiyah", sub: "Hall A · ড. ইমরান হাসান", duration: "৬০ মিনিট", color: "rose" },
];

export default function SchedulePage() {
  return (
    <DashboardShell title="রুটিন · Schedule">
      <div className="space-y-4">
        {/* Week strip */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-950 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-600" />
              এই সপ্তাহ · ৪–১০ মে ২০২৬
            </h3>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-bold"
            >
              <Download className="w-3 h-3" /> iCal Export
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 overflow-x-auto">
            {week.map((d, i) => (
              <div
                key={i}
                className={`min-w-[110px] sm:min-w-0 rounded-xl border p-2.5 ${
                  d.day === "শুক্র" ? "bg-emerald-50 border-emerald-300" : "bg-slate-50 border-slate-200"
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{d.day}</p>
                <p className="text-2xl font-bold text-emerald-950 mt-1">{d.date}</p>
                <div className="space-y-1.5 mt-3">
                  {d.events.length === 0 ? (
                    <p className="text-[11px] text-slate-400">—</p>
                  ) : (
                    d.events.map((e, ei) => (
                      <div
                        key={ei}
                        className={`text-[11px] px-1.5 py-1 rounded border leading-tight ${eventColors[e.color]}`}
                      >
                        <span className="font-mono opacity-70">{e.time}</span>
                        <p className="font-medium leading-tight mt-0.5">{e.title}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today timeline */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h3 className="font-bold text-emerald-950 mb-4">শুক্রবার ১০ মে — পূর্ণ দিনের রুটিন</h3>
          <div className="space-y-2">
            {fullToday.map((e, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 border-l-4 border-transparent hover:border-emerald-500 transition-colors"
              >
                <span className="text-xs font-mono text-slate-500 min-w-[80px] pt-0.5 shrink-0">{e.time}</span>
                <div className={`w-1 rounded-full self-stretch ${eventColors[e.color].split(" ")[0]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-emerald-950">{e.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{e.sub}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{e.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
