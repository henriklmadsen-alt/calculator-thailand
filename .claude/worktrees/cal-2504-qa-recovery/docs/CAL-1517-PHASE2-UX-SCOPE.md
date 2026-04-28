# CAL-1517: Phase 2 UX Scope — Trust Signals + Template Consistency Rollout

**Status**: Ready for Phase 1 Gate Approval (2026-04-29)  
**Target**: Phase 2 Execution Start (2026-04-30 pending approval)  
**Primary Owner**: UXDesigner  
**Supporting Teams**: CTO, Content, Release QA  

---

## Phase 2 Mandate

Consolidate Phase 1 audit findings (CAL-1462, CAL-1463, CAL-1461) into a mobile-first, trust-focused implementation that:

1. **Fixes template fragmentation** — mandate CalculatorHeader, TransparencyPanel, TrustBadge across all 70-75 Tier 1/2 pages
2. **Improves trust perception** — add source attribution, formula transparency, credibility signals on high-intent calculators
3. **Reduces mobile friction** — collapse FAQs, prioritize results, consistent header hierarchy
4. **Maintains ad safety** — ensure GuardedAdSlot components prevent ad-calculator content conflicts
5. **Supports organic search** — structured content (TrustBadge, TransparencyPanel) aids indexing and ranking

---

## Phase 1 Audit Summary (Input)

### CAL-1462: Template Consistency Audit
- **Finding**: 99.7% of 343 pages lack core UX components (CalculatorHeader, TransparencyPanel, TrustBadge)
- **Pass Rate**: 1/6 sampled pages (17%) vs. 90% threshold
- **Root Cause**: Bulk generation without component enforcement, no template review
- **Deliverable**: 5-priority implementation plan with acceptance criteria

### CAL-1463: Trust Signal Validation (In Final Subtask)
- **CAL-1484 Content**: ✅ Done — FAQ + ministry names verified
- **CAL-1485 Mobile QA**: ✅ Done — trust components render safely on mobile
- **CAL-1483 URL Validation**: NOW UNBLOCKED (CAL-1508 fixed) — all 5 TrustBadge links accessible
  - rd.go.th, bot.or.th, sso.go.th, moph.go.th, who.int ✅

### CAL-1461: Mobile UX Verification (In Progress)
- **Owner**: Release QA Engineer Alpha
- **Due**: 2026-04-27 (3 days)
- **Scope**: Mobile usability spot-check at 921-page scale

---

## Phase 2 UX Work Streams

### Work Stream 1: Mobile-First Header Consistency

**Business Reason**: 99.7% of pages lack consistent title hierarchy. Mobile users (primary traffic) see inconsistent page structure → reduced trust.

**User Problem**: 
- H1 placement varies across pages (inline vs. header component)
- No consistent visual hierarchy on mobile
- Header acts as page orientation cue — missing on most pages
- Users confused by "am I on the same site?" when navigating calculator-to-calculator

**UX Recommendation**:

Mandate **CalculatorHeader component** on all 343 calculator pages.

**Implementation**:
```astro
// On EVERY calculator page:
import CalculatorHeader from '../../components/CalculatorHeader.astro';

<CalculatorHeader 
  title="คำนวณ BMI"         // Page title in Thai
  emoji="💪"               // Visual identifier (helps mobile scannability)
/>
```

