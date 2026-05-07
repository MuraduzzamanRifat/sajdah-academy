"use client";

/* Hero is split into a flat layout + an optional <HeroParallax/> child
   that owns all scroll-driven motion. The split exists because
   useScroll + useTransform subscribe to the scroll source the moment
   the hooks mount — calling them and then ignoring the values still
   runs the per-frame math. By moving the hooks inside HeroParallax
   and only mounting it on desktop+fine-pointer devices, the math
   never runs on mobile/touch/reduced-motion. */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Calendar, MapPin, ShieldCheck, type LucideIcon } from "lucide-react";
import HeroBackdrop from "./HeroBackdrop";
import { asset } from "../lib/asset";
import { useDeviceClass } from "../../lib/useDeviceClass";

const ICON_MAP: Record<string, LucideIcon> = {
  map: MapPin,
  calendar: Calendar,
  shield: ShieldCheck,
};

export type HeroBadge = { icon: string; text_bn: string };

export type HeroTexts = {
  eyebrow_bn: string;
  title_bn: string;
  subtitle_bn: string;
  badges: HeroBadge[];
  cta_primary_bn: string;
  cta_primary_href: string;
  cta_secondary_bn: string;
  cta_secondary_href: string;
};

export default function Hero({ texts }: { texts: HeroTexts }) {
  const { lowMotion } = useDeviceClass();
  const reducedMotion = useReducedMotion();
  const flat = lowMotion || !!reducedMotion;

  const heroRef = useRef<HTMLElement>(null);

  /* `mounted` gates HeroParallax to client-side post-hydration. Server-
     rendered HTML is the flat (mobile) version, so a desktop user gets
     a one-frame "flat" hero before parallax kicks in — preferable to
     the alternative (SSR with parallax classes that flash empty motion
     values for one paint cycle). */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      ref={heroRef}
      className="relative bg-emerald-900 text-white overflow-hidden min-h-[100svh] flex items-center"
    >
      <div className="absolute inset-0">
        <HeroBackdrop />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-emerald-900/30 to-emerald-950/90" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_transparent_0%,_rgba(2,44,34,0.55)_70%)]" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={flat ? { opacity: 0.4 } : undefined}
      >
        <div className="relative w-[88vw] max-w-[720px] aspect-square">
          <Image
            src={asset("/hero-medallion-cutout.webp")}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 720px, 88vw"
            className="object-contain drop-shadow-[0_0_60px_rgba(245,158,11,0.45)]"
          />
        </div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <HeroContent texts={texts} flat={flat} />
      </div>

      {mounted && !flat && <HeroParallax heroRef={heroRef} />}
    </section>
  );
}

/* Static content block. Animated entrance is owned by HeroParallax
   when active; otherwise this just renders flat at full opacity. */
function HeroContent({ texts, flat }: { texts: HeroTexts; flat: boolean }) {
  return (
    <motion.div
      initial={flat ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: flat ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="text-center max-w-4xl mx-auto"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 mb-8 backdrop-blur-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/medallion-128.webp")}
          alt=""
          width={20}
          height={20}
          className="w-5 h-5 object-contain shrink-0"
        />
        <span className="font-medium text-sm tracking-wide">{texts.eyebrow_bn}</span>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
        {texts.title_bn}
      </h1>
      <p className="text-xl md:text-2xl text-emerald-100 mb-10 leading-relaxed">
        {texts.subtitle_bn}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        {texts.badges.map((b, i) => {
          const Icon = ICON_MAP[b.icon] ?? MapPin;
          return (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/10 px-5 py-3 rounded-full backdrop-blur-md border border-white/10"
            >
              <Icon className="w-5 h-5 text-amber-400" />
              <span className="font-medium">{b.text_bn}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={texts.cta_primary_href}
          className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg transition-all duration-200 text-lg shadow-lg shadow-amber-500/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
        >
          {texts.cta_primary_bn}
        </a>
        <a
          href={texts.cta_secondary_href}
          className="px-8 py-4 bg-transparent border-2 border-emerald-400 hover:bg-emerald-800/50 text-white font-bold rounded-lg transition-all duration-200 text-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/50"
        >
          {texts.cta_secondary_bn}
        </a>
      </div>
    </motion.div>
  );
}

/* Desktop-only parallax overlay. All useScroll + useTransform hooks
   live here so they only register when this component mounts. The
   visual layers (medallion + content + scroll cue) are absolutely-
   positioned siblings of the flat hero content above; they paint on
   top with the same dimensions, so the transition between flat and
   parallax is invisible. */
function HeroParallax({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.4]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const medallionScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const medallionOpacity = useTransform(scrollYProgress, [0, 0.85], [0.65, 0]);

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ scale: canvasScale, opacity: canvasOpacity }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ scale: medallionScale, opacity: medallionOpacity }}
      >
        <motion.div
          className="relative w-[88vw] max-w-[720px] aspect-square"
          animate={{ scale: [1, 1.025, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ opacity: cueOpacity }}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-emerald-200/70 text-xs tracking-[0.3em] uppercase"
      >
        <div className="flex flex-col items-center gap-2">
          <span>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-amber-400/60 to-transparent" />
        </div>
      </motion.div>
    </>
  );
}
