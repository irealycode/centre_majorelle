# Design

Visual system for Centre Dentaire Majorelle. Companion to [PRODUCT.md](PRODUCT.md).

## Aesthetic lane

**Architectural calm, photograph-led — light as the material.**

Named references: Norm Architects and Vipp for the spatial restraint and the trust placed in a
single large photograph; Aesop for warm precision without ornament. Explicitly *not* the
editorial-typographic lane (display serif + mono labels + ruled columns) and *not* the SaaS-minimal
lane.

The structural motif is the clinic's own **light line**: the continuous LED strips in the ceiling,
the glow under the reception desk and the bench, the lit sign on the boulevard at night. On the page
this becomes a hairline that carries light — a scroll rail that fills, a header edge that ignites
past the fold, section seams that draw open. It is light, not a border: it glows, it has a warm
hue, and it is animated. It is used in four places only, never as column scaffolding.

## Color

**Strategy: Restrained.** Pure-white ground, near-black ink, Majorelle blue below 10% of surface but
spent decisively. Warm LED gold appears only as *light* (glow, gradients, rails) — never as a text
colour, never as "gold luxury".

The seed generator proposed a crimson anchor; it is overridden on identity grounds. The brand is
named for Majorelle blue, the existing street signage is already deep navy, and the user chose blue
as the accent. Identity-preservation wins over a greenfield seed.

Body ground is **pure `oklch(1 0 0)`** — deliberately not a warm off-white. The warmth in this brand
comes from the photographs and the LED glow, never from the surface.

```css
--bg:         oklch(1.000 0.000   0);  /* #ffffff — pure, no hidden warmth */
--surface:    oklch(0.968 0.004 262);  /* #f3f4f7 — panels, table stripes */
--surface-hi: oklch(0.940 0.007 262);  /* #e9ebf0 — pressed / hovered panels */
--line:       oklch(0.905 0.008 262);  /* #dde0e5 — hairlines, dividers */
--ink:        oklch(0.170 0.012 264);  /* #0d0f15 — body text */
--muted:      oklch(0.470 0.014 264);  /* #575b63 — secondary text */
--blue:       oklch(0.500 0.190 266);  /* #3056cd — Majorelle, fills + CTAs */
--blue-text:  oklch(0.450 0.185 266);  /* #2447ba — links, text-on-white only */
--blue-deep:  oklch(0.255 0.070 264);  /* #112144 — dark blue blocks */
--night:      oklch(0.185 0.045 264);  /* #081227 — footer, drenched sections */
--glow:       oklch(0.870 0.100  82);  /* #f5ce87 — LED light only, never text on white */
--ok:         oklch(0.560 0.130 155);  /* #1a8a51 — "ouvert maintenant" status */
```

### Verified contrast

Computed OKLCH → sRGB → WCAG, not estimated (`node tools/contrast.mjs`). Every pair passes:

| Pair | Ratio | Min |
| --- | --- | --- |
| ink on bg | 19.12 | 7 |
| ink on surface | 17.43 | 7 |
| muted on bg | 6.83 | 4.5 |
| muted on surface | 6.22 | 4.5 |
| blue-text on bg | 7.82 | 4.5 |
| bg on blue (filled button) | 6.29 | 4.5 |
| bg on night (footer) | 18.69 | 7 |
| glow on night | 12.54 | 4.5 |

White text on every saturated fill (Helmholtz-Kohlrausch); dark text only on `--surface` and paler.

## Typography

**One family: Readex Pro**, variable, weights 200–700, self-hosted woff2 (82 KB across three
subsets: latin, latin-ext, arabic).

Chosen by the procedure, not by reflex. Voice words were *luminous, precise, unhurried*. The reflex
picks (Inter, IBM Plex, a Playfair/Cormorant display serif) are all on the reject list and were
discarded. The binding constraint — one family that carries **both** French and Arabic with the same
voice — is what produced Readex Pro: it was designed for Arabic/Latin harmony, its Arabic is a
low-contrast Naskh with real quality rather than an afterthought, and its slightly narrow Latin
reads precise without reading clinical-cold.

No second family. Hierarchy comes from **weight + size + leading as a set**: ExtraLight 200 at
display sizes, Regular 400 for body, SemiBold 600 for actions and numerals. A single family with
committed weight contrast beats a timid display+body pair — and it keeps the Arabic tree
typographically identical to the French one.

The serif in the logo stays in the logo. The clinic supplied its real artwork, and `tools/logo.py`
cuts it into three pieces — monogram, MAJORELLE wordmark, and the stacked lockup — dropping the
“DENTAL CLINIC” and “by dr Zeguendry” lines. The header sets monogram and wordmark side by side
(the supplied lockup is stacked, and stacked in a 72px header would set the wordmark at a ~6px cap
height); the footer has the room for the lockup as drawn. The master is white-on-transparent, so
the ink and white versions are recoloured at build time — no runtime filter, no colour shift.

