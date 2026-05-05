import type { Metadata } from "next";
import Link from "next/link";
import { Edit3, Eye, ExternalLink, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Pages",
  alternates: { canonical: "/sajdah-academy/admin/pages/" },
  robots: { index: false, follow: false },
};

const pages = [
  { slug: "/", label: "হোম", labelEn: "Home", purpose: "WebGL হিরো, পরিচিতি, কারিকুলাম, সিটিএ", lastEdit: "৩ মে ২০২৬", visibility: "public", inNav: true, indexed: true },
  { slug: "/about/", label: "আমাদের সম্পর্কে", labelEn: "About", purpose: "মিশন, ভিশন, ইতিহাস, প্রতিষ্ঠাতাদের কথা", lastEdit: "১৮ এপ্রিল ২০২৬", visibility: "public", inNav: true, indexed: true },
  { slug: "/courses/", label: "কোর্সসমূহ", labelEn: "Courses", purpose: "১২ মডিউলের ক্যাটালগ", lastEdit: "auto · modules.ts", visibility: "public", inNav: true, indexed: true },
  { slug: "/faculty/", label: "শিক্ষকমণ্ডলী", labelEn: "Faculty", purpose: "৫ জন শিক্ষকের পরিচিতি", lastEdit: "১২ মার্চ ২০২৬", visibility: "public", inNav: true, indexed: true },
  { slug: "/batches/", label: "ব্যাচ", labelEn: "Batches", purpose: "চলমান এবং আসন্ন ব্যাচ", lastEdit: "২৫ এপ্রিল ২০২৬", visibility: "public", inNav: true, indexed: true },
  { slug: "/enroll/", label: "ভর্তি", labelEn: "Enroll", purpose: "অনলাইন ফর্ম + ভর্তি প্রক্রিয়া", lastEdit: "২৮ এপ্রিল ২০২৬", visibility: "public", inNav: true, indexed: true },
  { slug: "/routine/", label: "রুটিন", labelEn: "Routine", purpose: "শুক্রবারের পূর্ণ রুটিন", lastEdit: "১৫ এপ্রিল ২০২৬", visibility: "public", inNav: true, indexed: true },
  { slug: "/faq/", label: "প্রায়শই জিজ্ঞাসিত", labelEn: "FAQ", purpose: "১২+ প্রশ্নোত্তর", lastEdit: "২২ এপ্রিল ২০২৬", visibility: "public", inNav: true, indexed: true },
  { slug: "/contact/", label: "যোগাযোগ", labelEn: "Contact", purpose: "ফর্ম + ফোন/WhatsApp/ম্যাপ", lastEdit: "১০ এপ্রিল ২০২৬", visibility: "public", inNav: true, indexed: true },
  { slug: "/donate/", label: "দান", labelEn: "Donate", purpose: "ছাত্রবৃত্তি ফান্ডের জন্য দান", lastEdit: "২০ এপ্রিল ২০২৬", visibility: "public", inNav: false, indexed: true },
  { slug: "/press/", label: "প্রেস", labelEn: "Press", purpose: "মিডিয়া কভারেজ + ব্র্যান্ড কিট", lastEdit: "৫ মার্চ ২০২৬", visibility: "public", inNav: false, indexed: true },
  { slug: "/gallery/", label: "গ্যালারি", labelEn: "Gallery", purpose: "রিট্রিট, সমাবর্তন, দৈনন্দিন মুহূর্ত", lastEdit: "৩ মে ২০২৬", visibility: "public", inNav: false, indexed: true },
  { slug: "/blog/", label: "ব্লগ", labelEn: "Blog", purpose: "নিবন্ধ ও পথনির্দেশনা", lastEdit: "auto · posts.ts", visibility: "public", inNav: true, indexed: true },
  { slug: "/privacy/", label: "গোপনীয়তা", labelEn: "Privacy", purpose: "GDPR + Bangladesh ICT আইন", lastEdit: "১ এপ্রিল ২০২৬", visibility: "public", inNav: false, indexed: true },
];

export default function AdminPagesPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950">{pages.length} টি স্ট্যাটিক পেজ</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            সব পাবলিক · ১০ ন্যাভ-এ · ১৪ ইন্ডেক্সড · গড় শেষ এডিট ১২ দিন আগে
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold">
            ন্যাভ অর্ডার
          </button>
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
            sitemap রিজেনারেট
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-2.5 font-bold">পেজ</th>
                <th className="px-3 py-2.5 font-bold">URL</th>
                <th className="px-3 py-2.5 font-bold">উদ্দেশ্য</th>
                <th className="px-3 py-2.5 font-bold text-center">ন্যাভ</th>
                <th className="px-3 py-2.5 font-bold text-center">ইন্ডেক্সড</th>
                <th className="px-3 py-2.5 font-bold">শেষ এডিট</th>
                <th className="px-3 py-2.5 font-bold w-24"></th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.slug} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <FileText className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-950 leading-tight">{p.label}</p>
                        <p className="text-[10px] text-slate-500">{p.labelEn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <code className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">{p.slug}</code>
                  </td>
                  <td className="px-3 py-3 text-[11px] text-slate-600 leading-snug">{p.purpose}</td>
                  <td className="px-3 py-3 text-center">
                    {p.inNav ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {p.indexed ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-3 py-3 text-[11px] text-slate-500 whitespace-nowrap">{p.lastEdit}</td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={p.slug}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded inline-flex"
                        aria-label="View live"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                        aria-label="Edit content"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
