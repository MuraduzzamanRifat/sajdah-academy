import type { Metadata } from "next";
import { Send, Search, Paperclip } from "lucide-react";

export const metadata: Metadata = {
  title: "Messages — বার্তা",
  alternates: { canonical: "/dashboard/messages/" },
  robots: { index: false, follow: false },
};

const conversations = [
  {
    id: 1,
    name: "মাওলানা আবদুল্লাহ মাহমুদ",
    role: "Primary Mentor",
    initial: "আ",
    lastMessage: "আপনার তাহাজ্জুদ স্ট্রিক চমৎকার। আল্লাহ স্থির রাখুন।",
    time: "১৫ মিনিট",
    unread: 1,
    active: true,
  },
  {
    id: 2,
    name: "মুফতি জাকারিয়া হোসাইন",
    role: "Hadith & Fiqh",
    initial: "জ",
    lastMessage: "Quiz-3 এর প্রশ্নের তালিকা পাঠালাম।",
    time: "২ ঘণ্টা",
    unread: 1,
    active: false,
  },
  {
    id: 3,
    name: "Sajdah Support",
    role: "Admin",
    initial: "S",
    lastMessage: "আপনার ২য় কিস্তির রিমাইন্ডার পাঠানো হয়েছে।",
    time: "গতকাল",
    unread: 0,
    active: false,
  },
  {
    id: 4,
    name: "ড. ইমরান হাসান",
    role: "Tazkiyah & Counselling",
    initial: "ই",
    lastMessage: "আপনার গত সপ্তাহের রিফ্লেকশন পড়েছি।",
    time: "৩ দিন",
    unread: 0,
    active: false,
  },
];

const thread = [
  { from: "mentor", text: "আসসালামু আলাইকুম ভাই Ibrahim। কেমন আছেন?", time: "সকাল ৯:১২" },
  { from: "me", text: "ওয়া আলাইকুম আসসালাম শাইখ। আলহামদুলিল্লাহ ভালো আছি।", time: "সকাল ৯:১৫" },
  {
    from: "mentor",
    text: "আপনার তাহাজ্জুদ স্ট্রিক চমৎকার। ১২ দিন একটানা — মাশাআল্লাহ। এই সৌন্দর্য আল্লাহ স্থির রাখুন।",
    time: "সকাল ৯:১৬",
  },
  {
    from: "me",
    text: "জাযাকাল্লাহু খাইরান শাইখ। কিছু সংশয় আছে — দু'আ-এ আদব ও মনোযোগ ধরে রাখা সম্পর্কে।",
    time: "সকাল ৯:২০",
  },
  {
    from: "mentor",
    text: "এটি গুরুত্বপূর্ণ প্রশ্ন। শুক্রবার ক্লাস-৫ এ এই বিষয়ে বিশেষভাবে আলোচনা থাকবে। প্রস্তুতির জন্য Library-তে \"Concentration in Salah\" ভিডিওটি দেখে রাখুন।",
    time: "সকাল ৯:২৫",
  },
  {
    from: "mentor",
    text: "আপনার তাহাজ্জুদ স্ট্রিক চমৎকার। আল্লাহ স্থির রাখুন।",
    time: "এখন",
  },
];

export default function MessagesPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex h-[600px]">
        <aside className="w-72 border-r border-slate-200 flex flex-col shrink-0 hidden md:flex">
          <div className="p-3 border-b border-slate-200">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                disabled
                placeholder="Search conversations..."
                className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none w-full"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`w-full text-left p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  c.active ? "bg-emerald-50 border-l-4 border-l-emerald-600" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {c.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1.5">
                      <p className="text-sm font-bold text-emerald-950 truncate">{c.name}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-amber-600 font-medium mb-1">{c.role}</p>
                    <p className="text-xs text-slate-600 truncate">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </aside>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              আ
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-emerald-950">মাওলানা আবদুল্লাহ মাহমুদ</p>
              <p className="text-xs text-emerald-600">● Online · Primary Mentor</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {thread.map((m, i) => {
              const me = m.from === "me";
              return (
                <div key={i} className={`flex ${me ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      me
                        ? "bg-emerald-700 text-white rounded-br-sm"
                        : "bg-white border border-slate-200 text-emerald-950 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    <p className={`text-[10px] mt-1 ${me ? "text-emerald-200" : "text-slate-400"}`}>
                      {m.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white">
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
              aria-label="Attach"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              disabled
              placeholder="বার্তা লিখুন... (Preview)"
              className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              disabled
              className="p-2.5 bg-emerald-700 text-white rounded-lg opacity-60 cursor-not-allowed"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
    </div>
  );
}
