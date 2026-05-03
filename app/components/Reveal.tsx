"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/* Theatrical entrance — bigger Y travel + scale + blur than the
   default whileInView fades. Used for section titles and primary
   content blocks. Reduced-motion users get instant visibility. */

const variants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.96,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1], // easeOutQuint
    },
  },
};

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "header";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[As];
  if (reduce) {
    return <As className={className}>{children}</As>;
  }
  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
