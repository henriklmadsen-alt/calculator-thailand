# Kamnuanlek 99/100 UX Redesign Blueprint

Goal: make Kamnuanlek the best calculator website for Thailand, judged by task success, trust, speed, retention, search growth, and monetization quality.

This is a product redesign, not a cosmetic reskin. A 99/100 score requires every major flow to feel obvious, fast, trustworthy, locally relevant, and valuable enough that users come back without needing Google.

## North Star

Kamnuanlek should feel like a Thai decision engine:

- Users arrive with a question.
- The page gives the answer immediately.
- The answer explains assumptions clearly.
- The page suggests the next useful action.
- The user can save, share, compare, or apply without confusion.

## Visual Thesis

Calm, precise, Thai-local utility: a fast financial/work/life command center with premium typography, restrained color, clear result hierarchy, and light motion that makes the product feel alive without slowing it down.

## Interaction Thesis

1. Search and calculators should respond instantly.
2. Calculator results should animate into a clear decision summary.
3. Related actions should reveal progressively after the result, not compete with the form.

## Current Assets To Reuse

The repo already has useful foundations:

- Homepage search and category discovery: `src/pages/index.astro`
- Calculator source of truth: `src/lib/calculators.ts`
- Favorites: `src/components/templates/FavoriteCalculators.astro`, `src/components/BookmarkButton.astro`, `src/lib/favorites.ts`
- Recent calculations/history: `src/components/templates/RecentCalculations.astro`, `src/lib/calc-history.ts`
- Save and compare drawer: `src/components/templates/SaveCompareDrawer.astro`
- Result action hub: `src/components/templates/ResultCardHub.astro`
- Trust panels: `src/components/templates/TrustBadge.astro`, `src/components/templates/PublicTrustPanel.astro`, `src/components/templates/TransparencyPanel.astro`
- Affiliate flow: `src/components/templates/AffiliateCard.astro`, `src/pages/go/[affiliate].astro`, `src/data/affiliate-config.ts`
- Tracking: `src/lib/calculator-tracking.ts`, `src/pages/api/events.ts`, `src/pages/api/retention.ts`, `src/pages/api/kpi/dashboard.ts`

## Score Model For 99/100

| Area | Weight | Required For 99 |
|---|---:|---|
| First impression and homepage | 12 | Search-first, calm, premium, obvious next paths, no category overload |
| Calculator task success | 18 | Users get accurate results fast, with zero ambiguity |
| Result intelligence | 15 | Results explain meaning, risks, next actions, and comparisons |
| Trust and methodology | 12 | Sources, formulas, dates, assumptions, authors/reviewers visible |
| Mobile speed and accessibility | 12 | Real mobile field CWV pass, WCAG 2.2 AA, thumb-first UX |
| Retention and habit loops | 10 | Recent, favorites, saved results, share/export, popular today |
| Search/discovery | 8 | Great internal search with synonyms and Thai/English intent matching |
| Monetization UX | 8 | Affiliate flow feels useful and neutral, never like a generic ad |
| Analytics and iteration | 5 | Every key action measured and weekly improvement loop active |

## 1. Rebuild The Homepage As A Utility Dashboard

### Objective

The homepage must be the fastest way for a Thai user to find or resume the right calculator. It should feel like a utility command center, not a long directory.

### Current State

`src/pages/index.astro` already has:

- Search bar
- Recent calculators
- Favorite calculators
- Category grid
- Popular calculators
- New calculators
- Guide links

The weakness is prioritization. Too many things compete at once, and the first screen does not yet feel world-class.

### Required Work

1. Redesign first viewport around search and top actions:
   - Brand
   - One-line promise
   - Large search input
   - Top 6 high-value calculators
   - Recently used/favorites if available

2. Replace category overload with progressive discovery:
   - Show 6-8 primary categories first.
   - Add "More categories" expansion.
   - Use plain layout and compact icons, not a dense mosaic.

3. Add "Popular in Thailand today":
   - Initially powered by curated fallback data.
   - Later powered by GSC/GA4.
   - Separate "popular", "seasonal", and "newly updated".

4. Add "Continue where you left off":
   - Recent calculators
   - Saved results
   - Favorite calculators

