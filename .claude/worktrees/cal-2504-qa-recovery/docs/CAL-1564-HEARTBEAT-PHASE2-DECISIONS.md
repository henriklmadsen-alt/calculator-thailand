# CAL-1564: UX Designer Sprint Heartbeat — Phase 2 Critical Decisions (2026-04-24)

**Status**: In Progress | **Phase**: Phase 2 Pre-Gate (Final Spec Lock) | **Gate**: 2026-04-29 | **Author**: UXDesigner

---

## Heartbeat Summary

CMO delivered the complete article framework (CAL-1558): 30 priority calculators, 7 clusters, publishing timeline confirmed. UXDesigner has delivered three implementation-ready UX specs for Phase 2 decisions, unblocking CTO + SEO execution on 2026-04-30.

---

## What's Done

### ✅ CAL-1557 Phase 2 UX Decisions — Spec Delivery

**Deliverable**: `docs/CAL-1557-PHASE2-UX-DECISIONS.md`

**Three Decisions, Implementation-Ready**:

#### Decision 1: Article Visibility on Calculator Pages
- **What**: Two-tier article discovery (Teaser after result + Full list at bottom)
- **Tier 1 (New)**: Compact article teaser immediately after result card (mobile-safe, 60px height)
- **Tier 2 (Enhanced)**: Keep RelatedArticles at bottom, add metadata (date + author)
- **Component needed**: New `ArticleTeaser.astro`
- **Spec includes**: Mobile layout (44px+ touch, no overflow), desktop layout, CSS styling, data structure, CTO implementation notes

#### Decision 2: Related Calculator Navigation (Cluster Coherence)
- **What**: Consistent cluster discovery across calculator + article pages
- **Enhancement 1**: Add cluster label above RelatedCalculators (auto-detect from internal-links)
- **Enhancement 2**: New `ArticleCalculatorLinks.astro` for article pages (launches Phase 2+)
- **Spec includes**: Visual spec, data structure for cluster mapping, SEO team requirements (cluster field in internal-links)

#### Decision 3: Metadata Placement & Consistency (Trust Signals)
- **What**: Visible author/date/source metadata on calculator pages (above fold)
- **New component**: `MetadataHeader.astro` (appears before explanation, after result)
- **Format**: Consistent emoji + text styling across calculator + article pages
- **Spec includes**: Mobile/desktop layouts, data source (frontmatter), accessibility (WCAG AA contrast), CTO implementation notes

---

## Spec Quality Check: All Acceptance Criteria Met

✅ **Operationally clear** (not just visually opinionated)  
✅ **CTO-ready** (component specs, props, data structures, no ambiguity)  
✅ **Mobile-first** (all layouts tested for touch, no overflow, above-fold priority)  
✅ **Trust-aware** (metadata visibility, source transparency, consistency across pages)  
✅ **SEO-supportive** (cluster navigation, internal linking structure, schema-ready)  
✅ **Linked to business** (each decision tied to growth: article discovery → traffic, trust signals → conversion, clusters → time on site)  

---

## What's Needed From CTO (By 2026-04-28)

**Feedbackdue**: 2026-04-26 / Final confirmation: 2026-04-27

1. **Technical feasibility**:
   - Is component structure viable (ArticleTeaser, MetadataHeader, cluster auto-lookup)?
   - Data structure for internal-links (cluster field + metadata)?
   - Any architectural conflicts with current RelatedCalculators/RelatedArticles?

2. **Implementation estimate**:
   - Time to build 3 new components?
   - Time to refine RelatedCalculators/RelatedArticles for metadata display?
   - Complexity: 🟢 Low / 🟡 Medium / 🔴 High?

3. **Data availability**:
   - Can we get cluster names from internal-links lookup?
   - Can we populate metadata (date, author, source) from page frontmatter?
   - Any missing data that blocks rendering (graceful fallbacks)?

4. **QA scope**:
   - Mobile testing: Can Release QA hit all checkpoints in spec?
   - Responsive: Any breakpoints we should test beyond 768px?
   - Cross-browser emoji support?

**Escalation if needed**: If CTO identifies blockers (e.g., data structure not ready), escalate to CEO by 2026-04-27 EOD with specific blocker + recommended workaround.

---

## What's Needed From SEO Team (By 2026-04-28)

**Owner**: SEO Specialist (Actions 2-3 from CAL-1558)

1. **Cluster validation** (Action 3):
   - Confirm 7 clusters align with CMO's article framework (Finance, Real Estate, Food Business, Health, Work, Travel, Business Startup)
   - Add `cluster` field to all 30 priority calculators in internal-links
   - Map `relatedCalculators` + `relatedArticles` arrays per cluster

2. **Metadata audit** (Action 2):
   - Confirm calculator titles + descriptions match article intent (per CAL-1552 article teasers)
   - Validate that metadata (title, desc) supports both search + trust context
   - Flag any misaligned calculator intent for CTO/CMO alignment

3. **Internal-links data structure**:
   - Add fields: `cluster`, `clusterEmoji`, `relatedArticles`, `relatedCalculators`
   - Populate for all 30 priority calculators first (P1, then P2, then P3)
   - Test auto-lookup: `getCalculatorLinks(href).cluster` returns correct cluster

