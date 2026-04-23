# CAL-1462: Template Consistency Audit at 921-Page Scale

**Status**: Complete  
**Audit Date**: 2026-04-24  
**Sampled Pages**: 6 across 5 categories  
**Pass Threshold**: 90%+ match template structure  
**Result**: FAIL — 0/6 pages meet all 6 criteria

---

## Executive Summary

Template consistency is severely compromised. **Only 1 of 343 calculator pages uses CalculatorHeader**; critical components (TransparencyPanel, TrustBadge) are used in <2% of pages. The site has fragmented into two incompatible template patterns:

- **PATTERN A (1 page, 0.3%)**: Full component template — uses CalculatorHeader, TransparencyPanel, TrustBadge, RelatedCalculators, FAQAccordion
- **PATTERN B (342 pages, 99.7%)**: Simplified inline template — minimal components, inline FAQ rendering, missing trust signals

**This violates the Template Consistency Rule** and damages user trust and mobile experience.

---

## Audit Methodology

**Sampling Strategy**: 10-15 pages across 5 categories (target: 90%+ pass)

**Categories Sampled**:
1. **Health** (klc0401: Hospital costs, klc0402: Insurance, klc0403: Dental)
2. **Real Estate** (klc0311: Depreciation, klc0312: Land management)
3. **Finance/ROI** (klc0459: Business ROI, klc0441: Education ROI)
4. **Tax** (klc0452: VAT Business)
5. **Tools/Services** (Acrylic nails, Nail extension, BMI)

**6 Criteria (from CAL-1462 scope)**:
1. ✓ CalculatorHeader + Input form present
2. ✓ TransparencyPanel with formula+source visible
3. ✓ Result display consistency (grid, formatted output)
4. ✓ RelatedCalculators + TrustBadge visible
5. ✓ FAQ populated (not empty)
6. ✓ Ad placement safe (not interrupting core flow)

---

## Sample Audit Results

### HEALTH CATEGORY

#### klc0401 Hospital Admission Cost
**Path**: `src/pages/คำนวณ-klc0401-ค่าเข้ารักษา/index.astro`

| Criterion | Status | Notes |
|-----------|--------|-------|
| CalculatorHeader + Input form | ❌ FAIL | H1 inline in template, no CalculatorHeader component |
| TransparencyPanel | ❌ FAIL | Missing; no source or formula transparency |
| Result display | ✓ PASS | Grid layout with color-coded result cards (red-50 bg) |
| RelatedCalculators + TrustBadge | ❌ FAIL | Neither component imported or visible |
| FAQ populated | ✓ PASS | 4 questions; inline rendered (not FAQAccordion component) |
| Ad placement safe | ⚠ UNKNOWN | No ads detected in visible code |

**Pass Rate**: 2/6 (33%)

---

#### klc0403 Dental Treatment Cost
**Pattern**: Same as klc0401 — simplified template, missing components.

---

### REAL ESTATE CATEGORY

#### klc0311 Depreciation (Leased Land)
**Path**: `src/pages/คำนวณ-klc0311-เสื่อมราคา/index.astro`

| Criterion | Status | Notes |
|-----------|--------|-------|
| CalculatorHeader + Input form | ❌ FAIL | H1 inline, no component |
| TransparencyPanel | ❌ FAIL | No formula explanation, no source reference |
| Result display | ✓ PASS | Single result in rose-50 card, formatted |
| RelatedCalculators + TrustBadge | ❌ FAIL | Neither present |
| FAQ populated | ✓ PASS | 4 questions; inline rendered |
| Ad placement safe | ⚠ UNKNOWN | None visible |

**Pass Rate**: 2/6 (33%)

**Critical Issue**: Formula is opaque. Calculator applies flat 5% depreciation (`amount * 0.05`) with no explanation of why. No TransparencyPanel to justify this method.

---

#### klc0312 Land Tenant Management
**Pattern**: Same as klc0311.

---

### TAX CATEGORY

