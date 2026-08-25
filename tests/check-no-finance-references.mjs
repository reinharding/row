// tests/check-no-finance-references.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'docs']);

function walk(dir) {
  let out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(full));
    else out.push(full);
  }
  return out;
}

const violations = [];
if (existsSync(join(ROOT, 'finance.html'))) {
  violations.push('finance.html still exists');
}
for (const file of walk(ROOT)) {
  if (!/\.(html|js)$/i.test(file)) continue;
  const src = readFileSync(file, 'utf8');
  if (/finance\.html/i.test(src)) {
    violations.push(`${file} still references finance.html`);
  }
}

if (violations.length > 0) {
  console.error('finance.html removal is incomplete:');
  for (const v of violations) console.error('  ' + v);
  process.exit(1);
} else {
  console.log('OK: finance.html and all code references to it are gone.');
}
