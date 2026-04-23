---
name: CAL-1471 UX Designer Sprint Heartbeat complete
description: Phase 1 UX audit consolidation complete; 5 implementation subtasks created for template consistency fixes (CalculatorHeader, TransparencyPanel, FAQ dedup, TrustBadge, RelatedCalculators). Due 2026-04-27 to 2026-05-02.
type: project
---

# CAL-1471 UX Designer Sprint Heartbeat — Complete

**Status**: Done (2026-04-24)  
**Heartbeat Purpose**: Consolidate Phase 1 audit findings and create implementation roadmap  
**Result**: Complete with 5 prioritized implementation subtasks

## What Was Completed

### Phase 1 Audit Review
- **CAL-1462** (Template Consistency) audit evaluated: **FAIL** (17% pass vs 90% required)
- Critical findings documented: 99.7% of pages missing key components (CalculatorHeader, TransparencyPanel, TrustBadge)
- User impact identified: 
  - Mobile hierarchy unclear (no CalculatorHeader)
  - Trust signals missing (99% of pages lack TrustBadge)
  - Internal navigation broken (RelatedCalculators missing)
  - Mobile scroll friction increased (inline FAQ not collapsed)

### Implementation Subtasks Created

**5 prioritized tasks** (CAL-1471-1 through CAL-1471-5):

1. **Priority 1: CalculatorHeader Mandate** (due 2026-04-28)
   - Assign all 343 pages CalculatorHeader + emoji
   - Fixes 99.7% inconsistency in one action
   - Critical for mobile hierarchy

2. **Priority 2: TransparencyPanel for Opaque Formulas** (due 2026-04-29)
   - Add to 50+ Tier 3 calculators (e.g., klc0311 depreciation)
   - Restore trust in results through formula + source attribution

3. **Priority 3: FAQ Dedup + FAQAccordion** (due 2026-04-27)
   - Replace ~300 pages inline FAQ with FAQAccordion component
   - Reduces mobile scroll friction by 40-60%
   - Enables audit for duplicates (klc0452 has Q1 duplicated)

4. **Priority 4: FAQ Content Audit** (due 2026-04-27)
   - Flag and de-duplicate repeated questions across 300+ inline FAQ pages
   - Merge duplicates, document findings

5. **Priority 5: TrustBadge + RelatedCalculators** (due 2026-05-02)
   - Display TrustBadge on Tier 1/2 (70-75 high-intent pages)
   - Render RelatedCalculators links on all 343 pages
   - Mobile verification: Pixel 4a + iPhone SE

## Team Handoff

- **CTO**: Priorities 1-2, 4 (CalculatorHeader mandate, TransparencyPanel, RelatedCalculators+TrustBadge code changes)
- **Content**: Priorities 3-4 (FAQ dedup, FAQAccordion replacement planning)
- **Release QA**: Mobile verification checkpoint

## Timeline

- **2026-04-27**: FAQ audit due (Content) + FAQAccordion conversion due (CTO)
- **2026-04-28**: CalculatorHeader mandate due (CTO)
- **2026-04-29**: TransparencyPanel implementation due (CTO)
- **2026-05-02**: TrustBadge + RelatedCalculators due (CTO) + Mobile verification due (Release QA)

## Pending Phase 1 Audits

Still in progress:
- **CAL-1461** (Mobile QA) — Release QA, due 2026-04-27
- **CAL-1463** (Trust Signals) — CTO+Content, due 2026-04-29

## Next Phase

Once all 5 implementation subtasks + remaining Phase 1 audits are complete, conduct **Phase 2: Implementation Verification** to ensure:
- All 343 pages pass template consistency checks
- Mobile experience improved (header visible, FAQs collapsed, trust signals present)
- Trust metrics improved (TrustBadge visible, formula transparency present)
- No regressions in result display, input form UX, or ad placement

---

**Heartbeat Owner**: UXDesigner (4423b18a)  
**Source**: [CAL-1471](/CAL/issues/CAL-1471)
