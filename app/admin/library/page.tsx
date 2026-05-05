import type { Metadata } from "next";
import { Plus, FileText, Video, Headphones, Book, Download, Edit3, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Library",
  alternates: { canonical: "/admin/library/" },
  robots: { index: false, follow: false },
};

const resources = [
  { type: "pdf", title: "ফিকহুল ইবাদাত — মূল পাঠ্যপুস্তক", course: "Fiqh-2", size: "৪.২ MB", uploads: 38, downloads: 142, by: "Mufti Zakaria", date: "২৫ এপ্রিল ২০২৬" },
  { type: "pdf", title: "Iman & Aqidah — সংক্ষিপ্ত নোট", course: "Iman & Aqidah", size: "১.৮ MB", uploads: 38, downloads: 156, by: "Mawlana Abdullah", date: "১২ এপ্রিল ২০২৬" },
  { type: "video", title: "Class-3 — Hadith #4 ভিডিও রেকর্ডিং", course: "Hadith", size: "৪২২ MB", uploads: 38, downloads: 31, by: "System", date: "৩ মে ২০২৬" },
  { type: "audio", title: "তিলাওয়াত মডেল — সূরা ইয়াসিন", course: "Quranul Kareem", size: "১৮ MB", uploads: 38, downloads: 88, by: "Qari Yusuf", date: "১৫ মার্চ ২০২৬" },
  { type: "book", title: "আত্মশুদ্ধির মনস্তত্ত্ব", course: "Tazkiya", size: "৬.১ MB", uploads: 38, downloads: 76, by: "Dr. Imran", date: "১ মার্চ ২০২৬" },
  { type: "pdf", title: "সিরাহ — মাক্কী জীবন টাইমলাইন", course: "Usuwatun Hasanah", size: "২.৪ MB", uploads: 38, downloads: 45, by: "Mawlana Sajid", date: "২০ এপ্রিল ২০২৬" },
];

const typeMap: Record<string, { icon: React.ReactNode; bg: string; fg: string; label: string }> = {
  pdf: { icon: <FileText className="w-4 h-4" />, bg: "bg-rose-100", fg: "text-rose-700", label: "PDF" },
  video: { icon: <Video className="w-4 h-4" />, bg: "bg-purple-100", fg: "text-purple-700", label: "ভিডিও" },
  audio: { icon: <Headphones className="w-4 h-4" />, bg: "bg-blue-100", fg: "text-blue-700", label: "অডিও" },
  book: { icon: <Book className="w-4 h-4" />, bg: "bg-emerald-100", fg: "text-emerald-700", label: "বই" },
};

export default function AdminLibraryPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950">৬৪ রিসোর্স</h2>
          <p className="text-xs text-slate-500 mt-0.5">২৮ PDF · ১২ ভিডিও · ১৮ অডিও · ৬ বই · মোট ৪.১ GB</p>
        </div>
        <div className="flex gap-2">
          <select defaultValue="all" className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold">
            <option value="all">সব কোর্স</option>
            <option>Iman & Aqidah</option>
            <option>Hadith</option>
            <option>Fiqh-2</option>
            <option>Tazkiya</option>
            <option>Quran</option>
          </select>
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
            <Plus className="w-3.5 h-3.5" /> আপলোড
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-2.5 font-bold">রিসোর্স</th>
                <th className="px-3 py-2.5 font-bold">কোর্স</th>
                <th className="px-3 py-2.5 font-bold">আপলোড করেছেন</th>
                <th className="px-3 py-2.5 font-bold text-right">আকার</th>
                <th className="px-3 py-2.5 font-bold text-center">ডাউনলোড</th>
                <th className="px-3 py-2.5 font-bold">তারিখ</th>
                <th className="px-3 py-2.5 font-bold w-24"></th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => {
                const t = typeMap[r.type];
                return (
                  <tr key={r.title} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg ${t.bg} ${t.fg} flex items-center justify-center shrink-0`}>
                          {t.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-950 leading-tight">{r.title}</p>
                          <p className="text-[10px] text-slate-500">{t.label}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-700">{r.course}</td>
                    <td className="px-3 py-3 text-xs text-slate-600">{r.by}</td>
                    <td className="px-3 py-3 text-right text-[11px] font-mono text-slate-700">{r.size}</td>
                    <td className="px-3 py-3 text-center text-xs font-mono font-bold text-emerald-950">{r.downloads}</td>
                    <td className="px-3 py-3 text-[11px] text-slate-600 whitespace-nowrap">{r.date}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button type="button" className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
