"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* Mobile-only sticky bottom CTA. Appears after the user scrolls
   past the hero and hides once the registration form is in view
   (so we don't show two registration CTAs at once). */
export default function StickyMobileCTA() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const pastHero = y > vh * 0.6;

      // Hide if registration section is visible in viewport
      const reg = document.getElementById("register");
      let regInView = false;
      if (reg) {
        const r = reg.getBoundingClientRect();
        regInView = r.top < vh * 0.85 && r.bottom > 0;
      }

      // Hide on routine page (no #register on that route)
      const onHomePage = !!reg;
      setShow(onHomePage && pastHero && !regInView);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="sticky-cta"
          initial={reduce ? false : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 80, opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-3 bg-gradient-to-t from-emerald-950 via-emerald-950/95 to-emerald-950/0"
          style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <a
            href="#register"
            className="block w-full text-center px-6 py-4 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-xl transition-all duration-200 text-lg shadow-2xl shadow-amber-500/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
          >
            রেজিস্ট্রেশন করুন
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
