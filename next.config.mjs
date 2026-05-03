import path from "node:path";

/** GitHub Pages serves under /<repo-name>/ — set basePath for prod builds.
 *  Local dev still runs at root. */
const isProd = process.env.NODE_ENV === "production";
const repoBase = "/sajdah-academy"; // matches the GitHub repo name

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // static HTML + assets → /out, deployable to GitHub Pages
  trailingSlash: true, // GH Pages prefers .../foo/ over .../foo
  basePath: isProd ? repoBase : undefined,
  assetPrefix: isProd ? repoBase : undefined,
  // Expose basePath to client/server code so we can build URLs without
  // hard-coding the repo name in multiple places (lib/asset.ts reads this).
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? repoBase : "",
  },
  outputFileTracingRoot: path.resolve("./"),
  compress: true,
  poweredByHeader: false,
  images: {
    // Static export can't run the image optimizer at runtime
    unoptimized: true,
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
};

export default nextConfig;
