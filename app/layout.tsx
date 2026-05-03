import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";

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

export const metadata: Metadata = {
  title: "Sajdah Academy",
  description:
    "দেশের সেরা প্রিমিয়াম রিসোর্টে সম্পূর্ণ ফিজিক্যাল ট্রেনিং ও পূর্ণাঙ্গ ইসলামিক জীবনব্যবস্থা গড়ার এক অনন্য উদ্যোগ।",
};

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
        <ScrollProgress />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
