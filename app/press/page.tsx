import type { Metadata } from "next";
import { Mail, Download, Image as ImageIcon, FileText, Phone } from "lucide-react";

const title = "Press & Media — সংবাদমাধ্যম";
const description =
  "Sajdah Academy press kit — লোগো, ছবি, প্রেস রিলিজ ও মিডিয়া কভারেজের জন্য প্রয়োজনীয় তথ্য।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/press/" },
};

const facts = [
  { label: "Founded", value: "২০২৪" },
  { label: "Headquarters", value: "ঢাকা, বাংলাদেশ" },
  { label: "Format", value: "৬-মাসের ফিজিক্যাল রিসোর্ট প্রোগ্রাম" },
  { label: "Languages", value: "বাংলা · আরবি · ইংরেজি" },
  { label: "Batches Run", value: "৪+ (২০২৬ পর্যন্ত)" },
  { label: "Students Trained", value: "১৬০+" },
];

const releases = [
  {
    date: "এপ্রিল ২০২৬",
    title: "চতুর্থ ব্যাচ সফলভাবে সমাপ্ত",
    summary: "৪০ জন অংশগ্রহণকারীর ৬ মাসের প্রোগ্রাম সম্পন্ন। গাজীপুর রিসোর্টে অনুষ্ঠিত সমাপনী।",
  },
  {
    date: "জানুয়ারি ২০২৬",
    title: "Sajdah Alumni Network চালু",
    summary: "প্রাক্তন অংশগ্রহণকারীদের জন্য আজীবন কমিউনিটি প্ল্যাটফর্ম শুরু।",
  },
  {
    date: "অক্টোবর ২০২৫",
    title: "প্রথম পাইলট ব্যাচ",
    summary: "৩৮ জনের পাইলট ব্যাচ সফলভাবে সম্পন্ন — গাজীপুর প্রিমিয়াম রিসোর্টে।",
  },
];

export default function PressPage() {
  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            Press · মিডিয়া
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">Press & Media Kit</h1>
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl">
            সাংবাদিক, ব্লগার, কনটেন্ট ক্রিয়েটরদের জন্য — Sajdah Academy সম্পর্কে অফিসিয়াল তথ্য,
            লোগো, ছবি ও যোগাযোগ।
          </p>
        </div>
      </section>

      {/* Boilerplate */}
      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-light rounded-3xl p-8 md:p-10 mb-10">
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">About Sajdah Academy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Sajdah Academy বাংলাদেশের প্রথম প্রিমিয়াম রিসোর্ট-ভিত্তিক ফিজিক্যাল ইসলামিক ট্রেনিং
              প্রোগ্রাম। ৬ মাসব্যাপী এই কোর্সে অংশগ্রহণকারীরা দেশের সম্মানিত আলেম, পেশাদার ও
              মেন্টরদের তত্ত্বাবধানে কুরআন, হাদীস, ফিকহ, ও তাযকিয়াহ বিষয়ে গভীর প্রশিক্ষণ গ্রহণ করেন।
            </p>
            <p className="text-slate-700 leading-relaxed">
              ৪০ জনের সীমিত ব্যাচে গাজীপুর, সিলেট ও কক্সবাজারের প্রিমিয়াম রিসোর্টে ক্লাস অনুষ্ঠিত হয়।
              ২০২৪ সালে প্রতিষ্ঠিত এই একাডেমি ২০২৬ পর্যন্ত ১৬০+ অংশগ্রহণকারীকে প্রশিক্ষণ দিয়েছে।
            </p>
          </div>

          {/* Quick facts */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {facts.map((f) => (
              <div key={f.label} className="glass-light rounded-xl p-4">
                <p className="text-xs text-amber-600 uppercase font-bold tracking-wider mb-1">
                  {f.label}
                </p>
                <p className="text-emerald-950 font-bold">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand assets */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-2 text-center">Brand Assets</h2>
          <p className="text-slate-600 text-center mb-10">
            ব্যবহারের আগে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            <a
              href="/sajdah-academy/icon.png"
              download
              className="glass-light glass-light-hover rounded-2xl p-6 block text-center group"
            >
              <ImageIcon className="w-10 h-10 text-emerald-700 mx-auto mb-3" />
              <h3 className="font-bold text-emerald-950 mb-1">Logo (Square)</h3>
              <p className="text-xs text-slate-500 mb-3">PNG · 32x32 / 180x180</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-amber-700">
                <Download className="w-3.5 h-3.5" /> Download
              </span>
            </a>
            <a
              href="/sajdah-academy/medallion-512.png"
              download
              className="glass-light glass-light-hover rounded-2xl p-6 block text-center group"
            >
              <ImageIcon className="w-10 h-10 text-emerald-700 mx-auto mb-3" />
              <h3 className="font-bold text-emerald-950 mb-1">Medallion Mark</h3>
              <p className="text-xs text-slate-500 mb-3">PNG · 512x512 transparent</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-amber-700">
                <Download className="w-3.5 h-3.5" /> Download
              </span>
            </a>
            <a
              href="/sajdah-academy/opengraph-image"
              download
              className="glass-light glass-light-hover rounded-2xl p-6 block text-center group"
            >
              <FileText className="w-10 h-10 text-emerald-700 mx-auto mb-3" />
              <h3 className="font-bold text-emerald-950 mb-1">Social Card</h3>
              <p className="text-xs text-slate-500 mb-3">PNG · 1200x630 OG</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-amber-700">
                <Download className="w-3.5 h-3.5" /> Download
              </span>
            </a>
          </div>

          <div className="mt-8 bg-emerald-100/60 border border-emerald-200 rounded-xl p-5 text-sm text-emerald-900">
            <strong>Color palette:</strong> Emerald-950 (#022c22) · Amber-500 (#f59e0b) ·
            Slate-50 (#f8fafc) · Hind Siliguri / Inter typography.
          </div>
        </div>
      </section>

      {/* Press releases */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-8 text-center">
            Press Releases · প্রেস রিলিজ
          </h2>
          <div className="space-y-4">
            {releases.map((r) => (
              <article key={r.title} className="glass-light rounded-2xl p-6">
                <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-2">{r.date}</p>
                <h3 className="text-lg font-bold text-emerald-950 mb-2">{r.title}</h3>
                <p className="text-slate-700 leading-relaxed">{r.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Press contact */}
      <section className="py-16 bg-emerald-900 text-white relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Press Contact</h2>
          <p className="text-emerald-100 mb-7 text-lg">
            ইন্টারভিউ, কভারেজ, বা কোনো নির্দিষ্ট প্রশ্নের জন্য সরাসরি যোগাযোগ করুন।
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:sijdah.academybd@gmail.com?subject=Press%20enquiry"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg active:scale-[0.98]"
            >
              <Mail className="w-5 h-5" />
              press@sajdah.org
            </a>
            <a
              href="tel:+880180556544"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-emerald-950 font-bold rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5" />
              +880 180 55 65 444
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
