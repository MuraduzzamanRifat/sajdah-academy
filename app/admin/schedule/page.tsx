import type { Metadata } from "next";
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Edit3 } from "lucide-react";
import ComingSoon from "../_components/ComingSoon";

export const metadata: Metadata = {
  title: "Admin · Schedule",
  alternates: { canonical: "/admin/schedule/" },
  robots: { index: false, follow: false },
};

const week = [
  { day: "শনি", date: "৪", events: [] },
  { day: "রবি", date: "৫", events: [{ time: "8 PM", title: "WhatsApp Q&A · ব্যাচ-৪", color: "blue", instructor: "Mufti Zakaria" }] },
  { day: "সোম", date: "৬", events: [] },
  { day: "মঙ্গল", date: "৭", events: [{ time: "Due", title: "Hadith Quiz", color: "rose", instructor: "—" }] },
  { day: "বুধ", date: "৮", events: [{ time: "Due", title: "Sirah Essay", color: "amber", instructor: "—" }] },
  { day: "বৃহঃ", date: "৯", events: [
      { time: "6:30 PM", title: "Class-1 Welcome", color: "emerald", instructor: "Mawlana Abdullah" },
      { time: "7:30 PM", title: "Class-1 Emotional", color: "emerald", instructor: "Dr. Imran" },
    ] },
  { day: "শুক্র", date: "১০", events: [
      { time: "4:30 AM", title: "Tahajjud + Class-2", color: "emerald", instructor: "Mawlana Abdullah" },
      { time: "6:30 AM", title: "Class-3 Hadith", color: "purple", instructor: "Mufti Zakaria" },
      { time: "2:15 PM", title: "Class-4 Fiqh-2", color: "amber", instructor: "Mufti Zakaria" },
      { time: "7 PM", title: "Class-5 Tazkiyah", color: "rose", instructor: "Dr. Imran" },
    ] },
];

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  rose: "bg-rose-100 text-rose-700 border-rose-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function AdminSchedulePage() {
  return (
    <div className="space-y-4">
      <ComingSoon body="ইভেন্ট তৈরি / সপ্তাহ ন্যাভিগেশন / শিক্ষক পুনঃবরাদ্দ এখনো ব্যাকএন্ডে wired হয়নি — শিডিউল হার্ডকোডেড।" />
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button type="button" className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg" aria-label="Previous week">
            <ChevronLeft className="w-4 h-4 text-slate-700" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-emerald-950 inline-flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-600" />
              ৪–১০ মে ২০২৬
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">৯ ক্লাস · ২ জমা · ১ Q&A</p>
          </div>
          <button type="button" className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg" aria-label="Next week">
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>
        </div>
        <div className="flex gap-2">
          <select defaultValue="b4" className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold">
            <option value="b4">ব্যাচ-৪</option>
            <option>ব্যাচ-৩</option>
            <option>ব্যাচ-২</option>
          </select>
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
            <Plus className="w-3.5 h-3.5" /> ইভেন্ট যোগ
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 min-w-[760px]">
          {week.map((d) => (
            <div
              key={d.date}
              className={`rounded-xl border p-3 min-h-[200px] ${
                d.day === "শুক্র" ? "bg-emerald-50 border-emerald-300" : "bg-slate-50 border-slate-200"
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{d.day}</p>
              <p className="text-xl font-bold text-emerald-950 mt-1">{d.date}</p>
              <div className="space-y-1.5 mt-3">
                {d.events.length === 0 ? (
                  <button
                    type="button"
                    className="w-full text-[10px] text-slate-400 border border-dashed border-slate-300 rounded p-1.5 hover:bg-white hover:text-emerald-700 hover:border-emerald-300"
                  >
                    + ইভেন্ট
                  </button>
                ) : (
                  d.events.map((e, i) => (
                    <div
                      key={i}
                      className={`text-[10px] px-1.5 py-1 rounded border leading-tight ${colorMap[e.color]} group cursor-pointer`}
                    >
                      <span className="font-mono opacity-80">{e.time}</span>
                      <p className="font-bold leading-tight mt-0.5 truncate">{e.title}</p>
                      <p className="text-[9px] opacity-70 mt-0.5 truncate">{e.instructor}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="font-bold text-emerald-950 mb-4">আজকের ক্লাসে শিক্ষক বরাদ্দ · শুক্রবার ১০ মে</h3>
        <div className="space-y-2">
          {week[6].events.map((e, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50"
            >
              <span className="text-xs font-mono text-slate-500 min-w-[80px]">{e.time}</span>
              <div className={`w-1 h-8 rounded-full ${colorMap[e.color].split(" ")[0]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-emerald-950 leading-tight">{e.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">শিক্ষক: {e.instructor}</p>
              </div>
              <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> বদল
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
