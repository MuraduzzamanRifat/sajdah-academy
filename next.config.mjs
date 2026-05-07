import path from "node:path";

/* The Vercel Supabase Marketplace integration injects SUPABASE_URL (no
   NEXT_PUBLIC_ prefix), but the JS SDK needs the URL in the browser bundle.
   Mirror it at build time so client components don't crash. */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";

/* Extract the Supabase Storage hostname so next/image can serve uploads
   from public buckets (blog-images, site-images). Falls back to a wildcard
   "*.supabase.co" so previews + branch deploys still work. */
const supabaseHost = (() => {
  try {
    return supabaseUrl ? new URL(supabaseUrl).hostname : "";
  } catch {
    return "";
  }
})();

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
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(supabaseHost ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }] : []),
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
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

  /* Browser cache + security headers.

     - /_next/static/*  →  immutable for a year (Next hashes the filename)
     - /_next/image     →  short cache; the upstream Supabase URL is what
                            actually changes when admins re-upload
     - /fonts/*, /sajdah-academy/*  →  long cache for static brand assets
     - everything else  →  baseline security headers (HSTS, X-Frame, etc.)

     CSP itself is set in middleware so we can mint a per-request nonce.
     This block sets the *static* security headers that don't need a nonce. */
  async headers() {
    const SECURITY_HEADERS = [
      /* HSTS — force HTTPS for 2 years, include subdomains, preload-eligible.
         Vercel already redirects http→https, but HSTS gates the redirect at
         the browser so a network attacker can't strip TLS on first hit. */
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      /* Defense in depth alongside CSP frame-ancestors. */
      { key: "X-Frame-Options", value: "DENY" },
      /* Defense in depth alongside CSP. */
      { key: "X-Content-Type-Options", value: "nosniff" },
      /* Modern referrer policy — mirror what app/layout.tsx sets via meta. */
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      /* Locks down powerful APIs (camera/mic/etc.) at the HTTP layer
         so a CSP regression doesn't open them. */
      {
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), geolocation=(), gyroscope=(), accelerometer=(), magnetometer=(), payment=(), usb=(), interest-cohort=()",
      },
    ];

    return [
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          { key: "Cache-Control", value: "public, max-age=60, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/sajdah-academy/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      /* Apply security headers to every other route. The catch-all matcher
         is last so per-path Cache-Control headers above take precedence on
         /_next/* paths. */
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
