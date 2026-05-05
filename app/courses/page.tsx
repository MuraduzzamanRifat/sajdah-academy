import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Heart,
  Shield,
  Users,
  Droplets,
  Scale,
  Handshake,
  Briefcase,
  RefreshCcw,
  Sparkles,
  Compass,
  Clock,
  Award,
  CheckCircle2,
} from "lucide-react";

const title = "Courses — কোর্সসমূহ";
const description =
  "Sajdah Academy-এর সম্পূর্ণ কোর্স ক্যাটালগ। ১২টি মূল মডিউল, ৩টি ট্রেনিং ফেইজ, ৬ মাসের ফিজিক্যাল প্রোগ্রাম।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sajdah-academy/courses/" },
};

const tiers = [
  {
    name: "Basic Course-1",
    nameBn: "মৌলিক কোর্স",
    duration: "১ সপ্তাহান্ত",
    price: "৳ ২,৫০০",
    desc: "প্রথমবারের জন্য — দ্বীনের প্রাথমিক স্বাদ",
    features: [
      "১৬.৩০ ঘণ্টা ট্রেনিং",
      "৫ টি ক্লাস",
      "১ রাত প্রিমিয়াম রিসোর্টে থাকা",
      "সম্পূর্ণ হালাল গুরমেট খাবার",
      "ক্লাস-নোটস ও সার্টিফিকেট",
    ],
    highlight: false,
  },
  {
    name: "Foundation Program",
    nameBn: "ফাউন্ডেশন প্রোগ্রাম",
    duration: "২ মাস",
    price: "৳ ৪৫,০০০",
    desc: "ফেইজ-১: ঈমান, আকীদা ও বেসিক আমল",
    features: [
      "Phase 1 — সম্পূর্ণ পাঠ্যক্রম",
      "৪ সপ্তাহান্ত রিসোর্টে অবস্থান",
      "ব্যক্তিগত মেন্টর",
      "মাসিক প্রগ্রেস রিভিউ",
      "অনলাইন কমিউনিটি অ্যাকসেস",
    ],
    highlight: false,
  },
  {
    name: "Full 6-Month Program",
    nameBn: "পূর্ণাঙ্গ ৬ মাসের প্রোগ্রাম",
    duration: "৬ মাস",
    price: "৳ ১,৫০,০০০",
    desc: "তিন ফেইজ — সম্পূর্ণ ট্রান্সফরমেশন",
    features: [
      "Phase 1 + 2 + 3 — সব মডিউল",
      "১২ সপ্তাহান্ত রিসোর্টে অবস্থান",
      "১২ মডিউল × ৪ অধ্যায়",
      "নির্ধারিত মেন্টর + কাউন্সেলিং",
      "অভ্যাস ট্র্যাকিং সিস্টেম",
      "Lifetime কমিউনিটি অ্যাকসেস",
      "সিজদাহ Alumni নেটওয়ার্ক",
    ],
    highlight: true,
  },
];

const modules = [
  { id: 1, title: "Fa-Firru Ilallah", titleBn: "আল্লাহর দিকে দৌড়াও", icon: Compass, phase: "Foundation" },
  { id: 2, title: "Iman & Aqidah", titleBn: "ঈমান ও আক্বীদা", icon: Shield, phase: "Foundation" },
  { id: 3, title: "Quranul Kareem", titleBn: "কুরআনুল কারীম", icon: BookOpen, phase: "Foundation" },
  { id: 4, title: "Hadith e Mubarakah", titleBn: "হাদীস ই মুবারকা", icon: Sparkles, phase: "Understanding" },
  { id: 5, title: "Serratul Anbiya", titleBn: "সিরাতুল আম্বিয়া", icon: Users, phase: "Understanding" },
  { id: 6, title: "Usuwatun Hasanah", titleBn: "উসওয়াতুন হাসানা ﷺ", icon: Heart, phase: "Understanding" },
  { id: 7, title: "Fiqh-1 (তাহারাত)", titleBn: "পবিত্রতার বিধান", icon: Droplets, phase: "Understanding" },
  { id: 8, title: "Fiqh-2 (ইবাদাত)", titleBn: "ইবাদতের বিধান", icon: Scale, phase: "Transformation" },
  { id: 9, title: "Fiqh-3 (মু'আমালাত)", titleBn: "লেনদেনের বিধান", icon: Briefcase, phase: "Transformation" },
  { id: 10, title: "Fiqh-4 (মু'আশারাত)", titleBn: "সামাজিক বিধান", icon: Handshake, phase: "Transformation" },
  { id: 11, title: "Tawba & Istegfar", titleBn: "তাওবা ও ইস্তিগফার", icon: RefreshCcw, phase: "Transformation" },
  { id: 12, title: "Tazkiya (Islahun Nafs)", titleBn: "আত্মশুদ্ধি", icon: Sparkles, phase: "Transformation" },
];

