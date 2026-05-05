import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import EnrollmentForm from "../components/EnrollmentForm";

const title = "Enroll — ভর্তি";
const description =
  "Sajdah Academy-এ ভর্তি হোন। ৪ ধাপের সহজ আবেদন প্রক্রিয়া। ভর্তির পর ২৪ ঘণ্টায় টিম যোগাযোগ করবে।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sajdah-academy/enroll/" },
};

export default function EnrollPage() {
  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            Enroll · ভর্তি
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            আপনার যাত্রা শুরু হোক
          </h1>
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">
            ৪টি সহজ ধাপ। ৫ মিনিটের মধ্যে আবেদন সম্পন্ন। আমাদের টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।
          </p>
          <Link
            href="/dashboard/"
            className="inline-flex items-center gap-2 mt-6 text-amber-300 hover:text-amber-200 text-sm font-medium underline-offset-4 hover:underline"
          >
            <LayoutDashboard className="w-4 h-4" />
            ভর্তির পর আপনার পোর্টাল কেমন দেখাবে — দেখুন
          </Link>
        </div>
      </section>

      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <EnrollmentForm />
        </div>
      </section>
    </main>
  );
}
