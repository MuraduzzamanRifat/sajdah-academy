/* Declarative schema for which settings appear on each editable page.
   This is the single source of truth — when adding a new editable
   field on a public page: (a) seed default in 0003_default_settings.sql,
   (b) consume in the public component via getSetting(),
   (c) add an entry here so admins can edit it.

   FieldKind covers everything the admin can edit:
     string  — single-line input
     text    — multi-line textarea
     rich    — Tiptap WYSIWYG (stores HTML)
     number  — numeric input
     boolean — checkbox
     image   — file upload to Supabase Storage (stores URL)
     json    — raw JSON for power users (advanced)
     list    — repeating items with sub-fields (testimonials, FAQ, etc.) */

export type FieldKind =
  | "string"
  | "text"
  | "rich"
  | "number"
  | "boolean"
  | "image"
  | "json"
  | "list";

/* Sub-field types allowed inside a list item — kept narrower than
   top-level kinds because nested rich/list/json get unwieldy. */
export type ListItemKind = "string" | "text" | "image" | "number" | "boolean";

export type ListItemFieldDef = {
  key: string;       // sub-key within each item, e.g. "name"
  label: string;
  kind: ListItemKind;
  rows?: number;
  placeholder?: string;
};

export type FieldDef = {
  key: string;          // dotted setting key, e.g. "home.hero.title_bn"
  label: string;        // human label
  hint?: string;        // help text below input
  kind: FieldKind;      // input type
  rows?: number;        // for `text` and `json` textareas
  /* List-only: the shape of each item. Required when kind === "list". */
  itemFields?: ListItemFieldDef[];
  /* List-only: optional UI-friendly singular label, e.g. "টেস্টিমোনিয়াল" */
  itemLabel?: string;
  /* Image-only: aspect ratio hint shown next to the upload button. */
  aspect?: string;
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
      "ল্যান্ডিং পেজের সব প্রধান টেক্সট ও ইমেজ। সংরক্ষণের পর হোমপেজ স্বয়ংক্রিয়ভাবে আপডেট হবে।",
    groups: [
      {
        title: "Hero (প্রথম স্ক্রিন)",
        fields: [
          { key: "home.hero.eyebrow_bn", label: "Eyebrow / ব্যাজ টেক্সট", kind: "string" },
          { key: "home.hero.title_bn", label: "প্রধান শিরোনাম", kind: "string" },
          { key: "home.hero.subtitle_bn", label: "সাবটাইটেল", kind: "text", rows: 3 },
          {
            key: "home.hero.bg_image",
            label: "Hero ব্যাকগ্রাউন্ড ইমেজ",
            kind: "image",
            aspect: "16:9 — ১৯২০×১০৮০",
            hint: "খালি রাখলে ডিফল্ট WebGL hero দেখাবে।",
          },
          {
            key: "home.hero.badges",
            label: "তিনটি ফিচার ব্যাজ",
            kind: "list",
            itemLabel: "ব্যাজ",
            itemFields: [
              { key: "icon", label: "Icon (map / calendar / shield)", kind: "string", placeholder: "map" },
              { key: "text_bn", label: "টেক্সট", kind: "string", placeholder: "৪ দিন গাজীপুর রিট্রিট" },
            ],
          },
          { key: "home.hero.cta_primary_bn", label: "প্রাইমারি বাটন লেবেল", kind: "string" },
          { key: "home.hero.cta_primary_href", label: "প্রাইমারি বাটন লিংক", kind: "string" },
          { key: "home.hero.cta_secondary_bn", label: "সেকেন্ডারি বাটন লেবেল", kind: "string" },
          { key: "home.hero.cta_secondary_href", label: "সেকেন্ডারি বাটন লিংক", kind: "string" },
        ],
      },
      {
        title: "About সেকশন (হোমপেজে)",
        fields: [
          { key: "home.about.eyebrow_bn", label: "Eyebrow", kind: "string" },
          { key: "home.about.title_bn", label: "শিরোনাম", kind: "string" },
          {
            key: "home.about.body",
            label: "About টেক্সট",
            kind: "rich",
            hint: "Heading, list, link, image — সব formatting ব্যবহার করতে পারেন।",
          },
          { key: "home.about.image", label: "About সেকশনের ইমেজ", kind: "image", aspect: "4:3" },
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
        title: "Testimonials (ছাত্রদের অভিজ্ঞতা)",
        fields: [
          {
            key: "home.testimonials.title_bn",
            label: "সেকশন শিরোনাম",
            kind: "string",
          },
          {
            key: "home.testimonials.items",
            label: "Testimonial items",
            kind: "list",
            itemLabel: "টেস্টিমোনিয়াল",
            itemFields: [
              { key: "name", label: "নাম", kind: "string", placeholder: "মোহাম্মদ আবদুল্লাহ" },
              { key: "role", label: "ভূমিকা / ব্যাচ", kind: "string", placeholder: "ব্যাচ-৪ · ছাত্র" },
              { key: "quote_bn", label: "উদ্ধৃতি", kind: "text", rows: 3 },
              { key: "photo", label: "ছবি (অপশনাল)", kind: "image" },
            ],
          },
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
    description: "About পেজের সব টেক্সট ও ইমেজ",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "about.eyebrow", label: "Eyebrow", kind: "string" },
          { key: "about.title_bn", label: "শিরোনাম", kind: "string" },
          { key: "about.hero_image", label: "Hero ইমেজ", kind: "image", aspect: "16:9" },
        ],
      },
      {
        title: "Mission",
        fields: [
          { key: "about.mission_title_bn", label: "মিশন শিরোনাম", kind: "string" },
          {
            key: "about.mission_body",
            label: "মিশন টেক্সট",
            kind: "rich",
            hint: "Rich editor — heading, list, quote ব্যবহার করুন।",
          },
        ],
      },
      {
        title: "Vision",
        fields: [
          { key: "about.vision_title_bn", label: "ভিশন শিরোনাম", kind: "string" },
          { key: "about.vision_body", label: "ভিশন টেক্সট", kind: "rich" },
        ],
      },
    ],
  },
  {
    slug: "faculty",
    label: "শিক্ষকমণ্ডলী",
    labelEn: "Faculty",
    publicPath: "/faculty",
    description: "শিক্ষকদের তালিকা ও পরিচয়। ক্রম পরিবর্তন করতে drag/up-down ব্যবহার করুন।",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "faculty.eyebrow", label: "Eyebrow", kind: "string" },
          { key: "faculty.title_bn", label: "শিরোনাম", kind: "string" },
          { key: "faculty.subtitle_bn", label: "সাবটাইটেল", kind: "text", rows: 2 },
        ],
      },
      {
        title: "শিক্ষকগণ",
        fields: [
          {
            key: "faculty.members",
            label: "শিক্ষকদের তালিকা",
            kind: "list",
            itemLabel: "শিক্ষক",
            itemFields: [
              { key: "name_bn", label: "নাম (Bangla)", kind: "string" },
              { key: "name_en", label: "নাম (English)", kind: "string" },
              { key: "title_bn", label: "পদবী", kind: "string", placeholder: "প্রধান শিক্ষক" },
              { key: "specialty_bn", label: "বিশেষত্ব", kind: "string" },
              { key: "bio_bn", label: "সংক্ষিপ্ত পরিচয়", kind: "text", rows: 4 },
              { key: "photo", label: "ছবি", kind: "image", placeholder: "1:1 square" },
            ],
          },
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
    description: "প্রায়শই জিজ্ঞাসিত প্রশ্ন। ক্রম পরিবর্তন করতে item-এর up/down বাটন ব্যবহার করুন।",
    groups: [
      {
        title: "প্রশ্নোত্তর",
        fields: [
          {
            key: "faq.items",
            label: "FAQ items",
            kind: "list",
            itemLabel: "প্রশ্ন",
            itemFields: [
              { key: "q_bn", label: "প্রশ্ন", kind: "string" },
              { key: "a_bn", label: "উত্তর", kind: "text", rows: 4 },
            ],
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
    description: "সাইট-ব্যাপী মেটাডেটা, লোগো ও ব্র্যান্ডিং।",
    groups: [
      {
        title: "Identity",
        fields: [
          { key: "site.name", label: "সাইটের নাম (English)", kind: "string" },
          { key: "site.name_bn", label: "সাইটের নাম (Bangla)", kind: "string" },
          { key: "site.tagline_bn", label: "ট্যাগলাইন", kind: "string" },
          { key: "site.founded_year", label: "প্রতিষ্ঠা সাল", kind: "number" },
          { key: "site.logo", label: "লোগো", kind: "image", hint: "PNG/SVG · transparent background" },
          { key: "site.favicon", label: "Favicon", kind: "image", aspect: "1:1 — 256×256" },
          { key: "site.og_image", label: "Default OG share image", kind: "image", aspect: "1200×630" },
        ],
      },
      {
        title: "Footer",
        fields: [
          { key: "footer.tagline_bn", label: "Footer ট্যাগলাইন", kind: "string" },
          { key: "footer.copyright_bn", label: "Copyright টেক্সট", kind: "string" },
          {
            key: "footer.links",
            label: "Footer link columns",
            kind: "list",
            itemLabel: "Column",
            itemFields: [
              { key: "title_bn", label: "Column শিরোনাম", kind: "string" },
              { key: "links_json", label: "Links (এক লাইনে: লেবেল|URL)", kind: "text", rows: 5 },
            ],
            hint: 'প্রতি লাইনে একটি লিংক, যেমন: "ভর্তি|/enroll/"',
          },
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
