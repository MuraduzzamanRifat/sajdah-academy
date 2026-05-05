import type { Metadata } from "next";
import { Plus, Calendar, MapPin, Users, ChevronRight, Edit3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Batches",
  alternates: { canonical: "/admin/batches/" },
  robots: { index: false, follow: false },
};

const batches = [
  {
    name: "ব্যাচ-৫",
    code: "B5-2026-AUG",
    status: "open",
    startsAt: "১ আগস্ট ২০২৬",
    endsAt: "৩১ জুলাই ২০২৭",
    location: "অনলাইন + ২ অফলাইন রিট্রিট",
    capacity: 40,
    enrolled: 9,
    waitlist: 0,
    fee: "৳ ২,২৫,০০০ (৪ কিস্তি)",
    note: "ভর্তি বন্ধ ১৫ মে · প্রথম ক্লাস ২ আগস্ট",
  },
  {
    name: "ব্যাচ-৪",
    code: "B4-2026-FEB",
    status: "running",
    startsAt: "১ ফেব্রুয়ারি ২০২৬",
    endsAt: "৩১ জানু ২০২৭",
    location: "অনলাইন + ৪ গাজীপুর রিট্রিট",
    capacity: 40,
    enrolled: 38,
    waitlist: 0,
    fee: "৳ ২,২৫,০০০",
    note: "Block 4 চলমান · Hadith মডিউল",
  },
  {
    name: "ব্যাচ-৩",
    code: "B3-2025-AUG",
    status: "running",
    startsAt: "১ আগস্ট ২০২৫",
    endsAt: "৩১ জুলাই ২০২৬",
    location: "অনলাইন + ৪ রিট্রিট",
    capacity: 35,
    enrolled: 33,
    waitlist: 0,
    fee: "৳ ২,১০,০০০",
    note: "Phase 2 (Understanding) — Fiqh-2 চলমান",
  },
  {
    name: "ব্যাচ-২",
    code: "B2-2025-FEB",
    status: "running",
    startsAt: "১ ফেব্রুয়ারি ২০২৫",
    endsAt: "৩১ জানু ২০২৬",
    location: "অনলাইন + ৪ রিট্রিট",
    capacity: 30,
    enrolled: 28,
    waitlist: 0,
    fee: "৳ ১,৯৫,০০০",
    note: "Final block · সমাপ্তি মার্চ-এ",
  },
  {
    name: "ব্যাচ-১",
    code: "B1-2024-AUG",
    status: "completed",
    startsAt: "১ আগস্ট ২০২৪",
    endsAt: "৩১ জুলাই ২০২৫",
    location: "অনলাইন + ৪ রিট্রিট",
    capacity: 25,
    enrolled: 25,
    waitlist: 0,
    fee: "৳ ১,৭৫,০০০",
    note: "২২ জন সমাপ্ত · ৩ জন স্থগিত",
  },
];

const statusBadge: Record<string, string> = {
  open: "bg-amber-100 text-amber-700",
  running: "bg-emerald-100 text-emerald-700",
  completed: "bg-slate-100 text-slate-500",
};
const statusLabel: Record<string, string> = {
  open: "ভর্তি চলমান",
  running: "চলমান",
  completed: "সমাপ্ত",
};

export default function AdminBatchesPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950">৫ ব্যাচ মোট</h2>
          <p className="text-xs text-slate-500 mt-0.5">১ ভর্তি · ৩ চলমান · ১ সমাপ্ত · ১৩৩ ছাত্র</p>
        </div>
        <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
          <Plus className="w-3.5 h-3.5" /> নতুন ব্যাচ
        </button>
      </div>

      <div className="space-y-3">
        {batches.map((b) => {
          const fillPct = Math.round((b.enrolled / b.capacity) * 100);
          return (
            <article key={b.code} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {b.name.split("-")[1]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-emerald-950">{b.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[b.status]}`}>
                        {statusLabel[b.status]}
                      </span>
                      <code className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{b.code}</code>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {b.startsAt} → {b.endsAt}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {b.location}
                      </span>
                      <span className="font-bold text-emerald-700">{b.fee}</span>
                    </div>
                    <p className="text-xs text-slate-500 italic mt-2">{b.note}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                      <Users className="w-3 h-3" /> ভর্তি
                    </p>
                    <p className="text-2xl font-bold text-emerald-950 leading-none mt-0.5">
                      {b.enrolled}<span className="text-sm text-slate-400 font-medium">/{b.capacity}</span>
                    </p>
                  </div>
                  <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        fillPct >= 90 ? "bg-rose-500" : fillPct >= 70 ? "bg-emerald-600" : "bg-amber-500"
                      }`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1">
                      <Edit3 className="w-3 h-3" /> এডিট
                    </button>
                    <span className="text-slate-300">·</span>
                    <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1">
                      বিস্তারিত <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
