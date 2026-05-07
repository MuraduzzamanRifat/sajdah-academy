import Hero, { type HeroTexts } from "../components/Hero";
import HomeAbout from "../components/HomeAbout";
import HomeTestimonials, { type Testimonial } from "../components/HomeTestimonials";
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

  const aboutEyebrow = pick(settings, "home.about.eyebrow_bn", "");
  const aboutTitle = pick(settings, "home.about.title_bn", "");
  const aboutBody = pick(settings, "home.about.body", "");
  const aboutImage = pick(settings, "home.about.image", "");

  const testimonialsTitle = pick(settings, "home.testimonials.title_bn", "ছাত্রদের অভিজ্ঞতা");
  const testimonialItems = pick<Testimonial[]>(settings, "home.testimonials.items", []);

  const curriculumTitle = pick(
    settings,
    "home.curriculum.title_bn",
    "একাডেমিক মডেল ও কারিকুলাম"
  );
  const curriculumSubtitle = pick(
    settings,
    "home.curriculum.subtitle_bn",
    "আমাদের ৬ মাসের কোর্সটি তিনটি ধাপে বিভক্ত, যা আপনাকে ধাপে ধাপে একজন আদর্শ মুসলিম হিসেবে গড়ে তুলতে সাহায্য করবে।"
  );

  const regTitle = pick(settings, "home.registration.title_bn", "অনলাইন রেজিস্ট্রেশন");
  const regSubtitle = pick(
    settings,
    "home.registration.subtitle_bn",
    "আপনার সিট বুকিং করতে নিচের ফর্মটি পূরণ করুন এবং পেমেন্ট সম্পন্ন করুন।"
  );

  /* Wrap each below-the-fold band in a `cv-section` div so the browser
     skips rendering work for sections that are off-screen. Hero stays
     bare so first paint is unaffected. The class is defined in
     globals.css as content-visibility: auto + contain-intrinsic-size. */
  return (
    <main>
      <Hero texts={heroTexts} />
      <div className="cv-section">
        <SectionBlend from="emerald-950" to="emerald-950" />
        <PremiumExperience />
        <HomeAbout
          eyebrow={aboutEyebrow}
          title={aboutTitle}
          bodyHtml={aboutBody}
          imageUrl={aboutImage || undefined}
        />
      </div>
      <div className="cv-section">
        <SectionBlend from="emerald-950" to="slate-50" />
        <Curriculum titleBn={curriculumTitle} subtitleBn={curriculumSubtitle} />
      </div>
      <div className="cv-section">
        <SectionBlend from="slate-50" to="emerald-50" />
        <CourseOutline />
        <HomeTestimonials title={testimonialsTitle} items={testimonialItems} />
      </div>
      <div className="cv-section">
        <SectionBlend from="emerald-50" to="emerald-900" />
        <Registration title={regTitle} subtitle={regSubtitle} />
      </div>
    </main>
  );
}
