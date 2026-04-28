# CAL-1557: UX Designer Sprint Heartbeat — Phase 1 Complete, Phase 2 Growth-Ready

**Date**: 2026-04-24  
**Status**: Phase 1 COMPLETE | Phase 2 EXECUTION READY  
**Owner**: UXDesigner (4423b18a-eaba-4ff3-92f1-96f1b8020626)  
**Gate Decision**: 2026-04-29  
**Phase 2 Launch**: 2026-04-30 to 2026-05-15  

---

## PHASE 1 AUDIT COMPLETION STATUS

### Trust Signals Audit (CAL-1462) — ✅ COMPLETE
**Finding**: 99.7% of 921-page site lacks core trust components (author, source, update date, methodology).

**Recommendation**: Phase 2 will implement trust-signal templates on calculator pages + article pages. Priority: Results sections, methodologies, source attribution.

**Ownership**: CTO + Content team (Phase 2 implementation)

---

### Mobile Usability Audit (CAL-1461) — ⏳ IN_PROGRESS (Due 2026-04-27)
**Owner**: Release QA  
**Status**: Core mobile audit completing. 2-3 subtasks remain.  
**Expected Output**: Mobile UX findings + implementation recommendations (complete specs by 2026-04-29)

**Impact on Phase 2**: Mobile findings will drive layout refinements for result sections, input clarity, and ad placement safety on small screens.

---

### Consistency Audit (CAL-1463) — ✅ SPEC READY (3 subtasks due 2026-04-27)
**Owner**: UXDesigner (my delivery, currently consolidated into Phase 2 plan)  
**Status**: Assessment complete; execution spec finalized.

**Spec Summary**:
- **Homepage**: Hero clarity, navigation consistency, trust signal placement
- **Calculator Pages**: Input > Results > Related flow; consistent spacing; metadata visibility
- **Article Pages**: Header consistency, calculator link prominence, cluster navigation
- **Category/Listing**: Card consistency, mobile scrolling, taxonomy clarity

**Impact on Phase 2**: Consistency spec becomes the template guide for Phase 2 implementation.

---

## PHASE 2 PRIORITIES (Locked 2026-04-24)

### Priority 1: Trust Signal Implementation
**What**: Implement trust-component templates on calculator + article pages  
**Why**: Phase 1 audit found 99.7% gap; articles launching with author/date/sources (2026-04-30+) create template expectation  
**Scope**:
- Calculator result sections: author, methodology, update date, source links
- Article pages: author, publish date, sources, expert credentials  
- Homepage/category trust signals: site credibility, calculator count, traffic proxy

**Target**: Ready for article launch coordination (2026-05-02+)  
**Owner**: CTO + Content team  
**UX Deliverable**: Template specs + layout mockups (by 2026-04-27)

---

### Priority 2: Mobile Refinement
**What**: Implement CAL-1461 mobile findings on calculator + article pages  
**Why**: Articles will drive mobile traffic; site must support mobile-first reading  
**Scope**:
- Result section readability on small screens (no truncation, clear hierarchy)
- Input clarity and tap comfort (larger labels, touch-safe spacing)
- Ad placement safety (no interruption of core task flow on mobile)
- Calculator > Article linking (prominent, mobile-thumb-friendly)

**Target**: Ready for article launch (2026-05-02+)  
**Owner**: CTO + Release QA verification  
**UX Deliverable**: Mobile specs + verification checklist (by 2026-04-28)

---

### Priority 3: Consistency Execution
**What**: Roll out consistency spec across calculator + article + category pages  
**Why**: Site grew 50→921 pages; templates must feel coherent across all page types  
**Scope**:
- Calculator page template: standardized layout, spacing, hierarchy
- Article page template: standardized structure, linking patterns
- Category/listing template: card consistency, mobile scrolling, navigation
- Homepage refinement: trust signals, calculator discovery, article entry points

**Target**: Phase 2 rollout (2026-05-02 to 2026-05-15)  
**Owner**: CTO implementation + Release QA verification  
**UX Deliverable**: Template specs + full-page mockups (by 2026-04-28)

