import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE = "https://muraduzzamanrifat.github.io/sajdah-academy";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const make = (path: string, pri: number, freq: MetadataRoute.Sitemap[number]["changeFrequency"]) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority: pri,
  });
  return [
    make("/", 1.0, "weekly"),
    make("/courses/", 0.9, "monthly"),
    make("/enroll/", 0.9, "monthly"),
    make("/about/", 0.7, "monthly"),
    make("/faculty/", 0.7, "monthly"),
    make("/routine/", 0.7, "monthly"),
    make("/faq/", 0.6, "monthly"),
    make("/contact/", 0.6, "monthly"),
    make("/privacy/", 0.3, "yearly"),
  ];
}
