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

  // The landing page's client row serves each mark as its own file rather than
  // one composited strip, so these come down as-is. Vector where the site has
  // vector. The download*.png names are the site's, not descriptive.
  { client: 'Lingawa', path: '/logos/lingawa-CpilJqMO.svg', note: 'vector, in use' },
  { client: 'Sabi', path: '/logos/sabi-CeIUrm2i.svg', note: 'vector, in use' },
  { client: 'Hydrogen', path: '/logos/download.png', note: '128x32 — superseded by the repo vector' },
  { client: 'Circuit', path: '/logos/download (1).png', note: 'not a listed Oju client' },
  { client: 'Kobo', path: '/logos/download (2).png', note: 'not a listed Oju client' },
  { client: 'Arena Gaming', path: '/logos/download (3).png', note: 'not a listed Oju client' },
  { client: 'Tunnel', path: '/logos/download (4).png', note: 'not a listed Oju client' },
  { client: 'Lotti', path: '/logos/lotti-1.svg', note: 'not a listed Oju client' },
];

await mkdir(OUT, { recursive: true });

for (const { client, path, note } of WANTED) {
  const ext = path.slice(path.lastIndexOf('.'));
  const stem = path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.')).replace(/[^\w-]/g, '');
  const name = `${client.toLowerCase().replace(/\s+/g, '-')}-${stem}${ext}`;
  try {
    const res = await fetch(BASE + encodeURI(path));
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
