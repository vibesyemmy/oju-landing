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

**Rejected: Union Bank.** The Commons file is correct — leaping horse,
`unionbank` wordmark — but it is a solid blue tile with no transparency. Among
marks that float, it renders as a grey block. Left as a wordmark until a
horizontal transparent variant turns up.

**Not on Commons:** VFD Microfinance Bank, Consolidated Hallmark Insurance,
Kairos Capital. Too small to have articles. These need the client's own asset,
or the original project files.

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
