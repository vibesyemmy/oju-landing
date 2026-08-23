# Fonts served from here

Only one file ships from this directory:

    nohemi-variable.woff2    36.7 KB — variable, 100–900, subset to latin + latin-ext

Everything else (Archivo, Space Mono) comes from Fontsource and is imported in
`src/layouts/Base.astro`.

## Nohemi

Designed by Rajesh Rajput. Free for commercial and personal use, "pay what you
want" — https://www.behance.net/gallery/168183377/NOHEMI-Typeface-Free-Variable-9-Styles

**Free to use is not free to redistribute.** The original download lives in
`vendor/fonts/nohemi-source/` and is gitignored. If you make this repo public,
this subset file is still a font binary in a public repo — check the EULA that
shipped with the download, or move the file to deploy-time injection.

## Regenerating the subset

Source: `vendor/fonts/nohemi-source/Nohemi-VF-*.ttf`

```bash
python3 -m fontTools.subset vendor/fonts/nohemi-source/Nohemi-VF-*.ttf \
  --output-file=public/fonts/nohemi-variable.woff2 \
  --flavor=woff2 --layout-features='*' \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0100-017F,U+0180-024F,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD"
```

Needs `pip3 install fonttools brotli`. Bump the `?v=` in `src/styles/fonts.css`
after regenerating, since this file is not content-hashed.

Once the design settles on a single display weight, a static cut is ~20 KB
instead of 36.7 KB.

## Coverage

`npm run check:font` verifies the glyphs this site actually needs. Nohemi passes
(380 glyphs), with two known gaps:

| Missing | Impact |
|---|---|
| `ẹ ọ ṣ` | Full Yoruba orthography. Not used today; `Ojú` and `Ojú-ìwé` need only precomposed accents, which are present. If real Yoruba copy with subdots appears, it falls back to Archivo. |
| `₦` | Naira sign. Only matters if prices appear in display type. |

Run the checker before adopting any new display face. The previous candidate
looked fine and turned out to contain 58 glyphs — no digits, no accents, so the
studio's own name rendered in two typefaces.
