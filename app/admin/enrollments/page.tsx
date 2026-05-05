import type { Metadata } from "next";
import { Check, X, MessageSquare, ChevronRight, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Enrollments",
  alternates: { canonical: "/admin/enrollments/" },
  robots: { index: false, follow: false },
};

const applications = [
  {
    name: "Tariq Aziz",
    age: 24,
    profession: "Software Engineer",
    location: "Dhanmondi, Dhaka",
    phone: "+880 19 1122 3344",
    submittedAt: "৩ মে ২০২৬, ৭:২৪ PM",
    motivation: "ব্যস্ত জীবনে আত্মিক ভারসাম্য খুঁজছি — কোম্পানির চাপের পাশাপাশি আল্লাহর দিকে ফেরার পথ চাই।",
    referral: "Facebook ad",
    paymentReceived: false,
    docsComplete: true,
    score: 86,
  },
  {
    name: "Fardin Hossain",
    age: 28,
    profession: "Doctor (Resident)",
    location: "Mirpur, Dhaka",
    phone: "+880 16 5544 9988",
    submittedAt: "৩ মে ২০২৬, ৩:১২ PM",
    motivation: "মেডিকেল ফিল্ডে নৈতিক চ্যালেঞ্জ অনেক — সিরাত-নির্ভর পথনির্দেশনা প্রয়োজন।",
    referral: "Alumni reference (SA-2025-0301)",
    paymentReceived: true,
    docsComplete: true,
    score: 94,
  },
  {
    name: "Jamil Rahman",
    age: 31,
    profession: "Banker",
    location: "Chittagong",
    phone: "+880 17 7766 8899",
    submittedAt: "২ মে ২০২৬, ১১:৪৮ AM",
    motivation: "ব্যাংকিং সংক্রান্ত হালাল-হারাম ফিকহ ভালোভাবে শিখতে চাই।",
    referral: "Google search",
    paymentReceived: false,
    docsComplete: false,
    score: 71,
  },
  {
    name: "Rakib Hassan",
    age: 22,
    profession: "Student (BUET)",
    location: "Tejgaon, Dhaka",
    phone: "+880 18 4433 2211",
    submittedAt: "১ মে ২০২৬, ৫:০৩ PM",
    motivation: "ক্যাম্পাসে দ্বীনি পরিবেশ কম — ফিতনা প্রতিরোধে পথ চাই।",
    referral: "YouTube",
    paymentReceived: false,
    docsComplete: true,
    score: 79,
  },
  {
    name: "Sabbir Anwar",
    age: 35,
    profession: "Businessman",
    location: "Sylhet",
    phone: "+880 19 5566 7788",
    submittedAt: "৩০ এপ্রিল ২০২৬, ৯:১৫ PM",
    motivation: "ব্যবসায় ইসলামী চুক্তি ও মুয়ামালাত প্রয়োগ করতে চাই।",
    referral: "Friend referral",
    paymentReceived: true,
    docsComplete: true,
    score: 88,
  },
];

export default function AdminEnrollmentsPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat value="৯" label="মোট আবেদন" tone="emerald" />
        <Stat value="৪" label="পেমেন্ট সম্পন্ন" tone="emerald" />
        <Stat value="৩" label="ডকুমেন্ট অসম্পূর্ণ" tone="amber" />
        <Stat value="২" label="৪৮ ঘণ্টায় গ্রহণ" tone="rose" />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-900">ব্যাচ-৫ এর জন্য ৪০টি আসন · ভর্তি বন্ধ ১৫ মে</p>
          <p className="text-xs text-amber-700 mt-1">
            ৯টি আবেদন গৃহীত · ৩১টি আসন বাকি। আবেদনকারীদের ৪৮ ঘণ্টার মধ্যে ফিডব্যাক দিন।
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {applications.map((a) => (
          <article key={a.phone} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-emerald-950">{a.name}</h4>
                    <span className="text-xs text-slate-500">· বয়স {a.age}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        a.score >= 85
                          ? "bg-emerald-100 text-emerald-700"
                          : a.score >= 75
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      Match {a.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {a.profession} · {a.location} · {a.phone}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed mt-2 italic">
                    “{a.motivation}”
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-3">
                    <span>উৎস: {a.referral}</span>
                    <span>·</span>
                    <span>জমা: {a.submittedAt}</span>
                    <span>·</span>
                    <span className={a.paymentReceived ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                      {a.paymentReceived ? "✓ পেমেন্ট" : "○ পেমেন্ট অপেক্ষমাণ"}
                    </span>
                    <span>·</span>
                    <span className={a.docsComplete ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                      {a.docsComplete ? "✓ ডকুমেন্ট" : "⚠ ডকুমেন্ট অসম্পূর্ণ"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
                >
                  <Check className="w-3.5 h-3.5" /> গ্রহণ
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> বার্তা
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-bold"
                  aria-label="Reject"
                >
                  <X className="w-3.5 h-3.5" /> বাতিল
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2 py-2 text-slate-500 hover:text-slate-900 text-xs"
                  aria-label="View full application"
                >
                  বিস্তারিত <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Stat({ value, label, tone }: { value: string; label: string; tone: "emerald" | "amber" | "rose" }) {
  const map = {
    emerald: "text-emerald-700",
    amber: "text-amber-700",
    rose: "text-rose-700",
  } as const;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className={`text-2xl font-bold leading-none ${map[tone]}`}>{value}</div>
      <div className="text-[11px] text-slate-500 mt-1.5">{label}</div>
    </div>
  );
}
