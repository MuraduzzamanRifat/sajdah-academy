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
      {
        title: "Registration সেকশন (homepage শেষ ব্লক)",
        fields: [
          { key: "home.registration.title_bn", label: "শিরোনাম", kind: "string" },
          { key: "home.registration.subtitle_bn", label: "সাবটাইটেল", kind: "text", rows: 2 },
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
            key: "about.mission_body_bn",
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
          { key: "about.vision_body_bn", label: "ভিশন টেক্সট", kind: "rich" },
        ],
      },
    ],
  },
  {
    slug: "faculty",
    label: "শিক্ষকমণ্ডলী (পেজ টেক্সট)",
    labelEn: "Faculty (page text)",
    publicPath: "/faculty",
    description:
      "Faculty পেজের শিরোনাম, সাবটাইটেল ও CTA টেক্সট। শিক্ষকদের প্রকৃত তালিকা ও বায়ো /dashboard/instructors/ থেকে যোগ/সম্পাদনা করুন।",
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
        title: "CTA নিচের সেকশন",
        fields: [
          { key: "faculty.cta_title_bn", label: "CTA শিরোনাম", kind: "string" },
          { key: "faculty.cta_body_bn", label: "CTA টেক্সট", kind: "text", rows: 2 },
          { key: "faculty.cta_button_bn", label: "বাটন লেবেল", kind: "string" },
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
    label: "সাইট পরিচয় ও Nav/Footer",
    labelEn: "Site / Nav / Footer",
    publicPath: "/",
    description:
      "সাইট-ব্যাপী মেটাডেটা, লোগো, navbar links, footer columns — সব পেজের chrome এখান থেকে নিয়ন্ত্রিত।",
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
        title: "Top Navigation (সব পেজের navbar)",
        fields: [
          {
            key: "nav.items",
            label: "Navbar links",
            kind: "list",
            itemLabel: "Link",
            itemFields: [
              { key: "label", label: "Label (English)", kind: "string", placeholder: "About" },
              { key: "label_bn", label: "Label (Bangla)", kind: "string", placeholder: "পরিচিতি" },
              { key: "href", label: "Path (URL)", kind: "string", placeholder: "/about/" },
            ],
            hint: "ক্রম পরিবর্তন করতে item-এর up/down বাটন ব্যবহার করুন।",
          },
          { key: "nav.cta_label", label: "CTA বাটন লেবেল", kind: "string" },
          { key: "nav.cta_href", label: "CTA বাটন লিংক", kind: "string" },
        ],
      },
      {
        title: "Footer",
        fields: [
          { key: "footer.tagline_bn", label: "Footer ট্যাগলাইন", kind: "string" },
          { key: "footer.copyright_bn", label: "Copyright টেক্সট", kind: "string" },
          {
            key: "footer.columns",
            label: "Footer link columns",
            kind: "list",
            itemLabel: "Column",
            itemFields: [
              { key: "title", label: "Column শিরোনাম (English)", kind: "string", placeholder: "Academy" },
              { key: "title_bn", label: "Column শিরোনাম (Bangla)", kind: "string", placeholder: "একাডেমি" },
              { key: "links_text", label: "Links — প্রতি লাইনে: লেবেল|URL", kind: "text", rows: 5 },
            ],
            hint: 'উদাহরণ: "About|/about/" — প্রতি লাইনে একটি লিংক।',
          },
          { key: "footer.broadcast_title_bn", label: "WhatsApp ব্রডকাস্ট কার্ড শিরোনাম", kind: "string" },
          { key: "footer.broadcast_body_bn", label: "WhatsApp কার্ড টেক্সট", kind: "text", rows: 2 },
          { key: "footer.broadcast_button_bn", label: "WhatsApp কার্ড বাটন", kind: "string" },
        ],
      },
    ],
  },
  {
    slug: "courses",
    label: "কোর্স পেজ",
    labelEn: "Courses page",
    publicPath: "/courses",
    description:
      "/courses পেজের চরম, প্রাইসিং tiers ও সেকশন শিরোনাম। মডিউল কার্ডসমূহ courses table থেকে আসে — /dashboard/courses/ দেখুন।",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "courses.eyebrow", label: "Eyebrow", kind: "string" },
          { key: "courses.title_bn", label: "শিরোনাম", kind: "string" },
          { key: "courses.subtitle_bn", label: "সাবটাইটেল", kind: "text", rows: 2 },
        ],
      },
      {
        title: "Pricing tiers (৩টি প্রোগ্রাম)",
        fields: [
          { key: "courses.tiers_eyebrow", label: "সেকশন Eyebrow", kind: "string" },
          { key: "courses.tiers_title_bn", label: "সেকশন শিরোনাম", kind: "string" },
          {
            key: "courses.tiers",
            label: "Tier cards",
            kind: "list",
            itemLabel: "Tier",
            itemFields: [
              { key: "name", label: "Name (English)", kind: "string", placeholder: "Foundation Program" },
              { key: "name_bn", label: "Name (Bangla)", kind: "string" },
              { key: "duration", label: "Duration", kind: "string", placeholder: "৬ মাস" },
              { key: "price", label: "Price", kind: "string", placeholder: "৳ ১,৫০,০০০" },
              { key: "desc", label: "এক লাইনের বর্ণনা", kind: "string" },
              { key: "features_text", label: "Features (প্রতি লাইনে একটি)", kind: "text", rows: 6 },
              { key: "highlight", label: "Most Popular highlight?", kind: "boolean" },
            ],
          },
        ],
      },
      {
        title: "Module grid heading",
        fields: [
          { key: "courses.modules_eyebrow", label: "Eyebrow", kind: "string" },
          { key: "courses.modules_title_bn", label: "শিরোনাম", kind: "string" },
        ],
      },
      {
        title: "Certification সেকশন",
        fields: [
          { key: "courses.cert_title_bn", label: "শিরোনাম", kind: "string" },
          { key: "courses.cert_body_bn", label: "টেক্সট", kind: "text", rows: 3 },
        ],
      },
    ],
  },
  {
    slug: "donate",
    label: "Donate পেজ",
    labelEn: "Donate page",
    publicPath: "/donate",
    description: "Sadaqah পেজ — impact tiers ও পেমেন্ট চ্যানেল।",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "donate.eyebrow", label: "Eyebrow", kind: "string" },
          { key: "donate.title_bn", label: "শিরোনাম", kind: "string" },
          { key: "donate.subtitle_bn", label: "সাবটাইটেল / কোটেশন", kind: "text", rows: 4 },
        ],
      },
      {
        title: "Impact tiers (যেভাবে সদকা কাজে লাগে)",
        fields: [
          { key: "donate.tiers_eyebrow", label: "Eyebrow", kind: "string" },
          { key: "donate.tiers_title_bn", label: "শিরোনাম", kind: "string" },
          {
            key: "donate.tiers",
            label: "Tier items",
            kind: "list",
            itemLabel: "Tier",
            itemFields: [
              { key: "amount", label: "পরিমাণ (টাকা)", kind: "string", placeholder: "৫,০০০" },
              { key: "label", label: "Label", kind: "string", placeholder: "Module Sponsor" },
              { key: "desc", label: "বর্ণনা", kind: "text", rows: 2 },
              { key: "icon", label: "Icon (heart / book / users / gift)", kind: "string", placeholder: "heart" },
            ],
          },
        ],
      },
      {
        title: "পেমেন্ট চ্যানেল",
        fields: [
          { key: "donate.channels_title_bn", label: "শিরোনাম", kind: "string" },
          { key: "donate.channels_subtitle_bn", label: "সাবটাইটেল", kind: "string" },
          {
            key: "donate.channels",
            label: "Channels",
            kind: "list",
            itemLabel: "Channel",
            itemFields: [
              { key: "name", label: "Name (bKash / Nagad / Bank ...)", kind: "string" },
              { key: "label", label: "Sub-label", kind: "string", placeholder: "Mobile Banking" },
              { key: "type", label: "Type", kind: "string", placeholder: "Personal" },
              { key: "number", label: "Number / A/C", kind: "string" },
              { key: "hint", label: "Hint টেক্সট", kind: "text", rows: 2 },
            ],
          },
          { key: "donate.channels_footer_bn", label: "নিচের টেক্সট", kind: "text", rows: 2 },
        ],
      },
      {
        title: "Recurring sponsorship CTA",
        fields: [
          { key: "donate.cta_title_bn", label: "শিরোনাম", kind: "string" },
          { key: "donate.cta_body_bn", label: "বডি", kind: "text", rows: 3 },
          { key: "donate.cta_button_bn", label: "বাটন", kind: "string" },
          { key: "donate.cta_href", label: "বাটন লিংক", kind: "string" },
        ],
      },
    ],
  },
  {
    slug: "gallery",
    label: "Gallery পেজ",
    labelEn: "Gallery page",
    publicPath: "/gallery",
    description: "ব্যাচের ছবি ও মুহূর্ত।",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "gallery.eyebrow", label: "Eyebrow", kind: "string" },
          { key: "gallery.title_bn", label: "শিরোনাম", kind: "string" },
          { key: "gallery.subtitle_bn", label: "সাবটাইটেল", kind: "text", rows: 2 },
        ],
      },
      {
        title: "ছবিসমূহ",
        fields: [
          {
            key: "gallery.photos",
            label: "ছবি গ্রিড",
            kind: "list",
            itemLabel: "ছবি",
            itemFields: [
              { key: "image", label: "ছবি", kind: "image" },
              { key: "alt", label: "Alt টেক্সট (accessibility)", kind: "string" },
              { key: "caption", label: "ক্যাপশন", kind: "string", placeholder: "ব্যাচ-৩ · গাজীপুর" },
            ],
          },
        ],
      },
      {
        title: "নিচের CTA",
        fields: [
          { key: "gallery.cta_title_bn", label: "শিরোনাম", kind: "string" },
          { key: "gallery.cta_body_bn", label: "বডি", kind: "text", rows: 2 },
          { key: "gallery.cta_button_bn", label: "বাটন", kind: "string" },
        ],
      },
    ],
  },
  {
    slug: "press",
    label: "Press / Media",
    labelEn: "Press",
    publicPath: "/press",
    description: "Press kit — fact sheet, brand assets, প্রেস রিলিজ।",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "press.eyebrow", label: "Eyebrow", kind: "string" },
          { key: "press.title_bn", label: "শিরোনাম", kind: "string" },
          { key: "press.subtitle_bn", label: "সাবটাইটেল", kind: "text", rows: 3 },
        ],
      },
      {
        title: "Boilerplate (About box)",
        fields: [
          { key: "press.about_title", label: "শিরোনাম", kind: "string" },
          { key: "press.about_body", label: "Boilerplate", kind: "rich" },
        ],
      },
      {
        title: "Quick facts",
        fields: [
          {
            key: "press.facts",
            label: "Facts",
            kind: "list",
            itemLabel: "Fact",
            itemFields: [
              { key: "label", label: "Label", kind: "string", placeholder: "Founded" },
              { key: "value", label: "Value", kind: "string", placeholder: "২০২৪" },
            ],
          },
        ],
      },
      {
        title: "প্রেস রিলিজসমূহ",
        fields: [
          {
            key: "press.releases",
            label: "Releases",
            kind: "list",
            itemLabel: "Release",
            itemFields: [
              { key: "date", label: "তারিখ", kind: "string", placeholder: "এপ্রিল ২০২৬" },
              { key: "title", label: "শিরোনাম", kind: "string" },
              { key: "summary", label: "সারাংশ", kind: "text", rows: 3 },
            ],
          },
        ],
      },
      {
        title: "Press contact",
        fields: [
          { key: "press.contact_title_bn", label: "শিরোনাম", kind: "string" },
          { key: "press.contact_body_bn", label: "বডি", kind: "text", rows: 2 },
          { key: "press.contact_email", label: "ইমেইল", kind: "string" },
          { key: "press.contact_phone", label: "ফোন", kind: "string" },
        ],
      },
    ],
  },
  {
    slug: "privacy",
    label: "Privacy & Terms",
    labelEn: "Privacy",
    publicPath: "/privacy",
    description:
      "Privacy Policy ও Terms — সম্পূর্ণ rich-text এডিটর ব্যবহার করুন। পরিবর্তনের পর last-updated তারিখও আপডেট করুন।",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "privacy.eyebrow", label: "Eyebrow", kind: "string" },
          { key: "privacy.title_bn", label: "শিরোনাম", kind: "string" },
          { key: "privacy.last_updated_bn", label: "Last updated টেক্সট", kind: "string", hint: "যেমন: সর্বশেষ আপডেট: মে ২০২৬" },
        ],
      },
      {
        title: "Privacy section",
        fields: [
          { key: "privacy.privacy_title_bn", label: "শিরোনাম", kind: "string" },
          { key: "privacy.privacy_body", label: "বডি (rich)", kind: "rich" },
        ],
      },
      {
        title: "Terms section",
        fields: [
          { key: "privacy.terms_title_bn", label: "শিরোনাম", kind: "string" },
          { key: "privacy.terms_body", label: "বডি (rich)", kind: "rich" },
        ],
      },
      {
        title: "Footer note",
        fields: [
          { key: "privacy.footer_email", label: "যোগাযোগ ইমেইল", kind: "string" },
        ],
      },
    ],
  },
  {
    slug: "routine",
    label: "Routine পেজ",
    labelEn: "Routine",
    publicPath: "/routine",
    description: "Routine পেজের শিরোনাম। বিস্তারিত schedule grid Routine component-এ আছে।",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "routine.eyebrow", label: "Eyebrow", kind: "string" },
          { key: "routine.title_bn", label: "শিরোনাম", kind: "string" },
          { key: "routine.subtitle_bn", label: "সাবটাইটেল", kind: "text", rows: 2 },
        ],
      },
    ],
  },
  {
    slug: "batches_list",
    label: "Batches list পেজ",
    labelEn: "Batches list",
    publicPath: "/batches",
    description:
      "/batches পেজের header. ব্যাচগুলো batches table থেকে আসে — /dashboard/batches/ দেখুন।",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "batches.eyebrow", label: "Eyebrow", kind: "string" },
          { key: "batches.title_bn", label: "শিরোনাম", kind: "string" },
          { key: "batches.subtitle_bn", label: "সাবটাইটেল", kind: "text", rows: 2 },
          { key: "batches.empty_text_bn", label: "কোনো ব্যাচ না থাকলে যে টেক্সট দেখাবে", kind: "string" },
        ],
      },
    ],
  },
  {
    slug: "blog_list",
    label: "Blog list পেজ",
    labelEn: "Blog list",
    publicPath: "/blog",
    description:
      "/blog list পেজের header. পোস্টসমূহ posts table থেকে আসে — /dashboard/blog/ দেখুন।",
    groups: [
      {
        title: "Header",
        fields: [
          { key: "blog.eyebrow", label: "Eyebrow", kind: "string" },
          { key: "blog.title_bn", label: "শিরোনাম", kind: "string" },
          { key: "blog.subtitle_bn", label: "সাবটাইটেল", kind: "text", rows: 2 },
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
