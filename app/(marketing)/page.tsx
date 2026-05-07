import Hero, { type HeroTexts } from "../components/Hero";
import PremiumExperience from "../components/PremiumExperience";
import Curriculum from "../components/Curriculum";
import CourseOutline from "../components/CourseOutline";
import Registration from "../components/Registration";
import SectionBlend from "../components/SectionBlend";
import { getSettingsByPrefix, pick } from "../../lib/settings";

/* Homepage is now driven by site_settings rows. ISR window is short
   so admin edits show up within ~minute even if revalidatePath misses
   a path. Public visitors still get a cached static-feeling response. */
export const revalidate = 60;

const DEFAULT_HERO: HeroTexts = {
  eyebrow_bn: "100% PHYSICAL SESSIONS AT PREMIUM RESORTS",
  title_bn: "সিজদাহ একাডেমি",
  subtitle_bn:
    "দেশের সেরা প্রিমিয়াম রিসোর্টে সম্পূর্ণ ফিজিক্যাল ট্রেনিং ও পূর্ণাঙ্গ ইসলামিক জীবনব্যবস্থা গড়ার এক অনন্য উদ্যোগ।",
  badges: [
    { icon: "map", text_bn: "ফাইভ-স্টার সমতুল্য রিসোর্ট" },
    { icon: "calendar", text_bn: "৬ মাসের ফিজিক্যাল কোর্স" },
    { icon: "shield", text_bn: "প্রিমিয়াম লাইফস্টাইল" },
  ],
  cta_primary_bn: "রেজিস্ট্রেশন করুন",
  cta_primary_href: "/#register",
  cta_secondary_bn: "কোর্স মডিউল দেখুন",
  cta_secondary_href: "/#curriculum",
};

export default async function Home() {
  const settings = await getSettingsByPrefix("home.");

  const heroTexts: HeroTexts = {
    eyebrow_bn: pick(settings, "home.hero.eyebrow_bn", DEFAULT_HERO.eyebrow_bn),
    title_bn: pick(settings, "home.hero.title_bn", DEFAULT_HERO.title_bn),
    subtitle_bn: pick(settings, "home.hero.subtitle_bn", DEFAULT_HERO.subtitle_bn),
    badges: pick(settings, "home.hero.badges", DEFAULT_HERO.badges),
    cta_primary_bn: pick(settings, "home.hero.cta_primary_bn", DEFAULT_HERO.cta_primary_bn),
    cta_primary_href: pick(settings, "home.hero.cta_primary_href", DEFAULT_HERO.cta_primary_href),
    cta_secondary_bn: pick(settings, "home.hero.cta_secondary_bn", DEFAULT_HERO.cta_secondary_bn),
    cta_secondary_href: pick(settings, "home.hero.cta_secondary_href", DEFAULT_HERO.cta_secondary_href),
  };

  return (
    <main>
      <Hero texts={heroTexts} />
      <SectionBlend from="emerald-950" to="emerald-950" />
      <PremiumExperience />
      <SectionBlend from="emerald-950" to="slate-50" />
      <Curriculum />
      <SectionBlend from="slate-50" to="emerald-50" />
      <CourseOutline />
      <SectionBlend from="emerald-50" to="emerald-900" />
      <Registration />
    </main>
  );
}
