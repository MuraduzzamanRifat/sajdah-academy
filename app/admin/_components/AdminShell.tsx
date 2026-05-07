"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "../../components/SignOutButton";
import { initials } from "../../../lib/initials";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  GraduationCap,
  BookOpen,
  Layers,
  ClipboardCheck,
  Award,
  Calendar,
  CheckSquare,
  CreditCard,
  Megaphone,
  MessageSquare,
  Library,
  FileBadge,
  PenSquare,
  FileText,
  Image as ImageIcon,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
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
      { href: "/dashboard/", label: "ড্যাশবোর্ড", labelEn: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "People",
    items: [
      { href: "/dashboard/students/", label: "ছাত্র", labelEn: "Students", icon: Users, badge: "৪২" },
      { href: "/dashboard/enrollments/", label: "ভর্তি আবেদন", labelEn: "Enrollments", icon: UserPlus, badge: "৯" },
      { href: "/dashboard/instructors/", label: "শিক্ষক", labelEn: "Instructors", icon: GraduationCap },
    ],
  },
  {
    group: "Academic",
    items: [
      { href: "/dashboard/courses/", label: "কোর্স", labelEn: "Courses", icon: BookOpen },
      { href: "/dashboard/batches/", label: "ব্যাচ", labelEn: "Batches", icon: Layers },
      { href: "/dashboard/assignments/", label: "অ্যাসাইনমেন্ট", labelEn: "Assignments", icon: ClipboardCheck },
      { href: "/dashboard/grades/", label: "মূল্যায়ন", labelEn: "Grades", icon: Award },
      { href: "/dashboard/schedule/", label: "রুটিন", labelEn: "Schedule", icon: Calendar },
      { href: "/dashboard/attendance/", label: "উপস্থিতি", labelEn: "Attendance", icon: CheckSquare },
    ],
  },
  {
    group: "Operations",
    items: [
      { href: "/dashboard/payments/", label: "পেমেন্ট", labelEn: "Payments", icon: CreditCard, badge: "₹" },
      { href: "/dashboard/certificates/", label: "সার্টিফিকেট", labelEn: "Certificates", icon: FileBadge },
      { href: "/dashboard/announcements/", label: "ঘোষণা", labelEn: "Announcements", icon: Megaphone },
      { href: "/dashboard/messages/", label: "বার্তা", labelEn: "Messages", icon: MessageSquare, badge: "৭" },
      { href: "/dashboard/library/", label: "রিসোর্স", labelEn: "Library", icon: Library },
    ],
  },
  {
    group: "Content (CMS)",
    items: [
      { href: "/dashboard/blog/", label: "ব্লগ", labelEn: "Blog", icon: PenSquare },
      { href: "/dashboard/pages/", label: "পেজ", labelEn: "Pages", icon: FileText },
      { href: "/dashboard/gallery/", label: "গ্যালারি", labelEn: "Gallery", icon: ImageIcon },
    ],
  },
  {
    group: "System",
    items: [
      { href: "/dashboard/settings/", label: "সেটিংস", labelEn: "Settings", icon: Settings },
    ],
  },
];

const TITLES: Record<string, string> = Object.fromEntries(
  NAV.flatMap((g) => g.items.map((i) => [i.href, `${i.label} · ${i.labelEn}`]))
);

type CurrentUser = { name: string; email: string; role: string };

export default function AdminShell({
  children,
  me,
}: {
  children: React.ReactNode;
  me: CurrentUser;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const title = TITLES[pathname ?? "/dashboard/"] ?? "Admin";

  return (
    <main className="pt-6 pb-12 bg-slate-100 min-h-screen">
      {/* Skip to main content — keyboard a11y. Hidden until tab-focused. */}
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-950 focus:text-white focus:rounded-lg focus:ring-2 focus:ring-amber-400"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="bg-emerald-950 text-white rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm border border-emerald-900">
          <span className="relative flex w-2 h-2 shrink-0" aria-hidden>
            <span className="animate-ping absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
          </span>
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="bg-amber-500 text-emerald-950 font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
            Live · Secure
          </span>
          <p className="text-emerald-200 leading-snug min-w-0 truncate text-xs hidden md:block">
            All mutations audit-logged · RLS enforced · Session encrypted
          </p>
          <p className="text-emerald-200 text-xs md:hidden truncate">Audit-logged</p>
          <Link
            href="https://sijdahacademy.com/student-dashboard/"
            className="ml-auto shrink-0 inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold whitespace-nowrap text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-emerald-950 rounded px-1"
          >
            Student view <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg shadow-emerald-950/5 min-h-[700px] relative">
          <aside
            className={`absolute md:relative inset-y-0 left-0 z-30 w-60 bg-emerald-950 border-r border-emerald-900 flex-col transform transition-transform md:transform-none ${
              open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            } md:flex flex`}
          >
            <div className="h-14 flex items-center gap-3 px-4 border-b border-emerald-900 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center overflow-hidden">
                <MedallionMark size={24} className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-none">Sajdah Admin</p>
                <p className="text-[10px] text-emerald-300 mt-1">CMS · Operations</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto md:hidden p-1 text-emerald-300 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {NAV.map((g) => (
                <div key={g.group}>
                  <p className="px-3 pt-3 pb-1 text-[10px] font-bold tracking-widest uppercase text-emerald-400">
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
                        className={`mx-2 mb-0.5 px-2.5 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950 ${
                          active
                            ? "bg-amber-500 text-emerald-950 font-bold"
                            : "text-emerald-100 hover:bg-emerald-900"
                        }`}
                      >
                        <I className="w-4 h-4 shrink-0" />
                        <span className="truncate">{n.labelEn}</span>
                        {n.badge && (
                          <span
                            className={`ml-auto text-[10px] font-bold min-w-[18px] h-[18px] rounded-full px-1.5 flex items-center justify-center ${
                              active ? "bg-emerald-950 text-amber-400" : "bg-amber-500 text-emerald-950"
                            }`}
                          >
                            {n.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
            <div className="border-t border-emerald-900 p-3 flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-emerald-950 flex items-center justify-center font-bold text-xs shrink-0">
                {initials(me.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{me.name}</p>
                <p className="text-[11px] text-emerald-300 capitalize">{me.role.replace("_", " ")}</p>
              </div>
              <SignOutButton
                className="p-1.5 text-emerald-300 hover:text-amber-400 rounded shrink-0"
              />
            </div>
          </aside>

          {open && (
            <div
              aria-hidden
              className="absolute inset-0 bg-emerald-950/40 z-20 md:hidden"
              onClick={() => setOpen(false)}
            />
          )}

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
              <span className="font-bold text-emerald-950">{title}</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-500 min-w-[180px]">
                  <Search className="w-3 h-3" />
                  <span>খুঁজুন · ছাত্র, কোর্স, পেমেন্ট...</span>
                </div>
                <button
                  type="button"
                  className="relative w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 text-slate-700" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                </button>
              </div>
            </div>
            <main id="admin-main" className="flex-1 overflow-y-auto p-5 bg-slate-50">
              {children}
            </main>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>RLS-protected · Audit-logged · Signed in as <span className="font-bold text-emerald-700">{me.email}</span></span>
        </div>
      </div>
    </main>
  );
}
