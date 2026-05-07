import type { Metadata } from "next";
import { Megaphone, Send, Edit3, Trash2, Calendar } from "lucide-react";
import ComingSoon from "../_components/ComingSoon";

export const metadata: Metadata = {
  title: "Admin · Announcements",
  alternates: { canonical: "/admin/announcements/" },
  robots: { index: false, follow: false },
};

const announcements = [
  { title: "ব্যাচ-৪ এর সমাপনী রিট্রিট — ৫ জুন গাজীপুর", body: "৫ জুন গাজীপুর রিসোর্টে সমাপনী রিট্রিট। সব ছাত্রকে ১ জুনের মধ্যে কনফার্ম করতে অনুরোধ।", audience: "ব্যাচ-৪ (৩৮)", channel: ["WhatsApp", "Email", "App"], publishedAt: "২ ঘণ্টা আগে", status: "published", reads: 24 },
  { title: "তাহাজ্জুদ স্ট্রিক — অভিনন্দন!", body: "টিম ১২+ দিন স্ট্রিকে — মাশাআল্লাহ। বিশেষ আত্মিক অনুষ্ঠান এই শুক্রবার।", audience: "সব ব্যাচ (১৩৩)", channel: ["App"], publishedAt: "গতকাল", status: "published", reads: 89 },
  { title: "মে মাসের পেমেন্ট রিমাইন্ডার", body: "৩য় কিস্তির শেষ তারিখ ১৫ মে। দয়া করে সময়মতো পরিশোধ করুন।", audience: "ব্যাচ-৩ (৩৩)", channel: ["WhatsApp", "Email"], publishedAt: "২ দিন আগে", status: "published", reads: 31 },
  { title: "ব্যাচ-৫ ভর্তি বন্ধ হবে ১৫ মে", body: "ব্যাচ-৫ এর ভর্তি বন্ধ হবে ১৫ মে। শেষ ৩১টি আসন বাকি।", audience: "Public + Alumni", channel: ["Website", "Email"], publishedAt: "Scheduled · ৭ মে ৯ AM", status: "scheduled", reads: 0 },
];

const statusBadge: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-amber-100 text-amber-700",
  draft: "bg-slate-100 text-slate-500",
};
const statusLabel: Record<string, string> = {
  published: "প্রকাশিত",
  scheduled: "সিডিউল",
  draft: "খসড়া",
};

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-4">
      <ComingSoon body="ঘোষণা পাঠানো / সিডিউল / সংরক্ষণ এখনো ব্যাকএন্ডে wired হয়নি — শুধু লেআউট প্রিভিউ।" />
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="font-bold text-emerald-950 mb-4 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-amber-600" /> নতুন ঘোষণা পাঠান
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="শিরোনাম..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
          />
          <textarea
            placeholder="বার্তা..."
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm resize-none"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <select defaultValue="all" className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm">
              <option value="all">সব ছাত্র (১৩৩)</option>
              <option>ব্যাচ-৪ (৩৮)</option>
              <option>ব্যাচ-৩ (৩৩)</option>
              <option>ব্যাচ-২ (২৮)</option>
              <option>Alumni (২৫)</option>
              <option>Public (Website)</option>
            </select>
            <div className="flex flex-wrap gap-2 items-center px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs">
              <span className="text-slate-500">চ্যানেল:</span>
              <label className="inline-flex items-center gap-1"><input type="checkbox" defaultChecked className="rounded" /> App</label>
              <label className="inline-flex items-center gap-1"><input type="checkbox" defaultChecked className="rounded" /> WhatsApp</label>
              <label className="inline-flex items-center gap-1"><input type="checkbox" className="rounded" /> Email</label>
              <label className="inline-flex items-center gap-1"><input type="checkbox" className="rounded" /> SMS</label>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>সিডিউল করুন:</span>
              <input type="datetime-local" className="px-2 py-1 border border-slate-200 rounded text-xs" />
            </div>
            <div className="flex gap-2">
              <button type="button" className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold">
                খসড়া হিসেবে সংরক্ষণ
              </button>
              <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
                <Send className="w-3.5 h-3.5" /> পাঠান
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-emerald-950">সাম্প্রতিক ঘোষণা</h3>
          <span className="text-xs text-slate-500">সর্বমোট ১৪</span>
        </div>
        <div className="divide-y divide-slate-100">
          {announcements.map((a, i) => (
            <div key={i} className="px-5 py-4 hover:bg-slate-50 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Megaphone className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-emerald-950 leading-tight">{a.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[a.status]}`}>
                    {statusLabel[a.status]}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mt-1">{a.body}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-500">
                  <span><strong>লক্ষ্য:</strong> {a.audience}</span>
                  <span>·</span>
                  <span><strong>চ্যানেল:</strong> {a.channel.join(", ")}</span>
                  <span>·</span>
                  <span>{a.publishedAt}</span>
                  {a.reads > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-700 font-bold">{a.reads} পড়েছে</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
