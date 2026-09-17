/**
 * Single source of truth for every clinic fact on the site.
 * Change a value here and it updates the pages, the footer, the call buttons,
 * the JSON-LD, the sitemap and the "open now" widget at once.
 *
 * Every value marked TODO is a guess and must be replaced. See README.md.
 */

export const site = {
  // ── Identity ───────────────────────────────────────────────────────────
  name: 'Centre Dentaire Majorelle',
  nameAr: 'مركز طب الأسنان ماجوريل',
  shortName: 'Majorelle',
  tagline: 'Dental Clinic',
  dentist: 'Dr Zeguendry',              // read from the clinic's own logo artwork
  dentistAr: 'الدكتور زكندري',          // TODO confirm the Arabic spelling with the clinic
  dentistHonorific: 'Chirurgien-dentiste', // TODO confirm title / specialty

  // ── Contact ────────────────────────────────────────────────────────────
  phone: '+212668641489',              // from the street sign
  phoneDisplay: '06 68 64 14 89',
  phoneIntl: '+212 6 68 64 14 89',
  // Same number wrapped in Unicode bidi isolates (LRI … PDI). Use this one
  // whenever the number sits inside a sentence, so Arabic prose does not
  // reorder the digit groups into "89 14 64 68 06". The characters are
  // invisible and inert in French, and they survive into JSON-LD, which
  // markup-based isolation such as <bdi> cannot do.
  phoneText: '⁦' + '06 68 64 14 89' + '⁩',
  whatsapp: '212668641489',
  email: 'contact@centredentairemajorelle.ma', // TODO real address

  // ── Location ───────────────────────────────────────────────────────────
  street: 'Boulevard Mohammadia',      // TODO add the street number
  streetAr: 'شارع محمدية',
  city: 'Tétouan',
  cityAr: 'تطوان',
  postal: '93000',
  region: 'Tanger-Tétouan-Al Hoceïma',
  regionAr: 'طنجة تطوان الحسيمة',
  country: 'MA',
  countryName: 'Maroc',
  countryNameAr: 'المغرب',
  // Confirmed pin. Feeds the map embed, the directions link, the geo meta tags
  // and the GeoCoordinates in the structured data.
  lat: 35.57266669935874,
  lng: -5.352332776126964,

  // ── Web ────────────────────────────────────────────────────────────────
  // Scheme + host, no trailing slash. SITE_ORIGIN overrides it at build time,
  // which is how the GitHub Pages workflow injects the real published URL.
  origin: (process.env.SITE_ORIGIN || 'https://centredentairemajorelle.ma').replace(/\/+$/, ''), // TODO real domain

  // Optional — leave empty and they disappear from the footer and the schema.
  social: {
    facebook: '',                      // TODO e.g. https://www.facebook.com/…
    instagram: '',                     // TODO
    googleMaps: '',                    // TODO the clinic's Google Business Profile URL
  },

  // ── Opening hours ──────────────────────────────────────────────────────
  // 0 = Sunday … 6 = Saturday. Multiple intervals per day are supported.
  // TODO confirm every one of these against the real timetable.
  hours: {
    1: [['09:00', '13:00'], ['15:00', '19:30']],
    2: [['09:00', '13:00'], ['15:00', '19:30']],
    3: [['09:00', '13:00'], ['15:00', '19:30']],
    4: [['09:00', '13:00'], ['15:00', '19:30']],
    5: [['09:00', '13:00'], ['15:00', '19:30']],
    6: [['09:00', '14:00']],
    0: [],
  },

  // Towns the clinic actually draws patients from — feeds `areaServed`.
  areaServed: ['Tétouan', 'Martil', 'M’diq', 'Fnideq', 'Cabo Negro', 'Oued Laou'],

  languages: ['fr', 'ar'],             // TODO add 'es' if the team receives in Spanish
};

