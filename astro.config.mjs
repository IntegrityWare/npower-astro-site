import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://www.npowersoftwarenew.com',
  trailingSlash: 'always',
  // Keep HTML whitespace/line breaks so View Source stays readable.
  // Set to true later if you want smaller transfer size in production.
  compressHTML: false,
  integrations: [react(), sitemap()],
  vite: {
    resolve: {
      alias: {
        '@': srcDir,
      },
    },
    environments: {
      ssr: {
        resolve: {
          alias: {
            '@': srcDir,
          },
        },
      },
    },
    server: {
      allowedHosts: 'all',
    },
  },
});