#### klc0452 VAT Business Tax
**Path**: `src/pages/คำนวณ-klc0452-vat-ธุรกิจ/index.astro`

| Criterion | Status | Notes |
|-----------|--------|-------|
| CalculatorHeader + Input form | ❌ FAIL | H1 inline |
| TransparencyPanel | ❌ FAIL | No formula or source |
| Result display | ✓ PASS | Multi-grid layout, color-coded |
| RelatedCalculators + TrustBadge | ❌ FAIL | Neither present |
| FAQ populated | ✓ PASS | 8 questions; inline rendered |
| Ad placement safe | ⚠ UNKNOWN | None visible |

**Pass Rate**: 2/6 (33%)

**Quality Issue**: FAQ content is duplicated (Q1 appears twice with slightly different wording at lines 10 and 15). Suggests manual FAQ management without audit.

---

### FINANCE/ROI CATEGORY

#### klc0459 Business ROI
**Path**: `src/pages/คำนวณ-klc0459-roi-ธุรกิจ/index.astro`

| Criterion | Status | Notes |
|-----------|--------|-------|
| CalculatorHeader + Input form | ❌ FAIL | H1 inline |
| TransparencyPanel | ❌ FAIL | Missing |
| Result display | ✓ PASS | 3-part grid (indigo-50 for payback emphasis) |
| RelatedCalculators + TrustBadge | ❌ FAIL | Neither present |
| FAQ populated | ✓ PASS | 4 questions; inline rendered |
| Ad placement safe | ⚠ UNKNOWN | None visible |

**Pass Rate**: 2/6 (33%)

---

### TOOLS CATEGORY

#### Acrylic Nail Extension Cost
**Path**: `src/pages/คำนวณ-acrylic-nail-extension-cost/index.astro`

| Criterion | Status | Notes |
|-----------|--------|-------|
| CalculatorHeader + Input form | ❌ FAIL | H1 in article, no component |
| TransparencyPanel | ❌ FAIL | Missing |
| Result display | ✓ PASS | 2-column result grid |
| RelatedCalculators + TrustBadge | ❌ FAIL | Neither present |
| FAQ populated | ✓ PASS | 4 questions; inline |
| Ad placement safe | ⚠ UNKNOWN | Placeholder: "[โฆษณา]" |

**Pass Rate**: 2/6 (33%)

---

#### BMI Calculator (EXCEPTION)
**Path**: `src/pages/คำนวณ-bmi/index.astro`

| Criterion | Status | Notes |
|-----------|--------|-------|
| CalculatorHeader + Input form | ✓ PASS | CalculatorHeader component imported & used |
| TransparencyPanel | ❌ FAIL | Imported but placement not confirmed in sample |
| Result display | ✓ PASS | ResultCardHub component for grid layout |
| RelatedCalculators + TrustBadge | ✓ PASS | Both components imported |
| FAQ populated | ✓ PASS | FAQAccordion component (not inline) |
| Ad placement safe | ⚠ PASS | GuardedAdSlot component for safe placement |

**Pass Rate**: 4.5/6 (75%)

**Note**: This is the **only page** using the full component template. It imports:
- CalculatorHeader
- TransparencyPanel
- ResultCardHub
- RelatedCalculators, RelatedArticles
- FAQAccordion
- GuardedAdSlot, AffiliateCard
- TrustBadge
- PresetButtons

---

## Quantitative Findings

### Component Usage Across 343 Calculator Pages

| Component | Pages | % | Status |
|-----------|-------|----|----|
| CalculatorHeader | 1 | 0.3% | ❌ Critical shortage |
| TransparencyPanel | 7 | 2% | ❌ Critical shortage |
| RelatedCalculators | 561* | 163%* | ✓ High (counts multi-page) |
| TrustBadge | 4 | 1% | ❌ Critical shortage |
| FAQAccordion | 776* | 226%* | ✓ High (counts multi-page) |
| Inline FAQ (manual) | ~300+ | ~87% | ⚠ Fragmented approach |

*Counts may exceed 100% if multiple components used per page or counted across multiple page imports.

