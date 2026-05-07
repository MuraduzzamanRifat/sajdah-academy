import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CourseForm from "../_components/CourseForm";

export const metadata: Metadata = {
  title: "Admin · New Course",
  alternates: { canonical: "/admin/courses/new/" },
  robots: { index: false, follow: false },
};

export default function NewCoursePage() {
  return (
    <div className="space-y-4 max-w-4xl">
      <Link
        href="/dashboard/courses/"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="w-3 h-3" /> সব কোর্স
      </Link>
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h1 className="text-lg font-bold text-emerald-950 mb-1">নতুন মডিউল তৈরি করুন</h1>
        <p className="text-xs text-slate-500 mb-5">
          সংরক্ষণের পর /courses/ পেজে এবং প্রতিটি ছাত্রের My Modules-এ স্বয়ংক্রিয়ভাবে দেখাবে।
        </p>
        <CourseForm initial={{ display_order: 999, is_published: true }} mode="create" />
      </div>
    </div>
  );
}
