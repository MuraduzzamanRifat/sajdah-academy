import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { getSetting } from "../../lib/settings";

const title = "FAQ — সাধারণ জিজ্ঞাসা";
const description =
  "Sajdah Academy সম্পর্কে প্রায়শই জিজ্ঞাসিত প্রশ্ন। ফি, সময়সূচী, যোগ্যতা, রিফান্ড, কী আনতে হবে — সব এক জায়গায়।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faq/" },
};

export const revalidate = 60;

type FaqItem = { q_bn: string; a_bn: string };

const FALLBACK_FAQS: FaqItem[] = [
  { q_bn: "কোর্স কি অনলাইনে?", a_bn: "না — Sajdah Academy ১০০% ফিজিক্যাল প্রোগ্রাম।" },
  { q_bn: "ভর্তির যোগ্যতা কী?", a_bn: "১৮+ মুসলিম, যেকোনো পেশা/পটভূমি।" },
];

export default async function FAQPage() {
  const faqs = await getSetting<FaqItem[]>("faq.items", FALLBACK_FAQS);

  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            FAQ · জিজ্ঞাসা
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            যা আপনি জানতে চান
          </h1>
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">
            ভর্তির পূর্বে প্রায়শই জিজ্ঞাসিত প্রশ্নের উত্তর — সব এক জায়গায়।
            উত্তর না পেলে সরাসরি যোগাযোগ করুন।
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group glass-light rounded-2xl p-6 transition-all duration-200 open:shadow-lg [&>summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex justify-between items-start gap-4 cursor-pointer list-none">
                <h3 className="text-lg font-bold text-emerald-950 leading-tight pr-4">{f.q_bn}</h3>
                <span
                  aria-hidden
                  className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-slate-700 leading-relaxed mt-4 pt-4 border-t border-slate-200/60">
                {f.a_bn}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="py-16 bg-emerald-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <HelpCircle className="w-14 h-14 text-emerald-600 mx-auto mb-5" />
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-4">
            উত্তর খুঁজে পাচ্ছেন না?
          </h2>
          <p className="text-slate-600 mb-7 text-lg">
            আমাদের সরাসরি জিজ্ঞেস করুন — সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর পাবেন।
          </p>
          <Link
            href="/contact/"
            className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg transition-all duration-200 active:scale-[0.98]"
          >
            Contact Us →
          </Link>
        </div>
      </section>
    </main>
  );
}