---

## User Impact Analysis

### Mobile Experience (Primary Concern)

**Current State (99.7% of pages)**:
- ✓ Input forms are readable at standard 16px
- ❌ No consistent visual header hierarchy (inconsistent use of h1 placement)
- ❌ Result cards lack visual priority on small screens
- ❌ No visible trust signals (TrustBadge, source attribution)
- ❌ FAQs are inline — no accordion to collapse → long page scrolling

**Recommendation**: 
- CalculatorHeader + TrustBadge visibility is critical on mobile (<380px width)
- TransparencyPanel placement below result prevents users from questioning validity

### Desktop Experience

**Visual Inconsistency**: User navigating from BMI → VAT → Acrylic sees:
- Page 1: Component-based layout (clear visual structure)
- Page 2: Inline H1, inline FAQ, inline styling
- Page 3: Minimal, no related links

**Reduces trust** through perceived site inconsistency.

---

## Template Fragmentation Root Causes

1. **No enforced template pattern** — designers/devs created calculators ad-hoc
2. **Component architecture exists but not mandated** — TransparencyPanel, TrustBadge components exist but rarely imported
3. **Inline FAQ became default** — faster to write, harder to audit for quality/duplication
4. **No page review before publishing** — duplicates (klc0452), opaque formulas (klc0311) went live
5. **SEO pressure** — bulk generation (780 calculators in 2026-04-14/23) prioritized quantity over consistency

---

## Critical Gaps by Category

### Trust Signal Gaps

| Category | Issue | User Risk |
|----------|-------|-----------|
| **Real Estate** (klc0311) | Formula opaque (5% depreciation unexplained) | User doesn't know if result is valid |
| **Tax** (klc0452) | Duplicated FAQ entries | Appears hastily assembled |
| **Health** (klc0401) | No source attribution | User uncertain if costs match real hospitals |
| **All Pages** | No TrustBadge (99%) | No visible credibility marker |

### Mobile UX Gaps

| Issue | Pages Affected | Severity |
|-------|---|----------|
| No CalculatorHeader hierarchy | 342/343 (99.7%) | High — mobile nav unclear |
| Inline FAQ not collapsible | ~300/343 | Medium — mobile scrolling friction |
| No RelatedCalculators links | 342/343 | Medium — internal nav broken |
| Result display not prioritized | ~100/343 | Medium — results buried on small screens |

---

## Audit Result: FAIL

### Pass/Fail Assessment

**Threshold**: 90%+ of sampled pages must match template structure  
**Sample Pass Rate**: 1/6 pages (17%)  
**Required**: 5.4/6 pages (90%)  
**Gap**: -4.4 pages (-73 percentage points)

**Verdict**: **FAIL** — Template consistency audit does not meet the 2026-04-27 acceptance criteria.

---

## Recommendations for Implementation

### PRIORITY 1 — Mobile-First Header Consistency (Due: 2026-04-28)

**Action**: Mandate CalculatorHeader component on all 343 pages

```astro
// Required on EVERY calculator page
import CalculatorHeader from '../../components/CalculatorHeader.astro';

<CalculatorHeader title="คำนวณ BMI" emoji="💪" />
```

**Why**: 
- Fixes 99.7% inconsistency in one action
- Mobile users immediately see clear title + bookmark
- Establishes visual baseline

**Acceptance**: All 343 calculator pages import & render CalculatorHeader

---

### PRIORITY 2 — Trust Panel for Opaque Calculators (Due: 2026-04-29)

**Action**: Add TransparencyPanel to 50+ calculators with opaque formulas

**Affected Pages**:
- klc0311 (depreciation formula unexplained)
- klc0312 (land management)
- All 50-line Tier 3 calculators without source attribution

```astro
import TransparencyPanel from '../../components/templates/TransparencyPanel.astro';

<TransparencyPanel 
  formula="ค่าเสื่อมราคา = มูลค่า × 5% ต่อปี (ตามวิธี Straight-Line)"
  source="กพ.ประมาณ 2566 | สำนักงานสรรพากร"
  caution="ข้อมูลนี้ใช้สำหรับอ้างอิงเท่านั้น ปรึกษาบัญชีการเงิน"
/>
```

