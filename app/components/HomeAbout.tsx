/* CMS-driven About section for the homepage. Body comes from a Tiptap
   rich-text field stored in site_settings under `home.about.body` —
   server-sanitized at write time, so we render it directly. */

import Image from "next/image";

type Props = {
  eyebrow?: string;
  title?: string;
  bodyHtml?: string;
  imageUrl?: string;
};

export default function HomeAbout({ eyebrow, title, bodyHtml, imageUrl }: Props) {
  // Hide the section entirely if it's effectively empty — admins haven't
  // filled it in yet. Lets us add the schema/UI without forcing a section.
  const hasContent = (title?.trim() || "") + (bodyHtml?.trim() || "") !== "";
  if (!hasContent) return null;

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          {eyebrow && (
            <p className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-3">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6 leading-tight">
              {title}
            </h2>
          )}
          {bodyHtml && (
            <div
              className="blog-prose"
              // Pre-sanitized in app/admin/pages/actions.ts on save.
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          )}
        </div>

        {imageUrl && (
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-emerald-950/10 ring-1 ring-emerald-950/5">
            <Image
              src={imageUrl}
              alt={title ?? "About Sajdah Academy"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
