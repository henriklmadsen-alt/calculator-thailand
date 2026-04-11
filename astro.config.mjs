import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  site: 'https://henriklmadsen-alt.github.io',
  base: '/calculator-thailand',
});
