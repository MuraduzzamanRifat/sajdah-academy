import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Plus,
  Activity,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { createClient } from "../../lib/supabase/server";
import { initials } from "../../lib/initials";

export const metadata: Metadata = {
  title: "Admin · Dashboard",
  alternates: { canonical: "/admin/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const phaseColors: Record<string, string> = {
  Foundation: "#065f46",
  Understanding: "#d97706",
  Transformation: "#7c3aed",
};

const statusBadge: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  inactive: "bg-slate-100 text-slate-500",
  graduated: "bg-blue-100 text-blue-700",
};
const statusLabel: Record<string, string> = {
  active: "সক্রিয়",
  pending: "অপেক্ষমাণ",
  inactive: "নিষ্ক্রিয়",
  graduated: "সমাপ্ত",
};

const statTone: Record<string, { bg: string; fg: string }> = {
  emerald: { bg: "bg-emerald-100", fg: "text-emerald-700" },
  blue: { bg: "bg-blue-100", fg: "text-blue-700" },
  amber: { bg: "bg-amber-100", fg: "text-amber-700" },
  rose: { bg: "bg-rose-100", fg: "text-rose-700" },
};

const quickActions = [
  { href: "/admin/students/", label: "নতুন ছাত্র", icon: Users },
  { href: "/admin/courses/", label: "নতুন কোর্স", icon: BookOpen },
  { href: "/admin/announcements/", label: "ঘোষণা পাঠান", icon: Activity },
  { href: "/admin/payments/", label: "পেমেন্ট চেক", icon: TrendingUp },
];

