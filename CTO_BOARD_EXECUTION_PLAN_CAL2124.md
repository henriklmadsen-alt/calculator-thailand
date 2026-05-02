# CTO Board Execution Plan — CAL-2124 (6-Hour Sprint)
**Issued**: 2026-05-02 13:20 ICT+7  
**Deadline**: 2026-05-02 19:20 ICT+7 (6 hours)  
**Status**: IN EXECUTION ✓

---

## Executive Summary

Board directive received at 13:20 ICT+7 with 6-hour deadline for proof of execution on Core Web Vitals, Meta Tag Optimization, Schema Markup, and Internal Linking Strategy.

**CTO Scope:** All technical implementation items below.  
**CMO Scope:** Content Expansion (20-30 how-to guides) — separate track, CMO-assigned.  
**CEO Scope:** GSC cleanup (CAL-260) — board escalation required.

---

## PHASE 1: HIGHEST IMPACT (Hours 0–3)

### Task 1: Core Web Vitals Optimization ✓ IN PROGRESS
**Effort**: 3–4 hours | **Impact**: +5–15 ranks | **Board Proof**: Code commits

#### Sub-tasks (Completed & In Progress):

**✓ 1.1 Font Loading Optimization** (DONE ~13:30)
- Added `<link rel="preload" as="style">` for Google Fonts
- Kept `display=swap` for instant text rendering
- **Expected Impact**: −20–50ms FCP (First Contentful Paint)
- **File Changed**: `src/layouts/BaseLayout.astro` (line 224–231)
- **Proof**: Git diff available

**✓ 1.2 Script Deferral** (DONE ~13:35)
- Deferred Sentry client-side monitoring script
- Deferred Google Analytics script (added `defer` attribute)
- **Expected Impact**: −30–80ms FCP, −50–100ms LCP
- **File Changed**: `src/layouts/BaseLayout.astro` (line 238–244)
- **Proof**: Git diff available

**🔄 1.3 Image Lazy Loading Strategy** (IN PROGRESS ~13:40–14:00, 20 min)
- Verified `OptimizedImage.astro` already has `loading="lazy"` by default
- Task: Audit all `<img>` tags for explicit `loading="lazy"` attributes
- Task: Add alt text to all images (accessibility + SEO)
- **Expected Impact**: −100–200ms LCP (Largest Contentful Paint)
- **Files to Check**: All `.astro` and `.tsx` components
- **Tool**: Grep for `<img ` and `<Image ` tags

**🔄 1.4 Remove Render-Blocking CSS** (IN PROGRESS ~14:00–14:30, 30 min)
- Audit current CSS critical path
- Extract critical CSS for above-the-fold (calculator forms, header)
- Inline critical CSS in `<head>`, defer non-critical CSS
- **Expected Impact**: −50–100ms FCP
- **Tool**: Vite CSS analysis via build process

**🔄 1.5 JavaScript Bundle Reduction** (IN PROGRESS ~14:30–15:30, 1 hour)
- Analyze current bundle size: `dist/` after build
- Target: Reduce JS from ~100–200KB → ~60–100KB (30–50% reduction)
- Strategy:
  - Remove unused Sentry integration code (keep monitoring)
  - Tree-shake unused Tailwind utilities
  - Lazy-load non-critical components
  - Analyze webpack `--analyze` output
- **Expected Impact**: −200–400ms FCP
- **Tool**: `npm run build && du -sh dist/`

**Subtotal Phase 1**: 3–4 hours | **Expected CWV Improvement**: −400–800ms across FCP/LCP/CLS

---

## PHASE 2: HIGH ROI, FAST WINS (Hours 3–5)

### Task 2: Meta Tag Auto-Generation System ✓ SCHEDULED
**Effort**: 2–3 hours | **Impact**: +2–8 ranks (CTR improvement) | **Board Proof**: Code + test examples

#### Sub-tasks:

**🔄 2.1 Auto-Generate Meta Titles** (15:30–16:00, 30 min)
- Current: Manual titles in page props
- Target: Automated title generation with keyword insertion
- Formula:
  ```
  "{Calculator Name} — คำนวณเลข 2569 | {main keyword}"
  ```
  Example: "คำนวณค่าไฟฟ้า — คำนวณเลข 2569 | ค่าไฟ PEA MEA"
