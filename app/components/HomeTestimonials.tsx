/* CMS-driven testimonials carousel/grid. Data shape matches the schema
   item declared in app/admin/pages/schema.ts under home.testimonials.items:
     { name, role, quote_bn, photo? }
   Hidden when no items are configured. */

import Image from "next/image";
import { Quote } from "lucide-react";

export type Testimonial = {
  name?: string;
  role?: string;
  quote_bn?: string;
  photo?: string;
};

export default function HomeTestimonials({
  title,
  items,
}: {
  title?: string;
  items: Testimonial[];
}) {
  const visible = items.filter((t) => (t.quote_bn ?? "").trim() !== "");
  if (visible.length === 0) return null;

  return (
    <section className="bg-emerald-50 py-20 px-4 relative overflow-hidden">
      <div aria-hidden className="ambient-orbs orbs-light" />
      <div className="max-w-6xl mx-auto relative z-10">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 text-center mb-12 leading-tight">
            {title}
          </h2>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((t, i) => (
            <figure
              key={i}
              className="glass-light glass-light-hover rounded-2xl p-6 flex flex-col"
            >
              <Quote
                aria-hidden
                className="w-7 h-7 text-amber-500 mb-4 shrink-0"
                strokeWidth={2}
              />
              <blockquote className="text-emerald-950 text-base leading-relaxed mb-5 flex-1">
                {t.quote_bn}
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-auto">
                {t.photo ? (
                  <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-amber-400/30 shrink-0">
                    <Image
                      src={t.photo}
                      alt={t.name ?? "Student"}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full bg-emerald-700 text-white text-sm font-bold flex items-center justify-center ring-2 ring-amber-400/30 shrink-0">
                    {(t.name ?? "?").slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0">
                  {t.name && (
                    <p className="text-sm font-bold text-emerald-950 truncate">
                      {t.name}
                    </p>
                  )}
                  {t.role && (
                    <p className="text-xs text-slate-600 truncate">{t.role}</p>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
