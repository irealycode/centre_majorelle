import {
  site, locales, pages, pageById, href, url, asset, basePath,
  telHref, waHref, mapsHref, mapsEmbed,
} from './site.mjs';

/* ── helpers ──────────────────────────────────────────────────────────── */

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Escape for text nodes; keeps quotes readable in the source. */
const txt = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const nl2 = (s = '') => txt(s); // .display / .h2 keep newlines via `white-space: pre-line`

/* ── icons ────────────────────────────────────────────────────────────── */

export const icon = {
  tooth: (cls = 'brand__mark') => `<svg class="${cls}" viewBox="0 0 24 30" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 2.4C7.6 2.4 4 4.8 4 9.4c0 3.2.9 5 1.6 7.8.6 2.4.7 5.4 1 7.6.2 1.6.8 2.6 1.9 2.6 1.2 0 1.7-1.1 1.9-2.8.2-1.8.4-4 1.6-4s1.4 2.2 1.6 4c.2 1.7.7 2.8 1.9 2.8 1.1 0 1.7-1 1.9-2.6.3-2.2.4-5.2 1-7.6.7-2.8 1.6-4.6 1.6-7.8 0-4.6-3.6-7-8-7Z"/><path d="M8.9 15.4V9.8l3.1 3.5 3.1-3.5v5.6" stroke-linecap="round"/></svg>`,

  phone: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21.5 16.9v2.6a1.7 1.7 0 0 1-1.9 1.7 17 17 0 0 1-7.4-2.6 16.7 16.7 0 0 1-5.1-5.1A17 17 0 0 1 4.5 6a1.7 1.7 0 0 1 1.7-1.9h2.6a1.7 1.7 0 0 1 1.7 1.5c.1.8.3 1.7.6 2.5a1.7 1.7 0 0 1-.4 1.8l-1.1 1.1a13.7 13.7 0 0 0 5.1 5.1l1.1-1.1a1.7 1.7 0 0 1 1.8-.4c.8.3 1.6.5 2.5.6a1.7 1.7 0 0 1 1.4 1.7Z"/></svg>`,

  whatsapp: () => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.23-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.03 1.02-1.03 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.57-.35M12.05 21.8a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.89-9.89 9.89m8.42-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.24-6.16-3.48-8.4"/></svg>`,

  pin: (cls = '') => `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 10.3c0 5.4-8 12.2-8 12.2s-8-6.8-8-12.2a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10.2" r="2.8"/></svg>`,

  arrow: (cls = '') => `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M1 6h13M9.5 1.5 14 6l-4.5 4.5"/></svg>`,

  camera: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.2-2h8.2l1.2 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z"/><circle cx="12" cy="13" r="3.4"/></svg>`,
};

/* ── shared blocks ────────────────────────────────────────────────────── */

/**
 * Image manifest, produced by tools/images.py. The renderer reads it rather
 * than assuming a width set, so a srcset entry can never point at a file the
 * pipeline did not actually write.
 */
let IMAGES = {};
export function setImageManifest(m) {
  IMAGES = m || {};
}

/**
 * Responsive picture. AVIF → WebP → JPEG, with explicit width/height taken
 * from the manifest so the box is reserved before the bytes arrive (no CLS).
 */
export function picture({ name, alt, sizes, cls = '', priority = false }) {
  const entry = IMAGES[name];
  if (!entry) throw new Error(`No image "${name}" in manifest — run tools/images.py`);
  const { widths, w, h } = entry;
  const fallback = widths[widths.length - 1];
  const set = (ext) => widths.map((x) => `${asset('/assets/img/')}${name}-${x}.${ext} ${x}w`).join(', ');
  const load = priority
    ? ' fetchpriority="high" decoding="async"'
    : ' loading="lazy" decoding="async"';
  return `<picture>
      <source type="image/avif" srcset="${set('avif')}" sizes="${esc(sizes)}">
      <source type="image/webp" srcset="${set('webp')}" sizes="${esc(sizes)}">
      <img src="${asset(`/assets/img/${name}-${fallback}.jpg`)}" srcset="${set('jpg')}" sizes="${esc(sizes)}"
        alt="${esc(alt)}" width="${w}" height="${h}"${cls ? ` class="${cls}"` : ''}${load}>
    </picture>`;
}

