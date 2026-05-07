import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import InstructorForm from "../_components/InstructorForm";

export const metadata: Metadata = {
  title: "Admin · New Instructor",
  alternates: { canonical: "/admin/instructors/new/" },
  robots: { index: false, follow: false },
};

export default function NewInstructorPage() {
  return (
    <div className="space-y-4 max-w-3xl">
      <Link
        href="/dashboard/instructors/"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="w-3 h-3" /> সব শিক্ষক
      </Link>
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h1 className="text-lg font-bold text-emerald-950 mb-1">নতুন শিক্ষক যোগ করুন</h1>
        <p className="text-xs text-slate-500 mb-5">
          সংরক্ষণের পর /faculty/ পেজে স্বয়ংক্রিয়ভাবে দেখাবে।
        </p>
        <InstructorForm initial={{ is_guest: false }} mode="create" />
      </div>
    </div>
  );
}
