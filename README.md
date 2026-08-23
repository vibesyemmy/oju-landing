# Ojú Studio

Portfolio site for Ojú — a design and product studio in Lagos.

Astro 5 · Tailwind v4 · MDX content collections · static output.

```bash
npm install
npm run dev      # dev server
npm run build    # static build to dist/
npm run check    # type + content schema check
```

## Where things live

| Path | What |
|---|---|
| `src/styles/global.css` | **Design tokens.** Single source of truth — colours, fonts, display type scale. Change values here, never in a component. |
| `src/data/site.ts` | Site copy that isn't a page: nav, capabilities, footer columns, client list. |
| `src/content.config.ts` | Case study schema. A typo in a project's frontmatter fails the build. |
| `src/content/work/*.mdx` | One file per project. Frontmatter drives the structured sections; the body carries the narrative. |
| `src/components/WorkWall.astro` | The homepage work section. Tiles come from each project's `gallery`; unassigned placeholders pad the wall. |
| `src/components/WorkIndex.astro` | The filterable text index — **`/work` only**. A grid is better for looking, a list better for finding; they are not duplicates. |
| `src/components/EyeMark.astro` | The Ojú eye. Pointer tracking, blink, scroll dilate. No animation library. |

Design source of truth is the two canvases:
[homepage](https://claude.ai/code/artifact/caaea0d6-b1cd-4f45-807c-45ec1e5f9568) ·
[case study](https://claude.ai/code/artifact/5044d101-3899-4e7a-a0d8-91889250a551).

## Fonts — read before touching

| Role | Face | Source |
|---|---|---|
| Display | **Nohemi** (variable, 100–900) | Hand-supplied, subset in `public/fonts/` |
| Text | **Archivo** | Fontsource, self-hosted |
| Labels | **Space Mono** | Fontsource, self-hosted |

Imported in `src/layouts/Base.astro`. Nohemi is preloaded — it paints the hero,
which is the LCP element.

Archivo and Space Mono each import **both** `latin` and `latin-ext`, and they
carry different things:

| Subset | Range | Carries |
|---|---|---|
| `latin` | U+0000–00FF | `ú` `ì` `é` `à` — everything in **Ojú** and **Ojú-ìwé** |
| `latin-ext` | U+0100–024F, U+1E00–1EFF | `ẹ` `ọ` `ṣ` — full Yoruba orthography |

So `latin` is what keeps the studio name whole; `latin-ext` is what you will need
the first time real Yoruba copy with subdots appears.

**Nohemi has no italic.** `<em>` inside display type is styled as weight 600 with
`font-synthesis: none`, because a sheared geometric sans reads as a rendering
fault. See `src/styles/global.css`.

**Before adopting any new display face, run `npm run check:font`.** See
`public/fonts/README.md` for why that check exists.

## Motion

No animation library — CSS keyframes, a scroll-driven timeline where supported,
and ~500 bytes of hand-written pointer maths. Total JS on the homepage is ~1 KB.

- **Hero reveal** — each line rises from its own clipped box. The
  padding/negative-margin pair on `.hero__line` is load-bearing: line-height is
  0.94, so plain `overflow: hidden` shears the descender off the "g" in "design".
- **The eye** (`EyeMark.astro`) — set as a character, not a graphic. Sized in `em`
  so it tracks the type ramp and needs no breakpoint of its own. Pupil follows the
  pointer with distance falloff; blinks on a 7s cycle; iris dilates on scroll via
  `animation-timeline: scroll()` where supported, and simply doesn't where not.
- Everything is disabled under `prefers-reduced-motion`, including the pointer
  listener, which is never attached.

If you add motion elsewhere, keep it inside the JS budget below — that budget is
part of the sales argument, not a formality.

## Performance budget

Enforced in CI (`lighthouserc.json`), not merely reported:

| Metric | Gate | Current |
|---|---|---|
| Lighthouse performance | ≥ 98 | — |
| Client JS, homepage | < 20 kB gz | **1.0 kB** |
| LCP | < 1.5 s | — |
| Total page weight | < 512 kB | — |

## Placeholder imagery — must be replaced

The hero wall (`src/assets/wall/`) is filled with the author's own portfolio
pieces, pulled from opeyemi.app by `scripts/fetch-wall-images.mjs`. **None of it
is Ojú's work.** It exists so the wall reads as designed before Ojú has case
studies of its own.

How the wall fills: every image listed in a project's `gallery` frontmatter
becomes a **linked** tile that opens that case study. Anything left in
`src/assets/wall/` that no project claims is used as unlinked padding, hidden
from assistive tech, purely to keep the wall full. As real galleries land they
push the padding out — delete the leftover files once nothing needs padding.

Some of these images show client projects. Check you still have the right to
show a given piece before it ships on a company site rather than a personal one.

## Before launch

- [ ] Replace the hero wall imagery in `src/assets/wall/` — currently placeholders
- [ ] Replace every `[BRACKET]` — they are real facts still owed, not styling
- [ ] Real project data in `src/content/work/` (delete `project-one.mdx`)
- [ ] `CLIENTS` in `src/data/site.ts` — empty array currently hides the strip
- [ ] `/og.png` at 1200×630
- [ ] Real domain in `astro.config.mjs` (`SITE`)
- [ ] Write `/studio`, `/services`, `/contact` — currently stubs
- [ ] Contact form endpoint

## Known gaps

- With one project, "Next project" on a case study links to itself. Correct with 2+.
- `hero` is optional in the schema so the scaffold builds without assets. Make it
  required once real images land.
