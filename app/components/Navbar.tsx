"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Tent } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll(); // sync once on mount (avoids first-render flash)
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const navBgClass =
    isScrolled || !isHomePage
      ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
      : "bg-transparent py-5";
  const textClass = isScrolled || !isHomePage ? "text-slate-600" : "text-emerald-50";
  const logoTextClass = isScrolled || !isHomePage ? "text-emerald-950" : "text-white";
  const logoIconClass =
    isScrolled || !isHomePage
      ? "bg-emerald-100 text-emerald-700"
      : "bg-white/20 text-white backdrop-blur-sm";
  const mobileMenuBtnClass = isScrolled || !isHomePage ? "text-slate-800" : "text-white";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${logoIconClass}`}>
              <Tent className="w-6 h-6" />
            </div>
            <span className={`text-xl font-bold ${logoTextClass}`}>Sajdah Academy</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`font-medium hover:text-emerald-500 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${textClass}`}
            >
              Home
            </Link>
            <Link
              href="/#curriculum"
              className={`font-medium hover:text-emerald-500 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${textClass}`}
            >
              Curriculum
            </Link>
            <Link
              href="/routine"
              className={`font-medium hover:text-emerald-500 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${textClass}`}
            >
              Routine
            </Link>
            <Link
              href="/#register"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
            >
              Register Now
            </Link>
          </div>

          <button
            type="button"
            className={`md:hidden p-3 -mr-2 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${mobileMenuBtnClass}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium p-3 hover:bg-emerald-50 rounded-lg min-h-[44px] flex items-center">
            Home
          </Link>
          <Link href="/#curriculum" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium p-3 hover:bg-emerald-50 rounded-lg min-h-[44px] flex items-center">
            Curriculum
          </Link>
          <Link href="/routine" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium p-3 hover:bg-emerald-50 rounded-lg min-h-[44px] flex items-center">
            Routine
          </Link>
          <Link href="/#register" onClick={() => setIsMobileMenuOpen(false)} className="text-center p-3 bg-amber-500 text-emerald-950 font-bold rounded-lg mt-2">
            Register Now
          </Link>
        </div>
      )}
    </nav>
  );
}
