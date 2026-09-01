# Client logos

Drop a file here and reference it from `CLIENTS` in `src/data/site.ts`:

```ts
{ name: 'GTBank', logo: 'gtbank.svg' }
```

A client with no `logo` renders its name as a wordmark instead, so the row
stays complete while logos are still being collected.

## What to supply

- **SVG preferred.** Scales to any row height, weighs almost nothing.
- **PNG at 2x otherwise** — at least 400px wide, with real transparency.
- **Horizontal lockup**, not the stacked or icon-only variant. The row is one
  line, so tall marks get scaled down until they are illegible.
- **Trim the whitespace.** Padding baked into the file makes that logo look
  smaller than its neighbours no matter what the CSS says.

## What the portfolio PDF can and cannot give you

`scripts/extract-logos.mjs` pulls logo candidates out of a PDF. It recomposites
each image with its soft mask, because pdfimages writes the two separately and a
naive extract leaves every logo on an opaque rectangle.

It works, and on the Akinyemi portfolio it recovered exactly one usable client
logo: KFC. The rest of the marks in that document are **vector artwork** — drawn
with PDF path operators rather than embedded as bitmaps — so they do not appear
in a raster extract at all. Of 427 images, 15 had real transparency and 14 of
those were laptop shadows, photo cutouts and confetti.

So the script is worth running against any new PDF, but do not expect it to
supply a logo wall. Source the rest from the clients' own brand assets, or from
the original project files if the studio still holds them.

## Sizing

The row does not use one height for everything. These marks run from 0.65:1
(Consolidated Hallmark, stacked) to 6.7:1 (FundPatients, a long wordmark); at a
flat 34px that is a 22px mark beside a 228px one, and the stacked mark reads as
a speck though both are nominally "the same size".

`opticalHeight()` in `ClientMarquee.astro` pulls heights part-way toward equal
*area* — an exponent well under the 0.5 that would equalise it outright, then
clamped to 30–48px. It reads each file's own dimensions, so replacing a logo
re-balances it with no flag to remember.

**Tiles are exempt.** That whole argument assumes a mark floating in space,
where a square outline encloses mostly nothing. A tile is ink edge to edge, so
the 48px square that rescues a stacked mark makes a tile the heaviest object in
the row. Tiles stay at the 34px baseline. Flag them with `tile: true`; both
GTBank and Union Bank are ones.

## Rendering

The row renders every logo in a single ink tone at a uniform optical height,
because eighteen brand palettes side by side would fight both each other and
this site. Colour returns on hover.

## Where the current logos came from

`scripts/fetch-client-logos.mjs` pulls candidates from Wikimedia Commons —
chosen because every file there carries a licence and a provenance trail, which
the logo-aggregator sites do not. It throttles to one request a second; Commons
is a free service and will 429 you otherwise.

It does not decide anything. The top hit for a bank is as likely to be a
superseded mark as the current one, so every candidate needs looking at.

| Logo | Source | Licence |
|---|---|---|
| `gtbank.svg` | File:GTBank logo.svg | Public domain |
| `mtn.svg` | File:MTN 2022 logo.svg | Public domain |
| `sterling-bank.png` | File:Sterling Bank Logo Straight.png | Public domain |
| `kfc.png` | Extracted from the portfolio PDF | — |
| `union-bank.png` | File:Union Bank of Nigeria Logo.png | CC BY 4.0 |
| `gangan.png` | opeyemi.app brand board, keyed to transparency | own work |
| `sabi.svg` | opeyemi.app `/logos/` — vector, as served | own work |
| `lingawa.svg` | opeyemi.app `/logos/` — vector, as served | own work |
| `hydrogen.svg` | Hydrogen-booking repo, `public/HydrogenLogo.svg` | own work |
| `vfd.png` | supplied | own work |
| `consolidated-hallmark.svg` | supplied | own work |
| `harcourt.svg` | supplied | own work |
| `insidify.svg` | supplied | own work |
| `country-homes.svg` | supplied | own work |
| `belvia.svg` | supplied | own work |
| `fundpatients.svg` | supplied | own work |

The opeyemi.app landing page serves its client row as individual logo files
rather than compositing them into a screenshot, so those are a straight
download — no keying, no tracing. `scripts/fetch-portfolio-logos.mjs` covers it.

