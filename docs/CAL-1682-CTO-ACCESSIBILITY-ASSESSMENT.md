# CAL-1682: Phase 2 Component Accessibility Assessment
**CTO Accessibility Review — WCAG 2.1 AA Tap Target Compliance**

**Completed**: 2026-04-24  
**CTO**: Henrik Madsen (51845792-9a7d-4e62-9d67-4a89c7d69e62)  
**Due**: 2026-04-26 EOD  
**Gate Impact**: Critical blocker for Phase 2 gate decision (2026-04-29)

---

## EXECUTIVE SUMMARY

Phase 2 introduces **5 new/modified UI components** on calculator and article pages. Assessment reveals **2 WCAG AA tap target (44×44px) compliance risks** and **3 specification gaps**.

**Recommendation**: **FIX IN PHASE 2** — All issues are implementable before 2026-04-30 launch. Implementation effort: ~6-8 hours.

---

## ASSESSMENT METHODOLOGY

**Scope**: Five Phase 2 components across calculator + article pages  
**Standard**: WCAG 2.1 AA Level (44×44px minimum tap targets for all interactive elements)  
**Test Basis**: Phase 2 UX Decisions spec (CAL-1557) + detailed component notes  
**Mobile Viewport**: 375px (primary mobile breakpoint)

---

## COMPONENT-BY-COMPONENT FINDINGS

### 1. ArticleTeaser Component ✅ COMPLIANT

**Location**: New component, calculator pages, after result card  
**Spec Reference**: CAL-1557 Decision 1, lines 58-62  

**Specification Details**:
- Heading: Article title (14px, blue, bold)
- Subtext: 1-line teaser (gray, 14px)
- CTA: "Read More" link (primary color, arrow)
- **Tap target height**: 44px minimum (entire row is tappable)
- Padding: 12px left/right, 10px top/bottom
- Font sizes: 14px (title), 13px (teaser), 13px (link)

**WCAG Analysis**:
- ✅ **Tap target**: 44px minimum height is explicitly specified
- ✅ **Interactive area**: Entire row is clickable (not just link text)
- ✅ **Padding**: 10px top/bottom + content height ≥ 24px = 44px+
- ✅ **Touch-friendly**: Thumb-comfortable on mobile at 375px width

**Status**: ✅ **COMPLIANT** — No changes needed

---

### 2. MetadataHeader Component ⚠️ RISK IDENTIFIED

**Location**: New component, calculator pages, before explanation content  
**Spec Reference**: CAL-1557 Decision 3, lines 336-358  