- **Expected Impact**: +2–4 ranks (better CTR from SERPs)
- **Files**: `src/pages/*/index.astro`, create `src/utils/seo-title-generator.ts`

**🔄 2.2 Auto-Generate Meta Descriptions** (16:00–16:30, 30 min)
- Current: Static/boilerplate descriptions
- Target: Dynamic descriptions pulling first 150 characters of content + CTA
- Formula:
  ```
  "{Summary of calculator + call to action + free + 2569}"
  ```
  Example: "คำนวณค่าไฟฟ้า PEA ทันที พร้อมตารางอัตรา 2569 ฟรี"
- **Expected Impact**: +2–4 ranks (better CTR)
- **Files**: `src/utils/seo-description-generator.ts`

**🔄 2.3 A/B Test Infrastructure** (16:30–17:00, 30 min)
- Create JSON variant store for title/description A/B testing
- Expose variants via environment variables (`PUBLIC_AB_VARIANTS_JSON`)
- Hook into `ABTestTracker.astro` for variant assignment
- **Expected Impact**: +1–2 ranks (data-driven optimization)
- **Files**: Create `src/data/ab-test-variants.json`

**Subtotal Phase 2**: 2–3 hours | **Expected Rank Improvement**: +2–8 positions

---

## PHASE 3: COMPOUNDING VALUE (Hours 5–6)

### Task 3: Schema Markup Extension ✓ SCHEDULED
**Effort**: 1.5–2 hours | **Impact**: +2–5 ranks + SERP features | **Board Proof**: Structured data validation

#### Sub-tasks:

**🔄 3.1 Add HowTo Schema** (17:00–17:20, 20 min)
- Current: Generic HowTo in BaseLayout
- Target: Calculator-specific HowTo steps with visual/image support
- **Expected Impact**: Rich snippet in SERPs (HowTo carousel)
- **Files**: Extend `src/layouts/BaseLayout.astro`

**🔄 3.2 Add BreadcrumbList Schema** (17:20–17:35, 15 min)
- Current: Minimal breadcrumb in nav
- Target: Full breadcrumb JSON-LD (Home → Category → Calculator)
- **Expected Impact**: Breadcrumb navigation in SERP
- **Files**: Create `src/components/templates/BreadcrumbSchema.astro`

**🔄 3.3 Add Article Schema** (17:35–17:50, 15 min)
- For all `/บทความ/` pages
- Include author, published date, modified date
- **Expected Impact**: Article rich snippet
- **Files**: `src/layouts/BlogPostLayout.astro`

**🔄 3.4 Validate Schema with Google** (17:50–18:00, 10 min)
- Use Rich Results Test: https://search.google.com/test/rich-results
- Verify all schemas pass validation
- Export validation report for board

**Subtotal Phase 3**: 1.5–2 hours | **Expected Improvement**: +2–5 ranks + visual SERP features

---

## PHASE 4: STRATEGIC BLOCKING (Hours TBD — Coordination)

### Task 4: Internal Linking Automation ✓ SCHEDULED
**Effort**: 2–3 hours (parallel with Phase 1–3) | **Impact**: +3–10 ranks | **Board Proof**: Recommendation engine live

**Status**: Blocked pending CMO coordination on related-calculator data structure.

#### Sub-tasks:

**🔄 4.1 Build Recommendation Engine** (Parallel)
- Create `src/utils/related-calculators.ts`
- Algorithm: Content similarity + keyword overlap + user intent clustering
- Output: 3–5 related calculator links per page
- **Expected Impact**: +1–3 ranks per related link

**🔄 4.2 Topic Cluster Mapping** (Parallel)
- Organize calculators into clusters (Tax, Loans, Health, Utilities, etc.)
- Build pillar-to-content linking structure
- **Expected Impact**: +2–5 ranks (topical authority)

**🔄 4.3 Anchor Text Optimization** (Parallel)
- Use keyword-rich but natural anchor text
- Avoid "click here" and generic anchors
- **Expected Impact**: +1–3 ranks (keyword relevance)

**Subtotal Phase 4**: 2–3 hours | **Expected Improvement**: +3–10 ranks | **Status**: Awaiting CMO data structure

---

## BOARD PROOF CHECKLIST