/** Locale metadata. `dir` drives the whole RTL build. */
export const locales = {
  fr: { code: 'fr', htmlLang: 'fr-MA', dir: 'ltr', label: 'Français', base: '' },
  ar: { code: 'ar', htmlLang: 'ar-MA', dir: 'rtl', label: 'العربية', base: '/ar' },
};

export const DEFAULT_LOCALE = 'fr';

/**
 * Page registry. Slugs are shared across locales on purpose: one URL shape,
 * one sitemap, and hreflang does the rest. `nav` pages appear in the header.
 */
export const pages = [
  { id: 'home',       slug: 'index.html',                 nav: false, priority: '1.0' },
  { id: 'soins',      slug: 'soins-dentaires.html',       nav: true,  priority: '0.9', service: true },
  { id: 'implants',   slug: 'implantologie.html',         nav: true,  priority: '0.9', service: true },
  { id: 'esthetique', slug: 'esthetique-dentaire.html',   nav: true,  priority: '0.9', service: true },
  { id: 'radiologie', slug: 'radiologie-dentaire.html',   nav: false, priority: '0.8', service: true },
  { id: 'urgences',   slug: 'urgences-dentaires.html',    nav: true,  priority: '0.9', service: true },
  { id: 'cabinet',    slug: 'le-cabinet.html',            nav: true,  priority: '0.8' },
  { id: 'contact',    slug: 'contact.html',               nav: true,  priority: '0.8' },
];

export const pageById = Object.fromEntries(pages.map((p) => [p.id, p]));

/**
 * Sub-directory the site is served from, without a trailing slash.
 *
 * Leave it empty for a custom domain or a GitHub user/organisation site
 * (`nom.github.io`). Set it to `/nom-du-depot` only for a GitHub *project*
 * site, where the URL is `nom.github.io/nom-du-depot/` — every internal link
 * and asset then gets that prefix. See README.md.
 *
 * The environment variable lets CI override it without editing this file:
 *   BASE_PATH=/centre-dentaire-majorelle node build.mjs
 */
export const basePath = (process.env.BASE_PATH ?? '').replace(/\/+$/, '');

// Fail loudly on a malformed value. On Windows, Git Bash silently rewrites
// `BASE_PATH=/mon-depot` into `C:/Program Files/Git/mon-depot`, which would
// otherwise produce a site where every link is broken. Use
// `MSYS_NO_PATHCONV=1 BASE_PATH=/mon-depot node build.mjs` there.
if (basePath && !/^\/[A-Za-z0-9._~-]+(\/[A-Za-z0-9._~-]+)*$/.test(basePath)) {
  throw new Error(
    `BASE_PATH must look like "/nom-du-depot", got "${basePath}".` +
      (basePath.includes(':') ? ' (Git Bash rewrote it — prefix the command with MSYS_NO_PATHCONV=1.)' : '')
  );
}

/** Absolute URL for a page in a locale. `index.html` collapses to a clean directory URL. */
export function url(localeCode, pageId) {
  const { base } = locales[localeCode];
  const { slug } = pageById[pageId];
  const path = slug === 'index.html' ? `${base}/` : `${base}/${slug}`;
  return site.origin + basePath + path;
}

/** Root-relative href, for use inside the markup. Carries the base path. */
export function href(localeCode, pageId) {
  return url(localeCode, pageId).slice(site.origin.length);
}

/**
 * Root-relative path to a file in `dist/`. Every `/assets/...`, `/favicon.ico`
 * and similar reference must go through this, or a project-site deployment
 * would 404 on all of them.
 */
export function asset(path) {
  return basePath + (path.startsWith('/') ? path : `/${path}`);
}

/** `tel:` / `https://wa.me/` targets, built once so they can never drift apart. */
export const telHref = `tel:${site.phone}`;
export const waHref = (text) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
export const mapsHref =
  site.social.googleMaps ||
  `https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`;
export const mapsEmbed =
  `https://www.google.com/maps?q=${site.lat},${site.lng}&hl=fr&z=17&output=embed`;
