#!/usr/bin/env node
/**
 * Pulls client logo assets that exist as real files on opeyemi.app.
 *
 * Unlike the portfolio PDF — where the marks are vector artwork baked into page
 * layouts and unreachable by a raster extract — a website serves its images as
 * individual files. Where a case study published a logo, it can simply be
 * downloaded.
 *
 * Only a handful qualify. Most case-study imagery is screenshots and mockups
 * with the logo composited in, which is no more useful than the PDF was.
 *
 *   node scripts/fetch-portfolio-logos.mjs <outdir>
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = process.argv[2] || 'logo-candidates';
const BASE = 'https://opeyemi.app';

const WANTED = [
  { client: 'Gangan', path: '/gangan-logo.webp' },
  { client: 'Gangan', path: '/logo-symbol.webp', note: 'talking-drum symbol only' },
  { client: 'Gangan', path: '/logo-lock-up.webp', note: 'full lockup' },
  { client: 'Lingawa', path: '/lingawa/new-brand.webp' },
];

await mkdir(OUT, { recursive: true });

for (const { client, path, note } of WANTED) {
  const name = `${client.toLowerCase()}${path.replace(/^.*\//, '-').replace(/\.\w+$/, '')}.webp`;
  try {
    const res = await fetch(BASE + path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(join(OUT, name), buf);
    console.log(`  ok   ${name.padEnd(30)} ${(buf.length / 1024).toFixed(0)}KB${note ? '  — ' + note : ''}`);
  } catch (err) {
    console.log(`  FAIL ${name.padEnd(30)} ${err.message}`);
  }
}

console.log(`\nDownloaded to ${OUT}/. Look at them before using any — a file named`);
console.log('"logo" can still be a lockup on a coloured card rather than a bare mark.');
