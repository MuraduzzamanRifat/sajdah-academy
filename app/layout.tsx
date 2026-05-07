import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SITE_URL } from "../lib/site-url";

/* Root layout is intentionally MINIMAL and SYNC.
   - No host detection (would force every route dynamic).
   - No public chrome (Navbar/Footer/Preloader live in (marketing)/layout.tsx).
   - Admin and student-dashboard render their own chrome.
   - This layout only sets up the html/body shell, fonts, security
     metadata, and the bare site-wide <Metadata>. Everything else
     lives in nested layouts. */

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-hind",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const siteName = "Sajdah Academy";
const siteDesc =
  "দেশের সেরা প্রিমিয়াম রিসোর্টে সম্পূর্ণ ফিজিক্যাল ট্রেনিং ও পূর্ণাঙ্গ ইসলামিক জীবনব্যবস্থা গড়ার এক অনন্য উদ্যোগ।";
const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    canonical: "/",
    languages: {
      "bn-BD": "/",
      "x-default": "/",
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

/* CSP, HSTS, Permissions-Policy, X-Content-Type-Options, Referrer-Policy
   are now set as HTTP headers — CSP per request from middleware (with a
   nonce so script-src can use 'strict-dynamic' instead of 'unsafe-inline'),
   the rest as static headers in next.config.mjs. The previous meta-CSP
   block was removed because:
   - Header-delivered CSP supports frame-ancestors (meta cannot)
   - Per-request nonce requires a Set-Cookie-style header anyway
   - meta-CSP is parsed AFTER the document HEAD starts, so resources
     referenced in <head> bypass it. */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#022c22" },
    { media: "(prefers-color-scheme: dark)", color: "#022c22" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200 selection:text-emerald-900">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
