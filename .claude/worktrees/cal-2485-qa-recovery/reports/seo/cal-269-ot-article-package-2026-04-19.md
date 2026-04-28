# CAL-269 OT Article Package Refresh (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-68](/CAL/issues/CAL-68) priority #4 (OT content package refresh)

## User-facing URLs

- Primary article URL: `/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/`
- Primary calculator URL: `/คำนวณค่าโอที/`
- Supporting inbound hub URL: `/บทความ/`
- Added contextual inbound link from: `/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/`

## Metadata shipped (OT article + calculator)

- Article title: `คำนวณค่าโอที 2569 | วิธีคิด OT 1.5x 2x 3x | เครื่องคำนวณไทย`
- Article description: `คำนวณค่าโอทีปี 2569 ตามกฎหมายแรงงานไทย อธิบายสูตร OT วันทำงาน 1.5 เท่า ทำงานวันหยุด 1 หรือ 2 เท่า และ OT วันหยุด 3 เท่า พร้อมตัวอย่างเงินบาท`
- Article publish date updated to `2026-04-19`
- Calculator description wording normalized to `1 หรือ 2 เท่า` (replacing ambiguous `1/2 เท่า`)
- Calculator trust panel updated to `lastUpdated=19 เม.ย. 2569`

## Content package shipped

- Thai long-form support content aligned to calculator intent (`word_count=1615` from built HTML using `Intl.Segmenter`)
- Formula section aligned to calculator behavior:
  - `OT วันทำงาน = ค่าจ้างต่อชั่วโมง × 1.5 × ชั่วโมง OT วันทำงาน`
  - `ทำงานวันหยุด = ค่าจ้างต่อชั่วโมง × (1 หรือ 2) × ชั่วโมงทำงานวันหยุด`
  - `OT วันหยุด = ค่าจ้างต่อชั่วโมง × 3 × ชั่วโมง OT วันหยุด`
- Added practical section for monthly-salary users:
  - how to establish hourly base from HR/company policy
  - links to net-salary and personal-income-tax calculators for post-OT planning
- FAQ block remains present on OT article and OT calculator pages.

## Internal-link map updated

- Hub/indexing:
  - `/บทความ/` now includes OT article card in the main article list
  - `/บทความ/` popular calculator block now includes `/คำนวณค่าโอที/`
- Contextual inbound links:
  - `/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/` now links to:
    - `/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/`
    - `/คำนวณค่าโอที/`
- Reciprocal OT pair remains active:
  - `/คำนวณค่าโอที/` -> OT article
  - OT article -> `/คำนวณค่าโอที/`

## Official source verification (formula/rate claims)

- กระทรวงแรงงาน: สิทธิตามกฎหมายแรงงาน  
  https://www.mol.go.th/employee/%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%A3%E0%B8%87%E0%B8%87%E0%B8%B2%E0%B8%99
- กระทรวงแรงงาน: สิทธิหน้าที่นายจ้าง ลูกจ้าง  
  https://www.mol.go.th/employee/%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%87-%E0%B8%A5%E0%B8%B9%E0%B8%81%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%87

## Verification evidence

Commands executed:

```bash
npm run build
rg -n "คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน|/คำนวณค่าโอที/" src/pages/บทความ/index.astro src/pages/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/index.astro src/pages/คำนวณค่าโอที/index.astro -S
```

Observed results:

- Build succeeded (`astro build` + `scripts/verify-public-content.mjs`)
- OT article route and calculator route both generated
- OT article and calculator links are present in hub + salary inbound context as specified

## Changed files

- `src/pages/คำนวณค่าโอที/index.astro`
- `src/pages/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/index.astro`
- `src/pages/บทความ/index.astro`
- `src/pages/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/index.astro`
- `reports/seo/cal-269-ot-article-package-2026-04-19.md`
