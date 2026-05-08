import type { Metadata } from "next";
import Link from "next/link";
import {
  Heart,
  Smartphone,
  CreditCard,
  Gift,
  BookOpen,
  Users,
  Building,
} from "lucide-react";
import { getSettingsByPrefix, pick } from "../../../lib/settings";

const title = "Support Us — সদকা ও সহায়তা";
const description =
  "Sajdah Academy-কে সমর্থন করুন। আপনার সদকা যুবকদের দ্বীনি জাগরণে অংশীদার হওয়ার সুযোগ।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/donate/" },
};

export const revalidate = 300;

type Tier = { amount?: string; label?: string; desc?: string; icon?: string };
type Channel = {
  name?: string;
  label?: string;
  type?: string;
  number?: string;
  hint?: string;
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  book: BookOpen,
  users: Users,
  gift: Gift,
};

const CHANNEL_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  bkash: Smartphone,
  nagad: Smartphone,
  bank: Building,
  default: CreditCard,
};

const DEFAULT_TIERS: Tier[] = [
  { amount: "৫০০", label: "Daily Support", desc: "একজন অংশগ্রহণকারীর একদিনের খাবার ও আবাসন।", icon: "heart" },
  { amount: "৫,০০০", label: "Module Sponsor", desc: "একটি সম্পূর্ণ মডিউলের শিক্ষা উপকরণ।", icon: "book" },
  { amount: "২৫,০০০", label: "Scholarship", desc: "একজন আর্থিকভাবে দুর্বল ভাইয়ের Foundation Program-এর অর্ধেক।", icon: "users" },
  { amount: "১,৫০,০০০", label: "Full Scholarship", desc: "সম্পূর্ণ ৬ মাসের প্রোগ্রামে একজন ভাইকে স্পন্সর করুন।", icon: "gift" },
];

const DEFAULT_CHANNELS: Channel[] = [
  { name: "bKash", label: "Mobile Banking", type: "Personal", number: "01805 565 444", hint: "Send Money অপশনে পাঠান। reference: 'Sajdah'" },
  { name: "Nagad", label: "Mobile Banking", type: "Personal", number: "01805 565 444", hint: "Send Money — reference: 'Sajdah'" },
  { name: "Bank Transfer", label: "ব্যাংক ট্রান্সফার", type: "Account", number: "Sajdah Academy · A/C 1234567890", hint: "ব্যাংক: Islami Bank Bangladesh · Branch: Dhaka" },
];

function channelIcon(name: string | undefined): React.ComponentType<{ className?: string }> {
  const k = (name ?? "").toLowerCase();
  if (k.includes("bkash")) return CHANNEL_ICON.bkash;
  if (k.includes("nagad")) return CHANNEL_ICON.nagad;
  if (k.includes("bank")) return CHANNEL_ICON.bank;
  return CHANNEL_ICON.default;
}

