#!/usr/bin/env node
/**
 * Pulls artwork out of the portfolio PDF.
 *
 * Extracting embedded images is the wrong tool here. On the advert pages each
 * piece is a photograph with the headline set as vector type on top, so
 * pdfimages returns the photo with the words missing — the half that carries
 * the work. Rendering the page and cutting the finished artwork out of it keeps
 * type and image together.
 *
 * The cutting is automatic. Every advert page is a set of rectangles on a flat
 * ground, so the ground colour is read from the page corners and any connected
 * region that differs from it is a candidate. Filtering on size and aspect then
 * drops rules, captions and stray marks.
 *
 *   node scripts/extract-portfolio-media.mjs <pdf> <outdir> [--pages 15-28]
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const pdf = args[0];
const out = args[1] || 'portfolio-media';
const pagesArg = (args[args.indexOf('--pages') + 1] || '15-28').split('-').map(Number);

if (!pdf) {
  console.error('usage: node scripts/extract-portfolio-media.mjs <pdf> <outdir> [--pages 15-28]');
  process.exit(1);
}

const [first, last] = pagesArg;
const raw = join(out, '_pages');
rmSync(out, { recursive: true, force: true });
mkdirSync(raw, { recursive: true });

console.log(`rendering pages ${first}-${last} at 200dpi…`);
execFileSync('pdftoppm', ['-png', '-r', '200', '-f', String(first), '-l', String(last), pdf, join(raw, 'p')], {
  stdio: 'ignore',
});
console.log(`  ${readdirSync(raw).length} pages rendered`);

/* Pillow reads pixels; Node does not. */
const py = String.raw`
import sys, os, glob
from PIL import Image

raw, out = sys.argv[1], sys.argv[2]
MIN_W, MIN_H = 260, 260

def ground(im):
    # The page ground, sampled from the four corners. Advert pages sit on a flat
    # colour; taking the majority of the corners ignores a piece that happens to
    # reach one of them.
    w, h = im.size
    pts = [(2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3)]
    vals = [im.getpixel(p) for p in pts]
    return max(set(vals), key=vals.count)

def runs(mask, length, axis_len):
    # Collapse a boolean profile into (start, end) spans, ignoring hairlines.
    spans, start = [], None
    for i, v in enumerate(mask):
        if v and start is None: start = i
        elif not v and start is not None:
            if i - start >= length: spans.append((start, i))
            start = None
    if start is not None and axis_len - start >= length: spans.append((start, axis_len))
    return spans

total = 0
for path in sorted(glob.glob(os.path.join(raw, '*.png'))):
    page = os.path.basename(path).split('-')[-1].split('.')[0]
    im = Image.open(path).convert('RGB')
    w, h = im.size
    bg = ground(im)
    px = im.load()

    def differs(x, y):
        p = px[x, y]
        return abs(p[0]-bg[0]) + abs(p[1]-bg[1]) + abs(p[2]-bg[2]) > 40

    # Sample on a grid rather than every pixel: 200dpi pages are ~2300px wide
    # and full resolution buys nothing for finding block boundaries.
    STEP = 4
    cols = [any(differs(x, y) for y in range(0, h, STEP * 4)) for x in range(0, w, STEP)]
    col_spans = [(a * STEP, b * STEP) for a, b in runs(cols, MIN_W // STEP, len(cols))]

    n = 0
    for (x0, x1) in col_spans:
        rows = [any(differs(x, y) for x in range(x0, x1, STEP * 4)) for y in range(0, h, STEP)]
        for (a, b) in runs(rows, MIN_H // STEP, len(rows)):
            y0, y1 = a * STEP, b * STEP
            cw, ch = x1 - x0, y1 - y0
            if cw < MIN_W or ch < MIN_H: continue
            ratio = cw / ch
            if ratio > 6 or ratio < 0.16: continue   # a rule, not a piece
            if cw * ch > 0.92 * w * h: continue      # the whole page
            im.crop((x0, y0, x1, y1)).save(os.path.join(out, f'p{page}-{n:02d}_{cw}x{ch}.png'))
            n += 1
    total += n
    print(f'  page {page}: {n} piece(s)')

print(f'{total} pieces total')
`;

execFileSync('python3', ['-c', py, raw, out], { stdio: 'inherit' });
console.log(`\nwrote to ${out}/. Rendered pages left in _pages/ for anything the cutter missed.`);