const phases = ["Foundation", "Understanding", "Transformation"];

export default function CoursesPage() {
  return (
    <main className="pt-24 pb-24">
      {/* Page hero */}
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            Courses · কোর্সসমূহ
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            যে কোর্স আপনার জীবন বদলাবে
          </h1>
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">
            তিনটি স্তরের প্রোগ্রাম — শুরু করুন যেখান থেকে আপনি প্রস্তুত। ১২টি মডিউল,
            ৪৮+ অধ্যায়, ৬ মাস ব্যাপী একটি পূর্ণাঙ্গ লাইফস্টাইল রূপান্তর।
          </p>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-3 block">
              Programs · প্রোগ্রামসমূহ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">
              আপনার যাত্রা বেছে নিন
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((t, i) => (
              <div
                key={i}
                className={`relative rounded-3xl p-8 ${
                  t.highlight
                    ? "bg-emerald-900 text-white shadow-2xl shadow-emerald-900/30 scale-105 lg:scale-110 z-10"
                    : "glass-light glass-light-hover"
                }`}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-emerald-950 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                    Most Popular · সবচেয়ে জনপ্রিয়
                  </span>
                )}
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-1 ${t.highlight ? "text-white" : "text-emerald-950"}`}>
                    {t.name}
                  </h3>
                  <p className={`text-sm ${t.highlight ? "text-emerald-300" : "text-slate-500"}`}>
                    {t.nameBn}
                  </p>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-4xl font-extrabold ${t.highlight ? "text-amber-400" : "text-emerald-700"}`}>
                    {t.price}
                  </span>
                </div>
                <p className={`text-sm mb-6 ${t.highlight ? "text-emerald-200" : "text-slate-500"}`}>
                  <Clock className="inline w-4 h-4 mr-1" /> {t.duration} · {t.desc}
                </p>
                <ul className="space-y-3 mb-8">
                  {t.features.map((f, fi) => (
                    <li key={fi} className={`flex items-start gap-2 ${t.highlight ? "text-emerald-100" : "text-slate-700"}`}>
                      <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${t.highlight ? "text-amber-400" : "text-emerald-600"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/enroll/"
                  className={`block text-center px-6 py-3 rounded-lg font-bold transition-all duration-200 active:scale-[0.98] ${
                    t.highlight
                      ? "bg-amber-500 hover:bg-amber-400 text-emerald-950"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white"
                  }`}
                >
                  Enroll →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module grid by phase */}
      <section className="py-20 bg-emerald-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-3 block">
              Curriculum · পাঠ্যক্রম
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">
              ১২ মডিউল · ৩ ফেইজ
            </h2>
          </div>
          {phases.map((phase, pi) => (
            <div key={phase} className="mb-12 last:mb-0">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-full">
                  Phase {pi + 1}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-emerald-950">{phase}</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {modules
                  .filter((m) => m.phase === phase)
                  .map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.id} className="glass-light glass-light-hover rounded-2xl p-5">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-emerald-700" />
                        </div>
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                          Module {String(m.id).padStart(2, "0")}
                        </span>
                        <h4 className="font-bold text-emerald-950 leading-tight mt-1">{m.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{m.titleBn}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certification */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-emerald-950 mb-4">সিজদাহ Certificate</h2>
          <p className="text-slate-600 leading-relaxed text-lg max-w-2xl mx-auto">
            সফল অংশগ্রহণ ও মূল্যায়ন পরীক্ষায় উত্তীর্ণ হলে Sajdah Academy থেকে সার্টিফিকেট প্রদান করা হবে।
            এর সাথে থাকছে Alumni Network-এ আজীবন সদস্যপদ।
          </p>
        </div>
      </section>
    </main>
  );
}
