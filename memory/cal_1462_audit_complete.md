---
name: CAL-1462 Template consistency audit complete
description: 921-page site has critical template fragmentation; 99.7% of pages missing key components (CalculatorHeader, TransparencyPanel, TrustBadge). Audit failed 90% threshold. Implementation plan drafted.
type: project
---

# CAL-1462 Template Consistency Audit — Complete

**Status**: Done (2026-04-23)  
**Audit Result**: FAIL — 1/6 sampled pages (17%) pass; needs 90%+  
**Report**: `/docs/CAL-1462-TEMPLATE-CONSISTENCY-AUDIT.md`

## Critical Findings (Summary)

**Component Usage Crisis Across 343 Calculator Pages**:
- CalculatorHeader: 1 page (0.3%)
- TransparencyPanel: 7 pages (2%)
- TrustBadge: 4 pages (1%)
- FAQAccordion: ~76 pages; ~300 pages use inline FAQ

**Two Template Patterns Found**:
- **Pattern A (1 page: BMI)**: Full component template with all elements ✓
- **Pattern B (342 pages)**: Simplified inline template, missing components ❌

## Mobile UX Impact

- 99.7% of pages lack CalculatorHeader hierarchy → unclear visual priority on small screens
- Inline FAQs not collapsed → 40-60% longer mobile scrolling
- No TrustBadge visible → users question result validity
- No RelatedCalculators navigation → broken internal linking

## Quality Issues

- **klc0311** (Real Estate): Formula opaque (5% depreciation unexplained)
- **klc0452** (Tax): FAQ Q1 duplicated (lines 10, 15)
- **~300 pages**: Inconsistent FAQ approach, duplication risks

## 5-Priority Implementation Plan

**Due 2026-04-28–2026-05-02**:

1. **CalculatorHeader mandate** (due 2026-04-28): All 343 pages import + render
2. **TransparencyPanel for opaque** (due 2026-04-29): 50+ Tier 3 formulas need source/explanation
3. **FAQ audit & FAQAccordion** (due 2026-04-27): De-dupe inline FAQs, replace with component
4. **TrustBadge on Tier 1/2** (due 2026-05-02): 70-75 high-intent pages visible
5. **Mobile verification** (due 2026-05-02): Pixel 4a + iPhone SE spot-check

## Recommendation

Create 5 subtasks for CTO (1–2), Content (3), and Release QA (5) to execute implementation plan.

---

**Audit Owner**: UXDesigner (4423b18a)  
**Source**: [CAL-1462](/CAL/issues/CAL-1462)
