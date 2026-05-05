import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Heart, Compass, Users, Sparkles, ShieldCheck } from "lucide-react";

const title = "About Sajdah Academy — পরিচিতি";
const description =
  "Sajdah Academy-এর মিশন, ভিশন ও পদ্ধতি। দেশের সেরা প্রিমিয়াম রিসোর্টে ৬ মাসের পূর্ণাঙ্গ ফিজিক্যাল ইসলামিক ট্রেনিং।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about/" },
};

const values = [
  {
    icon: <BookOpen className="w-7 h-7" />,
    title: "জ্ঞান ও প্রজ্ঞা",
    desc: "কুরআন, হাদীস ও বিশুদ্ধ ইসলামী জ্ঞান — শাস্ত্রীয় গভীরতা ও আধুনিক বাস্তবতার সমন্বয়।",
  },
  {
    icon: <Heart className="w-7 h-7" />,
    title: "তাযকিয়াহ",
    desc: "আত্মশুদ্ধি, ইখলাস ও আল্লাহর সাথে সংযোগ — পঁচিশ শতাংশ ক্লাস, পঁচাত্তর শতাংশ আমল।",
  },
  {
    icon: <Compass className="w-7 h-7" />,
    title: "প্রায়োগিক দ্বীন",
    desc: "শুধু তত্ত্ব নয় — দৈনন্দিন জীবনে ইসলাম প্রয়োগের ব্যবহারিক রূপরেখা।",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "সালেহীন সংসর্গ",
    desc: "সমমনা ভাইদের সাথে ৬ মাস — ভ্রাতৃত্ব, পরামর্শ, পারস্পরিক উন্নতি।",
  },
  {
    icon: <Sparkles className="w-7 h-7" />,
    title: "প্রিমিয়াম পরিবেশ",
    desc: "ফাইভ-স্টার সমতুল্য রিসোর্ট, শীতাতপ নিয়ন্ত্রিত ক্লাসরুম, হালাল গুরমেট খাবার।",
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "জবাবদিহিতা",
    desc: "প্রতিটি ব্যাচে সর্বোচ্চ ৪০ জন — মেন্টরের সরাসরি তত্ত্বাবধান।",
  },
];

const milestones = [
  { year: "২০২৪", event: "Sajdah Academy যাত্রা শুরু" },
  { year: "২০২৫", event: "প্রথম পাইলট ব্যাচ — গাজীপুর" },
  { year: "২০২৬", event: "৪টি ব্যাচ চালু — ১৬০+ অংশগ্রহণকারী" },
  { year: "২০২৭", event: "নিজস্ব রিট্রিট সেন্টার (পরিকল্পিত)" },
];

export default function AboutPage() {
  return (
    <main className="pt-24 pb-24">
      {/* Page hero */}
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            About · পরিচিতি
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            একটি দ্বীনি জাগরণের নাম
          </h1>
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">
            Sajdah Academy কোনো সাধারণ মাদরাসা বা শর্ট কোর্স নয় — এটি একটি ৬ মাসের ফিজিক্যাল
            লাইফস্টাইল ট্রান্সফরমেশন যা আপনাকে আল্লাহর কাছে ফিরিয়ে নিয়ে যাবে।
          </p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-8">
          <div className="glass-light rounded-3xl p-8 md:p-10">
            <span className="text-amber-600 font-bold tracking-wider uppercase text-xs mb-3 block">
              Our Mission
            </span>
            <h2 className="text-3xl font-bold text-emerald-950 mb-5">আমাদের মিশন</h2>
            <p className="text-slate-700 leading-relaxed text-lg">
              বাংলাদেশের তরুণ প্রজন্মের সামনে এমন এক প্রিমিয়াম দ্বীনি প্রোগ্রাম উপস্থাপন করা
              যেখানে তাঁরা কুরআন-সুন্নাহকে জীবনের সাথে মেলাতে শিখবেন — শ্রেণীকক্ষে নয়,
              বাস্তবে। ৬ মাসের নিরিবিলি অবস্থান, প্রিমিয়াম সুবিধা ও মেন্টরদের তত্ত্বাবধানে
              জীবনের নকশা পুনর্গঠন।
            </p>
          </div>
          <div className="glass-light rounded-3xl p-8 md:p-10">
            <span className="text-amber-600 font-bold tracking-wider uppercase text-xs mb-3 block">
              Our Vision
            </span>
            <h2 className="text-3xl font-bold text-emerald-950 mb-5">আমাদের ভিশন</h2>
            <p className="text-slate-700 leading-relaxed text-lg">
              ২০৩০ সালের মধ্যে ১,০০০+ যুবককে এই ৬ মাসের ট্রান্সফরমেশন কোর্সে অংশগ্রহণ করানো —
              যাঁরা পরবর্তীতে নিজ নিজ পেশায়, পরিবারে ও সমাজে দ্বীনের আলো বহন করবেন। ইনশাআল্লাহ,
              এক প্রজন্মে যথেষ্ট পরিবর্তন।
            </p>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-20 bg-emerald-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-3 block">
              Our Values · আমাদের মূল্যবোধ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">
              যে স্তম্ভগুলোর উপর আমরা দাঁড়িয়ে
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="glass-light glass-light-hover rounded-2xl p-7">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-emerald-950 mb-2">{v.title}</h3>
                <p className="text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-3 block">
              Journey · আমাদের যাত্রা
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950">
              যেভাবে এই পথচলা শুরু
            </h2>
          </div>
          <div className="relative pl-8 sm:pl-12">
            <div className="absolute left-2 sm:left-4 top-2 bottom-2 w-px bg-emerald-300" />
            {milestones.map((m, i) => (
              <div key={i} className="relative mb-10 last:mb-0">
                <div className="absolute -left-[26px] sm:-left-[34px] top-1.5 w-5 h-5 rounded-full bg-amber-500 ring-4 ring-emerald-50" />
                <div className="text-amber-600 font-bold text-sm tracking-wider mb-1">{m.year}</div>
                <p className="text-emerald-950 font-medium text-lg">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-900 text-white relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            পরবর্তী ব্যাচে আপনার সিট সংরক্ষণ করুন
          </h2>
          <p className="text-emerald-100 mb-8 text-lg">
            প্রতি ব্যাচে সর্বোচ্চ ৪০ জন। আবেদন এখনই করুন।
          </p>
          <Link
            href="/enroll/"
            className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg transition-all duration-200 text-lg shadow-lg shadow-amber-500/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
          >
            Apply for Enrollment →
          </Link>
        </div>
      </section>
    </main>
  );
}
