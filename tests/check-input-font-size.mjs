// tests/check-input-font-size.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const htmlFiles = readdirSync(ROOT).filter((f) => f.endsWith('.html'));

const ruleRe = /([^{}]+)\{([^{}]*)\}/g;
const violations = [];

for (const file of htmlFiles) {
  const src = readFileSync(join(ROOT, file), 'utf8');
  const styleBlocks = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  for (const block of styleBlocks) {
    for (const match of block.matchAll(ruleRe)) {
      const [, selector, body] = match;
      if (!/\b(input|select|textarea)\b/i.test(selector)) continue;
      if (/::selection/i.test(selector)) continue;
      const sizeMatch = body.match(/font-size:\s*(\d+(?:\.\d+)?)px/);
      if (sizeMatch && Number(sizeMatch[1]) < 16) {
        violations.push(`${file}: "${selector.trim()}" has font-size: ${sizeMatch[1]}px`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error('Found input/select/textarea rules under 16px (triggers iOS Safari zoom-on-focus):');
  for (const v of violations) console.error('  ' + v);
  process.exit(1);
} else {
  console.log('OK: no input/select/textarea rule is under 16px.');
}
