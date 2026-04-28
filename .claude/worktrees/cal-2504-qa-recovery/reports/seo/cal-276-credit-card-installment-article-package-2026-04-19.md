# CAL-276 Credit-Card Installment Article Package (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-68](/CAL/issues/CAL-68) priority #9 (`ค่างวดบัตรเครดิต / ผ่อนบัตรเครดิต 2569`)

## User-facing URLs

- New article URL: `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/`
- Supporting calculator URL: `/คำนวณดอกเบี้ยบัตรเครดิต/`
- Related article URL (existing): `/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/`
- Article hub URL updated: `/บทความ/`

## Metadata shipped (new article)

- Title: `ผ่อนบัตรเครดิต ปี 2569 | ค่างวดและดอกเบี้ย | เครื่องคำนวณไทย`
- Description: `ผ่อนบัตรเครดิต 2569 ต้องจ่ายเท่าไรถึงไม่ยืดหนี้? สรุปสูตรค่างวด ดอกเบี้ยรายวัน ขั้นต่ำ 8% พร้อมตัวอย่างเงินจริงและแผนปิดหนี้ไว`
- Canonical: `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/`
- Published date: `2026-04-19`

## Content package shipped

- Thai long-form article aligned to installment-intent keyword (`word_count=940` by local `Intl.Segmenter`)
- Required sections included:
  - keyword-led H1 with year 2569
  - intro with Thai user intent
  - calculation method (minimum payment, daily-interest logic, fixed-payment planning formula)
  - step-by-step THB example
  - common mistakes section
  - calculator CTA
  - FAQ (4 questions)
  - related calculators + related articles
- Unique angle vs existing credit-card-interest article:
  - focuses on monthly installment planning and payment-target strategy, not only interest mechanics

## Internal-link updates

- Article -> calculator (prominent CTA) wired to `/คำนวณดอกเบี้ยบัตรเครดิต/`
- Calculator -> new article link added in related block
- Existing credit-card-interest article now links to new installment article in related-articles section
- `/บทความ/` listing updated with new card for installment article

## Official source verification

- BOT credit-card guidance (interest + fee framework, max effective 16%):  
  https://www.bot.or.th/th/satang-story/digital-fin-lit/creditcard.html
- BOT News 47/2568 (minimum payment 8% extension to end-2569):  
  https://www.bot.or.th/th/news-and-media/news/news-20251204-2.html

## Verification evidence

Commands executed:

```bash
# RED check before implementation
rg -n "ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย" src/pages -S

# Word-count check
node -e "const fs=require('fs');const text=fs.readFileSync('src/pages/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/index.astro','utf8');const content=text.split('---').slice(2).join('---').replace(/<[^>]*>/g,' ');const seg=new Intl.Segmenter('th',{granularity:'word'});let n=0;for(const s of seg.segment(content)){if(s.isWordLike)n++;}console.log(n);"

# GREEN check after implementation
rg -n "ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย" src/pages -S

# Build + public-content guard
npm run build
```

Observed results:

- RED check failed before create (slug missing)
- New article word count measured at `940`
- GREEN check passed after create (slug present in article, listing, calculator, and related article)
- Build succeeded (`astro build` + `scripts/verify-public-content.mjs`)

## Changed files

- `src/pages/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/index.astro`
- `src/pages/บทความ/index.astro`
- `src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro`
- `src/pages/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/index.astro`
- `reports/seo/cal-276-credit-card-installment-article-package-2026-04-19.md`