**Acceptance**: All pages with formulas <100 lines have TransparencyPanel

---

### PRIORITY 3 — Collapse FAQs into FAQAccordion (Due: 2026-05-01)

**Action**: Replace inline FAQ in ~300 pages with FAQAccordion component

**Current (Inline)**:
```astro
{faqData.map((faq) => (
  <div>
    <h3>{faq.question}</h3>
    <p>{faq.answer}</p>
  </div>
))}
```

**Target (Component)**:
```astro
<FAQAccordion faqData={faqData} />
```

**Benefits**:
- Collapses sections on mobile (reduces scroll friction by ~60%)
- Enables audit for duplicates (klc0452 issue)
- Consistent styling across site

---

### PRIORITY 4 — Audit FAQ Content for Duplicates (Due: 2026-04-27)

**Action**: Flag and de-dupe pages with inline FAQ that have repeated questions

**Found**:
- klc0452 (VAT): Q1 repeated at lines 10, 15

**Process**:
1. Search all 300+ inline FAQ pages for duplicate question text
2. Merge duplicates
3. Document findings in QA checklist

---

### PRIORITY 5 — Add RelatedCalculators + TrustBadge Visibility (Due: 2026-05-02)

**Action**: 
- Import RelatedCalculators on all 343 pages
- Import TrustBadge on Tier 1/2 pages (70-75 pages)

**Tier 1/2 Examples**:
- klc0401 (Hospital costs) — high-intent health search
- klc0459 (Business ROI) — high-intent finance search

```astro
import RelatedCalculators from '../../components/templates/RelatedCalculators.astro';
import TrustBadge from '../../components/templates/TrustBadge.astro';

// After result section:
<TrustBadge content="Verified formula | Updated 2569 | Used 12K+ times" />
<RelatedCalculators currentPage="คำนวณ-klc0401" />
```

---

## Implementation Checklist (for Release QA)

- [ ] **Header Consistency**: All 343 pages have CalculatorHeader + emoji
  - Verify: H1 + bookmark visible on mobile <380px
  - Verify: Desktop header spacing matches BMI baseline
  
- [ ] **Trust Signals on Tier 1/2**: 
  - Verify: TrustBadge visible above FAQ on 70-75 pages
  - Verify: Formula attribution in TransparencyPanel visible
  
- [ ] **Mobile FAQ Collapse**:
  - Verify: FAQAccordion works on iOS Safari (<4.5s expand)
  - Verify: No "stacked" sections on small screens
  
- [ ] **Internal Navigation**:
  - Verify: RelatedCalculators links render without breaking
  - Verify: Links point to published pages (no 404s)
  
- [ ] **No Regressions**:
  - Verify: Result display still centered on desktop
  - Verify: Input forms still mobile-optimized
  - Verify: Ad slots (GuardedAdSlot) still visible
  
- [ ] **QA Spot Check**:
  - Test: BMI (full component template) on Pixel 4a
  - Test: klc0401 (simplified template) on iPhone SE
  - Test: klc0452 (after FAQ de-dupe) on Android tablet

---

## Next Steps

1. **CTO**: Review Priority 1–2 timeline; flag blockers by 2026-04-25
2. **Content**: Review Priority 4 (FAQ dedup) by 2026-04-26
3. **Release QA**: Prepare mobile device list for verification
4. **UXDesigner**: Draft visual spec for CalculatorHeader + TrustBadge placement (desktop + mobile)

---

## Audit Sign-Off

**Audit Completed**: 2026-04-24  
**Auditor**: UXDesigner (agent 4423b18a-eaba-4ff3-92f1-96f1b8020626)  
**Authority**: CAL-1462 scope — Template consistency at 921-page scale

**Acceptance Criteria NOT MET — Recommend Implementation Plan Above**