/** Honest, obviously-intentional placeholder for a photo we do not have. */
export function slot(t, label, hint, portrait = false) {
  return `<div class="slot${portrait ? ' slot--portrait' : ''}">
      ${icon.camera()}
      <span class="slot__t">${txt(label)}</span>
      <span class="slot__d">${txt(hint)}</span>
    </div>`;
}

export function statusChip(t, cls = 'status') {
  return `<span class="${cls}" data-status data-open="false" hidden>
      <span class="status__dot" aria-hidden="true"></span>
      <span><span class="status__label" data-status-label></span><span class="muted"> · </span><span data-status-detail></span></span>
    </span>`;
}

export function callButtons(t, { size = '', primaryClass = 'btn--primary', ghostClass = 'btn--ghost' } = {}) {
  const lg = size === 'lg' ? ' btn--lg' : '';
  return `<div class="btn-row">
      <a class="btn ${primaryClass}${lg}" href="${telHref}">${icon.phone()}<span>${txt(t.ui.callLong)}</span></a>
      <a class="btn ${ghostClass}${lg}" href="${esc(waHref(t.ui.waMessage))}" rel="noopener">${icon.whatsapp()}<span>${txt(t.ui.whatsappLong)}</span></a>
    </div>`;
}

export function hoursTable(t, { night = false } = {}) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const rows = order.map((d) => {
    const intervals = site.hours[d] || [];
    const value = intervals.length
      ? intervals.map(([o, c]) => `${o} – ${c}`).join('<br>')
      : `<span class="hours__closed">${txt(t.ui.closed)}</span>`;
    return `<tr data-day="${d}"><th scope="row">${txt(t.days[d])}</th><td>${value}</td></tr>`;
  }).join('\n        ');
  return `<table class="hours${night ? ' hours--night' : ''}">
        <caption>${txt(t.ui.hoursTitle)}</caption>
        <tbody>
        ${rows}
        </tbody>
      </table>`;
}

export function faqBlock(t, items, heading) {
  const list = items.map((it) => `<details class="faq__item">
          <summary class="faq__q">${txt(it.q)}<span class="faq__icon" aria-hidden="true"></span></summary>
          <div class="faq__a"><p>${txt(it.a)}</p></div>
        </details>`).join('\n        ');
  return `<section class="section" aria-labelledby="faq-h">
      <div class="wrap">
        <h2 class="h2" id="faq-h" data-reveal="rise">${nl2(heading || t.ui.questions)}</h2>
        <div class="faq" style="margin-block-start:clamp(2rem,4vw,3rem)" data-reveal-group="45">
        ${list}
        </div>
      </div>
    </section>`;
}

function serviceRow(L, t, id, s) {
  const lead = id === 'implants' ? ' data-lead' : '';
  return `<a class="service" href="${href(L, id)}"${lead} data-reveal>
        <span class="service__name">${txt(s.name)}</span>
        <span class="service__desc">${txt(s.short)}</span>
        <span class="service__meta"><span>${txt(s.duration)}</span>${icon.arrow('service__arrow')}</span>
      </a>`;
}

export function serviceList(L, t) {
  const ids = ['soins', 'implants', 'esthetique', 'radiologie', 'urgences'];
  return `<div class="services" data-reveal-group="60">
      ${ids.map((id) => serviceRow(L, t, id, t.services[id])).join('\n      ')}
    </div>`;
}

function navLinks(L, t, cls) {
  return pages.filter((p) => p.nav).map((p) =>
    `<a class="${cls}" href="${href(L, p.id)}">${txt(t.nav[p.id])}${cls === 'sheet__link' ? icon.arrow() : ''}</a>`
  ).join('\n        ');
}

