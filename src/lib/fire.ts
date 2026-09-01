/**
 * The material both fires are made of.
 *
 * The cursor fire and the hero's wildfire are different simulations — one is a
 * carried ball with embers, the other a front burning along an edge — but they
 * have to be visibly the same substance. Everything that decides how heat looks
 * lives here so they cannot drift apart: the grid, the palette, the noise, the
 * compression and the banding.
 *
 * What each fire supplies for itself is only where the heat is.
 */

/** Cell pitch in CSS pixels. An 8px block in a 9px cell. */
export const CELL = 9;

export const WHITE = '#fffbe8';
export const YELLOW = '#ffe500';
export const ORANGE = '#ff8a1e';
export const RED = '#ff2f14';
export const BLUE = '#3757e8';
export const NAVY = '#151c6b';

/**
 * The classic 4×4 ordered-dither threshold map, normalised. A cell is drawn
 * when its heat clears the threshold at its own grid position, so neighbouring
 * cells switch on at different heats and an edge becomes a pattern rather than
 * a gradient. This is what makes both fires dissolve into loose cells instead
 * of ending at an outline.
 */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

/** The dither threshold at a grid position. Safe for negative coordinates. */
export const threshold = (gx: number, gy: number) =>
  BAYER[((gy % 4) + 4) % 4][((gx % 4) + 4) % 4];

export const hash = (x: number, y: number) => {
  const h = Math.imul(x * 374761393 + y * 668265263, 1274126177);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
};

/**
 * Value noise: hashed lattice, smoothstep between. Smooth enough that
 * translating it reads as flow rather than as a jump, which is what lets both
 * fires rise by moving the sample point instead of reseeding.
 */
export const noise = (x: number, y: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const top = a + (b - a) * u;
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  const bottom = c + (d - c) * u;
  return top + (bottom - top) * v;
};

/**
 * Accumulated heat has no ceiling — a dense tail piles a dozen embers into one
 * cell — so it is compressed into 0..1 before banding. Without this, coverage
 * and temperature are the same number: adding heat to make a fire denser only
 * drives every cell into the top band and it gets whiter instead of fuller.
 */
export const compress = (raw: number) => 1 - Math.exp(-raw * 1.15);

export type Band = { colour: string; alpha: number };

/**
 * Compressed heat to colour.
 *
 * White is deliberately hard to reach. The ground is cream, so a white-hot body
 * reads as a pale smear rather than an intense one — on this paper the hot end
 * of the palette is yellow, and white is only ever a spark at the centre. The
 * two coolest bands are drawn under full alpha so they do not sit on text as
 * solid blocks.
 */
export const band = (h: number): Band => {
  if (h > 0.95) return { colour: WHITE, alpha: 1 };
  if (h > 0.74) return { colour: YELLOW, alpha: 1 };
  if (h > 0.5) return { colour: ORANGE, alpha: 1 };
  if (h > 0.32) return { colour: RED, alpha: 1 };
  if (h > 0.16) return { colour: BLUE, alpha: 0.9 };
  return { colour: NAVY, alpha: 0.62 };
};

/** Heat below which a band is too cool to hold ink legibly on top of it. */
export const LEGIBLE = 0.5;
