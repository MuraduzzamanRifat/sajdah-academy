/* basePath helper. Next.js with output:'export' + basePath + unoptimized
   images does NOT auto-prefix basePath to <Image src>. Use this for any
   static asset reference inside next/image or <img>.
   Single source of truth = next.config.mjs `repoBase` → exported as
   process.env.NEXT_PUBLIC_BASE_PATH. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
