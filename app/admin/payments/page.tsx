import type { Metadata } from "next";
import { Download, Send, AlertCircle, TrendingUp, CheckCircle2, Clock, MoreHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Payments",
  alternates: { canonical: "/sajdah-academy/admin/payments/" },
  robots: { index: false, follow: false },
};

const txns = [
  { id: "TXN-002418", student: "Muhammad Ibrahim", studentId: "SA-2026-0418", method: "bKash", amount: 56250, kind: "১ম কিস্তি", status: "received", date: "১২ এপ্রিল ২০২৬" },
  { id: "TXN-002417", student: "Abdul Hannan", studentId: "SA-2026-0419", method: "Bank transfer", amount: 56250, kind: "১ম কিস্তি", status: "received", date: "১২ এপ্রিল ২০২৬" },
  { id: "TXN-002416", student: "Sabbir Anwar", studentId: "(আবেদনকারী)", method: "Nagad", amount: 25000, kind: "ভর্তি ফি", status: "received", date: "৩০ এপ্রিল ২০২৬" },
  { id: "TXN-002415", student: "Sadman Khan", studentId: "SA-2025-0312", method: "bKash", amount: 52500, kind: "৩য় কিস্তি", status: "received", date: "১ এপ্রিল ২০২৬" },
  { id: "TXN-002414", student: "Yousuf Reza", studentId: "SA-2025-0314", method: "—", amount: 30000, kind: "৩য় কিস্তি", status: "overdue", date: "১৫ এপ্রিল ২০২৬ এর মধ্যে" },
  { id: "TXN-002413", student: "Imran Khalil", studentId: "SA-2025-0301", method: "Bank transfer", amount: 52500, kind: "৩য় কিস্তি", status: "received", date: "৩ এপ্রিল ২০২৬" },
  { id: "TXN-002412", student: "Mahdi Karim", studentId: "SA-2024-0210", method: "—", amount: 0, kind: "সম্পূর্ণ পরিশোধিত", status: "complete", date: "—" },
];

const statusBadge: Record<string, string> = {
  received: "bg-emerald-100 text-emerald-700",
  overdue: "bg-rose-100 text-rose-700",
  complete: "bg-slate-100 text-slate-500",
  pending: "bg-amber-100 text-amber-700",
};
const statusLabel: Record<string, string> = {
  received: "✓ গৃহীত",
  overdue: "⚠ বকেয়া",
  complete: "সম্পন্ন",
  pending: "অপেক্ষমাণ",
};

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI icon={<TrendingUp className="w-4 h-4" />} value="৳ ৪.২L" label="MTD সংগ্রহ" delta="+১৮%" tone="emerald" />
        <KPI icon={<Clock className="w-4 h-4" />} value="৳ ৯০K" label="বকেয়া" delta="৩ ছাত্র" tone="rose" />
        <KPI icon={<CheckCircle2 className="w-4 h-4" />} value="৩৫" label="পরিশোধিত" delta="৩৮ এর মধ্যে" tone="emerald" />
        <KPI icon={<TrendingUp className="w-4 h-4" />} value="৳ ১৮.৪L" label="বার্ষিক রাজস্ব" delta="৭ মাস" tone="amber" />
      </div>

      <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-rose-900">৩ জন ছাত্রের ৩য় কিস্তি বকেয়া · মোট ৳ ৯০,০০০</p>
          <p className="text-xs text-rose-700 mt-1">
            শেষ তারিখ ১৫ এপ্রিল পেরিয়েছে। স্বয়ংক্রিয় রিমাইন্ডার পাঠানো হয়েছে। ম্যানুয়াল ফলো-আপের জন্য{" "}
            <button type="button" className="font-bold underline">এখানে দেখুন</button>।
          </p>
        </div>
        <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0">
          <Send className="w-3.5 h-3.5" /> রিমাইন্ডার পাঠান
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-bold text-emerald-950">সাম্প্রতিক লেনদেন</h3>
          <div className="flex gap-2">
            <select defaultValue="all" className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold">
              <option value="all">সব ধরন</option>
              <option>ভর্তি ফি</option>
              <option>কিস্তি</option>
              <option>রিফান্ড</option>
            </select>
            <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold">
              <Download className="w-3 h-3" /> Statement
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-2.5 font-bold">TXN ID</th>
                <th className="px-3 py-2.5 font-bold">ছাত্র</th>
                <th className="px-3 py-2.5 font-bold">ধরন</th>
                <th className="px-3 py-2.5 font-bold">মাধ্যম</th>
                <th className="px-3 py-2.5 font-bold text-right">পরিমাণ</th>
                <th className="px-3 py-2.5 font-bold">তারিখ</th>
                <th className="px-3 py-2.5 font-bold">অবস্থা</th>
                <th className="px-3 py-2.5 font-bold w-10"></th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                  <td className="px-5 py-3 text-[11px] font-mono text-slate-700">{t.id}</td>
                  <td className="px-3 py-3">
                    <p className="text-xs font-bold text-emerald-950 leading-tight">{t.student}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{t.studentId}</p>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-700">{t.kind}</td>
                  <td className="px-3 py-3 text-xs text-slate-600">{t.method}</td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-sm font-bold font-mono text-emerald-950">
                      ৳ {t.amount.toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[11px] text-slate-600 whitespace-nowrap">{t.date}</td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[t.status]}`}>
                      {statusLabel[t.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button type="button" className="p-1 text-slate-400 hover:text-slate-700">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPI({
  icon,
  value,
  label,
  delta,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  delta: string;
  tone: "emerald" | "amber" | "rose";
}) {
  const map = {
    emerald: { bg: "bg-emerald-100", fg: "text-emerald-700" },
    amber: { bg: "bg-amber-100", fg: "text-amber-700" },
    rose: { bg: "bg-rose-100", fg: "text-rose-700" },
  };
  const t = map[tone];
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-9 h-9 rounded-lg ${t.bg} ${t.fg} flex items-center justify-center`}>{icon}</div>
        <span className={`text-[10px] font-bold ${t.fg}`}>{delta}</span>
      </div>
      <div className="text-xl font-bold text-emerald-950 leading-none">{value}</div>
      <div className="text-[11px] text-slate-500 mt-1.5">{label}</div>
    </div>
  );
}
