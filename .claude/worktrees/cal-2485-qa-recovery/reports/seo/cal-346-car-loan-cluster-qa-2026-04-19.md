# CAL-346 Content QA: Car-Loan Cluster Article/Internal-Link Refresh (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-346](/CAL/issues/CAL-346)  
Keyword evidence chain: [CAL-68](/CAL/issues/CAL-68) priority 1 (`attack score 73`, `monthly volume 2400`)

## Wake delta handled

- Applied only the published CMO blockers in this wake:
  1. raise article length to >= 800 Thai words,
  2. source or explicitly label non-official numeric claims,
  3. align evidence filename to planned convention.
- No additional scope was introduced by the latest queue heartbeat note.

## Re-review return criteria status

1. Article length >= 800 words: `PASS`  
- Current Thai word segmentation count: `989`

2. Numeric claims source/assumption framing: `PASS`  
- Heuristic numbers now explicitly labeled as non-official planning guidance in FAQ + cost section.
- Flat vs Effective comparison wording now references BOT comparison concept without unsourced hard conversion ratio.
- BOT official links retained in `แหล่งข้อมูลทางการ`.

3. Evidence filename alignment: `PASS`  
- Report is now posted as `reports/seo/cal-346-car-loan-cluster-qa-2026-04-19.md`.

## Source updates applied

- Article revised: `src/pages/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/index.astro`
  - Added explicit heuristic framing for:
    - down payment `20-25%`,
    - installment-to-income `15-20%`,
    - operating cost ranges (insurance/fuel/maintenance).
  - Removed unsourced hard numeric mapping (`Flat 3% ~= Effective 5.5-6%`) and replaced with BOT-aligned comparison guidance.
  - Added additional practical section (`เช็กลิสต์ก่อนยื่นไฟแนนซ์และก่อนเซ็นสัญญา`) to lift content depth and decision utility.
- Internal-link reciprocity remained intact:
  - article -> calculator links present,
  - calculator -> article link present at `src/pages/คำนวณผ่อนรถ/index.astro`.

## Verification commands and observed output

```bash
npm run verify:public-content
```

Observed:

```text
> calculator-thailand@1.0.0 verify:public-content
> node scripts/verify-public-content.mjs

Public content guard passed: no internal-note markers detected in public Astro files.
```

```bash
node -e "const fs=require('fs');const p='src/pages/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/index.astro';const t=fs.readFileSync(p,'utf8');const content=t.split('---').slice(2).join('---').replace(/<[^>]*>/g,' ');const seg=new Intl.Segmenter('th',{granularity:'word'});let n=0;for(const s of seg.segment(content)){if(s.isWordLike)n++;}const title=(t.match(/const title = '([^']+)'/)||[])[1]||'';const desc=(t.match(/const description = '([^']+)'/)||[])[1]||'';console.log(JSON.stringify({wordCount:n,titleLength:[...title].length,descriptionLength:[...desc].length},null,2));"
```

Observed:

```json
{
  "wordCount": 989,
  "titleLength": 51,
  "descriptionLength": 111
}
```

## Files touched in this wake

- `src/pages/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/index.astro`
- `reports/seo/cal-346-car-loan-cluster-qa-2026-04-19.md`
