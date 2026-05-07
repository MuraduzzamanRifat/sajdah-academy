-- Sajdah Academy — default site settings
-- Seeds the existing hardcoded marketing copy into site_settings rows
-- so admins can edit each piece via /admin/pages/. Idempotent: ON
-- CONFLICT preserves admin edits when re-run.

insert into site_settings (key, value) values

-- ============================================================
-- HOMEPAGE — Hero section
-- ============================================================
('home.hero.eyebrow_bn', '"100% PHYSICAL SESSIONS AT PREMIUM RESORTS"'::jsonb),
('home.hero.title_bn',   '"সিজদাহ একাডেমি"'::jsonb),
('home.hero.subtitle_bn','"দেশের সেরা প্রিমিয়াম রিসোর্টে সম্পূর্ণ ফিজিক্যাল ট্রেনিং ও পূর্ণাঙ্গ ইসলামিক জীবনব্যবস্থা গড়ার এক অনন্য উদ্যোগ।"'::jsonb),
('home.hero.badges',     '[
  {"icon":"map","text_bn":"ফাইভ-স্টার সমতুল্য রিসোর্ট"},
  {"icon":"calendar","text_bn":"৬ মাসের ফিজিক্যাল কোর্স"},
  {"icon":"shield","text_bn":"প্রিমিয়াম লাইফস্টাইল"}
]'::jsonb),
('home.hero.cta_primary_bn',   '"রেজিস্ট্রেশন করুন"'::jsonb),
('home.hero.cta_primary_href', '"/#register"'::jsonb),
('home.hero.cta_secondary_bn', '"কোর্স মডিউল দেখুন"'::jsonb),
('home.hero.cta_secondary_href','"/#curriculum"'::jsonb),

-- ============================================================
-- HOMEPAGE — Curriculum section heading
-- ============================================================
('home.curriculum.eyebrow',   '"Curriculum · পাঠ্যক্রম"'::jsonb),
('home.curriculum.title_bn',  '"১২ মডিউল · ৩ ফেইজ"'::jsonb),
('home.curriculum.subtitle_bn','"৬ মাসের পরিক্রমা — ঈমান থেকে ইহসান পর্যন্ত"'::jsonb),

-- ============================================================
-- CONTACT INFO  (used by /contact, /admin/settings, footer)
-- ============================================================
('contact.email_main',   '"info@sijdahacademy.com"'::jsonb),
('contact.email_admissions','"admissions@sijdahacademy.com"'::jsonb),
('contact.phone',        '"+880 9696-SAJDAH"'::jsonb),
('contact.whatsapp',     '"+880 17 2200 1100"'::jsonb),
('contact.address_bn',   '"৩য় তলা, House 42, Road 11, Banani DOHS, Dhaka 1206, Bangladesh"'::jsonb),
('contact.hours_bn',     '"রবি–বৃহঃ · ১০ AM – ৭ PM"'::jsonb),
('contact.facebook',     '"https://facebook.com/sijdahacademy"'::jsonb),
('contact.instagram',    '"https://instagram.com/sijdahacademy"'::jsonb),
('contact.youtube',      '"https://youtube.com/@sijdahacademy"'::jsonb),

-- ============================================================
-- SITE IDENTITY  (used by metadata, footer tagline, OG tags)
-- ============================================================
('site.name',         '"Sajdah Academy"'::jsonb),
('site.name_bn',      '"সাজদাহ একাডেমি"'::jsonb),
('site.tagline_bn',   '"ফিতনার যুগে আল্লাহর দিকে দৌড়"'::jsonb),
('site.founded_year', '2024'::jsonb),

-- ============================================================
-- ADMISSION & PRICING  (used by /enroll, /courses pricing tiers,
-- /admin/settings → can be edited from there)
-- ============================================================
('admission.fee_total_bdt',     '225000'::jsonb),
('admission.fee_admission_bdt', '25000'::jsonb),
('admission.installments',      '4'::jsonb),
('admission.closes_at',         '"2026-05-15"'::jsonb),
('admission.next_batch_starts', '"2026-08-01"'::jsonb),
('admission.is_open',           'true'::jsonb),

