import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REQUIRED_FIELDS = ['name', 'short_name', 'start_url', 'display', 'background_color', 'theme_color', 'icons'];
const PAGES = ['index.html', 'habits.html', 'gym.html', 'health.html', 'po-water.html'];

let ok = true;
let manifest;
try {
  manifest = JSON.parse(readFileSync(join(ROOT, 'manifest.json'), 'utf8'));
} catch (e) {
  console.error(`Cannot read/parse manifest.json: ${e.message}`);
  process.exit(1);
}

for (const field of REQUIRED_FIELDS) {
  if (!(field in manifest)) {
    console.error(`manifest.json missing required field: ${field}`);
    ok = false;
  }
}
const sizes = (manifest.icons || []).map((i) => i.sizes);
for (const required of ['192x192', '512x512']) {
  if (!sizes.includes(required)) {
    console.error(`manifest.json icons missing a ${required} entry`);
    ok = false;
  }
}
if (!(manifest.icons || []).some((i) => i.purpose === 'maskable')) {
  console.error('manifest.json missing a maskable icon entry');
  ok = false;
}

for (const page of PAGES) {
  const src = readFileSync(join(ROOT, page), 'utf8');
  if (!/<link rel="manifest" href="manifest\.json">/.test(src)) {
    console.error(`${page} is missing <link rel="manifest" href="manifest.json">`);
    ok = false;
  }
  if (!/apple-mobile-web-app-capable/.test(src)) {
    console.error(`${page} is missing the apple-mobile-web-app-capable meta tag`);
    ok = false;
  }
}

if (!ok) process.exit(1);
console.log('OK: manifest.json is well-formed and linked from every page.');
