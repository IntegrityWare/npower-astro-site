import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://www.npowersoftware.com',
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
