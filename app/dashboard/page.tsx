import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  BookOpen,
  ClipboardCheck,
  Award,
  Calendar,
  GraduationCap,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Mail,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { asset } from "../lib/asset";

const title = "Student Portal — Preview";
const description =
  "Sajdah Academy student dashboard preview — যেভাবে ভর্তির পর আপনার পোর্টাল দেখাবে। কোর্স প্রগ্রেস, অ্যাসাইনমেন্ট, রুটিন, মূল্যায়ন।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sajdah-academy/dashboard/" },
  robots: { index: false, follow: false },
};

const nav = [
  { id: "dashboard", label: "ড্যাশবোর্ড", labelEn: "Dashboard", icon: LayoutDashboard, active: true },
  { id: "profile", label: "আমার প্রোফাইল", labelEn: "My Profile", icon: User },
  { id: "modules", label: "আমার মডিউল", labelEn: "My Modules", icon: BookOpen, badge: "৪" },
  { id: "assignments", label: "অ্যাসাইনমেন্ট", labelEn: "Assignments", icon: ClipboardCheck, badge: "৩" },
  { id: "grades", label: "মূল্যায়ন", labelEn: "Evaluations", icon: Award },
  { id: "schedule", label: "রুটিন", labelEn: "Schedule", icon: Calendar },
  { id: "certificates", label: "সার্টিফিকেট", labelEn: "Certificates", icon: GraduationCap },
  { id: "messages", label: "বার্তা", labelEn: "Messages", icon: MessageSquare, badge: "২" },
  { id: "settings", label: "সেটিংস", labelEn: "Settings", icon: Settings },
];

const modules = [
  {
    title: "Iman & Aqidah",
    titleBn: "ঈমান ও আক্বীদা",
    teacher: "মাওলানা আবদুল্লাহ মাহমুদ",
    lessons: "৪ ক্লাস · ৬ ঘণ্টা",
    progress: 82,
    status: "চলমান",
    statusKey: "active",
  },
  {
    title: "Hadith e Mubarakah",
    titleBn: "হাদীস ই মুবারকা",
    teacher: "মুফতি জাকারিয়া হোসাইন",
    lessons: "৪ ক্লাস · ৬ ঘণ্টা",
    progress: 58,
    status: "অগ্রসর",
    statusKey: "in-progress",
  },
  {
    title: "Fiqh-2 (ইবাদাত)",
    titleBn: "ইবাদতের বিধান",
    teacher: "মুফতি জাকারিয়া হোসাইন",
    lessons: "৪ ক্লাস · ৮ ঘণ্টা",
    progress: 34,
    status: "শুরু",
    statusKey: "behind",
  },
  {
    title: "Tazkiya (Islahun Nafs)",
    titleBn: "আত্মশুদ্ধি",
    teacher: "ড. ইমরান হাসান",
    lessons: "৪ ক্লাস · ৬ ঘণ্টা",
    progress: 100,
    status: "সম্পন্ন",
    statusKey: "complete",
  },
];

const assignments = [
  {
    title: "২০ হাদীস মুখস্থ — পরীক্ষা",
    due: "আগামীকাল",
    course: "Hadith e Mubarakah",
    urgency: "urgent",
  },
  {
    title: "সিরাহ — মাক্কী জীবন রিফ্লেকশন",
    due: "৮ মে",
    course: "Usuwatun Hasanah",
    urgency: "soon",
  },
  {
    title: "ফিকহ-২ — ইবাদাত মূল্যায়ন কুইজ",
    due: "১০ মে",
    course: "Fiqh-2",
    urgency: "pending",
  },
];

/* Friday at the resort — Sajdah's actual class day */
const todaySchedule = [
  {
    time: "৪:৩০ AM",
    title: "তাহাজ্জুদ + Class-2",
    sub: "self-crying moment · Hall A · মাওলানা আবদুল্লাহ",
    color: "emerald",
  },
  {
    time: "৬:৩০ AM",
    title: "Class-3 — Hadith Study",
    sub: "Hall A · মুফতি জাকারিয়া",
    color: "purple",
  },
  {
    time: "২:১৫ PM",
    title: "Class-4 — Fiqh-2 Ibadat",
    sub: "Hall A · মুফতি জাকারিয়া",
    color: "amber",
  },
  {
    time: "৭:০০ PM",
    title: "Class-5 — Tazkiyah",
    sub: "Hall A · ড. ইমরান হাসান",
    color: "rose",
  },
];

