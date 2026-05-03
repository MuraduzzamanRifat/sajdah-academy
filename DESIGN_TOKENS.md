# Sajdah Academy — Design Tokens

Single source of truth for every visual decision. Defined in
[`app/tokens.css`](./app/tokens.css), bridged to Tailwind v4 via
`@theme` in [`app/globals.css`](./app/globals.css).

## Color

### Brand
| Role | Token | Hex | Usage |
|---|---|---|---|
| Primary base | `--color-primary-500` | `#10b981` | Outcome chips, active tab |
| Primary deep | `--color-primary-950` | `#022c22` | Hero canvas, dark sections |
| Primary surface | `--color-primary-50` | `#ecfdf5` | Faint section bg |
| Accent base | `--color-accent-500` | `#f59e0b` | Primary CTAs (Register Now) |
| Accent highlight | `--color-accent-400` | `#fbbf24` | WebGL star emissive, icons |
| Accent glow | `--color-accent-200` | `#fde68a` | Particle dust, halos |

### Neutrals
| Role | Token | Hex |
|---|---|---|
| Canvas light | `--color-neutral-50` | `#f8fafc` |
| Body text | `--color-neutral-600` | `#475569` |
| Muted text | `--color-neutral-500` | `#64748b` |

### Semantic
| Token | Default |
|---|---|
| `--color-success-base` | emerald-500 |
| `--color-warning-base` | amber-500 |
| `--color-error-base` | `#ef4444` |
| `--color-info-base` | `#3b82f6` |

## Typography

Modular scale, ratio **1.25** (major third), 16px base.

| Token | Size | Use |
|---|---|---|
| `--text-xs` | 12 | Eyebrow labels |
| `--text-sm` | 14 | Captions, secondary |
| `--text-base` | 16 | Body |
| `--text-lg` | 18 | Lead paragraph |
| `--text-2xl` | 24 | Card heading |
| `--text-4xl` | 36 | Section heading (mobile) |
| `--text-5xl` | 48 | Section heading (desktop) |
| `--text-7xl` | 72 | Hero (lg+) |

**Fonts**
- Bangla / display: **Hind Siliguri** (300–700)
- English / UI: **Inter** (400–800)

## Spacing — 8pt grid

`--space-*` from `0` to `32`. Always prefer multiples of 4 (matches
Tailwind's `p-1 / p-2 / p-3 …`). Section vertical rhythm is
`py-20 / py-24` (= 80px / 96px).

## Radius

`xs 4 · sm 6 · md 8 · lg 12 · xl 16 · 2xl 20 · 3xl 24 · pill ∞`

Hero CTAs use `rounded-lg`. Cards use `rounded-2xl` / `rounded-3xl`.
Pills (chips, badges) use `rounded-full`.

## Elevation

| Token | Use |
|---|---|
| `shadow-elev-1` | Hairline lift on flat cards |
| `shadow-elev-2` | Default card on white bg |
| `shadow-elev-3` | Hover state, prominent card |
| `shadow-elev-4` | Modals, sticky tabs panel |
| `shadow-elev-5` | Hero overlays |
| `shadow-glow-amber` | Primary CTA aura |
| `shadow-glow-emerald` | WebGL halo, secondary glow |

All shadows are tinted with `rgba(2, 44, 34, …)` (emerald-950 base)
to keep depth on-brand instead of generic gray.

## Animation

| Token | Duration | Use |
|---|---|---|
| `--dur-instant` | 80ms | Tap feedback |
| `--dur-fast` | 150ms | Hover color shifts |
| `--dur-base` | 200ms | Buttons, focus rings |
| `--dur-slow` | 320ms | Card hover lift |
| `--dur-slower` | 500ms | Image zoom in card hover |
| `--dur-cinema` | 900ms | Hero text entrance |

| Easing | Formula |
|---|---|
| `--ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` (easeOutQuint) |
| `--ease-emphasized` | `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight overshoot) |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard) |

`prefers-reduced-motion: reduce` collapses all durations to 0ms in
`tokens.css`. No component needs to handle this individually.

## Z-index

`base 0 · raised 10 · dropdown 20 · sticky 30 · overlay 40 · modal 50 · toast 60`

Navbar uses `z-50` (matches sticky/modal — intentional, since it must
sit above the WebGL canvas which uses `z-10` overlays).

## Breakpoints

`sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`

Mobile-first; design audited at 375 / 768 / 1024 / 1440.

## Focus ring

```
ring-width: 4px
ring-color (accent CTA): rgba(252, 211, 77, 0.6)
ring-color (primary nav): rgba(110, 231, 183, 0.5)
```

Used as `focus-visible:ring-4 focus-visible:ring-amber-300/60`.

## Tailwind utility aliases generated

The `@theme` block in `globals.css` generates these utility classes:

| Class | Resolves to |
|---|---|
| `bg-surface-canvas` | `#f8fafc` |
| `bg-surface-canvas-strong` | `#022c22` |
| `bg-surface-card` | `#ffffff` |
| `text-text-strong` | `#022c22` |
| `text-text-body` | `#475569` |
| `text-text-muted` | `#64748b` |
| `border-border-subtle` | `#e2e8f0` |
| `shadow-elev-{1..5}` | tinted shadows |
| `shadow-glow-amber` | amber CTA aura |
| `shadow-glow-emerald` | emerald halo |

Existing Tailwind utilities (`bg-emerald-950`, `text-amber-500`, …) keep
working unchanged. Semantic aliases are additive.

## Anti-patterns

- ❌ Don't introduce new hues outside `primary` / `accent` / `neutral`
  scales. Brand identity = restrained palette.
- ❌ Don't hard-code colors with hex literals in component files —
  use Tailwind utilities or `var(--color-*)`.
- ❌ Don't override durations per component — let `tokens.css` enforce
  rhythm and `prefers-reduced-motion` consistently.
- ❌ Don't mix container max-widths. Sections use `max-w-7xl`
  (homepage), `max-w-5xl` (Routine), `max-w-4xl` (Registration).
