"use client";

/* Lenis smooth-scroll integration.

   Why: native browser wheel-scroll on Chrome/Firefox is fast but
   choppy on long pages with parallax + intersection observers.
   Lenis interpolates the scroll position with a lerp curve, so the
   page settles toward the target position over a few frames instead
   of jumping in discrete wheel ticks. Result: scroll feels like
   inertial momentum on macOS/iOS even on Windows + a regular mouse.

   Plays well with our existing scroll-aware code:
   - framer-motion's `useScroll` reads window.scrollY which Lenis
     keeps in sync — Hero parallax (desktop) still works
   - CSS `animation-timeline: scroll(root)` (ScrollProgress.tsx)
     also reads document scroll position — also works
   - IntersectionObserver fires correctly because Lenis triggers
     a real scroll event each frame

   Disabled when:
   - prefers-reduced-motion is set (a11y)
   - touch devices (smoothTouch: false) — native iOS momentum is
     better than anything Lenis could synthesize on touch */

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider() {
  useEffect(() => {
    /* Respect reduced-motion preference — return without instantiating
       Lenis so the user gets the browser's native scroll behavior. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      /* lerp: lower = slower glide; 0.1 is the standard "premium feel"
         Apple-style coefficient. Higher (e.g. 0.18) makes it more
         responsive. 0.1 strikes the right balance for content sites. */
      lerp: 0.1,
      smoothWheel: true,
      /* Do NOT smooth-scroll touch — iOS Safari's native momentum is
         better than anything we can synthesize, and Android Chrome's
         is good enough. Lenis on touch generally feels worse. */
      syncTouch: false,
      /* Mouse wheel multiplier — 1.0 keeps the OS-default scroll
         distance per tick. Bumping above 1 makes it scroll-jump faster
         per tick which fights the smoothness; below 1 feels sluggish. */
      wheelMultiplier: 1.0,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
