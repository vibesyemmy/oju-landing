// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// TODO: swap for the real domain once it is registered.
const SITE = 'https://oju.studio';

export default defineConfig({
  site: SITE,
  // The site is static apart from the contact endpoint, which sets
  // `prerender = false` and becomes the one serverless function. Without an
  // adapter that route is silently dropped from the build.
  adapter: vercel(),
  // Honour PORT so the dev server can be assigned a free port.
  server: { port: Number(process.env.PORT) || 4321 },
  integrations: [mdx(), sitemap()],
  vite: {
    // @tailwindcss/vite 4.3.x still ships type declarations for an older
    // Vite major than Astro bundles (8.x), so its PluginOption shape does not
    // structurally match. Runtime is fine — this cast only silences the type
    // skew. Remove it once Tailwind's types target Vite 8.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
  build: {
    // Inline tiny assets rather than paying a request for them.
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
