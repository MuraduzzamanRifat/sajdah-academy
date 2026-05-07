import type { Metadata } from "next";
import { Search, Star, AlertCircle, MessageSquare, Send } from "lucide-react";
import ComingSoon from "../_components/ComingSoon";

export const metadata: Metadata = {
  title: "Admin · Messages",
  alternates: { canonical: "/admin/messages/" },
  robots: { index: false, follow: false },
};

const inbox = [
  { from: "Tariq Aziz", role: "আবেদনকারী", subject: "ভর্তির পেমেন্ট সম্পর্কে প্রশ্ন", preview: "আসসালামু আলাইকুম। আমার ভর্তির পেমেন্ট বিষয়ে কিছু জানার ছিল...", at: "১২ মিনিট আগে", unread: true, urgent: true },
  { from: "Yousuf Reza", role: "ব্যাচ-৩", subject: "৩য় কিস্তি বিলম্ব — অনুরোধ", preview: "শ্রদ্ধেয় প্রশাসন, আমার পরিবারের একটি মেডিকেল ইমার্জেন্সি কারণে...", at: "১ ঘণ্টা আগে", unread: true, urgent: true },
  { from: "Mahdi Karim", role: "Alumni", subject: "Alumni নেটওয়ার্কে যোগদান", preview: "আমি এখন ব্যাচ-২ থেকে গ্র্যাজুয়েট হয়েছি। Alumni গ্রুপে যোগ দিতে চাই...", at: "৩ ঘণ্টা আগে", unread: true, urgent: false },
  { from: "মুফতি জাকারিয়া", role: "শিক্ষক", subject: "Hadith Quiz 3 — গ্রেডিং সম্পন্ন", preview: "৩৮ ছাত্রের গ্রেডিং সম্পন্ন। গড় ৮৭% — গত কুইজের চেয়ে উন্নতি...", at: "৬ ঘণ্টা আগে", unread: false, urgent: false },
  { from: "Sadman Khan", role: "ব্যাচ-৩", subject: "Final exam সিডিউল", preview: "Final exam কখন হবে? আমার রমাদান সফরের সাথে কনফ্লিক্ট হতে পারে...", at: "১ দিন আগে", unread: false, urgent: false },
  { from: "Imran Khalil", role: "ব্যাচ-৩", subject: "সার্টিফিকেট কপি", preview: "Block 1 এর সার্টিফিকেট কপি কীভাবে পাবো?", at: "২ দিন আগে", unread: false, urgent: false },
  { from: "Public Form", role: "Website", subject: "ভর্তির আগে একটি প্রশ্ন", preview: "ব্যাচ-৫ এর ক্লাস কোন সময়ে হবে? আমি একজন কর্মজীবী...", at: "২ দিন আগে", unread: false, urgent: false },
];

export default function AdminMessagesPage() {
  return (
    <div>
      <ComingSoon body="ম্যাসেজ পাঠানো এখনো ব্যাকএন্ডে wired হয়নি — Inbox/Sent/Drafts ও থ্রেড সবই স্ট্যাটিক প্রিভিউ।" />
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex h-[640px]">
      <div className="w-72 border-r border-slate-200 flex flex-col shrink-0">
        <div className="px-3 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 rounded-lg text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">খুঁজুন...</span>
          </div>
        </div>
        <div className="flex border-b border-slate-200 text-xs">
          <button type="button" className="flex-1 px-3 py-2 border-b-2 border-emerald-700 text-emerald-700 font-bold">
            Inbox <span className="bg-emerald-700 text-white text-[10px] px-1.5 rounded-full ml-1">৭</span>
          </button>
          <button type="button" className="flex-1 px-3 py-2 text-slate-500 hover:text-slate-900">Sent</button>
          <button type="button" className="flex-1 px-3 py-2 text-slate-500 hover:text-slate-900">Drafts</button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {inbox.map((m, i) => (
            <button
              key={i}
              type="button"
              className={`w-full text-left px-3 py-3 border-b border-slate-100 hover:bg-slate-50 ${
                i === 0 ? "bg-emerald-50/60 border-l-2 border-l-emerald-600" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {m.from.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`text-xs truncate ${m.unread ? "font-bold text-emerald-950" : "text-slate-700"}`}>{m.from}</p>
                    {m.urgent && <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-500">{m.role}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{m.at.split(" ")[0]}</span>
              </div>
              <p className={`text-[11px] mt-1.5 leading-tight line-clamp-1 ${m.unread ? "font-bold text-slate-900" : "text-slate-700"}`}>
                {m.subject}
              </p>
              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{m.preview}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            TA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-emerald-950">Tariq Aziz</p>
            <p className="text-[11px] text-slate-500">আবেদনকারী · +880 19 1122 3344</p>
          </div>
          <div className="flex gap-1">
            <button type="button" className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded">
              <Star className="w-4 h-4" />
            </button>
            <button type="button" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded">
              <AlertCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
          <div className="bg-white rounded-2xl rounded-tl-sm p-4 max-w-[80%] border border-slate-200">
            <p className="text-xs font-bold text-emerald-950 mb-1">Tariq Aziz · ১২ মিনিট আগে</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              আসসালামু আলাইকুম। আমার ভর্তির পেমেন্ট বিষয়ে কিছু জানার ছিল। ১ম কিস্তি ৫৬,২৫০ টাকা — এটা কি bKash এ পাঠাতে পারবো?
              নাকি ব্যাংক ট্রান্সফার করতে হবে? আর পেমেন্টের পর কতদিনে কনফার্মেশন পাবো?
            </p>
            <p className="text-[10px] text-slate-400 mt-2">৭:২৪ PM</p>
          </div>

          <div className="bg-emerald-700 text-white rounded-2xl rounded-tr-sm p-4 max-w-[80%] border border-emerald-700 ml-auto">
            <p className="text-xs font-bold mb-1">আপনি · ৮ মিনিট আগে</p>
            <p className="text-sm leading-relaxed text-emerald-50">
              ওয়া আলাইকুমুস সালাম ভাই। দুটোই গ্রহণযোগ্য:
              <br />১) bKash মার্চেন্ট: 01744-XXX
              <br />২) Bank: Sajdah Academy, City Bank, A/C 1234567890
              <br />পেমেন্টের ৩-৪ ঘণ্টার মধ্যে SMS পাবেন।
            </p>
            <p className="text-[10px] text-emerald-200 mt-2">৭:৩০ PM</p>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded">Tariq is typing...</span>
          </div>
        </div>

        <div className="border-t border-slate-200 p-3 bg-white">
          <div className="flex items-end gap-2">
            <textarea
              placeholder="বার্তা লিখুন..."
              rows={2}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            />
            <button type="button" className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2 mt-2 text-[10px]">
            <button type="button" className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600">
              টেমপ্লেট: পেমেন্ট ইনস্ট্রাকশন
            </button>
            <button type="button" className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600">
              টেমপ্লেট: ভর্তি কনফার্মেশন
            </button>
            <button type="button" className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600">
              টেমপ্লেট: ক্লাস টাইমিং
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
