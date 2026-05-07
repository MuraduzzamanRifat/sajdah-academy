"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ChevronRight,
  Heart,
  Library,
  CreditCard,
  Megaphone,
  CheckSquare,
  Menu,
  X,
} from "lucide-react";
import MedallionMark from "../../components/MedallionMark";

type NavItem = {
  href: string;
  label: string;
  labelEn: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Overview",
    items: [
      { href: "/student-dashboard/", label: "ড্যাশবোর্ড", labelEn: "Dashboard", icon: LayoutDashboard },
      { href: "/student-dashboard/profile/", label: "আমার প্রোফাইল", labelEn: "My Profile", icon: User },
    ],
  },
  {
    group: "Learning",
    items: [
      { href: "/student-dashboard/modules/", label: "আমার মডিউল", labelEn: "My Modules", icon: BookOpen, badge: "৪" },
      { href: "/student-dashboard/assignments/", label: "অ্যাসাইনমেন্ট", labelEn: "Assignments", icon: ClipboardCheck, badge: "৩" },
      { href: "/student-dashboard/grades/", label: "মূল্যায়ন", labelEn: "Grades", icon: Award },
      { href: "/student-dashboard/schedule/", label: "রুটিন", labelEn: "Schedule", icon: Calendar },
      { href: "/student-dashboard/library/", label: "রিসোর্স", labelEn: "Library", icon: Library },
    ],
  },
  {
    group: "Spiritual & Tracking",
    items: [
      { href: "/student-dashboard/spiritual/", label: "আমল ট্র্যাকার", labelEn: "Spiritual Tracker", icon: Heart },
      { href: "/student-dashboard/attendance/", label: "উপস্থিতি", labelEn: "Attendance", icon: CheckSquare },
    ],
  },
  {
    group: "Account",
    items: [
      { href: "/student-dashboard/payments/", label: "পেমেন্ট", labelEn: "Payments", icon: CreditCard },
      { href: "/student-dashboard/certificates/", label: "সার্টিফিকেট", labelEn: "Certificates", icon: GraduationCap },
      { href: "/student-dashboard/announcements/", label: "ঘোষণা", labelEn: "Announcements", icon: Megaphone, badge: "৫" },
      { href: "/student-dashboard/messages/", label: "বার্তা", labelEn: "Messages", icon: MessageSquare, badge: "২" },
      { href: "/student-dashboard/settings/", label: "সেটিংস", labelEn: "Settings", icon: Settings },
    ],
  },
];

/* Single source of truth for in-app page titles.
   Keeps the topbar in sync with the sidebar without per-page prop drilling. */
const TITLES: Record<string, string> = Object.fromEntries(
  NAV.flatMap((g) => g.items.map((i) => [i.href, `${i.label} · ${i.labelEn}`]))
);

export type StudentMe = {
  name: string;
  email: string;
  initials: string;
  batchName: string | null;
  studentId: string | null;
  status: string | null;
};

export default function DashboardShell({
  me,
  children,
}: {
  me: StudentMe;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const title = TITLES[pathname ?? "/student-dashboard/"] ?? "ড্যাশবোর্ড";

  /* Show a "preview" banner only when no batch is assigned yet — i.e.
     the user is signed in but enrollment hasn't been processed. Active
     students don't need to see this. */
  const isPreview = !me.batchName;

  return (
    <main className="pt-20 pb-12 bg-slate-100 min-h-screen">
      {isPreview && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
            <span className="bg-amber-500 text-emerald-950 font-bold text-xs px-2 py-1 rounded uppercase tracking-wider shrink-0">
              Preview
            </span>
            <p className="text-amber-900 leading-snug">
              <span className="font-bold">এখনো কোনো ব্যাচে এনরোল নেই।</span> ভর্তি অনুমোদিত হলে আপনার পোর্টাল সম্পূর্ণ ফিচার দেখাবে।
            </p>
            <Link
              href="/enroll/"
              className="ml-auto shrink-0 inline-flex items-center gap-1 text-amber-900 hover:text-emerald-700 font-bold whitespace-nowrap"
            >
              Apply <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg shadow-emerald-950/5 min-h-[700px] relative">
          {/* Sidebar */}
          <aside
            className={`absolute md:relative inset-y-0 left-0 z-30 w-56 bg-slate-50 border-r border-slate-200 flex-col transform transition-transform md:transform-none ${
              open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            } md:flex flex`}
          >
            <div className="h-14 flex items-center gap-3 px-4 border-b border-slate-200 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center overflow-hidden">
                <MedallionMark size={24} className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-emerald-950">Sajdah Portal</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto md:hidden p-1 text-slate-500 hover:text-slate-900"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {NAV.map((g) => (
                <div key={g.group}>
                  <p className="px-3 pt-3 pb-1 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                    {g.group}
                  </p>
                  {g.items.map((n) => {
                    const I = n.icon;
                    const active = pathname === n.href;
                    return (
                      <Link
                        key={n.href}
                        href={n.href}
                        onClick={() => setOpen(false)}
                        className={`mx-2 mb-0.5 px-2.5 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                          active
                            ? "bg-emerald-100 text-emerald-700 font-medium"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <I className="w-4 h-4 shrink-0" />
                        <span>{n.labelEn}</span>
                        {n.badge && (
                          <span className="ml-auto bg-emerald-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full px-1.5 flex items-center justify-center">
                            {n.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
            <div className="border-t border-slate-200 p-3 flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                {me.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-emerald-950 truncate">{me.name}</p>
                <p className="text-[11px] text-slate-500 truncate">
                  {me.batchName ? `${me.batchName}` : "Pending enrollment"}
                  {me.studentId ? ` · ${me.studentId}` : ""}
                </p>
              </div>
            </div>
          </aside>

          {open && (
            <div
              aria-hidden
              className="absolute inset-0 bg-emerald-950/40 z-20 md:hidden"
              onClick={() => setOpen(false)}
            />
          )}

          {/* Main */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="h-14 px-5 border-b border-slate-200 flex items-center gap-3 bg-white">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="md:hidden p-1 text-slate-700"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-medium text-slate-900">{title}</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-500 min-w-[180px]">
                  <Search className="w-3 h-3" />
                  <span>খুঁজুন...</span>
                </div>
                <Link
                  href="/student-dashboard/announcements/"
                  className="relative w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 text-slate-700" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                </Link>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </div>
        </div>

        {isPreview && (
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              এই পোর্টাল পেতে চান? পরবর্তী ব্যাচে ভর্তি হোন।{" "}
              <Link href="/enroll/" className="text-emerald-700 font-bold hover:text-emerald-900 underline">
                Apply →
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
