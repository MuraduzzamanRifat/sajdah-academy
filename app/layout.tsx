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

/* CSP must allow:
   - Supabase Storage hosts (images uploaded via the Pages CMS — testimonials,
     gallery, hero bg, logo, blog post images). Wildcard *.supabase.co
     covers any Supabase project.
   - Vercel Analytics + Speed Insights (vitals.vercel-insights.com,
     va.vercel-scripts.com).
   - YouTube (frame-src) for embedded videos via Tiptap.
   - Unsplash for default gallery placeholders. */
const CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "connect-src 'self' https://*.supabase.co https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
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
  "interest-cohort=()",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${inter.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
        <meta httpEquiv="Permissions-Policy" content={PERMISSIONS} />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200 selection:text-emerald-900">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
