// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
// https://astro.build/config
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rsh.pw',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [tailwind(), sitemap()],
  vite: {
    optimizeDeps: {
      exclude: ['better-sqlite3']
    }
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
