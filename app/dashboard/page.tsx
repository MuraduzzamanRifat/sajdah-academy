import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, ChevronRight, Heart, Moon, BookOpen, AlertCircle, Megaphone } from "lucide-react";
import MedallionMark from "../components/MedallionMark";

export const metadata: Metadata = {
  title: "Student Portal — Preview",
  description:
    "Sajdah Academy student dashboard preview — কোর্স প্রগ্রেস, অ্যাসাইনমেন্ট, রুটিন, আমল ট্র্যাকার, পেমেন্ট।",
  alternates: { canonical: "/dashboard/" },
  robots: { index: false, follow: false },
};

const modules = [
  { title: "Iman & Aqidah", titleBn: "ঈমান ও আক্বীদা", teacher: "মাওলানা আবদুল্লাহ মাহমুদ", lessons: "৪ ক্লাস · ৬ ঘণ্টা", progress: 82, statusKey: "active", status: "চলমান" },
  { title: "Hadith e Mubarakah", titleBn: "হাদীস ই মুবারকা", teacher: "মুফতি জাকারিয়া হোসাইন", lessons: "৪ ক্লাস · ৬ ঘণ্টা", progress: 58, statusKey: "in-progress", status: "অগ্রসর" },
  { title: "Fiqh-2 (ইবাদাত)", titleBn: "ইবাদতের বিধান", teacher: "মুফতি জাকারিয়া হোসাইন", lessons: "৪ ক্লাস · ৮ ঘণ্টা", progress: 34, statusKey: "behind", status: "পিছিয়ে" },
  { title: "Tazkiya", titleBn: "আত্মশুদ্ধি", teacher: "ড. ইমরান হাসান", lessons: "৪ ক্লাস · ৬ ঘণ্টা", progress: 100, statusKey: "complete", status: "সম্পন্ন" },
];

const assignments = [
  { title: "২০ হাদীস মুখস্থ — পরীক্ষা", due: "আগামীকাল", course: "Hadith", urgency: "urgent", urgencyLabel: "জরুরি" },
  { title: "সিরাহ — মাক্কী জীবন রিফ্লেকশন", due: "৮ মে", course: "Sirah", urgency: "soon", urgencyLabel: "শীঘ্রই" },
  { title: "ফিকহ-২ — ইবাদাত মূল্যায়ন কুইজ", due: "১০ মে", course: "Fiqh-2", urgency: "pending", urgencyLabel: "অপেক্ষমাণ" },
];

const todaySchedule = [
  { time: "৪:৩০ AM", title: "তাহাজ্জুদ + Class-2", sub: "Hall A · মাওলানা আবদুল্লাহ", color: "emerald" },
  { time: "৬:৩০ AM", title: "Class-3 — Hadith", sub: "Hall A · মুফতি জাকারিয়া", color: "purple" },
  { time: "২:১৫ PM", title: "Class-4 — Fiqh-2", sub: "Hall A · মুফতি জাকারিয়া", color: "amber" },
  { time: "৭:০০ PM", title: "Class-5 — Tazkiyah", sub: "Hall A · ড. ইমরান হাসান", color: "rose" },
];

const grades = [
  { course: "Iman & Aqidah — Mid-evaluation", grade: "A", score: "৯৪%", color: "emerald" },
  { course: "Hadith — Memorization Quiz 3", grade: "B+", score: "৮৭%", color: "purple" },
  { course: "Fiqh-2 — Knowledge Quiz 2", grade: "B", score: "৭৬%", color: "amber" },
];

const announcements = [
  { date: "২ ঘণ্টা আগে", title: "ব্যাচ-৪ এর সমাপনী রিট্রিট", body: "৫ জুন গাজীপুর রিসোর্টে।", type: "event" },
  { date: "গতকাল", title: "তাহাজ্জুদ স্টিক রিমাইন্ডার", body: "টিম ১২+ দিন স্ট্রিকে — মাশাআল্লাহ!", type: "info" },
];

