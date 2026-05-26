# Kamnuanlek Competitive Audit

Date: 2026-05-26  
Site: https://www.kamnuanlek.com  
Goal: become the highest-visited calculator website in Thailand and convert high-intent finance calculators into affiliate commission revenue.

## Executive Verdict

Kamnuanlek has a strong technical and content foundation, but it is not yet a traffic leader. The current global competitive score is **58/100** because traffic and authority are still far behind established calculator sites. The separate Thailand growth-readiness score is now **73/100** after the 2026-05-26 implementation pass, with post-implementation technical readiness at **84/100**. The remaining gap is mostly market traction, campaign attribution setup, GA4/KPI configuration, and authority growth rather than basic calculator code.

The biggest business problem is not the calculator code. It is that the highest-value affiliate pages are currently weak in Google Search Console:

| Page | Clicks | Impressions | CTR | Avg position | Business meaning |
| --- | ---: | ---: | ---: | ---: | --- |
| `/คำนวณค่าไฟฟ้า/` | 52 | 2,706 | 1.92% | 7.1 | Best current traffic beachhead |
| `/คำนวณอายุ/` | 13 | 2,769 | 0.47% | 8.2 | High impressions, weak CTR |
| `/คำนวณค่าโอที/` | 6 | 271 | 2.21% | 12.5 | Near page-one opportunity |
| `/คำนวณผ่อนรถ/` | 3 | 741 | 0.40% | 47.2 | Commission page, poor ranking |
| `/คำนวณผ่อนบ้าน/` | 1 | 254 | 0.39% | 60.2 | Commission page, poor ranking |
| `/คำนวณภาษีมูลค่าเพิ่ม/` | 0 | 382 | 0.00% | 34.5 | Search demand exists, page underperforming |
| `/คำนวณเงินเดือนสุทธิ/` | 0 | 49 | 0.00% | 4.9 | Ranking exists, snippet/intent mismatch likely |

Data window: Google Search Console export for 2026-04-22 to 2026-05-22.

## Scoring Model

Each site is scored 0-100 using the business goal, not just design quality.

| Dimension | Weight | What it measures |
| --- | ---: | --- |
| Traffic and search visibility | 30 | Visits, organic dependence, ranking footprint, brand demand |
| Calculator breadth and depth | 15 | Number of tools, category coverage, formula usefulness |
| SEO, schema, and GEO readiness | 15 | Indexability, snippets, structured data, AI answer suitability |
| UX, speed, and mobile usability | 10 | Fast interaction, readability, no friction |
| Monetization and affiliate fit | 15 | Ability to turn intent into partner clicks/leads |
| Trust and compliance | 10 | Disclosure, sources, methodology, data freshness |
| Operating leverage | 5 | Maintainability, QA, reporting, ability to ship/iterate |

## Global Top 5 Calculator Benchmarks

These are the highest-traffic broad calculator/tool sites found with public Semrush April 2026 traffic pages. Semrush traffic is directional, not exact; its own documentation says it estimates traffic from aggregated browsing patterns, search activity, verified partner/public data, and Google search signals.

| Rank | Site | Public April 2026 visits | Authority score | Primary strengths | Score |
| ---: | --- | ---: | ---: | --- | ---: |
| 1 | Calculator.net | 58.73M | 91 | Massive brand/search footprint, finance/health/math hub, low friction, strong direct traffic | 88 |
| 2 | Omni Calculator | 16.48M | 84 | Very deep calculator library, explainable content, strong GEO/AI answer suitability | 87 |
| 3 | CalculatorSoup | 11.58M | 82 | Simple utility UX, strong math/time coverage, direct audience habit | 78 |
| 4 | RapidTables | 11.35M | 80 | Wide utility coverage, high pages per visit, strong conversion/unit/tool keywords | 76 |
| 5 | UnitConverters.net | 8.60M | 86 | Extremely focused conversion intent, strong organic share, fast task completion | 72 |
| - | Kamnuanlek | GSC actual clicks still low | Not publicly established | Thailand-specific content scale, schema, Thai utility breadth, affiliate-ready pages | 58 |

