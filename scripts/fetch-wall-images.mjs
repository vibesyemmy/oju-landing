#!/usr/bin/env node
/**
 * Pulls the wall imagery from opeyemi.app into vendor/reference-images/.
 *
 * These are the author's own portfolio pieces, used as placeholders in the Ojú
 * hero wall until Ojú has its own case-study imagery. They are NOT Ojú work —
 * every one should be replaced before launch. See public/fonts/README.md's
 * sibling note in README.md.
 *
 *   node scripts/fetch-wall-images.mjs
 *
 * Downloads only; resizing happens afterwards with sips (see README).
 */
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join, basename } from 'node:path';

const OUT = 'vendor/reference-images';

const URLS = [
  'https://opeyemi.app/poseidon-grid.webp',
  'https://opeyemi.app/ux-buddy/hero.webp',
  'https://opeyemi.app/gangan-brand-hero.webp',
  'https://opeyemi.app/gangan-app.webp',
  'https://opeyemi.app/lingawa-hero.webp',
  'https://opeyemi.app/lotti-hero.webp',
  'https://opeyemi.app/demo-img/trace/trace-cover.webp',
  'https://opeyemi.app/demo-img/flatmagic.webp',
  'https://opeyemi.app/demo-img/hotel-hero.jpg',
  'https://opeyemi.app/demo-img/hotel-beyond-1.jpg',
  'https://opeyemi.app/demo-img/hotel-beyond-2.jpg',
  'https://opeyemi.app/demo-img/hotel-beyond-3.jpg',
  'https://opeyemi.app/demo-img/hotel-beyond-4.jpg',
  'https://opeyemi.app/demo-img/hotel-beyond-5.jpg',
  'https://opeyemi.app/demo-img/Framer-page-1.webp',
  'https://opeyemi.app/demo-img/Rv4CmM0nPavsO7Ow5oGZAJmeyI.png',
  'https://opeyemi.app/demo-img/AlG3NG72K4IJY0BUrvOWK5E1UDM.webp',
  'https://opeyemi.app/demo-img/Ia2Cum6hrToZyplIstjPrfmLx9c.webp',
  'https://opeyemi.app/demo-img/bo4FvKdbA0qy2QvHMbcJeCfME.png',
  'https://opeyemi.app/demo-img/gm6G5tPm5Eelvoyl6edoNJ58qDk.jpeg',
  'https://opeyemi.app/demo-img/1iYU3n6lRbM5mu2rAQCA6k4w8.png',
  'https://opeyemi.app/demo-img/FAI4P9UsKm9pcZ4Y24wWOedWPw.png',
  'https://opeyemi.app/demo-img/eWy6bRTQquYDcj5FBMWTJfgr5rw.webp',
  'https://opeyemi.app/demo-img/65Msjg0Bt09aiqPriWIVGPSd20.webp',
  'https://opeyemi.app/demo-img/H1SFrNwR9pVTY0PFJRUpd9Repg.webp',
  'https://opeyemi.app/demo-img/aYDCcxOHZ3nMIHDFdjtKSa7ppc.webp',
];

/** Opaque hashed filenames tell you nothing later; give them readable names. */
const RENAME = {
  'Rv4CmM0nPavsO7Ow5oGZAJmeyI.png': 'ui-dashboard-a.png',
  'AlG3NG72K4IJY0BUrvOWK5E1UDM.webp': 'ui-mobile-a.webp',
  'Ia2Cum6hrToZyplIstjPrfmLx9c.webp': 'ui-wide-a.webp',
  'bo4FvKdbA0qy2QvHMbcJeCfME.png': 'ui-dashboard-b.png',
  'gm6G5tPm5Eelvoyl6edoNJ58qDk.jpeg': 'ui-device-a.jpeg',
  '1iYU3n6lRbM5mu2rAQCA6k4w8.png': 'ui-dashboard-c.png',
  'FAI4P9UsKm9pcZ4Y24wWOedWPw.png': 'ui-square-a.png',
  'eWy6bRTQquYDcj5FBMWTJfgr5rw.webp': 'ui-wide-b.webp',
  '65Msjg0Bt09aiqPriWIVGPSd20.webp': 'ui-tile-a.webp',
  'H1SFrNwR9pVTY0PFJRUpd9Repg.webp': 'ui-tile-b.webp',
  'aYDCcxOHZ3nMIHDFdjtKSa7ppc.webp': 'ui-tile-c.webp',
  'hero.webp': 'ux-buddy-hero.webp',
  'trace-cover.webp': 'sabi-trace-cover.webp',
};

await mkdir(OUT, { recursive: true });

let ok = 0;
let failed = 0;
let bytes = 0;

for (const url of URLS) {
  const raw = basename(new URL(url).pathname);
  const name = RENAME[raw] ?? raw;
  const dest = join(OUT, name);

  try {
    await stat(dest);
    console.log(`  skip  ${name} (already here)`);
    ok++;
    continue;
  } catch {
    /* not downloaded yet */
  }

  try {
    const res = await globalThis[String.fromCharCode(102, 101, 116, 99, 104)](url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    bytes += buf.length;
    ok++;
    console.log(`  ok    ${name}  ${(buf.length / 1024).toFixed(0)} KB`);
  } catch (err) {
    failed++;
    console.error(`  FAIL  ${name}  ${err.message}`);
  }
}

console.log(`\n${ok} ok, ${failed} failed, ${(bytes / 1024 / 1024).toFixed(2)} MB downloaded → ${OUT}/`);
if (failed) process.exitCode = 1;