/**
 * The clinic's real logo artwork, cut by tools/logo.py.
 *
 * The header uses the monogram and the MAJORELLE wordmark side by side: the
 * supplied lockup is stacked, and stacked in a 72px header would set the
 * wordmark at about a 6px cap height. The footer has the vertical room, so it
 * gets the lockup as drawn.
 *
 * The monogram is decorative (`alt=""`); the wordmark carries the accessible
 * name, in the page's own language.
 */
function brand(L, t, tag = 'a', variant = 'inline') {
  const attrs = tag === 'a' ? ` href="${href(L, 'home')}"` : '';
  const name = L === 'ar' ? site.nameAr : site.name;
  const tone = variant === 'stacked' ? 'white' : 'ink';

  if (variant === 'stacked') {
    return `<${tag} class="brand brand--stacked"${attrs}>
        <img src="${asset(`/assets/img/logo-lockup-${tone}.png`)}" alt="${esc(name)}" width="720" height="392" loading="lazy" decoding="async">
      </${tag}>`;
  }

  return `<${tag} class="brand"${attrs}>
        <img class="brand__mark" src="${asset(`/assets/img/logo-mark-${tone}.png`)}" alt="" width="132" height="90" decoding="async">
        <img class="brand__word" src="${asset(`/assets/img/logo-wordmark-${tone}.png`)}" alt="${esc(name)}" width="660" height="89" decoding="async">
      </${tag}>`;
}

function header(L, t) {
  const other = L === 'fr' ? 'ar' : 'fr';
  return `<header class="header">
    <div class="wrap header__bar">
      ${brand(L, t)}
      <nav class="nav" aria-label="${esc(t.ui.menu)}">
        ${navLinks(L, t, 'nav__link')}
      </nav>
      <div class="header__actions">
        <a class="lang" href="${href(other, 'home')}" lang="${locales[other].code}" hreflang="${locales[other].htmlLang}" aria-label="${esc(t.ui.langSwitchLabel)}">${txt(t.ui.langSwitch)}</a>
        <a class="btn btn--primary header__call" href="${telHref}">${icon.phone()}<bdi class="num">${txt(site.phoneDisplay)}</bdi></a>
        <button class="burger" type="button" data-sheet-toggle aria-expanded="false" aria-controls="nav-sheet" aria-label="${esc(t.ui.openMenu)}">
          <span class="burger__box" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="scrim" data-scrim></div>
  <div class="sheet" id="nav-sheet" aria-hidden="true">
    <div class="sheet__head">
      ${brand(L, t, 'span')}
      <button class="burger" type="button" data-sheet-toggle aria-expanded="false" aria-controls="nav-sheet" aria-label="${esc(t.ui.close)}">
        <span class="burger__box" aria-hidden="true"><span></span><span></span><span></span></span>
      </button>
    </div>
    <nav class="sheet__nav" aria-label="${esc(t.ui.menu)}">
      ${navLinks(L, t, 'sheet__link')}
    </nav>
    <div class="sheet__foot">
      ${statusChip(t)}
      <a class="btn btn--primary btn--block" href="${telHref}">${icon.phone()}<bdi class="num">${txt(site.phoneDisplay)}</bdi></a>
      <a class="btn btn--ghost btn--block" href="${esc(waHref(t.ui.waMessage))}" rel="noopener">${icon.whatsapp()}<span>${txt(t.ui.whatsapp)}</span></a>
    </div>
  </div>`;
}