Icons split the same way: the real monogram at 192/512/apple-touch, a simplified solid tooth for
the favicon. The monogram is a hairline outline whose interior cannot be filled automatically
(the M's strokes partition it), and at 16px an outline that thin is mud.

```css
--font: 'Readex Pro', system-ui, -apple-system, 'Segoe UI', sans-serif;
```

### Scale — fluid, ratio ≈ 1.33

| Step | Size | Weight | Leading | Tracking |
| --- | --- | --- | --- | --- |
| `--t-display` | `clamp(2.6rem, 1.5rem + 4.4vw, 5.25rem)` | 200 | 1.02 | −0.035em |
| `--t-h2` | `clamp(1.95rem, 1.3rem + 2.4vw, 3.25rem)` | 250 | 1.08 | −0.025em |
| `--t-h3` | `clamp(1.4rem, 1.1rem + 1.1vw, 1.95rem)` | 400 | 1.2 | −0.015em |
| `--t-lead` | `clamp(1.1rem, 1rem + 0.5vw, 1.35rem)` | 300 | 1.6 | −0.005em |
| `--t-body` | `1.0625rem` | 400 | 1.68 | 0 |
| `--t-small` | `0.875rem` | 400 | 1.55 | 0.005em |

Tracking is size-specific — tight as type grows, near zero at body, slightly open below it. Floor is
−0.035em (above the −0.04em limit). Display ceiling 5.25rem (under the 6rem cap). Measure capped at
68ch. `text-wrap: balance` on h1–h3, `pretty` on prose.

Arabic overrides: line-height +0.12 throughout (tall ascenders/descenders), tracking forced to `0`
(Arabic must never be letter-spaced), display weight lifted 200 → 300 because Arabic strokes at 200
go too thin at small sizes.

## Layout

- Container `min(100% - 2*var(--gutter), 1240px)`; gutter `clamp(1.25rem, 4vw, 3rem)`.
- Section rhythm is deliberately uneven — `clamp(4.5rem, 9vw, 8rem)` default, tightened to
  `clamp(3rem, 5vw, 4.5rem)` where two sections belong together, opened to `clamp(7rem, 12vw, 11rem)`
  before the footer. Uniform vertical rhythm is what makes a page read as generated.
- Logical properties everywhere (`margin-inline`, `padding-block`, `inset-inline-start`) so the
  Arabic tree is a genuine RTL build with no mirrored stylesheet.
- **No card grid for services.** Services are hairline-separated rows in a two-column editorial
  split — the lead treatment gets a larger cell. Cards appear nowhere on the site.
- Breakpoint-free where possible: `repeat(auto-fit, minmax(…, 1fr))`, `flex-wrap`.

### z-index scale

```css
--z-rail: 5; --z-sticky: 40; --z-header: 50; --z-scrim: 60; --z-sheet: 70; --z-toast: 80;
```

## Motion

Scroll reveals use **ease-out-expo** `cubic-bezier(0.16, 1, 0.3, 1)`, 520–760ms, transform + opacity
+ clip only. No bounce, no elastic — the brand is unhurried.

Gesture-driven surfaces (the mobile nav sheet) use a critically-damped spring feel and enter/exit
along the **same path** (in from the inline-end, out to the inline-end), with `transform-origin`
anchored to the trigger.

Reveals are **enhancement over an already-visible default**: the hidden state is applied by script
only after `IntersectionObserver` is confirmed present, so a no-JS, headless, or crawler render ships
fully visible content. Each reveal is shaped to what it reveals — the services list staggers row by
row at 55ms, the hero photo arrives on a clip-path wipe, the light rail fills continuously with
scroll — rather than one uniform fade applied to every section.

Every animation has a `prefers-reduced-motion: reduce` branch: transforms and clips are dropped, the
rail stops travelling, reveals become instant.

## Components

| Component | Notes |
| --- | --- |
| Header | Translucent `backdrop-filter: blur(20px) saturate(180%)`; content scrolls under. Lit hairline bottom edge that ignites past 40px rather than a 1px border. Solid + bordered under `prefers-reduced-transparency` / `prefers-contrast: more`. |
| Call bar | Fixed bottom on ≤ 860px: Appeler · WhatsApp · Itinéraire. Lit top edge. Padded for `env(safe-area-inset-bottom)`. |
| Light rail | Fixed hairline on the inline-start edge ≥ 1100px, filling with scroll progress; a warm LED gradient, not a scrollbar. |
| Service row | Hairline-separated row, index + name + one-line description + duration. Hover lights the hairline. Never a card. |
| Hours table | Real `<table>`, tabular numerals, today's row highlighted, live "Ouvert / Fermé" computed client-side from the same data that feeds `openingHoursSpecification`. |
| FAQ | Native `<details>`/`<summary>` — works without JS, animated open via `grid-template-rows`. Mirrored into `FAQPage` JSON-LD. |
| Map | Click-to-load facade. No Google iframe until the visitor asks for it. |
| Photo slot | Honest placeholder: soft `--surface` panel, dimension label, replacement instruction. Used only where no real photo exists. |

## Imagery

Real clinic photography leads. `assets/img/` source of truth; build emits AVIF + WebP + JPEG at
640/1024/1600/2048 with `<picture>` and explicit `width`/`height` (no CLS).

| Slot | Status |
| --- | --- |
| Reception / hero | **Real** — `IMG_6985.PNG` |
| Exterior at night | **Real** — `IMG_6986.PNG` |
| Tétouan, the white city | Wikimedia Commons, © Ideophagous, CC BY-SA 4.0 — credited in footer |
| Dr. Zeguendry portrait | **Slot** — must be a real photo of the dentist |
| Treatment room, sterilisation, panoramic unit | **Slots** |

Alt text is voice, in the page's own language, and describes the room — not "dental clinic".
