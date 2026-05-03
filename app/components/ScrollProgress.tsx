"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // Spring smoothing — reads premium and tracks scroll naturally
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    mass: 0.4,
    restDelta: 0.0008,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 shadow-[0_0_12px_rgba(245,158,11,0.45)]"
      style={{ scaleX }}
    />
  );
}
