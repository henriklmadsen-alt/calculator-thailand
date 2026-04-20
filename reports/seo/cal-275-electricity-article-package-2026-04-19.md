# CAL-275 Electricity Article Package Refresh (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-68](/CAL/issues/CAL-68) priority #2 (`คำนวณค่าไฟฟ้า 2569 สูตร PEA/MEA`)

## User-facing URLs

- Primary article URL: `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/`
- Legacy support URL kept live: `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/`
- Primary calculator URL: `/คำนวณค่าไฟฟ้า/`
- Article hub URL updated: `/บทความ/`

## Metadata shipped (article)

- Title: `คำนวณค่าไฟฟ้า ปี 2569 | สูตร PEA/MEA + Ft | เครื่องคำนวณไทย`
- Description: `สรุปวิธีคำนวณค่าไฟฟ้า 2569 ตามอัตรา PEA/MEA + ค่า Ft พร้อมตัวอย่างจริง 200 หน่วย ข้อผิดพลาดที่พบบ่อย และลิงก์เครื่องคำนวณค่าไฟทันที`
- Canonical: `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/`
- Published date: `2026-04-19`

## Content package shipped

- Thai long-form rewrite aligned to calculator intent (`word_count=850` from local `Intl.Segmenter` count)
- Includes required structure:
  - keyword-led H1 with year 2569
  - intro (intent + why this matters)
  - plain-language formula section
  - step-by-step THB example (200 units)
  - common mistakes section
  - prominent calculator CTA
  - FAQ block (4 questions)
  - related calculators (3) + related articles (3)
- Numeric worked example in article:
  - base charge: `730.00`
  - subtotal before VAT: `770.65`
  - VAT: `53.95`
  - total bill: `824.60`

## Internal-link map updated

- Calculator to article remains active:
  - `/คำนวณค่าไฟฟ้า/` -> `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/`
- Article outbound links validated:
  - calculators: `/คำนวณค่าไฟฟ้า/`, `/คำนวณค่าน้ำ/`, `/คำนวณเปอร์เซ็นต์/`
  - related articles: water, percentage, net-salary clusters
- Article listing updates:
  - `/บทความ/` now contains card for electricity article slug
  - `/บทความ/` now also contains water article card (missing in previous list)
  - `/บทความ/` popular calculator grid now includes `/คำนวณค่าไฟฟ้า/` and `/คำนวณค่าน้ำ/`

## Official source verification (formula/rate claims)

- PEA residential tariff document (base-tier rates and service fees):  
  https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_MAY_2023.pdf
- PEA Ft (Jan-Apr 2569 = 0.0972 THB/unit):  
  https://www.pea.co.th/sites/default/files/ft/2025/Ft%20surcharge%20JAN-APR2026_Final_0.pdf
- PEA Ft (May-Aug 2569 = 0.1623 THB/unit):  
  https://www.pea.co.th/sites/default/files/ft/2026/Ft%20surcharge%20MAY-AUG%202026_Final_0.pdf
- MEA residential tariff category page (Type 1 housing context for PEA/MEA intent):  
  https://www.mea.or.th/our-services/tariff-calculation/other/D5xEaEwgU
- Revenue Department VAT extension notice (7% through 30 Sep 2569):  
  https://www.rd.go.th/region/08/chiangrai/265/3664.html

## Verification evidence

Commands executed:

```bash
# RED check (before update): expected missing article cards in listing
rg -n "คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ|คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ" src/pages/บทความ/index.astro -S

# GREEN check (after update): expected both slugs present
rg -n "คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ|คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ" src/pages/บทความ/index.astro -S

# Word-count quality gate (article >= 800 words)
node -e "const fs=require('fs');const text=fs.readFileSync('src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.astro','utf8');const content=text.split('---').slice(2).join('---').replace(/<[^>]*>/g,' ');const seg=new Intl.Segmenter('th',{granularity:'word'});let n=0;for(const s of seg.segment(content)){if(s.isWordLike)n++;}console.log(n);"

# Build + content guard
npm run build
```

Observed results:

- RED check failed before update (slug entries missing from `/บทความ/` listing)
- GREEN check passed after update (both slug entries present)
- Article word count measured at `850`
- Full build succeeded (`astro build` + `scripts/verify-public-content.mjs`)

## Changed files

- `src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.astro`
- `src/pages/บทความ/index.astro`
- `reports/seo/cal-275-electricity-article-package-2026-04-19.md`
