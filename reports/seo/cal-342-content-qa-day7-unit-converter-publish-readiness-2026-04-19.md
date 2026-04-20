# CAL-342 Content QA: Day-7 Unit-Converter Cluster Publish-Readiness Pass (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-342](/CAL/issues/CAL-342)  
Launch queue reference: [CAL-310](/CAL/issues/CAL-310) Day 7 (`#10`)

## Wake-scope acknowledgement

- Used wake payload directly (`reason: issue_assigned`, `fallbackFetchNeeded: no`).
- No pending comment in wake batch (`0/0`), so this heartbeat executed direct Day-7 source QA.
- Scope remained locked to Day-7 unit-converter pair only.

## QA scope (Day-7 pair)

- Calculator: `/แปลงหน่วย/`
- Supporting article: `/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/`

## Readiness verdict

`READY (SOURCE-SIDE)` for Day-7 content QA gate.  
Deploy/live verification remains a downstream execution dependency.

## Findings and checks

1. Thai copy quality and intent fit: `PASS`
- Supporting article is long-form (`864` Thai words), practical, and aligned to real conversion intent (length/mass/temperature).
- Content is calculation-led with worked examples and non-filler utility guidance.

2. Formula alignment with calculator behavior: `PASS`
- Length/mass conversion logic in article matches unit-ratio implementation in `src/lib/unit-conversion.ts`.
- Temperature formulas (`C<->F`, `C<->K`, `F<->K`) align with calculator conversion logic.

3. Formula-source compliance: `PASS`
- Formula claims are source-backed with explicit references to DIT (Thailand), NIMT, BIPM, and NIST.
- Calculator trust panel and article source section both include official/reference links.

4. Internal-link compliance and reciprocity: `PASS`
- Calculator includes direct link to supporting article.
- Article includes calculator CTA links (top + mid-article) to `/แปลงหน่วย/`.
- Article includes clear internal discovery blocks with `3` related-calculator links.
- Article includes clear internal discovery blocks with `3` related-article links.

5. Metadata/schema readiness: `PASS`
- Article layout emits `Article` + `BreadcrumbList` + `FAQPage` JSON-LD.
- `Article` schema includes both `datePublished` and `dateModified` (`modifiedDate || publishDate`).
- Route generation includes both Day-7 URLs in fresh build output.

6. `CAL-131` reciprocal-link blocker check: `NOT BLOCKING`
- Calculator route exists in source (`src/pages/แปลงหน่วย/index.astro`).
- Reciprocal links are already present in both directions (calculator -> article and article -> calculator).
- No active engineering blocker owner is required for this heartbeat scope.

## Evidence commands and outcomes

```bash
# Word count + title/meta lengths
node -e "const fs=require('fs');const p='app/src/pages/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/index.astro';const t=fs.readFileSync(p,'utf8');const content=t.split('---').slice(2).join('---').replace(/<[^>]*>/g,' ');const seg=new Intl.Segmenter('th',{granularity:'word'});let n=0;for(const s of seg.segment(content)){if(s.isWordLike)n++;}const title=(t.match(/const title = '([^']+)'/)||[])[1]||'';const desc=(t.match(/const description = '([^']+)'/)||[])[1]||'';console.log(JSON.stringify({wordCount:n,titleLength:[...title].length,descriptionLength:[...desc].length},null,2));"

# Reciprocal links and related-link blocks
if (Test-Path src/pages/แปลงหน่วย/index.astro) { 'calculator_route_present' } else { 'calculator_route_missing' }
Select-String -Path src/pages/แปลงหน่วย/index.astro -SimpleMatch 'href="/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/"'
Select-String -Path src/pages/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/index.astro -SimpleMatch 'href="/แปลงหน่วย/"'
Select-String -Path src/pages/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/index.astro -SimpleMatch 'href="/คำนวณ'
Select-String -Path src/pages/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/index.astro -SimpleMatch 'href="/บทความ/'

# Formula-source lines
rg -n "dit.go.th|nimt.or.th|bipm.org|nist.gov" src/pages/แปลงหน่วย/index.astro src/pages/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/index.astro -S

# Schema/date fields
rg -n "Article|BreadcrumbList|datePublished|dateModified" src/layouts/BlogPostLayout.astro -S

# Regression + build gates
npm test
npm run build
```

Observed:
- Word count `864`, title length `60`, description length `136`.
- Calculator/article reciprocal links present.
- Route existence check returned `calculator_route_present` (so `CAL-131` is not blocking this source QA gate).
- Related internal links present in article (3 calculators + 3 articles).
- Official/reference source links present in both calculator and article.
- `npm test` passed (`38/38`).
- `npm run build` passed; both Day-7 routes generated.

## Blocker owner

- No content blocker and no active `CAL-131` blocker in source.
- Remaining dependency is deploy/live verification for Day-7 wave; if release queue stalls, escalate through CMO -> CTO.

## Files updated in this heartbeat

- `reports/seo/cal-342-content-qa-day7-unit-converter-publish-readiness-2026-04-19.md`