Sources checked:
- https://www.semrush.com/website/calculator.net/overview/
- https://www.semrush.com/website/omnicalculator.com/overview/
- https://www.semrush.com/website/calculatorsoup.com/overview/
- https://www.semrush.com/website/rapidtables.com/overview/
- https://www.semrush.com/website/unitconverters.net/overview/
- https://www.semrush.com/website/

## Detailed Competitive Scores

| Site | Traffic /30 | Breadth /15 | SEO+GEO /15 | UX /10 | Monetization /15 | Trust /10 | Ops /5 | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Calculator.net | 30 | 12 | 14 | 8 | 11 | 9 | 4 | 88 |
| Omni Calculator | 25 | 15 | 15 | 9 | 8 | 10 | 5 | 87 |
| CalculatorSoup | 21 | 11 | 13 | 7 | 7 | 8 | 4 | 78 |
| RapidTables | 21 | 13 | 13 | 7 | 6 | 8 | 4 | 76 |
| UnitConverters.net | 18 | 10 | 12 | 8 | 5 | 8 | 4 | 72 |
| Kamnuanlek | 4 | 14 | 14 | 6 | 9 | 7.5 | 3.5 | 58 |

### What the Leaders Do Better

1. They own generic intent before monetizing specific intent. Calculator.net wins because it ranks for "calculator", "age calculator", "BMI calculator", "mortgage calculator", and other repeat-use queries.
2. They make each page a complete destination. A strong calculator page has the tool, formula, example, FAQ, related calculators, common mistakes, and next-step links.
3. They have direct traffic and habit loops. Calculator.net and CalculatorSoup have enough direct traffic that they are less dependent on one Google update.
4. They use simple, stable interfaces. Most leaders are not visually fancy. They are fast, predictable, and instantly useful.
5. They are link-worthy. Tools, formulas, examples, and embeddable references create natural backlinks.

### What Kamnuanlek Can Beat Them On

1. Thai localization: Thailand-specific tax, salary, electricity, labor law, property, loan, and insurance context.
2. Affiliate intent: global calculator sites are not optimized for Thai lead generation. Kamnuanlek can own "calculate first, apply after confidence" journeys.
3. Freshness: Thai year 2569 content, official-rate updates, and localized examples can beat older/static Thai pages.
4. Breadth: the build currently generates 947 pages, giving enough surface area for topical clusters if internal linking and quality are controlled.

## Thailand-Relevant SERP Competitors

These are not all global traffic giants, but they appear in Thai calculator/search workflows and matter for Thailand dominance.

| Competitor | Type | Threat | Kamnuanlek response |
| --- | --- | --- | --- |
| ToolThaiD | Thai multi-tool/calculator hub | Broad Thai utility coverage and 2026 positioning | Beat with better calculator UX, cleaner schema, stronger finance clusters |
| Kidlek | Older Thai online calculator brand | Long-lived domain and calculator intent familiarity | Beat with mobile UX, freshness, trust signals, affiliate journeys |
| CalcBE Thai | Multilingual calculator hub | Clean generic calculator pages across languages | Beat with Thailand-specific examples, official sources, and Thai SERP targeting |
| ConverTH VAT | Narrow Thai VAT tool | Focused VAT intent | Build stronger VAT cluster: VAT included/excluded, business VAT, invoice examples, 2026 compliance |
| LifeSara tax calculator | Thai tax article/tool intent | Strong article-style tax search fit | Build deeper tax examples, salary brackets, FAQ schema, and source freshness |
| Bank/finance calculators | Official finance brands | High trust for loan intent | Use neutral comparison/pre-application UX; do not try to look like a bank |

## Current Kamnuanlek Site Audit

Evidence from local build and audit scripts:

