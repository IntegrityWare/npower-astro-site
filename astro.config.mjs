import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://www.npowersoftware.com',
  trailingSlash: 'always',
  // Keep HTML whitespace/line breaks so View Source stays readable.
  // Set to true later if you want smaller transfer size in production.
  compressHTML: false,
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      allowedHosts: 'all',
    },
  },
});
