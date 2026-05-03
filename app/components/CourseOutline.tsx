"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Heart,
  Shield,
  Star,
  Users,
  Droplets,
  Scale,
  Handshake,
  Briefcase,
  RefreshCcw,
  Sparkles,
  Compass,
} from "lucide-react";

const courseOutline = [
  {
    id: 1,
    title: "Fa-Firru ILallah",
    icon: <Compass className="w-6 h-6 text-emerald-600" />,
    topics: [
      "ফিতনা-ফিতনার পরিচয় ও শেষ যামানার বাস্তবতা",
      "আমাদের জীবন ও অস্থিরতা (এসো আল্লাহর দিকে)",
      "দ্বীনের শাশ্বত আহবান ও ইসলামের সুশীতল ছায়া",
      "দ্বীনের দাওয়াত ও আখেরী নবী সাল্লাল্লাহু আলাইহি ওয়া সাল্লামের আমানত",
    ],
  },
  {
    id: 2,
    title: "Iman & Aqidah",
    icon: <Shield className="w-6 h-6 text-emerald-600" />,
    topics: [
      "ঈমানে মুফাসসাল",
      "তাওহীদ, রিসালাত ও আখিরাত",
      "শিরক ও কুফর",
      "বিদ'আত ও ভ্রান্ত আক্বীদা",
    ],
  },
  {
    id: 3,
    title: "Quranul Kareem",
    icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
    topics: [
      "কুরআনুল কারীমের হক",
      "ব্যাসিক তাজভীদ /কুরআনের আহকাম",
      "তিলাওয়াত শেখা ও তিলাওয়াত করা",
      "আন্ডারস্ট্যান্ডিং কুরআন ইন সালাত",
    ],
  },
  {
    id: 4,
    title: "Hadith e Mubarakah",
    icon: <Star className="w-6 h-6 text-emerald-600" />,
    topics: [
      "হাদীস বুঝার মূলনীতি",
      "কুরআন ও হাদীসের সামঞ্জস্যতা",
      "২০ হাদীস মুখস্থ ও প্রয়োগ",
      "হাদীসের পরিভাষা ও হাদীস-সুন্নাহর পার্থক্য",
    ],
  },
  {
    id: 5,
    title: "Serratul Anbiya",
    icon: <Users className="w-6 h-6 text-emerald-600" />,
    topics: [
      "সকল নবী আ. উপর ঈমান",
      "ইসমতে আম্বিয়া আ.",
      "উল্লেখযোগ্য নবীদের বৈশিষ্ট্য",
      "কিতাব প্রাপ্ত নবীদের বৈশিষ্ট্য ও আখেরী যামানা",
    ],
  },
  {
    id: 6,
    title: "Usuwatun Hasanah (PBUH)",
    icon: <Heart className="w-6 h-6 text-emerald-600" />,
    topics: [
      "রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম এর উপর ঈমান",
      "খতমে নবুওয়াত ও বাস্তবতা (ফিতনা)",
      "সীরাতে রাসূলে আকরাম সাল্লাল্লাহু আলাইহি ওয়া সাল্লামের মাক্কী ও মাদানী জীবন",
      "আমাদের জীবনে সীরাতের প্রয়োগ",
    ],
  },
  {
    id: 7,
    title: "Fiqh-1 (তাহারাত)",
    icon: <Droplets className="w-6 h-6 text-emerald-600" />,
    topics: [
      "তাহারাত (গোসল ও ওজু, তায়াম্মুম)",
      "নাপাকী ও নাপাকীর ধরণ",
      "পবিত্রতার উপকরণ (মাটি ও পানির ব্যবহার)",
      "হায়েয-নিফাস ও ইস্তিহাযা",
    ],
  },
  {
    id: 8,
    title: "Fiqh-2 (ইবাদাত)",
    icon: <Scale className="w-6 h-6 text-emerald-600" />,
    topics: [
      "ইবাদাত কী ও কেন? আমলের ধরণ",
      "ফরজ, ওয়াজিব, সুন্নাত, নফল ইবাদাত",
      "নামাজ, রোজা, যাকাত ও সদাকা",
      "হজ্জ, কুরবানী, দাওয়াত, জিহাদ, পর্দা",
    ],
  },
  {
    id: 9,
    title: "Fiqh-3 (মু'আমালাত)",
    icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
    topics: [
      "ব্যবসা-বাণিজ্য ও ক্রয়-বিক্রয়",
      "আমানত-বিনিয়োগ ও ব্যাংকিং ব্যবস্থা",
      "শ্রম-উপার্জন, চাকুরী, সুদ-ঘুষের বিধান",
      "আধুনিক অর্থনীতি ও শরিয়াহ ব্যবস্থা /হালাল হারাম",
    ],
  },
  {
    id: 10,
    title: "Fiqh-4 (মু'আশারাত)",
    icon: <Handshake className="w-6 h-6 text-emerald-600" />,
    topics: [
      "মা-বাবা, বিবি-সন্তান, ভাই বোন ও আত্মীয় স্বজনের হক",
      "বিয়ে-মোহর-তালাক ও পারিবারিক বিধান",
      "শ্রমিক-মালিক, প্রতিবেশীর হক/ হালাল-হারাম",
      "মীরাস সামাজিক, রাষ্ট্রীয় জীবন ও শিষ্টাচার",
    ],
  },
  {
    id: 11,
    title: "Tawba & Istegfar",
    icon: <RefreshCcw className="w-6 h-6 text-emerald-600" />,
    topics: [
      "গুনাহ ও গুনাহের ধরণ এবং গুনাহের ভয়াবহতা",
      "আল্লাহ তা'আলার ক্ষমা ও উদারতা",
      "তাওবা ও আমাদের জীবন",
      "ইস্তিগফার ও শাহাদাহ পাঠ",
    ],
  },
  {
    id: 12,
    title: "Tazkiya (Islahun Nafs)",
    icon: <Sparkles className="w-6 h-6 text-emerald-600" />,
    topics: [
      "আত্মশুদ্ধি ও আত্মসমালোচনা এবং আত্মার ১০ ব্যাধি",
      "কলব, নফস, নফসের ধরণ ও আত্মপ্রবঞ্চনা",
      "সফল জীবন, বাইয়্যাত ও সুহবতে সালেহীন",
      "অর্জনের উপায় ও পরিশুদ্ধতা",
    ],
  },
];

export default function CourseOutline() {
  return (
    <section className="py-20 bg-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">
              Course Headline & Outline
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              আমাদের কোর্সের বিস্তারিত সিলেবাস, যা আপনাকে ইসলামের প্রতিটি গুরুত্বপূর্ণ বিষয়
              সম্পর্কে সঠিক জ্ঞান প্রদান করবে।
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseOutline.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 hover:shadow-md transition-all group hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors shrink-0">
                  {course.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                    Course {course.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">
                    {course.title}
                  </h3>
                </div>
              </div>

              <ul className="space-y-3">
                {course.topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{topic}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