5. Add homepage trust strip:
   - Number of calculators
   - Updated for 2569
   - Privacy: calculations run locally where applicable
   - Sources/methodology link

### Acceptance Criteria

- First viewport has one dominant action: search.
- A first-time user can identify the top calculators in under 5 seconds.
- Returning users see recent/favorite/saved tools without scrolling far.
- Category list is no longer visually overwhelming.
- Mobile first screen is usable without cramped text or overlapping controls.

### Measurement

- Homepage search usage rate
- Top calculator click-through rate
- Bounce rate from homepage
- Scroll depth
- Recent/favorite module interactions

## 2. Redesign Calculators Around Answer First, Explanation Second, Action Third

### Objective

Every calculator page should have the same mental model:

1. Enter inputs.
2. Get the answer.
3. Understand what the answer means.
4. Decide what to do next.

### Current State

Many pages are functional, but layouts vary. Some have strong result blocks, some have long explanatory content, and some show affiliate/next-step sections after calculation.

### Required Work

1. Create a standardized calculator shell:
   - Header: title, short promise, update/source row.
   - Input area: compact grouped inputs.
   - Result area: dominant answer and interpretation.
   - Action area: save/share/compare/next step.
   - Explanation: formula, example, assumptions, FAQ.

2. Build page-type variants:
   - Finance calculator
   - Tax calculator
   - Utility bill calculator
   - Health/life calculator
   - Unit/conversion calculator

3. Add result states:
   - Empty
   - Calculating
   - Valid result
   - Invalid input
   - Warning/risk
   - Comparison mode

4. Standardize input UX:
   - Numeric formatting
   - Clear labels
   - Helpful presets
   - Inline validation
   - Mobile keyboard types

5. Ensure no ad/affiliate unit appears before the task is complete unless it is clearly contextual.

### Acceptance Criteria

- Priority calculators use one recognizable layout system.
- Result appears above the fold after calculation on mobile where feasible.
- Inputs and result do not shift unexpectedly.
- Error states are Thai, specific, and actionable.
- Formula and assumptions are always one tap/scroll away.

### Measurement

- Calculator completion rate
- Time to result
- Input error rate
- Result visibility rate
- Save/share/copy interactions

## 3. Create Premium Result Cards With Comparison, Risk Flags, And Next-Step Guidance

### Objective

The result should not only display a number. It should help users make a decision.

### Current State

`ResultCardHub.astro`, `SaveCompareDrawer.astro`, and action-chain components exist, but result intelligence is not yet consistently integrated across pages.

### Required Work

1. Build a new `DecisionResultPanel` component:
   - Primary result
   - Supporting numbers
   - Plain-language meaning
   - Risk/attention flags
   - Next action
   - Save/share/compare controls

2. Add domain-specific result logic:
   - Loan: monthly payment, total interest, debt-to-income warning, compare offer.
   - Salary: take-home pay, total deductions, tax bracket, yearly estimate.
   - VAT: before tax, VAT amount, total, invoice note.
   - Electricity: units, base charge, Ft, VAT, provider assumption.
   - Age: years/months/days, next birthday, official-use caveat.

3. Add scenario comparison:
   - Loan: compare terms/rates/down payments.
   - Salary: before/after raise.
   - Tax: deduction scenarios.
   - Electricity: usage tiers.

4. Add quality labels:
   - "Estimate"
   - "Official-rate based"
   - "Needs bank confirmation"
   - "Tax planning only"

### Acceptance Criteria

- Result panels answer "what does this mean?" without requiring a long article.
- Risk flags are helpful, not alarming.
- Result cards are shareable and saved cleanly.
- Comparison mode works on the top money calculators.

### Measurement

- Save result rate
- Share/copy result rate
- Comparison usage rate
- Affiliate click rate after result
- Repeat calculator usage

## 4. Add Saved And Shareable Results For High-Value Calculators

### Objective

Users should be able to keep useful outputs and return later. This turns one-time calculations into a habit loop.

### Current State

There is already local saved-result infrastructure, but it needs standardization and stronger integration into priority calculators.

### Required Work

1. Define a standard saved-result schema:
   - Calculator id
   - Calculator title
   - Result summary
   - Key inputs
   - Timestamp
   - Share URL
   - Version/formula date