type StudentRow = {
  id: string;
  full_name: string | null;
  email: string;
  status: keyof typeof statusBadge;
  joined_at: string;
  batches: { name: string; code: string } | null;
};

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    activeStudents,
    pendingEnrollments,
    activeCourses,
    paymentSum,
    phaseRows,
    recentStudentsRes,
    weekEnrollments,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "student")
      .eq("status", "active"),
    supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("status", "submitted"),
    supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("payments")
      .select("amount_bdt")
      .eq("status", "received"),
    supabase
      .from("courses")
      .select("phase")
      .eq("is_published", true),
    supabase
      .from("profiles")
      .select(
        `id, full_name, email, status, joined_at,
         batches:batch_id ( name, code )`
      )
      .eq("role", "student")
      .order("joined_at", { ascending: false })
      .limit(6),
    supabase
      .from("enrollments")
      .select("created_at")
      .gte("created_at", new Date(Date.now() - 7 * 86400_000).toISOString()),
  ]);

  const totalRevenue =
    paymentSum.data?.reduce((sum, p) => sum + Number(p.amount_bdt ?? 0), 0) ?? 0;

  const phaseCounts = (phaseRows.data ?? []).reduce<Record<string, number>>((acc, c) => {
    acc[c.phase] = (acc[c.phase] ?? 0) + 1;
    return acc;
  }, {});
  const totalPhase = Object.values(phaseCounts).reduce((s, n) => s + n, 0);
  const phaseSplit = (Object.entries(phaseCounts) as [string, number][])
    .map(([phase, count]) => ({
      phase,
      count,
      color: phaseColors[phase] ?? "#64748b",
      pct: totalPhase ? Math.round((count / totalPhase) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const enrollmentBars = buildWeekBars(weekEnrollments.data ?? []);
  const maxBar = Math.max(...enrollmentBars.map((b) => b.value), 1);

  const recentStudents = (recentStudentsRes.data ?? []) as unknown as StudentRow[];

  const stats = [
    {
      icon: Users,
      color: "emerald",
      value: String(activeStudents.count ?? 0),
      label: "সক্রিয় ছাত্র",
      sub: pendingEnrollments.count ? `+${pendingEnrollments.count} অপেক্ষমাণ আবেদন` : "কোনো অপেক্ষমাণ আবেদন নেই",
    },
    {
      icon: BookOpen,
      color: "blue",
      value: String(activeCourses.count ?? 0),
      label: "প্রকাশিত কোর্স",
      sub: phaseSplit.length ? `${phaseSplit.length} ফেইজ` : "—",
    },
    {
      icon: TrendingUp,
      color: "amber",
      value: formatBDT(totalRevenue),
      label: "মোট প্রাপ্ত পেমেন্ট",
      sub: paymentSum.data?.length ? `${paymentSum.data.length} লেনদেন` : "এখনো কোনো লেনদেন নেই",
    },
    {
      icon: CheckCircle2,
      color: "rose",
      value: "—",
      label: "কোর্স কমপ্লিশন",
      sub: "ডেটা সংগ্রহ চলছে",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const I = s.icon;
          const tone = statTone[s.color];
          return (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tone.bg} ${tone.fg}`}>
                  <I className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-950 leading-none">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1.5">{s.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">{s.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {quickActions.map((q) => {
          const I = q.icon;
          return (
            <Link
              key={q.href}
              href={q.href}
              className="bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl px-3 py-2.5 flex items-center gap-2 transition-colors"
            >
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <I className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold text-emerald-950 truncate">{q.label}</span>
              <Plus className="w-3.5 h-3.5 text-slate-400 ml-auto shrink-0" />
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-950">সাপ্তাহিক ভর্তি আবেদন</h3>
            <span className="text-xs text-slate-500">গত ৭ দিন</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {enrollmentBars.map((b) => (
              <div key={b.day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex flex-col justify-end h-full">
                  <div
                    className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-t transition-colors"
                    style={{ height: `${(b.value / maxBar) * 100}%`, minHeight: b.value > 0 ? "4px" : "0" }}
                    title={`${b.value} আবেদন`}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-emerald-950 font-bold">{b.value}</span>
                  <span className="text-[10px] text-slate-500">{b.day}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-950">কোর্স ফেইজ</h3>
            <Link href="/dashboard/courses/" className="text-xs text-emerald-700 font-bold hover:text-emerald-900">
              সব
            </Link>
          </div>
          {phaseSplit.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">কোনো প্রকাশিত কোর্স নেই</p>
          ) : (
            <>
              <div className="flex items-center justify-center mb-4">
                <Donut slices={phaseSplit} />
              </div>
              <div className="space-y-2">
                {phaseSplit.map((p) => (
                  <div key={p.phase} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-slate-700">{p.phase}</span>
                    <span className="ml-auto font-mono text-slate-500">{p.count} · {p.pct}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-emerald-950">সাম্প্রতিক ছাত্র</h3>
          <Link
            href="/dashboard/students/"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
          >
            সব দেখুন <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        {recentStudents.length === 0 ? (
          <p className="px-5 py-8 text-xs text-slate-500 text-center">এখনো কোনো ছাত্র নেই — আবেদনকারীদের গ্রহণ করলে এখানে দেখাবে</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-y border-slate-200 bg-slate-50">
                  <th className="px-5 py-2 font-bold">ছাত্র</th>
                  <th className="px-3 py-2 font-bold">ব্যাচ</th>
                  <th className="px-3 py-2 font-bold">অবস্থা</th>
                  <th className="px-3 py-2 font-bold text-right pr-5">যোগদান</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s) => {
                  const display = s.full_name || s.email;
                  return (
                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                            {initials(display)}
                          </div>
                          <p className="text-xs font-bold text-emerald-950 leading-tight truncate">{display}</p>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-slate-600">{s.batches?.name ?? "—"}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[s.status]}`}>
                          {statusLabel[s.status]}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-slate-600 text-right pr-5 whitespace-nowrap">
                        {new Date(s.joined_at).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function formatBDT(amount: number): string {
  if (amount >= 10_000_000) return `৳ ${(amount / 10_000_000).toFixed(1)}Cr`;
  if (amount >= 100_000) return `৳ ${(amount / 100_000).toFixed(1)}L`;
  if (amount >= 1_000) return `৳ ${(amount / 1_000).toFixed(0)}K`;
  return `৳ ${amount}`;
}

function buildWeekBars(rows: { created_at: string }[]): { day: string; value: number }[] {
  const days = ["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র"];
  const counts = new Array(7).fill(0);
  const today = new Date();
  rows.forEach((r) => {
    const d = new Date(r.created_at);
    const diff = Math.floor((today.getTime() - d.getTime()) / 86_400_000);
    if (diff >= 0 && diff < 7) counts[6 - diff] += 1;
  });
  return counts.map((value, i) => ({ day: days[i], value }));
}

function Donut({ slices }: { slices: { phase: string; count: number; color: string; pct: number }[] }) {
  const cx = 60;
  const cy = 60;
  const r = 50;
  const ir = 32;
  const total = slices.reduce((s, x) => s + x.pct, 0);
  let offset = 0;
  const segments = slices.map((s) => {
    const startAngle = (offset / total) * 360 - 90;
    offset += s.pct;
    const endAngle = (offset / total) * 360 - 90;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const xi1 = cx + ir * Math.cos(startRad);
    const yi1 = cy + ir * Math.sin(startRad);
    const xi2 = cx + ir * Math.cos(endRad);
    const yi2 = cy + ir * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return {
      d: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ir} ${ir} 0 ${largeArc} 0 ${xi1} ${yi1} Z`,
      color: s.color,
      key: s.phase,
    };
  });
  const totalCount = slices.reduce((s, x) => s + x.count, 0);
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {segments.map((seg) => (
        <path key={seg.key} d={seg.d} fill={seg.color} />
      ))}
      <text x="60" y="58" textAnchor="middle" className="fill-emerald-950 text-2xl font-bold">
        {totalCount}
      </text>
      <text x="60" y="72" textAnchor="middle" className="fill-slate-500 text-[10px]">
        মডিউল
      </text>
    </svg>
  );
}
