# CAL-292 Unit-Conversion Article Package Closeout (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-68](/CAL/issues/CAL-68) priority #10 (`แปลงหน่วย`)

## Execution status

- `CAL-292`: `completed`
- Wake-note handled: ownership moved to CMO; deliverable kept unchanged and pushed to closeout
- Former blocker resolved in working tree: calculator route `/แปลงหน่วย/` is present and linked reciprocally
- `CAL-131` treated per CEO correction: launch dependency only if route/link verification fails, not a writing blocker

## User-facing URLs

- Supporting article: `/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/`
- Target calculator: `/แปลงหน่วย/`
- Article hub: `/บทความ/`

## Keyword research snapshot (Thai intent)

Source method used:
- Google Autocomplete API (`hl=th`) on 2026-04-19
- Thai long-tail question intent validation for FAQ pattern coverage

Core keyword selected:
- `แปลงหน่วยวัด`

High-intent Thai queries observed:
- `แปลงหน่วย`
- `แปลงหน่วยวัดความยาว`
- `แปลงเมตรเป็นเซนติเมตร`
- `แปลงกิโลกรัมเป็นกรัม`
- `เซลเซียสเป็นฟาเรนไฮต์`
- `แปลงหน่วย cm เป็น m`
- `แปลงหน่วย mm เป็น cm`

PAA/related-intent coverage implemented in article FAQ:
- `แปลงเมตรเป็นเซนติเมตรคิดยังไง`
- `แปลงกิโลกรัมเป็นกรัมต้องคูณเท่าไร`
- `สูตรเซลเซียสเป็นฟาเรนไฮต์คืออะไร`
- `ทำไมคำนวณเองแล้วตัวเลขต่างเล็กน้อย`

## Metadata and content compliance

- Title tag: `แปลงหน่วยวัด 2569 | เมตร กิโลกรัม เซลเซียส | เครื่องคำนวณไทย` (`60` chars)
- Meta description length: `136` chars
- Article word count: `864` (Thai `Intl.Segmenter`)
- Structure delivered:
  - H1 with year `2569`
  - Intro
  - Formula explanation
  - Step-by-step examples
  - Common mistakes
  - Calculator CTA
  - FAQ (4 items)
  - Related calculators (3 links)
  - Related articles (3 links)

## Source verification (official Thai + global standards)

Thai official references added:
- กรมการค้าภายใน (สำนักชั่งตวงวัด): พ.ร.บ.มาตราชั่งตวงวัด พ.ศ. 2542  
  https://www.dit.go.th/th/law/act/weights-measures-2542/
- สถาบันมาตรวิทยาแห่งชาติ (NIMT): มาตรฐานแห่งชาติ  
  https://www.nimt.or.th/main/?page_id=222

Global unit/formula references retained:
- BIPM SI Brochure  
  https://www.bipm.org/en/publications/si-brochure
- NIST SI Units - Temperature  
  https://www.nist.gov/pml/owm/si-units-temperature

## Internal-link compliance

- Article -> calculator CTA: present (`/แปลงหน่วย/`)
- Calculator -> supporting article: present (`/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/`)
- Article -> related calculators: 3 links
- Article -> related articles: 3 links
- Homepage and article index include `/แปลงหน่วย/`

## Verification evidence

Commands executed:

```bash
node -e "const fs=require('fs');const p='src/pages/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/index.astro';const t=fs.readFileSync(p,'utf8');const content=t.split('---').slice(2).join('---').replace(/<[^>]*>/g,' ');const seg=new Intl.Segmenter('th',{granularity:'word'});let n=0;for(const s of seg.segment(content)){if(s.isWordLike)n++;}const title=(t.match(/const title = '([^']+)'/)||[])[1]||'';const desc=(t.match(/const description = '([^']+)'/)||[])[1]||'';console.log(JSON.stringify({wordCount:n,titleLength:[...title].length,descriptionLength:[...desc].length},null,2));"
rg -n "แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส|/แปลงหน่วย/" src/pages -S
if (Test-Path "src/pages/แปลงหน่วย/index.astro") { "exists" } else { "missing" }
npm run build
```

Observed results:

- Word count `864`, title length `60`, description length `136`
- Reciprocal links found in article and calculator routes
- Route existence check returned `exists`
- Build passed (`astro build` + `scripts/verify-public-content.mjs`)

## Changed files

- `src/pages/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/index.astro`
- `src/pages/แปลงหน่วย/index.astro`
- `reports/seo/cal-292-unit-conversion-article-package-2026-04-19.md`
