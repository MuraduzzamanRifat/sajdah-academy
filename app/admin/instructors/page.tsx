import type { Metadata } from "next";
import { Plus, Star, MoreHorizontal, AlertCircle } from "lucide-react";
import { createClient } from "../../../lib/supabase/server";
import { initials } from "../../../lib/initials";

export const metadata: Metadata = {
  title: "Admin · Instructors",
  alternates: { canonical: "/admin/instructors/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type InstructorRow = {
  id: string;
  name: string;
  name_bn: string | null;
  role_label: string | null;
  bio: string | null;
  rating: number | null;
  is_guest: boolean;
};

export default async function AdminInstructorsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("instructors")
    .select("id, name, name_bn, role_label, bio, rating, is_guest")
    .order("is_guest", { ascending: true })
    .order("name", { ascending: true });

  const instructors = (data ?? []) as InstructorRow[];
  const regulars = instructors.filter((i) => !i.is_guest).length;
  const guests = instructors.filter((i) => i.is_guest).length;
  const avgRating =
    instructors.length > 0
      ? (instructors.reduce((s, i) => s + Number(i.rating ?? 0), 0) / instructors.length).toFixed(2)
      : "—";

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950">{instructors.length} জন শিক্ষক</h2>
          <p className="text-xs text-slate-500 mt-0.5">{regulars} নিয়মিত · {guests} অতিথি · গড় রেটিং {avgRating}/৫</p>
        </div>
        <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
          <Plus className="w-3.5 h-3.5" /> নতুন শিক্ষক
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-rose-900">শিক্ষক লোড করতে সমস্যা</p>
            <p className="text-xs text-rose-700 mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {instructors.length === 0 && !error && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-sm font-bold text-slate-700">এখনো কোনো শিক্ষক যোগ করা হয়নি</p>
          <p className="text-xs text-slate-500 mt-1">
            <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">0002_seed_data.sql</code> চালান অথবা নিচের বাটন দিয়ে যোগ করুন।
          </p>
        </div>
      )}

      {instructors.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {instructors.map((t) => (
            <article key={t.id} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center font-bold shrink-0">
                  {initials(t.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-emerald-950 leading-tight">{t.name_bn ?? t.name}</h3>
                      {t.name_bn && <p className="text-[11px] text-slate-500">{t.name}</p>}
                      {t.role_label && <p className="text-xs font-bold text-amber-600 mt-1">{t.role_label}</p>}
                    </div>
                    <div className="flex items-start gap-1 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.is_guest ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {t.is_guest ? "অতিথি" : "নিয়মিত"}
                      </span>
                      <button
                        type="button"
                        className="p-1 text-slate-400 hover:text-slate-700"
                        aria-label={`Actions for ${t.name}`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {t.bio && <p className="text-xs text-slate-700 leading-relaxed mt-2">{t.bio}</p>}
                </div>
              </div>

              {t.rating !== null && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-emerald-950">{Number(t.rating).toFixed(1)}</span>
                  <span className="text-slate-400">/ ৫</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <p className="text-xs text-emerald-700 text-center font-bold">
        ✓ Live data from Supabase · {instructors.length} instructors
      </p>
    </div>
  );
}
