#!/usr/bin/env node
/**
 * Screenshot the built site across viewports, using the system Chrome.
 *
 *   node tools/shots.mjs [outDir] [baseUrl]
 *
 * Also reports anything that failed to load and any horizontal overflow,
 * which is the failure mode long headings cause on narrow screens.
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = process.argv[2] || 'shots';
const BASE = process.argv[3] || 'http://localhost:4321';

// `viewport` must be nested: width/height at the top level of newContext()
// are silently ignored, and every shot comes out at the 1280px default.
const VIEWS = {
  phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  tablet: { viewport: { width: 834, height: 1112 }, deviceScaleFactor: 2 },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
};

const PAGES = [
  ['home', '/'],
  ['implants', '/implantologie.html'],
  ['urgences', '/urgences-dentaires.html'],
  ['cabinet', '/le-cabinet.html'],
  ['contact', '/contact.html'],
  ['ar-home', '/ar/'],
  ['ar-implants', '/ar/implantologie.html'],
];

const only = process.env.VIEWS ? process.env.VIEWS.split(',') : Object.keys(VIEWS);

const browser = await chromium.launch({ channel: 'chrome' });
await mkdir(OUT, { recursive: true });

let problems = 0;

for (const view of only) {
  const ctx = await browser.newContext({ ...VIEWS[view], reducedMotion: 'no-preference' });
  const page = await ctx.newPage();

  const failed = [];
  page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText} ${r.url()}`));
  page.on('response', (r) => {
    if (r.status() >= 400) failed.push(`HTTP ${r.status()} ${r.url()}`);
  });
  page.on('pageerror', (e) => failed.push(`JS ERROR ${e.message}`));

  for (const [name, url] of PAGES) {
    failed.length = 0;
    await page.goto(BASE + url, { waitUntil: 'networkidle' });

    // Let every reveal fire before capturing.
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 900));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
    });
    await page.waitForTimeout(400);

    const audit = await page.evaluate(() => {
      const de = document.documentElement;
      const overflow = [];
      if (de.scrollWidth > de.clientWidth + 1) {
        document.querySelectorAll('body *').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > de.clientWidth + 1 || r.left < -1) {
            const style = getComputedStyle(el);
            if (style.position === 'fixed') return;
            overflow.push(
              `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} ` +
                `[${Math.round(r.left)}..${Math.round(r.right)}]`
            );
          }
        });
      }
      return {
        scrollWidth: de.scrollWidth,
        clientWidth: de.clientWidth,
        overflow: overflow.slice(0, 6),
        title: document.title,
        h1: document.querySelectorAll('h1').length,
      };
    });

    await page.screenshot({
      path: path.join(OUT, `${name}-${view}.png`),
      fullPage: true,
    });

    const flags = [];
    if (audit.overflow.length) flags.push(`OVERFLOW ${audit.scrollWidth}>${audit.clientWidth}: ${audit.overflow.join(' | ')}`);
    if (audit.h1 !== 1) flags.push(`H1 COUNT ${audit.h1}`);
    if (failed.length) flags.push(...failed.slice(0, 5));
    if (flags.length) {
      problems += flags.length;
      console.log(`  ${view}/${name}:`);
      flags.forEach((f) => console.log(`      ${f}`));
    } else {
      console.log(`  ${view}/${name}: ok`);
    }
  }

  await ctx.close();
}

await browser.close();
console.log(problems ? `\n  ${problems} issue(s)\n` : '\n  clean\n');
