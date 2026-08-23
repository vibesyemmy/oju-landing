#!/usr/bin/env node
/**
 * Glyph-coverage check for the hand-supplied display font.
 *
 * A display face with no "ú" renders Ojú in two typefaces — the fallback kicks
 * in mid-word and it looks like a bug, because it is one. Demo and trial cuts
 * are routinely stripped to basic Latin, so this is checked, not assumed.
 *
 *   node scripts/check-font.mjs [path/to/font.woff2 ...]
 *
 * With no arguments it checks every font file in public/fonts/.
 * Exits non-zero if a REQUIRED glyph is missing, so CI can gate on it.
 */
import * as fontkit from 'fontkit';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const FONT_DIR = 'public/fonts';

/** Characters the display font actually has to render on this site. */
const REQUIRED = {
  'Uppercase':      [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
  'Lowercase':      [...'abcdefghijklmnopqrstuvwxyz'],
  'Digits':         [...'0123456789'],
  'Punctuation':    [...'.,:;!?()[]/&%-'],
  'Yoruba (name)':  [...'úìéÚÌÉ'],
  'Typographic':    ['’', '“', '”', '—'], // ' " " —
};

/** Nice to have — warn, don't fail. */
const OPTIONAL = {
  'Yoruba (extended)': [...'ẹọṣẸỌṢàèòáéóÀÈÒÁÉÓ'],
  'Currency':          [...'₦$€£'],
};

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : existsSync(FONT_DIR)
    ? readdirSync(FONT_DIR).filter((f) => /\.(woff2?|otf|ttf)$/i.test(f)).map((f) => join(FONT_DIR, f))
    : [];

if (files.length === 0) {
  console.log(`No font files in ${FONT_DIR}/.`);
  console.log('The site is falling back to Instrument Serif — which is fine, but');
  console.log('it means the display face is not actually in use yet.');
  process.exit(0);
}

let failed = false;

for (const file of files) {
  let font;
  try {
    font = fontkit.openSync(file);
  } catch (err) {
    console.error(`\n✗ ${file}\n  Could not read: ${err.message}`);
    console.error('  If this is woff2, try checking the source OTF/TTF instead.');
    failed = true;
    continue;
  }

  const name = font.familyName ?? '(unnamed)';
  const sub = font.subfamilyName ? ` ${font.subfamilyName}` : '';
  console.log(`\n${file}`);
  console.log(`  Family: ${name}${sub}   Glyphs: ${font.numGlyphs}`);

  const report = (groups, tier) => {
    for (const [group, chars] of Object.entries(groups)) {
      const missing = chars.filter((c) => !font.hasGlyphForCodePoint(c.codePointAt(0)));
      if (missing.length === 0) {
        console.log(`  ✓ ${group}`);
      } else if (tier === 'required') {
        failed = true;
        console.log(`  ✗ ${group} — missing ${missing.length}: ${missing.join(' ')}`);
      } else {
        console.log(`  ~ ${group} — missing ${missing.length}: ${missing.join(' ')}`);
      }
    }
  };

  report(REQUIRED, 'required');
  report(OPTIONAL, 'optional');
}

if (failed) {
  console.error('\nMissing required glyphs.');
  console.error('Options: buy the full family, restrict the display face to ASCII-only');
  console.error('copy, or choose a different display face. Do not ship as-is — the');
  console.error('studio name would render in two typefaces.\n');
  process.exit(1);
}

console.log('\nAll required glyphs present.\n');
