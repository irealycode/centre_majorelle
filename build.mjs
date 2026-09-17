#!/usr/bin/env node
/**
 * Static site build for Centre Dentaire Majorelle.
 *
 *   node build.mjs
 *
 * Reads src/, writes a complete static site into dist/. No runtime, no
 * framework, no dependencies — dist/ is plain files you can upload anywhere.
 */

import { mkdir, writeFile, rm, cp, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, locales, pages, href, url, asset, basePath } from './src/site.mjs';
import fr from './src/content/fr.mjs';
import ar from './src/content/ar.mjs';
import {
  layout, homeMain, serviceMain, cabinetMain, contactMain, notFoundMain,
  setImageManifest,
} from './src/render.mjs';
import {
  clinicNode, dentistNode, websiteNode, webPageNode, breadcrumbNode,
  faqNode, serviceNode, jsonLd,
} from './src/schema.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const CONTENT = { fr, ar };
const SERVICE_IDS = ['soins', 'implants', 'esthetique', 'radiologie', 'urgences'];

const log = (...a) => console.log(...a);

/* ── images ───────────────────────────────────────────────────────────── */

async function ensureImages() {
  const manifestPath = path.join(ROOT, 'assets', 'img', 'manifest.json');
  if (!existsSync(manifestPath)) {
    log('  images: manifest missing, running tools/images.py');
    for (const py of ['python', 'python3', 'py']) {
      const r = spawnSync(py, ['tools/images.py'], { cwd: ROOT, stdio: 'inherit' });
      if (r.status === 0) break;
    }
  }
  if (!existsSync(manifestPath)) {
    throw new Error(
      'assets/img/manifest.json is missing. Run `python tools/images.py` first.'
    );
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  setImageManifest(manifest);
  return manifest;
}

/**
 * Empty dist/ without removing dist/ itself.
 *
 * Deleting the directory fails on Windows with EBUSY whenever another process
 * has it open — which is the normal case, since `npm run serve` is usually
 * running in a second terminal while you rebuild. Clearing the contents and
 * leaving the directory in place avoids that entirely, and a short retry
 * covers a file the server happens to be reading at that instant.
 */
async function cleanDist() {
  if (!existsSync(DIST)) return;
  for (const entry of await readdir(DIST)) {
    const target = path.join(DIST, entry);
    for (let attempt = 0; ; attempt++) {
      try {
        await rm(target, { recursive: true, force: true });
        break;
      } catch (err) {
        if (attempt >= 4 || !['EBUSY', 'EPERM', 'ENOTEMPTY'].includes(err.code)) throw err;
        await new Promise((r) => setTimeout(r, 120));
      }
    }
  }
}

/* ── per-page schema ──────────────────────────────────────────────────── */

function schemaFor(L, t, pageId) {
  const canonical = url(L, pageId);
  const services = SERVICE_IDS.map((id) => t.services[id]);
  const base = [
    clinicNode(L, services),
    dentistNode(L),
    websiteNode(L),
  ];

  const meta = t.meta[pageId];
  const page = webPageNode(L, {
    canonical,
    title: meta.title,
    description: meta.description,
    image: `${site.origin}${asset('/assets/img/og.jpg')}`,
  });

  if (pageId === 'home') {
    return jsonLd([...base, page, faqNode(canonical, t.home.faq.items)]);
  }

  const trail = [
    { name: t.ui.homeLabel, url: url(L, 'home') },
    { name: t.nav[pageId] || t.services[pageId]?.name, url: canonical },
  ];
  const nodes = [...base, page, breadcrumbNode(canonical, trail)];

  if (SERVICE_IDS.includes(pageId)) {
    const s = t.services[pageId];
    nodes.push(serviceNode(L, canonical, s));
    nodes.push(faqNode(canonical, s.faq));
  }
  if (pageId === 'contact') {
    nodes.push({
      '@type': 'ContactPage',
      '@id': `${canonical}#contactpage`,
      url: canonical,
      mainEntity: { '@id': `${site.origin}/#clinic` },
    });
  }
  return jsonLd(nodes);
}

/* ── page renderers ───────────────────────────────────────────────────── */

function mainFor(L, t, pageId) {
  if (pageId === 'home') return homeMain(L, t);
  if (pageId === 'cabinet') return cabinetMain(L, t);
  if (pageId === 'contact') return contactMain(L, t);
  if (SERVICE_IDS.includes(pageId)) return serviceMain(L, t, pageId);
  throw new Error(`No renderer for page "${pageId}"`);
}

/* ── side files ───────────────────────────────────────────────────────── */

function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const entries = [];
  for (const L of Object.keys(locales)) {
    for (const p of pages) {
      const alts = Object.keys(locales)
        .map((c) => `    <xhtml:link rel="alternate" hreflang="${locales[c].htmlLang}" href="${url(c, p.id)}"/>`)
        .join('\n');
      entries.push(`  <url>
    <loc>${url(L, p.id)}</loc>
${alts}
    <xhtml:link rel="alternate" hreflang="x-default" href="${url('fr', p.id)}"/>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.priority}</priority>
  </url>`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
}

function robots() {
  return `User-agent: *
Allow: /

Sitemap: ${site.origin}${asset('/sitemap.xml')}
`;
}

function webmanifest() {
  return JSON.stringify({
    name: site.name,
    short_name: site.shortName,
    description: fr.footer.blurb,
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3056cd',
    lang: 'fr-MA',
    dir: 'ltr',
    icons: [
      { src: asset('/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: asset('/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: asset('/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }, null, 2);
}

/**
 * Favicon: the same tooth silhouette as the app icons, filled rather than
 * outlined. At 16px an outline plus the inner monogram turns to mud, so the
 * small mark is deliberately the simplified one.
 */
function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -1 28 32" width="28" height="32">
  <path d="M12 2.4C7.6 2.4 4 4.8 4 9.4c0 3.2.9 5 1.6 7.8.6 2.4.7 5.4 1 7.6.2 1.6.8 2.6 1.9 2.6 1.2 0 1.7-1.1 1.9-2.8.2-1.8.4-4 1.6-4s1.4 2.2 1.6 4c.2 1.7.7 2.8 1.9 2.8 1.1 0 1.7-1 1.9-2.6.3-2.2.4-5.2 1-7.6.7-2.8 1.6-4.6 1.6-7.8 0-4.6-3.6-7-8-7Z"
        fill="#3056cd"/>
</svg>
`;
}

/**
 * Cache + security headers. Netlify and Cloudflare Pages read this file
 * directly; for Apache or nginx, see README.md.
 */
function headers() {
  return `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

/assets/img/*
  Cache-Control: public, max-age=31536000, immutable

/assets/css/*
  Cache-Control: public, max-age=604800

/assets/js/*
  Cache-Control: public, max-age=604800

/*.html
  Cache-Control: public, max-age=0, must-revalidate
`;
}

/**
 * Minify the copied CSS and JS in place, using esbuild if it is installed.
 *
 * This is the one optional dependency in the project and it is build-time
 * only — nothing ships to the browser but plain files. Without it the build
 * still succeeds and simply serves the readable sources, which cost roughly
 * 10 KB more over the wire once the host applies gzip.
 */
async function minify() {
  let esbuild;
  try {
    esbuild = await import('esbuild');
  } catch {
    log('  minify: esbuild not installed, shipping readable sources (run `npm install`)');
    return;
  }

  const jobs = [
    ['assets/css/site.css', 'css'],
    ['assets/js/site.js', 'js'],
  ];
  let saved = 0;
  for (const [rel, loader] of jobs) {
    const file = path.join(DIST, rel);
    const source = await readFile(file, 'utf8');
    const out = await esbuild.transform(source, {
      loader,
      minify: true,
      legalComments: 'none',
      target: loader === 'js' ? 'es2019' : 'chrome110',
    });
    await writeFile(file, out.code, 'utf8');
    saved += source.length - out.code.length;
    log(`  minify: ${rel} ${(source.length / 1024).toFixed(1)} -> ${(out.code.length / 1024).toFixed(1)} KB`);
  }
  log(`  minify: saved ${(saved / 1024).toFixed(1)} KB`);
}

/* ── build ────────────────────────────────────────────────────────────── */

async function main() {
  const started = Date.now();
  log(`\nCentre Dentaire Majorelle — build`);
  log(`  origin: ${site.origin}`);

  await ensureImages();

  await cleanDist();
  await mkdir(DIST, { recursive: true });

  let count = 0;

  for (const L of Object.keys(locales)) {
    const t = CONTENT[L];
    const dir = path.join(DIST, locales[L].base.replace(/^\//, ''));
    await mkdir(dir, { recursive: true });

    for (const p of pages) {
      const meta = t.meta[p.id];
      const html = layout(L, t, {
        pageId: p.id,
        title: meta.title,
        description: meta.description,
        schema: schemaFor(L, t, p.id),
        main: mainFor(L, t, p.id),
      });
      await writeFile(path.join(dir, p.slug), html, 'utf8');
      count++;
    }

    // 404 — served from the site root by the host; the Arabic copy mirrors it.
    const nf = layout(L, t, {
      pageId: 'home',
      title: `${t.notFound.title} — ${L === 'ar' ? site.nameAr : site.name}`,
      description: t.notFound.body,
      schema: jsonLd([clinicNode(L, SERVICE_IDS.map((id) => t.services[id])), websiteNode(L)]),
      main: notFoundMain(L, t),
    }).replace(
      '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">',
      '<meta name="robots" content="noindex, follow">'
    );
    await writeFile(path.join(dir, '404.html'), nf, 'utf8');
    count++;

    log(`  ${L}: ${pages.length + 1} pages`);
  }

  // Static assets, copied verbatim. Excluded: the full-resolution originals
  // (never published) and assets/icons (copied to the site root instead, where
  // the manifest and <link> tags expect them).
  const skip = [`img${path.sep}src`, `assets${path.sep}icons`];
  await cp(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), {
    recursive: true,
    filter: (src) =>
      !skip.some((s) => src.includes(s)) &&
      !/IMG_\d+\.PNG$/i.test(src) &&
      !/LOGO_full\.png$/i.test(src),
  });

  await minify();

  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap(), 'utf8');
  await writeFile(path.join(DIST, 'robots.txt'), robots(), 'utf8');
  await writeFile(path.join(DIST, 'site.webmanifest'), webmanifest(), 'utf8');
  await writeFile(path.join(DIST, 'favicon.svg'), faviconSvg(), 'utf8');
  await writeFile(path.join(DIST, '_headers'), headers(), 'utf8');

  // GitHub Pages runs Jekyll over the upload unless told not to, and Jekyll
  // drops anything starting with an underscore. Nothing here needs Jekyll.
  await writeFile(path.join(DIST, '.nojekyll'), '', 'utf8');

  // Custom domain for GitHub Pages. Opt-in only: a CNAME naming a domain whose
  // DNS does not point at GitHub yet makes Pages redirect to it, taking the
  // site offline. Set CUSTOM_DOMAIN once the DNS records are in place.
  const customDomain = (process.env.CUSTOM_DOMAIN || '').trim();
  if (customDomain) {
    await writeFile(path.join(DIST, 'CNAME'), `${customDomain}\n`, 'utf8');
    log(`  CNAME: ${customDomain}`);
  }

  for (const f of ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon.ico']) {
    const from = path.join(ROOT, 'assets', 'icons', f);
    if (existsSync(from)) await cp(from, path.join(DIST, f));
  }

  log(`  ${count} pages + sitemap, robots, manifest, icons, headers`);
  log(`  -> dist/  (${Date.now() - started} ms)\n`);
}

main().catch((err) => {
  console.error(`\nBuild failed: ${err.message}\n`);
  process.exitCode = 1;
});
