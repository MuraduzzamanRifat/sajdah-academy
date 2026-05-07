"use client";

/* Scroll progress bar.

   Modern browsers (Chrome 115+ / Edge 115+ / Opera 101+) get a
   compositor-thread CSS scroll-timeline animation — zero JS work per
   scroll frame. Browsers without scroll-timeline support fall back to
   framer-motion useSpring, but only on desktop+fine-pointer devices
   (older mobile browsers without scroll-timeline are usually low-end). */

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useDeviceClass } from "../../lib/useDeviceClass";

export default function ScrollProgress() {
  const reduced = useReducedMotion();
  const { desktopFinePointer } = useDeviceClass();
  const [supportsTimeline, setSupportsTimeline] = useState<boolean | null>(null);

  useEffect(() => {
    setSupportsTimeline(CSS.supports?.("animation-timeline: scroll()") ?? false);
  }, []);

  if (reduced) return null;
  if (supportsTimeline === null) return null;
  if (supportsTimeline) return <CssProgress />;
  if (!desktopFinePointer) return null;
  return <JsProgress />;
}

function CssProgress() {
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
