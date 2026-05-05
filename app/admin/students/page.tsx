import type { Metadata } from "next";
import { Plus, Filter, Download, MoreHorizontal, Mail, Phone, Search, AlertCircle } from "lucide-react";
import { createClient } from "../../../lib/supabase/server";
import { initials } from "../../../lib/initials";

export const metadata: Metadata = {
  title: "Admin · Students",
  alternates: { canonical: "/admin/students/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic"; // always fresh — admin tables don't cache

const PAGE_SIZE = 50;

const statusBadge: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  inactive: "bg-slate-100 text-slate-500",
  graduated: "bg-blue-100 text-blue-700",
};
const statusLabel: Record<string, string> = {
  active: "সক্রিয়",
  pending: "অপেক্ষমাণ",
  inactive: "নিষ্ক্রিয়",
  graduated: "সমাপ্ত",
};

type StudentRow = {
  id: string;
  email: string;
  full_name: string | null;
  full_name_bn: string | null;
  phone: string | null;
  student_id: string | null;
  status: keyof typeof statusBadge;
  joined_at: string;
  batches: { name: string; code: string } | null;
};

export default async function AdminStudentsPage() {
  const supabase = await createClient();

  /* Run the list query and the per-status counts concurrently — they
     are independent. Using `count: 'estimated'` for the headline total
     avoids a full COUNT(*) on every refresh; per-status counts use
     'exact' since we need the precise breakdown. */
  const [listRes, totals] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        `id, email, full_name, full_name_bn, phone, student_id, status, joined_at,
         batches:batch_id ( name, code )`,
        { count: "estimated" }
      )
      .eq("role", "student")
      .order("joined_at", { ascending: false })
      .limit(PAGE_SIZE),
    getCounts(supabase),
  ]);

  const { data: students, error, count } = listRes;
  const rows = (students ?? []) as unknown as StudentRow[];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-emerald-950">{count ?? 0} জন ছাত্র</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {totals.active} সক্রিয় · {totals.pending} অপেক্ষমাণ · {totals.inactive} নিষ্ক্রিয়
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold">
              <Filter className="w-3.5 h-3.5" /> ফিল্টার
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold">
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
              <Plus className="w-3.5 h-3.5" /> নতুন ছাত্র
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-500 min-w-[240px] flex-1">
            <Search className="w-3.5 h-3.5" />
            <span>নাম / ID / ফোন দিয়ে খুঁজুন...</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-rose-900">ডেটা লোড করতে সমস্যা</p>
            <p className="text-xs text-rose-700 mt-1">{error.message}</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {rows.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-slate-700 font-bold">এখনো কোনো ছাত্র নেই</p>
            <p className="text-xs text-slate-500 mt-1">
              ভর্তির আবেদন গ্রহণ করলে স্বয়ংক্রিয়ভাবে এখানে যুক্ত হবে।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-2.5 font-bold w-10">
                    <input type="checkbox" aria-label="Select all students" className="rounded border-slate-300" />
                  </th>
                  <th className="px-3 py-2.5 font-bold">ছাত্র</th>
                  <th className="px-3 py-2.5 font-bold">ব্যাচ</th>
                  <th className="px-3 py-2.5 font-bold">যোগাযোগ</th>
                  <th className="px-3 py-2.5 font-bold">অবস্থা</th>
                  <th className="px-3 py-2.5 font-bold">যোগদান</th>
                  <th className="px-3 py-2.5 font-bold w-10"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => {
                  const display = s.full_name_bn || s.full_name || s.email;
                  return (
                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                      <td className="px-5 py-3">
                        <input type="checkbox" aria-label={`Select ${display}`} className="rounded border-slate-300" />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {initials(s.full_name ?? s.email)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-emerald-950 leading-tight truncate">{display}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{s.student_id ?? "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs">
                        {s.batches ? (
                          <>
                            <p className="font-medium text-emerald-950">{s.batches.name}</p>
                            <p className="text-[10px] text-slate-500">{s.batches.code}</p>
                          </>
                        ) : (
                          <span className="text-slate-400 text-[11px]">বরাদ্দ হয়নি</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-[11px] text-slate-700 inline-flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5" /> {s.email}
                        </p>
                        {s.phone && (
                          <p className="text-[10px] text-slate-500 inline-flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5" /> {s.phone}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[s.status]}`}>
                          {statusLabel[s.status]}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[11px] text-slate-600 whitespace-nowrap">
                        {new Date(s.joined_at).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button type="button" className="p-1 text-slate-400 hover:text-slate-700" aria-label="More">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-emerald-700 text-center font-bold">
        ✓ Live data from Supabase
        {count !== null && count > rows.length
          ? ` · showing first ${rows.length} of ~${count}`
          : ` · ${rows.length} total`}
      </p>
    </div>
  );
}

async function getCounts(supabase: Awaited<ReturnType<typeof createClient>>) {
  const states = ["active", "pending", "inactive"] as const;
  const out: Record<(typeof states)[number], number> = { active: 0, pending: 0, inactive: 0 };
  await Promise.all(
    states.map(async (s) => {
      const { count } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "student")
        .eq("status", s);
      out[s] = count ?? 0;
    })
  );
  return out;
}
