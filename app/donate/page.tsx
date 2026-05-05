import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Smartphone, CreditCard, Gift, BookOpen, Users, Building } from "lucide-react";

const title = "Support Us — সদকা ও সহায়তা";
const description =
  "Sajdah Academy-কে সমর্থন করুন। আপনার সদকা যুবকদের দ্বীনি জাগরণে অংশীদার হওয়ার সুযোগ।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/donate/" },
};

const impactTiers = [
  {
    amount: "৫০০",
    label: "Daily Support",
    desc: "একজন অংশগ্রহণকারীর একদিনের খাবার ও আবাসন।",
    icon: Heart,
  },
  {
    amount: "৫,০০০",
    label: "Module Sponsor",
    desc: "একটি সম্পূর্ণ মডিউলের শিক্ষা উপকরণ।",
    icon: BookOpen,
  },
  {
    amount: "২৫,০০০",
    label: "Scholarship",
    desc: "একজন আর্থিকভাবে দুর্বল ভাইয়ের Foundation Program-এর অর্ধেক।",
    icon: Users,
  },
  {
    amount: "১,৫০,০০০",
    label: "Full Scholarship",
    desc: "সম্পূর্ণ ৬ মাসের প্রোগ্রামে একজন ভাইকে স্পন্সর করুন।",
    icon: Gift,
  },
];

const channels = [
  {
    name: "bKash",
    label: "Mobile Banking",
    type: "Personal",
    number: "01805 565 444",
    accent: "pink",
    hint: "Send Money অপশনে পাঠান। reference: 'Sajdah'",
  },
  {
    name: "Nagad",
    label: "Mobile Banking",
    type: "Personal",
    number: "01805 565 444",
    accent: "orange",
    hint: "Send Money — reference: 'Sajdah'",
  },
  {
    name: "Bank Transfer",
    label: "ব্যাংক ট্রান্সফার",
    type: "Account",
    number: "Sajdah Academy · A/C 1234567890",
    accent: "emerald",
    hint: "ব্যাংক: Islami Bank Bangladesh · Branch: Dhaka",
  },
];

export default function DonatePage() {
  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Heart className="w-16 h-16 text-amber-400 mx-auto mb-5" />
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            Sadaqah · সদকা
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            একজনের পরিবর্তনে অংশীদার হোন
          </h1>
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">
            "যে ব্যক্তি কোনো ভালো কাজের সূচনা করল, সে তার প্রতিদান পাবে এবং যারা তাঁকে অনুসরণ করল
            তাদের প্রতিদানও পাবে — কিন্তু তাদের প্রতিদান থেকে কিছুই কমানো হবে না।" — সহীহ মুসলিম
          </p>
        </div>
      </section>

      {/* Impact tiers */}
      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-2 block">
              Your Impact · আপনার প্রভাব
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950">
              যেভাবে আপনার সদকা কাজে লাগে
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {impactTiers.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="glass-light glass-light-hover rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-700 mb-1">৳ {t.amount}</div>
                  <div className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-3">
                    {t.label}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Payment channels */}
      <section className="py-16 bg-emerald-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-emerald-950 mb-2">পেমেন্ট চ্যানেলসমূহ</h2>
            <p className="text-slate-600">আপনার পছন্দের মাধ্যমে পাঠান</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {channels.map((c) => {
              const Icon = c.name === "Bank Transfer" ? Building : c.name === "bKash" ? Smartphone : CreditCard;
              return (
                <div
                  key={c.name}
                  className="glass-light rounded-2xl p-6 border-2 border-transparent hover:border-amber-400/50 transition-colors"
                >
                  <Icon className="w-10 h-10 text-emerald-700 mb-4" />
                  <h3 className="text-lg font-bold text-emerald-950 mb-1">{c.name}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">{c.label} · {c.type}</p>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3">
                    <p className="font-mono text-sm text-emerald-900 break-words">{c.number}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.hint}</p>
                </div>
              );
            })}
          </div>
          <p className="text-center text-sm text-slate-600 mt-8">
            পেমেন্টের পর{" "}
            <a href="https://wa.me/880180556544" className="text-emerald-700 underline hover:text-emerald-900">
              WhatsApp
            </a>
            -এ স্ক্রিনশট পাঠালে আমরা ভাউচার ইস্যু করব। সদকাহ গৃহীত হলে দু'আ করব।
          </p>
        </div>
      </section>

      {/* Recurring sponsorship CTA */}
      <section className="py-16 bg-emerald-900 text-white relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">নিয়মিত সদকার মাধ্যমে অংশীদার হতে চান?</h2>
          <p className="text-emerald-100 mb-7 leading-relaxed text-lg">
            মাসিক স্পনসরশিপ প্রোগ্রামে যোগ দিন — আপনার সদকা একজন অংশগ্রহণকারীর সম্পূর্ণ যাত্রায়
            ছায়া হয়ে থাকবে। ইনশাআল্লাহ সাদাকায়ে জারিয়াহ।
          </p>
          <Link
            href="/contact/"
            className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg active:scale-[0.98]"
          >
            Become a Sponsor →
          </Link>
        </div>
      </section>
    </main>
  );
}
