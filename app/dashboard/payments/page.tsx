import type { Metadata } from "next";
import { CreditCard, CheckCircle2, AlertCircle, Clock, Download, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Payments — পেমেন্ট",
  alternates: { canonical: "/dashboard/payments/" },
  robots: { index: false, follow: false },
};

const installments = [
  {
    n: 1,
    amount: 60_000,
    due: "১ ফেব্রুয়ারি ২০২৬",
    paid: "২৮ জানুয়ারি ২০২৬",
    method: "bKash",
    status: "paid",
    receipt: "RCP-2026-0418-01",
  },
  {
    n: 2,
    amount: 45_000,
    due: "১৫ মে ২০২৬",
    paid: "",
    method: "",
    status: "due",
    receipt: "",
  },
  {
    n: 3,
    amount: 45_000,
    due: "১৫ জুলাই ২০২৬",
    paid: "",
    method: "",
    status: "upcoming",
    receipt: "",
  },
];

const totalFee = 150_000;
const paidSoFar = installments.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
const dueNow = installments.filter((i) => i.status === "due").reduce((s, i) => s + i.amount, 0);
const remaining = totalFee - paidSoFar;

const fmtBdt = (n: number) => `৳ ${n.toLocaleString("bn-BD")}`;

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  paid: { icon: <CheckCircle2 className="w-4 h-4" />, color: "bg-emerald-100 text-emerald-700", label: "পরিশোধিত" },
  due: { icon: <AlertCircle className="w-4 h-4" />, color: "bg-amber-100 text-amber-700", label: "বকেয়া" },
  upcoming: { icon: <Clock className="w-4 h-4" />, color: "bg-slate-100 text-slate-600", label: "আসন্ন" },
};

export default function PaymentsPage() {
  return (
    <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-amber-900">২য় কিস্তি বকেয়া · {fmtBdt(dueNow)}</p>
            <p className="text-sm text-amber-800 mt-1">
              পরিশোধের শেষ তারিখ: ১৫ মে ২০২৬ (১০ দিন বাকি) — নির্ধারিত সময়ের পর ১% বিলম্ব ফি যোগ হবে।
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm rounded-lg shrink-0"
          >
            এখন পরিশোধ করুন
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <SummaryCard label="মোট কোর্স ফি" value={fmtBdt(totalFee)} />
          <SummaryCard label="পরিশোধিত" value={fmtBdt(paidSoFar)} color="emerald" />
          <SummaryCard label="অবশিষ্ট" value={fmtBdt(remaining)} color="amber" />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-emerald-950">পেমেন্ট প্রগ্রেস</h3>
            <span className="text-sm font-mono text-slate-700">
              {Math.round((paidSoFar / totalFee) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
              style={{ width: `${(paidSoFar / totalFee) * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-950 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" /> কিস্তি সময়সূচি
            </h3>
            <span className="text-xs text-slate-500">৩ কিস্তি প্ল্যান (৪০/৩০/৩০)</span>
          </div>
          <div className="space-y-3">
            {installments.map((i) => {
              const cfg = statusConfig[i.status];
              return (
                <div
                  key={i.n}
                  className={`p-4 rounded-xl border-2 ${
                    i.status === "due"
                      ? "border-amber-400 bg-amber-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-emerald-950">কিস্তি ০{i.n}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-emerald-950 mb-1">{fmtBdt(i.amount)}</p>
                      <p className="text-xs text-slate-600">
                        {i.status === "paid"
                          ? `পরিশোধিত: ${i.paid} · ${i.method}`
                          : `প্রাপ্য: ${i.due}`}
                      </p>
                    </div>
                    {i.status === "paid" && i.receipt && (
                      <button
                        type="button"
                        className="px-3 py-1.5 border border-emerald-300 text-emerald-700 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 hover:bg-emerald-50"
                      >
                        <Download className="w-3 h-3" /> Receipt
                      </button>
                    )}
                    {i.status === "due" && (
                      <button
                        type="button"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm rounded-lg shrink-0"
                      >
                        Pay Now →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h3 className="font-bold text-emerald-950 mb-4">পেমেন্ট মাধ্যম</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-4 border border-slate-200 rounded-xl text-center">
              <Smartphone className="w-8 h-8 mx-auto text-pink-600 mb-2" />
              <p className="font-bold text-emerald-950">bKash</p>
              <p className="text-xs text-slate-500 mt-1">01805 565 444</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl text-center">
              <Smartphone className="w-8 h-8 mx-auto text-orange-600 mb-2" />
              <p className="font-bold text-emerald-950">Nagad</p>
              <p className="text-xs text-slate-500 mt-1">01805 565 444</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl text-center">
              <CreditCard className="w-8 h-8 mx-auto text-emerald-700 mb-2" />
              <p className="font-bold text-emerald-950">Bank Transfer</p>
              <p className="text-xs text-slate-500 mt-1">Islami Bank · A/C 1234567890</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h3 className="font-bold text-emerald-950 mb-4">লেনদেনের ইতিহাস</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="pb-2 font-medium">তারিখ</th>
                <th className="pb-2 font-medium">বিবরণ</th>
                <th className="pb-2 font-medium">মাধ্যম</th>
                <th className="pb-2 font-medium text-right">পরিমাণ</th>
              </tr>
            </thead>
            <tbody>
              {installments
                .filter((i) => i.status === "paid")
                .map((i) => (
                  <tr key={i.n} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 text-slate-700">{i.paid}</td>
                    <td className="py-3 text-emerald-950 font-medium">কিস্তি ০{i.n} — Foundation</td>
                    <td className="py-3 text-slate-700">{i.method}</td>
                    <td className="py-3 text-emerald-950 font-bold text-right font-mono">
                      {fmtBdt(i.amount)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color = "default",
}: {
  label: string;
  value: string;
  color?: "default" | "emerald" | "amber";
}) {
  const valueColor =
    color === "emerald" ? "text-emerald-700" : color === "amber" ? "text-amber-700" : "text-emerald-950";
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}
