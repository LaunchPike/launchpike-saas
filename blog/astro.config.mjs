import mdx from "@astrojs/mdx";
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://launchpike.org',
  base: process.env.PUBLIC_BASE_URL || '',
  trailingSlash: 'ignore',
  integrations: [
    react(),
    mdx()
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});