-- ============================================================
-- FAQ  (full Q&A list — array of objects)
-- ============================================================
('faq.items', '[
  {"q_bn":"কোর্স কি অনলাইনে?","a_bn":"না — Sajdah Academy ১০০% ফিজিক্যাল প্রোগ্রাম। প্রতি মাসে ১-২ সপ্তাহান্ত প্রিমিয়াম রিসোর্টে অবস্থান, মেন্টরের সাথে সরাসরি যোগাযোগ।"},
  {"q_bn":"ভর্তির যোগ্যতা কী?","a_bn":"১৮+ মুসলিম, যেকোনো পেশা/পটভূমি। পূর্ব ইসলামিক শিক্ষা আবশ্যক নয় — বেসিক থেকে আমরা গড়ে তুলি।"},
  {"q_bn":"ভর্তি ফি কত?","a_bn":"৬ মাসের পূর্ণাঙ্গ প্রোগ্রাম: ৳ ২,২৫,০০০ (৪ কিস্তিতে পরিশোধযোগ্য)। আবাসন, খাবার, সব শিক্ষা উপকরণ অন্তর্ভুক্ত।"},
  {"q_bn":"আমার অফিস ছুটি দেবে?","a_bn":"ক্লাস হয় শুক্র-শনি এবং নির্দিষ্ট সপ্তাহান্তে — অধিকাংশ চাকরিজীবী ভাইদের জন্য কাজ ব্যাহত হয় না।"},
  {"q_bn":"মহিলাদের জন্য ব্যাচ আছে?","a_bn":"হ্যাঁ — পৃথক মহিলা ব্যাচ পরিকল্পিত। অগ্রাধিকার তালিকার জন্য ভর্তি ফর্ম পূরণ করুন।"},
  {"q_bn":"সার্টিফিকেট দেওয়া হয়?","a_bn":"৬ মাস সম্পন্ন করে মূল্যায়নে উত্তীর্ণ হলে আনুষ্ঠানিক Sajdah Academy সার্টিফিকেট ও আজীবন Alumni নেটওয়ার্ক অ্যাক্সেস।"},
  {"q_bn":"ক্লাসের সময়সূচি?","a_bn":"শুক্রবার তাহাজ্জুদ থেকে এশা — ৫টি ক্লাস + অবসর + নামাজ। বিস্তারিত /routine/ পেজে।"},
  {"q_bn":"কারা পড়ান?","a_bn":"অভিজ্ঞ আলিম, মুফতি ও PhD শিক্ষাবিদ। বিস্তারিত /faculty/ পেজে।"}
]'::jsonb),

-- ============================================================
-- ABOUT PAGE
-- ============================================================
('about.eyebrow',         '"About · আমাদের সম্পর্কে"'::jsonb),
('about.title_bn',         '"আমাদের গল্প"'::jsonb),
('about.mission_title_bn', '"আমাদের লক্ষ্য"'::jsonb),
('about.mission_body_bn',  '"ফিতনার এই যুগে এমন একটি প্রজন্ম গড়ে তোলা যারা শুধু দ্বীন জানে না — দ্বীন যাপন করে। অনলাইন কোর্সের ভিড়ে যা হারিয়ে গেছে: পরিবেশ, অভ্যাস, সংসর্গ — সেই তিনটি স্তম্ভে দাঁড়িয়ে চরিত্র গঠন।"'::jsonb),
('about.vision_title_bn',  '"ভবিষ্যৎ লক্ষ্য"'::jsonb),
('about.vision_body_bn',   '"আগামী ১০ বছরে এমন ১,০০০ আলিম-পেশাজীবী গড়ে তোলা — যারা নিজেদের ক্ষেত্রে পেশাদার, একই সাথে দ্বীনি জ্ঞান ও সালেহীন চরিত্রে পূর্ণ। ছড়িয়ে পড়বেন বিশ্বজুড়ে — দাওয়াত, শিক্ষা, ব্যবসা, রাষ্ট্রপরিচালনায়।"'::jsonb),

-- ============================================================
-- HOMEPAGE  Registration / CTA section
-- ============================================================
('home.cta.title_bn',    '"আজই আপনার যাত্রা শুরু করুন"'::jsonb),
('home.cta.subtitle_bn', '"পরবর্তী ব্যাচ আগস্ট ২০২৬ — শেষ আসন সীমিত। ১৫ মে এর আগে আবেদন করুন।"'::jsonb),
('home.cta.button_bn',   '"ভর্তির আবেদন"'::jsonb),

-- ============================================================
-- FOOTER
-- ============================================================
('footer.tagline_bn',  '"ফিতনার যুগে আল্লাহর দিকে দৌড়"'::jsonb),
('footer.copyright_bn','"© ২০২৬ সাজদাহ একাডেমি। সর্বস্বত্ব সংরক্ষিত।"'::jsonb)

on conflict (key) do nothing;

-- ============================================================
-- Verify with:
--   select count(*) from site_settings;  -- should be ~30+
-- ============================================================
