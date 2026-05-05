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

export const metadata: Metadata = {
  title: "Admin · Dashboard",
  alternates: { canonical: "/sajdah-academy/admin/" },
  robots: { index: false, follow: false },
};

const stats = [
  { icon: Users, color: "emerald", value: "৪২", label: "সক্রিয় ছাত্র", delta: "+৬", deltaUp: true, sub: "এই মাসে" },
  { icon: BookOpen, color: "blue", value: "১২", label: "চলমান কোর্স", delta: "+১", deltaUp: true, sub: "নতুন: Tazkiya" },
  { icon: TrendingUp, color: "amber", value: "৳ ১৮.৪L", label: "রাজস্ব (এই বছর)", delta: "+১৮%", deltaUp: true, sub: "MTD: ৳৪.২L" },
  { icon: CheckCircle2, color: "rose", value: "৭৮%", label: "কোর্স কমপ্লিশন", delta: "-২%", deltaUp: false, sub: "৪ ছাত্র পিছিয়ে" },
];

const enrollmentBars = [
  { day: "শনি", value: 4 },
  { day: "রবি", value: 7 },
  { day: "সোম", value: 5 },
  { day: "মঙ্গল", value: 9 },
  { day: "বুধ", value: 6 },
  { day: "বৃহঃ", value: 11 },
  { day: "শুক্র", value: 8 },
];

const phaseSplit = [
  { phase: "Foundation", count: 4, color: "#065f46", pct: 33 },
  { phase: "Understanding", count: 4, color: "#d97706", pct: 33 },
  { phase: "Transformation", count: 4, color: "#7c3aed", pct: 34 },
];

const recentStudents = [
  { name: "Muhammad Ibrahim", id: "SA-2026-0418", batch: "ব্যাচ-৪", phase: "Foundation", status: "active", progress: 72, joined: "১২ এপ্রিল" },
  { name: "Abdul Hannan", id: "SA-2026-0419", batch: "ব্যাচ-৪", phase: "Foundation", status: "active", progress: 68, joined: "১২ এপ্রিল" },
  { name: "Tariq Aziz", id: "SA-2026-0420", batch: "ব্যাচ-৪", phase: "Foundation", status: "pending", progress: 0, joined: "৩ মে" },
  { name: "Fardin Hossain", id: "SA-2026-0421", batch: "ব্যাচ-৪", phase: "Foundation", status: "pending", progress: 0, joined: "৩ মে" },
  { name: "Sadman Khan", id: "SA-2025-0312", batch: "ব্যাচ-৩", phase: "Understanding", status: "active", progress: 88, joined: "৫ জানু" },
  { name: "Yousuf Reza", id: "SA-2025-0314", batch: "ব্যাচ-৩", phase: "Understanding", status: "inactive", progress: 24, joined: "৫ জানু" },
];

const activity = [
  { who: "মুফতি জাকারিয়া", what: "Hadith — Quiz 3 এর গ্রেড আপলোড করেছেন", when: "১৫ মিনিট আগে", icon: Activity, color: "emerald" },
  { who: "Tariq Aziz", what: "ভর্তির আবেদন জমা দিয়েছেন", when: "১ ঘণ্টা আগে", icon: Plus, color: "amber" },
  { who: "System", what: "ব্যাচ-৫ এর Routine প্রকাশিত", when: "৩ ঘণ্টা আগে", icon: Activity, color: "blue" },
  { who: "Abdul Hannan", what: "২য় কিস্তি পরিশোধ করেছেন (৳৪৫,০০০)", when: "৬ ঘণ্টা আগে", icon: TrendingUp, color: "emerald" },
  { who: "System", what: "৪ জন ছাত্র Class-3 মিস করেছেন", when: "১ দিন আগে", icon: AlertCircle, color: "rose" },
];

const quickActions = [
  { href: "/admin/students/", label: "নতুন ছাত্র", icon: Users },
  { href: "/admin/courses/", label: "নতুন কোর্স", icon: BookOpen },
  { href: "/admin/announcements/", label: "ঘোষণা পাঠান", icon: Activity },
  { href: "/admin/payments/", label: "পেমেন্ট চেক", icon: TrendingUp },
];

const statTone: Record<string, { bg: string; fg: string }> = {
  emerald: { bg: "bg-emerald-100", fg: "text-emerald-700" },
  blue: { bg: "bg-blue-100", fg: "text-blue-700" },
  amber: { bg: "bg-amber-100", fg: "text-amber-700" },
  rose: { bg: "bg-rose-100", fg: "text-rose-700" },
};

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

export default function AdminOverviewPage() {
  const maxBar = Math.max(...enrollmentBars.map((b) => b.value));

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
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    s.deltaUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {s.delta}
                </span>
              </div>
              <div className="text-2xl font-bold text-emerald-950 leading-none">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1.5">{s.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{s.sub}</div>
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
            <h3 className="font-bold text-emerald-950">সাপ্তাহিক ভর্তি</h3>
            <span className="text-xs text-slate-500">গত ৭ দিন</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {enrollmentBars.map((b) => (
              <div key={b.day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex flex-col justify-end h-full">
                  <div
                    className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-t transition-colors"
                    style={{ height: `${(b.value / maxBar) * 100}%` }}
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
            <Link href="/admin/courses/" className="text-xs text-emerald-700 font-bold hover:text-emerald-900">
              সব
            </Link>
          </div>
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
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-5 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-emerald-950">সাম্প্রতিক ছাত্র</h3>
            <Link
              href="/admin/students/"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
            >
              সব দেখুন <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-y border-slate-200 bg-slate-50">
                  <th className="px-5 py-2 font-bold">ছাত্র</th>
                  <th className="px-3 py-2 font-bold">ব্যাচ</th>
                  <th className="px-3 py-2 font-bold">অবস্থা</th>
                  <th className="px-3 py-2 font-bold">প্রগ্রেস</th>
                  <th className="px-3 py-2 font-bold text-right pr-5">যোগদান</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                          {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-950 leading-tight">{s.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{s.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-600">{s.batch}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[s.status]}`}>
                        {statusLabel[s.status]}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              s.progress >= 75 ? "bg-emerald-600" : s.progress >= 40 ? "bg-blue-600" : "bg-amber-500"
                            }`}
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 w-7 text-right">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-600 text-right pr-5 whitespace-nowrap">{s.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-950">কার্যক্রম</h3>
            <span className="text-xs text-slate-500">Live</span>
          </div>
          <div className="space-y-3">
            {activity.map((a, i) => {
              const I = a.icon;
              const tone = statTone[a.color];
              return (
                <div key={i} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tone.bg} ${tone.fg}`}>
                    <I className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug">
                      <span className="font-bold text-emerald-950">{a.who}</span>{" "}
                      <span className="text-slate-700">{a.what}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">{a.when}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
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
