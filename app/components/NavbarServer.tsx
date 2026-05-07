/* Server-side wrapper that fetches navbar settings once per request and
   feeds them to the client Navbar. Keeps the chrome layout async-friendly
   while letting the actual navbar stay a client component (needs scroll
   listener + mobile menu state). */

import { getSettingsByPrefix, pick } from "../../lib/settings";
import Navbar, { type NavItem } from "./Navbar";

const DEFAULT_ITEMS: NavItem[] = [
  { href: "/about/", label: "About", label_bn: "পরিচিতি" },
  { href: "/courses/", label: "Courses", label_bn: "কোর্সসমূহ" },
  { href: "/batches/", label: "Batches", label_bn: "ব্যাচসমূহ" },
  { href: "/faculty/", label: "Faculty", label_bn: "শিক্ষকমণ্ডলী" },
  { href: "/blog/", label: "Blog", label_bn: "আর্টিকেল" },
  { href: "/faq/", label: "FAQ", label_bn: "জিজ্ঞাসা" },
  { href: "/contact/", label: "Contact", label_bn: "যোগাযোগ" },
];

export default async function NavbarServer() {
  const [navS, siteS] = await Promise.all([
    getSettingsByPrefix("nav."),
    getSettingsByPrefix("site."),
  ]);

  const items = pick<NavItem[]>(navS, "nav.items", DEFAULT_ITEMS);
  const ctaLabel = pick(navS, "nav.cta_label", "Enroll Now");
  const ctaHref = pick(navS, "nav.cta_href", "/enroll/");
  const siteName = pick(siteS, "site.name", "Sajdah Academy");
  const logoUrl = pick(siteS, "site.logo", "");

  return (
    <Navbar
      items={items}
      ctaLabel={ctaLabel}
      ctaHref={ctaHref}
      siteName={siteName}
      logoUrl={logoUrl || undefined}
    />
  );
}
