import type { Metadata } from "next";
import Link from "next/link";
import {
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/auth/current-user";
import { createClient } from "../../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Payments — পেমেন্ট",
  alternates: { canonical: "/student-dashboard/payments/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PaymentRow = {
  id: string;
  txn_code: string;
  amount_bdt: number;
  method: string | null;
  kind: string | null;
  status: "pending" | "due" | "received" | "failed" | "refunded";
  due_date: string | null;
  paid_at: string | null;
  reference: string | null;
};

const statusBadge: Record<string, { cls: string; label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  received: { cls: "bg-emerald-100 text-emerald-700", label: "পরিশোধিত", Icon: CheckCircle2 },
  pending: { cls: "bg-amber-100 text-amber-700", label: "অপেক্ষমাণ", Icon: Clock },
  due: { cls: "bg-rose-100 text-rose-700", label: "বকেয়া", Icon: AlertCircle },
  failed: { cls: "bg-rose-100 text-rose-700", label: "ব্যর্থ", Icon: AlertCircle },
  refunded: { cls: "bg-slate-100 text-slate-600", label: "ফেরত", Icon: CheckCircle2 },
};

const methodIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  bKash: Smartphone,
  Nagad: Smartphone,
  "Bank transfer": Building,
};

const formatBDT = (amount: number) => `৳ ${Number(amount ?? 0).toLocaleString("bn-BD")}`;

export default async function PaymentsPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login?next=/student-dashboard/payments/");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("id, txn_code, amount_bdt, method, kind, status, due_date, paid_at, reference")
    .eq("student_id", me.id)
    .order("paid_at", { ascending: false, nullsFirst: false })
    .order("due_date", { ascending: true, nullsFirst: false });

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-sm text-rose-800">
        পেমেন্ট তথ্য লোড করা যায়নি। আবার চেষ্টা করুন বা সাপোর্টে যোগাযোগ করুন।
      </div>
    );
  }

  const payments = (data ?? []) as PaymentRow[];
  const totalReceived = payments
    .filter((p) => p.status === "received")
    .reduce((s, p) => s + Number(p.amount_bdt ?? 0), 0);
  const totalDue = payments
    .filter((p) => p.status === "due" || p.status === "pending")
    .reduce((s, p) => s + Number(p.amount_bdt ?? 0), 0);

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="grid sm:grid-cols-3 gap-3">
        <Card label="মোট পরিশোধিত" value={formatBDT(totalReceived)} color="emerald" />
        <Card label="বকেয়া" value={formatBDT(totalDue)} color={totalDue > 0 ? "amber" : "slate"} />
        <Card label="মোট লেনদেন" value={String(payments.length)} color="slate" />
      </div>

      {payments.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-600">এখনো কোনো পেমেন্ট রেকর্ড নেই।</p>
          <p className="text-xs text-slate-500 mt-1">
            ভর্তি অনুমোদিত হলে আপনার কিস্তি এখানে দেখাবে।
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-emerald-950 text-sm">পেমেন্ট ইতিহাস</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {payments.map((p) => {
              const meta = statusBadge[p.status] ?? statusBadge.pending;
              const MIcon = (p.method && methodIcon[p.method]) || CreditCard;
              return (
                <div key={p.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <MIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-emerald-950 truncate">{p.kind ?? "Payment"}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      <span className="font-mono">{p.txn_code}</span>
                      {p.method ? ` · ${p.method}` : ""}
                      {p.reference ? ` · ${p.reference}` : ""}
                    </p>
                    {(p.paid_at || p.due_date) && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {p.paid_at
                          ? `Paid on ${new Date(p.paid_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
                          : p.due_date
                            ? `Due ${new Date(p.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
                            : ""}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-950">{formatBDT(Number(p.amount_bdt))}</p>
                    <span
                      className={`inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.cls}`}
                    >
                      <meta.Icon className="w-3 h-3" />
                      {meta.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
        <p className="text-sm text-emerald-900 leading-relaxed">
          কোনো পেমেন্ট-সম্পর্কিত প্রশ্ন আছে?{" "}
          <Link href="/contact/" className="font-bold underline">
            সাপোর্টে যোগাযোগ করুন
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function Card({ label, value, color }: { label: string; value: string; color: "emerald" | "amber" | "slate" }) {
  const colorMap = {
    emerald: "text-emerald-700",
    amber: "text-amber-700",
    slate: "text-slate-700",
  };
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-[11px] text-slate-500 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${colorMap[color]}`}>{value}</p>
    </div>
  );
}
