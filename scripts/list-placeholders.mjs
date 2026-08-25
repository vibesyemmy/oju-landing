#!/usr/bin/env node
/**
 * Lists every invented value on the site.
 *
 *   npm run placeholders
 *
 * Why this exists: the site used to carry visible [BRACKETS], which made
 * unfinished content impossible to ship by accident — it looked broken. That
 * safety net is gone now that the brackets are filled with plausible content,
 * so this replaces it. Fabricated values are tagged `PLACEHOLDER:` at their
 * declaration and this walks the source to collect them.
 *
 * Add a marker whenever you invent something. Remove it when the value
 * becomes true.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOTS = ['src', 'functions', 'public'];
const SKIP = new Set(['node_modules', 'dist', '.astro', '.git', 'assets']);
const EXT = /\.(astro|ts|tsx|js|mjs|mdx|md|css|json)$/;

/** Things that are definitely still unfinished, marker or not. */
const HARD = [
  { re: /\[[A-Z][A-Z0-9 …$%×–\/+.-]{1,40}\]/g, note: 'unfilled bracket' },
];

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (SKIP.has(e.name)) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (EXT.test(e.name)) yield full;
  }
}

const found = new Map();
const add = (file, line, text, kind) => {
  if (!found.has(file)) found.set(file, []);
  found.get(file).push({ line, text, kind });
};

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const src = await readFile(file, 'utf8');
    const lines = src.split('\n');

    lines.forEach((l, i) => {
      const marker = l.match(/PLACEHOLDER:\s*(.*?)\s*(\*\/|-->|$)/);
      if (marker) add(relative('.', file), i + 1, marker[1] || '(unlabelled)', 'marked');

      // TODOs are unfinished facts too. Without these the report can claim
      // the site is real while an unregistered domain sits on the contact page.
      const todo = l.match(/(?:TODO|FIXME):?\s*(.*?)\s*(\*\/|-->|$)/);
      if (todo) add(relative('.', file), i + 1, todo[1] || '(unlabelled)', 'todo');

      for (const { re, note } of HARD) {
        // Skip Tailwind arbitrary values and code, which legitimately use brackets.
        if (/class=|class:list|grid-cols|text-\[|max-w-\[|widths|aspect-|:\s*\[/.test(l)) continue;
        const hits = l.match(re);
        if (hits) add(relative('.', file), i + 1, hits.join(' '), note);
      }
    });
  }
}

if (found.size === 0) {
  console.log('\nNothing flagged. Note this only sees PLACEHOLDER:, TODO: and\n[BRACKET] markers — it cannot vouch for facts nobody marked.\n');
  process.exit(0);
}

let marked = 0;
let hard = 0;
let todo = 0;
console.log('\nUnfinished content still on the site\n');

for (const [file, items] of [...found.entries()].sort()) {
  console.log(`  ${file}`);
  for (const it of items) {
    const tag = it.kind === 'marked' ? '·' : it.kind === 'todo' ? '›' : '!';
    if (it.kind === 'marked') marked++;
    else if (it.kind === 'todo') todo++;
    else hard++;
    console.log(`    ${tag} ${String(it.line).padStart(4)}  ${it.text}`);
  }
  console.log('');
}

console.log(`  ${marked} invented, ${todo} outstanding, ${hard} unfilled bracket${hard === 1 ? '' : 's'}`);
console.log('  · = invented but deliberate   › = known outstanding   ! = visibly unfinished\n');

// Informational: never fails a build. The point is visibility, not a gate.
