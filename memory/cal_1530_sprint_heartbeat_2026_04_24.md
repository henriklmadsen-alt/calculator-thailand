---
name: CAL-1530 Sprint Heartbeat 2026-04-24
description: Phase 1 audits on final track for 2026-04-29 gate; Phase 2 scope locked with 5 work streams ready; no blockers; mobile UX risk high (99.7% lack components); mitigation timeline clear through 2026-05-02.
type: project
---

# CAL-1530 UX Designer Sprint Heartbeat (2026-04-24)

**Status**: On Track  
**Phase 1 Gate Decision**: 2026-04-29 (5 days away)  
**Phase 2 Launch**: 2026-04-30 (pending approval)  

## Phase 1 Audit Completion Status

### CAL-1462: Template Consistency ✅ COMPLETE
- **Finding**: 99.7% of 343 pages lack core components (CalculatorHeader, TransparencyPanel, TrustBadge)
- **Impact**: Mobile users see inconsistent hierarchy, no trust signals, confusing navigation
- **Deliverable**: 5-priority implementation plan (CTO + Content + Release QA) ready for Phase 2

### CAL-1463: Trust Signal Validation ✅ SPEC COMPLETE
- **CAL-1508 Blocker**: RESOLVED (moph.go.th 403 fixed)
- **CAL-1483** (URL Validation): NOW UNBLOCKED, on track for 2026-04-27
- **CAL-1484** (FAQ/Ministry Audit): ✅ COMPLETE
- **CAL-1485** (Mobile QA): ✅ COMPLETE
- **Final Report**: Due 2026-04-29

### CAL-1461: Mobile UX Verification 🔄 IN PROGRESS
- **Status**: Final verification stage (no blockers)
- **Due**: 2026-04-27

## Phase 2 UX Scope: Locked

**5 Work Streams Ready**:
1. **WS1** (CalculatorHeader): Due 2026-04-28, no dependencies, can start now
2. **WS4** (FAQ Audit + Dedup): Due 2026-04-27, no dependencies, can start now
3. **WS3** (FAQAccordion): Due 2026-05-01, depends on WS4
4. **WS2** (Trust Panel): Due 2026-04-29, depends on CAL-1463 complete
5. **WS5** (TrustBadge + RelatedCalcs): Due 2026-05-02, depends on CAL-1463 complete

## Mobile UX Risk Assessment

**High Risk** (99.7% of site):
- No CalculatorHeader → users disoriented between pages
- Inline FAQs → 40-60% more scrolling on mobile
- No TrustBadge → results appear unverified

**Mitigation Path**:
- WS1 CalculatorHeader (2026-04-28) → fixes orientation
- WS3 FAQAccordion (2026-05-01) → reduces scroll friction
- WS5 TrustBadge (2026-05-02) → adds credibility signals

## UX Designer Actions (Through Gate)

- Monitor CAL-1483/1484/1485 completion (track 2026-04-27)
- Flag scope creep or quality concerns
- Prepare Phase 2 implementation acceptance criteria

---

**Posted to CAL-1530** — 2026-04-24  
Input: CAL-1462, CAL-1463, CAL-1461  
Gate Decision: 2026-04-29
