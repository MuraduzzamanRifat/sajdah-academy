# Sajdah Academy

Premium WebGL landing experience for an Islamic lifestyle academy.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · React Three Fiber · framer-motion · lucide-react

## Highlights

- **Cinematic WebGL hero** — animated 3D Islamic 8-point star, gold orbital rings, particle dust, mouse parallax. Powered by `@react-three/fiber` + `@react-three/drei`.
- **Smart device-tier rendering** — mobile and low-end devices get a CSS-only hero (zero Three.js JS, identical color story). Three.js loads only when viewport ≥ 768px AND device has > 4 GB RAM AND > 4 CPU cores AND user hasn't enabled Save-Data or Reduced-Motion.
- **Cinematic scroll choreography** — top progress bar (amber→emerald), scroll-tied hero exit (lift + fade), layered parallax depth on Premium Experience cards.
- **Bilingual typography** — Hind Siliguri (Bangla) + Inter (Latin), self-hosted via `next/font` for zero CLS.
- **Design tokens** — single source of truth in [`app/tokens.css`](app/tokens.css), bridged to Tailwind v4 via `@theme`. See [`DESIGN_TOKENS.md`](DESIGN_TOKENS.md).
- **Accessible** — focus rings on every interactive element, `prefers-reduced-motion` respected globally, 44+ px touch targets, semantic ARIA on tabs and forms.

## Run locally

```bash
npm install --legacy-peer-deps
npm run dev    # http://localhost:3001
```

## Build for GitHub Pages

```bash
npm run build  # outputs static site to ./out
```

The included GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) auto-builds on every push to `main` and deploys to GitHub Pages.

To enable Pages on a fresh fork:

1. Push to GitHub.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The next push to `main` deploys automatically. Site URL will be:
   `https://<your-username>.github.io/sajdah-academy/`

## Project structure

```
app/
├── layout.tsx           Root layout, fonts, metadata, viewport
├── page.tsx             Home (Hero + Premium + Curriculum + Outline + Registration)
├── routine/page.tsx     Routine timeline page
├── tokens.css           Design system source of truth
├── globals.css          Tailwind v4 + theme bridge
└── components/
    ├── Hero.tsx              Hero section + scroll choreography
    ├── HeroBackdrop.tsx      Smart switch between WebGL / CSS hero
    ├── HeroCanvas.tsx        R3F scene (gold star, orbits, particles)
    ├── ScrollProgress.tsx    Top scroll-progress bar
    ├── Navbar.tsx            Scroll-aware fixed navbar
    ├── Footer.tsx
    ├── PremiumExperience.tsx Resort amenity cards (parallax depth)
    ├── Curriculum.tsx        3 phases + core subjects grid
    ├── CourseOutline.tsx     12 module cards
    ├── Registration.tsx      Multi-step registration form
    └── Routine.tsx           Tabbed daily timeline
```

## Color palette (locked)

`#022c22` emerald-950 (canvas) · `#10b981` emerald-500 (success/active) · `#f59e0b` amber-500 (CTA) · `#fbbf24` amber-400 (accents) · `#f8fafc` slate-50 (light surface)

Defined in [`app/tokens.css`](app/tokens.css). Do not introduce new hues.
