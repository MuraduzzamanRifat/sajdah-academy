import Hero from "./components/Hero";
import PremiumExperience from "./components/PremiumExperience";
import Curriculum from "./components/Curriculum";
import CourseOutline from "./components/CourseOutline";
import Registration from "./components/Registration";

export default function Home() {
  return (
    <main>
      <Hero />
      <PremiumExperience />
      <Curriculum />
      <CourseOutline />
      <Registration />
    </main>
  );
}
