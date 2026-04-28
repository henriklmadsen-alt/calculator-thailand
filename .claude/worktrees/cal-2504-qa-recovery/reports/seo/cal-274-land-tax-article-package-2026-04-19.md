# CAL-274 Land-Tax Article Package (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-68](/CAL/issues/CAL-68) priority #8 (`ภาษีที่ดิน 2569`)

## User-facing URLs

- Primary article URL (new): `/บทความ/ภาษีที่ดิน-2569-อัตราและวิธีคำนวณ/`
- Target calculator URL (planned lane target): `/คำนวณภาษีที่ดิน/`
- Inbound hub/index URL updated: `/บทความ/`

## Metadata shipped (new article)

- Title: `ภาษีที่ดิน 2569 | อัตราและวิธีคำนวณ | เครื่องคำนวณไทย`
- Description: `สรุปภาษีที่ดินและสิ่งปลูกสร้างปี 2569: อัตราตามประเภทการใช้ประโยชน์ วิธีคำนวณทีละขั้น ตัวอย่างเงินภาษีจริง และจุดพลาดที่ควรเช็กก่อนจ่าย`
- Canonical: `/บทความ/ภาษีที่ดิน-2569-อัตราและวิธีคำนวณ/`
- Published date: `2026-04-19`

## Content package shipped

- Thai long-form support content aligned to calculator intent (`~1,400+` words in source draft)
- Formula guidance aligned to land-tax logic:
  - identify usage type (เกษตร/อยู่อาศัย/อื่น/ว่างเปล่า)
  - compute by stepped rate brackets
  - apply exemption/reduction conditions before final payable amount
- Worked THB examples shipped for:
  - owner-occupied primary residence
  - secondary residence
  - business-use property
  - vacant land (stepped-rate example)
- FAQ block shipped: 5 items
- CTA blocks shipped: 2 placements, both targeting `/คำนวณภาษีที่ดิน/`

## Internal-link map updated

- Hub/index update:
  - Added article card on `/บทความ/` for `/บทความ/ภาษีที่ดิน-2569-อัตราและวิธีคำนวณ/`
- Article outbound links:
  - Calculator links: `/คำนวณค่าธรรมเนียมโอนบ้าน/`, `/คำนวณผ่อนบ้าน/`, `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
  - Related article links: transfer-fee, refinance, refinance-vs-prepay cluster

## Official source verification (formula/rate claims)

- Fiscal Policy Office (FPO): Land-and-building-tax legal reference page and subordinate-law list  
  https://www.fpo.go.th/main/The-law-in-charge-of-FPO/Law-of-Finance-and-Taxation/17122.aspx

- Royal Decree prescribing land-and-building-tax rates (B.E. 2564), used for rates from tax year 2565 onward  
  https://www.fpo.go.th/main/getattachment/General-information-public-service/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B2%E0%B8%8A%E0%B8%99%E0%B8%84%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%B9%E0%B9%89/%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%94%E0%B8%B4%E0%B8%99%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%AA%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B8%9B%E0%B8%A5%E0%B8%B9%E0%B8%81%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%99%E0%B8%9A-2-%E0%B8%9E-%E0%B8%A3-%E0%B8%8E-2564.PDF.aspx?lang=th-TH

- LTAX e-service (DLA): FAQ basis for taxpayer role, annual-tax definition, and exemption interpretation for primary residence  
  https://ltaxsvt.dla.go.th/

## Manager-chain escalation note (to CMO)

- Engineering dependency remains: target calculator route `/คำนวณภาษีที่ดิน/` is not present in current source tree.
- Article package is shipped with CTA pre-wired to the lane target route; calculator route implementation is required for end-to-end live CTA resolution.

## Verification commands

```bash
rg -n "ภาษีที่ดิน-2569-อัตราและวิธีคำนวณ|/คำนวณภาษีที่ดิน/" src/pages/บทความ/ภาษีที่ดิน-2569-อัตราและวิธีคำนวณ/index.astro src/pages/บทความ/index.astro -S
npm run build
```

## Changed files (this package)

- `src/pages/บทความ/ภาษีที่ดิน-2569-อัตราและวิธีคำนวณ/index.astro`
- `src/pages/บทความ/index.astro`
- `reports/seo/cal-274-land-tax-article-package-2026-04-19.md`
