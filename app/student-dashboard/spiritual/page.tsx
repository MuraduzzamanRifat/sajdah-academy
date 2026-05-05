import type { Metadata } from "next";
import { Heart, Moon, BookOpen, Sparkles, Flame, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Spiritual Tracker — আমল ট্র্যাকার",
  alternates: { canonical: "/student-dashboard/spiritual/" },
  robots: { index: false, follow: false },
};

const prayers = [
  { name: "ফজর", time: "৪:৩০", done: true },
  { name: "যোহর", time: "১:১৫", done: true },
  { name: "আসর", time: "৪:৪৫", done: true },
  { name: "মাগরিব", time: "৬:৩০", done: false },
  { name: "এশা", time: "৮:০০", done: false },
];

const last7Days = [
  { date: "১ মে", prayers: 5, tahajjud: true, quran: 2 },
  { date: "২ মে", prayers: 5, tahajjud: true, quran: 3 },
  { date: "৩ মে", prayers: 4, tahajjud: false, quran: 2 },
  { date: "৪ মে", prayers: 5, tahajjud: true, quran: 2 },
  { date: "৫ মে", prayers: 5, tahajjud: true, quran: 1 },
  { date: "৬ মে", prayers: 5, tahajjud: true, quran: 2 },
  { date: "৭ মে", prayers: 5, tahajjud: true, quran: 2 },
];

const adhkar = [
  { name: "সকালের দু'আ", done: true },
  { name: "সূরা ইয়াসিন", done: true },
  { name: "আস্তাগফিরুল্লাহ ১০০×", done: true },
  { name: "সন্ধ্যার দু'আ", done: false },
  { name: "শোয়ার আগের দু'আ", done: false },
];

export default function SpiritualPage() {
  const todayPrayers = prayers.filter((p) => p.done).length;
  return (
    <div className="space-y-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={<Heart className="w-5 h-5" />}
            value={`${todayPrayers}/৫`}
            label="আজকের সালাত"
            color="emerald"
          />
          <StatCard
            icon={<Moon className="w-5 h-5" />}
            value="১২ দিন"
            label="তাহাজ্জুদ স্ট্রিক"
            color="amber"
          />
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            value="৬৭ পৃষ্ঠা"
            label="এই মাসে কুরআন"
            color="emerald"
          />
          <StatCard
            icon={<Flame className="w-5 h-5" />}
            value="৩/৫"
            label="আজকের আদকার"
            color="amber"
          />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-950 flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-600" />
              আজকের পাঁচ ওয়াক্ত
            </h3>
            <span className="text-xs text-slate-500">{new Date().toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long" })}</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {prayers.map((p) => (
              <button
                key={p.name}
                type="button"
                disabled
                className={`text-center py-3 rounded-xl border-2 transition-all ${
                  p.done
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider font-bold">{p.name}</div>
                <div className="text-[11px] font-mono mt-1">{p.time}</div>
                <div className="text-lg mt-1">{p.done ? "✓" : "—"}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-emerald-900 text-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Moon className="w-4 h-4 text-amber-400" /> তাহাজ্জুদ স্ট্রিক
              </h3>
              <span className="bg-amber-500 text-emerald-950 text-xs font-bold px-2 py-1 rounded-full">
                ১২ দিন · মাশাআল্লাহ
              </span>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed mb-4">
              আপনি ১২ দিন একটানা তাহাজ্জুদে দাঁড়িয়েছেন। এই অভ্যাস আপনার জীবনের সবচেয়ে মূল্যবান সম্পদের একটি।
            </p>
            <div className="grid grid-cols-7 gap-1.5">
              {last7Days.map((d) => (
                <div key={d.date} className="text-center">
                  <div className={`h-12 rounded-md flex items-center justify-center text-sm font-bold ${
                    d.tahajjud ? "bg-amber-500 text-emerald-950" : "bg-emerald-950/50 text-emerald-600"
                  }`}>
                    {d.tahajjud ? "✓" : "—"}
                  </div>
                  <div className="text-[10px] text-emerald-300 mt-1">{d.date}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-emerald-950 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" /> কুরআন তিলাওয়াত
              </h3>
              <span className="text-xs font-bold text-emerald-700">৬৭ / ১০০ পৃষ্ঠা</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-500" style={{ width: "67%" }} />
            </div>
            <p className="text-xs text-slate-500 mb-4">এই মাসের লক্ষ্য — আর ৩৩ পৃষ্ঠা বাকি</p>
            <div className="grid grid-cols-7 gap-1.5">
              {last7Days.map((d) => (
                <div key={d.date} className="text-center">
                  <div className={`h-12 rounded-md flex items-center justify-center text-sm font-bold ${
                    d.quran >= 2 ? "bg-emerald-100 text-emerald-700" :
                    d.quran === 1 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"
                  }`}>
                    {d.quran}p
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{d.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" /> আদকার চেকলিস্ট
            </h3>
            <span className="text-xs text-slate-500">আজকে ৩/৫</span>
          </div>
          <div className="space-y-2">
            {adhkar.map((a) => (
              <div
                key={a.name}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  a.done ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  a.done ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-300"
                }`}>
                  {a.done && <span className="text-xs">✓</span>}
                </div>
                <span className={`text-sm ${a.done ? "text-emerald-950 line-through" : "text-slate-700"}`}>
                  {a.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5">
          <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" /> মেন্টরের পর্যবেক্ষণ
          </h3>
          <p className="text-sm text-amber-900 leading-relaxed mb-3">
            "মাশাআল্লাহ ভাই Ibrahim — তাহাজ্জুদে আপনার ধারাবাহিকতা চমৎকার। কুরআন তিলাওয়াতের পরিমাণ
            একটু বাড়িয়ে দিনে ৩ পৃষ্ঠা করতে পারলে এই মাসে ১ পারা পূর্ণ হবে ইনশাআল্লাহ।"
          </p>
          <p className="text-xs text-amber-700">— মাওলানা আবদুল্লাহ মাহমুদ · ২ দিন আগে</p>
        </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: "emerald" | "amber";
}) {
  const colorClasses = color === "emerald" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";
  const valueColor = color === "emerald" ? "text-emerald-700" : "text-amber-700";
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorClasses}`}>{icon}</div>
      <div className={`text-2xl font-bold leading-none ${valueColor}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-1.5">{label}</div>
    </div>
  );
}
