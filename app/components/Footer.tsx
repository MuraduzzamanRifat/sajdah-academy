import Link from "next/link";
import Image from "next/image";
import { Tent, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { getSettingsByPrefix, pick } from "../../lib/settings";

type FooterColumn = {
  title?: string;
  title_bn?: string;
  links_text?: string;
};

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Academy",
    title_bn: "একাডেমি",
    links_text: "About|/about/\nFaculty|/faculty/\nGallery|/gallery/\nPress & Media|/press/",
  },
  {
    title: "Programs",
    title_bn: "প্রোগ্রাম",
    links_text: "All Courses|/courses/\nUpcoming Batches|/batches/\nRoutine|/routine/\nFAQ|/faq/",
  },
  {
    title: "Resources",
    title_bn: "রিসোর্স",
    links_text:
      "Blog · Articles|/blog/\nStudent Portal Preview|/student-dashboard/\nSupport Us · Sadaqah|/donate/\nPrivacy Policy|/privacy/",
  },
];

/* Each line of links_text is "Label|URL". Empty/malformed lines drop. */
function parseLinks(text: string | undefined): { label: string; href: string }[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split("|").map((p) => p?.trim() ?? "");
      return label && href ? { label, href } : null;
    })
    .filter((x): x is { label: string; href: string } => x !== null);
}

export default async function Footer() {
  // Footer reads identity + contact + footer-specific settings, all in
  // one query (prefix '' would fetch every setting; we batch by prefix).
  const [contact, site, footerS] = await Promise.all([
    getSettingsByPrefix("contact."),
    getSettingsByPrefix("site."),
    getSettingsByPrefix("footer."),
  ]);

  const phone = pick(contact, "contact.phone", "+880 9696-SAJDAH");
  const whatsapp = pick(contact, "contact.whatsapp", "+880 17 2200 1100");
  const email = pick(contact, "contact.email_main", "info@sijdahacademy.com");
  const address = pick(contact, "contact.address_bn", "Dhaka, Bangladesh");
  const siteName = pick(site, "site.name", "Sajdah Academy");
  const logoUrl = pick(site, "site.logo", "");
  const tagline = pick(footerS, "footer.tagline_bn",
    "৬ মাসের ফিজিক্যাল ইসলামিক ট্রেনিং — দেশের সেরা প্রিমিয়াম রিসোর্টে।");
  const copyright = pick(footerS, "footer.copyright_bn",
    `© ${new Date().getFullYear()} Sajdah Academy. All rights reserved.`);
  const columns = pick<FooterColumn[]>(footerS, "footer.columns", DEFAULT_COLUMNS);
  const broadcastTitle = pick(footerS, "footer.broadcast_title_bn", "পরবর্তী ব্যাচের আপডেট");
  const broadcastBody = pick(
    footerS,
    "footer.broadcast_body_bn",
    "নতুন ব্যাচের ঘোষণা পেতে আমাদের WhatsApp ব্রডকাস্টে যুক্ত হোন।"
  );
  const broadcastButton = pick(footerS, "footer.broadcast_button_bn", "Join Updates");

  const phoneTel = phone.replace(/[^0-9+]/g, "");
  const waNumber = whatsapp.replace(/[^0-9]/g, "");

  const contactLinks = [
    { label: "Contact", href: "/contact/" },
    { label: "Enroll Now", href: "/enroll/" },
    { label: "WhatsApp", href: `https://wa.me/${waNumber}` },
    { label: "Email", href: `mailto:${email}` },
  ];

  return (
    <footer className="bg-emerald-950 text-emerald-200 pt-16 pb-8 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              {logoUrl ? (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                  <Image src={logoUrl} alt={siteName} fill sizes="40px" className="object-contain" />
                </div>
              ) : (
                <Tent className="w-8 h-8 text-amber-500" />
              )}
              <span className="text-2xl font-bold text-white">{siteName}</span>
            </div>
            <p className="text-emerald-400 mb-6 max-w-sm leading-relaxed whitespace-pre-line">
              {tagline}
            </p>

            <div className="space-y-3 text-sm">
              <a href={`tel:${phoneTel}`} className="flex items-center gap-3 hover:text-amber-400 transition-colors">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{phone}</span>
              </a>
              <a href={`https://wa.me/${waNumber}`} className="flex items-center gap-3 hover:text-amber-400 transition-colors">
                <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>WhatsApp: {whatsapp}</span>
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-3 hover:text-amber-400 transition-colors break-all">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{email}</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="whitespace-pre-line">{address}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {columns.map((col, i) => {
              const links = parseLinks(col.links_text);
              return (
                <div key={col.title ?? i}>
                  {col.title && <h4 className="text-white font-bold mb-1 text-base">{col.title}</h4>}
                  {col.title_bn && <p className="text-emerald-500 text-xs mb-4">{col.title_bn}</p>}
                  <ul className="space-y-2.5">
                    {links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="text-emerald-300 hover:text-amber-400 transition-colors text-sm"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <div>
              <h4 className="text-white font-bold mb-1 text-base">Get in Touch</h4>
              <p className="text-emerald-500 text-xs mb-4">যোগাযোগ</p>
              <ul className="space-y-2.5">
                {contactLinks.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-emerald-300 hover:text-amber-400 transition-colors text-sm">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-4 text-base">{broadcastTitle}</h4>
            <p className="text-emerald-400 text-sm mb-4 leading-relaxed">{broadcastBody}</p>
            <a
              href={`https://wa.me/${waNumber}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              {broadcastButton}
            </a>
          </div>
        </div>

        <div className="border-t border-emerald-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-emerald-500">
          <p>{copyright}</p>
          <p className="font-medium tracking-wider uppercase">Built with تقوى</p>
        </div>
      </div>
    </footer>
  );
}
