import type { Metadata } from "next";
import { Megaphone, Pin, Calendar, AlertCircle, Heart, Award } from "lucide-react";
import ComingSoon from "../../admin/_components/ComingSoon";

export const metadata: Metadata = {
  title: "Announcements — ঘোষণা",
  alternates: { canonical: "/student-dashboard/announcements/" },
  robots: { index: false, follow: false },
};

const announcements = [
  {
    pinned: true,
    type: "event",
    icon: Calendar,
    title: "ব্যাচ-৪ এর সমাপনী রিট্রিট",
    body: "৫ জুন (শুক্রবার) গাজীপুর প্রিমিয়াম রিসোর্টে ব্যাচ-৪ এর সমাপনী অনুষ্ঠান। সকল অংশগ্রহণকারীর পরিবারসহ আমন্ত্রিত। বিস্তারিত তথ্য ইমেইলে পাঠানো হবে।",
    date: "২ ঘণ্টা আগে",
    author: "Sajdah Team",
  },
  {
    pinned: true,
    type: "info",
    icon: AlertCircle,
    title: "মে মাসের ব্যাচে রুটিন পরিবর্তন",
    body: "১৫ মে শুক্রবার Class-3 (Hadith) এক ঘণ্টা পিছিয়ে ৭:৩০ AM থেকে শুরু হবে। মাওলানা আবদুল্লাহ মাহমুদ একটি জরুরি কাজে অংশ নেবেন।",
    date: "গতকাল",
    author: "Academic Coordinator",
  },
  {
    pinned: false,
    type: "spiritual",
    icon: Heart,
    title: "তাহাজ্জুদ স্ট্রিক রিমাইন্ডার",
    body: "মাশাআল্লাহ! আমাদের ব্যাচের ১২+ ভাই গত ১৫ দিন একটানা তাহাজ্জুদে দাঁড়াচ্ছেন। আল্লাহ এই অভ্যাস স্থির রাখুন। স্ট্রিক ভেঙে গেলেও হতাশ হবেন না — আবার শুরু করুন।",
    date: "৩ দিন আগে",
    author: "ড. ইমরান হাসান",
  },
  {
    pinned: false,
    type: "achievement",
    icon: Award,
    title: "Foundation Phase সমাপনী মূল্যায়ন",
    body: "৭ মে থেকে ১২ মে পর্যন্ত Foundation Phase-এর সমাপনী মূল্যায়ন। চারটি মডিউলের প্রশ্ন থাকবে — Iman, Quran, Hadith, ও Sirah। প্রস্তুতির জন্য Library-তে নোট ও রেকর্ডিং উপলব্ধ।",
    date: "৫ দিন আগে",
    author: "Sajdah Academic Office",
  },
  {
    pinned: false,
    type: "info",
    icon: Megaphone,
    title: "নতুন বই পাঠাগারে যুক্ত হয়েছে",
    body: "Library-তে এখন ১২টি নতুন রেফারেন্স বই এবং Quranic Arabic বেসিক কোর্সের ৩৫টি ভিডিও যুক্ত করা হয়েছে। সবার জন্য ফ্রি। Library সেকশনে গিয়ে দেখুন।",
    date: "১ সপ্তাহ আগে",
    author: "Resource Team",
  },
  {
    pinned: false,
    type: "event",
    icon: Calendar,
    title: "WhatsApp Q&A সেশন · মাওলানা সাইফুল",
    body: "৯ মে মঙ্গলবার রাত ৯:৩০ — WhatsApp গ্রুপে লাইভ Q&A। সিরাহ ও আখলাক বিষয়ে আপনার প্রশ্ন করুন। সেশনের শেষে ১০ মিনিট মুনাজাত।",
    date: "১ সপ্তাহ আগে",
    author: "Mentor Coordination",
  },
];

const typeColors: Record<string, string> = {
  event: "bg-amber-100 text-amber-700",
  info: "bg-blue-100 text-blue-700",
  spiritual: "bg-emerald-100 text-emerald-700",
  achievement: "bg-purple-100 text-purple-700",
};

export default function AnnouncementsPage() {
  const pinned = announcements.filter((a) => a.pinned);
  const others = announcements.filter((a) => !a.pinned);

  return (
    <div className="space-y-4">
        <ComingSoon body="ঘোষণা স্ট্রিম এখনো ডিবেস ব্যাকএন্ডের সাথে wired হয়নি — নিচের কার্ডগুলো sample।" />
        {pinned.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3 flex items-center gap-1.5">
              <Pin className="w-3 h-3" /> Pinned
            </h3>
            <div className="space-y-3">
              {pinned.map((a) => (
                <AnnouncementCard key={a.title} a={a} />
              ))}
            </div>
          </div>
        )}
        <div>
          <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">Recent</h3>
          <div className="space-y-3">
            {others.map((a) => (
              <AnnouncementCard key={a.title} a={a} />
            ))}
          </div>
        </div>
    </div>
  );
}

function AnnouncementCard({ a }: { a: (typeof announcements)[number] }) {
  const I = a.icon;
  return (
    <article
      className={`bg-white border-2 rounded-2xl p-5 ${
        a.pinned ? "border-amber-300 shadow-sm shadow-amber-100" : "border-slate-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColors[a.type]}`}>
          <I className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-bold text-emerald-950 leading-snug">{a.title}</h4>
            {a.pinned && (
              <span className="bg-amber-500 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                Pinned
              </span>
            )}
          </div>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">{a.body}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{a.author}</span>
            <span>·</span>
            <span>{a.date}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
