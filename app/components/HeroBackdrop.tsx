"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/* CSS-only fallback used on mobile / low-power devices.
   No WebGL, no JS animation cost — just gradient + radial pattern.
   Preserves the same emerald/amber color story as the WebGL version. */
function CssBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-emerald-950">
      {/* Soft amber radial glow centered behind the title */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(245,158,11,0.28) 0%, rgba(16,185,129,0.12) 30%, transparent 60%)",
        }}
      />
      {/* Faint emerald sheen from the top */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-transparent to-emerald-950" />
      {/* Static 8-point Islamic star silhouette via SVG (tiny, GPU-cheap) */}
      <svg
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[520px] opacity-15"
        viewBox="-100 -100 200 200"
      >
        <defs>
          <radialGradient id="g" cx="0" cy="0" r="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
        </defs>
        <polygon
          points={Array.from({ length: 16 })
            .map((_, i) => {
              const r = i % 2 === 0 ? 90 : 50;
              const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
              return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
            })
            .join(" ")}
          fill="url(#g)"
        />
      </svg>
    </div>
  );
}

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => <CssBackdrop />,
});

/* Detect whether the device is mobile-grade BEFORE loading R3F.
   We use multiple cheap signals:
   - viewport width < 768px (mobile breakpoint)
   - Device Memory API (≤ 4 GB = treat as low-end)
   - Hardware concurrency (≤ 4 cores)
   - Save-Data hint (user explicitly opts in to lighter sites)
   - prefers-reduced-motion (already a-11y signal)
   Any one triggers the lightweight CSS path. */
function shouldUseLightBackdrop(): boolean {
  if (typeof window === "undefined") return true; // SSR-safe default
  const w = window.innerWidth;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = navigator as any;
  const lowMem = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const lowCpu = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
  const saveData = nav.connection?.saveData === true;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  return w < 768 || lowMem || lowCpu || saveData || reduced;
}

export default function HeroBackdrop() {
  const [light, setLight] = useState(true); // default to light during SSR/hydration
  useEffect(() => {
    setLight(shouldUseLightBackdrop());
    const onResize = () => setLight(shouldUseLightBackdrop());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return light ? <CssBackdrop /> : <HeroCanvas />;
}
