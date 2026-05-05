import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import BatchCountdown from "../components/BatchCountdown";

const title = "Batches — ব্যাচসমূহ";
const description =
  "Sajdah Academy-এর আসন্ন ব্যাচসমূহ। সিট সংখ্যা, ভেন্যু, শুরুর তারিখ ও কাউন্টডাউন।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sajdah-academy/batches/" },
};

const batches = [
  {
    name: "গাজীপুর রিসোর্ট ব্যাচ",
    label: "Gazipur Batch",
    program: "Full 6-Month Program",
    venue: "প্রিমিয়াম রিসোর্ট, গাজীপুর সদর",
    startIso: "2026-05-15T17:00:00+06:00",
    seatsTotal: 40,
    seatsLeft: 12,
    status: "Filling fast",
    color: "amber",
  },
  {
    name: "সিলেট ইকো-রিসোর্ট ব্যাচ",
    label: "Sylhet Batch",
    program: "Full 6-Month Program",
    venue: "ইকো-রিসোর্ট, শ্রীমঙ্গল, সিলেট",
    startIso: "2026-06-12T17:00:00+06:00",
    seatsTotal: 40,
    seatsLeft: 28,
    status: "Open",
    color: "emerald",
  },
  {
    name: "কক্সবাজার সি-ভিউ ব্যাচ",
    label: "Cox's Bazar Batch",
    program: "Foundation Program (2 months)",
    venue: "সি-ভিউ রিসোর্ট, কক্সবাজার",
    startIso: "2026-07-10T17:00:00+06:00",
    seatsTotal: 30,
    seatsLeft: 30,
    status: "Coming soon",
    color: "emerald",
  },
];

const next = batches.reduce((a, b) => (new Date(a.startIso) < new Date(b.startIso) ? a : b));

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });

export default function BatchesPage() {
  return (
    <main className="pt-24 pb-24">
      {/* Hero with countdown to next batch */}
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            Batches · ব্যাচসমূহ
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">পরবর্তী ব্যাচ শুরু হবে</h1>
          <p className="text-emerald-100 text-lg mb-8">
            {next.name} · {formatDate(next.startIso)}
          </p>
          <div className="max-w-2xl mx-auto mb-8">
            <BatchCountdown targetIso={next.startIso} />
          </div>
          <Link
            href="/enroll/"
            className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg active:scale-[0.98] text-lg shadow-lg shadow-amber-500/20"
          >
            Apply Now — সিট সংরক্ষণ করুন
          </Link>
        </div>
      </section>

      {/* All upcoming batches */}
      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-2 block">
              All Upcoming Batches
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950">
              আপনার সুবিধামতো ব্যাচ বেছে নিন
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((b) => {
              const seatsPct = (b.seatsLeft / b.seatsTotal) * 100;
              const isAmber = b.color === "amber";
              return (
                <article key={b.name} className="glass-light glass-light-hover rounded-2xl p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      isAmber ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-950 mb-1 leading-tight">{b.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{b.label}</p>
                  <dl className="space-y-2.5 text-sm mb-5">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 leading-snug">{formatDate(b.startIso)}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 leading-snug">{b.venue}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 leading-snug">{b.program}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Users className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 leading-snug">
                        {b.seatsLeft} of {b.seatsTotal} seats available
                      </span>
                    </div>
                  </dl>
                  {/* Capacity bar */}
                  <div className="mb-5">
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full ${isAmber ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${100 - seatsPct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">
                      {Math.round(100 - seatsPct)}% filled
                    </p>
                  </div>
                  <Link
                    href="/enroll/"
                    className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-sm active:scale-[0.98]"
                  >
                    Apply for this batch
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-4">কোনোটাই কাজে লাগছে না?</h2>
          <p className="text-slate-700 mb-7 text-lg">
            আমাদের ওয়েটলিস্টে নাম লেখান — পরবর্তী ব্যাচ ঘোষণার সাথে সাথে আপনাকে জানানো হবে।
            পছন্দের তারিখ ও ভেন্যু আগে জানিয়ে রাখুন।
          </p>
          <Link
            href="/contact/"
            className="inline-block px-8 py-3 border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white font-bold rounded-lg transition-colors"
          >
            Join Waitlist →
          </Link>
        </div>
      </section>
    </main>
  );
}
