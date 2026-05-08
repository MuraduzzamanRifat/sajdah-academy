"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/* Schedule a callback when the main thread is idle, falling back to
   a generous setTimeout on browsers without requestIdleCallback
   (Safari ≤ 17). The 1500 ms timeout is the safety net — even on
   busy threads, we promote the canvas mount inside that window. */
type IdleCancel = () => void;
function whenIdle(fn: () => void, timeoutMs: number = 1500): IdleCancel {
  if (typeof window === "undefined") return () => {};
  type RIC = (cb: IdleRequestCallback, opts?: { timeout: number }) => number;
  type CIC = (handle: number) => void;
  const w = window as Window & { requestIdleCallback?: RIC; cancelIdleCallback?: CIC };
  if (typeof w.requestIdleCallback === "function") {
    const id = w.requestIdleCallback(() => fn(), { timeout: timeoutMs });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, timeoutMs);
  return () => window.clearTimeout(id);
}

/* CSS-only fallback used on mobile / low-power devices.
   No WebGL, no JS animation cost — just gradient backdrop.
   The medallion (rendered in Hero.tsx) now fills the focal role. */
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
  /* Two-stage gate so the WebGL canvas can NEVER block initial paint:
     - `light` decides "should we even consider WebGL" (false on capable
       desktop only)
     - `idle` defers actually mounting the canvas until the main thread
       has finished hydrating + settling everything else. Without this,
       Three.js + R3F + drei evaluate during the same tick as the rest
       of the page and Lighthouse measures the cost as Total Blocking
       Time (was 27,350 ms before this gate). */
  const [light, setLight] = useState(true); // default to light during SSR/hydration
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    setLight(shouldUseLightBackdrop());
    const onResize = () => setLight(shouldUseLightBackdrop());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (light) return; // never schedule canvas on light path
    const cancel = whenIdle(() => setIdle(true), 1500);
    return cancel;
  }, [light]);

  if (light || !idle) return <CssBackdrop />;
  return <HeroCanvas />;
}
