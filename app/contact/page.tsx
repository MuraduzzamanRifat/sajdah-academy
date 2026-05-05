import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import ContactForm from "../components/ContactForm";

const title = "Contact — যোগাযোগ";
const description =
  "Sajdah Academy-এর সাথে যোগাযোগ। ফোন, ইমেইল, WhatsApp, অথবা সরাসরি বার্তা পাঠান।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sajdah-academy/contact/" },
};

const channels = [
  {
    icon: Phone,
    label: "Phone",
    labelBn: "ফোন",
    primary: "+880 180 55 65 444",
    href: "tel:+880180556544",
    hint: "শনি-বৃহঃ · ১০:০০ - ১৮:০০",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    labelBn: "হোয়াটসঅ্যাপ",
    primary: "+880 180 55 65 444",
    href: "https://wa.me/880180556544",
    hint: "২৪ ঘণ্টার মধ্যে উত্তর",
  },
  {
    icon: Mail,
    label: "Email",
    labelBn: "ইমেইল",
    primary: "sijdah.academybd@gmail.com",
    href: "mailto:sijdah.academybd@gmail.com",
    hint: "সাধারণ অনুসন্ধানের জন্য",
  },
];

export default function ContactPage() {
  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            Contact · যোগাযোগ
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">আমরা শুনছি</h1>
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">
            যেকোনো প্রশ্ন, সংশয় বা পরামর্শ — আমাদের সাথে যোগাযোগ করুন। সাধারণত ২৪ ঘণ্টার মধ্যে
            উত্তর পাবেন। জরুরি বিষয়ের জন্য সরাসরি ফোন করুন।
          </p>
        </div>
      </section>

      {/* Contact channels */}
      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-6">
            {channels.map((c, i) => {
              const Icon = c.icon;
              return (
                <a
                  key={i}
                  href={c.href}
                  className="glass-light glass-light-hover rounded-2xl p-7 block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
                >
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-amber-600 font-bold tracking-wider uppercase text-xs mb-1 block">
                    {c.label} · {c.labelBn}
                  </span>
                  <p className="text-emerald-950 font-bold text-lg mb-2">{c.primary}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {c.hint}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact form + office info */}
      <section className="py-20 bg-emerald-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <h2 className="text-3xl font-bold text-emerald-950 mb-2">আমাদের একটি বার্তা পাঠান</h2>
            <p className="text-slate-600 mb-8">
              ফর্মটি পূরণ করুন — আমাদের টিম যত দ্রুত সম্ভব আপনাকে উত্তর দেবে।
            </p>
            <ContactForm />
          </div>

          <aside className="md:col-span-2 space-y-6">
            <div className="glass-light rounded-2xl p-7">
              <MapPin className="w-7 h-7 text-amber-600 mb-3" />
              <h3 className="text-lg font-bold text-emerald-950 mb-2">Office · অফিস</h3>
              <p className="text-slate-700 leading-relaxed text-sm">
                Sajdah Academy<br />
                ঢাকা, বাংলাদেশ<br />
                <span className="text-slate-500">(সাক্ষাৎ পূর্বানুমতি সাপেক্ষে)</span>
              </p>
            </div>

            <div className="glass-light rounded-2xl p-7">
              <Clock className="w-7 h-7 text-amber-600 mb-3" />
              <h3 className="text-lg font-bold text-emerald-950 mb-2">Office Hours</h3>
              <dl className="text-sm text-slate-700 space-y-2">
                <div className="flex justify-between">
                  <dt>শনি – বৃহস্পতিবার</dt>
                  <dd className="font-medium">১০:০০ – ১৮:০০</dd>
                </div>
                <div className="flex justify-between">
                  <dt>শুক্রবার</dt>
                  <dd className="font-medium text-emerald-700">বন্ধ (জুমু'আহ)</dd>
                </div>
              </dl>
            </div>

            <div className="bg-emerald-700 text-white rounded-2xl p-7">
              <h3 className="text-lg font-bold mb-2">দ্রুত সাহায্য চান?</h3>
              <p className="text-emerald-100 text-sm leading-relaxed mb-4">
                ভর্তি সংক্রান্ত জরুরি প্রশ্ন? আমাদের ১৫ মিনিটের ফ্রি কাউন্সেলিং কল বুক করুন।
              </p>
              <a
                href="https://wa.me/880180556544"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg transition-all duration-200 active:scale-[0.98] text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp এ কল বুক করুন
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
