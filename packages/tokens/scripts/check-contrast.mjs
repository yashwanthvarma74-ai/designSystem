// Fails when a text/background or UI-part pairing drops under the WCAG 2.2 AA ratios.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(await readFile(path.join(here, '..', 'dist', 'tokens.json'), 'utf8'));

function parseColor(input) {
  const value = input.trim().toLowerCase();
  if (value.startsWith('#')) {
    let hex = value.slice(1);
    if (hex.length === 3) hex = [...hex].map((c) => c + c).join('');
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 1,
    };
  }
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) throw new Error(`Cannot parse colour: ${input}`);
  const [r, g, b, a = 1] = match[1].split(',').map((n) => parseFloat(n));
  return { r, g, b, a };
}

// Lay a translucent colour over a solid one so we compare what the eye sees.
function over(top, bottom) {
  return {
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  };
}

function luminance({ r, g, b }) {
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const TEXT = 4.5; // 1.4.3
const UI = 3; // 1.4.11

const surfaces = ['bg-canvas', 'bg-surface', 'bg-subtle'];
const statuses = ['danger', 'success', 'warning', 'info'];

let failures = 0;
let checked = 0;

for (const [themeName, vars] of Object.entries(data.themes)) {
  const get = (name) => {
    const raw = vars[`color-${name}`];
    if (!raw) throw new Error(`Missing token color-${name} in ${themeName}`);
    return parseColor(raw);
  };
  const surface = get('bg-surface');

  const check = (label, fg, bg, min) => {
    const value = ratio(fg, bg);
    checked += 1;
    if (value + 1e-9 < min) {
      failures += 1;
      console.error(`FAIL [${themeName}] ${label}: ${value.toFixed(2)}:1 (needs ${min}:1)`);
    }
  };

  for (const bgName of surfaces) {
    const bg = over(get(bgName), surface);
    for (const t of ['primary', 'secondary', 'tertiary']) {
      check(`text-${t} on ${bgName}`, get(`text-${t}`), bg, TEXT);
    }
    check(`text-link on ${bgName}`, get('text-link'), bg, TEXT);
    check(`accent-text on ${bgName}`, get('accent-text'), bg, TEXT);
    check(`border-strong vs ${bgName}`, get('border-strong'), bg, UI);
    check(`focus-ring vs ${bgName}`, get('focus-ring'), bg, UI);
  }

  check('text-inverse on bg-inverse', get('text-inverse'), get('bg-inverse'), TEXT);

  for (const state of ['default', 'hover', 'active']) {
    check(`on-accent on accent-${state}`, get('accent-on-accent'), get(`accent-${state}`), TEXT);
  }
  check(
    'accent-text on accent-subtle',
    get('accent-text'),
    over(get('accent-subtle'), surface),
    TEXT,
  );

  for (const status of statuses) {
    check(
      `${status}-text on ${status}-subtle`,
      get(`${status}-text`),
      over(get(`${status}-subtle`), surface),
      TEXT,
    );
    check(`${status}-text on surface`, get(`${status}-text`), surface, TEXT);
  }
  check('danger-solid vs surface', get('danger-solid'), surface, UI);
}

if (failures > 0) {
  console.error(`\n${failures} of ${checked} contrast checks failed.`);
  process.exit(1);
}
console.log(`contrast: ${checked} checks passed across ${Object.keys(data.themes).length} themes`);