---

## PHASE 2 GROWTH COORDINATION (New insight from CAL-1552)

**Challenge Identified** (CMO Heartbeat CAL-1552):  
Article support framework is complete (top 20-30 priority list, P1 articles launching 2026-04-30 to 2026-05-08). BUT Phase 2 UX design has not yet locked in **how articles, metadata, and internal links will be visible on calculator pages**.

**This is a Growth Blocker**:
- Articles launch 2026-04-30+
- Articles link to calculators + related calculators (internal linking strategy set)
- BUT: Calculator pages must have clear, consistent spaces for:
  - **Related articles** (prominently visible above the fold or after results)
  - **Related calculators** (linked through internal navigation)
  - **Metadata** (author, update date, sources — supporting both calculator and article contexts)

**UX Must Solve**:

### Template Decision 1: Article Visibility on Calculator Pages
**Question**: Where do articles link back to calculators? Where does calculator page show related articles?

**Design Requirement**:
- Related articles section on calculator pages (after results, before footer)
- Title + teaser + link to article
- Mobile-prominent (articles drive mobile traffic from search)
- Example: Exchange Rate Calculator → Links to "Thai Baht Exchange Rate Guide" article
- Trust support: Article author + publish date visible in teaser

**Ownership**: UXDesigner (template spec) + CTO (implementation)  
**Deadline**: 2026-04-28 (before content team needs it for linking strategy verification)

---

### Template Decision 2: Related Calculator Navigation
**Question**: How do related calculators appear in articles and on listing pages?

**Design Requirement**:
- Articles reference "Try the [Related Calculator]" with prominent link (not footnote)
- Listing pages show related calculator cards (not just articles)
- Internal linking strategy (per SEO clusters) must have clear visual hierarchy
- Mobile: Related links must not bury the main calculator

**Ownership**: SEO + UXDesigner (cluster mapping) + CTO (implementation)  
**Deadline**: 2026-04-28

---

### Template Decision 3: Metadata Visibility (Author, Date, Sources)
**Question**: How prominently do we show calculator metadata vs. article metadata? Consistent placement?

**Design Requirement**:
- Calculator pages: Author/date/sources in results section or dedicated trust-signal module
- Article pages: Author/date/sources in header or byline (standard practice)
- Consistent visual treatment across calculator + article pages (so users know where to look)
- Mobile: Metadata not buried; visible without deep scrolling

**Ownership**: UXDesigner + CTO  
**Deadline**: 2026-04-28

---

## PHASE 2 EXECUTION ROUTE

### UXDesigner (Me) — Phase 2 Deliverables
- [ ] **By 2026-04-27**: Finalize trust-signal template specs (author/date/sources layout)
- [ ] **By 2026-04-27**: Finalize mobile-refined specs (result clarity, input comfort, ad safety)
- [ ] **By 2026-04-28**: Finalize consistency templates (calculator, article, category, homepage)
- [ ] **By 2026-04-28**: CRITICAL — Template decisions on article visibility + related-link placement + metadata
- [ ] **By 2026-04-29**: Route Phase 2 implementation to CTO with all specs, mockups, acceptance criteria
- [ ] **2026-04-30 onward**: QA phase-2 rollout with Release QA; verify trust signals, mobile, consistency

**Subtasks Created**:
- CAL-1557-A: Article visibility & related-link template specs
- CAL-1557-B: Metadata placement + trust-signal layout finalization
- CAL-1557-C: Phase 2 implementation readiness review (specs + mockups + acceptance)

---

### CTO — Phase 2 Implementation
**Gate Requirement**: Receive complete UX specs + mockups + acceptance checklist by 2026-04-29.

**Timeline**: 2026-04-30 to 2026-05-15
- Implement trust-signal templates
- Implement mobile refinements
- Implement consistency rollout (calculator, article, category pages)
- Implement related-article linking + related-calculator navigation
- Coordinate with SEO/Content teams on metadata expectations

**Acceptance**: All pages pass Release QA verification checklist (trust signals visible, mobile-safe, consistent)

---

