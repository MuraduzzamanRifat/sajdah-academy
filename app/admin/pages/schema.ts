/* Declarative schema for which settings appear on each editable page.
   This is the single source of truth — when adding a new editable
   field on a public page: (a) seed default in 0003_default_settings.sql,
   (b) consume in the public component via getSetting(),
   (c) add an entry here so admins can edit it. */

export type FieldKind = "string" | "text" | "number" | "boolean" | "json";

export type FieldDef = {
  key: string;          // dotted setting key, e.g. "home.hero.title_bn"
  label: string;        // human label
  hint?: string;        // help text below input
  kind: FieldKind;      // input type
  rows?: number;        // for `text` and `json` textareas
};

export type PageDef = {
  slug: string;         // URL slug for /admin/pages/<slug>/
  label: string;        // sidebar label
  labelEn: string;
  publicPath: string;   // e.g. "/" — for "view live" link
  description: string;  // help text at top of edit page
  groups: { title: string; fields: FieldDef[] }[];
};

export const PAGE_DEFS: PageDef[] = [
  {
    slug: "home",
    label: "হোমপেজ",
    labelEn: "Homepage",
    publicPath: "/",
    description:
      "ল্যান্ডিং পেজের সব প্রধান টেক্সট। সংরক্ষণের পর হোমপেজ স্বয়ংক্রিয়ভাবে আপডেট হবে।",
    groups: [
      {
        title: "Hero (প্রথম স্ক্রিন)",
        fields: [
          { key: "home.hero.eyebrow_bn", label: "Eyebrow / ব্যাজ টেক্সট", kind: "string" },
          { key: "home.hero.title_bn", label: "প্রধান শিরোনাম", kind: "string" },
          { key: "home.hero.subtitle_bn", label: "সাবটাইটেল", kind: "text", rows: 3 },
          {
            key: "home.hero.badges",
            label: "তিনটি ফিচার ব্যাজ (JSON array)",
            kind: "json",
            rows: 8,
            hint: 'প্রতিটি ব্যাজে: icon ("map", "calendar", "shield"), text_bn',
          },
          { key: "home.hero.cta_primary_bn", label: "প্রাইমারি বাটন লেবেল", kind: "string" },
          { key: "home.hero.cta_primary_href", label: "প্রাইমারি বাটন লিংক", kind: "string" },
          { key: "home.hero.cta_secondary_bn", label: "সেকেন্ডারি বাটন লেবেল", kind: "string" },
          { key: "home.hero.cta_secondary_href", label: "সেকেন্ডারি বাটন লিংক", kind: "string" },
        ],
      },
      {
        title: "Curriculum (পাঠ্যক্রম সেকশন)",
        fields: [
          { key: "home.curriculum.eyebrow", label: "Eyebrow", kind: "string" },
          { key: "home.curriculum.title_bn", label: "শিরোনাম", kind: "string" },
          { key: "home.curriculum.subtitle_bn", label: "সাবটাইটেল", kind: "string" },
        ],
      },
      {
        title: "CTA (নিচের সাইন-আপ সেকশন)",
        fields: [
          { key: "home.cta.title_bn", label: "শিরোনাম", kind: "string" },
          { key: "home.cta.subtitle_bn", label: "সাবটাইটেল", kind: "text", rows: 2 },
          { key: "home.cta.button_bn", label: "বাটন লেবেল", kind: "string" },
        ],
      },
    ],
  },
  {
    slug: "about",
    label: "আমাদের সম্পর্কে",
    labelEn: "About",
    publicPath: "/about",
    description: "About পেজের সব টেক্সট",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "about.eyebrow", label: "Eyebrow", kind: "string" },
          { key: "about.title_bn", label: "শিরোনাম", kind: "string" },
        ],
      },
      {
        title: "Mission",
        fields: [
          { key: "about.mission_title_bn", label: "মিশন শিরোনাম", kind: "string" },
          { key: "about.mission_body_bn", label: "মিশন টেক্সট", kind: "text", rows: 5 },
        ],
      },
      {
        title: "Vision",
        fields: [
          { key: "about.vision_title_bn", label: "ভিশন শিরোনাম", kind: "string" },
          { key: "about.vision_body_bn", label: "ভিশন টেক্সট", kind: "text", rows: 5 },
        ],
      },
    ],
  },
  {
    slug: "contact",
    label: "যোগাযোগ",
    labelEn: "Contact",
    publicPath: "/contact",
    description: "যোগাযোগের তথ্য — প্রতি পেজের ফুটারে এবং /contact এ ব্যবহৃত হয়।",
    groups: [
      {
        title: "প্রধান যোগাযোগ",
        fields: [
          { key: "contact.email_main", label: "প্রধান ইমেইল", kind: "string" },
          { key: "contact.email_admissions", label: "ভর্তি ইমেইল", kind: "string" },
          { key: "contact.phone", label: "ফোন", kind: "string" },
          { key: "contact.whatsapp", label: "WhatsApp", kind: "string" },
          { key: "contact.address_bn", label: "ঠিকানা", kind: "text", rows: 2 },
          { key: "contact.hours_bn", label: "অফিস সময়", kind: "string" },
        ],
      },
      {
        title: "সোশ্যাল মিডিয়া",
        fields: [
          { key: "contact.facebook", label: "Facebook URL", kind: "string" },
          { key: "contact.instagram", label: "Instagram URL", kind: "string" },
          { key: "contact.youtube", label: "YouTube URL", kind: "string" },
        ],
      },
    ],
  },
  {
    slug: "faq",
    label: "FAQ",
    labelEn: "FAQ",
    publicPath: "/faq",
    description: "প্রায়শই জিজ্ঞাসিত প্রশ্ন। অর্ডার পরিবর্তন হলে JSON-এ ক্রম ঠিক করুন।",
    groups: [
      {
        title: "প্রশ্নোত্তর",
        fields: [
          {
            key: "faq.items",
            label: "FAQ items (JSON array)",
            kind: "json",
            rows: 18,
            hint: 'প্রতিটি item: {"q_bn": "প্রশ্ন", "a_bn": "উত্তর"}',
          },
        ],
      },
    ],
  },
  {
    slug: "site",
    label: "সাইট পরিচয়",
    labelEn: "Site Identity",
    publicPath: "/",
    description: "সাইট-ব্যাপী মেটাডেটা ও ব্র্যান্ডিং।",
    groups: [
      {
        title: "Identity",
        fields: [
          { key: "site.name", label: "সাইটের নাম (English)", kind: "string" },
          { key: "site.name_bn", label: "সাইটের নাম (Bangla)", kind: "string" },
          { key: "site.tagline_bn", label: "ট্যাগলাইন", kind: "string" },
          { key: "site.founded_year", label: "প্রতিষ্ঠা সাল", kind: "number" },
        ],
      },
      {
        title: "Footer",
        fields: [
          { key: "footer.tagline_bn", label: "Footer ট্যাগলাইন", kind: "string" },
          { key: "footer.copyright_bn", label: "Copyright টেক্সট", kind: "string" },
        ],
      },
    ],
  },
  {
    slug: "admission",
    label: "ভর্তি ও মূল্য",
    labelEn: "Admission",
    publicPath: "/enroll",
    description: "কোর্স ফি, কিস্তি, ভর্তির শেষ তারিখ, পরবর্তী ব্যাচ।",
    groups: [
      {
        title: "মূল্য",
        fields: [
          { key: "admission.fee_total_bdt", label: "মোট ফি (৳)", kind: "number" },
          { key: "admission.fee_admission_bdt", label: "ভর্তি ফি (৳)", kind: "number" },
          { key: "admission.installments", label: "কিস্তির সংখ্যা", kind: "number" },
        ],
      },
      {
        title: "তারিখ",
        fields: [
          { key: "admission.closes_at", label: "ভর্তি বন্ধের তারিখ (YYYY-MM-DD)", kind: "string" },
          { key: "admission.next_batch_starts", label: "পরবর্তী ব্যাচ শুরু (YYYY-MM-DD)", kind: "string" },
          { key: "admission.is_open", label: "ভর্তি ফর্ম খোলা?", kind: "boolean" },
        ],
      },
    ],
  },
];

export function getPageDef(slug: string): PageDef | undefined {
  return PAGE_DEFS.find((p) => p.slug === slug);
}

export function allKeysFor(pageDef: PageDef): string[] {
  return pageDef.groups.flatMap((g) => g.fields.map((f) => f.key));
}
