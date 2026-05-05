import type { Metadata } from "next";
import { Upload, Image as ImageIcon, Folder, MoreHorizontal, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Gallery",
  alternates: { canonical: "/admin/gallery/" },
  robots: { index: false, follow: false },
};

const albums = [
  { title: "ব্যাচ-৩ — Annual Retreat 2026", count: 84, cover: "from-emerald-700 to-emerald-900", date: "মার্চ ২০২৬", live: true },
  { title: "Block 3 — Hadith Module", count: 42, cover: "from-amber-600 to-amber-800", date: "এপ্রিল ২০২৬", live: true },
  { title: "ব্যাচ-২ Graduation", count: 76, cover: "from-purple-700 to-purple-900", date: "ফেব্রুয়ারি ২০২৬", live: true },
  { title: "Founders' Visit", count: 24, cover: "from-emerald-800 to-emerald-950", date: "জানুয়ারি ২০২৬", live: true },
  { title: "Tahajjud + Sunrise (Resort)", count: 31, cover: "from-blue-700 to-blue-900", date: "মার্চ ২০২৬", live: false },
  { title: "ব্যাচ-৫ Welcome Promo", count: 12, cover: "from-rose-600 to-rose-800", date: "মে ২০২৬", live: false },
];

const recent = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  album: i < 4 ? "Block 3 — Hadith" : i < 8 ? "ব্যাচ-৩ Retreat" : "ব্যাচ-২ Grad",
  size: `${(1.2 + i * 0.4).toFixed(1)} MB`,
  hue: [
    "from-emerald-200 to-emerald-400",
    "from-amber-200 to-amber-400",
    "from-purple-200 to-purple-400",
    "from-blue-200 to-blue-400",
    "from-rose-200 to-rose-400",
    "from-slate-300 to-slate-500",
  ][i % 6],
}));

export default function AdminGalleryPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950">গ্যালারি · মোট ২৬৯ মিডিয়া</h2>
          <p className="text-xs text-slate-500 mt-0.5">৬ অ্যালবাম · ৪ লাইভ · ২ খসড়া · ১.২ GB</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold">
            <Folder className="w-3.5 h-3.5" /> নতুন অ্যালবাম
          </button>
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
            <Upload className="w-3.5 h-3.5" /> মিডিয়া আপলোড
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-emerald-950 mb-3">অ্যালবাম</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {albums.map((a) => (
            <div key={a.title} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-emerald-950/5 transition-shadow">
              <div className={`aspect-video bg-gradient-to-br ${a.cover} flex items-center justify-center relative`}>
                <ImageIcon className="w-8 h-8 text-white/40" />
                {a.live && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Live
                  </span>
                )}
                {!a.live && (
                  <span className="absolute top-2 right-2 text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    খসড়া
                  </span>
                )}
                <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-emerald-950/70 text-white px-2 py-0.5 rounded">
                  {a.count} ছবি
                </span>
              </div>
              <div className="p-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-emerald-950 leading-tight truncate">{a.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{a.date}</p>
                </div>
                <button type="button" className="p-1 text-slate-400 hover:text-slate-700 shrink-0">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-emerald-950">সাম্প্রতিক আপলোড</h3>
          <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">সব দেখুন →</button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {recent.map((r) => (
            <div key={r.id} className="aspect-square bg-white border border-slate-200 rounded-lg overflow-hidden group relative">
              <div className={`w-full h-full bg-gradient-to-br ${r.hue} flex items-center justify-center`}>
                <ImageIcon className="w-5 h-5 text-white/50" />
              </div>
              <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/40 transition-colors flex items-end p-1.5">
                <span className="text-[9px] font-bold text-white opacity-0 group-hover:opacity-100">
                  {r.size}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