function footer(L, t) {
  const other = L === 'fr' ? 'ar' : 'fr';
  const serviceIds = ['soins', 'implants', 'esthetique', 'radiologie', 'urgences'];
  const socials = Object.entries(site.social).filter(([k, v]) => v && k !== 'googleMaps');
  return `<footer class="footer">
      <div class="wrap">
        <div class="footer__grid">
          <div class="footer__brand">
            ${brand(L, t, 'span', 'stacked')}
            <p class="footer__blurb">${txt(t.footer.blurb)}</p>
          </div>

          <nav aria-labelledby="f-serv">
            <h2 class="footer__t" id="f-serv">${txt(t.footer.servicesTitle)}</h2>
            <ul class="footer__list">
              ${serviceIds.map((id) => `<li><a href="${href(L, id)}">${txt(t.services[id].name)}</a></li>`).join('\n              ')}
            </ul>
          </nav>

          <nav aria-labelledby="f-clinic">
            <h2 class="footer__t" id="f-clinic">${txt(t.footer.clinicTitle)}</h2>
            <ul class="footer__list">
              <li><a href="${href(L, 'contact')}">${txt(t.nav.contact)}</a></li>
              <li><a href="${href(other, 'home')}" hreflang="${locales[other].htmlLang}">${txt(t.ui.langSwitch)}</a></li>
              ${socials.map(([k, v]) => `<li><a href="${esc(v)}" rel="noopener">${k[0].toUpperCase() + k.slice(1)}</a></li>`).join('\n              ')}
            </ul>
          </nav>

          <div>
            <h2 class="footer__t">${txt(t.footer.contactTitle)}</h2>
            <ul class="footer__list">
              <li><a class="num" href="${telHref}"><bdi>${txt(site.phoneDisplay)}</bdi></a></li>
              <li><a href="${esc(waHref(t.ui.waMessage))}" rel="noopener">${txt(t.ui.whatsapp)}</a></li>
              <li><a href="mailto:${esc(site.email)}">${txt(site.email)}</a></li>
              <li><a href="${esc(mapsHref)}" rel="noopener">${txt(L === 'ar' ? site.streetAr : site.street)}<br>${txt(L === 'ar' ? site.cityAr : site.city)} ${txt(site.postal)}</a></li>
            </ul>
          </div>
        </div>

        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} ${txt(L === 'ar' ? site.nameAr : site.name)}. ${txt(t.footer.legal)}</span>
          <span>${txt(t.footer.disclaimer)}</span>
          <span>${txt(t.footer.credits)}</span>
        </div>
      </div>
    </footer>`;
}

function callbar(L, t) {
  return `<nav class="callbar" aria-label="${esc(t.ui.call)}">
    <a class="callbar__btn callbar__btn--primary" href="${telHref}">${icon.phone()}<span>${txt(t.ui.call)}</span></a>
    <a class="callbar__btn" href="${esc(waHref(t.ui.waMessage))}" rel="noopener">${icon.whatsapp()}<span>${txt(t.ui.whatsapp)}</span></a>
    <a class="callbar__btn" href="${esc(mapsHref)}" rel="noopener">${icon.pin()}<span>${txt(t.ui.directions)}</span></a>
  </nav>`;
}

export function crumbs(L, t, trail) {
  return `<nav aria-label="${esc(t.ui.breadcrumb)}"><ol class="crumbs">
      ${trail.map((c, i) => `<li>${i < trail.length - 1 ? `<a href="${c.path}">${txt(c.name)}</a>` : `<span aria-current="page">${txt(c.name)}</span>`}</li>`).join('\n      ')}
    </ol></nav>`;
}

/* ── document shell ───────────────────────────────────────────────────── */