**Mobile Considerations**:
- Header height: max 80px on mobile (leaves 50% viewport for calculator input on iPhone SE)
- Font size: 18px for page title (readable at arm's length)
- Emoji position: right-aligned (asymmetric visual anchor for mobile users)
- White-space: 12px bottom margin (separates header from input form)

**Desktop Considerations**:
- Header acts as breadcrumb anchor for long-scroll pages
- H1 semantic clarity for SEO
- Consistent margin/padding baseline

**Acceptance Criteria**:
- ✅ All 343 pages import CalculatorHeader
- ✅ H1 text + emoji visible on iPhone SE (375px) without horizontal scroll
- ✅ Zero style regressions on existing input/result layouts
- ✅ Release QA smoke test passes 5-page random sample

**Estimated Effort**: CTO — 2–4 hours (bulk find-replace + mobile QA)

---

### Work Stream 2: Trust Panel for Opaque Formulas

**Business Reason**: 50+ calculators have unexplained formulas (e.g., "value × 5% per year" with no legal/source justification). Users don't trust unknown math.

**User Problem**:
- klc0311 (Depreciation) applies flat 5% with no explanation of why
- klc0452 (VAT) duplicated FAQ entries → looks hastily assembled
- No visible source attribution on tax/finance calculators
- Users lack confidence in results

**UX Recommendation**:

Add **TransparencyPanel component** below result section on pages where:
- Formula is < 5 inputs (simple) but unexplained
- Tax/finance/legal implications (need source citation)
- User questions validity (opaque domain)

**Scope**: 50-75 Tier 1/2 high-intent calculators (health, tax, finance, real estate).

**Implementation Example** (klc0311 Depreciation):
```astro
import TransparencyPanel from '../../components/templates/TransparencyPanel.astro';

<TransparencyPanel 
  formula="ค่าเสื่อมราคา = มูลค่า × 5% ต่อปี (Straight-Line Method)"
  source="กพ.ประมาณ 2566 | สำนักงานสรรพากร"
  caution="ข้อมูลนี้ใช้สำหรับอ้างอิงเท่านั้น ปรึกษาบัญชีการเงิน"
/>
```

**Mobile Considerations**:
- Panel width: full width on mobile (no side margins)
- Font size: 14px for caution text (readable, not overwhelming)
- Panel position: immediately after result (builds trust while result is "fresh" in mind)
- Contrast: caution text must meet WCAG AA (4.5:1)

**Desktop Considerations**:
- Collapsible panel option (users can expand for full source)
- Sidebar placement option if page layout supports it
- Color-coded sections (formula, source, caution)

**Acceptance Criteria**:
- ✅ All 50-75 opaque Tier 1/2 pages have TransparencyPanel
- ✅ Caution text meets WCAG AA contrast (4.5:1)
- ✅ Panel responsive on 320px–1920px viewports
- ✅ Source links are live (404 check performed)

**Estimated Effort**: 
- Content team: 8–12 hours (write/verify sources for 50 pages)
- CTO: 4–6 hours (add components + test)

---

### Work Stream 3: Collapse FAQs into FAQAccordion

**Business Reason**: ~300 pages have inline FAQs. On mobile, users scroll 15–30 sections to see related calculators. Friction → bounces.

**User Problem**:
- 10-question FAQs on mobile = 8-12 screen scrolls to reach RelatedCalculators
- No indication sections are collapsible (users don't know to skip)
- Inline FAQ duplicates (klc0452) are undetectable without manual review
- Page feels "long and sprawling" on small screens

**UX Recommendation**:

Replace inline FAQ rendering in ~300 pages with **FAQAccordion component**.

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
import FAQAccordion from '../../components/templates/FAQAccordion.astro';

<FAQAccordion faqData={faqData} />
```

**Mobile Considerations**:
- Default: first 3 sections expanded; rest collapsed
- Tap target: 48px button height (WCAG touch target minimum)
- Animation: 200ms expand/collapse (snappy, not distracting)
- Font size: 16px question text (readable, tappable)

**Desktop Considerations**:
- All sections collapsible (user choice)
- Keyboard navigation support (arrow keys, Enter)
- Visual indicator (chevron + color change on expand)

**Acceptance Criteria**:
- ✅ All ~300 inline FAQs converted to FAQAccordion
- ✅ Mobile test: expand/collapse works <300ms on 4G
- ✅ Duplicate detection: klc0452-type duplicates identifiable in code review
- ✅ Accessibility: keyboard navigation + focus ring visible

**Estimated Effort**: CTO — 4–6 hours (bulk component swap + QA)

---

### Work Stream 4: FAQ Content Audit + De-Duplication

**Business Reason**: klc0452 has duplicate questions. Undetected duplicates damage trust + waste vertical space.

**User Problem**:
- Q1 repeated at lines 10, 15 (different wording but same intent)
- Looks like editing mistakes → "site is not maintained"
- Wastes mobile scrolling space

**UX Recommendation**:

Perform FAQ content audit before FAQAccordion rollout. Flag and merge duplicates.

**Process**:
1. **Search all 300+ inline FAQ pages** for duplicate question text (fuzzy match, case-insensitive)
2. **Review matches** — determine if intentional variation or true duplicate
3. **De-dupe** — merge into single Q/A pair, keep highest-quality answer
4. **Document** — QA checklist records findings

**Example** (klc0452):
- Q1 at line 10: "ธุรกิจของฉันต้องเสียภาษี VAT หรือไม่"
- Q1 at line 15: "บริษัทของฉันต้องเสียภาษี VAT หรือไม่"
- **Decision**: Keep line 10, delete line 15 (same answer, first occurrence)

**Acceptance Criteria**:
- ✅ All 300+ pages scanned for duplicate questions
- ✅ Findings documented in QA checklist (page + line numbers)
- ✅ De-dupe decisions reviewed by Content team
- ✅ Zero duplicates remain post-rollout

**Estimated Effort**: Content team — 6–8 hours (review + merge)

---

### Work Stream 5: TrustBadge + RelatedCalculators Visibility

**Business Reason**: 99% of pages lack TrustBadge. No visible credibility signals. Users don't know if results are trustworthy.

**User Problem**:
- No "when was this last updated?" → seems stale
- No "how many times used?" → seems untested
- No "government source?" → seems made-up
- No internal links to related tools → users can't explore related needs

**UX Recommendation**:

Add **TrustBadge + RelatedCalculators** to all 70-75 Tier 1/2 pages.

**TrustBadge Component**:
```astro
import TrustBadge from '../../components/templates/TrustBadge.astro';

<TrustBadge 
  content="Verified formula | Updated 2569 | Used 12K+ times"
  sources={['moph.go.th', 'bot.or.th', 'rd.go.th', 'sso.go.th', 'who.int']}
/>
```

**RelatedCalculators Component**:
```astro
import RelatedCalculators from '../../components/templates/RelatedCalculators.astro';

<RelatedCalculators currentPage="คำนวณ-klc0401" />
```

**Mobile Considerations**:
- TrustBadge placed immediately above FAQ (right after result)
- Badge height: 40px (compact, doesn't feel intrusive)
- Badge background: light gray (visual separation from result)
- Links to sources should work without new tab (preserve scroll context)

**Desktop Considerations**:
- TrustBadge can float right of FAQ (sidebar treatment)
- RelatedCalculators as grid (3 columns on desktop, 1 on mobile)
- "Verified by government" icon next to source links

**Scope**: 70-75 Tier 1/2 high-intent pages:
- **Health**: klc0401 (Hospital costs), klc0403 (Dental), etc.
- **Finance**: klc0459 (ROI), klc0441 (Education ROI)
- **Tax**: klc0452 (VAT), etc.
- **Real Estate**: klc0311 (Depreciation), klc0312 (Land Management)

**Acceptance Criteria**:
- ✅ All 70-75 Tier 1/2 pages have TrustBadge component
- ✅ RelatedCalculators links point to published pages (404 check)
- ✅ TrustBadge sources are live (all 5 links accessible)
- ✅ Mobile rendering: no overlap with ads on 320px–375px viewports
- ✅ Desktop rendering: TrustBadge/RelatedCalculators don't crowd result section

**Estimated Effort**: 
- Content team: 4–6 hours (verify source links, populate badge data)
- CTO: 2–4 hours (add components, test links)

---

## Phase 2 Implementation Timeline

| Task | Owner | Due | Dependencies |
|------|-------|-----|--------------|
| Mobile Header Consistency (WS1) | CTO | 2026-04-28 | None |
| FAQ Content Audit (WS4) | Content | 2026-04-27 | CAL-1463 completion |
| FAQ Accordion Rollout (WS3) | CTO | 2026-05-01 | WS4 complete |
| Trust Panel Rollout (WS2) | CTO+Content | 2026-04-29 | CAL-1463 completion |
| TrustBadge + RelatedCalcs (WS5) | CTO+Content | 2026-05-02 | CAL-1463 completion |

**Critical Path**: CAL-1463 completion (2026-04-29) → enables WS2, WS5 to start

---

## Acceptance Criteria (Phase 2 Gate)

**Mobile UX**:
- ✅ CalculatorHeader visible on iPhone SE without horizontal scroll
- ✅ FAQAccordion collapses by default (reduces scroll friction)
- ✅ TrustBadge visible above FAQ on Tier 1/2 pages
- ✅ Result cards remain centered, legible on 320px–375px

**Trust & Clarity**:
- ✅ TransparencyPanel present on all opaque Tier 1/2 calculators
- ✅ Source links live and working
- ✅ Caution text meets WCAG AA contrast
- ✅ FAQ duplicates removed (content audit)

**Template Consistency**:
- ✅ All 343 calculator pages have CalculatorHeader
- ✅ 70-75 Tier 1/2 pages have TrustBadge + RelatedCalculators
- ✅ ~300 pages migrated to FAQAccordion component
- ✅ Zero style regressions on input/result layouts

**Ad Safety**:
- ✅ GuardedAdSlot components prevent ad overlap with trust signals
- ✅ Ad placement audit: no ads interrupt calculator flow

**Release QA Verification**:
- ✅ Mobile smoke test: 5-page random sample on iOS + Android
- ✅ Desktop check: 3-page sample across desktop browsers
- ✅ Link health: TrustBadge sources 404-checked
- ✅ Performance: page load <3.5s on 4G

---

## Post-Phase 2: Future Work (Backlog)

1. **CalculatorHeader emoji library** — standardize emoji choices by category (health→💚, tax→💰, etc.)
2. **Mobile footer redesign** — ensure RelatedCalculators not buried below fold
3. **Analytics integration** — track TrustBadge click-through rates + FAQ expand rates
4. **Content freshness automation** — auto-update "last updated" in TrustBadge monthly
5. **A/B test** — compare TrustBadge placement (above FAQ vs. below result) on bounce rate

---

## Deliverables (Phase 2)

1. **Phase 2 Implementation Checklist** (Release QA + CTO)
2. **Mobile UX Acceptance Criteria** (mobile test results by viewport)
3. **Trust Component Rollout Log** (70-75 pages verified live)
4. **FAQ Consolidation Report** (duplicates found + resolved)
5. **Post-Rollout Analytics** (page load, mobile usability, bounce rate impact)

---

## Next Action

**Pending Phase 1 Gate Approval (2026-04-29)**:
- CEO review: Phase 1 audit findings + Phase 2 scope
- If approved: Assign Phase 2 work streams to CTO + Content
- If changes requested: Revise scope and resubmit

---

*Prepared by UXDesigner (CAL-1517)*  
*Input: CAL-1462 (Template Audit), CAL-1463 (Trust Validation), CAL-1461 (Mobile UX in progress)*  
*Gate Decision Target: 2026-04-29*
