"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { BookOpen, Heart, Star, Target, CheckCircle2 } from "lucide-react";

const phases = [
  {
    id: 1,
    title: "Phase 1: Foundation (Month 1–2)",
    goal: "ঈমান, আকীদা ও বেসিক আমল",
    icon: <Star className="w-6 h-6 text-amber-500" />,
    focusAreas: [
      "Basic Aqeedah (ঈমানের ভিত্তি)",
      "Salah Correctness (নামাজ ঠিক করা)",
      "Daily Sunnah Routine",
      "Quran Reading with Tajweed",
    ],
    outcomes: [
      "শুদ্ধভাবে নামাজ আদায়",
      "দৈনিক আমলের অভ্যাস তৈরি",
      "মৌলিক ইসলামী জ্ঞান অর্জন",
    ],
  },
  {
    id: 2,
    title: "Phase 2: Understanding Deen (Month 3-4)",
    goal: "ইসলামকে বুঝে চলা",
    icon: <BookOpen className="w-6 h-6 text-emerald-500" />,
    focusAreas: [
      "Tafsir (Selected Surahs)",
      "Hadith Study (Daily Life Hadith)",
      "Seerah (Life of Prophet ﷺ)",
      "Akhlaq & Character Building",
    ],
    outcomes: [
      "কুরআনের মেসেজ বুঝতে পারা",
      "রাসূল ﷺ এর জীবন অনুসরণ",
      "চরিত্রের পরিবর্তন",
    ],
  },
  {
    id: 3,
    title: "Phase 3: Transformation (Month 5–6)",
    goal: "Lifestyle Change",
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    focusAreas: [
      "Tazkiyah (Self Purification)",
      "Advanced Amol Routine",
      "Dawah & Leadership",
      "Habit Building & Discipline",
    ],
    outcomes: [
      "Islamic lifestyle fully practiced",
      "Strong discipline & routine",
      "দাওয়াহ mindset তৈরি",
    ],
  },
];

const coreSubjects = [
  { title: "Aqeedah", desc: "Tawheed (Oneness of Allah), Shirk & Its Types, Imaniyat (Belief System), Bid'ah Awareness" },
  { title: "Fiqh (Daily Life)", desc: "Taharah (Purity), Salah (Prayer Rules), Fasting (Sawm), Halal & Haram Lifestyle" },
  { title: "Hadith", desc: "40 Hadith (Basic Collection), Daily Life Sunnah Hadith, Practical Implementation" },
  { title: "Seerah", desc: "Life of Prophet ﷺ (Makkah to Madinah), Key Events & Lessons, Sahaba Stories" },
  { title: "Tazkiyah (Self Dev.)", desc: "Nafs Control, Ikhlas (Sincerity), Disease of Heart (Riya, Hasad), Sabr & Shukr" },
  { title: "Amol & Sunnah", desc: "Daily Duas, Morning & Evening Adhkar, Sunnah Lifestyle, Habit Building System" },
  { title: "Islamic Motivation", desc: "Purpose of Life Akhirah Focus, Youth Problems & Solutions, Consistency & Discipline" },
  { title: "Quran & Tafsir", desc: "Quran Reading with Tajweed, Tafsir of Selected Surahs" },
];