| Area | Result | Score |
| --- | --- | ---: |
| Static build | `npm run build` completed; 947 pages generated | Pass |
| Full SEO audit | 956 routes checked; 928 content pages; all key OG/Twitter/schema/GA4/viewport/hreflang checks passed for content pages | 96/100 |
| Sitemap/index surface | 943 sitemap pages | Strong |
| Formula verification | 28/28 calculator formula tests passed | 90/100 |
| Mobile readability | 20 priority routes, 0 failing routes | Pass |
| Internal links | 248 internal links checked, 0 critical unresolved | Pass |
| Internal depth | 24 priority routes, all reachable within depth <= 3 | Pass |
| CWV/static asset audit | 20 priority routes, 0 unresolved signals, 0 blocking third-party CSS, 0 blocking scripts, 0 CLS flags | Pass |
| Public content guard | Passed after Thai-first last-updated copy cleanup | Pass |
| Trust signal sample | Average 100%; Sentry 98/100 sampled pages | Strong |

## Affiliate Funnel Audit

The site already has the correct foundation:

| Component | File | Status |
| --- | --- | --- |
| Partner registry | `src/data/affiliate-config.ts` | Present |
| Calculator-to-partner mapping | `src/data/affiliate-config.ts` | Present |
| CTA card | `src/components/templates/AffiliateCard.astro` | Present |
| Affiliate disclosure near CTA | `src/components/templates/AffiliateCard.astro` | Present |
| Full affiliate disclosure page | `src/pages/affiliate-disclosure/index.astro` | Present |
| Redirect/tracking route | `src/pages/go/[affiliate].astro` | Present |
| GA4 click/redirect events | `AffiliateCard.astro`, `/go/[affiliate].astro` | Present |

### Revenue Blockers

1. **Missing production affiliate URLs.** Railway currently has these as missing: `AFFILIATE_URL_TTB_CASH2GO`, `AFFILIATE_URL_KTC_BROTHER_BERM`, `AFFILIATE_URL_NGERN_TID_LOR`, `AFFILIATE_URL_TIPINSURE`, `AFFILIATE_URL_UOB_TMRW`, `AFFILIATE_URL_KRUNGSRI_SIGNATURE`, `AFFILIATE_URL_KEPT_KRUNGSRI`, and `AFFILIATE_URL_RABBIT_CARE_HEALTH_CPL`. The code now prevents generic AccessTrade/Involve homepage redirects and hides unconfigured CTA cards, but real campaign URLs are still required to monetize those pages.
2. **Commission pages do not rank yet.** `/คำนวณผ่อนรถ/` averages position 47.2 and `/คำนวณผ่อนบ้าน/` averages position 60.2 in the GSC window. With those positions, affiliate clicks will stay low.
3. **CTA appears after calculation, but not enough pre-sell intent exists.** Users need partner comparison context before they trust an application click.
4. **Incomplete GA4/KPI configuration.** GSC works and the KPI API now supports GSC-only fallback, but Railway still needs `GA4_SERVICE_ACCOUNT_JSON` and `KPI_API_TOKEN` for dependable sessions, users, revenue, and protected dashboard access.

## Number-One Strategy

### Phase 1: Fix Revenue Tracking Before Scaling Traffic

Priority: highest.

1. Add real tracked affiliate campaign URLs in Railway for every `AFFILIATE_URL_*` variable.
2. Confirm that `/go/[affiliate]` appends `sub_id` and redirects to the real campaign link when configured; missing campaign links should remain stopped rather than sending users to generic network pages.
3. Add GSC + GA4 reporting for:
   - organic clicks by page
   - affiliate card impressions
   - affiliate clicks
   - affiliate redirects
   - click-through rate from calculator result to partner
4. Add a daily/weekly KPI view for top traffic pages and top money pages.

### Phase 2: Win Existing Near-Page-One Traffic

Priority: fastest organic gain.

