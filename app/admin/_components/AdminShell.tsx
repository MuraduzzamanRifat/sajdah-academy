"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";
import SignOutButton from "../../components/SignOutButton";
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
      { href: "/admin/", label: "ড্যাশবোর্ড", labelEn: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "People",
    items: [
      { href: "/admin/students/", label: "ছাত্র", labelEn: "Students", icon: Users, badge: "৪২" },
      { href: "/admin/enrollments/", label: "ভর্তি আবেদন", labelEn: "Enrollments", icon: UserPlus, badge: "৯" },
      { href: "/admin/instructors/", label: "শিক্ষক", labelEn: "Instructors", icon: GraduationCap },
    ],
  },
  {
    group: "Academic",
    items: [
      { href: "/admin/courses/", label: "কোর্স", labelEn: "Courses", icon: BookOpen },
      { href: "/admin/batches/", label: "ব্যাচ", labelEn: "Batches", icon: Layers },
      { href: "/admin/assignments/", label: "অ্যাসাইনমেন্ট", labelEn: "Assignments", icon: ClipboardCheck },
      { href: "/admin/grades/", label: "মূল্যায়ন", labelEn: "Grades", icon: Award },
      { href: "/admin/schedule/", label: "রুটিন", labelEn: "Schedule", icon: Calendar },
      { href: "/admin/attendance/", label: "উপস্থিতি", labelEn: "Attendance", icon: CheckSquare },
    ],
  },
  {
    group: "Operations",
    items: [
      { href: "/admin/payments/", label: "পেমেন্ট", labelEn: "Payments", icon: CreditCard, badge: "₹" },
      { href: "/admin/certificates/", label: "সার্টিফিকেট", labelEn: "Certificates", icon: FileBadge },
      { href: "/admin/announcements/", label: "ঘোষণা", labelEn: "Announcements", icon: Megaphone },
      { href: "/admin/messages/", label: "বার্তা", labelEn: "Messages", icon: MessageSquare, badge: "৭" },
      { href: "/admin/library/", label: "রিসোর্স", labelEn: "Library", icon: Library },
    ],
  },
  {
    group: "Content (CMS)",
    items: [
      { href: "/admin/blog/", label: "ব্লগ", labelEn: "Blog", icon: PenSquare },
      { href: "/admin/pages/", label: "পেজ", labelEn: "Pages", icon: FileText },
      { href: "/admin/gallery/", label: "গ্যালারি", labelEn: "Gallery", icon: ImageIcon },
    ],
  },
  {
    group: "System",
    items: [
      { href: "/admin/settings/", label: "সেটিংস", labelEn: "Settings", icon: Settings },
    ],
  },
];

const TITLES: Record<string, string> = Object.fromEntries(
  NAV.flatMap((g) => g.items.map((i) => [i.href, `${i.label} · ${i.labelEn}`]))
);

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<{ name: string; email: string; role: string } | null>(null);
  const title = TITLES[pathname ?? "/admin/"] ?? "Admin";

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, role")
        .eq("id", user.id)
        .single();
      setMe({
        name: profile?.full_name ?? user.email ?? "Admin",
        email: profile?.email ?? user.email ?? "",
        role: profile?.role ?? "—",
      });
    });
  }, []);

  return (
    <main className="pt-20 pb-12 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="bg-emerald-950 text-white rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="bg-amber-500 text-emerald-950 font-bold text-xs px-2 py-1 rounded uppercase tracking-wider shrink-0">
            Admin Preview
          </span>
          <p className="text-emerald-100 leading-snug min-w-0 truncate">
            <span className="font-bold">এটি এডমিন প্যানেলের পূর্বরূপ।</span>{" "}
            ওয়েবসাইটের সমস্ত কনটেন্ট এখান থেকে নিয়ন্ত্রণ করা যাবে।
          </p>
          <Link
            href="/dashboard/"
            className="ml-auto shrink-0 inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold whitespace-nowrap"
          >
            Student view <ChevronRight className="w-4 h-4" />
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
                        className={`mx-2 mb-0.5 px-2.5 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
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
                {me ? me.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "··"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{me?.name ?? "…"}</p>
                <p className="text-[11px] text-emerald-300 capitalize">{me?.role.replace("_", " ") ?? "—"}</p>
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
            <div className="flex-1 overflow-y-auto p-5 bg-slate-50">{children}</div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            এডমিন এক্সেস কেবল অনুমোদিত কর্মীদের জন্য। প্রকৃত প্যানেল ব্যাকএন্ড সংযোগের পর সক্রিয় হবে।
          </p>
        </div>
      </div>
    </main>
  );
}
