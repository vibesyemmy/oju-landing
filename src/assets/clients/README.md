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

## Self-hosted only

Brandfetch was wired in as a gap-filler and removed again. It never worked: the
credential was rejected for every domain including `nike.com`, and with the
fallback parameter dropped even Brandfetch's own default logo failed to render —
which ruled out brand coverage, referer checks and hotlink blocking alike. The
remaining suspect was the `c=` value: an 86-character secret where Logo Link
expects a short client ID, so most likely a Brand API key in a Logo Link slot.

Rather than chase that for two logos, both are being supplied as files. That
also restores the original preference — no third-party origin on the homepage's
critical path, no viewer IPs sent elsewhere, every image through Astro's
pipeline.

The `Client` type no longer carries a `domain` field, and `ClientMarquee` has no
remote branch. If a logo CDN is ever wanted again, `git log` has the whole
implementation.

Four clients still render as wordmarks: Kairos Capital, GeoTravel, NEPAL Oil &
Gas and Butchers & Bakers. That is the designed fallback, not a gap.
