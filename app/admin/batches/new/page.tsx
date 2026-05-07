import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BatchForm from "../_components/BatchForm";

export const metadata: Metadata = {
  title: "Admin · New Batch",
  alternates: { canonical: "/admin/batches/new/" },
  robots: { index: false, follow: false },
};

export default function NewBatchPage() {
  return (
    <div className="space-y-4 max-w-3xl">
      <Link
        href="/dashboard/batches/"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="w-3 h-3" /> সব ব্যাচ
      </Link>
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h1 className="text-lg font-bold text-emerald-950 mb-1">নতুন ব্যাচ তৈরি করুন</h1>
        <p className="text-xs text-slate-500 mb-5">
          সংরক্ষণের পর /batches/ পেজে এবং ভর্তি ফর্মে স্বয়ংক্রিয়ভাবে দেখাবে।
        </p>
        <BatchForm initial={{ status: "open", capacity: 40, installments: 4, fee_bdt: 225000 }} mode="create" />
      </div>
    </div>
  );
}
