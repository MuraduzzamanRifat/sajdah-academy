import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

const title = "FAQ — সাধারণ জিজ্ঞাসা";
const description =
  "Sajdah Academy সম্পর্কে প্রায়শই জিজ্ঞাসিত প্রশ্ন। ফি, সময়সূচী, যোগ্যতা, রিফান্ড, কী আনতে হবে — সব এক জায়গায়।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faq/" },
};

const faqs = [
  {
    q: "এই কোর্সে কারা ভর্তি হতে পারবেন?",
    a: "প্রাপ্তবয়স্ক যেকোনো মুসলিম ভাই (১৮+) যিনি দ্বীনের ব্যাপারে আন্তরিক, ৬ মাস সময় দিতে প্রস্তুত, এবং নিজেকে পরিবর্তন করতে চান। কোনো পূর্ব ইসলামী শিক্ষা বাধ্যতামূলক নয়।",
  },
  {
    q: "কোর্স ফি কত? কী কী অন্তর্ভুক্ত?",
    a: "Basic Course-1: ৳২,৫০০ (এক সপ্তাহান্ত)। Foundation Program: ৳৪৫,০০০ (২ মাস)। Full 6-Month Program: ৳১,৫০,০০০। সব ফিতে রিসোর্টে থাকা, হালাল গুরমেট খাবার, ক্লাস উপকরণ ও সার্টিফিকেট অন্তর্ভুক্ত। যাতায়াত খরচ অংশগ্রহণকারীর নিজস্ব।",
  },
  {
    q: "ভেন্যু কোথায়?",
    a: "ব্যাচ অনুযায়ী বিভিন্ন প্রিমিয়াম রিসোর্টে অনুষ্ঠিত হয় — গাজীপুর, সিলেট, কক্সবাজার। প্রতিটি ভেন্যু শীতাতপ নিয়ন্ত্রিত, ফাইভ-স্টার সমতুল্য সুবিধা সম্পন্ন এবং দ্বীনি পরিবেশের জন্য সুনির্বাচিত।",
  },
  {
    q: "ক্লাসের সময়সূচী কেমন?",
    a: "প্রতি সপ্তাহান্তে (বৃহস্পতিবার মাগরিব → শুক্রবার এশা) — ১৬+ ঘণ্টা। তাহাজ্জুদ, ফজর, ক্লাস, প্রকৃতিতে হাঁটা, কাউন্সেলিং, খেলাধুলা, ব্যক্তিগত আমল — সব মিলিয়ে একটি সম্পূর্ণ ২৪ ঘণ্টা। বিস্তারিত রুটিন পেইজে দেখুন।",
  },
  {
    q: "প্রতিদিন উপস্থিতি কি বাধ্যতামূলক?",
    a: "Full Program-এর প্রতিটি সপ্তাহান্ত আবশ্যক। তিনটি অনুপস্থিতির বেশি হলে সার্টিফিকেট প্রদান করা হবে না। জরুরি কারণে অনুপস্থিতির জন্য পূর্বে অনুমোদন প্রয়োজন।",
  },
  {
    q: "কী কী আনতে হবে?",
    a: "ব্যক্তিগত প্রসাধন, ২ সেট ইহরাম-পরিচ্ছদ (সাদা থব/পাঞ্জাবি), একটি জায়নামাজ, ব্যক্তিগত মুসহাফ ও নোটবুক। ওযুদানি ও বিছানাপত্র রিসোর্ট থেকে সরবরাহ। ল্যাপটপ/ফোন থাকতে পারে কিন্তু ক্লাসরুমে ব্যবহার নিষিদ্ধ।",
  },
  {
    q: "মোবাইল ফোন কি ব্যবহার করতে দেওয়া হবে?",
    a: "ক্লাস চলাকালীন ও তাহাজ্জুদ-পূর্ব রাতের সময় সম্পূর্ণ নিষিদ্ধ। শুধু লাঞ্চ ও ব্যক্তিগত সময়ে অনুমোদিত। আমরা ফোন-মুক্ত পরিবেশের গুরুত্ব বুঝি — এটি কোর্সের অপরিহার্য অংশ।",
  },
  {
    q: "নারীরা কি অংশগ্রহণ করতে পারবেন?",
    a: "বর্তমানে শুধুমাত্র পুরুষদের জন্য ব্যাচ চালু আছে। নারীদের জন্য পৃথক ব্যাচ পরিকল্পনাধীন — ২০২৭ সালের মধ্যে ইনশাআল্লাহ চালু হবে। আগ্রহীরা ওয়েটলিস্টে নাম লেখাতে পারেন।",
  },
  {
    q: "রিফান্ড পলিসি কী?",
    a: "ব্যাচ শুরুর ৩০ দিন পূর্বে বাতিলে — ৮০% রিফান্ড। ১৫ দিন পূর্বে — ৫০%। ৭ দিন পূর্বে — ২৫%। তার পর কোনো রিফান্ড নেই। তবে অসুস্থতা বা পারিবারিক জরুরির ক্ষেত্রে পরবর্তী ব্যাচে স্থানান্তর সম্ভব।",
  },
  {
    q: "পেমেন্ট কীভাবে করব?",
    a: "bKash, Nagad, ব্যাংক ট্রান্সফার, বা ডেবিট/ক্রেডিট কার্ড। Full Program-এ ৩ কিস্তিতে পেমেন্টের সুবিধা — ভর্তির সময় ৪০%, প্রথম মাসে ৩০%, তৃতীয় মাসে ৩০%।",
  },
  {
    q: "কোর্সের পরে কী?",
    a: "Sajdah Alumni Network-এ আজীবন সদস্যপদ। নিয়মিত মিট-আপ, রিইউনিয়ন রিট্রিট, একটি প্রাইভেট কমিউনিটি গ্রুপ, ও সিনিয়র মেন্টরদের সাথে কাউন্সেলিং। অনেকেই Sajdah-এর দাওয়াহ টিমে যুক্ত হয়েছেন।",
  },
  {
    q: "কোর্সের ভাষা কোনটি?",
    a: "মূল ভাষা বাংলা। কুরআন-হাদীসের মূল আরবি, ক্লাসিক্যাল রেফারেন্স এবং কিছু আধুনিক টার্ম ইংরেজিতে। অংশগ্রহণকারীদের জন্য বিশেষ ব্যবস্থা নেই — সবাই সমানভাবে পরিচালিত হন।",
  },
];

export default function FAQPage() {
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
                <h3 className="text-lg font-bold text-emerald-950 leading-tight pr-4">{f.q}</h3>
                <span
                  aria-hidden
                  className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-slate-700 leading-relaxed mt-4 pt-4 border-t border-slate-200/60">
                {f.a}
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
