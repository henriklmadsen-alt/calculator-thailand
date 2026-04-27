import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';

function classifySitemapUrl(url) {
  const decoded = decodeURIComponent(url);

  // AI Advisor → priority 0.9 (strategic feature, Fortune 500 launch)
  if (decoded.includes('ai-advisor')) {
    return { priority: 0.9, changefreq: 'weekly' };
  }

  // Car loan / installment calculators → priority 1.0
  if (decoded.includes('ผ่อนรถ') || decoded.includes('สินเชื่อรถ') || decoded.includes('เปรียบเทียบซื้อรถ')) {
    return { priority: 1.0, changefreq: 'monthly' };
  }

  // Insurance calculators (ประกัน) → priority 1.0
  // ประกันสังคม (SSO / social security) is a tax deduction tool → 0.9 below
  if (decoded.includes('ประกัน') && !decoded.includes('ประกันสังคม')) {
    return { priority: 1.0, changefreq: 'monthly' };
  }

  // Tax calculators (income tax, VAT, SSO) → priority 0.9
  if (decoded.includes('ภาษี') || /vat/i.test(decoded) || decoded.includes('ประกันสังคม')) {
    return { priority: 0.9, changefreq: 'monthly' };
  }

  // All other pages
  return { priority: 0.5, changefreq: 'monthly' };
}

export default defineConfig({
  output: 'static',
  vite: {
    build: {
      rollupOptions: {
        external: ['googleapis', 'google-auth-library'],
      },
    },
  },
  integrations: [
    tailwind(),
    // DISABLED: CAL-2260 - @astrojs/sitemap 3.7.2 incompatible with Astro 4.16.19
    // Causes "Cannot read properties of undefined (reading 'reduce')" in sitemap:build:done hook
    // Workaround: Manual sitemap or post-build generation
    // sitemap(),
    // DISABLED TEMPORARILY: CAL-2365 - Sentry integration causing renderers.mjs generation failure
    // sentry({
    //   dsn: process.env.PUBLIC_SENTRY_DSN,
    //   environment: process.env.NODE_ENV || 'development',
    //   tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    //   replaysSessionSampleRate: 0.1,
    //   replaysOnErrorSampleRate: 1.0,
    // }),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  site: process.env.PUBLIC_SITE_URL || 'https://www.kamnuanlek.com',
  redirects: {
    // Article slug renames
    '/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวดและดอกเบี้ย/': '/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/',
    '/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/': '/บทความ/คำนวณค่าโอที-2569-กฎหมายแรงงาน/',
    '/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/': '/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/',
    // English calculator routes → Thai equivalents (301 permanent)
    '/calculator/loan-payment/': { destination: '/คำนวณผ่อนกู้/', status: 301 },
    '/calculator/property-transfer-tax/': { destination: '/คำนวณค่าธรรมเนียมโอนบ้าน/', status: 301 },
    '/calculator/land-tax/': { destination: '/คำนวณภาษีที่ดิน/', status: 301 },
    '/calculator/unit-converter/': { destination: '/แปลงหน่วย/', status: 301 },
    '/calculator/overtime-pay/': { destination: '/คำนวณค่าโอที/', status: 301 },
    '/calculator/electricity-bill/': { destination: '/คำนวณค่าไฟฟ้า/', status: 301 },
  },
});