2. Integrate save/share on priority calculators:
   - Home loan
   - Car loan
   - Net salary
   - Income tax
   - VAT
   - Electricity
   - Overtime
   - Age

3. Add shareable URL parameters where safe:
   - Do not expose sensitive data by default.
   - Allow opt-in share links for non-sensitive values.

4. Add export options:
   - Copy summary
   - Print
   - PNG
   - PDF later for finance calculators

5. Improve the saved drawer:
   - Better comparison view
   - Clear labels
   - Delete one item
   - Empty state with recommended calculators

### Acceptance Criteria

- Top calculators can save and restore meaningful results.
- Saved data is privacy-safe and local by default.
- Share text is Thai and understandable.
- Saved drawer works on mobile without covering important controls.

### Measurement

- Save rate
- Return sessions with saved results
- Restore/open saved result events
- Share events

## 5. Add Real "Popular In Thailand Today" From GSC/GA4

### Objective

Use real demand data to shape discovery. The site should feel alive and timely.

### Current State

`getPopularCalculators()` exists as static/popular data. GSC access works. KPI API has GSC-only fallback.

### Required Work

1. Create a popularity data pipeline:
   - GSC clicks/impressions by page
   - GA4 page views when GA4 service account is connected
   - Manual fallback list

2. Generate a build-time or cached JSON file:
   - `public/data/popular-calculators.json`
   - Top today
   - Trending this week
   - Seasonal/current
   - Money calculators

3. Add homepage modules:
   - Popular today
   - Trending now
   - Recently updated
   - High-value finance tools

4. Add category-level popular modules:
   - Tax popular
   - Loan popular
   - Salary popular
   - Utility popular

5. Add admin view:
   - Which popular modules drove clicks
   - Which pages have impressions but poor CTR

### Acceptance Criteria

- Homepage has a data-backed popular module.
- Missing GSC/GA4 data gracefully falls back.
- Popular modules do not cause layout shifts.
- Links preserve campaign/UTM where needed.

### Measurement

- Module CTR
- Page depth per session
- Return visits
- Search-to-click rate

## 6. Make Every Affiliate Journey Helpful Decision Support

### Objective

Affiliate monetization should feel like a useful next step after calculation, not an ad.

### Current State

Affiliate safety is improved. Unconfigured campaign URLs do not leak to generic pages. CTA cards exist, but the pre-sell experience is still basic.

### Required Work

1. Create a `PartnerDecisionPanel` component:
   - User result recap
   - What to check before applying
   - Eligibility considerations
   - Neutral comparison copy
   - Partner CTA
   - Disclosure

2. Add domain-specific affiliate flows:
   - Home loan: refinance/buying readiness, DTI, docs checklist.
   - Car loan: monthly affordability, down payment, flat vs effective rate.
   - Personal loan: repayment ability, APR warning, alternatives.
   - Credit card: utilization, minimum payment risk.
   - Insurance: coverage checklist, deductible tradeoffs.

3. Add affiliate event funnel:
   - CTA impression
   - CTA expand
   - Partner click
   - Redirect configured/unconfigured
   - Result-to-click conversion

4. Add fallback if campaign missing:
   - Hide paid CTA.
   - Show internal educational next step instead.

5. Add partner comparison pages:
   - Not fake rates.
   - Explain what to compare.
   - Link to calculators and available partners.

### Acceptance Criteria

- Affiliate CTA never appears without context on priority money pages.
- Users understand why the partner action is relevant to their result.
- Disclosure is visible and plain Thai.
- Missing campaign URLs do not create dead or generic exits.

### Measurement

- CTA impression to click rate
- Result completion to partner click rate
- Unconfigured campaign count
- Revenue/session once affiliate reporting is available

## 7. Build A Design System So Every Calculator Feels Consistent

### Objective

Kamnuanlek needs a reusable product design system, not one-off page styling.

### Current State

There are shared components, but many pages still contain local Tailwind/layout decisions. This causes inconsistent result panels, page rhythm, spacing, and CTA behavior.

### Required Work

1. Define design tokens:
   - Typography scale
   - Spacing scale
   - Color roles
   - Radius rules
   - Focus states
   - Form states
   - Result states

