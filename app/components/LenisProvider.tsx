"use client";

/* Lenis smooth-scroll integration with idle-pause.

   The naive `requestAnimationFrame(raf); ...` recursion runs at 60Hz
   forever even when the page is idle, preventing the browser from
   parking the tab. We instead drive the rAF loop only while Lenis is
   actively scrolling — wheel/touch/key events wake the loop, the loop
   stops itself when `lenis.isScrolling` is false. Saves ~60 wakeups
   per second on idle desktops. */

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";

export default function LenisProvider() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

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
  }, [reduced]);

  return null;
}
