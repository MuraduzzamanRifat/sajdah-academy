"use client";

/* Single source of truth for "what kind of device is this?".

   Replaces ad-hoc copies of the same matchMedia checks that were
   previously hand-rolled in Hero, ScrollProgress, HeroBackdrop, and
   LenisProvider. Each consumer was duplicating the literal media-query
   string and the SSR-safe-default + resize-listener pattern.

   `lowMotion` matches when ANY of:
     - viewport < 768px (mobile)
     - hover: none / pointer: coarse (touch)
     - prefers-reduced-motion (a11y)
     - low device-memory (≤ 4 GB)
     - low CPU concurrency (≤ 4 cores)
     - Save-Data hint
   It's the right gate for "should I skip parallax / smooth-scroll /
   WebGL". Use `desktopFinePointer` when you specifically need "this
   device has a real mouse + a desktop-sized viewport". */

import { useEffect, useState } from "react";

const DESKTOP_MQ = "(min-width: 768px) and (hover: hover) and (pointer: fine)";

export type DeviceClass = {
  /* True until the first effect runs — SSR-safe default. Components
     that branch on this should treat true as the "lowest common
     denominator" so server-rendered output matches the lower path. */
  lowMotion: boolean;
  /* Strict desktop-with-mouse. Inverse of lowMotion's first two
     conditions, ignores reduced-motion. */
  desktopFinePointer: boolean;
};

export function useDeviceClass(): DeviceClass {
  const [state, setState] = useState<DeviceClass>({
    lowMotion: true,
    desktopFinePointer: false,
  });

  useEffect(() => {
    const compute = (): DeviceClass => {
      const desktop = window.matchMedia(DESKTOP_MQ).matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nav = navigator as any;
      const lowMem = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
      const lowCpu = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
      const saveData = nav.connection?.saveData === true;
      return {
        desktopFinePointer: desktop,
        lowMotion: !desktop || reduced || lowMem || lowCpu || saveData,
      };
    };
    setState(compute());

    /* MediaQueryList.change is the throttled signal browsers fire on
       breakpoint crossings — cheaper than resize and avoids the
       once-per-pixel reflow churn. */
    const desktopMq = window.matchMedia(DESKTOP_MQ);
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setState(compute());
    desktopMq.addEventListener("change", onChange);
    reducedMq.addEventListener("change", onChange);
    return () => {
      desktopMq.removeEventListener("change", onChange);
      reducedMq.removeEventListener("change", onChange);
    };
  }, []);

  return state;
}