2. Create core components:
   - `CalculatorPageShell`
   - `CalculatorInputGroup`
   - `DecisionResultPanel`
   - `FormulaAssumptionBox`
   - `SourceFreshnessBar`
   - `PopularCalculatorStrip`
   - `PartnerDecisionPanel`
   - `SavedResultSummary`

3. Standardize page rhythm:
   - Header
   - Tool
   - Result
   - Related actions
   - Formula/method
   - FAQ
   - Related calculators/articles

4. Remove nested-card clutter:
   - Use sections, dividers, and grouped controls.
   - Cards only for repeated items, modal/drawer items, and result panels.

5. Create visual regression snapshots for priority pages.

### Acceptance Criteria

- Priority calculators look and behave like one product.
- New calculator pages can be built from the system.
- Button, input, result, trust, and affiliate patterns are consistent.
- No text overlap on mobile/desktop audits.

### Measurement

- Visual QA pass across priority routes
- Mobile readability audit
- Accessibility audit
- Component reuse percentage on priority calculators

## 8. Add Source Freshness And Methodology Visibility Everywhere

### Objective

Trust must be visible before users have doubts.

### Current State

There are methodology pages, metadata headers, trust panels, and source mentions. The issue is consistency and prominence.

### Required Work

1. Add a standard `SourceFreshnessBar`:
   - Updated date
   - Source name
   - Formula version
   - Calculation type

2. Add `FormulaAssumptionBox` to every priority calculator:
   - Formula
   - Assumptions
   - Rounding
   - When to verify with official source/professional

3. Add methodology links:
   - Page-level methodology
   - Global methodology
   - Official source URL

4. Add review/update workflow:
   - Formula last reviewed
   - Official rate last checked
   - Owner/reviewer

5. Extend audits:
   - Source freshness required for priority calculators.
   - No stale 2569 claims without update metadata.

### Acceptance Criteria

- Priority calculators show source/freshness near the tool.
- Formula and assumptions are easy to find.
- Users can distinguish estimate vs official-rate based result.
- Public content guard stays clean.

### Measurement

- Trust panel visibility rate
- Source link click rate
- Feedback: "unclear formula" reports
- Audit pass rate

## 9. Build Internal Search Good Enough That Users Start There Instead Of Google

### Objective

Search must understand Thai user intent, not only exact titles.

### Current State

Homepage search exists and filters calculator data. It needs synonym, typo, and intent support.

### Required Work

1. Expand calculator metadata:
   - Thai synonyms
   - English synonyms
   - Common misspellings
   - Intent tags
   - Seasonal tags
   - Related page aliases

2. Upgrade search ranking:
   - Exact title
   - Synonym match
   - Category match
   - Popularity boost
   - Money-page boost
   - Recent/favorite boost

3. Add search suggestions:
   - Top queries
   - "Did you mean"
   - Related calculators
   - Empty-state recommendations

4. Add keyboard UX:
   - Arrow navigation
   - Enter to open
   - Escape to close
   - Accessible labels

5. Track search:
   - Query
   - Result count
   - Selected result
   - No-result query

### Acceptance Criteria

- "ผ่อนรถ", "car loan", "ค่างวดรถ", "ไฟแนนซ์รถ" all find the right pages.
- No-result searches provide useful suggestions.
- Search is fast on mobile.
- Search can be opened from header on every page.

### Measurement

- Search success rate
- No-result rate
- Search-to-click rate
- Repeat search rate

## 10. Make The Site Feel Fast, Calm, And Useful On Cheap Android Phones

### Objective

The experience must feel excellent on real Thai mobile conditions, not just desktop.

### Current State

Static CWV and mobile readability audits pass after the recent fixes. Field validation is still needed.

### Required Work

1. Set performance budgets:
   - Page JS budget
   - CSS budget
   - LCP budget
   - INP budget
   - CLS budget

2. Test priority pages on mobile viewport:
   - Homepage
   - Tax
   - Net salary
   - VAT
   - Electricity
   - Home loan
   - Car loan
   - Age

3. Optimize interaction cost:
   - Avoid heavy client JS on simple calculators.
   - Lazy-load non-critical modules.
   - Defer affiliate/admin/tracking scripts where safe.

4. Remove visual noise:
   - Reduce thick borders and stacked cards.
   - Keep result focus.
   - Avoid long intro content before tools.

