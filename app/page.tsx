import Hero from "./components/Hero";
import PremiumExperience from "./components/PremiumExperience";
import Curriculum from "./components/Curriculum";
import CourseOutline from "./components/CourseOutline";
import Registration from "./components/Registration";
import Testimonials from "./components/Testimonials";
import SectionBlend from "./components/SectionBlend";

export default function Home() {
  return (
    <main>
      <Hero />
      <SectionBlend from="emerald-950" to="emerald-950" />
      <PremiumExperience />
      <SectionBlend from="emerald-950" to="slate-50" />
      <Curriculum />
      <SectionBlend from="slate-50" to="emerald-50" />
      <Testimonials />
      <SectionBlend from="emerald-50" to="emerald-50" />
      <CourseOutline />
      <SectionBlend from="emerald-50" to="emerald-900" />
      <Registration />
    </main>
  );
}