**Do not strip a Figma export's `fill="white"` rect on sight.** Figma writes the
clipPath's own rect that way, inside `<defs>`. Removing it empties the clip path
and the whole mark disappears while still reporting as a loaded image with a
real bounding box — it renders nothing. Check whether the rect sits inside
`<clipPath>` before touching it. A true background plate sits in the body,
before the paths.

**Rejected: Union Bank.** The Commons file is correct — leaping horse,
`unionbank` wordmark — but it is a solid blue tile with no transparency. Among
marks that float, it renders as a grey block. Left as a wordmark until a
horizontal transparent variant turns up.

**Not on Commons:** VFD Microfinance Bank, Consolidated Hallmark Insurance,
Kairos Capital. Too small to have articles. These need the client's own asset,
or the original project files.

**Still wordmarks:** Consolidated Hallmark Insurance, NEPAL Oil & Gas, Country
Homes, Butchers & Bakers. No domain either, so Brandfetch cannot reach them.

## Lifting a logo off a brand board

`scripts/fetch-portfolio-logos.mjs` pulls logo assets published on opeyemi.app.
A website serves its images as files, so unlike the PDF the marks are reachable.

They arrive as spec boards, not bare logos — a lockup shown light and dark side
by side, or an app icon at five sizes. Gangan was lifted from its lockup board:
crop well inside the neighbouring panel, key the black mark to transparency by
inverting luminance (which preserves antialiasing where a threshold shreds it),
then take the bounding box from *strong* ink only so registration marks do not
inflate it.

Not everything on a board is a logo. Lingawa's "new brand" file is phone
screenshots on pink, and Gangan's main logo file is a wall of applications.
Look before cropping.

## Brandfetch, as a gap-filler only

Self-hosted logos always win. Brandfetch fills gaps for clients that have a
`domain` and no local file, and only when `BRANDFETCH_CLIENT_ID` is set.

The name has no `PUBLIC_` prefix, which matters for how it is read. That prefix
exists so client-side JavaScript can pull a value out of `import.meta.env`; this
one is interpolated into the markup by `ClientMarquee.astro` at build time, so
it is in the HTML before a browser ever sees the page. Without the prefix Vite
does not inject it into `import.meta.env` at all, so the component reads
`process.env` first — that is what lets a value set in the Vercel dashboard
reach the build. The `PUBLIC_` name is still accepted as a fallback.
Without the key, or when a logo is missing, the row shows a wordmark.

**Not working — the credential is rejected.** Tested from the live domain in a
real browser: `nike.com` and `stripe.com` fail exactly as the two client domains
do, and a client domain fails even with the fallback parameter removed, where
Brandfetch's own default logo would otherwise appear. That rules out missing
brand coverage. Failing identically from localhost and from production rules out
referer and hotlink blocking. What is left is the `c=` value.

Most likely the wrong credential type. Brandfetch ship two products — the Brand
API, which uses a long secret key, and Logo Link, which uses a short client ID
in this `c=` parameter. The configured value is 86 characters, the shape of the
former. Look for a Logo Link client ID at developers.brandfetch.com first.

Until then every remote logo falls back to a wordmark, which is the correct
failure. Adding the two logo files removes the dependency entirely.

Two things to keep in mind if it does light up:

- `fallback/404` is mandatory. The default fallback for an icon is *Brandfetch's
  own logo*, so an unrecognised domain would silently put their mark in the
  client wall as though it were a client.
- Only add a `domain` you can evidence. A wrong guess that happens to belong to
  a real company shows a stranger's logo, which is worse than a wordmark.

### The tradeoff this accepts

Their Logo API fills gaps for free and keeps a mark current if a client
rebrands — a real advantage, since a stale logo is worse than no logo. But their
usage guidelines require **hotlinking**:
programmatic access is explicitly not permitted, caching needs a sales
conversation, and there is a dedicated `automated_traffic` error for requests
that do not come from an `<img>` tag in a live page.

So these images sit on the homepage's critical path from a third-party origin,
outside Astro's pipeline, and send viewer IPs to Brandfetch. That is the cost of
filling the gaps this way. Self-hosted files remain preferable wherever they can
be obtained — replacing a remote logo is just adding the file and dropping the
`domain`.
