import type { MetadataRoute } from "next";
import { createClient } from "../lib/supabase/server";
import { SITE_URL } from "../lib/site-url";

/* Sitemap revalidates on the same window as the public pages
   themselves so it never lags behind the content it references. */
export const revalidate = 60;

const SITE = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const supabase = await createClient();
  const [coursesRes, postsRes] = await Promise.all([
    supabase.from("courses").select("slug, updated_at").eq("is_published", true),
    supabase.from("posts").select("slug, updated_at").eq("is_published", true),
  ]);

  return [
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

    ...(coursesRes.data ?? []).map((c) => ({
      url: `${SITE}/courses/${c.slug}/`,
      lastModified: c.updated_at ? new Date(c.updated_at as string) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...(postsRes.data ?? []).map((p) => ({
      url: `${SITE}/blog/${p.slug}/`,
      lastModified: p.updated_at ? new Date(p.updated_at as string) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
