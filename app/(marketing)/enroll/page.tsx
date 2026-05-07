import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import EnrollmentForm from "../../components/EnrollmentForm";
import { getSettingsByPrefix, pick } from "../../../lib/settings";

const title = "Enroll — ভর্তি";
const description =
  "Sajdah Academy-এ ভর্তি হোন। ৪ ধাপের সহজ আবেদন প্রক্রিয়া। ভর্তির পর ২৪ ঘণ্টায় টিম যোগাযোগ করবে।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/enroll/" },
};

export const revalidate = 60;

export default async function EnrollPage() {
  const [contact, admission] = await Promise.all([
    getSettingsByPrefix("contact."),
    getSettingsByPrefix("admission."),
  ]);
  const whatsapp = pick(contact, "contact.whatsapp", "+880 180 55 65 444");
  const isOpen = pick(admission, "admission.is_open", true);
  const closesAt = pick(admission, "admission.closes_at", "");
  const nextStarts = pick(admission, "admission.next_batch_starts", "");
  const feeTotal = pick<number>(admission, "admission.fee_total_bdt", 0);
  const installments = pick<number>(admission, "admission.installments", 0);

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
          {/* Admission CMS facts (closing date, next batch, total fee, installments) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5 text-xs text-emerald-200">
            {closesAt && (
              <span className="px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-700">
                ভর্তির শেষ তারিখ: {closesAt}
              </span>
            )}
            {nextStarts && (
              <span className="px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-700">
                পরবর্তী ব্যাচ: {nextStarts}
              </span>
            )}
            {feeTotal > 0 && (
              <span className="px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-700">
                মোট ফি: ৳ {Number(feeTotal).toLocaleString("bn-BD")}
                {installments > 1 ? ` · ${installments} কিস্তি` : ""}
              </span>
            )}
          </div>
          <Link
            href="/student-dashboard/"
            className="inline-flex items-center gap-2 mt-6 text-amber-300 hover:text-amber-200 text-sm font-medium underline-offset-4 hover:underline"
          >
            <LayoutDashboard className="w-4 h-4" />
            ভর্তির পর আপনার পোর্টাল কেমন দেখাবে — দেখুন
          </Link>
        </div>
      </section>

      {!isOpen && (
        <section className="bg-amber-50 border-y border-amber-200 py-4 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-amber-900">
              <strong>বর্তমানে ভর্তি বন্ধ।</strong> পরবর্তী ব্যাচের আপডেটের জন্য WhatsApp ব্রডকাস্টে যুক্ত হোন।
            </p>
          </div>
        </section>
      )}

      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <EnrollmentForm whatsappNumber={whatsapp} />
        </div>
      </section>
    </main>
  );
}
