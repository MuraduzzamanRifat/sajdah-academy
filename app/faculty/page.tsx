import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Mail, BookOpen } from "lucide-react";

const title = "Faculty — শিক্ষকমণ্ডলী";
const description =
  "Sajdah Academy-এর মেন্টর ও শিক্ষকদের সাথে পরিচিত হোন। দেশের সম্মানিত আলেম, পেশাদার ও মেন্টরগণ।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sajdah-academy/faculty/" },
};

const mentors = [
  {
    name: "মাওলানা আবদুল্লাহ মাহমুদ",
    role: "মূল মেন্টর · Aqeedah & Hadith",
    qualifications: "দাওরায়ে হাদীস (জামিয়া), দারুল উলূম দেওবন্দ",
    bio: "১৮ বছর ধরে যুবকদের ইসলামী জাগরণে কাজ করছেন। বিশেষজ্ঞতা — আক্বীদা, হাদীস ও ইসলামিক তরবিয়াহ। বহু বইয়ের লেখক।",
    initial: "আ",
  },
  {
    name: "মুফতি জাকারিয়া হোসাইন",
    role: "Fiqh & Mu'amalat বিশেষজ্ঞ",
    qualifications: "ইফতা — দারুল উলূম হাটহাজারী; LLB — ঢাকা বিশ্ববিদ্যালয়",
    bio: "আধুনিক অর্থনীতি, ব্যাংকিং, ও মুসলিম পরিবার আইনে বিশেষজ্ঞ। হালাল-হারাম ও মু'আমালাত বিষয়ে দেশের অন্যতম রেফারেন্স।",
    initial: "জ",
  },
  {
    name: "ড. ইমরান হাসান",
    role: "Tazkiyah & Spiritual Counselling",
    qualifications: "PhD ইসলামিক স্টাডিজ — Al-Azhar; ক্লিনিক্যাল সাইকোলজি",
    bio: "নফসের রোগ ও চিকিৎসা — শাস্ত্রীয় তাযকিয়াহ ও আধুনিক মনস্তত্ত্বের সমন্বয়। ব্যক্তিগত কাউন্সেলিং সেশন পরিচালনা করেন।",
    initial: "ই",
  },
  {
    name: "ক্বারী মুহাম্মদ ইউসুফ",
    role: "Quran & Tajweed Master",
    qualifications: "সনদে কুরআন — সিলসিলা মুতাওয়াতিরাহ; হাফেজ ও ক্বারী",
    bio: "তাজভীদসহ কুরআন তিলাওয়াত, হিফয, ও তাফসীর শিক্ষা। বহু ছাত্রকে বিশ্বমানের ক্বারী হিসেবে গড়ে তুলেছেন।",
    initial: "ই",
  },
  {
    name: "ব্রাদার ফাহিম রহমান",
    role: "Lifestyle Coach & Habit Mentor",
    qualifications: "MBA — IBA, ঢাকা বিশ্ববিদ্যালয়; সার্টিফাইড লাইফ কোচ",
    bio: "Habit Building, productivity, ও দ্বীনি লাইফস্টাইল ডিজাইন — তরুণদের জন্য বাস্তবসম্মত গাইডেন্স। প্রাক্তন কর্পোরেট লিডার।",
    initial: "ফ",
  },
  {
    name: "মাওলানা সাইফুল ইসলাম",
    role: "Seerah & Akhlaq",
    qualifications: "মাস্টার্স — ইসলামিক স্টাডিজ; দাওরায়ে হাদীস",
    bio: "সিরাতে রাসূল ﷺ ও সাহাবা রা.-এর জীবনীর গভীর গবেষক। চরিত্র গঠন ও আদর্শ ব্যক্তিত্ব নির্মাণে দীর্ঘ অভিজ্ঞতা।",
    initial: "স",
  },
];

export default function FacultyPage() {
  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            Faculty · শিক্ষকমণ্ডলী
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">যাদের কাছে শিখবেন</h1>
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">
            শাস্ত্রীয় গভীরতা, পেশাদার অভিজ্ঞতা, ও আধুনিক বাস্তবতার সমন্বয় —
            দেশের সম্মানিত আলেম, মুফতি, একাডেমিক ও মেন্টরদের একটি দল।
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((m, i) => (
              <article key={i} className="glass-light glass-light-hover rounded-3xl p-7">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center font-bold text-2xl shrink-0">
                    {m.initial}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-950 leading-tight">{m.name}</h3>
                    <p className="text-sm text-amber-600 font-medium mt-0.5">{m.role}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 mb-4 pb-4 border-b border-slate-200/60">
                  <GraduationCap className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed">{m.qualifications}</p>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{m.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-emerald-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <BookOpen className="w-14 h-14 text-emerald-600 mx-auto mb-5" />
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-4">
            একজন মেন্টরের সাথে কথা বলতে চান?
          </h2>
          <p className="text-slate-600 mb-7 text-lg">
            ভর্তির আগে প্রশ্ন আছে? আমরা ১৫ মিনিটের একটি কাউন্সেলিং কল-এর ব্যবস্থা করতে পারি।
          </p>
          <Link
            href="/contact/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-all duration-200 active:scale-[0.98]"
          >
            <Mail className="w-5 h-5" />
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