const grades = [
  { course: "Iman & Aqidah", task: "Mid-evaluation", grade: "A", score: "৯৪%", color: "emerald" },
  { course: "Hadith — Memorization Quiz 3", task: "", grade: "B+", score: "৮৭%", color: "purple" },
  { course: "Fiqh-2 — Knowledge Quiz 2", task: "", grade: "B", score: "৭৬%", color: "amber" },
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

const urgencyDot: Record<string, string> = {
  urgent: "bg-rose-500",
  soon: "bg-amber-500",
  pending: "bg-blue-500",
};

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
    <main className="pt-20 pb-12 bg-slate-100 min-h-screen">
      {/* Preview banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
          <span className="bg-amber-500 text-emerald-950 font-bold text-xs px-2 py-1 rounded uppercase tracking-wider shrink-0">
            Preview
          </span>
          <p className="text-amber-900 leading-snug">
            <span className="font-bold">এটি একটি পূর্বরূপ।</span> ভর্তির পর আপনার ব্যক্তিগত
            ড্যাশবোর্ডে আপনার মডিউল প্রগ্রেস, অ্যাসাইনমেন্ট, রুটিন ও মূল্যায়ন দেখতে পাবেন।
          </p>
          <Link
            href="/enroll/"
            className="ml-auto shrink-0 inline-flex items-center gap-1 text-amber-900 hover:text-emerald-700 font-bold whitespace-nowrap"
          >
            Enroll <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg shadow-emerald-950/5 min-h-[700px]">
          {/* Sidebar */}
          <aside className="w-56 bg-slate-50 border-r border-slate-200 flex-col hidden md:flex">
            <div className="h-14 flex items-center gap-3 px-4 border-b border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset("/medallion-128.webp")}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-sm font-bold text-emerald-950">Sajdah Portal</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-2">
              <p className="px-3 pt-3 pb-1 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                Overview
              </p>
              {nav.slice(0, 2).map((n) => {
                const I = n.icon;
                return (
                  <div
                    key={n.id}
                    className={`mx-2 mb-0.5 px-2.5 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer transition-colors ${
                      n.active
                        ? "bg-emerald-100 text-emerald-700 font-medium"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <I className="w-4 h-4 shrink-0" />
                    <span>{n.labelEn}</span>
                  </div>
                );
              })}

              <p className="px-3 pt-4 pb-1 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                Learning
              </p>
              {nav.slice(2, 6).map((n) => {
                const I = n.icon;
                return (
                  <div
                    key={n.id}
                    className="mx-2 mb-0.5 px-2.5 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer text-slate-600 hover:bg-slate-100"
                  >
                    <I className="w-4 h-4 shrink-0" />
                    <span>{n.labelEn}</span>
                    {n.badge && (
                      <span className="ml-auto bg-emerald-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full px-1.5 flex items-center justify-center">
                        {n.badge}
                      </span>
                    )}
                  </div>
                );
              })}

              <p className="px-3 pt-4 pb-1 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                Other
              </p>
              {nav.slice(6).map((n) => {
                const I = n.icon;
                return (
                  <div
                    key={n.id}
                    className="mx-2 mb-0.5 px-2.5 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer text-slate-600 hover:bg-slate-100"
                  >
                    <I className="w-4 h-4 shrink-0" />
                    <span>{n.labelEn}</span>
                    {n.badge && (
                      <span className="ml-auto bg-emerald-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full px-1.5 flex items-center justify-center">
                        {n.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="border-t border-slate-200 p-3 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                MI
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-emerald-950 truncate">Muhammad Ibrahim</p>
                <p className="text-[11px] text-slate-500">Student · Foundation</p>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Topbar */}
            <div className="h-14 px-5 border-b border-slate-200 flex items-center gap-3 bg-white">
              <span className="font-medium text-slate-900">ড্যাশবোর্ড</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-500 min-w-[180px]">
                  <Search className="w-3 h-3" />
                  <span>মডিউল খুঁজুন...</span>
                </div>
                <button
                  type="button"
                  className="relative w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 text-slate-700" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                </button>
                <Link
                  href="/courses/"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                >
                  Browse modules <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Profile banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-base font-bold shrink-0">
                  MI
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-emerald-950">Muhammad Ibrahim</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Student ID: SA-2026-0418 · Foundation Phase · ব্যাচ-৪
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="w-3 h-3" />
                      ibrahim@sajdah-alumni.org
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      Dhaka, Bangladesh
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

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                <MiniStat value="৮২%" label="সামগ্রিক প্রগ্রেস" />
                <MiniStat value="৩" label="এই সপ্তাহে অ্যাসাইনমেন্ট" color="text-amber-700" />
                <MiniStat value="১২" label="দিন একটানা তাহাজ্জুদ" color="text-emerald-700" />
              </div>

              {/* Two columns */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Modules */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-emerald-950">আমার মডিউল</h3>
                    <Link
                      href="/courses/"
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                    >
                      সব দেখুন <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {modules.map((m) => (
                      <div
                        key={m.title}
                        className="flex items-center gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                      >
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset("/medallion-128.webp")}
                            alt=""
                            width={28}
                            height={28}
                            className="w-7 h-7 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-emerald-950 leading-tight">
                            {m.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {m.teacher} · {m.lessons}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[m.statusKey]}`}
                          >
                            {m.status}
                          </span>
                          <div className="w-20 h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${progressBar[m.statusKey]}`}
                              style={{ width: `${m.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right column: Assignments + Schedule + Grades */}
                <div className="space-y-4">
                  {/* Assignments */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-emerald-950">আসন্ন অ্যাসাইনমেন্ট</h3>
                      <span className="text-[11px] text-slate-500">এই সপ্তাহ</span>
                    </div>
                    <div className="space-y-2.5">
                      {assignments.map((a) => (
                        <div key={a.title} className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${urgencyDot[a.urgency]}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-emerald-950 leading-tight">
                              {a.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Due {a.due} · {a.course}
                            </p>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${urgencyBadge[a.urgency]}`}
                          >
                            {a.urgency === "urgent" ? "জরুরি" : a.urgency === "soon" ? "শীঘ্রই" : "অপেক্ষমাণ"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-emerald-950">আজকের রুটিন</h3>
                      <span className="text-[11px] text-slate-500">শুক্রবার, ৮ মে</span>
                    </div>
                    <div className="space-y-2.5">
                      {todaySchedule.map((s) => (
                        <div key={s.time} className="flex items-start gap-2.5">
                          <span className="text-[11px] font-mono text-slate-500 min-w-[60px] pt-0.5">
                            {s.time}
                          </span>
                          <div className={`w-1 rounded-full self-stretch ${scheduleColor[s.color]}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-emerald-950 leading-tight">
                              {s.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{s.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grades */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-emerald-950">সাম্প্রতিক মূল্যায়ন</h3>
                      <Link
                        href="#"
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                      >
                        পূর্ণ রিপোর্ট <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="space-y-2.5">
                      {grades.map((g, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded bg-emerald-50 flex items-center justify-center shrink-0 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={asset("/medallion-128.webp")}
                              alt=""
                              width={16}
                              height={16}
                              className="w-4 h-4 object-contain"
                            />
                          </div>
                          <span className="flex-1 text-xs text-slate-600 truncate">
                            {g.course}
                            {g.task && ` — ${g.task}`}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                              g.color === "emerald"
                                ? "bg-emerald-100 text-emerald-700"
                                : g.color === "amber"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {g.grade}
                          </span>
                          <span className="text-xs font-mono font-medium text-emerald-950 min-w-[36px] text-right">
                            {g.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Below-the-fold CTA */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 mb-4">
            এই ড্যাশবোর্ড পেতে চান? আমাদের পরবর্তী ব্যাচে ভর্তি হোন।
          </p>
          <Link
            href="/enroll/"
            className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg active:scale-[0.98]"
          >
            Apply for Enrollment →
          </Link>
        </div>
      </div>
    </main>
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
