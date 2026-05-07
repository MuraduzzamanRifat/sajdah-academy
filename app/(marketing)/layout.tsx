import { headers } from "next/headers";
import Navbar from "../components/NavbarServer";
import Footer from "../components/Footer";
import ScrollProgress from "../components/ScrollProgress";
import StickyMobileCTA from "../components/StickyMobileCTA";
import Preloader from "../components/Preloader";
import LenisProvider from "../components/LenisProvider";
import { SITE_URL } from "../../lib/site-url";
import { getSettingsByPrefix, pick } from "../../lib/settings";

/* Marketing surface chrome — Preloader, Navbar, Footer, StickyMobileCTA,
   ScrollProgress, and the EducationalOrganization JSON-LD. Lives here
   instead of root so the chrome is scoped to public pages only and
   doesn't leak into admin or student-dashboard.

   Phone/email in the JSON-LD contactPoint are read from the
   `contact.*` site_settings bag so admins can update them via the
   Pages CMS without a code change. The settings reader is wrapped in
   React `cache()`, so Footer (which also reads contact.*) shares the
   same Supabase round-trip per request. */

const siteName = "Sajdah Academy";
const siteDesc =
  "দেশের সেরা প্রিমিয়াম রিসোর্টে সম্পূর্ণ ফিজিক্যাল ট্রেনিং ও পূর্ণাঙ্গ ইসলামিক জীবনব্যবস্থা গড়ার এক অনন্য উদ্যোগ।";
const siteUrl = SITE_URL;

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [contact, h] = await Promise.all([
    getSettingsByPrefix("contact."),
    headers(),
  ]);
  const phone = pick(contact, "contact.phone", "+880-180-55-65-444");
  const email = pick(contact, "contact.email_main", "info@sijdahacademy.com");
  /* CSP nonce minted by middleware. Inline JSON-LD <script> reads it
     so it survives the strict-dynamic CSP without unsafe-inline. */
  const nonce = h.get("x-csp-nonce") ?? undefined;

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
          telephone: phone,
          contactType: "admissions",
          email,
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

  return (
    <>
      <Preloader />
      <LenisProvider />
      <script
        type="application/ld+json"
        nonce={nonce}
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
