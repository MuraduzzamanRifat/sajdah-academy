"use client";

/* Scroll progress bar.

   Old version: framer-motion useScroll + useSpring on every scroll
   frame. Cheap on desktop, but the spring physics simulation runs on
   the main thread and contributes to scroll jank on mid-range mobile.

   New version: prefer CSS scroll-driven animation (`animation-timeline:
   scroll(root)`) which runs on the compositor thread and adds zero JS
   work on scroll. Supported in Chrome 115+ / Edge 115+ / Opera 101+
   (~78% of global traffic at end-2025) and gracefully ignored
   elsewhere. For browsers without support we fall back to the
   framer-motion spring; that path is gated to desktop only since
   mobile browsers without scroll-timeline are mostly older and slower
   — not a population we want to add scroll listeners to. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

function supportsScrollTimeline(): boolean {
  if (typeof window === "undefined") return false;
  return CSS.supports?.("animation-timeline: scroll()") ?? false;
}

export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<"css" | "js" | "off">("off");

  /* Decide once at hydration. We default to "off" during SSR so nothing
     paints until we know which path to render. */
  useEffect(() => {
    if (reduce) {
      setMode("off");
      return;
    }
    if (supportsScrollTimeline()) {
      setMode("css");
      return;
    }
    /* JS fallback only when we're on a desktop-ish device. Older mobile
       browsers without scroll-timeline are typically the ones we don't
       want to add a scroll listener to either. */
    const desktop = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches;
    setMode(desktop ? "js" : "off");
  }, [reduce]);

  if (mode === "off") return null;
  if (mode === "css") return <CssProgress />;
  return <JsProgress />;
}

function CssProgress() {
  /* Class is defined in app/globals.css under .scroll-progress-css.
     animation-timeline keeps the bar pinned to root scroll position
     entirely on the compositor thread — zero JS work per scroll frame. */
  return (
    <div
      aria-hidden
      className="scroll-progress-css fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 shadow-[0_0_12px_rgba(245,158,11,0.45)]"
    />
  );
}

function JsProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    mass: 0.4,
    restDelta: 0.0008,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 shadow-[0_0_12px_rgba(245,158,11,0.45)]"
      style={{ scaleX }}
    />
  );
}
