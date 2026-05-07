import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PostForm from "../_components/PostForm";

export const metadata: Metadata = {
  title: "Admin · New Post",
  alternates: { canonical: "/admin/blog/new/" },
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
  return (
    <div className="space-y-4 max-w-4xl">
      <Link
        href="/admin/blog/"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="w-3 h-3" /> সব পোস্ট
      </Link>
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h1 className="text-lg font-bold text-emerald-950 mb-1">নতুন পোস্ট লিখুন</h1>
        <p className="text-xs text-slate-500 mb-5">
          সংরক্ষণের পর /blog/ পেজে এবং সাইটম্যাপে স্বয়ংক্রিয়ভাবে যুক্ত হবে।
        </p>
        <PostForm initial={{ is_published: true }} mode="create" />
      </div>
    </div>
  );
}
