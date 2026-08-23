# Oju portfolio — stack recommendation

Decision date: 2026-08-23. Context: editorial design direction (Locomotive-style),
homepage + case study templates already designed.

## The framing that decides everything

The portfolio is a **work sample**, not just a brochure. Oju sells engineering as
half its offer, and technical prospects open devtools. A slow site, a 400KB JS
bundle, or a no-code footer undercuts the pitch more than any copy can repair.
So the stack is judged on two axes at once: shipping speed AND what it signals.

That single fact rules out the otherwise-sensible fast option — see "What not to
do" below.

## Recommendation

| Layer | Pick | Why |
|---|---|---|
| Framework | **Astro 5** | Zero JS by default. The design is ~95% static editorial; only the work filter and hover previews need interactivity, and those become islands. |
| Styling | **Tailwind v4**, tokens in `@theme` | The design has ~6 tokens and 3 fonts — maps to `@theme` almost 1:1. Vanilla CSS with custom properties is defensible for a solo build; Tailwind wins once more than one person touches it. |
| Content | **Content collections** (MDX + typed frontmatter) | Schema matches the case-study meta sidebar exactly: client, sector, services, team, duration, year, results[], stack{}. Type errors at build time beat broken pages. |
| CMS | **None at launch.** Keystatic when needed | Git-backed, no service, no monthly cost, gives a non-dev an editing UI over the same MDX. Do NOT reach for Sanity/Contentful for six projects. |
| Images | `astro:assets` + sharp, AVIF/WebP, responsive srcset | Case studies are image-heavy. Unoptimised images are the single most likely way the performance story dies. |
| Fonts | **Self-hosted**, subset | Nohemi (display, hand-supplied) + Archivo + Space Mono. See the diacritics trap below. |
| Hosting | **Cloudflare Pages** | Better African edge presence than Vercel — matters for a Lagos studio serving local and international traffic. Cheaper at every tier. |
| Motion | **Motion One** (or GSAP if the team already knows it), per-page | Oju sells motion design; the site should show some. Load it only where used, honour `prefers-reduced-motion`. |
| Analytics | **Plausible** or Umami | No cookie banner needed — which is itself a design win, not just a privacy one. |
| Forms | Cloudflare Pages Function → email | One file. Do not add a backend for a contact form. |

## The diacritics trap — read this before subsetting fonts

The design uses `Ojú` and `Ojú-ìwé`. Default font subsetting (`latin`) drops or
mangles `ú` and `ì` in some pipelines, and the studio's own name renders wrong.

- Subset to **`latin` + `latin-ext`**, minimum.
- Verify `Ojú-ìwé` renders in all three faces before launch — Instrument Serif,
  Archivo, Space Mono.
- If Yoruba tone marks or dot-below characters (`ọ`, `ẹ`, `ṣ`) ever enter the copy,
  they are COMBINING marks — check them separately, they fail where precomposed
  characters pass.

## Performance budget (enforce in CI)

Set these as hard gates, because they are the sales argument:

- Lighthouse Performance ≥ 98 on mobile, throttled
- JS shipped on the homepage: **< 20KB** gzipped
- LCP < 1.5s on Slow 4G
- Total page weight, homepage: < 500KB including fonts and images

If a feature cannot fit the budget, the feature loses. A studio that ships a slow
portfolio has argued against itself.

## Make the repo public

Free credibility, zero cost — prospects can read the code, and almost no
competitor does this. Only worth it if the code is genuinely clean: clear commits,
a real README, no committed secrets, no `final_v2_FIXED` branches.

If the code is not clean, keep it private and fix it before flipping the switch.

## What NOT to do

**Framer or Webflow.** For most studios this would be the right call — fast,
designer-controlled, no build step. For Oju it is actively self-defeating: half
the pitch is "we build software", and a prospect who checks the stack finds you
didn't build your own site. The two days saved cost more than they save.

**Next.js.** Not wrong, and defensible if you want the site to double as a demo of
the client stack. But it ships a React runtime the design never needs, and the App
Router's complexity buys nothing for nine static pages.

**A CMS on day one.** Six projects. Files are fine. Add Keystatic the first time
someone who cannot use git needs to publish, not before.

## Build order

1. Scaffold Astro + Tailwind v4, tokens from the design canvases
2. Self-host and verify fonts (diacritics check)
3. Homepage — static, no filter yet
4. Content collection schema + one real case study end to end
5. Work index + discipline filter (first island)
6. Remaining case studies
7. Perf gates in CI, then motion polish

Ship steps 1–4 before writing any more copy. One complete case study teaches more
about the schema than three half-finished ones.
