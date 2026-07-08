// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Public base URL — drives canonical links, OG absolute URLs, and sitemap.xml entries.
// Update to the real production hostname before launch.
const SITE = 'https://yamaluxe.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap()],
});
