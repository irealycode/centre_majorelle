# Product

## Register

brand

## Users

Residents of Tétouan and the surrounding Rif coast (Martil, M'diq, Fnideq, Cabo Negro), plus
Moroccans abroad visiting family and Spanish/Ceuta day-visitors.

Their context when they arrive: **on a phone, often in pain or anxious, deciding in under a minute
whether to call.** A meaningful share searches in Arabic; the rest in French. Very few will read a
long page. Many are choosing a dentist for the first time and have no way to judge clinical quality,
so they judge the room, the equipment and the person.

The job to be done: *"Find a dentist in Tétouan I can trust, confirm they can handle what I need,
and reach them right now."*

Emotions the interface must produce, in order: **calm** (this is a clean, quiet, well-lit place),
**confidence** (the equipment and the training are real), **ease** (calling takes one tap).

## Product Purpose

A five-language-aware, phone-first brochure site for Centre Dentaire Majorelle, Boulevard
Mohammadia, Tétouan. Success is measured in one number: **tapped calls and WhatsApp threads.**
Everything else — schema markup, service pages, the Arabic tree — exists to put the clinic in front
of someone who is about to search, and then get them to the phone.

Secondary purpose: rank for the local intent set — `dentiste Tétouan`, `centre dentaire Tétouan`,
`implant dentaire Tétouan`, `طبيب أسنان تطوان`, `زراعة الأسنان تطوان` — and own the brand query
`Majorelle` in a city where the name already reads as Moroccan.

## Brand Personality

**Luminous · precise · unhurried.**

Voice: plain, warm, specific. Says what a treatment involves and how long it takes. Never
"transform your smile"; never exclamation marks; never a countdown or an artificial scarcity cue.
Prices and claims are stated only where they are true. In Arabic the register is the same —
Modern Standard, direct, non-florid — not a stiff transliteration of the French.

The clinic's own room is the brand: warm-white, marble, and continuous lines of LED light. The site
should feel like walking into that room.

## Anti-references

- **The generic dental template.** Stock smiling models, mint/teal gradients, "Votre plus beau
  sourire", three identical icon cards. This is the single most important thing to avoid; it is what
  every competing clinic in the region already looks like.
- **The cheap local-business site.** Clipart, drop shadows, five typefaces, a carousel nobody asked
  for, a phone number you have to hunt for.
- **The overdesigned agency site.** Scroll-jacking, ten seconds of animation before the content
  arrives, 12px grey type, a hamburger menu on desktop. Motion here serves reading, never itself.
- Also rejected: **editorial-magazine cosplay** (display-serif italic headlines, mono metadata
  labels, ruled columns). It is the current default "tasteful" look and it is not a clinic.

## Design Principles

1. **The phone number is the product.** It is reachable from every viewport position, in one tap,
   at all times. No design decision may push it below a fold or behind an interaction.
2. **Light is the material.** The clinic's signature is continuous LED light — the ceiling strips,
   the glow under the reception desk, the lit sign on the boulevard. The site's structure is drawn
   from that light, not from borders, cards, or decorative shapes.
3. **Show the actual room.** Real photographs of this clinic outrank any illustration, icon set, or
   stock image. Where a real photo is missing, ship an honest, obviously-intentional slot — never a
   stranger's face or a stock clinic standing in for theirs.
4. **Say the specific thing.** "Radiographie panoramique sur place, résultat immédiat" beats
   "technologie de pointe". Specificity is what builds trust when the reader cannot judge clinical
   skill.
5. **Arabic is a first-class tree, not a translation toggle.** Full RTL, its own URLs, its own
   metadata and schema, indexed in its own right.

## Accessibility & Inclusion

- **Target: WCAG 2.2 AA.** Body text ≥ 4.5:1 verified numerically against every surface it sits on
  (see DESIGN.md); non-text UI ≥ 3:1.
- Full keyboard operability with a visible, high-contrast focus ring. Skip link on every page.
- `prefers-reduced-motion` is honoured everywhere — every scroll reveal degrades to static, never to
  hidden. Content is visible by default; motion only enhances it.
- `prefers-reduced-transparency` and `prefers-contrast: more` supported on the translucent header.
- Real RTL (`dir="rtl"`, logical properties throughout), not a mirrored stylesheet.
- Assume a mid-range Android phone on 4G in Tétouan: self-hosted fonts, no framework, no third-party
  script on first load, maps loaded only on click.
- Patients may be older or in pain: large tap targets (≥ 44px), no timed interactions, no
  hover-only affordances.
