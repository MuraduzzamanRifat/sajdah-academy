import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Edit3, FileText, Zap } from "lucide-react";
import { PAGE_DEFS } from "./schema";
import CacheRefreshButton from "./_components/CacheRefreshButton";

export const metadata: Metadata = {
  title: "Admin · Pages",
  alternates: { canonical: "/admin/pages/" },
  robots: { index: false, follow: false },
};

export default function AdminPagesIndex() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-emerald-950">Pages CMS</h2>
        <p className="text-xs text-slate-500 mt-0.5 mb-4">
          ওয়েবসাইটের সব মার্কেটিং কপি এখান থেকে এডিট করুন। সংরক্ষণের পর পাবলিক পেজ স্বয়ংক্রিয়ভাবে আপডেট হবে — সংশ্লিষ্ট পেজগুলোর ক্যাশ মুছে যায়।
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-900 leading-tight mb-1">
              যদি কোনো পরিবর্তন লাইভ পেজে দেখা না যায়
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed mb-2">
              নিচের বাটনে ক্লিক করে পুরো ওয়েবসাইটের ক্যাশ মুছে দিন। সাধারণত ক্যাশ স্বয়ংক্রিয়ভাবে পরিষ্কার হয়, তবে একই সময়ে অনেক ভিজিটর থাকলে কখনো কখনো ম্যানুয়ালি পরিষ্কার করতে হয়।
            </p>
            <CacheRefreshButton />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="divide-y divide-slate-100">
          {PAGE_DEFS.map((p) => {
            const totalFields = p.groups.reduce((s, g) => s + g.fields.length, 0);
            return (
              <div key={p.slug} className="px-5 py-4 hover:bg-slate-50 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-emerald-950 leading-tight">{p.label}</h4>
                    <span className="text-[10px] text-slate-500">· {p.labelEn}</span>
                    <code className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{p.publicPath}</code>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug mt-1">{p.description}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {p.groups.length} সেকশন · {totalFields} এডিটেবল ফিল্ড
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={p.publicPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                    aria-label="View live"
                    title="লাইভ পেজ"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/dashboard/pages/${p.slug}/`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
                  >
                    <Edit3 className="w-3 h-3" /> এডিট
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-slate-500 text-center">
        নতুন পেজ যোগ করতে: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">app/admin/pages/schema.ts</code> ফাইল এডিট করুন।
      </p>
    </div>
  );
}