const statusBadge: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  "in-progress": "bg-blue-100 text-blue-700",
  behind: "bg-amber-100 text-amber-700",
  complete: "bg-emerald-100 text-emerald-700",
};
const progressBar: Record<string, string> = {
  active: "bg-emerald-600",
  "in-progress": "bg-blue-600",
  behind: "bg-amber-500",
  complete: "bg-emerald-600",
};
const urgencyDot: Record<string, string> = { urgent: "bg-rose-500", soon: "bg-amber-500", pending: "bg-blue-500" };
const urgencyBadge: Record<string, string> = {
  urgent: "bg-rose-100 text-rose-700",
  soon: "bg-amber-100 text-amber-700",
  pending: "bg-blue-100 text-blue-700",
};
const scheduleColor: Record<string, string> = {
  emerald: "bg-emerald-600",
  purple: "bg-purple-600",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export default function DashboardPage() {
  return (
    <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-base font-bold shrink-0">
            MI
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-emerald-950">Muhammad Ibrahim</h2>
            <p className="text-xs text-slate-500 mt-0.5">SA-2026-0418 · Foundation Phase · ব্যাচ-৪</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> ibrahim@sajdah-alumni.org
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> Dhaka, Bangladesh
              </span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 md:gap-6 ml-auto w-full md:w-auto">
            <Stat value="৭২%" label="অগ্রগতি" color="text-emerald-700" />
            <Stat value="৪" label="মডিউল" />
            <Stat value="১" label="সার্টিফিকেট" color="text-amber-700" />
            <Stat value="৯৩%" label="উপস্থিতি" />
          </div>
        </div>
        <Link
          href="/dashboard/payments/"
          className="block bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center gap-3 hover:bg-amber-100 transition-colors"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-900">২য় কিস্তি বকেয়া · ৳ ৪৫,০০০</p>
            <p className="text-xs text-amber-700">পরিশোধের শেষ তারিখ: ১৫ মে ২০২৬ (১০ দিন বাকি)</p>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-600 shrink-0" />
        </Link>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniStat value="৮২%" label="সামগ্রিক প্রগ্রেস" />
          <MiniStat value="৩" label="এই সপ্তাহের অ্যাসাইনমেন্ট" color="text-amber-700" />
          <MiniStat value="১২" label="দিন একটানা তাহাজ্জুদ" color="text-emerald-700" />
          <MiniStat value="৯৩%" label="উপস্থিতি" color="text-emerald-700" />
        </div>
        <div className="bg-emerald-900 text-white rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-400" />
              আজকের আমল
            </h3>
            <Link
              href="/dashboard/spiritual/"
              className="text-xs text-amber-300 hover:text-amber-200 font-medium inline-flex items-center gap-1"
            >
              পূর্ণ ট্র্যাকার <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[
              { name: "ফজর", done: true },
              { name: "যোহর", done: true },
              { name: "আসর", done: true },
              { name: "মাগরিব", done: false },
              { name: "এশা", done: false },
            ].map((p) => (
              <div
                key={p.name}
                className={`text-center py-2 rounded-lg border ${
                  p.done
                    ? "bg-emerald-700/50 border-emerald-600 text-emerald-100"
                    : "bg-emerald-950/40 border-emerald-800 text-emerald-400"
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider">{p.name}</div>
                <div className="text-sm mt-1">{p.done ? "✓" : "—"}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span>তাহাজ্জুদ: ১২ দিন স্ট্রিক</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-200">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>কুরআন: ২ পৃষ্ঠা/দিন</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Heart className="w-3.5 h-3.5 text-amber-400" />
              <span>আদকার: ৩/৫</span>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <SectionHeader title="আমার মডিউল" link="/dashboard/modules/" linkText="সব দেখুন" />
            <div className="space-y-3">
              {modules.map((m) => (
                <div key={m.title} className="flex items-center gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 overflow-hidden">
                    <MedallionMark size={28} className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-emerald-950 leading-tight">{m.title}</p>
                    <p className="text-[11px] text-slate-500">{m.teacher} · {m.lessons}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[m.statusKey]}`}>
                      {m.status}
                    </span>
                    <div className="w-20 h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${progressBar[m.statusKey]}`} style={{ width: `${m.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <SectionHeader title="আসন্ন অ্যাসাইনমেন্ট" link="/dashboard/assignments/" linkText="সব" />
              <div className="space-y-2.5">
                {assignments.map((a) => (
                  <div key={a.title} className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${urgencyDot[a.urgency]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-emerald-950 leading-tight">{a.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Due {a.due} · {a.course}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${urgencyBadge[a.urgency]}`}>
                      {a.urgencyLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <SectionHeader title="আজকের রুটিন" link="/dashboard/schedule/" linkText="ক্যালেন্ডার" />
              <div className="space-y-2.5">
                {todaySchedule.map((s) => (
                  <div key={s.time} className="flex items-start gap-2.5">
                    <span className="text-[11px] font-mono text-slate-500 min-w-[60px] pt-0.5">{s.time}</span>
                    <div className={`w-1 rounded-full self-stretch ${scheduleColor[s.color]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-emerald-950 leading-tight">{s.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <SectionHeader title="ঘোষণা" link="/dashboard/announcements/" linkText="সব ঘোষণা" />
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.title} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-emerald-950 leading-tight">{a.title}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{a.body}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <SectionHeader title="সাম্প্রতিক মূল্যায়ন" link="/dashboard/grades/" linkText="পূর্ণ রিপোর্ট" />
            <div className="space-y-2.5">
              {grades.map((g, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded bg-emerald-50 flex items-center justify-center shrink-0 overflow-hidden">
                    <MedallionMark size={16} className="w-4 h-4" />
                  </div>
                  <span className="flex-1 text-xs text-slate-600 truncate">{g.course}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    g.color === "emerald" ? "bg-emerald-100 text-emerald-700" :
                    g.color === "amber" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {g.grade}
                  </span>
                  <span className="text-xs font-mono font-medium text-emerald-950 min-w-[36px] text-right">{g.score}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, link, linkText }: { title: string; link: string; linkText: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-bold text-emerald-950">{title}</h3>
      <Link href={link} className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1">
        {linkText} <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

function Stat({ value, label, color = "text-emerald-950" }: { value: string; label: string; color?: string }) {
  return (
    <div className="text-center">
      <div className={`text-xl font-bold leading-none ${color}`}>{value}</div>
      <div className="text-[10px] text-slate-500 mt-1.5">{label}</div>
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
