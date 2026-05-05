import type { Metadata } from "next";
import { Plus, Download, Eye, FileBadge, CheckCircle2 } from "lucide-react";
import MedallionMark from "../../components/MedallionMark";

export const metadata: Metadata = {
  title: "Admin · Certificates",
  alternates: { canonical: "/sajdah-academy/admin/certificates/" },
  robots: { index: false, follow: false },
};

const issued = [
  { student: "Mahdi Karim", id: "SA-2024-0210", batch: "ব্যাচ-২", certNo: "SA-CERT-2025-001", phase: "Foundation", grade: "A+", issuedAt: "১৫ মার্চ ২০২৬", verified: true },
  { student: "Mahdi Karim", id: "SA-2024-0210", batch: "ব্যাচ-২", certNo: "SA-CERT-2025-002", phase: "Understanding", grade: "A+", issuedAt: "১৫ মার্চ ২০২৬", verified: true },
  { student: "Imran Khalil", id: "SA-2025-0301", batch: "ব্যাচ-৩", certNo: "SA-CERT-2026-014", phase: "Foundation", grade: "A", issuedAt: "১২ এপ্রিল ২০২৬", verified: true },
  { student: "Sadman Khan", id: "SA-2025-0312", batch: "ব্যাচ-৩", certNo: "SA-CERT-2026-015", phase: "Foundation", grade: "A", issuedAt: "১২ এপ্রিল ২০২৬", verified: true },
];

const eligible = [
  { student: "Muhammad Ibrahim", id: "SA-2026-0418", phase: "Foundation", progress: 72, attendance: 93, finalScore: null, ready: false },
  { student: "Abdul Hannan", id: "SA-2026-0419", phase: "Foundation", progress: 68, attendance: 88, finalScore: null, ready: false },
  { student: "Sadman Khan", id: "SA-2025-0312", phase: "Understanding", progress: 88, attendance: 100, finalScore: 96, ready: true },
];

export default function AdminCertificatesPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat value="৪" label="ইস্যুকৃত" />
        <Stat value="১" label="ইস্যুর জন্য প্রস্তুত" tone="amber" />
        <Stat value="২" label="যোগ্যতার কাছাকাছি" />
        <Stat value="২২" label="মোট সমাপ্তকারী" />
      </div>

      <div className="bg-emerald-900 text-white rounded-2xl p-5 flex items-center gap-4 flex-wrap">
        <div className="w-16 h-16 rounded-xl bg-amber-500 flex items-center justify-center overflow-hidden shrink-0">
          <MedallionMark size={48} className="w-12 h-12" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold flex items-center gap-2">
            <FileBadge className="w-4 h-4 text-amber-400" /> সার্টিফিকেট টেমপ্লেট সক্রিয়
          </h3>
          <p className="text-xs text-emerald-200 mt-1">
            ৩-ফেইজ ক্রেডেনশিয়াল · QR ভেরিফিকেশন · ব্লকচেইন হ্যাশ · A4 PDF
          </p>
        </div>
        <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded-lg text-xs font-bold">
          <Eye className="w-3.5 h-3.5" /> টেমপ্লেট প্রিভিউ
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-emerald-950">যোগ্য ছাত্র (এই মাসে)</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-2.5 font-bold">ছাত্র</th>
              <th className="px-3 py-2.5 font-bold">ফেইজ</th>
              <th className="px-3 py-2.5 font-bold text-center">প্রগ্রেস</th>
              <th className="px-3 py-2.5 font-bold text-center">উপস্থিতি</th>
              <th className="px-3 py-2.5 font-bold text-center">Final</th>
              <th className="px-3 py-2.5 font-bold text-right pr-5">ইস্যু</th>
            </tr>
          </thead>
          <tbody>
            {eligible.map((e) => (
              <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                <td className="px-5 py-3">
                  <p className="text-xs font-bold text-emerald-950">{e.student}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{e.id}</p>
                </td>
                <td className="px-3 py-3 text-xs text-slate-700">{e.phase}</td>
                <td className="px-3 py-3 text-center text-xs font-mono">
                  <span className={e.progress >= 80 ? "text-emerald-700 font-bold" : "text-amber-700"}>
                    {e.progress}%
                  </span>
                </td>
                <td className="px-3 py-3 text-center text-xs font-mono">
                  <span className={e.attendance >= 80 ? "text-emerald-700 font-bold" : "text-rose-700"}>
                    {e.attendance}%
                  </span>
                </td>
                <td className="px-3 py-3 text-center text-xs font-mono">
                  {e.finalScore !== null ? (
                    <span className="text-emerald-700 font-bold">{e.finalScore}%</span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right pr-5">
                  {e.ready ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
                    >
                      <Plus className="w-3 h-3" /> ইস্যু
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400">শর্ত পূরণ হয়নি</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-emerald-950">ইস্যুকৃত সার্টিফিকেট</h3>
          <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">সব দেখুন →</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-2.5 font-bold">সার্টিফিকেট নং</th>
              <th className="px-3 py-2.5 font-bold">ছাত্র</th>
              <th className="px-3 py-2.5 font-bold">ফেইজ</th>
              <th className="px-3 py-2.5 font-bold">গ্রেড</th>
              <th className="px-3 py-2.5 font-bold">ইস্যু তারিখ</th>
              <th className="px-3 py-2.5 font-bold">ভেরিফিকেশন</th>
              <th className="px-3 py-2.5 font-bold w-12"></th>
            </tr>
          </thead>
          <tbody>
            {issued.map((c) => (
              <tr key={c.certNo} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                <td className="px-5 py-3 text-[11px] font-mono text-emerald-700 font-bold">{c.certNo}</td>
                <td className="px-3 py-3">
                  <p className="text-xs font-bold text-emerald-950">{c.student}</p>
                  <p className="text-[10px] text-slate-500">{c.batch}</p>
                </td>
                <td className="px-3 py-3 text-xs text-slate-700">{c.phase}</td>
                <td className="px-3 py-3">
                  <span className="text-xs font-bold bg-emerald-700 text-white px-2 py-0.5 rounded">
                    {c.grade}
                  </span>
                </td>
                <td className="px-3 py-3 text-[11px] text-slate-600 whitespace-nowrap">{c.issuedAt}</td>
                <td className="px-3 py-3">
                  {c.verified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" /> ভেরিফায়েড
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700">পেন্ডিং</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right">
                  <button type="button" className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ value, label, tone = "emerald" }: { value: string; label: string; tone?: "emerald" | "amber" }) {
  const cls = tone === "amber" ? "text-amber-700" : "text-emerald-700";
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className={`text-2xl font-bold leading-none ${cls}`}>{value}</div>
      <div className="text-[11px] text-slate-500 mt-1.5">{label}</div>
    </div>
  );
}
