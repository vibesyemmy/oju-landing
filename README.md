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

## Case-study imagery

`src/assets/wall/` holds only images a project's `gallery` actually claims —
six, one or two per case study. Every tile on the homepage wall links to the
case study behind it; there are no decorative fillers.

Adding work: drop the image in `src/assets/wall/`, list it under `gallery:` in
the project's `.mdx`, and the wall and work index pick it up. An image nothing
claims is simply unused, so delete it rather than leaving it.

`node scripts/fetch-wall-images.mjs` restores the full original set from
opeyemi.app if you need images that were removed.

## Contact form — needs one env var

The enquiry form posts to an Astro API route at `src/pages/api/contact.ts`.
It is the only route with `prerender = false`, so it is the single serverless
function in an otherwise static build. It requires **`CONTACT_WEBHOOK_URL`** in
the Vercel project's environment variables — point it at anything that accepts a JSON POST
(Resend, Postmark, a Slack incoming webhook, a Zapier catch hook).

Without it the form returns 503 and tells the visitor to email instead. It does
**not** pretend to succeed: a form that silently swallows enquiries is worse than
no form, because you never find out it broke.

The Function never runs under `astro dev` — submitting locally always shows the
failure path. `npm run test:fn` covers it instead (validation, honeypot,
not-configured, upstream failure, and both no-JS redirects), and CI runs it.

## Invented content

The site no longer shows visible `[BRACKETS]`, which means unfinished content
can now ship without looking broken. That safety net is replaced by a marker
convention: anything fabricated is tagged `PLACEHOLDER:` where it is declared.

```bash
npm run placeholders
```

lists every one, with file and line. Remove the marker when the value becomes
true. Add one whenever you invent something.

Nothing is invented any more — the case studies are real and the team section
is hidden rather than fictional. What remains is three known-outstanding items,
all of which the report lists: the `ojustudio.com` email is not
registered, there is no `/og.png` so links unfurl bare, and the client strip has
no names in it.

The report only sees `PLACEHOLDER:`, `TODO:` and `[BRACKET]` markers. It cannot
vouch for a fact nobody marked, so mark them as you go.

## Before launch

- [ ] **Replace the team in `src/data/site.ts`** — Adunni Bakare, Chidi Okafor
      and Temilade Adeyemi are invented. They read as real people, which makes
      them the most dangerous placeholder here: every other one is a visible
      `[BRACKET]`, this one is not. Set `TEAM = []` to hide the section instead.
- [ ] Replace the hero wall imagery in `src/assets/wall/` — currently placeholders
- [ ] Add MX records for `ojustudio.com`. The domain resolves and serves the
      site, but publishes no MX, so `hello@ojustudio.com` bounces — and that
      address is the fallback shown whenever the contact form fails.
- [ ] Work through `npm run placeholders` until it reports none — they are real facts still owed, not styling
- [ ] Real project data in `src/content/work/` (delete `project-one.mdx`)
- [ ] `CLIENTS` in `src/data/site.ts` — empty array currently hides the strip
- [ ] `/og.png` at 1200×630
- [ ] Real domain in `astro.config.mjs` (`SITE`)
- [ ] Set `CONTACT_WEBHOOK_URL` in the Vercel project
- [ ] Set `PUBLIC_BRANDFETCH_CLIENT_ID` in Vercel, or add the last two logos as
      files — Kairos Capital and GeoTravel render as wordmarks without either
- [x] `SITE` points at `https://www.ojustudio.com`. The apex 308-redirects to
      www, so www is the canonical host.
- [ ] Contact form endpoint

## Where the portfolio PDF landed

`scripts/extract-portfolio-media.mjs` cuts artwork out of the portfolio deck.
It renders pages and segments them rather than running `pdfimages`, because on
the advert pages each piece is a photograph with the headline set as vector type
over it — extracting embedded images returns the photo with the words missing,
which is the half that carries the work.

The material split three ways:

- **Case studies** (`src/content/work`) — unchanged. Five projects with a
  problem, an approach and an outcome.
- **Brand and interface work** (`SELECTED_WORK`) — eight projects that have a
  brief but not a case study, shown as cards on `/work`. Deliberately no detail
  pages: there is a paragraph behind each, and a page built on a paragraph reads
  thinner than a good card, which then teaches visitors that clicking through is
  not worth it.
- **Campaigns** (`CAMPAIGNS`, `/work/campaigns`) — 24 advertising pieces across
  12 brands, as a gallery. No briefs exist for these, so they are shown as work
  rather than dressed as case studies.

The three "link to project" URLs in the deck are **Figma prototypes**, not
shipped sites, and are labelled as prototypes for that reason. NEPAL Oil & Gas's
link 404s and is omitted.

## Known gaps

- With one project, "Next project" on a case study links to itself. Correct with 2+.
- `hero` is optional in the schema so the scaffold builds without assets. Make it
  required once real images land.