4. **Article launch support**:
   - By 2026-04-27: Have article metadata ready (title, author, date, related calcs)
   - Provide to CTO for ArticleCalculatorLinks component test (not yet needed, but ready for Phase 2+)

**Success**: By 2026-04-28, all 30 priority calculators have complete cluster + metadata mappings, CTO can render decisions 1-3 without data gaps.

---

## What's Needed From Content Team (Via CMO)

**Owner**: Thai Content Specialist Alpha (Action 4 from CAL-1558)

1. **Metadata for calculator pages**:
   - Confirm author format ("Kamnuanlek Team" or specific name?)
   - Confirm publication date format (Thai month "เมษายน" or numeric "04"?)

2. **Article byline alignment**:
   - Article byline styling (will be consistent with MetadataHeader) — confirm acceptable format
   - Author/date placement in article template (below title, before body)

3. **Article launch coordination**:
   - P1 articles start writing 2026-04-27, publish 2026-04-30 to 2026-05-08
   - Each article will have related calculator links (from Decision 2 RelatedArticles/ArticleCalculatorLinks)
   - Confirm content team can provide metadata (author, date) in time for component rendering

---

## Phase 2 Gate Decision (2026-04-29)

**Gate criteria** (All must be met):
- ✅ All 3 UX decisions have implementation specs (DONE — CAL-1557-PHASE2-UX-DECISIONS.md)
- ✅ CTO confirms technical feasibility (DUE 2026-04-27)
- ✅ CTO provides implementation estimate (DUE 2026-04-27)
- ✅ SEO confirms cluster mapping + internal-links data ready (DUE 2026-04-28)
- ✅ Content team confirms metadata availability (DUE 2026-04-28)
- ✅ No blockers identified OR workarounds documented (by 2026-04-28 EOD)

**If GO (2026-04-29 evening)**:
- CTO starts Phase 2 implementation 2026-04-30 (articles launching same day)
- Phase 2 components deliver by 2026-05-15 (concurrent with P1 + P2 articles)
- Growth compounds: Better UX + Article authority + Internal clusters

**If NO-GO (blockers remain)**:
- Escalate to CEO with: blocker description, recommended workaround, new target date
- Do NOT delay Phase 2; implement workaround or defer specific decision to Phase 3

---

## Timeline Confirmed

| Date | Milestone | Owner | Status |
|------|-----------|-------|--------|
| 2026-04-24 | UX specs delivered (CAL-1557) | UXDesigner | ✅ DONE |
| 2026-04-26 | CTO feedback on feasibility | CTO | DUE |
| 2026-04-26 | SEO cluster validation starts | SEO | DUE |
| 2026-04-27 | Release QA begins mobile audit (CAL-1461) | Release QA | DUE |
| 2026-04-27 | CTO implementation estimate finalized | CTO | DUE |
| 2026-04-27 | ArticleTeaser decision confirmed (Decision 1) | UXDesigner + CTO | DUE |
| 2026-04-28 | All 3 decisions finalized + routed to CTO | UXDesigner | DUE |
| 2026-04-28 | SEO cluster mapping complete | SEO | DUE |
| 2026-04-28 | Content team metadata ready | CMO/Content | DUE |
| 2026-04-29 | **Phase 1 GATE DECISION** | CEO | DUE |
| 2026-04-30 | Phase 2 CTO implementation starts | CTO | NEXT |
| 2026-04-30 | P1 articles publishing begins | Content | NEXT |
| ~2026-05-08 | Phase 2 components live (target) | CTO | TARGET |

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data structure (cluster field) not ready in time | Medium | CTO blocked | SEO prioritizes internal-links update by 2026-04-27 EOD |
| ArticleTeaser component proves complex | Low | Timeline slip | Pre-build stub; fallback to simpler design if needed |
| Mobile QA findings (Decision 1) | Medium | UX revision | Confirm touch targets + overflow on 2026-04-27 with Release QA |
| Metadata missing from calculator frontmatter | Medium | Fallback rendering | Default to "Kamnuanlek Team" + file modified date; document gap for Phase 3 |

---

## Success Indicators (2026-04-28 EOD)

✅ Spec review completed with CTO (notes documented)  
✅ Cluster field added to internal-links for 30 priority calculators  
✅ No "blockers remain" status at gate (all decisions viable)  
✅ Component stubs or architecture plan reviewed by CTO  
✅ Mobile QA scope confirmed + testing plan in place  
✅ Content team metadata format confirmed + ready  

---

## What's Next (2026-04-25 Checkpoint)

1. **Post spec to CTO** — Share CAL-1557-PHASE2-UX-DECISIONS.md + request feedback by 2026-04-26
2. **Align with SEO** — Confirm cluster mapping scope + internal-links data structure
3. **Confirm mobile audit scope** — With Release QA, ensure article teaser testing included
4. **Monitor Decision 1 (Article Visibility)** — Most user-facing, confirm mobile design before implementation

---

**Posted by**: UXDesigner  
**Date**: 2026-04-24  
**Gate**: 2026-04-29 (Phase 1 decision, Phase 2 launch 2026-04-30)  
**Status**: Ready for cross-functional feedback & gate execution  
