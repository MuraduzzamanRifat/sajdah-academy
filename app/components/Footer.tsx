import Link from "next/link";
import { Tent, Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const sitemap = [
  {
    title: "Academy",
    titleBn: "একাডেমি",
    links: [
      { label: "About", href: "/about/" },
      { label: "Faculty", href: "/faculty/" },
      { label: "Routine", href: "/routine/" },
      { label: "FAQ", href: "/faq/" },
    ],
  },
  {
    title: "Courses",
    titleBn: "কোর্সসমূহ",
    links: [
      { label: "All Courses", href: "/courses/" },
      { label: "Basic Course-1", href: "/courses/#basic" },
      { label: "Foundation Program", href: "/courses/#foundation" },
      { label: "6-Month Program", href: "/courses/#full" },
    ],
  },
  {
    title: "Get in Touch",
    titleBn: "যোগাযোগ",
    links: [
      { label: "Contact", href: "/contact/" },
      { label: "Enroll Now", href: "/enroll/" },
      { label: "Privacy Policy", href: "/privacy/" },
      { label: "Terms", href: "/privacy/#terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-200 pt-16 pb-8 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-12">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <Tent className="w-8 h-8 text-amber-500" />
              <span className="text-2xl font-bold text-white">Sajdah Academy</span>
            </div>
            <p className="text-emerald-400 mb-6 max-w-sm leading-relaxed">
              ৬ মাসের ফিজিক্যাল ইসলামিক ট্রেনিং — দেশের সেরা প্রিমিয়াম রিসোর্টে।
              দ্বীনি জাগরণের একটি অনন্য উদ্যোগ।
            </p>

            <div className="space-y-3 text-sm">
              <a href="tel:+880180556544" className="flex items-center gap-3 hover:text-amber-400 transition-colors">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+880 180 55 65 444</span>
              </a>
              <a href="https://wa.me/880180556544" className="flex items-center gap-3 hover:text-amber-400 transition-colors">
                <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>WhatsApp: +880 180 55 65 444</span>
              </a>
              <a href="mailto:sijdah.academybd@gmail.com" className="flex items-center gap-3 hover:text-amber-400 transition-colors break-all">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>sijdah.academybd@gmail.com</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Sitemap columns */}
          <div className="lg:col-span-6 grid sm:grid-cols-3 gap-8">
            {sitemap.map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-bold mb-1 text-base">{col.title}</h4>
                <p className="text-emerald-500 text-xs mb-4">{col.titleBn}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
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
            ))}
          </div>

          {/* Newsletter / CTA block */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-4 text-base">পরবর্তী ব্যাচের আপডেট</h4>
            <p className="text-emerald-400 text-sm mb-4 leading-relaxed">
              নতুন ব্যাচের ঘোষণা পেতে আমাদের WhatsApp ব্রডকাস্টে যুক্ত হোন।
            </p>
            <a
              href="https://wa.me/880180556544"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Join Updates
            </a>
          </div>
        </div>

        <div className="border-t border-emerald-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-emerald-500">
          <p>© {new Date().getFullYear()} Sajdah Academy. All rights reserved.</p>
          <p className="font-medium tracking-wider uppercase">Built with تقوى</p>
        </div>
      </div>
    </footer>
  );
}