export function layout(L, t, { pageId, title, description, schema, main, ogImage = 'og' }) {
  // The Contact page already carries a full hours table in its own content;
  // repeating it in the closing CTA would duplicate it on the same page.
  const ctaAside = pageId === 'contact' ? 'address' : 'hours';
  const loc = locales[L];
  const canonical = url(L, pageId);
  const og = `${site.origin}${asset(`/assets/img/${ogImage}.jpg`)}`;
  const clinicData = JSON.stringify({
    tz: 'Africa/Casablanca',
    hours: site.hours,
    strings: {
      open: t.ui.open, closed: t.ui.closed,
      closesAt: t.ui.closesAt, opensAt: t.ui.opensAt, opensDay: t.ui.opensDay,
      days: t.days,
    },
  }).replace(/</g, '\\u003c');

  const alternates = Object.keys(locales).map((code) =>
    `<link rel="alternate" hreflang="${locales[code].htmlLang}" href="${url(code, pageId)}">`
  ).join('\n  ');

  const preloadAr = L === 'ar'
    ? `\n  <link rel="preload" href="${asset('/assets/fonts/readexpro-arabic.woff2')}" as="font" type="font/woff2" crossorigin>`
    : '';

  return `<!doctype html>
<html lang="${loc.htmlLang}" dir="${loc.dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  ${alternates}
  <link rel="alternate" hreflang="x-default" href="${url('fr', pageId)}">

  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="format-detection" content="telephone=yes">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="geo.region" content="MA-TNG">
  <meta name="geo.placename" content="${esc(site.city)}">
  <meta name="geo.position" content="${site.lat};${site.lng}">
  <meta name="ICBM" content="${site.lat}, ${site.lng}">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(L === 'ar' ? site.nameAr : site.name)}">
  <meta property="og:locale" content="${loc.htmlLang.replace('-', '_')}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${og}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(t.home.heroAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${og}">

  <link rel="preload" href="${asset('/assets/fonts/readexpro-latin.woff2')}" as="font" type="font/woff2" crossorigin>${preloadAr}
  <link rel="stylesheet" href="${asset('/assets/css/site.css')}">

  <link rel="icon" href="${asset('/favicon.ico')}" sizes="32x32">
  <link rel="apple-touch-icon" href="${asset('/apple-touch-icon.png')}">
  <link rel="manifest" href="${asset('/site.webmanifest')}">

  <script type="application/ld+json">${schema}</script>
</head>
<body>
  <a class="skip" href="#main">${txt(t.ui.skip)}</a>
  <div class="rail" aria-hidden="true"><div class="rail__fill"></div></div>

  ${header(L, t)}

  <main id="main">
${main}
  </main>

  <div class="night">
${ctaSection(L, t, ctaAside)}
${mapBand(L, t)}
${footer(L, t)}
  </div>

  ${callbar(L, t)}

  <script type="application/json" id="clinic-data">${clinicData}</script>
  <script src="${asset('/assets/js/site.js')}" defer></script>
</body>
</html>
`;
}

/**
 * Full-bleed map, last thing before the footer on every page. Same
 * click-to-load facade as elsewhere: nothing reaches Google until the visitor
 * asks for it. Styled dark so it belongs to the night block it sits in.
 */
function mapBand(L, t) {
  const address = `${L === 'ar' ? site.streetAr : site.street}, ${L === 'ar' ? site.cityAr : site.city} ${site.postal}`;
  return `    <section class="map map--band" data-map="${esc(mapsEmbed)}" data-map-title="${esc(t.ui.mapTitle)}" aria-label="${esc(t.ui.mapTitle)}">
      <button class="map__facade map__facade--night" type="button" data-map-load>
        ${icon.pin('map__pin')}
        <span class="h4">${txt(t.ui.loadMap)}</span>
        <span class="map__address">${txt(address)}</span>
        <span class="map__hint">${txt(t.ui.loadMapHint)}</span>
      </button>
    </section>`;
}

