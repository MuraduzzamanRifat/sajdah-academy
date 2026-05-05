import type { Metadata } from "next";
import { Camera, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "My Profile — আমার প্রোফাইল",
  alternates: { canonical: "/student-dashboard/profile/" },
  robots: { index: false, follow: false },
};

const inputBase =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm";

export default function ProfilePage() {
  return (
    <div className="space-y-4 max-w-3xl">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
                MI
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-7 h-7 bg-amber-500 text-emerald-950 rounded-full flex items-center justify-center shadow-md"
                aria-label="Change avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-emerald-950">Muhammad Ibrahim</h2>
              <p className="text-sm text-slate-500">Student ID: SA-2026-0418</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Foundation Phase
                </span>
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ব্যাচ-৪
                </span>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
        <FormSection title="ব্যক্তিগত তথ্য · Personal Info">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="পূর্ণ নাম" defaultValue="Muhammad Ibrahim Hossain" />
            <Field label="পিতার নাম" defaultValue="Abdul Karim Hossain" />
            <Field label="বয়স" type="number" defaultValue="২৬" />
            <Field label="জন্মতারিখ" type="date" defaultValue="2000-03-15" />
          </div>
        </FormSection>
        <FormSection title="যোগাযোগ · Contact">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="ইমেইল" type="email" defaultValue="ibrahim@sajdah-alumni.org" />
            <Field label="মোবাইল" type="tel" defaultValue="+880 17 4288 6543" />
            <Field label="WhatsApp" type="tel" defaultValue="+880 17 4288 6543" />
            <Field label="শহর" defaultValue="Dhaka, Bangladesh" />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">পূর্ণ ঠিকানা</label>
            <textarea
              defaultValue="Apt 4B, Lake Road, Banani, Dhaka 1213"
              rows={2}
              className={`${inputBase} resize-none`}
            />
          </div>
        </FormSection>
        <FormSection title="জরুরি যোগাযোগ · Emergency Contact">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="নাম" defaultValue="Abdul Karim Hossain (পিতা)" />
            <Field label="ফোন" type="tel" defaultValue="+880 18 0010 9876" />
          </div>
        </FormSection>
        <FormSection title="নিরাপত্তা · Security" icon={<Lock className="w-4 h-4" />}>
          <div className="space-y-3">
            <button
              type="button"
              className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-emerald-950 text-sm">পাসওয়ার্ড পরিবর্তন</p>
                <p className="text-xs text-slate-500">শেষ পরিবর্তন: ২ মাস আগে</p>
              </div>
              <span className="text-xs font-bold text-emerald-700">Update →</span>
            </button>
            <button
              type="button"
              className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-emerald-950 text-sm">দুই-ধাপ যাচাইকরণ</p>
                <p className="text-xs text-slate-500">নিষ্ক্রিয় — চালু করার পরামর্শ</p>
              </div>
              <span className="text-xs font-bold text-emerald-700">Enable →</span>
            </button>
            <button
              type="button"
              className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-emerald-950 text-sm">সংযুক্ত ডিভাইস</p>
                <p className="text-xs text-slate-500">২টি সক্রিয় ডিভাইস</p>
              </div>
              <span className="text-xs font-bold text-emerald-700">Manage →</span>
            </button>
          </div>
        </FormSection>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">পরিবর্তন জমা দেওয়ার আগে সব তথ্য যাচাই করে নিন।</p>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              className="px-5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm rounded-lg"
            >
              বাতিল
            </button>
            <button
              type="button"
              disabled
              className="px-5 py-2 bg-emerald-700 text-white font-bold text-sm rounded-lg opacity-60 cursor-not-allowed"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </div>
    </div>
  );
}

function FormSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="font-bold text-emerald-950 mb-4 flex items-center gap-2">
        {icon && <span className="text-amber-600">{icon}</span>}
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1.5">{label}</label>
      <input type={type} defaultValue={defaultValue} className={inputBase} />
    </div>
  );
}
