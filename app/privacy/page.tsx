import type { Metadata } from "next";

const title = "Privacy Policy & Terms — গোপনীয়তা নীতি";
const description =
  "Sajdah Academy-এর গোপনীয়তা নীতি ও কোর্সের শর্তাবলী। আপনার তথ্য কীভাবে সংরক্ষণ ও ব্যবহার করা হয়।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sajdah-academy/privacy/" },
};

export default function PrivacyPage() {
  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-16 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-3">
            Legal
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Privacy Policy & Terms
          </h1>
          <p className="text-emerald-100">সর্বশেষ আপডেট: মে ২০২৬</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose-content space-y-10">
          {/* Privacy */}
          <div id="privacy">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-3">
              ১. গোপনীয়তা নীতি (Privacy Policy)
            </h2>

            <h3 className="text-lg font-bold text-emerald-900 mt-6 mb-2">কোন তথ্য আমরা সংগ্রহ করি</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              যখন আপনি ভর্তির আবেদন বা যোগাযোগ ফর্ম পূরণ করেন, আমরা সংগ্রহ করি:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mb-4">
              <li>নাম, পিতার নাম, বয়স, শহর</li>
              <li>ফোন, WhatsApp, ইমেইল</li>
              <li>পেশা ও শিক্ষাগত পটভূমি</li>
              <li>আপনার পেমেন্ট তথ্য (পেমেন্ট গেটওয়ে কর্তৃক প্রক্রিয়াকৃত)</li>
            </ul>

            <h3 className="text-lg font-bold text-emerald-900 mt-6 mb-2">কীভাবে ব্যবহৃত হয়</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mb-4">
              <li>আপনার ভর্তি প্রক্রিয়া পরিচালনা</li>
              <li>ব্যাচ-সংক্রান্ত গুরুত্বপূর্ণ যোগাযোগ</li>
              <li>কোর্স উপকরণ ও সাপোর্ট প্রদান</li>
              <li>মানোন্নয়নের জন্য মতামত সংগ্রহ</li>
            </ul>

            <h3 className="text-lg font-bold text-emerald-900 mt-6 mb-2">তৃতীয় পক্ষের সাথে শেয়ারিং</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              আমরা আপনার তথ্য বিক্রি করি না বা বিজ্ঞাপনের জন্য শেয়ার করি না। শুধুমাত্র অপরিহার্য
              পরিষেবা প্রদানকারীদের সাথে (পেমেন্ট গেটওয়ে, ইমেইল সার্ভিস) ন্যূনতম তথ্য শেয়ার করা হয়।
            </p>

            <h3 className="text-lg font-bold text-emerald-900 mt-6 mb-2">আপনার অধিকার</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mb-4">
              <li>আপনার তথ্য দেখার অধিকার</li>
              <li>সংশোধনের অনুরোধ</li>
              <li>সম্পূর্ণ মুছে ফেলার অনুরোধ</li>
              <li>মার্কেটিং ইমেইল থেকে অপ্ট-আউট</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              উপরোক্ত যেকোনো অধিকার প্রয়োগের জন্য{" "}
              <a href="mailto:sijdah.academybd@gmail.com" className="text-emerald-700 underline hover:text-emerald-900">
                sijdah.academybd@gmail.com
              </a>
              -এ যোগাযোগ করুন।
            </p>
          </div>

          {/* Terms */}
          <div id="terms" className="pt-6 border-t border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-3">
              ২. কোর্সের শর্তাবলী (Terms)
            </h2>

            <h3 className="text-lg font-bold text-emerald-900 mt-6 mb-2">ভর্তি ও পেমেন্ট</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mb-4">
              <li>ভর্তি কোর্স ফি পরিশোধের পরই নিশ্চিত হয়</li>
              <li>সিট সীমিত — first-come basis-এ বরাদ্দ</li>
              <li>কিস্তি পেমেন্ট নির্ধারিত সময়সূচী অনুযায়ী মেনে চলতে হবে</li>
            </ul>

            <h3 className="text-lg font-bold text-emerald-900 mt-6 mb-2">আচরণবিধি</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mb-4">
              <li>রিসোর্টে ও ক্লাসে ইসলামী আদব বজায় রাখতে হবে</li>
              <li>ক্লাস চলাকালে মোবাইল নিষিদ্ধ</li>
              <li>মেন্টর ও সহপাঠীদের সাথে সম্মানজনক আচরণ</li>
              <li>রিসোর্টের নিয়মাবলী মেনে চলা</li>
            </ul>

            <h3 className="text-lg font-bold text-emerald-900 mt-6 mb-2">রিফান্ড পলিসি</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mb-4">
              <li>ব্যাচ শুরুর ৩০ দিন পূর্বে — ৮০% রিফান্ড</li>
              <li>১৫ দিন পূর্বে — ৫০% রিফান্ড</li>
              <li>৭ দিন পূর্বে — ২৫% রিফান্ড</li>
              <li>তার পরে — কোনো রিফান্ড নয় (তবে পরবর্তী ব্যাচে স্থানান্তর সম্ভব)</li>
            </ul>

            <h3 className="text-lg font-bold text-emerald-900 mt-6 mb-2">কোর্স থেকে অপসারণ</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              আচরণবিধি লঙ্ঘন, অন্যান্য অংশগ্রহণকারীদের ক্ষতিসাধন, বা কোর্সের পরিবেশ ক্ষুণ্ন
              করার চেষ্টা — যেকোনো কারণে অংশগ্রহণকারীকে কোর্স থেকে অপসারণের পূর্ণ অধিকার আমরা
              সংরক্ষণ করি। সেক্ষেত্রে কোনো রিফান্ড দেওয়া হবে না।
            </p>

            <h3 className="text-lg font-bold text-emerald-900 mt-6 mb-2">পরিবর্তন</h3>
            <p className="text-slate-700 leading-relaxed">
              এই নীতি ও শর্তাবলী Sajdah Academy যেকোনো সময় আপডেট করার অধিকার রাখে। উল্লেখযোগ্য
              পরিবর্তনের ক্ষেত্রে অংশগ্রহণকারীদের ইমেইলে অবহিত করা হবে।
            </p>
          </div>

          <div className="pt-6 border-t border-slate-200 text-sm text-slate-500">
            <p>
              এই নীতিমালা সম্পর্কিত যেকোনো প্রশ্নের জন্য:{" "}
              <a href="mailto:sijdah.academybd@gmail.com" className="text-emerald-700 underline">
                sijdah.academybd@gmail.com
              </a>
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