| Page | Problem | Action |
| --- | --- | --- |
| Electricity calculator | Already has clicks; CTR only 1.92% | Rewrite title/meta for exact Thai 2569 queries, add "PEA/MEA/Ft/VAT" above the fold |
| Age calculator | Many impressions; CTR 0.47% | Improve snippet, add Buddhist year/current date language, add FAQ |
| Overtime calculator | Position 12.5 | Add labor-law source references, examples for hourly/monthly workers, related salary links |
| VAT calculator | Position 34.5 | Build VAT cluster and internal links from business/tax pages |
| Net salary calculator | Position 4.9 but 0 clicks | Snippet likely mismatched; title should match "เงินเดือนสุทธิ รับจริง" intent |

### Phase 3: Build Thai Loan Authority Clusters

Priority: affiliate growth.

Home loan cluster:
- `/คำนวณผ่อนบ้าน/`
- "กู้บ้าน 2 ล้าน / 3 ล้าน / 5 ล้าน ผ่อนเดือนละเท่าไหร่"
- "เงินเดือนเท่าไหร่กู้บ้านได้"
- "รีไฟแนนซ์บ้าน 2569"
- "เปรียบเทียบดอกเบี้ยบ้าน MLR/MRR/MOR"
- "ค่าใช้จ่ายวันโอนบ้าน"
- "เอกสารสมัครสินเชื่อบ้าน"

Car loan cluster:
- `/คำนวณผ่อนรถ/`
- `/คำนวณค่างวดสินเชื่อรถ/`
- "ผ่อนรถ 500,000 / 700,000 / 1,000,000 บาท"
- "ดาวน์รถกี่เปอร์เซ็นต์ดี"
- "Flat rate vs effective rate"
- "รถมือสองจัดไฟแนนซ์ยังไง"
- "รีไฟแนนซ์รถ"
- "เอกสารสมัครสินเชื่อรถ"

Every article should push to the calculator first, then to a partner comparison CTA after the user sees numbers.

### Phase 4: Build a Calculator.net-Style Habit Loop for Thailand

Priority: durable traffic.

1. Add "popular today" and "recently updated" calculator modules.
2. Add saved/recent calculators if not already active on public pages.
3. Create embeddable calculators for Thai blogs, forums, HR teams, real estate agents, and auto dealers.
4. Build source pages for official rates:
   - electricity Ft and PEA/MEA assumptions
   - tax brackets and deductions
   - social security rates
   - minimum wage by province
   - loan formula methodology
5. Turn high-performing calculators into annual evergreen URLs with updated 2569 content rather than creating fragmented duplicates.

## Priority Backlog

| Priority | Task | Impact | Difficulty |
| ---: | --- | --- | --- |
| P0 | Set all real affiliate URL env vars in Railway | Prevents lost commission attribution | Low |
| P0 | Add GA4 service account + KPI token or dashboard fallback | Makes SEO/funnel reporting operational | Medium |
| P1 | Keep public content guard passing after every deploy | Trust/localization | Low |
| P1 | Validate field Core Web Vitals after deployment | Ranking/UX | Medium |
| P1 | Continue snippet tests for electricity, age, net salary, VAT | Fast CTR/rank gains | Low |
| P1 | Build home/car loan pillar and comparison pages | Affiliate traffic | Medium |
| P2 | Add partner comparison/pre-application modules | Affiliate conversion | Medium |
| P2 | Build backlink assets: embeddable widgets, data pages, official-rate explainers | Authority | High |
| P2 | Add AI/GEO answer blocks to money pages | AI search visibility | Medium |

## Target Scores After 90 Days

| Area | Current | 90-day target |
| --- | ---: | ---: |
| Competitive score | 58 | 72 |
| Traffic/search visibility | 4/30 | 12/30 |
| Monetization/affiliate fit | 9/15 | 13/15 |
| CWV/UX | 8/10 | 9/10 |
| Trust/compliance | 9.5/10 | 10/10 |

The realistic near-term objective is not to beat Calculator.net globally. It is to become the strongest Thai-language calculator property in specific high-intent clusters, then expand outward: electricity, salary/tax, VAT, home loan, car loan, insurance, and social security.
