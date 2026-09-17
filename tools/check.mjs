#!/usr/bin/env node
/**
 * Pre-flight checks over dist/. Static analysis only — no network, no browser.
 *
 *   node tools/check.mjs
 *
 * Covers the things that silently break an SEO-critical static site:
 * canonical/hreflang reciprocity, structured-data shape, metadata length,
 * heading order, alt text, internal links, and asset references.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Mirrors src/site.mjs; a project-site build prefixes every internal path.
const BASE = (process.env.BASE_PATH ?? '').replace(/\/+$/, '');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

let fails = 0;
let warns = 0;
const fail = (where, msg) => { fails++; console.log(`  FAIL ${where}: ${msg}`); };
const warn = (where, msg) => { warns++; console.log(`  warn ${where}: ${msg}`); };

async function htmlFiles(dir = DIST, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await htmlFiles(full, acc);
    else if (e.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : null;
};
const all = (html, re) => [...html.matchAll(re)];

async function main() {
  const files = await htmlFiles();
  console.log(`\nChecking ${files.length} pages in dist/\n`);

  const canonicals = new Map();

  for (const file of files) {
    const rel = path.relative(DIST, file).replace(/\\/g, '/');
    const html = await readFile(file, 'utf8');
    const is404 = rel.endsWith('404.html');

    /* --- head essentials --- */
    const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    if (!title) fail(rel, 'no <title>');
    // Length only matters where the page can appear in results; 404 is noindex.
    else if (!is404 && title.length > 65) warn(rel, `title ${title.length} chars (>65 may truncate in SERPs)`);
    else if (!is404 && title.length < 20) warn(rel, `title only ${title.length} chars`);

    const descTag = html.match(/<meta name="description" content="([^"]*)"/);
    const desc = descTag ? descTag[1] : '';
    if (!desc) fail(rel, 'no meta description');
    else if (!is404 && desc.length > 165) warn(rel, `description ${desc.length} chars (>165 may truncate)`);
    else if (!is404 && desc.length < 70) warn(rel, `description only ${desc.length} chars`);

    const canonical = attr(html.match(/<link rel="canonical"[^>]*>/)?.[0] || '', 'href');
    if (!canonical) fail(rel, 'no canonical');
    if (!is404 && canonical) {
      if (canonicals.has(canonical)) fail(rel, `duplicate canonical, also in ${canonicals.get(canonical)}`);
      canonicals.set(canonical, rel);
    }

    const htmlTag = html.match(/<html[^>]*>/)[0];
    const lang = attr(htmlTag, 'lang');
    const dir = attr(htmlTag, 'dir');
    if (!lang) fail(rel, 'no lang on <html>');
    if (rel.startsWith('ar/') && dir !== 'rtl') fail(rel, `Arabic page has dir="${dir}"`);
    if (!rel.startsWith('ar/') && dir !== 'ltr') fail(rel, `French page has dir="${dir}"`);

    /* --- hreflang --- */
    const alts = all(html, /<link rel="alternate" hreflang="([^"]*)" href="([^"]*)"/g);
    const langs = alts.map((m) => m[1]);
    for (const expected of ['fr-MA', 'ar-MA', 'x-default']) {
      if (!langs.includes(expected)) fail(rel, `missing hreflang ${expected}`);
    }
    if (!is404 && canonical && !alts.some((m) => m[2] === canonical)) {
      fail(rel, 'hreflang set does not include the page\'s own canonical (not self-referencing)');
    }

    /* --- robots --- */
    const robots = attr(html.match(/<meta name="robots"[^>]*>/)?.[0] || '', 'content') || '';
    if (is404 && !robots.includes('noindex')) fail(rel, '404 page is indexable');
    if (!is404 && robots.includes('noindex')) fail(rel, 'page is noindex');

    /* --- headings --- */
    const h1s = all(html, /<h1[\s>]/g).length;
    if (h1s !== 1) fail(rel, `${h1s} <h1> elements (expected exactly 1)`);

    const levels = all(html, /<h([1-4])[\s>]/g).map((m) => Number(m[1]));
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) {
        warn(rel, `heading jumps h${levels[i - 1]} -> h${levels[i]}`);
        break;
      }
    }

    /* --- images --- */
    for (const m of all(html, /<img\b[^>]*>/g)) {
      const tag = m[0];
      if (attr(tag, 'alt') === null) fail(rel, `img without alt: ${tag.slice(0, 70)}`);
      if (!attr(tag, 'width') || !attr(tag, 'height')) {
        fail(rel, `img without width/height (CLS risk): ${attr(tag, 'src')}`);
      }
    }

    /* --- structured data --- */
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!ld) fail(rel, 'no JSON-LD');
    else {
      let graph;
      try {
        graph = JSON.parse(ld[1]);
      } catch (e) {
        fail(rel, `JSON-LD does not parse: ${e.message}`);
      }
      if (graph) {
        const nodes = graph['@graph'] || [];
        const types = nodes.flatMap((n) => [].concat(n['@type'] || []));
        if (!types.includes('Dentist')) fail(rel, 'JSON-LD has no Dentist node');
        const clinic = nodes.find((n) => [].concat(n['@type'] || []).includes('Dentist'));
        if (clinic) {
          for (const k of ['name', 'telephone', 'address', 'geo', 'openingHoursSpecification', 'url']) {
            if (!clinic[k]) fail(rel, `Dentist node missing "${k}"`);
          }
          if (clinic.aggregateRating || clinic.review) {
            fail(rel, 'Dentist node carries invented ratings/reviews');
          }
        }
        // Every FAQ question in the markup should appear in FAQPage data.
        const faqNode = nodes.find((n) => n['@type'] === 'FAQPage');
        const summaries = all(html, /<summary class="faq__q">([\s\S]*?)<span/g)
          .map((m) => m[1].trim());
        if (summaries.length && !faqNode) fail(rel, 'FAQ in markup but no FAQPage schema');
        if (faqNode && faqNode.mainEntity.length !== summaries.length) {
          fail(rel, `FAQPage has ${faqNode.mainEntity.length} questions, markup has ${summaries.length}`);
        }
      }
    }

    /* --- internal links and asset references resolve --- */
    const refs = [
      ...all(html, /href="(\/[^"#?]*)"/g).map((m) => m[1]),
      ...all(html, /src="(\/[^"#?]*)"/g).map((m) => m[1]),
      ...all(html, /srcset="([^"]*)"/g).flatMap((m) =>
        m[1].split(',').map((s) => s.trim().split(/\s+/)[0]).filter((s) => s.startsWith('/'))
      ),
    ];
    const missing = new Set();
    for (const ref of new Set(refs)) {
      if (BASE && !ref.startsWith(BASE + '/')) {
        fail(rel, `reference missing the base path "${BASE}": ${ref}`);
        continue;
      }
      const local = BASE ? ref.slice(BASE.length) : ref;
      const target = local.endsWith('/') ? local + 'index.html' : local;
      if (!existsSync(path.join(DIST, target))) missing.add(ref);
    }
    for (const m of missing) fail(rel, `broken reference: ${m}`);
  }

  /* --- sitemap --- */
  const sm = await readFile(path.join(DIST, 'sitemap.xml'), 'utf8');
  const locs = all(sm, /<loc>([^<]+)<\/loc>/g).map((m) => m[1]);
  for (const c of canonicals.keys()) {
    if (!locs.includes(c)) fail('sitemap.xml', `canonical not listed: ${c}`);
  }
  for (const l of locs) {
    if (!canonicals.has(l)) fail('sitemap.xml', `lists a URL no page claims as canonical: ${l}`);
  }

  /* --- required root files --- */
  for (const f of ['robots.txt', 'sitemap.xml', 'site.webmanifest',
                   'favicon.ico', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', '_headers']) {
    if (!existsSync(path.join(DIST, f))) fail('dist', `missing ${f}`);
  }

  /* --- weight budget for the landing page --- */
  const css = (await stat(path.join(DIST, 'assets/css/site.css'))).size;
  const js = (await stat(path.join(DIST, 'assets/js/site.js'))).size;
  const fonts = (await readdir(path.join(DIST, 'assets/fonts')))
    .filter((f) => f.endsWith('.woff2'));
  let fontBytes = 0;
  for (const f of fonts) fontBytes += (await stat(path.join(DIST, 'assets/fonts', f))).size;
  const hero = (await stat(path.join(DIST, 'assets/img/reception-1448.avif'))).size;

  console.log(`\n  CSS ${(css / 1024).toFixed(1)} KB · JS ${(js / 1024).toFixed(1)} KB · ` +
    `fonts ${(fontBytes / 1024).toFixed(1)} KB (${fonts.length} subsets) · hero AVIF ${(hero / 1024).toFixed(1)} KB`);
  if (css > 60 * 1024) warn('budget', `CSS is ${(css / 1024).toFixed(0)} KB`);
  if (js > 20 * 1024) warn('budget', `JS is ${(js / 1024).toFixed(0)} KB`);

  console.log(`\n  ${fails} failure(s), ${warns} warning(s)\n`);
  if (fails) process.exitCode = 1;
}

main();
