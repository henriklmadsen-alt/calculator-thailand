import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  integrations: [tailwind(), sitemap()],
  site: 'https://calculator-thailand-production.up.railway.app',
});
