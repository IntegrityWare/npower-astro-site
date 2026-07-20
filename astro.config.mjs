import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import trailingSlashRedirects from './integrations/trailing-slash-redirects.mjs';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const siteUrl = (env.PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://www.npowersoftwarenew.com')
  .replace(/\/+$/, '');

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: siteUrl,
  trailingSlash: 'always',
  // Keep HTML whitespace/line breaks so View Source stays readable.
  // Set to true later if you want smaller transfer size in production.
  compressHTML: false,
  integrations: [react(), sitemap(), trailingSlashRedirects()],
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