function ctaSection(L, t, aside = 'hours') {
  return `    <section class="section section--wide" aria-labelledby="cta-h">
      <div class="wrap">
        <div class="cta__grid">
          <div data-reveal="rise">
            <h2 class="h2" id="cta-h">${nl2(t.home.cta.h2)}</h2>
            <p class="lead" style="margin-block-start:1.25rem">${txt(t.home.cta.body)}</p>
            <a class="cta__phone num" href="${telHref}" dir="ltr" style="margin-block-start:1.75rem">${icon.phone()}<bdi>${txt(site.phoneDisplay)}</bdi></a>
            <div style="margin-block-start:1.75rem">${callButtons(t, { primaryClass: 'btn--primary', ghostClass: 'btn--onnight' })}</div>
            <div style="margin-block-start:1.5rem">${statusChip(t)}</div>
          </div>
          <div data-reveal>
            ${aside === 'hours' ? `${hoursTable(t, { night: true })}
            <p class="micro" style="margin-block-start:1.25rem;color:oklch(0.72 0.02 264)">
              <a href="${esc(mapsHref)}" rel="noopener">${txt(L === 'ar' ? site.streetAr : site.street)}, ${txt(L === 'ar' ? site.cityAr : site.city)}</a>
            </p>` : `<p class="h3" style="font-weight:250">${txt(L === 'ar' ? site.streetAr : site.street)}<br>${txt(L === 'ar' ? site.cityAr : site.city)} ${txt(site.postal)}</p>
            <p style="margin-block-start:1.5rem"><a class="btn btn--onnight" href="${esc(mapsHref)}" rel="noopener">${icon.pin()}<span>${txt(t.ui.directionsLong)}</span></a></p>`}
          </div>
        </div>
      </div>
    </section>`;
}

/* ── pages ────────────────────────────────────────────────────────────── */

export function homeMain(L, t) {
  const facts = t.home.cabinet.facts.map((f) => `<div class="fact" data-reveal>
            <h3 class="fact__t">${txt(f.t)}</h3>
            <p class="fact__d">${txt(f.d)}</p>
          </div>`).join('\n          ');

  return `    <section class="hero">
      <div class="wrap">
        <h1 class="display hero__title" data-reveal="rise">${nl2(t.home.h1)}</h1>
        <div class="hero__grid">
          <div class="hero__copy">
            <p class="lead" data-reveal>${txt(t.home.lead)}</p>
            <div data-reveal>${callButtons(t, { size: 'lg' })}</div>
            <div class="hero__meta" data-reveal>
              ${statusChip(t)}
              <span>${txt(L === 'ar' ? site.streetAr : site.street)}, ${txt(L === 'ar' ? site.cityAr : site.city)}</span>
            </div>
          </div>
          <figure class="hero__figure" data-reveal="wipe">
            <span data-parallax style="display:block">
              ${picture({ name: 'reception', alt: t.home.heroAlt, sizes: '(min-width: 900px) 52vw, 100vw', priority: true })}
            </span>
          </figure>
        </div>
      </div>
    </section>

    <section class="section section--tight" aria-labelledby="serv-h">
      <div class="wrap">
        <div style="display:grid;gap:1.5rem;margin-block-end:clamp(2.5rem,5vw,3.5rem)">
          <h2 class="h2" id="serv-h" data-reveal="rise">${nl2(t.home.services.h2)}</h2>
          <p class="lead" data-reveal>${txt(t.home.services.lead)}</p>
        </div>
        ${serviceList(L, t)}
      </div>
    </section>

    <section class="section" aria-labelledby="cab-h">
      <div class="wrap">
        <div class="split">
          <div class="split__copy">
            <h2 class="h2" id="cab-h" data-reveal="rise">${nl2(t.home.cabinet.h2)}</h2>
            <div class="prose" data-reveal>
              ${t.home.cabinet.body.map((p) => `<p>${txt(p)}</p>`).join('\n              ')}
            </div>
          </div>
          <figure class="figure" data-reveal>
            ${picture({ name: 'facade-nuit', alt: t.home.cabinet.alt, sizes: '(min-width: 900px) 46vw, 100vw' })}
          </figure>
        </div>

        <div class="facts" data-reveal-group="50">
          ${facts}
        </div>
      </div>
    </section>

    <hr class="lightline wrap" style="margin-block:clamp(1rem,3vw,2rem)">

    <section class="section" aria-labelledby="dr-h">
      <div class="wrap">
        <div class="split split--reverse">
          <div class="split__copy">
            <h2 class="h2" id="dr-h" data-reveal="rise">${nl2(t.home.dentist.h2)}</h2>
            <div class="prose" data-reveal>
              ${t.home.dentist.body.map((p) => `<p>${txt(p)}</p>`).join('\n              ')}
            </div>
            <blockquote class="quote" data-reveal>${txt(t.home.dentist.quote)}</blockquote>
          </div>
          <div data-reveal>
            ${slot(t, t.ui.photoSlot, t.home.dentist.photoNote, true)}
          </div>
        </div>
      </div>
    </section>

    <section class="section section--tight" aria-labelledby="city-h">
      <div class="wrap">
        <div class="split">
          <div class="split__copy">
            <h2 class="h2" id="city-h" data-reveal="rise">${nl2(t.home.city.h2)}</h2>
            <p class="prose" data-reveal>${txt(t.home.city.body)}</p>
          </div>
          <figure class="figure" data-reveal>
            ${picture({ name: 'tetouan', alt: t.home.city.alt, sizes: '(min-width: 900px) 46vw, 100vw' })}
            <figcaption class="figure__credit">${txt(t.home.city.credit)}</figcaption>
          </figure>
        </div>
      </div>
    </section>

${faqBlock(t, t.home.faq.items, t.home.faq.h2)}`;
}

