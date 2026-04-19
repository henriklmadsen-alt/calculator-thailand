import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  integrations: [tailwind(), sitemap()],
  site: process.env.PUBLIC_SITE_URL || 'https://www.kamnuanlek.com',
  redirects: {
    '/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวดและดอกเบี้ย/': '/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/',
    '/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/': '/บทความ/คำนวณค่าโอที-2569-กฎหมายแรงงาน/',
    '/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/': '/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/',
  },
});
