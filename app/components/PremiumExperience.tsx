"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { BedDouble, Utensils, MonitorPlay, Trees } from "lucide-react";
import { Reveal } from "./Reveal";

const features = [
  {
    title: "লাক্সারি অ্যাকোমোডেশন",
    description:
      "শীতাতপ নিয়ন্ত্রিত, আধুনিক সুযোগ-সুবিধা সম্পন্ন প্রিমিয়াম শেয়ার্ড বা প্রাইভেট রুম।",
    icon: <BedDouble className="w-6 h-6 text-amber-400" />,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "প্রাকৃতিক ও শান্ত পরিবেশ",
    description:
      "শহরের কোলাহল মুক্ত, সবুজে ঘেরা মনোরম পরিবেশ যা তাযকিয়াহ ও ইবাদতের জন্য অনুকূল।",
    icon: <Trees className="w-6 h-6 text-emerald-400" />,
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "হাই-এন্ড ক্লাসরুম",
    description:
      "আধুনিক মাল্টিমিডিয়া, প্রজেক্টর ও আরামদায়ক সিটিং ব্যবস্থা সম্পন্ন শীতাতপ নিয়ন্ত্রিত কনফারেন্স হল।",
    icon: <MonitorPlay className="w-6 h-6 text-amber-300" />,
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "প্রিমিয়াম ডাইনিং",
    description:
      "স্বাস্থ্যসম্মত, সুস্বাদু ও পুষ্টিকর হালাল বুফে খাবার এবং সার্বক্ষণিক রিফ্রেশমেন্টের ব্যবস্থা।",
    icon: <Utensils className="w-6 h-6 text-orange-400" />,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
  },
];

/* Parallax depths — alternate cards travel at slightly different speeds
   to create subtle layered depth as the section enters the viewport.
   Disabled below md viewport (parallax is fragile on touch / small screens). */
const PARALLAX_OFFSETS = [-40, -10, -28, 0];

function ParallaxCardWrap({
  index,
  scrollProgress,
  reduce,
  children,
}: {
  index: number;
  scrollProgress: MotionValue<number>;
  reduce: boolean | null;
  children: React.ReactNode;
}) {
  const offset = PARALLAX_OFFSETS[index % PARALLAX_OFFSETS.length];
  const y = useTransform(scrollProgress, [0, 1], [offset, 0]);
  return (
    <motion.div
      style={reduce ? undefined : { y }}
      className="hidden md:block will-change-transform"
    >
      {children}
    </motion.div>
  );
}

export default function PremiumExperience() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-emerald-950 text-white overflow-hidden relative"
    >
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal className="text-center mb-16">
          <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-3 block">
            Premium Physical Classes
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            প্রিমিয়াম রিসোর্টে ফিজিক্যাল ক্লাস ও ট্রেনিং
          </h2>
          <p className="text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
            আমাদের প্রতিটি ক্লাস, ওয়ার্কশপ এবং সেশন পরিচালিত হবে দেশের বাছাইকৃত
            লাক্সারি রিসোর্টগুলোতে। সম্পূর্ণ ফিজিক্যাল এই কোর্সে আপনি পাবেন আধুনিক
            ক্লাসরুম, নিরিবিলি পরিবেশ এবং দ্বীনি শিক্ষার এক অনন্য অভিজ্ঞতা।
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => {
            const card = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="gold-frame group relative overflow-hidden rounded-3xl shadow-2xl border border-emerald-800/50"
              >
                <div className="aspect-[16/9] overflow-hidden relative">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
                    quality={75}
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-emerald-100/90 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
                {/* Gold line-drawing frame on hover */}
                <span aria-hidden className="gf-line gf-top" />
                <span aria-hidden className="gf-line gf-right" />
                <span aria-hidden className="gf-line gf-bottom" />
                <span aria-hidden className="gf-line gf-left" />
              </motion.div>
            );
            return (
              <div key={idx}>
                {/* Desktop: parallax wrapper for layered depth */}
                <ParallaxCardWrap index={idx} scrollProgress={scrollYProgress} reduce={reduce}>
                  {card}
                </ParallaxCardWrap>
                {/* Mobile: flat (parallax disabled per scroll-experience anti-pattern) */}
                <div className="md:hidden">{card}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
