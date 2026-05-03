/* basePath helper. Next.js with output:'export' + basePath + unoptimized
   images does NOT auto-prefix basePath to <Image src>. Use this for any
   static asset reference inside next/image or <img>. */
export const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/sajdah-academy" : "";

export function asset(path: string): string {
  if (!path.startsWith("/")) path = "/" + path;
  return `${BASE_PATH}${path}`;
}
