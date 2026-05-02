import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  output: 'static',
  vite: {
    build: {
      rollupOptions: {
        external: ['googleapis', 'google-auth-library', '@anthropic-ai/sdk', 'pg'],
      },
    },
  },
  integrations: [
    tailwind(),
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
    '/calculator/electricity-bill/': { destination: '/คำนวณค่าไฟฟ้า/', status: 301 },
    '/calculator/income-tax/': { destination: '/คำนวณภาษีเงินได้บุคคลธรรมดา/', status: 301 },
    '/calculator/land-tax/': { destination: '/คำนวณภาษีที่ดิน/', status: 301 },
    '/calculator/loan-payment/': { destination: '/คำนวณผ่อนกู้/', status: 301 },
    '/calculator/net-salary/': { destination: '/คำนวณเงินเดือนสุทธิ/', status: 301 },
    '/calculator/overtime-pay/': { destination: '/คำนวณค่าโอที/', status: 301 },
    '/calculator/property-transfer-tax/': { destination: '/คำนวณค่าธรรมเนียมโอนบ้าน/', status: 301 },
    '/calculator/unit-converter/': { destination: '/แปลงหน่วย/', status: 301 },
  },
});
