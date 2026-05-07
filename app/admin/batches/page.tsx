import type { Metadata } from "next";
import { Plus, Calendar, MapPin, Users, ChevronRight, Edit3, AlertCircle } from "lucide-react";
import { createClient } from "../../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin · Batches",
  alternates: { canonical: "/admin/batches/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

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

const statusBadge: Record<string, string> = {
  open: "bg-amber-100 text-amber-700",
  running: "bg-emerald-100 text-emerald-700",
  completed: "bg-slate-100 text-slate-500",
  cancelled: "bg-rose-100 text-rose-700",
};
const statusLabel: Record<string, string> = {
  open: "ভর্তি চলমান",
  running: "চলমান",
  completed: "সমাপ্ত",
  cancelled: "বাতিল",
};
const statusOrder: Record<string, number> = { open: 0, running: 1, cancelled: 2, completed: 3 };

export default async function AdminBatchesPage() {
  const supabase = await createClient();

  const [batchesRes, enrollmentCountsRes] = await Promise.all([
    supabase
      .from("batches")
      .select("id, code, name, status, starts_at, ends_at, location, capacity, fee_bdt, notes")
      .order("starts_at", { ascending: false }),
    supabase.from("profiles").select("batch_id").eq("role", "student"),
  ]);

  const batches = (batchesRes.data ?? []) as BatchRow[];
  const error = batchesRes.error;

  const enrolledByBatch = (enrollmentCountsRes.data ?? []).reduce<Record<string, number>>(
    (acc, p: { batch_id: string | null }) => {
      if (p.batch_id) acc[p.batch_id] = (acc[p.batch_id] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const sorted = [...batches].sort(
    (a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9)
  );

  const totalEnrolled = Object.values(enrolledByBatch).reduce((s, n) => s + n, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950">{batches.length} ব্যাচ মোট</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {batches.filter((b) => b.status === "open").length} ভর্তি ·{" "}
            {batches.filter((b) => b.status === "running").length} চলমান ·{" "}
            {batches.filter((b) => b.status === "completed").length} সমাপ্ত · {totalEnrolled} ছাত্র
          </p>
        </div>
        <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
          <Plus className="w-3.5 h-3.5" /> নতুন ব্যাচ
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-700">{error.message}</p>
        </div>
      )}

      {batches.length === 0 && !error && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-sm font-bold text-slate-700">এখনো কোনো ব্যাচ তৈরি হয়নি</p>
          <p className="text-xs text-slate-500 mt-1">
            <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">0002_seed_data.sql</code> চালান অথবা নিচের বাটন দিয়ে যোগ করুন।
          </p>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map((b) => {
          const enrolled = enrolledByBatch[b.id] ?? 0;
          const fillPct = b.capacity > 0 ? Math.round((enrolled / b.capacity) * 100) : 0;
          return (
            <article key={b.id} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {b.name.split("-")[1] ?? b.code.slice(0, 2)}
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
                      {b.starts_at && b.ends_at && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(b.starts_at).toLocaleDateString("en-GB")} → {new Date(b.ends_at).toLocaleDateString("en-GB")}
                        </span>
                      )}
                      {b.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {b.location}
                        </span>
                      )}
                      {b.fee_bdt && (
                        <span className="font-bold text-emerald-700">৳ {Number(b.fee_bdt).toLocaleString("en-IN")}</span>
                      )}
                    </div>
                    {b.notes && <p className="text-xs text-slate-500 italic mt-2">{b.notes}</p>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                      <Users className="w-3 h-3" /> ভর্তি
                    </p>
                    <p className="text-2xl font-bold text-emerald-950 leading-none mt-0.5">
                      {enrolled}<span className="text-sm text-slate-400 font-medium">/{b.capacity}</span>
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

      <p className="text-xs text-emerald-700 text-center font-bold">
        ✓ Live data from Supabase · {batches.length} batches
      </p>
    </div>
  );
}
