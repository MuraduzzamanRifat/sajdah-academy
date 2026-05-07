import type { Metadata } from "next";
import { ChevronRight, AlertCircle } from "lucide-react";
import { createClient } from "../../../lib/supabase/server";
import { initials } from "../../../lib/initials";
import EnrollActions from "./_components/EnrollActions";

export const metadata: Metadata = {
  title: "Admin · Enrollments",
  alternates: { canonical: "/admin/enrollments/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type EnrollmentRow = {
  id: string;
  applicant_email: string;
  applicant_name: string;
  age: number | null;
  profession: string | null;
  city: string | null;
  phone: string | null;
  motivation: string | null;
  referral_source: string | null;
  status: "submitted" | "reviewing" | "accepted" | "rejected" | "waitlisted";
  match_score: number | null;
  payment_received: boolean;
  docs_complete: boolean;
  created_at: string;
};

const statusBadge: Record<string, string> = {
  submitted: "bg-amber-100 text-amber-700",
  reviewing: "bg-blue-100 text-blue-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  waitlisted: "bg-slate-100 text-slate-500",
};
const statusLabel: Record<string, string> = {
  submitted: "নতুন",
  reviewing: "পর্যালোচনায়",
  accepted: "গৃহীত",
  rejected: "বাতিল",
  waitlisted: "অপেক্ষা তালিকায়",
};

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "এইমাত্র";
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} ঘণ্টা আগে`;
  const days = Math.round(hours / 24);
  return `${days} দিন আগে`;
}

export default async function AdminEnrollmentsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("id, applicant_email, applicant_name, age, profession, city, phone, motivation, referral_source, status, match_score, payment_received, docs_complete, created_at")
    .in("status", ["submitted", "reviewing"])
    .order("created_at", { ascending: false });

  const apps = (data ?? []) as EnrollmentRow[];
  const paid = apps.filter((a) => a.payment_received).length;
  const incompleteDocs = apps.filter((a) => !a.docs_complete).length;
  const recentCutoff = Date.now() - 48 * 3600_000;
  const recent48h = apps.filter((a) => new Date(a.created_at).getTime() > recentCutoff).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat value={String(apps.length)} label="পেন্ডিং আবেদন" tone="emerald" />
        <Stat value={String(paid)} label="পেমেন্ট সম্পন্ন" tone="emerald" />
        <Stat value={String(incompleteDocs)} label="ডকুমেন্ট অসম্পূর্ণ" tone="amber" />
        <Stat value={String(recent48h)} label="৪৮ ঘণ্টায় গ্রহণ" tone="rose" />
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-700">{error.message}</p>
        </div>
      )}

      {apps.length === 0 && !error && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-sm font-bold text-slate-700">কোনো পেন্ডিং আবেদন নেই</p>
          <p className="text-xs text-slate-500 mt-1">
            পাবলিক /enroll/ পেজ থেকে আবেদন এলে এখানে দেখাবে।
          </p>
        </div>
      )}

      <div className="space-y-3">
        {apps.map((a) => (
          <article key={a.id} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  {initials(a.applicant_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-emerald-950">{a.applicant_name}</h4>
                    {a.age && <span className="text-xs text-slate-500">· বয়স {a.age}</span>}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[a.status]}`}>
                      {statusLabel[a.status]}
                    </span>
                    {a.match_score !== null && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          a.match_score >= 85
                            ? "bg-emerald-100 text-emerald-700"
                            : a.match_score >= 75
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        Match {a.match_score}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {[a.profession, a.city, a.phone].filter(Boolean).join(" · ")}
                  </p>
                  {a.motivation && (
                    <p className="text-sm text-slate-700 leading-relaxed mt-2 italic">“{a.motivation}”</p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-3">
                    {a.referral_source && <><span>উৎস: {a.referral_source}</span><span>·</span></>}
                    <span>জমা: {relTime(a.created_at)}</span>
                    <span>·</span>
                    <span className={a.payment_received ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                      {a.payment_received ? "✓ পেমেন্ট" : "○ পেমেন্ট অপেক্ষমাণ"}
                    </span>
                    <span>·</span>
                    <span className={a.docs_complete ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                      {a.docs_complete ? "✓ ডকুমেন্ট" : "⚠ ডকুমেন্ট অসম্পূর্ণ"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <EnrollActions id={a.id} name={a.applicant_name} />
                <button type="button" className="inline-flex items-center gap-1 px-2 py-1 text-slate-500 hover:text-slate-900 text-xs">
                  বিস্তারিত <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="text-xs text-emerald-700 text-center font-bold">
        ✓ Live data from Supabase · {apps.length} pending applications
      </p>
    </div>
  );
}

function Stat({ value, label, tone }: { value: string; label: string; tone: "emerald" | "amber" | "rose" }) {
  const map = { emerald: "text-emerald-700", amber: "text-amber-700", rose: "text-rose-700" } as const;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className={`text-2xl font-bold leading-none ${map[tone]}`}>{value}</div>
      <div className="text-[11px] text-slate-500 mt-1.5">{label}</div>
    </div>
  );
}
