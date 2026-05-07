import Navbar from "../components/NavbarServer";
import Footer from "../components/Footer";
import ScrollProgress from "../components/ScrollProgress";
import StickyMobileCTA from "../components/StickyMobileCTA";
import Preloader from "../components/Preloader";
import { SITE_URL } from "../../lib/site-url";

/* Marketing surface chrome — Preloader, Navbar, Footer, StickyMobileCTA,
   ScrollProgress, and the EducationalOrganization JSON-LD. Lives here
   instead of root so the chrome is scoped to public pages only and
   doesn't leak into admin or student-dashboard. Static-rendering
   compatible (no host detection, no per-request data). */

const siteName = "Sajdah Academy";
const siteDesc =
  "দেশের সেরা প্রিমিয়াম রিসোর্টে সম্পূর্ণ ফিজিক্যাল ট্রেনিং ও পূর্ণাঙ্গ ইসলামিক জীবনব্যবস্থা গড়ার এক অনন্য উদ্যোগ।";
const siteUrl = SITE_URL;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${siteUrl}/#org`,
      name: siteName,
      url: siteUrl,
      description: siteDesc,
      address: {
        "@type": "PostalAddress",
        addressCountry: "BD",
        addressLocality: "Dhaka",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+880-180-55-65-444",
        contactType: "admissions",
        email: "info@sijdahacademy.com",
        availableLanguage: ["Bengali", "English"],
      },
    },
    {
      "@type": "Course",
      "@id": `${siteUrl}/#course`,
      name: "প্রিমিয়াম রিসোর্টে ফিজিক্যাল ক্লাস ও ট্রেনিং",
      description:
        "৬ মাসের পূর্ণাঙ্গ ফিজিক্যাল ইসলামিক কোর্স — তিনটি ধাপে: Foundation, Understanding, Transformation।",
      provider: { "@id": `${siteUrl}/#org` },
      educationalLevel: "Adult",
      inLanguage: "bn",
      timeRequired: "P6M",
      offers: {
        "@type": "Offer",
        price: "225000",
        priceCurrency: "BDT",
        category: "Tuition",
        availability: "https://schema.org/InStock",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Onsite",
        location: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "BD",
            addressLocality: "Gazipur",
          },
        },
      },
    },
  ],
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgress />
      <Navbar />
      {children}
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
