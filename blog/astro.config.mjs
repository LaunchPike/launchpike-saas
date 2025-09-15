// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://launchpike.org',
  base: process.env.PUBLIC_BASE_URL || '',
  trailingSlash: 'always',
  integrations: [
    react()
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});