// tests/check-service-worker.mjs
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
let ok = true;

const swPath = join(ROOT, 'sw.js');
if (!existsSync(swPath)) {
  console.error('sw.js does not exist');
  process.exit(1);
}
const sw = readFileSync(swPath, 'utf8');
for (const evt of ["addEventListener('install'", "addEventListener('fetch'"]) {
  if (!sw.includes(evt)) {
    console.error(`sw.js is missing a listener: ${evt}`);
    ok = false;
  }
}
const assetMatch = sw.match(/SHELL_ASSETS\s*=\s*\[([\s\S]*?)\]/);
if (!assetMatch) {
  console.error('sw.js has no SHELL_ASSETS list');
  process.exit(1);
}
const assets = [...assetMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
for (const asset of assets) {
  if (!existsSync(join(ROOT, asset))) {
    console.error(`sw.js caches '${asset}', but that file does not exist`);
    ok = false;
  }
}

const topbar = readFileSync(join(ROOT, 'topbar.js'), 'utf8');
if (!/serviceWorker\.register\(/.test(topbar)) {
  console.error('topbar.js never registers sw.js');
  ok = false;
}

if (!ok) process.exit(1);
console.log('OK: service worker exists, listens for install/fetch, and only caches files that exist.');
