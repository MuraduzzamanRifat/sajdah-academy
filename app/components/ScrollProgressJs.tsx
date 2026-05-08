"use client";

/* JS-driven scroll progress bar — fallback for browsers without
   CSS scroll-timeline (Safari ≤ 16, older Firefox).

   Lives in its own file so framer-motion only enters the bundle
   when Next.js dynamic-imports this module — which only happens
   on the rare unsupported-browser path. The CSS path covers
   ~97% of traffic with zero JS framework cost. */

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressJs() {
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
