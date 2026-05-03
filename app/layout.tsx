import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import StickyMobileCTA from "./components/StickyMobileCTA";

// Self-host fonts via next/font — zero CLS, no render-blocking,
// automatic preload + display:swap, only weights actually used.
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const siteName = "Sajdah Academy";
const siteDesc =
  "দেশের সেরা প্রিমিয়াম রিসোর্টে সম্পূর্ণ ফিজিক্যাল ট্রেনিং ও পূর্ণাঙ্গ ইসলামিক জীবনব্যবস্থা গড়ার এক অনন্য উদ্যোগ।";
const siteHost = "https://muraduzzamanrifat.github.io"; // for metadataBase only
const siteUrl = `${siteHost}/sajdah-academy`; // for JSON-LD / sitemap

export const metadata: Metadata = {
  // metadataBase is the HOST only — Next prepends basePath itself,
  // otherwise auto-generated routes (opengraph-image, etc.) get path doubled.
  metadataBase: new URL(siteHost),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: siteDesc,
  applicationName: siteName,
  keywords: [
    "Sajdah Academy",
    "Islamic course Bangladesh",
    "ইসলামিক কোর্স",
    "ফিজিক্যাল ইসলামিক ট্রেনিং",
    "Quran Tajweed",
    "Tazkiyah",
    "Aqeedah",
    "Fiqh",
    "Seerah",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/sajdah-academy/",
    languages: {
      "bn-BD": "/sajdah-academy/",
      "x-default": "/sajdah-academy/",
    },
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: `${siteUrl}/`,
    siteName,
    title: siteName,
    description: siteDesc,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDesc,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  referrer: "strict-origin-when-cross-origin",
};

/* CSP — hardened for our static export. GitHub Pages can't set HTTP headers,
   so this lives in <meta http-equiv>. Notes:
   - 'unsafe-inline' for scripts is required by Next.js hydration data
     (cannot use nonces with static export — no per-request server).
   - 'unsafe-inline' for styles is required by framer-motion (inline style attrs).
   - Unsplash whitelisted for Premium Experience hero photos.
   - frame-ancestors / X-Frame-Options is header-only, can't be set on
     GH Pages — clickjacking risk not addressable on this hosting tier. */
const CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://images.unsplash.com",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const PERMISSIONS = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "gyroscope=()",
  "accelerometer=()",
  "magnetometer=()",
  "payment=()",
  "usb=()",
  "interest-cohort=()", // opt out of FLoC
].join(", ");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#022c22" },
    { media: "(prefers-color-scheme: dark)", color: "#022c22" },
  ],
};

/* JSON-LD: lets Google classify this site as an EducationalOrganization
   that runs a 6-month Course. Supports rich snippets in search results. */
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
        email: "sijdah.academybd@gmail.com",
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
        price: "15000",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${inter.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
        <meta httpEquiv="Permissions-Policy" content={PERMISSIONS} />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200 selection:text-emerald-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ScrollProgress />
        <Navbar />
        {children}
        <Footer />
        <StickyMobileCTA />
      </body>
    </html>
  );
}