export default async function DonatePage() {
  const s = await getSettingsByPrefix("donate.");
  const eyebrow = pick(s, "donate.eyebrow", "Sadaqah · সদকা");
  const titleBn = pick(s, "donate.title_bn", "একজনের পরিবর্তনে অংশীদার হোন");
  const subtitleBn = pick(
    s,
    "donate.subtitle_bn",
    `"যে ব্যক্তি কোনো ভালো কাজের সূচনা করল, সে তার প্রতিদান পাবে এবং যারা তাঁকে অনুসরণ করল তাদের প্রতিদানও পাবে — কিন্তু তাদের প্রতিদান থেকে কিছুই কমানো হবে না।" — সহীহ মুসলিম`
  );
  const tiersEyebrow = pick(s, "donate.tiers_eyebrow", "Your Impact · আপনার প্রভাব");
  const tiersTitle = pick(s, "donate.tiers_title_bn", "যেভাবে আপনার সদকা কাজে লাগে");
  const tiers = pick<Tier[]>(s, "donate.tiers", DEFAULT_TIERS).filter((t) => t.amount || t.label);
  const channelsTitle = pick(s, "donate.channels_title_bn", "পেমেন্ট চ্যানেলসমূহ");
  const channelsSubtitle = pick(s, "donate.channels_subtitle_bn", "আপনার পছন্দের মাধ্যমে পাঠান");
  const channels = pick<Channel[]>(s, "donate.channels", DEFAULT_CHANNELS).filter((c) => c.name);
  const channelsFooter = pick(
    s,
    "donate.channels_footer_bn",
    "পেমেন্টের পর WhatsApp-এ স্ক্রিনশট পাঠালে আমরা ভাউচার ইস্যু করব। সদকাহ গৃহীত হলে দু'আ করব।"
  );
  const ctaTitle = pick(s, "donate.cta_title_bn", "নিয়মিত সদকার মাধ্যমে অংশীদার হতে চান?");
  const ctaBody = pick(
    s,
    "donate.cta_body_bn",
    "মাসিক স্পনসরশিপ প্রোগ্রামে যোগ দিন — আপনার সদকা একজন অংশগ্রহণকারীর সম্পূর্ণ যাত্রায় ছায়া হয়ে থাকবে।"
  );
  const ctaButton = pick(s, "donate.cta_button_bn", "Become a Sponsor →");
  const ctaHref = pick(s, "donate.cta_href", "/contact/");

  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Heart className="w-16 h-16 text-amber-400 mx-auto mb-5" />
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            {eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{titleBn}</h1>
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
            {subtitleBn}
          </p>
        </div>
      </section>

      {tiers.length > 0 && (
        <section className="py-16 bg-slate-50 relative overflow-hidden">
          <div aria-hidden className="ambient-orbs orbs-light" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-2 block">
                {tiersEyebrow}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-950">{tiersTitle}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {tiers.map((t, i) => {
                const Icon = ICON_MAP[t.icon ?? "heart"] ?? Heart;
                return (
                  <div key={i} className="glass-light glass-light-hover rounded-2xl p-6 text-center">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7" />
                    </div>
                    {t.amount && (
                      <div className="text-3xl font-extrabold text-emerald-700 mb-1">৳ {t.amount}</div>
                    )}
                    {t.label && (
                      <div className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-3">
                        {t.label}
                      </div>
                    )}
                    {t.desc && <p className="text-sm text-slate-600 leading-relaxed">{t.desc}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {channels.length > 0 && (
        <section className="py-16 bg-emerald-50 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-emerald-950 mb-2">{channelsTitle}</h2>
              <p className="text-slate-600">{channelsSubtitle}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {channels.map((c, i) => {
                const Icon = channelIcon(c.name);
                return (
                  <div
                    key={i}
                    className="glass-light rounded-2xl p-6 border-2 border-transparent hover:border-amber-400/50 transition-colors"
                  >
                    <Icon className="w-10 h-10 text-emerald-700 mb-4" />
                    {c.name && <h3 className="text-lg font-bold text-emerald-950 mb-1">{c.name}</h3>}
                    {(c.label || c.type) && (
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">
                        {c.label}
                        {c.label && c.type && " · "}
                        {c.type}
                      </p>
                    )}
                    {c.number && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3">
                        <p className="font-mono text-sm text-emerald-900 break-words">{c.number}</p>
                      </div>
                    )}
                    {c.hint && <p className="text-xs text-slate-600 leading-relaxed">{c.hint}</p>}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-sm text-slate-600 mt-8 whitespace-pre-line">{channelsFooter}</p>
          </div>
        </section>
      )}

      <section className="py-16 bg-emerald-900 text-white relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{ctaTitle}</h2>
          <p className="text-emerald-100 mb-7 leading-relaxed text-lg">{ctaBody}</p>
          <Link
            href={ctaHref}
            className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg active:scale-[0.98]"
          >
            {ctaButton}
          </Link>
        </div>
      </section>
    </main>
  );
}
