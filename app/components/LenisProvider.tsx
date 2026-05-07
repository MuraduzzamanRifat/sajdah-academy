"use client";

/* Lenis smooth-scroll integration with idle-pause + route gating.

   Only instantiates on routes where smooth scroll adds visible value
   (currently: homepage). Text-heavy routes like /about, /privacy,
   /press don't have parallax or scroll-driven motion and the user
   ends up paying for Lenis's wheel-event hijack + per-frame state
   maintenance with zero perceived benefit. After several navigations
   that overhead compounds and contributes to "feels slow over time".

   The rAF loop also self-pauses when lenis.isScrolling is false,
   so even on the homepage the loop is idle 99% of the time. */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";

const ROUTES_WITH_SMOOTH_SCROLL = new Set(["/"]);

export default function LenisProvider() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const enabled = ROUTES_WITH_SMOOTH_SCROLL.has(pathname);

  useEffect(() => {
    if (reduced || !enabled) return;

    /* Singleton guard — under React Strict Mode, HMR, or any race
       where the effect runs twice, we'd otherwise create two Lenis
       instances both binding wheel listeners and competing for scroll
       control. Stash the live instance on window so the second mount
       sees it and bails. */
    type LenisWindow = Window & { __sajdahLenis?: Lenis };
    const w = window as LenisWindow;
    if (w.__sajdahLenis) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.0,
    });
    w.__sajdahLenis = lenis;

    let rafId: number | null = null;

    function step(time: number) {
      lenis.raf(time);
      if (lenis.isScrolling) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = null;
      }
    }

    function wake() {
      if (rafId === null) {
        rafId = requestAnimationFrame(step);
      }
    }

    /* Initial pump — handles the case where the user already started
       scrolling before this component mounted. */
    wake();

    /* Passive listeners; we only use them as a wake signal. */
    window.addEventListener("wheel", wake, { passive: true });
    window.addEventListener("touchstart", wake, { passive: true });
    window.addEventListener("keydown", wake);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", wake);
      window.removeEventListener("touchstart", wake);
      window.removeEventListener("keydown", wake);
      lenis.destroy();
      if (w.__sajdahLenis === lenis) delete w.__sajdahLenis;
    };
  }, [reduced, enabled]);

  return null;
}
