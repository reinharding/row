// tests/check-theme-tokens.mjs
//
// Guards the theme.css rollout (docs/adr/0001-theme-css-tokens-only.md):
// every migrated page must link theme.css, must not shadow its tokens
// with a page-local :root, and must not still reference pre-rollout
// variable names.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const CANONICAL_TOKENS = [
  '--bg', '--bg-card',
  '--text-1', '--text-2', '--text-3', '--text-4',
  '--border', '--border-strong',
  '--good', '--warn', '--bad', '--info',
  '--font', '--font-mono',
];

// Pages migrated so far. Add an entry (with its own oldVocab) as each
// per-page ticket lands.
const PAGES = [
  { file: 'habits.html', oldVocab: [] },
  { file: 'po-water.html', oldVocab: [] },
  { file: 'gym.html', oldVocab: [] },
  {
    file: 'health.html',
    oldVocab: ['--text-primary', '--text-secondary', '--text-tertiary', '--text-quaternary', '--warning'],
  },
  {
    file: 'index.html',
    oldVocab: ['--text-primary', '--text-secondary', '--text-tertiary', '--success', '--warning', '--danger'],
  },
];

const violations = [];

// theme.css must define exactly the canonical token set.
const themeCss = readFileSync(join(ROOT, 'theme.css'), 'utf8');
const rootBlockMatch = themeCss.match(/:root\s*\{([^}]*)\}/);
if (!rootBlockMatch) {
  violations.push('theme.css: no :root block found');
} else {
  const body = rootBlockMatch[1];
  for (const token of CANONICAL_TOKENS) {
    const re = new RegExp(`(^|[^-\\w])${token}\\s*:`, 'm');
    if (!re.test(body)) {
      violations.push(`theme.css: missing token ${token}`);
    }
  }
}

for (const { file, oldVocab } of PAGES) {
  const src = readFileSync(join(ROOT, file), 'utf8');

  if (!/<link[^>]+href=["']theme\.css["'][^>]*>/.test(src)) {
    violations.push(`${file}: does not link theme.css`);
  }

  const styleBlocks = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  for (const block of styleBlocks) {
    const pageRootMatch = block.match(/:root\s*\{([^}]*)\}/);
    if (pageRootMatch) {
      const body = pageRootMatch[1];
      for (const token of CANONICAL_TOKENS) {
        const re = new RegExp(`(^|[^-\\w])${token}\\s*:`, 'm');
        if (re.test(body)) {
          violations.push(`${file}: page-local :root redefines ${token} (should come from theme.css)`);
        }
      }
    }
  }

  for (const old of oldVocab) {
    // Word-boundary check: a bare name like "--warning" must not match
    // inside a distinct, still-valid token like "--warning-bg".
    const re = new RegExp(`${old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![-\\w])`);
    if (re.test(src)) {
      violations.push(`${file}: still references old variable ${old}`);
    }
  }
}

if (violations.length > 0) {
  console.error('Theme token violations found:');
  for (const v of violations) console.error('  ' + v);
  process.exit(1);
} else {
  console.log('OK: theme.css defines the canonical tokens and all migrated pages link it cleanly.');
}
