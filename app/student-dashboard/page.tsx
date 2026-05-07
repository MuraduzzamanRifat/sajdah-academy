import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, ChevronRight, Megaphone, AlertCircle, BookOpen, CheckSquare } from "lucide-react";
import { getCurrentUser } from "../../lib/auth/current-user";
import { createClient } from "../../lib/supabase/server";
import { initials } from "../../lib/initials";
import ComingSoon from "../admin/_components/ComingSoon";

export const metadata: Metadata = {
  title: "Student Portal · ড্যাশবোর্ড",
  description: "Sajdah Academy student dashboard.",
  alternates: { canonical: "/student-dashboard/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type ProfileRow = {
  full_name: string | null;
  email: string;
  status: string | null;
  student_id: string | null;
  joined_at: string | null;
  city: string | null;
  batch: { id: string; name: string; code: string; phase: string | null } | null;
};

export default async function DashboardPage() {
  const me = await getCurrentUser();
  if (!me) {
    return (
      <div className="text-sm text-slate-600 p-6">
        Sign in required.
      </div>
    );
  }

  const supabase = await createClient();

  /* All per-student aggregates in parallel. RLS is the security gate;
     we still pass `.eq("student_id", user.id)` explicitly for defense
     in depth and so a future RLS regression doesn't leak. */
  const [
    profileRes,
    paymentsRes,
    pendingPaymentsRes,
    announcementsRes,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        `full_name, email, status, student_id, joined_at, city,
         batch:batch_id ( id, name, code, phase )`
      )
      .eq("id", me.id)
      .maybeSingle(),
    supabase
      .from("payments")
      .select("amount_bdt, status, paid_at")
      .eq("student_id", me.id)
      .eq("status", "received"),
    supabase
      .from("payments")
      .select("id, amount_bdt, due_date, status")
      .eq("student_id", me.id)
      .in("status", ["pending", "due"])
      .order("due_date", { ascending: true })
      .limit(1),
    supabase
      .from("announcements")
      .select("id, title, body, created_at, audience")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const profile = (profileRes.data ?? null) as ProfileRow | null;
  const totalPaid = (paymentsRes.data ?? []).reduce(
    (sum, p) => sum + Number(p.amount_bdt ?? 0),
    0
  );
  const nextDue = (pendingPaymentsRes.data ?? [])[0] ?? null;
  const announcements = announcementsRes.data ?? [];

  const display = profile?.full_name?.trim() || me.name || me.email;
  const studentId = profile?.student_id ?? "—";
  const phaseLabel = profile?.batch?.phase ?? "—";
  const batchLabel = profile?.batch?.name ?? "ব্যাচ অ্যাসাইন হয়নি";
  const statusLabel = profile?.status ?? "pending";

  return (
    <div className="space-y-4">
      {/* Identity card with REAL data */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-base font-bold shrink-0">
          {initials(display)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-emerald-950">{display}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {studentId !== "—" ? `${studentId} · ` : ""}
            {phaseLabel !== "—" ? `${phaseLabel} Phase · ` : ""}
            {batchLabel}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-xs text-slate-600">
            {me.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> {me.email}
              </span>
            )}
            {profile?.city && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> {profile.city}
              </span>
            )}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                statusLabel === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : statusLabel === "graduated"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Pending payment — only shows if real */}
      {nextDue && (
        <Link
          href="/student-dashboard/payments/"
          className="block bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center gap-3 hover:bg-amber-100 transition-colors"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-900">
              বকেয়া · ৳ {Number(nextDue.amount_bdt ?? 0).toLocaleString("bn-BD")}
            </p>
            {nextDue.due_date && (
              <p className="text-xs text-amber-700">
                পরিশোধের শেষ তারিখ: {new Date(nextDue.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-amber-600 shrink-0" />
        </Link>
      )}

      {/* Real KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniStat
          value={totalPaid > 0 ? `৳ ${totalPaid.toLocaleString("bn-BD")}` : "৳ ০"}
          label="মোট পরিশোধিত"
          color="text-emerald-700"
        />
        <MiniStat
          value={profile?.batch ? "1" : "0"}
          label="সক্রিয় ব্যাচ"
        />
        <MiniStat
          value={profile?.joined_at ? new Date(profile.joined_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "—"}
          label="ভর্তির মাস"
          color="text-amber-700"
        />
        <MiniStat
          value={statusLabel}
          label="অবস্থা"
          color={statusLabel === "active" ? "text-emerald-700" : "text-slate-700"}
        />
      </div>

      {/* Real announcements */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-emerald-950">সাম্প্রতিক ঘোষণা</h3>
          <Link
            href="/student-dashboard/announcements/"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
          >
            সব <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {announcements.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">এখনো কোনো ঘোষণা নেই।</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="flex gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-emerald-950 leading-tight">{a.title}</p>
                  {a.body && (
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{a.body}</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1">
                    {a.created_at ? new Date(a.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long" }) : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <QuickLink href="/student-dashboard/profile/" icon={Mail} label="প্রোফাইল" />
        <QuickLink href="/student-dashboard/payments/" icon={AlertCircle} label="পেমেন্ট" />
        <QuickLink href="/student-dashboard/modules/" icon={BookOpen} label="মডিউল" />
        <QuickLink href="/student-dashboard/attendance/" icon={CheckSquare} label="উপস্থিতি" />
      </div>

      {/* Modules / grades / spiritual tracking aren't backed by tables yet */}
      <ComingSoon
        title="মডিউল প্রগ্রেস, গ্রেড, স্পিরিচুয়াল ট্র্যাকার শিগগিরই আসছে"
        body="এই ফিচারগুলো ব্যাচ-৪ এর সাথে সক্রিয় হবে। উপরের পেমেন্ট, প্রোফাইল ও ঘোষণা এখন real-time চলছে।"
      />
    </div>
  );
}

function MiniStat({ value, label, color = "text-emerald-950" }: { value: string; label: string; color?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className={`text-2xl font-bold leading-none ${color}`}>{value}</div>
      <div className="text-[11px] text-slate-500 mt-1.5">{label}</div>
    </div>
  );
}

function QuickLink({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link
      href={href}
      className="bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl p-3 flex items-center gap-2.5 transition-colors group"
    >
      <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
        <Icon className="w-4 h-4" />
      </span>
      <span className="text-sm font-bold text-emerald-950 truncate">{label}</span>
    </Link>
  );
}
