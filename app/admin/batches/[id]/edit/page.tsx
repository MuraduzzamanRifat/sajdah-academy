import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "../../../../../lib/supabase/server";
import BatchForm from "../../_components/BatchForm";

export const metadata: Metadata = {
  title: "Admin · Edit Batch",
  alternates: { canonical: "/admin/batches/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function EditBatchPage({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: batch } = await supabase
    .from("batches")
    .select("id, code, name, status, starts_at, ends_at, location, capacity, fee_bdt, installments, enrollment_closes_at, notes")
    .eq("id", id)
    .single();

  if (!batch) notFound();

  return (
    <div className="space-y-4 max-w-3xl">
      <Link
        href="/admin/batches/"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="w-3 h-3" /> সব ব্যাচ
      </Link>
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h1 className="text-lg font-bold text-emerald-950">
          সম্পাদনা: <span className="text-emerald-700">{batch.name}</span>
        </h1>
        <p className="text-xs text-slate-500 mb-5">
          code: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{batch.code}</code> · code পরিবর্তন করা যাবে না
        </p>
        <BatchForm initial={batch} mode="edit" />
      </div>
    </div>
  );
}
