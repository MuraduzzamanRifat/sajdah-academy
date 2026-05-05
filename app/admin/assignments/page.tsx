import type { Metadata } from "next";
import { Plus, FileText, Clock, CheckCircle2, AlertTriangle, Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Assignments",
  alternates: { canonical: "/admin/assignments/" },
  robots: { index: false, follow: false },
};

const assignments = [
  { title: "২০ হাদীস মুখস্থ — পরীক্ষা", course: "Hadith e Mubarakah", batch: "ব্যাচ-৪", due: "৭ মে ২০২৬", submitted: 18, total: 38, ungraded: 4, type: "Audio" },
  { title: "সিরাহ — মাক্কী জীবন রিফ্লেকশন", course: "Usuwatun Hasanah", batch: "ব্যাচ-৪", due: "৮ মে ২০২৬", submitted: 12, total: 38, ungraded: 12, type: "Essay" },
  { title: "ফিকহ-২ — ইবাদাত মূল্যায়ন কুইজ", course: "Fiqh-2", batch: "ব্যাচ-৪", due: "১০ মে ২০২৬", submitted: 0, total: 38, ungraded: 0, type: "Online quiz" },
  { title: "Aqeedah — Mid-evaluation", course: "Iman & Aqidah", batch: "ব্যাচ-৪", due: "১৫ এপ্রিল ২০২৬", submitted: 38, total: 38, ungraded: 0, type: "Online exam" },
  { title: "Tilawah Audio — সূরা ইয়াসিন", course: "Quranul Kareem", batch: "ব্যাচ-৪", due: "২০ মার্চ ২০২৬", submitted: 38, total: 38, ungraded: 0, type: "Audio" },
];

const stats = [
  { value: "৫", label: "মোট অ্যাসাইনমেন্ট", icon: FileText, color: "emerald" },
  { value: "৩", label: "চলমান", icon: Clock, color: "amber" },
  { value: "১৬", label: "অমূল্যায়িত", icon: AlertTriangle, color: "rose" },
  { value: "২", label: "সম্পন্ন", icon: CheckCircle2, color: "emerald" },
];

const tone: Record<string, { bg: string; fg: string }> = {
  emerald: { bg: "bg-emerald-100", fg: "text-emerald-700" },
  amber: { bg: "bg-amber-100", fg: "text-amber-700" },
  rose: { bg: "bg-rose-100", fg: "text-rose-700" },
};

export default function AdminAssignmentsPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const I = s.icon;
          const t = tone[s.color];
          return (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${t.bg} ${t.fg} flex items-center justify-center shrink-0`}>
                <I className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-950 leading-none">{s.value}</div>
                <div className="text-[11px] text-slate-500 mt-1">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-bold text-emerald-950">সব অ্যাসাইনমেন্ট</h3>
          <div className="flex gap-2">
            <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold">
              <Filter className="w-3 h-3" /> ফিল্টার
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
              <Plus className="w-3 h-3" /> নতুন
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-2.5 font-bold">অ্যাসাইনমেন্ট</th>
                <th className="px-3 py-2.5 font-bold">কোর্স / ব্যাচ</th>
                <th className="px-3 py-2.5 font-bold">ধরন</th>
                <th className="px-3 py-2.5 font-bold text-center">জমা</th>
                <th className="px-3 py-2.5 font-bold text-center">অমূল্যায়িত</th>
                <th className="px-3 py-2.5 font-bold">শেষ তারিখ</th>
                <th className="px-3 py-2.5 font-bold text-right pr-5">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => {
                const submitPct = Math.round((a.submitted / a.total) * 100);
                return (
                  <tr key={a.title} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                    <td className="px-5 py-3">
                      <p className="text-xs font-bold text-emerald-950 leading-tight">{a.title}</p>
                    </td>
                    <td className="px-3 py-3 text-xs">
                      <p className="text-slate-700">{a.course}</p>
                      <p className="text-[10px] text-slate-500">{a.batch}</p>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600">{a.type}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2 min-w-[110px]">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${submitPct >= 75 ? "bg-emerald-600" : submitPct >= 30 ? "bg-blue-600" : "bg-amber-500"}`}
                            style={{ width: `${submitPct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-700 font-bold">
                          {a.submitted}/{a.total}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {a.ungraded > 0 ? (
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                          {a.ungraded}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600 whitespace-nowrap">{a.due}</td>
                    <td className="px-3 py-3 text-right pr-5 whitespace-nowrap">
                      <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">
                        মূল্যায়ন →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
