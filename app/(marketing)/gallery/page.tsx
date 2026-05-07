import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";
import { getSettingsByPrefix, pick } from "../../../lib/settings";

const title = "Gallery — গ্যালারি";
const description =
  "Sajdah Academy-এর পূর্বের ব্যাচের ছবি ও মুহূর্ত। আমাদের রিসোর্ট, ক্লাসরুম, প্রকৃতি, ও ভ্রাতৃত্বের একটি ঝলক।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/gallery/" },
};

export const revalidate = 60;

type Photo = { image?: string; alt?: string; caption?: string };

const DEFAULT_PHOTOS: Photo[] = [
  {
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    alt: "প্রিমিয়াম রিসোর্ট অ্যাকোমোডেশন",
    caption: "গাজীপুর রিসোর্ট · ব্যাচ-৩",
  },
  {
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop",
    alt: "প্রকৃতিতে ভ্রমণ ও মুরাকাবা",
    caption: "Live with Nature — ব্যাচ-২",
  },
  {
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop",
    alt: "হাই-এন্ড কনফারেন্স ক্লাসরুম",
    caption: "Class-3 — Aqeedah session",
  },
];

export default async function GalleryPage() {
  const s = await getSettingsByPrefix("gallery.");
  const eyebrow = pick(s, "gallery.eyebrow", "Gallery · গ্যালারি");
  const titleBn = pick(s, "gallery.title_bn", "আমাদের যাত্রার মুহূর্ত");
  const subtitleBn = pick(
    s,
    "gallery.subtitle_bn",
    "পূর্বের ব্যাচের ছবি ও দৃশ্য — রিসোর্ট, ক্লাসরুম, প্রকৃতি, ভ্রাতৃত্ব ও আত্মার যাত্রার একটি ঝলক।"
  );
  const photos = pick<Photo[]>(s, "gallery.photos", DEFAULT_PHOTOS).filter((p) => p.image);
  const ctaTitle = pick(s, "gallery.cta_title_bn", "পরবর্তী ব্যাচের ছবিতে আপনি কি থাকবেন?");
  const ctaBody = pick(s, "gallery.cta_body_bn", "৪০ সিটের সীমিত ব্যাচ। আপনার সিট সংরক্ষণ করুন এখনই।");
  const ctaButton = pick(s, "gallery.cta_button_bn", "Apply for Next Batch →");

  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Camera className="w-14 h-14 text-amber-400 mx-auto mb-5" />
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            {eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{titleBn}</h1>
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">{subtitleBn}</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {photos.length === 0 ? (
            <p className="text-center text-slate-500 py-16">শীঘ্রই ছবি যোগ করা হবে।</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((p, i) => (
                <figure
                  key={i}
                  className="group relative overflow-hidden rounded-2xl shadow-lg shadow-emerald-950/10"
                >
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <Image
                      src={p.image!}
                      alt={p.alt ?? p.caption ?? "Gallery photo"}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      quality={75}
                      loading={i < 3 ? "eager" : "lazy"}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <figcaption className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    {p.caption && (
                      <p className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-1">
                        {p.caption}
                      </p>
                    )}
                    {p.alt && <p className="text-sm leading-tight">{p.alt}</p>}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-emerald-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-4">{ctaTitle}</h2>
          <p className="text-slate-700 mb-7 text-lg">{ctaBody}</p>
          <Link
            href="/enroll/"
            className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg active:scale-[0.98]"
          >
            {ctaButton}
          </Link>
        </div>
      </section>
    </main>
  );
}
