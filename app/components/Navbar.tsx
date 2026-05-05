"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Tent } from "lucide-react";

const NAV = [
  { href: "/about/", label: "About", labelBn: "পরিচিতি" },
  { href: "/courses/", label: "Courses", labelBn: "কোর্সসমূহ" },
  { href: "/batches/", label: "Batches", labelBn: "ব্যাচসমূহ" },
  { href: "/faculty/", label: "Faculty", labelBn: "শিক্ষকমণ্ডলী" },
  { href: "/blog/", label: "Blog", labelBn: "আর্টিকেল" },
  { href: "/faq/", label: "FAQ", labelBn: "জিজ্ঞাসা" },
  { href: "/contact/", label: "Contact", labelBn: "যোগাযোগ" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const onDarkBg = isHomePage && !isScrolled;

  const navBgClass = onDarkBg
    ? "bg-transparent py-5"
    : "bg-white/90 backdrop-blur-md shadow-sm py-3";
  const linkClass = onDarkBg ? "text-emerald-50" : "text-slate-600";
  const logoTextClass = onDarkBg ? "text-white" : "text-emerald-950";
  const logoIconClass = onDarkBg
    ? "bg-white/20 text-white backdrop-blur-sm"
    : "bg-emerald-100 text-emerald-700";
  const mobileMenuBtnClass = onDarkBg ? "text-white" : "text-slate-800";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className={`p-2 rounded-lg ${logoIconClass}`}>
              <Tent className="w-6 h-6" />
            </div>
            <span className={`text-xl font-bold ${logoTextClass}`}>Sajdah Academy</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium text-sm hover:text-emerald-500 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                    active ? "text-emerald-500" : linkClass
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/enroll/"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm rounded-lg transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 shrink-0"
            >
              Enroll Now
            </Link>
          </div>

          <button
            type="button"
            className={`lg:hidden p-3 -mr-2 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${mobileMenuBtnClass}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col gap-2 max-h-[calc(100vh-80px)] overflow-y-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-700 font-medium p-3 hover:bg-emerald-50 rounded-lg min-h-[44px] flex items-center justify-between"
            >
              <span>{item.label}</span>
              <span className="text-xs text-slate-400">{item.labelBn}</span>
            </Link>
          ))}
          <Link
            href="/enroll/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-center p-3 bg-amber-500 text-emerald-950 font-bold rounded-lg mt-2"
          >
            Enroll Now · এখনই রেজিস্টার করুন
          </Link>
        </div>
      )}
    </nav>
  );
}
