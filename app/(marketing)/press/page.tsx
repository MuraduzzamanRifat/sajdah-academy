import type { Metadata } from "next";
import { Mail, Download, Image as ImageIcon, FileText, Phone } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { getSettingsByPrefix, pick } from "../../../lib/settings";

const RENDER_PURIFY: Parameters<typeof DOMPurify.sanitize>[1] = {
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[/#])/i,
  FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
  FORBID_ATTR: ["onerror", "onclick", "onload", "onmouseover", "onfocus"],
};
/* Coerces non-string inputs (an empty CMS field can land as `{}`/`[]`
   after a save round-trip; that used to blow up DOMPurify.sanitize). */
const purify = (html: unknown): string => {
  if (typeof html !== "string" || html.length === 0) return "";
  try {
    return String(DOMPurify.sanitize(html, RENDER_PURIFY));
  } catch {
    return "";
  }
};

const title = "Press & Media — সংবাদমাধ্যম";
const description =
  "Sajdah Academy press kit — লোগো, ছবি, প্রেস রিলিজ ও মিডিয়া কভারেজের জন্য প্রয়োজনীয় তথ্য।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/press/" },
};

export const revalidate = 60;

type Fact = { label?: string; value?: string };
type Release = { date?: string; title?: string; summary?: string };

const DEFAULT_FACTS: Fact[] = [
  { label: "Founded", value: "২০২৪" },
  { label: "Headquarters", value: "ঢাকা, বাংলাদেশ" },
  { label: "Format", value: "৬-মাসের ফিজিক্যাল রিসোর্ট প্রোগ্রাম" },
  { label: "Languages", value: "বাংলা · আরবি · ইংরেজি" },
  { label: "Batches Run", value: "৪+ (২০২৬ পর্যন্ত)" },
  { label: "Students Trained", value: "১৬০+" },
];

const DEFAULT_RELEASES: Release[] = [
  {
    date: "এপ্রিল ২০২৬",
    title: "চতুর্থ ব্যাচ সফলভাবে সমাপ্ত",
    summary: "৪০ জন অংশগ্রহণকারীর ৬ মাসের প্রোগ্রাম সম্পন্ন। গাজীপুর রিসোর্টে অনুষ্ঠিত সমাপনী।",
  },
];

const DEFAULT_BOILERPLATE = `<p>Sajdah Academy বাংলাদেশের প্রথম প্রিমিয়াম রিসোর্ট-ভিত্তিক ফিজিক্যাল ইসলামিক ট্রেনিং প্রোগ্রাম। ৬ মাসব্যাপী এই কোর্সে অংশগ্রহণকারীরা দেশের সম্মানিত আলেম, পেশাদার ও মেন্টরদের তত্ত্বাবধানে কুরআন, হাদীস, ফিকহ, ও তাযকিয়াহ বিষয়ে গভীর প্রশিক্ষণ গ্রহণ করেন।</p>`;

export default async function PressPage() {
  const s = await getSettingsByPrefix("press.");
  const eyebrow = pick(s, "press.eyebrow", "Press · মিডিয়া");
  const titleBn = pick(s, "press.title_bn", "Press & Media Kit");
  const subtitleBn = pick(
    s,
    "press.subtitle_bn",
    "সাংবাদিক, ব্লগার, কনটেন্ট ক্রিয়েটরদের জন্য — Sajdah Academy সম্পর্কে অফিসিয়াল তথ্য, লোগো, ছবি ও যোগাযোগ।"
  );
  const aboutTitle = pick(s, "press.about_title", "About Sajdah Academy");
  const aboutBody = pick(s, "press.about_body", DEFAULT_BOILERPLATE);
  const facts = pick<Fact[]>(s, "press.facts", DEFAULT_FACTS).filter((f) => f.label || f.value);
  const releases = pick<Release[]>(s, "press.releases", DEFAULT_RELEASES).filter((r) => r.title);
  const contactTitle = pick(s, "press.contact_title_bn", "Press Contact");
  const contactBody = pick(
    s,
    "press.contact_body_bn",
    "ইন্টারভিউ, কভারেজ, বা কোনো নির্দিষ্ট প্রশ্নের জন্য সরাসরি যোগাযোগ করুন।"
  );
  const contactEmail = pick(s, "press.contact_email", "sijdah.academybd@gmail.com");
  const contactPhone = pick(s, "press.contact_phone", "+880 180 55 65 444");

  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            {eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">{titleBn}</h1>
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl">{subtitleBn}</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-light rounded-3xl p-8 md:p-10 mb-10">
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">{aboutTitle}</h2>
            <div className="blog-prose" dangerouslySetInnerHTML={{ __html: purify(aboutBody) }} />
          </div>

          {facts.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
              {facts.map((f, i) => (
                <div key={i} className="glass-light rounded-xl p-4">
                  {f.label && (
                    <p className="text-xs text-amber-600 uppercase font-bold tracking-wider mb-1">
                      {f.label}
                    </p>
                  )}
                  {f.value && <p className="text-emerald-950 font-bold">{f.value}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-emerald-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-2 text-center">Brand Assets</h2>
          <p className="text-slate-600 text-center mb-10">
            ব্যবহারের আগে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            <a
              href="/icon-32.png"
              download
              className="glass-light glass-light-hover rounded-2xl p-6 block text-center group"
            >
              <ImageIcon className="w-10 h-10 text-emerald-700 mx-auto mb-3" />
              <h3 className="font-bold text-emerald-950 mb-1">Logo (Square)</h3>
              <p className="text-xs text-slate-500 mb-3">PNG · 32x32</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-amber-700">
                <Download className="w-3.5 h-3.5" /> Download
              </span>
            </a>
            <a
              href="/medallion-512.png"
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
              href="/opengraph-image"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-light glass-light-hover rounded-2xl p-6 block text-center group"
            >
              <FileText className="w-10 h-10 text-emerald-700 mx-auto mb-3" />
              <h3 className="font-bold text-emerald-950 mb-1">Social Card</h3>
              <p className="text-xs text-slate-500 mb-3">PNG · 1200x630 OG (auto-generated)</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-amber-700">
                <Download className="w-3.5 h-3.5" /> View
              </span>
            </a>
          </div>
        </div>
      </section>

      {releases.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-8 text-center">
              Press Releases · প্রেস রিলিজ
            </h2>
            <div className="space-y-4">
              {releases.map((r, i) => (
                <article key={i} className="glass-light rounded-2xl p-6">
                  {r.date && (
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-2">{r.date}</p>
                  )}
                  {r.title && <h3 className="text-lg font-bold text-emerald-950 mb-2">{r.title}</h3>}
                  {r.summary && <p className="text-slate-700 leading-relaxed">{r.summary}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-emerald-900 text-white relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{contactTitle}</h2>
          <p className="text-emerald-100 mb-7 text-lg">{contactBody}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`mailto:${contactEmail}?subject=Press%20enquiry`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg active:scale-[0.98]"
            >
              <Mail className="w-5 h-5" />
              {contactEmail}
            </a>
            <a
              href={`tel:${contactPhone.replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-emerald-950 font-bold rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5" />
              {contactPhone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