export default function Curriculum() {
  return (
    <section id="curriculum" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">
            একাডেমিক মডেল ও কারিকুলাম
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            আমাদের ৬ মাসের কোর্সটি তিনটি ধাপে বিভক্ত, যা আপনাকে ধাপে ধাপে একজন আদর্শ
            মুসলিম হিসেবে গড়ে তুলতে সাহায্য করবে।
          </p>
        </div>

        <div className="mb-20">
          <h3 className="text-2xl font-bold text-emerald-900 mb-8 text-center">
            Core Subjects Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {coreSubjects.map((subject, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 text-center hover:shadow-md transition-shadow"
              >
                <h4 className="font-bold text-emerald-800 mb-2">{subject.title}</h4>
                <p className="text-sm text-slate-500">{subject.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: stacked cards (sticky scroll is awkward on touch) */}
        <div className="md:hidden space-y-8">
          {phases.map((phase, idx) => (
            <PhaseCardStatic key={phase.id} phase={phase} delay={idx * 0.05} />
          ))}
        </div>

        {/* Desktop: sticky scroll-stepper */}
        <div className="hidden md:block">
          <PhaseStepper phases={phases} />
        </div>
      </div>
    </section>
  );
}

/* ---------- Phase card (shared by mobile + stepper) ---------- */

type Phase = (typeof phases)[number];

function PhaseCardBody({ phase }: { phase: Phase }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
      <div className="bg-emerald-900 px-6 py-4 flex items-center gap-4 text-white">
        <div className="p-2 bg-white rounded-full">{phase.icon}</div>
        <div>
          <h3 className="text-xl font-bold">{phase.title}</h3>
          <p className="text-emerald-200 text-sm font-medium">Goal: {phase.goal}</p>
        </div>
      </div>
      <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
            <Target className="w-5 h-5 text-emerald-600" />
            Focus Areas
          </h4>
          <ul className="space-y-3">
            {phase.focusAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-emerald-50 p-6 rounded-xl">
          <h4 className="flex items-center gap-2 text-lg font-bold text-emerald-900 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Outcome
          </h4>
          <ul className="space-y-3">
            {phase.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-3 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-medium">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PhaseCardStatic({ phase, delay }: { phase: Phase; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <PhaseCardBody phase={phase} />
    </motion.div>
  );
}

/* ---------- Sticky scroll-stepper (desktop only) ---------- */

function PhaseStepper({ phases }: { phases: Phase[] }) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Outer container is N * 100vh tall — one viewport per phase
  const heightVH = phases.length * 100;

  if (reduce) {
    // Reduced motion: render plain stacked cards, no sticky pin
    return (
      <div className="space-y-12">
        {phases.map((p) => (
          <PhaseCardBody key={p.id} phase={p} />
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ height: `${heightVH}vh` }} className="relative">
      <div className="sticky top-24 h-[calc(100vh-6rem)] flex items-center">
        <div className="grid grid-cols-[80px_1fr] gap-8 w-full">
          {/* Vertical step rail */}
          <StepRail count={phases.length} progress={scrollYProgress} />
          {/* Stack of cards — each card fades in/out with progress */}
          <div className="relative h-[480px]">
            {phases.map((phase, i) => (
              <StepCard
                key={phase.id}
                phase={phase}
                index={i}
                total={phases.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepRail({ count, progress }: { count: number; progress: MotionValue<number> }) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-12 py-4">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-200 -translate-x-1/2" />
      {Array.from({ length: count }).map((_, i) => (
        <RailDot key={i} index={i} total={count} progress={progress} />
      ))}
    </div>
  );
}

function RailDot({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  // Active when scroll progress is within this dot's window (with small lead-in)
  const opacity = useTransform(progress, [start - 0.08, start, end, end + 0.08], [0.3, 1, 1, 0.3]);
  const scale = useTransform(progress, [start - 0.08, start, end, end + 0.08], [0.9, 1.15, 1.15, 0.9]);
  return (
    <motion.div
      style={{ opacity, scale }}
      className="relative z-10 w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-emerald-50"
    >
      {index + 1}
    </motion.div>
  );
}

function StepCard({
  phase,
  index,
  total,
  progress,
}: {
  phase: Phase;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each phase owns a window of 1/total of the scroll progress.
  // Fade-in over the first 25% of its window, hold, fade-out over the last 25%.
  const segStart = index / total;
  const segEnd = (index + 1) / total;
  const fadeInEnd = segStart + (segEnd - segStart) * 0.25;
  const fadeOutStart = segEnd - (segEnd - segStart) * 0.25;

  const opacity = useTransform(
    progress,
    [segStart - 0.05, segStart, fadeInEnd, fadeOutStart, segEnd, segEnd + 0.05],
    [0, 0, 1, 1, 0, 0]
  );
  const y = useTransform(
    progress,
    [segStart, fadeInEnd, fadeOutStart, segEnd],
    [40, 0, 0, -40]
  );

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0">
      <PhaseCardBody phase={phase} />
    </motion.div>
  );
}
