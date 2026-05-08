import type { Metadata } from "next";
import Routine from "../../components/Routine";
import { getSettingsByPrefix, pick } from "../../../lib/settings";

const title = "Effective Routine — দিনের পূর্ণাঙ্গ রুটিন";
const description =
  "বৃহস্পতিবার মাগরিব থেকে শুক্রবার এশা পর্যন্ত — Sajdah Academy-এর Basic Course-1 রুটিন। ১৬.৩০ ঘণ্টা সর্বমোট, ৯.২০ ঘণ্টা ক্লাস।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/routine/" },
};

export const revalidate = 300;

export default async function RoutinePage() {
  const s = await getSettingsByPrefix("routine.");
  const titleBn = pick(s, "routine.title_bn", "Effective Routine");
  const subtitleBn = pick(
    s,
    "routine.subtitle_bn",
    "বৃহস্পতিবার মাগরিব থেকে শুক্রবার এশা পর্যন্ত আমাদের একটি পূর্ণাঙ্গ দিনের রুটিন।"
  );
  return (
    <main>
      <Routine titleBn={titleBn} subtitleBn={subtitleBn} />
    </main>
  );
}
