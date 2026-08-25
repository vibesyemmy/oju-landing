import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * A project's disciplines drive the filter on the work index. Keeping them a
 * closed set means a typo fails the build instead of quietly emptying a filter.
 */
export const DISCIPLINES = ['Design', 'Product', 'Engineering'] as const;

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.mdx' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      sector: z.string(),
      services: z.array(z.string()).nonempty(),
      disciplines: z.array(z.enum(DISCIPLINES)).nonempty(),
      /* Optional because they are frequently not on record. An absent field
         renders nothing; inventing one to fill the sidebar would put a made-up
         fact next to real ones. */
      team: z.string().optional(),
      duration: z.string().optional(),
      year: z.number().int(),

      /** Lower sorts first on the work index. */
      order: z.number().int().default(0),
      draft: z.boolean().default(false),

      /** The case study headline. State the outcome, not the project name. */
      outcome: z.string(),
      /** One-sentence problem statement, shown above the brief. */
      brief: z.string(),

      hero: image().optional(),

      /**
       * Tiles this project contributes to the work wall. Several per project is
       * the point — the wall fills from a handful of projects, the way a real
       * portfolio does. Order matters: first is the strongest.
       */
      gallery: z.array(image()).default([]),

      /**
       * Exactly three — the design has three slots and a fourth breaks the
       * grid. If a project has more, pick the three that sell it.
       */
      results: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .length(3),

      stack: z.array(
        z.object({ group: z.string(), items: z.array(z.string()).nonempty() }),
      ),

      /** Mechanism + consequence, one sentence each. Not a feature list. */
      decisions: z.array(z.string()).min(1),

      quote: z
        .object({ text: z.string(), name: z.string(), role: z.string() })
        .optional(),

      liveUrl: z.string().url().optional(),
    }),
});

export const collections = { work };
