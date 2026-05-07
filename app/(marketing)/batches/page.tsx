import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import BatchCountdown from "../../components/BatchCountdown";
import { createClient } from "../../../lib/supabase/server";
import { getSettingsByPrefix, pick } from "../../../lib/settings";

const title = "Batches — ব্যাচসমূহ";
const description =
  "Sajdah Academy-এর আসন্ন ব্যাচসমূহ। সিট সংখ্যা, ভেন্যু, শুরুর তারিখ ও কাউন্টডাউন।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/batches/" },
};

export const revalidate = 60;

type BatchRow = {
  id: string;
  code: string;
  name: string;
  status: "open" | "running" | "completed" | "cancelled";
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
  capacity: number;
  fee_bdt: number | null;
  notes: string | null;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });

const statusBadge: Record<string, { cls: string; label: string }> = {
  open: { cls: "bg-amber-100 text-amber-700", label: "ভর্তি চলমান" },
  running: { cls: "bg-emerald-100 text-emerald-700", label: "চলমান" },
  completed: { cls: "bg-slate-100 text-slate-500", label: "সমাপ্ত" },
  cancelled: { cls: "bg-rose-100 text-rose-700", label: "বাতিল" },
};

export default async function BatchesPage() {
  const supabase = await createClient();
  /* Two queries instead of three. The batch_seat_counts view (migration
     0005) computes taken/remaining inside Postgres so we no longer
     need to fetch all profiles + all enrollments and reduce in JS. If
     the view isn't deployed yet, fall back to the previous N+1 pattern
     so the page keeps working until migration 0005 is applied. */
  const [{ data: batchesRaw }, { data: counts, error: countsError }, settings] =
    await Promise.all([
      supabase
        .from("batches")
        .select("id, code, name, status, starts_at, ends_at, location, capacity, fee_bdt, notes")
        .in("status", ["open", "running"])
        .order("starts_at", { ascending: true }),
      supabase.from("batch_seat_counts").select("batch_id, taken"),
      getSettingsByPrefix("batches."),
    ]);

  let enrolledStudents: { batch_id: string | null }[] | null = null;
  let pendingEnrollments: { target_batch_id: string | null }[] | null = null;
  if (countsError) {
    /* Fallback to the legacy N+1 path. */
    const [{ data: e1 }, { data: e2 }] = await Promise.all([
      supabase.from("profiles").select("batch_id").eq("role", "student"),
      supabase
        .from("enrollments")
        .select("target_batch_id")
        .in("status", ["submitted", "reviewing", "accepted", "waitlisted"]),
    ]);
    enrolledStudents = e1 ?? null;
    pendingEnrollments = e2 ?? null;
  }

  const eyebrow = pick(settings, "batches.eyebrow", "Batches · ব্যাচসমূহ");
  const titleBn = pick(settings, "batches.title_bn", "পরবর্তী ব্যাচ শুরু হবে");
  const subtitleBn = pick(settings, "batches.subtitle_bn", "");
  const emptyText = pick(settings, "batches.empty_text_bn", "নতুন ব্যাচ ঘোষণার জন্য অপেক্ষা করুন।");

  const batches = (batchesRaw ?? []) as BatchRow[];
  /* Seat count: prefer the view (single query, computed in Postgres).
     Fallback to the legacy reducer if the view isn't deployed. */
  const enrolledByBatch: Record<string, number> = {};
  if (counts) {
    counts.forEach((c: { batch_id: string; taken: number }) => {
      enrolledByBatch[c.batch_id] = c.taken;
    });
  } else {
    (enrolledStudents ?? []).forEach((p) => {
      if (p.batch_id) enrolledByBatch[p.batch_id] = (enrolledByBatch[p.batch_id] ?? 0) + 1;
    });
    (pendingEnrollments ?? []).forEach((e) => {
      if (e.target_batch_id) {
        enrolledByBatch[e.target_batch_id] = (enrolledByBatch[e.target_batch_id] ?? 0) + 1;
      }
    });
  }

  const upcoming = batches.filter((b) => b.starts_at && new Date(b.starts_at) > new Date());
  const next =
    upcoming.length > 0
      ? upcoming.reduce((a, b) => (new Date(a.starts_at!) < new Date(b.starts_at!) ? a : b))
      : batches[0];

  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            {eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">{titleBn}</h1>
          {subtitleBn && <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-6">{subtitleBn}</p>}
          {next?.starts_at ? (
            <>
              <p className="text-emerald-100 text-lg mb-8">
                {next.name} · {formatDate(next.starts_at)}
              </p>
              <div className="max-w-2xl mx-auto mb-8">
                <BatchCountdown targetIso={next.starts_at} />
              </div>
            </>
          ) : (
            <p className="text-emerald-100 text-lg mb-8">{emptyText}</p>
          )}
          <Link
            href="/enroll/"
            className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg active:scale-[0.98] text-lg shadow-lg shadow-amber-500/20"
          >
            Apply Now — সিট সংরক্ষণ করুন
          </Link>
        </div>
      </section>

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
          {batches.length === 0 ? (
            <p className="text-center text-slate-500 py-8">পরবর্তী ব্যাচ ঘোষণা শীঘ্রই আসছে।</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches.map((b) => {
                const taken = enrolledByBatch[b.id] ?? 0;
                const seatsLeft = Math.max(0, b.capacity - taken);
                const filledPct = b.capacity > 0 ? Math.round((taken / b.capacity) * 100) : 0;
                const tone = statusBadge[b.status];
                return (
                  <article key={b.id} className="glass-light glass-light-hover rounded-2xl p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${tone.cls}`}>
                        {tone.label}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-emerald-950 mb-1 leading-tight">{b.name}</h3>
                    <p className="text-sm text-slate-500 mb-4 font-mono">{b.code}</p>
                    <dl className="space-y-2.5 text-sm mb-5">
                      {b.starts_at && (
                        <div className="flex items-start gap-2.5">
                          <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-slate-700 leading-snug">{formatDate(b.starts_at)}</span>
                        </div>
                      )}
                      {b.location && (
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-slate-700 leading-snug">{b.location}</span>
                        </div>
                      )}
                      {b.fee_bdt && (
                        <div className="flex items-start gap-2.5">
                          <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-slate-700 leading-snug">৳ {Number(b.fee_bdt).toLocaleString("en-IN")}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2.5">
                        <Users className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 leading-snug">
                          {seatsLeft} of {b.capacity} seats available
                        </span>
                      </div>
                    </dl>
                    <div className="mb-5">
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full ${filledPct >= 90 ? "bg-rose-500" : filledPct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${filledPct}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5">{filledPct}% filled</p>
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
          )}
        </div>
      </section>

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
