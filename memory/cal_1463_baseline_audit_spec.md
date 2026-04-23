---
name: CAL-1463 Trust signal validation — Phase 0 baseline spec complete
description: Trust signal audit framework for 11 pages with TransparencyPanel/TrustBadge. Phase 0 baseline spec + 3 subtasks (URL validation, FAQ/ministry content, mobile QA). Ready for team execution 2026-04-27, final report 2026-04-29.
type: project
---

# CAL-1463 Trust Signal Validation — Phase 0 Baseline Spec

**Status**: Complete & Ready for Team Execution (2026-04-24)  
**Due**: 2026-04-29  
**Phase 0 Subtask Deadline**: 2026-04-27

## Problem Context

After [CAL-1462](/CAL/issues/CAL-1462) baseline audit found **99.7% of calculator pages lack trust components**, CAL-1463 validates the quality of trust signals on the **11 pages that DO have them**:

- **7 pages** with TransparencyPanel (source URLs + formulas)
- **4 pages** with TrustBadge (ministry references + update dates)
- **1,217 pages** with FAQAccordion (spot-check for FAQ quality)

## Deliverables

### ✓ Phase 0 Baseline Audit Spec
- **Document**: `/docs/CAL-1463-TRUST-SIGNAL-VALIDATION-SPEC.md`
- **Scope**: Component validation criteria + audit methodology + success gates
- **Format**: Implementation-ready with clear pass/fail criteria, CSV template, team assignments

### ✓ Three Execution Subtasks Created

1. **[CAL-1483](/CAL/issues/CAL-1483)** — CTO URL Validation
   - Validate TransparencyPanel + TrustBadge URLs (HTTP 200, domain match, freshness)
   - Deliverable: transparency-urls-audit.txt + trust-badge-audit.txt
   - Due: 2026-04-27

2. **[CAL-1484](/CAL/issues/CAL-1484)** — Content FAQ + Ministry Audit
   - FAQ spot-check (3-5 Q/A per page, 11 pages total)
   - Ministry name accuracy verification (4 pages with TrustBadge)
   - Deliverable: Spot-check results + issues CSV
   - Due: 2026-04-27

3. **[CAL-1485](/CAL/issues/CAL-1485)** — Release QA Mobile Verification
   - Mobile rendering (Pixel 4a, iPhone SE, portrait/landscape)
   - Accessibility checks (44px min tap targets, screen reader)
   - Deliverable: Screenshots + mobile QA checklist
   - Due: 2026-04-27

## Success Criteria (Phase 0)

- ✓ All 11 pages render correctly on mobile + desktop
- ✓ ≥90% of source URLs return HTTP 200
- ✓ ≥90% of TrustBadges link to correct official sources
- ✓ ≥90% of updatedDate values within 30 days
- ✓ No broken links, rendering errors, or accessibility violations

## Phase 1 (Dependent on Phase 0 Passing)

If baseline passes: Roll out CalculatorHeader + TransparencyPanel + TrustBadge to **70–75 Tier 1/2 high-intent pages** per [CAL-1462](/CAL/issues/CAL-1462) implementation plan.

- CalculatorHeader: All 343 calculator pages (due 2026-04-28)
- TransparencyPanel: 50+ opaque Tier 3 formulas (due 2026-04-29)
- TrustBadge: 70–75 Tier 1/2 pages (due 2026-05-02)
- FAQ de-dupe + quality: 1,217 pages (due 2026-04-27)

## Timeline

| Date | Milestone |
|------|-----------|
| 2026-04-24 | Phase 0 spec complete; subtasks created ✓ |
| 2026-04-27 | Subtask completion target (CTO + Content + Release QA) |
| 2026-04-29 | Final audit summary due; decision gate (pass/fail baseline) |
| 2026-04-28–2026-05-02 | Phase 1 rollout (if baseline passes) |

## Components Validated

### TransparencyPanel (7 pages)
- Props: formula, formulaNote, sourceUrl, sourceName
- Validation: Formula readability, source URL live + authority match, formula note substantiveness

### TrustBadge (4 pages)
- Props: ministry, url, updatedDate, icon
- Validation: URL live + correct domain, ministry name accuracy, updatedDate freshness (≤30 days)

### FAQAccordion (1,217 pages)
- Props: faqData (Q/A pairs), title
- Validation: No duplicates, substantive answers, Thai language quality

---

**Next Action**: Assign CAL-1483/1484/1485 to CTO, Content, and Release QA respectively. Monitoring begins 2026-04-25.

**Owner**: UXDesigner (4423b18a)  
**Source**: [CAL-1463](/CAL/issues/CAL-1463)
