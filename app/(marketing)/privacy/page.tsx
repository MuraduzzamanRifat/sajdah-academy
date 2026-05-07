import type { Metadata } from "next";
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

const title = "Privacy Policy & Terms — গোপনীয়তা নীতি";
const description =
  "Sajdah Academy-এর গোপনীয়তা নীতি ও কোর্সের শর্তাবলী। আপনার তথ্য কীভাবে সংরক্ষণ ও ব্যবহার করা হয়।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy/" },
};

export const revalidate = 60;

const DEFAULT_PRIVACY_HTML = `
<h3>কোন তথ্য আমরা সংগ্রহ করি</h3>
<p>যখন আপনি ভর্তির আবেদন বা যোগাযোগ ফর্ম পূরণ করেন, আমরা সংগ্রহ করি:</p>
<ul>
  <li>নাম, পিতার নাম, বয়স, শহর</li>
  <li>ফোন, WhatsApp, ইমেইল</li>
  <li>পেশা ও শিক্ষাগত পটভূমি</li>
  <li>আপনার পেমেন্ট তথ্য (পেমেন্ট গেটওয়ে কর্তৃক প্রক্রিয়াকৃত)</li>
</ul>
<h3>কীভাবে ব্যবহৃত হয়</h3>
<ul>
  <li>আপনার ভর্তি প্রক্রিয়া পরিচালনা</li>
  <li>ব্যাচ-সংক্রান্ত গুরুত্বপূর্ণ যোগাযোগ</li>
  <li>কোর্স উপকরণ ও সাপোর্ট প্রদান</li>
  <li>মানোন্নয়নের জন্য মতামত সংগ্রহ</li>
</ul>
`.trim();

const DEFAULT_TERMS_HTML = `
<h3>ভর্তি ও পেমেন্ট</h3>
<ul>
  <li>ভর্তি কোর্স ফি পরিশোধের পরই নিশ্চিত হয়</li>
  <li>সিট সীমিত — first-come basis-এ বরাদ্দ</li>
  <li>কিস্তি পেমেন্ট নির্ধারিত সময়সূচী অনুযায়ী মেনে চলতে হবে</li>
</ul>
<h3>রিফান্ড পলিসি</h3>
<ul>
  <li>ব্যাচ শুরুর ৩০ দিন পূর্বে — ৮০% রিফান্ড</li>
  <li>১৫ দিন পূর্বে — ৫০% রিফান্ড</li>
  <li>৭ দিন পূর্বে — ২৫% রিফান্ড</li>
  <li>তার পরে — কোনো রিফান্ড নয় (তবে পরবর্তী ব্যাচে স্থানান্তর সম্ভব)</li>
</ul>
`.trim();

export default async function PrivacyPage() {
  const s = await getSettingsByPrefix("privacy.");
  const eyebrow = pick(s, "privacy.eyebrow", "Legal");
  const titleBn = pick(s, "privacy.title_bn", "Privacy Policy & Terms");
  const lastUpdated = pick(s, "privacy.last_updated_bn", "সর্বশেষ আপডেট: মে ২০২৬");
  const privacyTitle = pick(s, "privacy.privacy_title_bn", "১. গোপনীয়তা নীতি (Privacy Policy)");
  const privacyBody = pick(s, "privacy.privacy_body", DEFAULT_PRIVACY_HTML);
  const termsTitle = pick(s, "privacy.terms_title_bn", "২. কোর্সের শর্তাবলী (Terms)");
  const termsBody = pick(s, "privacy.terms_body", DEFAULT_TERMS_HTML);
  const footerEmail = pick(s, "privacy.footer_email", "sijdah.academybd@gmail.com");

  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-16 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-3">
            {eyebrow}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{titleBn}</h1>
          <p className="text-emerald-100">{lastUpdated}</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div id="privacy">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-3">{privacyTitle}</h2>
            <div className="blog-prose" dangerouslySetInnerHTML={{ __html: purify(privacyBody) }} />
          </div>

          <div id="terms" className="pt-6 border-t border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-3">{termsTitle}</h2>
            <div className="blog-prose" dangerouslySetInnerHTML={{ __html: purify(termsBody) }} />
          </div>

          <div className="pt-6 border-t border-slate-200 text-sm text-slate-500">
            <p>
              এই নীতিমালা সম্পর্কিত যেকোনো প্রশ্নের জন্য:{" "}
              <a href={`mailto:${footerEmail}`} className="text-emerald-700 underline">
                {footerEmail}
              </a>
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
