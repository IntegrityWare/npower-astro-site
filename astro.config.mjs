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