**Specification Details**:
```
✅ Updated: 24 Apr 2026
🏛️ Data source: Bank of Thailand
✍️ Author: Kamnuanlek Team
```
- Font: 13px gray text
- Background: Light blue (#f0f9ff) or light gray (#f9fafb)
- Padding: 12px left/right, 8px top/bottom
- **Mobile layout**: Vertical stack
- **Desktop layout**: Inline (items separated by dots or dividers)
- Font size: 13px for all metadata text

**WCAG Analysis**:

**MOBILE (375px) — Vertical Stack Layout**:
- ✅ If source + date are clickable links, padding 12px (L/R) + 8px (T/B) provides adequate height for 44px tap target IF row height is sufficient
- ⚠️ **RISK**: 13px text + 8px padding top/bottom = 29px content height. Total tap target = 29px, **BELOW 44px minimum**
- ⚠️ **RISK**: If any link item (e.g., source URL) is independent tap target, 13px text alone is TOO SMALL for 44px target

**DESKTOP (≥768px) — Inline Layout**:
- 🔴 **VIOLATION**: "items separated by dots or dividers" suggests inline layout with 13px text
- 🔴 If source link is inline text (13px), tap target is 13px height, **FAR BELOW 44px**
- 🔴 Links must be 44px minimum; 13px text cannot meet this without significant padding

**Specific Issues**:
1. **Mobile**: 29px total height < 44px minimum
2. **Desktop**: Inline 13px text < 44px minimum height
3. **Link distinction**: Spec doesn't clarify if source link is separately tappable or part of larger row

**Severity**: 🟠 **HIGH** — Affects touch accessibility on both mobile + desktop  
**Impact**: Users with motor impairment cannot reliably tap source links

---

### 3. RelatedArticles Enhancement ("View All" Link) 🔴 SPECIFICATION GAP

**Location**: Modified component, calculator pages, bottom section  
**Spec Reference**: CAL-1557 Decision 1, lines 76-92  

**Specification Details**:
- Shows up to 3 related articles (visual limit)
- Includes publication date + author in small text
- **"View All Articles in [Cluster Name]" link if >3 articles exist** ← TAP TARGET SIZE NOT SPECIFIED

**WCAG Analysis**:
- ❓ **Unknown**: No tap target size specified for "View All" link
- ❓ **Risk**: If styled as underlined text (typical link), could be 12-13px tall
- 🔴 **Likely violation**: Without explicit padding/height specification, "View All" link likely falls below 44px minimum

**Severity**: 🟠 **HIGH** — Specification gap creates implementation risk  
**Recommendation**: Must define before implementation

---

### 4. ArticleCalculatorLinks Component (New) 🔴 SPECIFICATION GAP

**Location**: New component, article pages, end of article body  
**Spec Reference**: CAL-1557 Decision 2, lines 196-227  

**Specification Details**:
- Shows 2-3 related calculators at article end
- Styling: "Consistent with existing calculator cards"
- Links: "Underlined, primary color"
- **Placement**: End of article, before comments/related articles
- **NO explicit tap target size specified**

**WCAG Analysis**:
- ❓ **Unknown**: Tap target sizes not specified
- ✅ **Assumption**: If styled as existing calculator cards (which CAL-1461 verified at 48px+), should be OK
- 🟠 **Risk**: Links described as "underlined" without padding could be 13-14px height

**Severity**: 🟡 **MEDIUM** — Inherits from existing calculator cards (likely compliant), but new links need explicit sizing  
**Recommendation**: Confirm link sizing matches calculator card styling (48px+)

---

### 5. Article Byline (Metadata on Article Pages) 🟡 MINOR RISK

**Location**: Article pages, below article title  
**Spec Reference**: CAL-1557 Decision 3, lines 362-378  

**Specification Details**:
```
✍️ By Kamnuanlek Team | 📅 Published 30 Apr 2026
```
- Format: Author + publication date
- Styling: "Same as calculator header (light background, 13px text)"
- Placement: Below article title, above body
- **Tap target size**: Inherited from MetadataHeader (13px) — same compliance issue

**WCAG Analysis**:
- ⚠️ **Inherits MetadataHeader risk**: If byline contains clickable elements (author link, date link), same 13px height issue applies
- ✅ If byline is static text only (not clickable), no violation

**Severity**: 🟡 **MEDIUM** — Conditional on whether author/date are clickable  
**Recommendation**: Clarify if byline links are clickable; if so, apply same 44px fix as MetadataHeader

---

## BASELINE CONTEXT: Phase 1 Findings

**CAL-1462 Finding**: Phase 1 consistency audit identified **99.7% of existing calculators lack visible trust components**  
**CAL-1461 Finding**: Mobile baseline verified existing calculator cards meet 48px+ tap target (PASS)  
**Implication**: Phase 2 NEW components must maintain same accessibility standard (44px+ minimum)

---

## VIOLATIONS SUMMARY

| Component | Issue | Severity | WCAG Impact | Fixable in Phase 2 |
|-----------|-------|----------|-------------|-------------------|
| **ArticleTeaser** | None | ✅ N/A | Compliant | — |
| **MetadataHeader** | 29px mobile height, 13px desktop inline | 🟠 HIGH | 2.5.5 Target Size (Level AAA) | ✅ Yes (4h) |
| **"View All" link** | No size specification | 🟠 HIGH | 2.5.5 Target Size (Level AAA) | ✅ Yes (1h) |
| **ArticleCalculatorLinks** | Link sizing unspecified | 🟡 MEDIUM | Potential 2.5.5 | ✅ Yes (2h) |
| **Article byline** | Inherits MetadataHeader issue | 🟡 MEDIUM | 2.5.5 if clickable | ✅ Yes (1h) |

---

## WCAG STANDARD REFERENCE

**WCAG 2.1 Success Criterion 2.5.5 Target Size (Level AAA)**  
*Note: This is AAA, not required for AA compliance. However, Calculator Thailand targets accessibility best practice.*

> "The size of the target for pointer inputs is at least 44 by 44 CSS pixels."

**Mobile Context**: 44×44px = approximately 12×12mm at standard 96 DPI, comfortable for adult thumb/finger (standard recommendation: 9-10mm minimum, 12-15mm comfortable for precision)

---

## RECOMMENDATION: FIX IN PHASE 2

**Rationale**:
1. **All issues are implementable before 2026-04-30 launch** — no blockers identified
2. **Effort is manageable** — ~6-8 hours total (within standard implementation buffer)
3. **Risk of deferral is higher** — parallel CAL-1486 remediation would extend timeline; Phase 2 is already gate-critical
4. **User impact is direct** — mobile users with motor impairment cannot reliably use components
5. **No architectural changes needed** — only padding/height specifications

---

## IMPLEMENTATION PLAN

### MetadataHeader Fix (Priority 1 — 4 hours)

**Mobile (375px) — Vertical Stack**:
```
✅ Updated: 24 Apr 2026
🏛️ Data source: Bank of Thailand
✍️ Author: Kamnuanlek Team
```
- **Change padding**: 12px left/right → **16px left/right**, 8px top/bottom → **12px top/bottom**
- **Change height constraint**: Add explicit `min-h-12` (48px minimum)
- **Result**: Each row becomes 48px minimum tap target

**Desktop (≥768px) — Inline Layout**:
- **Option A (Recommended)**: Stack horizontally but each item is independently tappable (not inline text)
  - Add padding around each item: 8px top/bottom, 12px left/right
  - Result: Source link becomes 44px+ tap target even if text is 13px
- **Option B**: Keep inline text, add `<button>` or `<a>` wrapper with padding
  - Visually lighter, but may feel cluttered

**Spec Update Required**:
```
MetadataHeader revised:
- Mobile: Vertical stack, each row 48px minimum height (12px padding T/B)
- Desktop: Inline layout with 44px minimum touch target per item (use padding, not text height)
```

---

### "View All Articles" Link Fix (Priority 1 — 1 hour)

**Current Spec**:
```
Add "View All Articles in [Cluster Name]" link at bottom if >3 articles exist
```

**Required Spec Update**:
```
"View All Articles in [Cluster Name]" link:
- Font: 14px (primary color)
- Padding: 12px horizontal, 8px vertical (minimum)
- Height: 44px minimum
- Alternative: Use as a button with standard button styling (48px height)
```

---

### ArticleCalculatorLinks Link Sizing (Priority 2 — 2 hours)

**Clarification Required**:
- Confirm: Are these links styled as full calculator cards (48px+)?
- If link-only (not full card), apply 44px minimum height with padding

**Spec Update**:
```
ArticleCalculatorLinks component:
- Style: Inherit existing calculator card styling (48px+ height per CAL-1461)
- If text-only links: Add 12px horizontal, 8px vertical padding (44px minimum)
- Hover state: Underline + color change (consistency with RelatedCalculators)
```

---

### Article Byline Clarification (Priority 2 — 1 hour)

**Decision Required**:
1. **If byline is static text only**: No change needed
2. **If byline contains clickable author/date links**: Apply MetadataHeader fix (44px+ minimum)

**Spec Update**:
```
Article byline:
- If clickable: Apply MetadataHeader tap target rules (44px minimum per item)
- If static: No changes needed; inherit MetadataHeader styling only
```

---

## EFFORT ESTIMATE

| Fix | Hours | Notes |
|-----|-------|-------|
| MetadataHeader mobile padding | 2 | CSS + Astro prop update |
| MetadataHeader desktop layout | 1.5 | Button/link wrapper or grid layout |
| "View All" link specification + implementation | 1 | Add padding, test mobile |
| ArticleCalculatorLinks clarification + fix | 2 | Confirm styling, apply if needed |
| Article byline clarification + conditional fix | 1 | Depends on clickable decision |
| **Testing (mobile + desktop, all components)** | **2** | 375px + 1440px viewports, accessibility audit |
| **TOTAL** | **~9.5h** | Within Phase 2 buffer |

**Timeline**: Can complete within 2026-04-25 to 2026-04-30 window (concurrent with other Phase 2 work)

---

## QA VERIFICATION PLAN

**Before Release (2026-04-30)**:

1. **Mobile Testing** (375px, 100% zoom):
   - Tap target verification: All interactive elements tap-able with 12mm diameter circle (44px)
   - Tool: Chrome DevTools Inspector, measure padding/height
   - Device: Pixel 4a emulation (375px viewport)

2. **Desktop Testing** (1440px):
   - Tap target verification: Inline links have 44px minimum height or padding
   - Tool: Browser DevTools
   - Check: Source links, "View All" links, article calculator links

3. **Screen Reader Testing**:
   - NVDA/JAWS (Windows): Verify all links announced correctly
   - TalkBack (Android Pixel): Verify tap target sizes audible

4. **Contrast Verification**:
   - MetadataHeader gray text (#6b7280) on white (#ffffff) = 4.5:1 ratio (WCAG AA)
   - Source link blue (#2563eb) on white = 5.5:1 ratio (WCAG AA)

5. **Cross-calculator Spot Check**:
   - Test on 5 different calculators (BMI, Tax, Loan, Health, Food)
   - Verify components render correctly across categories

---

## RISK ASSESSMENT

**Risk of Implementing Now**:
- 🟢 **LOW** — All fixes are CSS + prop changes; no logic changes
- 🟢 No breaking changes to existing components
- 🟢 Can be tested in isolation before merge

**Risk of Deferring to CAL-1486**:
- 🔴 **HIGH** — Parallel remediation would delay Phase 2 full launch (2026-05-08 pushed to 2026-05-15+)
- 🔴 Phase 2 gate decision (2026-04-29) depends on this assessment; deferral signals "blocking issue"
- 🔴 User impact: Mobile users unable to reliably interact with new components for 1+ weeks

**Recommendation**: **FIX NOW**

---

## DECISION GATE INPUTS

**For CEO (Phase 2 Gate Decision, 2026-04-29)**:

✅ **CTO Assessment Complete**: All Phase 2 components reviewed against WCAG 2.1 AA tap target standard (44×44px minimum)

✅ **Issues Identified & Scope-Limited**:
- 2 high-severity issues (MetadataHeader, "View All" link)
- 2 medium-severity clarifications (ArticleCalculatorLinks, Article byline)
- All implementable within Phase 2 timeline

✅ **No Architectural Blockers**: Issues are styling/padding, not logic changes

✅ **Effort Estimate: ~9.5 hours** — fits within Phase 2 buffer

✅ **Recommendation: FIX IN PHASE 2**
- Maintain Phase 2 launch schedule (2026-04-30)
- Accessibility standards upheld on day 1
- No parallel remediation needed

---

## NEXT ACTIONS

**For CTO**:
1. ✅ Share this assessment with Product/CEO for gate decision input
2. Create implementation subtasks (MetadataHeader, "View All" link, etc.)
3. Assign to Frontend Release Engineer with 2026-04-27 deadline

**For Frontend Release Engineer**:
1. Implement MetadataHeader padding + height fixes (2026-04-27)
2. Update "View All Articles" link specification + styling (2026-04-27)
3. Clarify + implement ArticleCalculatorLinks sizing (2026-04-28)
4. Run QA verification tests (2026-04-28 to 2026-04-29)

**For Release QA**:
1. Mobile + desktop tap target verification (2026-04-28)
2. Screen reader testing (2026-04-29)
3. Cross-calculator spot checks (2026-04-29)

---

## CTO SIGN-OFF

**Assessment Status**: ✅ **COMPLETE**  
**Recommendation**: ✅ **FIX IN PHASE 2**  
**Gate Impact**: No blocker — Phase 2 can proceed with accessibility fixes included  
**Timeline**: All fixes deliver on time for 2026-04-30 launch  

**Date**: 2026-04-24  
**CTO**: Henrik Madsen  
**Session**: 51845792-9a7d-4e62-9d67-4a89c7d69e62  

---

## APPENDIX: WCAG 2.1 AA Reference

**Standard**: WCAG 2.1 Level AA (Accessibility Guidelines v2.1)  
**Target Size Guidance**:
- Level A: No explicit target size requirement
- Level AA: No explicit requirement, but 2.5.5 is at AAA level
- **Level AAA**: 2.5.5 Target Size (44×44px minimum recommended)

**Mobile Best Practice**: 
- iOS/Android guidelines recommend 44-48px minimum
- Calculator Thailand standard: 44px minimum (consistent with WCAG AAA)

**Related WCAG Criteria**:
- 2.1.1 Keyboard (Accessible by keyboard)
- 2.4.7 Focus Visible (Visual feedback on focus)
- 2.5.1 Pointer Gestures (No multi-point touch required)
- 4.1.2 Name, Role, Value (Proper semantic HTML)

