import type { Metadata } from "next";
import { Globe, Mail, Phone, MapPin, ShieldCheck, KeyRound, Bell, Database, Save, AlertTriangle } from "lucide-react";
import ComingSoon from "../_components/ComingSoon";

export const metadata: Metadata = {
  title: "Admin · Settings",
  alternates: { canonical: "/admin/settings/" },
  robots: { index: false, follow: false },
};

const inputBase =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4 max-w-4xl">
      <ComingSoon body="সেটিংস সংরক্ষণ / অ্যাডমিন ব্যবস্থাপনা / সিকিউরিটি টগল এখনো ব্যাকএন্ডে wired হয়নি — পরিবর্তন সংরক্ষিত হবে না।" />
      <Section title="সাইট পরিচয় · Site Identity" icon={<Globe className="w-4 h-4" />}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="সাইটের নাম (বাংলা)" defaultValue="সাজদাহ একাডেমি" />
          <Field label="সাইটের নাম (English)" defaultValue="Sajdah Academy" />
          <Field label="ট্যাগলাইন" defaultValue="ফিতনার যুগে আল্লাহর দিকে দৌড়" />
          <Field label="প্রতিষ্ঠা সাল" defaultValue="২০২৪" />
        </div>
      </Section>

      <Section title="যোগাযোগ · Contact Info" icon={<Phone className="w-4 h-4" />}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="প্রধান ইমেইল" type="email" defaultValue="info@sajdah-academy.org" icon={<Mail className="w-3 h-3" />} />
          <Field label="ভর্তি ইমেইল" type="email" defaultValue="admissions@sajdah-academy.org" icon={<Mail className="w-3 h-3" />} />
          <Field label="হটলাইন" type="tel" defaultValue="+880 9696-SAJDAH" icon={<Phone className="w-3 h-3" />} />
          <Field label="WhatsApp" type="tel" defaultValue="+880 17 2200 1100" icon={<Phone className="w-3 h-3" />} />
          <div className="sm:col-span-2">
            <Label>ঠিকানা</Label>
            <textarea
              defaultValue="৩য় তলা, House 42, Road 11, Banani DOHS, Dhaka 1206, Bangladesh"
              rows={2}
              className={`${inputBase} resize-none`}
            />
          </div>
        </div>
      </Section>

      <Section title="ভর্তি ও মূল্য · Admission & Pricing">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="বর্তমান কোর্স ফি (৳)" defaultValue="২,২৫,০০০" />
          <Field label="ভর্তি ফি (৳)" defaultValue="২৫,০০০" />
          <Field label="কিস্তির সংখ্যা" defaultValue="৪" />
        </div>
        <div className="mt-3 grid sm:grid-cols-2 gap-4">
          <Field label="ভর্তি বন্ধের তারিখ" type="date" defaultValue="2026-05-15" />
          <Field label="পরবর্তী ব্যাচ শুরু" type="date" defaultValue="2026-08-01" />
        </div>
        <div className="mt-3 flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div>
            <p className="text-sm font-bold text-amber-900">ভর্তি ফর্ম খোলা</p>
            <p className="text-[11px] text-amber-700 mt-0.5">/enroll/ পেজে অনলাইন ফর্ম দৃশ্যমান</p>
          </div>
          <Toggle on />
        </div>
      </Section>

      <Section title="পেমেন্ট গেটওয়ে · Payments" icon={<Database className="w-4 h-4" />}>
        <div className="space-y-2">
          {[
            { name: "bKash", info: "01744-XXXXXX (Merchant)", on: true },
            { name: "Nagad", info: "01744-XXXXXX (Merchant)", on: true },
            { name: "Bank Transfer (City Bank)", info: "A/C 1234567890", on: true },
            { name: "Stripe (International)", info: "USD/EUR", on: false },
          ].map((g) => (
            <div key={g.name} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div>
                <p className="text-sm font-bold text-emerald-950">{g.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">{g.info}</p>
              </div>
              <Toggle on={g.on} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="নোটিফিকেশন প্রিসেট · Notification Defaults" icon={<Bell className="w-4 h-4" />}>
        <div className="space-y-2">
          {[
            { label: "নতুন ভর্তির আবেদন → Admin", on: true },
            { label: "পেমেন্ট গৃহীত → ছাত্র", on: true },
            { label: "৩ দিন অনুপস্থিতি → মেন্টর", on: true },
            { label: "Final exam ১ সপ্তাহ আগে → ছাত্র", on: true },
            { label: "তাহাজ্জুদ স্ট্রিক রিমাইন্ডার", on: false },
            { label: "নতুন ব্লগ পোস্ট → সাবস্ক্রাইবার", on: false },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-sm text-emerald-950">{n.label}</span>
              <Toggle on={n.on} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="অ্যাডমিন অ্যাক্সেস · Admin Access" icon={<KeyRound className="w-4 h-4" />}>
        <div className="space-y-2">
          {[
            { name: "Admin User", email: "admin@sajdah-academy.org", role: "Super Admin", status: "active" },
            { name: "Mawlana Abdullah", email: "abdullah@sajdah.org", role: "Academic Admin", status: "active" },
            { name: "Finance Officer", email: "finance@sajdah-academy.org", role: "Finance", status: "active" },
            { name: "Support Team", email: "support@sajdah-academy.org", role: "Support (read-only)", status: "active" },
          ].map((u) => (
            <div key={u.email} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-emerald-950 truncate">{u.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded">
                  {u.role}
                </span>
                <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">
                  পরিবর্তন
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="w-full text-center text-xs font-bold text-emerald-700 hover:text-emerald-900 border border-dashed border-slate-300 rounded-lg py-3 hover:bg-emerald-50">
            + নতুন এডমিন
          </button>
        </div>
      </Section>

      <Section title="নিরাপত্তা · Security" icon={<ShieldCheck className="w-4 h-4" />}>
        <div className="space-y-2">
          {[
            { label: "দুই-ধাপ যাচাইকরণ আবশ্যক", on: true },
            { label: "Admin সেশন টাইমআউট (৩০ মিনিট)", on: true },
            { label: "IP সীমাবদ্ধতা (Bangladesh + UAE)", on: false },
            { label: "অডিট লগ সংরক্ষণ (১২ মাস)", on: true },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-sm text-emerald-950">{s.label}</span>
              <Toggle on={s.on} />
            </div>
          ))}
        </div>
      </Section>

      <div className="bg-rose-50 border border-rose-300 rounded-2xl p-5">
        <h3 className="font-bold text-rose-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> বিপজ্জনক জোন
        </h3>
        <div className="space-y-2 text-sm">
          <button type="button" className="w-full text-left p-3 border border-rose-200 hover:bg-rose-100 rounded-lg flex items-center justify-between">
            <span>সমস্ত ছাত্র ডেটা এক্সপোর্ট (CSV)</span>
            <span className="text-xs font-bold text-rose-700">Export →</span>
          </button>
          <button type="button" className="w-full text-left p-3 border border-rose-200 hover:bg-rose-100 rounded-lg flex items-center justify-between">
            <span>ব্যাচ-১ আর্কাইভ করুন</span>
            <span className="text-xs font-bold text-rose-700">Archive →</span>
          </button>
          <button type="button" className="w-full text-left p-3 border border-rose-300 hover:bg-rose-100 rounded-lg flex items-center justify-between">
            <span className="text-rose-900 font-bold">প্রতিষ্ঠান বন্ধ করুন</span>
            <span className="text-xs font-bold text-rose-700">Disable site →</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3 sticky bottom-4">
        <p className="text-xs text-slate-500">শেষ সংরক্ষণ: ১২ মিনিট আগে</p>
        <div className="flex gap-2">
          <button type="button" className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-bold">
            বাতিল
          </button>
          <button type="button" className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-bold">
            <Save className="w-3.5 h-3.5" /> সংরক্ষণ
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
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

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-slate-700 mb-1.5">{children}</label>;
}

function Field({
  label,
  defaultValue,
  type = "text",
  icon,
}: {
  label: string;
  defaultValue: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        )}
        <input
          type={type}
          defaultValue={defaultValue}
          className={`${inputBase} ${icon ? "pl-7" : ""}`}
        />
      </div>
    </div>
  );
}

function Toggle({ on }: { on?: boolean }) {
  return (
    <button
      type="button"
      className={`w-10 h-6 rounded-full relative transition-colors shrink-0 ${
        on ? "bg-emerald-600" : "bg-slate-300"
      }`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
          on ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