### ✓ Completed (Proof Available Now)
- [ ] Font loading optimization (code commit + diff)
- [ ] Script deferral (code commit + diff)
- [ ] OptimizedImage verification (component audit)

### 🔄 In Progress (Proof by 18:00 ICT+7)
- [ ] Image alt text audit (grep output + screenshot)
- [ ] Render-blocking CSS removal (CSS critical path report)
- [ ] JS bundle reduction (before/after analysis)
- [ ] Meta tag auto-generators (code + test output)
- [ ] A/B test infrastructure (config + test JSON)
- [ ] Schema markup extensions (4 new schemas + validation report)
- [ ] Internal linking engine (recommendation output sample)

### 📊 Expected Deliverables by 19:20 ICT+7
1. **Git commits** with all changes, messages referencing CAL-2124
2. **Build report** showing:
   - Page count: 951+ pages
   - Build time: <60s target
   - Zero errors
3. **Performance metrics report** (estimated):
   - FCP: −400–800ms
   - LCP: −100–200ms
   - CLS: 0 (already optimized)
4. **SEO impact projections**:
   - Core Web Vitals: +5–15 ranks
   - Meta tags: +2–8 ranks
   - Schema markup: +2–5 ranks + SERP features
   - Internal linking: +3–10 ranks (data-dependent)
   - **Total estimated impact**: +12–38 rank positions
5. **Structured data validation** report (Google Rich Results Test)
6. **Hourly status updates** in CAL-2124 comments

---

## NOT IN SCOPE (Separate Tracks)

**❌ CMO Content Expansion** — CAL-2124 Item #4
- 20–30 how-to guides, comparison pages, annual updates
- Effort: 8–10 hours
- Assigned to: CMO Agent
- Status: PARALLEL TRACK (does not block technical release)

**❌ GSC Cleanup** — CAL-260 (Board Escalation)
- Google Search Console property cleanup
- Assigned to: CEO (board decision required)
- Status: BLOCKED pending board decision
- Impact on Core Web Vitals: None

---

## Risk & Mitigation

| Risk | Mitigation | Likelihood |
|------|-----------|-----------|
| Build environment issues (Windows npm perms) | Use local build cache, worktree if needed | Medium |
| Render-blocking CSS complexity | Use Vite critical CSS tool, fallback manual extraction | Low |
| Schema validation failures | Use Google Rich Results Test, fix schemas | Low |
| Meta tag generators break pages | Add safeguards + fallbacks, test 50-page sample | Low |

---

## Timeline Summary

| Phase | Tasks | Hours | Start | End | Status |
|-------|-------|-------|-------|-----|--------|
| 1 | Core Web Vitals | 3–4 | 13:20 | 16:20 | 🔄 IN PROGRESS |
| 2 | Meta Tags + A/B | 2–3 | 16:20 | 17:20 | ⏳ READY TO START |
| 3 | Schema Markup | 1.5–2 | 17:20 | 18:20 | ⏳ READY TO START |
| 4 | Internal Linking | 2–3 | PARALLEL | TBD | ⏳ AWAITING CMO |

**Board deadline**: 19:20 ICT+7 (6 hours from 13:20)  
**Buffer time**: 1 hour  
**Go/No-Go decision**: 18:20 ICT+7

---

## Next Actions (Immediate)

1. **CTO**: Continue Phase 1.3–1.5 (images, CSS, JS bundle)
2. **CTO**: Start Phase 2 meta tag generators at 15:30
3. **CTO**: Start Phase 3 schema markup at 17:00
4. **CMO**: Start content expansion in parallel (20–30 guides needed)
5. **CEO**: Escalate CAL-260 (GSC cleanup) to board decision track
6. **All agents**: Report hourly status in CAL-2124 comments

---

## Questions for Board

1. Is **proof of code + git commits** sufficient, or do you need live deploy to production by 19:20?
2. Should internal linking recommendation engine include CMO-created content, or just existing calculators?
3. For A/B testing meta tags, should we use random 50/50 variant assignment or analytics-based bucketing?

---

**Prepared by**: CTO (51845792-9a7d-4e62-9d67-4a89c7d69e62)  
**Timestamp**: 2026-05-02 13:40 ICT+7  
**Run ID**: $PAPERCLIP_RUN_ID  
**Issue**: [CAL-2124](/CAL/issues/CAL-2124)