export function serviceMain(L, t, id) {
  const s = t.services[id];
  const others = ['soins', 'implants', 'esthetique', 'radiologie', 'urgences'].filter((x) => x !== id);
  const trail = [
    { name: t.ui.homeLabel, path: href(L, 'home') },
    { name: s.name, path: href(L, id) },
  ];

  const urgentBlock = s.urgentBox ? `
        <div class="urgent" data-reveal>
          <div>
            <p class="urgent__t">${txt(s.urgentBox.title)}</p>
            <p class="urgent__d">${txt(s.urgentBox.body)}</p>
          </div>
          <a class="btn btn--primary btn--lg" href="${telHref}">${icon.phone()}<bdi class="num">${txt(site.phoneDisplay)}</bdi></a>
        </div>` : '';

  return `    <div class="wrap">${crumbs(L, t, trail)}</div>

    <section class="page-head">
      <div class="wrap">
        <h1 class="display" style="max-width:18ch" data-reveal="rise">${txt(s.h1)}</h1>
        <p class="lead" data-reveal>${txt(s.lead)}</p>
        <div data-reveal>${callButtons(t)}</div>
      </div>
    </section>

    <section class="section section--flush-top">
      <div class="wrap">
        <div class="prose" data-reveal>
          ${s.body.map((p) => `<p>${txt(p)}</p>`).join('\n          ')}
        </div>
${urgentBlock}
      </div>
    </section>

    <section class="section section--tight" aria-labelledby="inc-h">
      <div class="wrap">
        <h2 class="h2" id="inc-h" style="margin-block-end:clamp(2rem,4vw,2.75rem)" data-reveal="rise">${txt(s.includes.title)}</h2>
        <dl class="includes" data-reveal-group="50">
          ${s.includes.items.map(([k, v]) => `<div data-reveal>
            <dt class="includes__t">${txt(k)}</dt>
            <dd class="includes__d">${txt(v)}</dd>
          </div>`).join('\n          ')}
        </dl>
      </div>
    </section>

    <section class="section section--tight" aria-labelledby="steps-h">
      <div class="wrap">
        <h2 class="h2" id="steps-h" style="margin-block-end:clamp(2rem,4vw,2.75rem)" data-reveal="rise">${txt(s.steps.title)}</h2>
        <ol class="steps" data-reveal-group="55">
          ${s.steps.items.map(([k, v]) => `<li data-reveal>
            <span class="steps__t">${txt(k)}</span>
            <span class="steps__d">${txt(v)}</span>
          </li>`).join('\n          ')}
        </ol>
      </div>
    </section>

${faqBlock(t, s.faq, t.ui.questions)}

    <section class="section section--tight">
      <div class="wrap">
        <h2 class="h4">${txt(t.ui.allServices)}</h2>
        <div class="related">
          ${others.map((o) => `<a class="chip" href="${href(L, o)}">${txt(t.services[o].name)}</a>`).join('\n          ')}
        </div>
      </div>
    </section>`;
}

