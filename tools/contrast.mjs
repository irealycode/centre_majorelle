#!/usr/bin/env node
/**
 * Verify every colour pair in the palette against WCAG, from the OKLCH values
 * themselves. No dependencies: OKLCH → OKLab → linear sRGB → relative luminance.
 *
 *   node tools/contrast.mjs
 *
 * Run this whenever a colour token changes. Eyeballing contrast is how
 * unreadable text ships.
 */

function oklchToLinearSrgb(L, C, Hdeg) {
  const h = (Hdeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const encode = (c) => {
  c = clamp01(c);
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
};
const luminance = (t) => {
  const [r, g, b] = oklchToLinearSrgb(...t).map(clamp01);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const hex = (t) =>
  '#' + oklchToLinearSrgb(...t).map((v) => Math.round(encode(v) * 255).toString(16).padStart(2, '0')).join('');
const inGamut = (t) => oklchToLinearSrgb(...t).every((v) => v >= -0.001 && v <= 1.001);
const ratio = (a, b) => {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
};

/* Keep in step with :root in assets/css/site.css */
const P = {
  bg:        [1.0,   0.0,     0],
  surface:   [0.968, 0.004, 262],
  surfaceHi: [0.94,  0.007, 262],
  line:      [0.905, 0.008, 262],
  ink:       [0.17,  0.012, 264],
  muted:     [0.47,  0.014, 264],
  blue:      [0.5,   0.19,  266],
  blueText:  [0.45,  0.185, 266],
  blueDeep:  [0.255, 0.07,  264],
  night:     [0.185, 0.045, 264],
  glow:      [0.87,  0.1,    82],
  ok:        [0.48,  0.115, 155],
  okOnNight: [0.78,  0.15,  155],
};

/* [label, foreground, background, minimum] */
const PAIRS = [
  ['ink on bg',                 'ink',       'bg',        7],
  ['ink on surface',            'ink',       'surface',   7],
  ['muted on bg',               'muted',     'bg',        4.5],
  ['muted on surface',          'muted',     'surface',   4.5],
  ['blueText on bg',            'blueText',  'bg',        4.5],
  ['blueText on surface',       'blueText',  'surface',   4.5],
  ['bg on blue (filled btn)',   'bg',        'blue',      4.5],
  ['bg on blueDeep',            'bg',        'blueDeep',  7],
  ['bg on night (footer)',      'bg',        'night',     7],
  ['glow on night',             'glow',      'night',     4.5],
  // The "Ouvert" status label. It renders on both grounds, so both are checked:
  // this pair only appears on screen during opening hours, which is exactly the
  // kind of state that escapes a one-off visual pass.
  ['ok on bg (open badge)',     'ok',        'bg',        4.5],
  ['ok on surface',             'ok',        'surface',   4.5],
  ['okOnNight on night',        'okOnNight', 'night',     4.5],
  ['blue vs blueDeep',          'blue',      'blueDeep',  1.7],
];

console.log('\nROLE        OKLCH                       HEX      gamut');
for (const [k, v] of Object.entries(P)) {
  console.log(
    k.padEnd(11),
    `oklch(${v[0].toFixed(3)} ${v[1].toFixed(3)} ${v[2]})`.padEnd(27),
    hex(v),
    inGamut(v) ? 'ok' : 'OUT OF GAMUT'
  );
}

const L = Object.fromEntries(Object.entries(P).map(([k, v]) => [k, luminance(v)]));
let fails = 0;
console.log('\nPAIR                              RATIO    MIN');
for (const [label, a, b, min] of PAIRS) {
  const r = ratio(L[a], L[b]);
  const pass = r >= min;
  if (!pass) fails++;
  console.log(label.padEnd(32), r.toFixed(2).padStart(6), String(min).padStart(6), pass ? '  PASS' : '  ** FAIL **');
}
console.log(`\n  ${fails} failing pair(s)\n`);
if (fails) process.exitCode = 1;
