#!/usr/bin/env node
/**
 * Pulls logo candidates out of a PDF.
 *
 * pdfimages writes an image and its soft mask as two separate files — an RGB
 * one followed by an L-mode one of identical dimensions. Recompositing the pair
 * gives back the transparency the PDF actually had, which is why a naive
 * extract produces logos sitting on opaque rectangles.
 *
 * Candidates are then filtered on the shape of a logo rather than the content:
 * wide-ish, not tiny, and mostly transparent. A photograph is opaque edge to
 * edge; a logo is a mark floating in empty space.
 *
 *   node scripts/extract-logos.mjs <pdf> <outdir>
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const [pdf, outDir = 'logo-candidates'] = process.argv.slice(2);
if (!pdf) {
  console.error('usage: node scripts/extract-logos.mjs <pdf> [outdir]');
  process.exit(1);
}

const raw = join(outDir, '_raw');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(raw, { recursive: true });

console.log('extracting…');
execFileSync('pdfimages', ['-png', pdf, join(raw, 'i')], { stdio: 'ignore' });

const files = readdirSync(raw).filter((f) => f.endsWith('.png')).sort();
console.log(`  ${files.length} raw images`);

// Pillow does the compositing and the filtering; it reads pixels, Node does not.
const py = `
import sys, os, glob
from PIL import Image

raw, out = sys.argv[1], sys.argv[2]
files = sorted(glob.glob(os.path.join(raw, "*.png")))
kept = []
i = 0
while i < len(files):
    a = Image.open(files[i])
    b = Image.open(files[i + 1]) if i + 1 < len(files) else None

    # An RGB image followed by a same-size L image is a base + its soft mask.
    if b is not None and a.mode in ("RGB", "P") and b.mode == "L" and a.size == b.size:
        img = a.convert("RGBA")
        img.putalpha(b.convert("L"))
        i += 2
    else:
        img = a.convert("RGBA")
        i += 1

    w, h = img.size
    if not (60 <= w <= 1400 and 20 <= h <= 700):
        continue

    alpha = img.getchannel("A")
    px = list(alpha.getdata())
    transparent = sum(1 for v in px if v < 24) / len(px)

    # A logo is a mark in empty space. Below ~12% transparent it is a photo or
    # a filled panel, not a mark worth keeping.
    if transparent < 0.12:
        continue

    name = f"cand-{len(kept):03d}_{w}x{h}_{int(transparent*100)}pct.png"
    img.save(os.path.join(out, name))
    kept.append((name, w, h, transparent))

print(f"  {len(kept)} candidates with real transparency")
for n, w, h, t in kept[:40]:
    print(f"    {n:38} {w}x{h}  {int(t*100)}% transparent")
`;

execFileSync('python3', ['-c', py, raw, outDir], { stdio: 'inherit' });

const kept = readdirSync(outDir).filter((f) => f.startsWith('cand-'));
console.log(`\nwrote ${kept.length} candidates to ${outDir}/`);
console.log('Raw extracts left in _raw/ in case a mask paired wrongly.');