5. Add automated checks:
   - Static CWV audit
   - Mobile readability audit
   - Screenshot checks
   - No overlap checks
   - Console error checks

### Acceptance Criteria

- Priority pages pass lab and field CWV targets.
- No mobile text overlap.
- Calculator result appears quickly.
- No ad/CTA causes layout shift.
- Pages still work without perfect network conditions.

### Measurement

- CrUX/PageSpeed field data
- Lighthouse mobile
- Static CWV audit
- Real user INP/LCP/CLS if GA4/field tracking supports it

## Implementation Phases

### Phase 0: Lock The Foundation

Purpose: make sure nothing leaks or breaks while redesign begins.

Tasks:

- Finish Railway env setup: affiliate URLs, `KPI_API_TOKEN`, `GA4_SERVICE_ACCOUNT_JSON`.
- Keep current build/audit gates passing.
- Decide top 8 priority calculators for the first redesign slice.
- Freeze unrelated page generation changes during core UX work.

Exit criteria:

- Build passes.
- Public content guard passes.
- Affiliate audit is 0 missing for active campaigns or paid CTA fallback is accepted.
- KPI dashboard can show GSC and GA4 data.

### Phase 1: Design System And Homepage

Purpose: establish the new product language and first impression.

Tasks:

- Define tokens and core components.
- Rebuild homepage first viewport.
- Add popular/today module with fallback data.
- Upgrade search UI and empty state.
- Validate desktop and mobile screenshots.

Exit criteria:

- Homepage design score target: 92+.
- Search success works for top synonyms.
- Mobile first viewport is clean and actionable.

### Phase 2: Priority Calculator Template

Purpose: create the reusable calculator experience.

Tasks:

- Build `CalculatorPageShell`.
- Build `DecisionResultPanel`.
- Build `SourceFreshnessBar`.
- Build `FormulaAssumptionBox`.
- Apply to 2 pilot calculators: car loan and VAT.

Exit criteria:

- Pilot calculators pass formula tests.
- Result appears cleanly on mobile.
- Result panel includes meaning, assumptions, and next step.

### Phase 3: Money Calculator Rollout

Purpose: redesign the highest traffic and highest revenue calculators.

Tasks:

- Home loan
- Car loan
- Net salary
- Income tax
- VAT
- Electricity
- Overtime
- Age

Exit criteria:

- All priority calculators use the new shell.
- Save/share/compare available where relevant.
- Affiliate flow uses `PartnerDecisionPanel` on money pages.

### Phase 4: Search, Retention, And Personalization

Purpose: make users come back.

Tasks:

- Upgrade search metadata and ranking.
- Add saved result restore.
- Improve favorites/recent modules.
- Add "Your toolkit" homepage section.
- Add share/export upgrades.

Exit criteria:

- Search no-result rate drops.
- Save/return flows work.
- Homepage adapts to returning users.

### Phase 5: Measurement And Continuous Optimization

Purpose: make the 99/100 score defensible with data.

Tasks:

- Track all core funnel events.
- Build weekly UX/SEO/revenue dashboard.
- Run A/B tests for homepage modules, result panel copy, CTA placement.
- Add field CWV monitoring.

Exit criteria:

- Weekly scorecard updates from real data.
- Clear backlog generated from measured user behavior.

## Definition Of Done For 99/100

Kamnuanlek can claim 99/100 only when all are true:

- Homepage is search-first, calm, and data-driven.
- Priority calculators use one premium layout system.
- Result panels explain the answer and next action.
- Save/share/compare flows work on top calculators.
- Affiliate CTAs are contextual, tracked, and fully configured.
- Internal search handles Thai/English synonyms and common intents.
- Trust/source/freshness is visible on every priority calculator.
- Mobile field performance is excellent.
- Analytics prove users complete, save, share, return, and click next actions.
- Weekly iteration loop is operational.

## Immediate Next Build Slice

The first implementation slice should be:

1. Create design tokens and a lightweight calculator page shell.
2. Redesign homepage first viewport and search area.
3. Build the first `DecisionResultPanel`.
4. Apply it to car loan as the pilot money calculator.
5. Validate with build, formula tests, mobile screenshot, and static audits.

This slice proves the new product standard before migrating the full calculator library.