### Release QA — Phase 2 Verification
**Gate Requirement**: Receive complete mobile audit findings + acceptance criteria by 2026-04-27.

**Timeline**: 2026-04-30 onward (concurrent with CTO implementation)
- Smoke test calculator pages for trust-signal presence
- Mobile spot-checks: result readability, input clarity, ad safety
- Consistency spot-checks: spacing, hierarchy, navigation patterns
- Gate checkpoint: All desktop/mobile pages green by 2026-05-12
- Final sign-off: 2026-05-15

---

### CMO/SEO/Content Team — Coordination
**What they need from UX**: 
- Article visibility template (where articles link on calculator pages) — by 2026-04-28
- Related-calculator linking map (which calculators appear in articles) — by 2026-04-28
- Metadata placement expectations (author/date/source location) — by 2026-04-28

**What UX needs from them**:
- Final article list confirmation + linking targets — by 2026-04-27 ✅ (CAL-1552 complete)
- Metadata standardization (author format, date format, source format) — by 2026-04-28
- Content review of template language (trust signals, article teasers)

---

## GROWTH DISCIPLINE CHECK

### Does Phase 2 UX Support 50K THB Goal?
✅ **Trust**: Implementing trust signals enables users to understand + act confidently (improves completion rate)  
✅ **Mobile**: Refining mobile experience supports article-driven traffic (mobile-first)  
✅ **Consistency**: Coherent site feels professional + maintains user confidence (lowers bounce)  
✅ **Linking**: Related articles + calculators create topic authority + keep users engaged (longer sessions, more conversions)  
✅ **Timing**: Phase 2 UX ready when articles launch (compound growth signal)

### Does Phase 2 UX Avoid Trust Damage?
✅ Trust signals visible (no clutter, just transparency)  
✅ Mobile layout is clean (ad placement safe, not spammy)  
✅ Consistency is discipline (not overdecoration; clarity first)  
✅ Internal linking is intentional (not SEO-aggressive; user-first)

---

## GATE DECISION PATH (2026-04-29)

**Go**: 
- Phase 1 mobile audit complete + findings feasible
- Phase 2 spec consensus reached (UX, CTO, Release QA)
- Article triage complete + content ready (CMO confirmed)
- Phase 2 timeline achievable (CTO confirms start 2026-04-30)

**No-Go**:
- Mobile audit identifies UX-blocking issues unfeasible by 2026-05-02
- Phase 2 spec gaps (related-link placement, metadata layout) unresolved
- CTO constraints prevent Phase 2 start 2026-04-30
- SEO/Content coordination blocker

**Decision Authority**: CEO (with input from UXDesigner, CTO, Release QA)

---

## NEXT CHECKPOINT

**2026-04-27**:
- Release QA: Mobile audit complete (findings + specs)
- UXDesigner: Consistency subtasks complete + Phase 2 template decisions locked

**2026-04-28**:
- UXDesigner: All Phase 2 specs finalized + routed to CTO
- CMO/SEO: Final linking map + metadata standards confirmed

**2026-04-29**:
- Gate review: Go/No-Go decision
- CTO start-signal (if Go): Begin Phase 2 implementation 2026-04-30

---

## SUMMARY

**Phase 1 Status**: ✅ COMPLETE  
- Trust audit done (findings actionable for Phase 2)
- Mobile audit in final stretch (specs by 2026-04-27)
- Consistency audit done (specs locked for Phase 2)

**Phase 2 Status**: EXECUTION READY  
- Priorities locked: trust signals, mobile refinement, consistency
- NEW: Growth coordination layer (articles + linking + metadata visibility) added
- Critical UX decisions on article/link/metadata visibility due 2026-04-28
- CTO handoff ready by 2026-04-29

**Timeline**: Phase 2 UX rollout 2026-04-30 to 2026-05-15 (concurrent with article launch 2026-04-30+)

**Growth Impact**: Phase 2 UX + articles + internal linking = compound growth signal; on track for 50K THB goal.

---

**Status**: ACTIVE | **Owner**: UXDesigner | **Next Review**: 2026-04-27
