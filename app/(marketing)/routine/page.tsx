import type { Metadata } from "next";
import Routine from "../../components/Routine";

const title = "Effective Routine — দিনের পূর্ণাঙ্গ রুটিন";
const description =
  "বৃহস্পতিবার মাগরিব থেকে শুক্রবার এশা পর্যন্ত — Sajdah Academy-এর Basic Course-1 রুটিন। ১৬.৩০ ঘণ্টা সর্বমোট, ৯.২০ ঘণ্টা ক্লাস।";

/* Only override title, description, canonical.
   openGraph + twitter (incl. image, locale, siteName) are inherited
   from the root layout — Next merges title/description automatically
   into og:title/og:description without needing explicit openGraph block.
   Overriding openGraph at the route level would REPLACE the parent's
   image and lose social-share previews. */
export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/routine/",
  },
};

export default function RoutinePage() {
  return (
    <main>
      <Routine />
    </main>
  );
}
