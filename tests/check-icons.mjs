// tests/check-icons.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXPECTED = [
  ['icons/icon-192.png', 192],
  ['icons/icon-512.png', 512],
  ['icons/icon-maskable-512.png', 512],
];

function pngDimensions(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

let ok = true;
for (const [relPath, expectedSize] of EXPECTED) {
  let buf;
  try {
    buf = readFileSync(join(ROOT, relPath));
  } catch {
    console.error(`Missing icon: ${relPath}`);
    ok = false;
    continue;
  }
  const { width, height } = pngDimensions(buf);
  if (width !== expectedSize || height !== expectedSize) {
    console.error(`${relPath} is ${width}x${height}, expected ${expectedSize}x${expectedSize}`);
    ok = false;
  }
}

if (!ok) process.exit(1);
console.log('OK: all icons exist at the expected dimensions.');
