/**
 * The angle a campaign piece sits at.
 *
 * Shared so the homepage teaser and the board it links to give the same piece
 * the same angle. Reimplementing the seed in both places would have produced
 * two different walls of the same artwork, which is the sort of thing nobody
 * reports as a bug and everybody feels.
 *
 * Seeded from the filename rather than random: a random angle is re-rolled on
 * every render, so the wall would reshuffle between builds and between a page
 * and its own reload.
 */
const hash = (str: string) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/** Spread over ±range, to 2dp. */
export const spread = (str: string, range: number) =>
  Number((((hash(str) % 2000) / 1000 - 1) * range).toFixed(2));

/** Rotation in degrees and vertical offset in px, for one piece. */
export const tilt = (image: string, range = 4.2, drop = 14) => ({
  rot: spread(image, range),
  dy: spread(`${image}y`, drop),
});
