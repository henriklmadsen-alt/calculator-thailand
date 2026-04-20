# CAL-337 Day-6 Credit-Card Installment Cluster Content-Safety Pass (2026-04-19)

Reporting manager: CMO  
Issue: CAL-337  
Parent lane: [CAL-68](/CAL/issues/CAL-68)

Wake note used for this heartbeat:
- `issue_commented` assignment from CMO chain: ship Day-6 source-side QA output focused on article usefulness, financial-safety caveats, CTA/internal links, metadata/schema readiness, and verification evidence.

## Scope

This pass covered the Day-6 installment cluster:
- calculator compatibility route: `/คำนวณค่างวดบัตรเครดิต/`
- shared calculator content surface: `/คำนวณดอกเบี้ยบัตรเครดิต/`
- supporting article: `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/`

Focus areas:
- financial-content safety wording
- formula/source traceability
- explicit internal-link compliance at route-file level
- metadata/schema readiness evidence

## Findings

1. Route-level link compliance gap on installment compatibility file
- `src/pages/คำนวณค่างวดบัตรเครดิต/index.astro` had metadata overrides but no explicit installment-article reference in the alias file itself.
- This weakened source-level reciprocity evidence for the Day-6 launch gate.

2. Formula-source mapping could be clearer in installment article body
- Formula statements were numerically consistent, but section-level wording did not explicitly map formula classes to source basis at the formula block.

## Fixes Shipped

1. Added explicit source-level internal link wiring in compatibility route
- Added `supportingInstallmentArticleHref` constant in alias route file with direct target:
  - `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/`
- Passed this into calculator page via new override props so the route renders a visible “อ่านคู่มือประกอบ” link.

2. Added calculator-template hook for route-level supporting article CTA
- Updated `src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro` to accept optional:
  - `supportingArticleHrefOverride`
  - `supportingArticleLabelOverride`
- Rendered a prominent, visible support-article block when overrides are provided.

3. Tightened formula-source wording in installment article
- Clarified 8% example statement to explicitly cite BOT News 47/2568 and end date `31 ธันวาคม 2569`.
- Added “ที่มาสูตร” paragraph in formula section covering:
  - BOT basis for daily-interest framing, 16% cap, 8% minimum (temporary), and 3% cash-advance fee + VAT
  - amortization formula (`M = P x r / (1 - (1 + r)^(-n))`) as planning math, not issuer-specific mandatory formula

## Article Usefulness Check

Status: PASS

- Core user intent is preserved: monthly-payment planning, minimum-payment context, worked THB examples, and practical mistake-avoidance section.
- Article keeps actionable path from explanation -> calculator CTA -> related tools/articles.

## Financial-Safety Caveats Check

Status: PASS

- Copy remains non-promissory and planning-focused (no guaranteed outcomes or unsafe debt claims).
- Formula block now states official-source basis for regulated parameters and clarifies amortization formula as planning approximation.
- 8% temporary measure is date-bounded to `31 ธันวาคม 2569`, reducing policy-timing ambiguity.

## CTA + Internal-Link Check

Status: PASS

- Article has primary calculator CTA to `/คำนวณค่างวดบัตรเครดิต/` plus calculator/tool/article related links.
- Compatibility calculator route now includes explicit source-level installment article target and renders visible support link.
- Reciprocal cluster path is now explicit in both source and rendered output.

## Metadata + Schema Readiness

Status: PASS

- Installment compatibility calculator route sets dedicated title/description/canonical/pageName overrides (`/คำนวณค่างวดบัตรเครดิต/`).
- Shared calculator template emits `WebApplication` + `FAQPage` JSON-LD and canonical URL.
- Supporting article has title/description/canonical + `publishDate`, and `BlogPostLayout` emits canonical + `Article` JSON-LD + `FAQPage` + `BreadcrumbList`.

## Verification

Commands run:

```bash
rg -n "supportingInstallmentArticleHref|ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย" src/pages/คำนวณค่างวดบัตรเครดิต/index.astro src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro -S
rg -n "ที่มาสูตร|ข่าวฉบับที่ 47/2568|M = P x r" src/pages/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/index.astro -S
Get-ChildItem src/pages/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/index.astro | Select-String -Pattern 'href="/คำนวณค่างวดบัตรเครดิต/"' -CaseSensitive
Get-ChildItem src/pages/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/index.astro | Select-String -Pattern 'href="/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/"' -CaseSensitive
rg -n "const title|const description|const canonical|publishDate|faqData" src/pages/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/index.astro -S
rg -n "pageTitleOverride|pageDescriptionOverride|canonicalPathOverride|pageNameOverride" src/pages/คำนวณค่างวดบัตรเครดิต/index.astro -S
rg -n "jsonLdWebApp|jsonLdFaq|FAQPage|WebApplication" src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro -S
rg -n "Article|FAQPage|BreadcrumbList|datePublished|dateModified|canonical" src/layouts/BlogPostLayout.astro -S
npm test
npm run build
```

Observed:
- Route file now contains explicit installment-article target string and passes override to render visible support link.
- Article formula block now includes source-basis paragraph and precise 8% temporary-measure wording.
- Article source includes direct calculator CTA (`line 175`) and related-article link to credit-card-interest article (`line 191`).
- Metadata/schema hooks confirmed in source:
  - article title/description/canonical/publishDate lines present
  - installment route-level title/description/canonical overrides present
  - calculator `WebApplication` + `FAQPage` JSON-LD present
  - blog layout emits canonical + `Article` + `FAQPage` + `BreadcrumbList`
- `npm test` passed (`38/38`).
- `npm run build` passed (`astro build` + `verify-public-content.mjs`).

## Blocker Owner

- None. No engineering dependency blocker for this heartbeat scope.

## Files Updated

- `src/pages/คำนวณค่างวดบัตรเครดิต/index.astro`
- `src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro`
- `src/pages/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/index.astro`
- `reports/seo/cal-337-day6-credit-card-installment-content-safety-pass-2026-04-19.md`
