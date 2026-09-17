#!/usr/bin/env node
/**
 * Accessibility audit over the running preview, with axe-core.
 *
 *   node tools/serve.mjs          # in one terminal
 *   node tools/a11y.mjs           # in another
 *
 * Checks both languages at phone and desktop width, and — importantly — forces
 * the "Ouvert / Fermé" badge into *both* states. That badge only shows "Ouvert"
 * during opening hours, so a daytime-only audit silently skips half of it. The
 * open-state green failed contrast on white for exactly that reason.
 */

import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:4321';
const AXE = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';

const PAGES = ['/', '/implantologie.html', '/urgences-dentaires.html', '/le-cabinet.html',
               '/contact.html', '/ar/', '/ar/contact.html'];

const VIEWS = [
  { name: 'phone', viewport: { width: 390, height: 844 } },
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
];

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const browser = await chromium.launch({ channel: 'chrome' });
let total = 0;

for (const view of VIEWS) {
  const ctx = await browser.newContext({ viewport: view.viewport });
  const page = await ctx.newPage();

  for (const url of PAGES) {
    await page.goto(BASE + url, { waitUntil: 'networkidle' });
    await page.addScriptTag({ url: AXE });
    await page.waitForTimeout(250);

    for (const state of ['open', 'closed']) {
      // Pin the badge so both colour treatments are actually on screen.
      await page.evaluate((s) => {
        document.querySelectorAll('[data-status]').forEach((el) => {
          el.hidden = false;
          el.setAttribute('data-open', s === 'open' ? 'true' : 'false');
          const label = el.querySelector('[data-status-label]');
          const detail = el.querySelector('[data-status-detail]');
          if (label) label.textContent = s === 'open' ? 'Ouvert' : 'Fermé';
          if (detail) detail.textContent = s === 'open' ? 'ferme à 19:30' : 'ouvre à 09:00';
        });
      }, state);

      const result = await page.evaluate(
        async (tags) => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }),
        TAGS
      );

      if (result.violations.length) {
        console.log(`\n${view.name} ${url}  [badge: ${state}]`);
        for (const v of result.violations) {
          total += v.nodes.length;
          console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
          v.nodes.slice(0, 3).forEach((n) => {
            console.log(`      ${n.html.slice(0, 120)}`);
            (n.any || []).slice(0, 1).forEach((c) => console.log(`        ${c.message}`));
          });
        }
      }
    }
  }
  await ctx.close();
  console.log(`  ${view.name}: ${PAGES.length} pages x 2 badge states checked`);
}

await browser.close();
console.log(total ? `\n  ${total} violation node(s)\n` : '\n  0 violations\n');
if (total) process.exitCode = 1;
