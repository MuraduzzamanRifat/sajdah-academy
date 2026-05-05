import type { Metadata } from "next";
import { Globe, Bell, Eye, Trash2, Moon } from "lucide-react";

export const metadata: Metadata = {
  title: "Settings — সেটিংস",
  alternates: { canonical: "/student-dashboard/settings/" },
  robots: { index: false, follow: false },
};

const sections = [
  {
    icon: Globe,
    title: "ভাষা · Language",
    rows: [
      { label: "প্রদর্শনের ভাষা", control: <Select options={["বাংলা", "English"]} value="বাংলা" /> },
      { label: "তারিখ ফরম্যাট", control: <Select options={["DD-MM-YYYY", "MM-DD-YYYY"]} value="DD-MM-YYYY" /> },
    ],
  },
  {
    icon: Bell,
    title: "নোটিফিকেশন · Notifications",
    rows: [
      { label: "ইমেইল নোটিফিকেশন", control: <Toggle on /> },
      { label: "WhatsApp আপডেট", control: <Toggle on /> },
      { label: "SMS অ্যালার্ট", control: <Toggle off /> },
      { label: "ব্রাউজার পুশ", control: <Toggle on /> },
      { label: "তাহাজ্জুদ রিমাইন্ডার", control: <Toggle on /> },
      { label: "ক্লাস শুরুর ১ ঘণ্টা আগে", control: <Toggle on /> },
    ],
  },
  {
    icon: Moon,
    title: "Display · প্রদর্শন",
    rows: [
      { label: "থিম", control: <Select options={["Light", "Dark", "Auto"]} value="Light" /> },
      { label: "রিডিউসড মোশন", control: <Toggle off /> },
    ],
  },
  {
    icon: Eye,
    title: "Privacy · গোপনীয়তা",
    rows: [
      { label: "প্রোফাইল অন্যান্য ছাত্রদের কাছে দৃশ্যমান", control: <Toggle on /> },
      { label: "Alumni নেটওয়ার্কে যুক্ত করুন", control: <Toggle on /> },
      { label: "আমার অগ্রগতি গবেষণায় অংশীদার", control: <Toggle off /> },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-4 max-w-3xl">
        {sections.map((s) => {
          const I = s.icon;
          return (
    <div key={s.title} className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-bold text-emerald-950 mb-4 flex items-center gap-2">
                <I className="w-4 h-4 text-amber-600" />
                {s.title}
              </h3>
              <div className="divide-y divide-slate-100">
                {s.rows.map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-3 py-3">
                    <span className="text-sm text-emerald-950">{r.label}</span>
                    {r.control}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-5">
          <h3 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Danger zone
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 py-2">
              <div>
                <p className="text-sm font-medium text-rose-950">আমার সমস্ত ডেটা ডাউনলোড</p>
                <p className="text-xs text-rose-700 mt-0.5">আপনার সব তথ্যের একটি ZIP কপি পাঠানো হবে</p>
              </div>
              <button
                type="button"
                className="px-4 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold shrink-0"
              >
                Export
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 py-2 border-t border-rose-200">
              <div>
                <p className="text-sm font-medium text-rose-950">অ্যাকাউন্ট মুছে ফেলুন</p>
                <p className="text-xs text-rose-700 mt-0.5">এটি ফিরিয়ে আনা যাবে না — সাবধান</p>
              </div>
              <button
                type="button"
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}

function Toggle({ on, off }: { on?: boolean; off?: boolean }) {
  const isOn = on || !off;
  return (
    <button
      type="button"
      className={`w-10 h-6 rounded-full relative transition-colors ${
        isOn ? "bg-emerald-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
          isOn ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Select({ options, value }: { options: string[]; value: string }) {
  return (
    <select
      defaultValue={value}
      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}
