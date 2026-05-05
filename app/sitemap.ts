import type { MetadataRoute } from "next";
import { modules } from "./data/modules";
import { posts } from "./data/posts";
import { SITE_URL } from "../lib/site-url";

export const dynamic = "force-static";

const SITE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const make = (
    path: string,
    pri: number,
    freq: MetadataRoute.Sitemap[number]["changeFrequency"]
  ): MetadataRoute.Sitemap[number] => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority: pri,
  });

  return [
    // Top-level
    make("/", 1.0, "weekly"),
    make("/courses/", 0.9, "monthly"),
    make("/enroll/", 0.9, "monthly"),
    make("/batches/", 0.9, "weekly"),
    make("/about/", 0.7, "monthly"),
    make("/faculty/", 0.7, "monthly"),
    make("/routine/", 0.7, "monthly"),
    make("/blog/", 0.7, "weekly"),
    make("/gallery/", 0.6, "monthly"),
    make("/donate/", 0.6, "monthly"),
    make("/faq/", 0.6, "monthly"),
    make("/contact/", 0.6, "monthly"),
    make("/press/", 0.4, "monthly"),
    make("/privacy/", 0.3, "yearly"),

    // Per-course detail pages
    ...modules.map((m) => make(`/courses/${m.slug}/`, 0.7, "monthly")),

    // Blog posts
    ...posts.map((p) => make(`/blog/${p.slug}/`, 0.6, "monthly")),
  ];
}
