import type { Metadata } from "next";
import { Plus, Filter, Download, MoreHorizontal, Mail, Phone, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Students",
  alternates: { canonical: "/admin/students/" },
  robots: { index: false, follow: false },
};

const students = [
  { name: "Muhammad Ibrahim", id: "SA-2026-0418", batch: "ব্যাচ-৪", phase: "Foundation", phone: "+880 17 4288 6543", email: "ibrahim@…", status: "active", progress: 72, fee: "✓ পরিশোধিত", joined: "১২ এপ্রিল ২০২৬" },
  { name: "Abdul Hannan", id: "SA-2026-0419", batch: "ব্যাচ-৪", phase: "Foundation", phone: "+880 18 9712 0034", email: "hannan@…", status: "active", progress: 68, fee: "✓ পরিশোধিত", joined: "১২ এপ্রিল ২০২৬" },
  { name: "Tariq Aziz", id: "SA-2026-0420", batch: "ব্যাচ-৪", phase: "Foundation", phone: "+880 19 1122 3344", email: "tariq@…", status: "pending", progress: 0, fee: "অপেক্ষমাণ", joined: "৩ মে ২০২৬" },
  { name: "Fardin Hossain", id: "SA-2026-0421", batch: "ব্যাচ-৪", phase: "Foundation", phone: "+880 16 5544 9988", email: "fardin@…", status: "pending", progress: 0, fee: "অপেক্ষমাণ", joined: "৩ মে ২০২৬" },
  { name: "Sadman Khan", id: "SA-2025-0312", batch: "ব্যাচ-৩", phase: "Understanding", phone: "+880 17 9988 1122", email: "sadman@…", status: "active", progress: 88, fee: "✓ পরিশোধিত", joined: "৫ জানু ২০২৬" },
  { name: "Yousuf Reza", id: "SA-2025-0314", batch: "ব্যাচ-৩", phase: "Understanding", phone: "+880 18 3344 5566", email: "yousuf@…", status: "inactive", progress: 24, fee: "বকেয়া ৳৩০,০০০", joined: "৫ জানু ২০২৬" },
  { name: "Imran Khalil", id: "SA-2025-0301", batch: "ব্যাচ-৩", phase: "Understanding", phone: "+880 19 2233 4455", email: "imran@…", status: "active", progress: 92, fee: "✓ পরিশোধিত", joined: "৫ জানু ২০২৬" },
  { name: "Mahdi Karim", id: "SA-2024-0210", batch: "ব্যাচ-২", phase: "Transformation", phone: "+880 17 8877 6655", email: "mahdi@…", status: "active", progress: 100, fee: "✓ সম্পন্ন", joined: "১০ সেপ্ট ২০২৫" },
];

const tabs = [
  { key: "all", label: "সব ছাত্র", count: 42 },
  { key: "active", label: "সক্রিয়", count: 35 },
  { key: "pending", label: "অপেক্ষমাণ", count: 4 },
  { key: "inactive", label: "নিষ্ক্রিয়", count: 3 },
];

const statusBadge: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  inactive: "bg-slate-100 text-slate-500",
};
const statusLabel: Record<string, string> = {
  active: "সক্রিয়",
  pending: "অপেক্ষমাণ",
  inactive: "নিষ্ক্রিয়",
};

export default function AdminStudentsPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-emerald-950">৪২ জন ছাত্র</h2>
            <p className="text-xs text-slate-500 mt-0.5">৪ ব্যাচ · ৩ ফেইজ · গড় ৭৩% উপস্থিতি</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold">
              <Filter className="w-3.5 h-3.5" /> ফিল্টার
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold">
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
              <Plus className="w-3.5 h-3.5" /> নতুন ছাত্র
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-500 min-w-[240px] flex-1">
            <Search className="w-3.5 h-3.5" />
            <span>নাম / ID / ফোন দিয়ে খুঁজুন...</span>
          </div>
          <select defaultValue="all" className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs">
            <option value="all">সব ব্যাচ</option>
            <option>ব্যাচ-৪</option>
            <option>ব্যাচ-৩</option>
            <option>ব্যাচ-২</option>
          </select>
          <select defaultValue="all" className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs">
            <option value="all">সব ফেইজ</option>
            <option>Foundation</option>
            <option>Understanding</option>
            <option>Transformation</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="border-b border-slate-200 flex">
          {tabs.map((t, i) => (
            <button
              key={t.key}
              type="button"
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
                i === 0
                  ? "border-emerald-700 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {t.label}
              <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${i === 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-2.5 font-bold w-10">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                <th className="px-3 py-2.5 font-bold">ছাত্র</th>
                <th className="px-3 py-2.5 font-bold">ব্যাচ / ফেইজ</th>
                <th className="px-3 py-2.5 font-bold">যোগাযোগ</th>
                <th className="px-3 py-2.5 font-bold">প্রগ্রেস</th>
                <th className="px-3 py-2.5 font-bold">পেমেন্ট</th>
                <th className="px-3 py-2.5 font-bold">অবস্থা</th>
                <th className="px-3 py-2.5 font-bold w-10"></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                  <td className="px-5 py-3">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-950 leading-tight truncate">{s.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-xs font-medium text-emerald-950">{s.batch}</p>
                    <p className="text-[10px] text-slate-500">{s.phase}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-[11px] text-slate-700 inline-flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5" /> {s.phone}
                    </p>
                    <p className="text-[10px] text-slate-500 inline-flex items-center gap-1 mt-0.5">
                      <Mail className="w-2.5 h-2.5" /> {s.email}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2 min-w-[110px]">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            s.progress >= 75 ? "bg-emerald-600" : s.progress >= 40 ? "bg-blue-600" : s.progress > 0 ? "bg-amber-500" : "bg-slate-300"
                          }`}
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-700 font-bold w-8 text-right">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[11px] text-slate-700 whitespace-nowrap">{s.fee}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[s.status]}`}>
                      {statusLabel[s.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button type="button" className="p-1 text-slate-400 hover:text-slate-700" aria-label="More">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">৮ এর মধ্যে ৮ দেখানো হচ্ছে</span>
          <div className="flex gap-1">
            <button type="button" className="px-3 py-1 border border-slate-200 rounded text-slate-500 hover:bg-white" disabled>
              ‹
            </button>
            <button type="button" className="px-3 py-1 border border-emerald-300 bg-emerald-50 text-emerald-700 font-bold rounded">
              ১
            </button>
            <button type="button" className="px-3 py-1 border border-slate-200 rounded text-slate-700 hover:bg-white">
              ২
            </button>
            <button type="button" className="px-3 py-1 border border-slate-200 rounded text-slate-700 hover:bg-white">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
