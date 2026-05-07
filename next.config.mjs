import path from "node:path";

/* The Vercel Supabase Marketplace integration injects SUPABASE_URL (no
   NEXT_PUBLIC_ prefix), but the JS SDK needs the URL in the browser bundle.
   Mirror it at build time so client components don't crash. */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
  },
  outputFileTracingRoot: path.resolve("./"),
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 390, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
    "postprocessing",
  ],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  /* isomorphic-dompurify pulls in jsdom which is a heavy CommonJS module.
     Marking it external prevents Next from trying to bundle it for the
     Edge runtime + keeps static-generation happy on /404 and /blog/[slug]. */
  serverExternalPackages: ["isomorphic-dompurify", "jsdom"],
};

export default nextConfig;
