# CAL-321 Deposit-Interest Article Package Evidence (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-321](/CAL/issues/CAL-321) (high priority, unblocked)

## Status

- No blocker.
- Package shipped and route-aligned to latest encoded wake comment.

## User-facing URLs

- Primary calculator URL (decoded): `/คำนวณดอกเบี้ยเงินฝาก/`
- Primary supporting article URL (decoded): `/บทความ/ดอกเบี้ยเงินฝาก-2569-ฝากประจำออมทรัพย์-ภาษี/`
- Primary supporting article URL (encoded): `/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%9D%E0%B8%B2%E0%B8%81-2569-%E0%B8%9D%E0%B8%B2%E0%B8%81%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%88%E0%B8%B3%E0%B8%AD%E0%B8%AD%E0%B8%A1%E0%B8%97%E0%B8%A3%E0%B8%B1%E0%B8%9E%E0%B8%A2%E0%B9%8C-%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5/`
- Article hub URL updated: `/บทความ/`

## Metadata shipped (supporting article)

- Title: `คำนวณดอกเบี้ยเงินฝาก 2569: สูตรคิดรายเดือนและดอกเบี้ยสุทธิหลังภาษี | เครื่องคำนวณไทย`
- Description: `สรุปสูตรคำนวณดอกเบี้ยเงินฝากปี 2569 สำหรับฝากประจำและออมทรัพย์ พร้อมตัวอย่างตัวเลขจริงที่ตรงกับเครื่องคำนวณ และวิธีดูผลตอบแทนสุทธิหลังภาษี 15%`
- Canonical: `/บทความ/ดอกเบี้ยเงินฝาก-2569-ฝากประจำออมทรัพย์-ภาษี/`
- Published date: `2026-04-19`

## Content package shipped

- New Thai long-form support article aligned to calculator intent (`word_count=547` via `Intl.Segmenter` local count)
- Contains:
  - keyword-led H1 with year 2569
  - calculator CTA (top + mid)
  - formula section aligned to calculator behavior (fixed + savings modes)
  - worked examples consistent with tool logic
  - FAQ block
  - internal links to related calculators and cluster articles
  - official source section

## Internal-link map updated

- Calculator page links:
  - `/คำนวณดอกเบี้ยเงินฝาก/` -> `/บทความ/ดอกเบี้ยเงินฝาก-2569-ฝากประจำออมทรัพย์-ภาษี/` (next action + support links block)
- Related article links:
  - `/บทความ/เงินฝาก-vs-กองทุน-เปรียบเทียบ-2569/` -> new supporting article URL
- Article listing:
  - `/บทความ/` includes slug `ดอกเบี้ยเงินฝาก-2569-ฝากประจำออมทรัพย์-ภาษี`

## Official source verification (formula/rule claims)

- Revenue Department (ด.บ.01 and tax-exemption workflow):  
  https://www.rd.go.th/66737.html
- Revenue Department seminar reference (withholding-tax context):  
  https://www.rd.go.th/publish/seminar/seminar_251261.pdf
- Deposit Protection Agency (coverage limit):  
  https://www.dpa.or.th/coverage-limit

## Verification evidence

Commands executed:

```bash
# ensure final slug is used
rg -n -F "ดอกเบี้ยเงินฝาก-2569-ฝากประจำออมทรัพย์-ภาษี" app/src/pages

# ensure old slug removed
rg -n -F "คำนวณดอกเบี้ยเงินฝาก-2569-สูตรและภาษี" app/src/pages

# article word count
node -e "const fs=require('fs');const text=fs.readFileSync('app/src/pages/บทความ/ดอกเบี้ยเงินฝาก-2569-ฝากประจำออมทรัพย์-ภาษี/index.astro','utf8');const content=text.split('---').slice(2).join('---').replace(/<[^>]*>/g,' ');const seg=new Intl.Segmenter('th',{granularity:'word'});let n=0;for(const s of seg.segment(content)){if(s.isWordLike)n++;}console.log(n);"

# build + content guard
cd app && npm run build
```

Observed results:

- Final slug present across calculator + article cluster files
- Old slug not found in `app/src/pages`
- Word count result: `547`
- Build passed and static route generated:
  - `/บทความ/ดอกเบี้ยเงินฝาก-2569-ฝากประจำออมทรัพย์-ภาษี/`

## Changed files

- `src/pages/บทความ/ดอกเบี้ยเงินฝาก-2569-ฝากประจำออมทรัพย์-ภาษี/index.astro`
- `src/pages/บทความ/index.astro`
- `src/pages/คำนวณดอกเบี้ยเงินฝาก/index.astro`
- `src/pages/บทความ/เงินฝาก-vs-กองทุน-เปรียบเทียบ-2569/index.astro`
- `reports/seo/cal-321-deposit-interest-article-package-2026-04-19.md`