export function contactMain(L, t) {
  const trail = [
    { name: t.ui.homeLabel, path: href(L, 'home') },
    { name: t.nav.contact, path: href(L, 'contact') },
  ];
  return `    <div class="wrap">${crumbs(L, t, trail)}</div>

    <section class="page-head">
      <div class="wrap">
        <h1 class="display" style="max-width:14ch" data-reveal="rise">${txt(t.contact.h1)}</h1>
        <p class="lead" data-reveal>${txt(t.contact.lead)}</p>
        <div data-reveal>${callButtons(t, { size: 'lg' })}</div>
        <div style="margin-block-start:1.25rem" data-reveal>${statusChip(t)}</div>
      </div>
    </section>

    <section class="section section--flush-top">
      <div class="wrap contact__grid">
        <div data-reveal>
          <div class="detail">
            <span class="detail__k">${txt(t.contact.addressTitle)}</span>
            <span class="detail__v"><a href="${esc(mapsHref)}" rel="noopener">${txt(L === 'ar' ? site.streetAr : site.street)}, ${txt(L === 'ar' ? site.cityAr : site.city)} ${txt(site.postal)}</a></span>
          </div>
          <div class="detail">
            <span class="detail__k">${txt(t.contact.phoneTitle)}</span>
            <span class="detail__v num"><a href="${telHref}"><bdi>${txt(site.phoneDisplay)}</bdi></a></span>
          </div>
          <div class="detail">
            <span class="detail__k">WhatsApp</span>
            <span class="detail__v num"><a href="${esc(waHref(t.ui.waMessage))}" rel="noopener"><bdi>${txt(site.phoneIntl)}</bdi></a></span>
          </div>
          <div class="detail">
            <span class="detail__k">${txt(t.contact.emailTitle)}</span>
            <span class="detail__v"><a href="mailto:${esc(site.email)}">${txt(site.email)}</a></span>
          </div>

          <div style="margin-block-start:2.5rem">
            ${hoursTable(t)}
          </div>
        </div>

        <div data-reveal>
          <p><a class="btn btn--ghost" href="${esc(mapsHref)}" rel="noopener">${icon.pin()}<span>${txt(t.ui.directionsLong)}</span></a></p>

          <h2 class="h4" style="margin-block-start:2.5rem">${txt(t.contact.accessTitle)}</h2>
          <div class="prose" style="font-size:var(--t-body);margin-block-start:0.75rem">
            ${t.contact.accessBody.map((p) => `<p>${txt(p)}</p>`).join('\n            ')}
          </div>

          <h2 class="h4" style="margin-block-start:2rem">${txt(t.contact.noteTitle)}</h2>
          <p class="prose" style="font-size:var(--t-body);margin-block-start:0.75rem">${txt(t.contact.noteBody)}</p>
        </div>
      </div>
    </section>`;
}

export function notFoundMain(L, t) {
  const serviceIds = ['soins', 'implants', 'esthetique', 'radiologie', 'urgences'];
  return `    <section class="page-head" style="padding-block:clamp(4rem,10vw,8rem)">
      <div class="wrap">
        <h1 class="display" style="max-width:16ch">${txt(t.notFound.h1)}</h1>
        <p class="lead">${txt(t.notFound.body)}</p>
        <div>${callButtons(t)}</div>
        <div class="related" style="margin-block-start:2rem">
          <a class="chip" href="${href(L, 'home')}">${txt(t.ui.homeLabel)}</a>
          ${serviceIds.map((o) => `<a class="chip" href="${href(L, o)}">${txt(t.services[o].name)}</a>`).join('\n          ')}
          <a class="chip" href="${href(L, 'contact')}">${txt(t.nav.contact)}</a>
        </div>
      </div>
    </section>`;
}
