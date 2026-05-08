"use client";

/* Scroll progress bar.

   Modern browsers (Chrome 115+ / Edge 115+ / Opera 101+ / Firefox 103+)
   get a compositor-thread CSS scroll-timeline animation — zero JS work
   per scroll frame, zero framework cost in the bundle.

   Browsers without scroll-timeline support (Safari ≤ 16, older
   Firefox) fall back to a framer-motion useSpring path. That path
   is split into ./ScrollProgressJs and dynamic-imported here, so
   framer-motion stays out of the marketing-page bundle for the
   ~97% of visitors on supported browsers. The fallback is gated to
   desktop+fine-pointer to avoid pulling framer-motion onto low-end
   mobile devices that wouldn't benefit anyway.

   No more `import { motion, ... } from "framer-motion"` at the top
   of this file — that was the original sin shipping ~80KB gzipped
   to every marketing page even when nothing rendered the JS path. */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useDeviceClass } from "../../lib/useDeviceClass";

const ScrollProgressJs = dynamic(() => import("./ScrollProgressJs"), {
  ssr: false,
  loading: () => null,
});

/* Native prefers-reduced-motion check — replaces framer-motion's
   useReducedMotion. Removes the last reason this top-level component
   would pull framer-motion into the marketing bundle. */
function useNativeReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export default function ScrollProgress() {
  const reduced = useNativeReducedMotion();
  const { desktopFinePointer } = useDeviceClass();
  const [supportsTimeline, setSupportsTimeline] = useState<boolean | null>(null);

  useEffect(() => {
    setSupportsTimeline(CSS.supports?.("animation-timeline: scroll()") ?? false);
  }, []);

  if (reduced) return null;
  if (supportsTimeline === null) return null;
  if (supportsTimeline) return <CssProgress />;
  if (!desktopFinePointer) return null;
  return <ScrollProgressJs />;
}

function CssProgress() {
  return (
    <div
      aria-hidden
      className="scroll-progress-css fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 shadow-[0_0_12px_rgba(245,158,11,0.45)]"
    />
  );
}
