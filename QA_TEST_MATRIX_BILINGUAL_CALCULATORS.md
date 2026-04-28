# QA Test Matrix — Bilingual Calculator Verification (Thai/English)

**Document Version**: 1.0  
**Date**: 2026-04-28  
**Prepared by**: Release QA Engineer Alpha  
**Status**: Ready for staging testing (May 10-19)  

---

## Executive Summary

This test matrix documents comprehensive QA coverage for the English translation launch of Calculator Thailand. The matrix covers **6 core calculators**, bilingual functionality, i18n infrastructure verification, mobile compatibility, SEO signal integrity, accessibility compliance, and localization quality.

**Scope**:
- **Calculators**: electricity-bill, land-tax, loan-payment, overtime-pay, property-transfer-tax, unit-converter
- **Languages**: Thai (th) and English (en)
- **Testing Phases**: Staging (May 10-12), Production (May 18-19)
- **Test Categories**: Functional, Mobile, Accessibility, SEO, Browser/Performance, Localization

---

## Part 1: Functional Testing

### 1.1 Calculator Input/Output Verification (Thai)

| Test ID | Calculator | Test Case | Expected Behavior | Verification Method | Mobile | Status | Notes |
|---------|------------|-----------|-------------------|---------------------|--------|--------|-------|
| F-TH-001 | electricity-bill | Enter valid kWh value | Correct THB calculation | Manual input test | Yes | [ ] | Check formula matches approved logic |
| F-TH-002 | electricity-bill | Submit form | Results display clearly | Visual inspection | Yes | [ ] | Verify no overflow on mobile |
| F-TH-003 | land-tax | Enter property value | Correct tax calculation | Manual input test | Yes | [ ] | Verify Thai number formatting |
| F-TH-004 | land-tax | Edge case: maximum value | System handles gracefully | Input validation | Yes | [ ] | No crashes or errors |
| F-TH-005 | loan-payment | Enter loan amount + rate | Correct monthly payment | Mathematical verification | Yes | [ ] | Compare against known examples |
| F-TH-006 | loan-payment | Toggle amortization schedule | Schedule displays correctly | Visual inspection | Yes | [ ] | All rows visible, no truncation |
| F-TH-007 | overtime-pay | Enter hours + rate | Correct overtime calculation | Manual test | Yes | [ ] | Verify Thai overtime rules applied |
| F-TH-008 | overtime-pay | Different shift types | Correct multiplier applied | Input variation test | Yes | [ ] | 1.5x, 2x, 3x multipliers correct |
| F-TH-009 | property-transfer-tax | Enter transaction value | Correct tax + fees | Manual calculation | Yes | [ ] | Verify Thai stamp duty rules |
| F-TH-010 | property-transfer-tax | Edge case: boundary values | Tax brackets calculated correctly | Input boundary test | Yes | [ ] | Test min/max thresholds |
| F-TH-011 | unit-converter | Select conversion pair | Correct conversion result | Manual verification | Yes | [ ] | Verify accuracy to 2 decimal places |
| F-TH-012 | unit-converter | Bidirectional conversion | Both directions work | Swap input/output test | Yes | [ ] | A→B and B→A consistent |

### 1.2 Calculator Input/Output Verification (English)

| Test ID | Calculator | Test Case | Expected Behavior | Verification Method | Mobile | Status | Notes |
|---------|------------|-----------|-------------------|---------------------|--------|--------|-------|
| F-EN-001 | electricity-bill | Enter valid kWh value | Correct calculation | Manual input test | Yes | [ ] | Same formula logic as Thai |
| F-EN-002 | electricity-bill | Verify output units | THB or USD displayed | Visual inspection | Yes | [ ] | Currency label correct |
| F-EN-003 | land-tax | Enter property value | Correct calculation | Manual input test | Yes | [ ] | English number formatting (no .) |
| F-EN-004 | land-tax | Field labels clarity | All labels in English | Text inspection | Yes | [ ] | No Thai text leakage |
| F-EN-005 | loan-payment | Enter loan parameters | Correct monthly payment | Mathematical test | Yes | [ ] | Identical logic to Thai version |
| F-EN-006 | loan-payment | Currency/format display | Correct locale formatting | Number format check | Yes | [ ] | No Thai baht symbols on English |
| F-EN-007 | overtime-pay | Enter hours + rate | Correct calculation | Manual test | Yes | [ ] | English multiplier labels |
| F-EN-008 | overtime-pay | Shift type selection | Options clear in English | UI text review | Yes | [ ] | No ambiguous translations |
| F-EN-009 | property-transfer-tax | Enter transaction value | Correct calculation | Manual test | Yes | [ ] | English tax terminology |
| F-EN-010 | property-transfer-tax | Output explanation | Clear English tax breakdown | Text clarity check | Yes | [ ] | Technical terms explained |
| F-EN-011 | unit-converter | Select conversion pair | Correct result | Manual verification | Yes | [ ] | English unit names |
| F-EN-012 | unit-converter | Alphabetical ordering | Units sortable/findable | Dropdown test | Yes | [ ] | No encoding issues |

### 1.3 Language Toggle Functionality

| Test ID | Feature | Test Case | Expected Behavior | Verification Method | Mobile | Status | Notes |
|---------|---------|-----------|-------------------|---------------------|--------|--------|-------|
| L-001 | Language Switcher | Click Thai flag on English page | Switch to Thai calculator | Navigation test | Yes | [ ] | All inputs preserve values |
| L-002 | Language Switcher | Click English flag on Thai page | Switch to English calculator | Navigation test | Yes | [ ] | All inputs preserve values |
| L-003 | Input State Preservation | Enter values in Thai, switch to English | Values remain populated | Form state test | Yes | [ ] | No data loss during toggle |
| L-004 | Output State Preservation | Calculate in Thai, switch languages | Results preserved in toggle view | State persistence test | Yes | [ ] | No recalculation needed |
| L-005 | Toggle Speed | Measure time to switch | Smooth, < 500ms | Performance measurement | Yes | [ ] | No lag or flashing |
| L-006 | Toggle Visual Feedback | Click toggle, observe UI | Clear indication of active language | Visual inspection | Yes | [ ] | Highlight active language |
| L-007 | Deep Link Thai | Access /คำนวณ-electricity-bill | Page loads in Thai | Direct URL test | Yes | [ ] | No redirect issues |
| L-008 | Deep Link English | Access /en/calculator/electricity-bill | Page loads in English | Direct URL test | Yes | [ ] | URL structure correct |
| L-009 | Deep Link Toggle | Start Thai, toggle to English, toggle back | URLs update correctly | URL tracking test | Yes | [ ] | History doesn't break |

### 1.4 URL Structure & Routing

| Test ID | Route | Expected URL | Status Code | Notes | Status |
|---------|-------|--------------|-------------|-------|--------|
| U-001 | Thai calculator (electricity) | /คำนวณ-electricity-bill | 200 | Direct Thai path | [ ] |
| U-002 | English calculator (electricity) | /en/calculator/electricity-bill | 200 | English prefixed path | [ ] |
| U-003 | Thai legacy redirect | /calculator/electricity-bill | 301 → Thai | Redirect chain | [ ] |
| U-004 | Root index Thai | / | 200 | Thai home page | [ ] |
| U-005 | Root index English | /en/ | 200 | English home page | [ ] |
| U-006 | Non-existent English path | /en/calculator/nonexistent | 404 | Proper 404 | [ ] |
| U-007 | Non-existent Thai path | /คำนวณ-nonexistent | 404 | Proper 404 | [ ] |

---

## Part 2: Mobile & Accessibility Testing

### 2.1 Device Compatibility Matrix

| Device | Model | OS Version | Browser | Screen Size | Landscape | Portrait | Notes | Status |
|--------|-------|------------|---------|------------|-----------|----------|-------|--------|
| iPhone | 12 | iOS 16+ | Safari | 390x844 | Test | Test | [ ] | Check tap targets |
| Android | Galaxy S21 | Android 12+ | Chrome | 360x800 | Test | Test | [ ] | Touch event handling |
| Tablet | iPad Air | iOS 16+ | Safari | 820x1180 | Test | Test | [ ] | Landscape layout |
| Responsive | Desktop | — | Chrome | 1920x1080 | N/A | N/A | [ ] | Desktop baseline |

**Specific Test Cases for Each Device**:

| Test ID | Device | Test Case | Expected Behavior | Status | Notes |
|---------|--------|-----------|-------------------|--------|-------|
| M-001 | iPhone 12 | Landscape orientation | Layout adjusts, no overflow | [ ] | Check calculator input area |
| M-002 | iPhone 12 | Portrait orientation | Vertical scrolling smooth | [ ] | No horizontal scroll needed |
| M-003 | iPhone 12 | Tap input fields | Keyboard appears, inputs focus | [ ] | Verify autofocus behavior |
| M-004 | iPhone 12 | Tap submit button | Results display below fold | [ ] | Scroll position maintained |
| M-005 | Galaxy S21 | Viewport meta tag | Correct zoom level | [ ] | Check device-width scaling |
| M-006 | Galaxy S21 | Touch responsiveness | No lag on input/toggle | [ ] | Swipe language toggle works |
| M-007 | iPad Air | Split-screen mode | App doesn't break | [ ] | Resize width smoothly |
| M-008 | iPad Air | Landscape full-width | Results clear, no truncation | [ ] | Column layout works |
| M-009 | All mobile | Font readability | Text >= 16px | [ ] | No zoom needed to read |
| M-010 | All mobile | Button tap targets | Minimum 44x44 px | [ ] | Language toggle button size |

### 2.2 Accessibility Testing (Screen Readers & Keyboard)

| Test ID | Feature | Test Case | Expected Result | Testing Tool | Status | Notes |
|---------|---------|-----------|-----------------|--------------|--------|-------|
| A-001 | Screen Reader | Page title announced | "Calculator Thailand - [Calculator name]" | NVDA/JAWS | [ ] | Include language indicator |
| A-002 | Screen Reader | Form labels announced | Label text read before input | NVDA/JAWS | [ ] | Proper `<label>` association |
| A-003 | Screen Reader | Calculator name | "Electricity Bill Calculator, Thai" announced | NVDA/JAWS | [ ] | Language in announcement |
| A-004 | Screen Reader | Input instructions | "Enter kilowatt-hours as a number" announced | NVDA/JAWS | [ ] | Clear guidance provided |
| A-005 | Screen Reader | Results announcement | Full calculation result read in order | NVDA/JAWS | [ ] | No visual-only presentation |
| A-006 | Keyboard Nav | Tab order | Logical tab sequence (left-to-right, top-to-bottom) | Manual test | [ ] | No trap/skip |
| A-007 | Keyboard Nav | Input focus | Clear visual focus indicator | Manual test | [ ] | 3:1 contrast minimum |
| A-008 | Keyboard Nav | Submit button | Enter key submits form | Manual test | [ ] | No Enter trap |
| A-009 | Keyboard Nav | Language toggle | Tab accessible, Enter activates | Manual test | [ ] | Keyboard-only users supported |
| A-010 | Keyboard Nav | Results | Tab to results readable | Manual test | [ ] | Focus moves to results |
| A-011 | Color Contrast | Text on background | >= 4.5:1 contrast ratio | axe or WAVE | [ ] | Both languages checked |
| A-012 | ARIA Labels | Hidden elements | `aria-label` or `aria-describedby` present | Code review | [ ] | Language toggle button |

---

## Part 3: SEO Verification

### 3.1 hreflang Tags (Bidirectional Linking)

| Test ID | Page Type | Thai URL | English URL | Thai hreflang | English hreflang | Status | Notes |
|---------|-----------|----------|------------|---------------|------------------|--------|-------|
| S-HREF-001 | Calculator | /คำนวณ-electricity-bill | /en/calculator/electricity-bill | `<link rel="alternate" hreflang="en" href="/en/calculator/electricity-bill">` | `<link rel="alternate" hreflang="th" href="/คำนวณ-electricity-bill">` | [ ] | Bidirectional verified |
| S-HREF-002 | Calculator | /คำนวณ-land-tax | /en/calculator/land-tax | Thai → EN link correct | EN → TH link correct | [ ] | Test all 6 calculators |
| S-HREF-003 | Article | /article-thai | /en/article-english | Thai → EN present | EN → TH present | [ ] | Content pages also linked |
| S-HREF-004 | Home | / | /en/ | Thai home → EN present | EN home → TH present | [ ] | Root level hreflang |
| S-HREF-005 | Inspect | Open DevTools | Source code | `<head>` contains hreflang links | Validated in HTML | [ ] | Not hardcoded in each page |

### 3.2 Canonical Tags

| Test ID | Page | Expected Canonical | Status | Notes |
|---------|------|-------------------|--------|-------|
| S-CAN-001 | /คำนวณ-electricity-bill | `<link rel="canonical" href="https://kamnuanlek.com/คำนวณ-electricity-bill">` | [ ] | Self-referential |
| S-CAN-002 | /en/calculator/electricity-bill | `<link rel="canonical" href="https://kamnuanlek.com/en/calculator/electricity-bill">` | [ ] | Self-referential |
| S-CAN-003 | Duplicate test | Both Thai and EN have unique canonicals | [ ] | No cross-language cannibalization |

### 3.3 Open Graph (OG) Tags

| Test ID | Page | og:title | og:description | og:locale | og:url | Status | Notes |
|---------|------|----------|-----------------|-----------|--------|--------|-------|
| S-OG-001 | Thai calculator | Thai title present | Thai description | th_TH | Thai URL | [ ] | Social share preview Thai |
| S-OG-002 | English calculator | English title present | English description | en_US | English URL | [ ] | Social share preview English |
| S-OG-003 | Facebook share | Share dialog shows | Correct preview image | Language-appropriate | [ ] | [ ] | Visual verification |

### 3.4 Twitter Card Tags

| Test ID | Page | twitter:card | twitter:title | twitter:description | Status | Notes |
|---------|------|--------------|---------------|--------------------|--------|-------|
| S-TW-001 | Thai calculator | summary_large_image | Thai text | Thai text | [ ] | Twitter preview |
| S-TW-002 | English calculator | summary_large_image | English text | English text | [ ] | Twitter preview |

### 3.5 Schema Markup Validation

| Test ID | Page | Schema Type | Schema Properties | Validator | Status | Notes |
|---------|------|------------|-------------------|-----------|--------|-------|
| S-SCHEMA-001 | Thai calculator | Organization | name, logo, url | JSON-LD validation | [ ] | Root schema |
| S-SCHEMA-002 | Thai calculator | WebPage | name, description, dateModified | JSON-LD | [ ] | Page-level schema |
| S-SCHEMA-003 | Thai calculator | Calculator | name, description, url | JSON-LD | [ ] | Custom calculator schema |
| S-SCHEMA-004 | Thai calculator | BreadcrumbList | itemListElement array | JSON-LD | [ ] | Breadcrumb navigation |
| S-SCHEMA-005 | Thai calculator | HowTo | step array with text | JSON-LD | [ ] | Instructions/steps |
| S-SCHEMA-006 | English calculator | Same schema types | Replicate Thai structure | JSON-LD | [ ] | All in English text |
| S-SCHEMA-007 | Validate all | schema.org compliance | No validation errors | Google SDTT or similar | [ ] | Production readiness |

### 3.6 Mobile & Viewport Tags

| Test ID | Tag Name | Expected Value | Status | Notes |
|---------|----------|-----------------|--------|-------|
| S-VIEW-001 | viewport meta | `width=device-width, initial-scale=1` | [ ] | Responsive design |
| S-VIEW-002 | Mobile-friendly | Page renders without horizontal scroll | [ ] | Mobile-first design |

### 3.7 Language Tags

| Test ID | Page | html lang Attribute | Expected | Status | Notes |
|---------|------|-------------------|----------|--------|-------|
| S-LANG-001 | Thai page | `<html lang="th">` | Present | [ ] | Thai language declaration |
| S-LANG-002 | English page | `<html lang="en">` | Present | [ ] | English language declaration |
| S-LANG-003 | Content lang | Thai page body text | In Thai | [ ] | No mixed language content |
| S-LANG-004 | Content lang | English page body text | In English | [ ] | Pure English content |

---

## Part 4: Browser & Performance Testing

### 4.1 Browser Compatibility

| Browser | Version | Platform | Thai Calculator | English Calculator | Notes | Status |
|---------|---------|----------|------------------|-------------------|-------|--------|
| Chrome | Latest 2 versions | Windows/Mac/Linux | Test | Test | [ ] | Primary target |
| Firefox | Latest 2 versions | Windows/Mac/Linux | Test | Test | [ ] | Secondary target |
| Safari | Latest 2 versions | macOS/iOS | Test | Test | [ ] | Apple ecosystem |
| Edge | Latest 2 versions | Windows | Test | Test | [ ] | Windows alternative |

**Specific Test Cases**:

| Test ID | Browser | Test Case | Expected Behavior | Status | Notes |
|---------|---------|-----------|-------------------|--------|-------|
| B-001 | Chrome | Calculator loads | Fast load, no JS errors | [ ] | Console check |
| B-002 | Chrome | Input entry | Smooth typing, no lag | [ ] | No jank during input |
| B-003 | Chrome | Results display | Numbers formatted correctly | [ ] | Thai numerals on Thai, Arabic on English |
| B-004 | Firefox | Same functionality | Identical to Chrome | [ ] | Cross-browser parity |
| B-005 | Safari | Mobile/desktop | Touch gestures work | [ ] | No webkit-specific issues |
| B-006 | All browsers | Language toggle | Toggle smooth across browsers | [ ] | No browser-specific issues |

### 4.2 Core Web Vitals (CWV)

**Baseline**: Thai-only version (before English launch)  
**Comparison**: Bilingual version (after English launch)  
**Threshold**: No regression > 10%

| Metric | Metric Type | Thai Baseline | Bilingual Target | Measurement Method | Status | Notes |
|--------|------------|---------------|-----------------|--------------------|--------|-------|
| LCP | Largest Contentful Paint | < 2.5s | < 2.5s | WebPageTest, PageSpeed Insights | [ ] | By calculator page |
| CLS | Cumulative Layout Shift | < 0.1 | < 0.1 | Chrome DevTools | [ ] | No unexpected shifts |
| FID/INP | First Input Delay / Interaction to Next Paint | < 100ms | < 100ms | Field data (CrUX) | [ ] | UI responsiveness |
| TTFB | Time to First Byte | < 600ms | < 600ms | Network performance | [ ] | Server response time |

**Test Procedure**:
1. Run 3× baseline measurement on Thai calculator (current master)
2. Run 3× measurement on English calculator (bilingual version)
3. Calculate average and % change
4. Flag any > 10% regression
5. Investigate if flagged (bundle size, rendering, i18n overhead)

### 4.3 Bundle Size & i18n Overhead

| Metric | Baseline | Bilingual | Allowed Overhead | Status | Notes |
|--------|----------|-----------|------------------|--------|-------|
| JS bundle size (gzipped) | [baseline] | [bilingual] | +10% max | [ ] | Check dist/js files |
| CSS bundle size (gzipped) | [baseline] | [bilingual] | +5% max | [ ] | Check dist/css files |
| i18n locale files size | N/A | [en.json + th.json] | Acceptable | [ ] | ~9MB combined uncompressed |
| Total HTML output per page | [baseline] | [bilingual] | +15% max | [ ] | Check dist/[calculator]/*.html |

### 4.4 Build Time

| Build Type | Thai-Only Build Time | Bilingual Build Time | Acceptable Increase | Status | Notes |
|------------|----------------------|----------------------|--------|--------|-------|
| Clean build (`npm ci; npm run build`) | [baseline] | [bilingual] | +30% | [ ] | First build with npm install |
| Warm build (cached dependencies) | [baseline] | [bilingual] | +20% | [ ] | Repeat builds |
| Incremental build (file change) | [baseline] | [bilingual] | +10% | [ ] | During development |

---

## Part 5: Localization QA

### 5.1 Translation Accuracy (Glossary Adherence)

| Test ID | Term | Thai Translation | English Translation | Context | Verified | Notes |
|---------|------|------------------|---------------------|---------|----------|-------|
| L-TERM-001 | "Electricity Bill" | "ค่าไฟฟ้า" | "Electricity Bill" | Calculator name | [ ] | Consistent across pages |
| L-TERM-002 | "Input" | "ป้อนข้อมูล" | "Input" | Form labels | [ ] | No ambiguity |
| L-TERM-003 | "Calculate" | "คำนวณ" | "Calculate" | Button label | [ ] | Same button across calculators |
| L-TERM-004 | "kWh" (kilowatt-hour) | "กิโลวัตต์-ชั่วโมง" | "kWh" | Unit name | [ ] | Technical term consistency |
| L-TERM-005 | "Land Transfer Tax" | "ภาษีอากรแสตมป์" | "Land Transfer Tax" | Calculator name | [ ] | Thai tax terminology |
| [Add more terms per calculator] | | | | | [ ] | Build from approved glossary |

**Verification Method**: Spot-check 20-30 key terms on each calculator page. Compare against approved glossary in [CAL-2455](/CAL/issues/CAL-2455).

### 5.2 Number & Currency Formatting

| Test ID | Input | Thai Display | English Display | Expected | Status | Notes |
|---------|-------|--------------|-----------------|----------|--------|-------|
| L-NUM-001 | 1234.56 | ๑,๒๓๔.๕๖ (Thai numerals) | 1,234.56 (Arabic) | Different numeral systems | [ ] | Locale-aware |
| L-NUM-002 | 50000 THB | ๕๐,๐๐๐ บาท | 50,000 THB | Currency symbol/label | [ ] | No cross-language contamination |
| L-NUM-003 | Decimal input | Correct computation | Same result | Mathematical equivalence | [ ] | Math identical across languages |
| L-NUM-004 | Large numbers | Thousand separator correct | Thousand separator correct | 1,000,000 formatting | [ ] | Both formats clear |
| L-NUM-005 | Percentage display | Thai format | English format | Locale-specific | [ ] | 50% vs ๕๐% |

### 5.3 UI Layout & Text Overflow

| Test ID | Page | Text Element | Thai Length | English Length | Desktop Layout | Mobile Layout | Status | Notes |
|---------|------|--------------|-------------|----------------|----------------|-----------|----|-------|
| L-LAYOUT-001 | Electricity Bill | Button label | "คำนวณ" (3 chars) | "Calculate" (9 chars) | Fits | Fits | [ ] | English 3x longer |
| L-LAYOUT-002 | Land Tax | Input label | "มูลค่าทรัพย์สิน" (8 chars) | "Property Value" (14 chars) | Fits | Check | [ ] | May need wrapping on mobile |
| L-LAYOUT-003 | Loan Payment | Result heading | "ผลการคำนวณ" (5 chars) | "Calculation Result" (18 chars) | Fits | Fits | [ ] | Desktop has more space |
| L-LAYOUT-004 | All calculators | Text fields | Thai width adequate? | English width adequate? | Desktop | Mobile | [ ] | Max width set appropriately |
| L-LAYOUT-005 | Mobile view | Input area | No horizontal scroll | No overflow | Test | Test | [ ] | Verify on narrow screens |
| L-LAYOUT-006 | Mobile view | Results | Readable column layout | Vertical stack | Test | Test | [ ] | No side-by-side on mobile |

### 5.4 Terminology Consistency Across Calculators

| Term | Calculator 1 | Calculator 2 | Calculator 3 | Calculator 4 | Status | Notes |
|------|--------------|--------------|--------------|--------------|--------|-------|
| "Calculate" | Consistent | Consistent | Consistent | Consistent | [ ] | Same translation in all 6 |
| "Result" | Consistent | Consistent | Consistent | Consistent | [ ] | ผลลัพธ์ vs ผลการคำนวณ (pick one) |
| "Input" | Consistent | Consistent | Consistent | Consistent | [ ] | ป้อนข้อมูล everywhere |
| "Clear/Reset" | Consistent | Consistent | Consistent | Consistent | [ ] | ล้าง vs ยกเลิก (choose one) |
| [Add domain-specific terms] | | | | | [ ] | Per calculator domain |

---

## Part 6: Test Execution & Sign-Off

### 6.1 Testing Timeline & Phases

**Phase 1: Staging Testing (May 10-12)**
- Environment: Staging deployment
- Scope: All 6 calculators in Thai and English
- Focus: Functional correctness, layout, SEO structure
- Team: QA, UX Designer, Thai Content Specialist
- Deliverable: Defect log, pass/fail per calculator

**Phase 2: Production Testing (May 18-19)**
- Environment: Production (post-deployment)
- Scope: Spot verification of all calculators
- Focus: Real-world performance, Core Web Vitals, user flow
- Team: QA, CMO (SEO monitoring), Operations
- Deliverable: Sign-off report, go/no-go recommendation

### 6.2 Test Execution Checklist

| Phase | Date | Assignee | Task | Complete | Sign-Off |
|-------|------|----------|------|----------|----------|
| Pre-testing | May 9 | QA | Prepare test devices, VM, screen reader tools | [ ] | |
| Staging Phase 1 | May 10 | QA | Run functional tests (F-TH-*, F-EN-*) | [ ] | |
| Staging Phase 1 | May 10 | QA | Run language toggle tests (L-*) | [ ] | |
| Staging Phase 1 | May 11 | QA | Run mobile & accessibility tests (M-*, A-*) | [ ] | |
| Staging Phase 1 | May 11 | QA | Run SEO verification (S-*) | [ ] | |
| Staging Phase 1 | May 12 | QA | Run performance tests (B-*, 4.2-4.4) | [ ] | |
| Staging Phase 1 | May 12 | QA | Localization review (L-TERM-*, L-NUM-*, L-LAYOUT-*) | [ ] | |
| Staging Phase 1 | May 12 | QA | Compile defect log, flag blockers | [ ] | Release QA Engineer Alpha |
| Staging Review | May 13-14 | CTO + QA | Triage defects, prioritize fixes | [ ] | CTO |
| Staging Fixes | May 15-17 | Engineering | Fix critical/high issues | [ ] | Calculator Engineer Alpha/Beta |
| Production Phase 2 | May 18 | QA | Spot verification on prod (10% test cases) | [ ] | |
| Production Phase 2 | May 18 | CMO | SEO monitoring (GSC, CTR, impressions) | [ ] | |
| Production Phase 2 | May 19 | QA | Final sign-off, compile report | [ ] | Release QA Engineer Alpha |

### 6.3 Pass/Fail Criteria

**PASS** (Green):
- 95%+ of test cases pass or N/A (not applicable)
- No critical defects (calculator broken, language toggle non-functional, hreflang missing)
- No high-severity regressions vs. Thai-only baseline
- SEO signals intact (hreflang, canonical, OG tags all present and correct)
- Mobile layout acceptable across device matrix (no major overflow)
- Translation quality acceptable (no obvious errors, glossary adherence)

**CONDITIONAL PASS** (Yellow):
- 90-95% of test cases pass
- 1-3 medium-severity issues found and scheduled for fix
- Minor UX polish issues (button sizing, spacing, alignment)
- Performance within 15% of baseline (instead of 10%)
- Requires post-launch monitoring and quick-fix process

**FAIL** (Red):
- < 90% of test cases pass
- 1+ critical defects (calculator broken, language toggle fails, SEO compromised)
- Major layout issues on mobile (text overflow, unreadable, inputs unusable)
- Performance degradation > 20%
- Translation errors (mixed languages, missing strings, obvious mistakes)
- **Action**: Do not release; escalate to CTO for prioritized fix

### 6.4 Defect Severity Levels

| Severity | Definition | Example | Impact |
|----------|-----------|---------|--------|
| Critical | Calculator is broken or non-functional | Math returns wrong result; language toggle doesn't work | Blocks release |
| High | Major feature or UX significantly impaired | hreflang tags missing; text overflow on mobile | Should block release |
| Medium | Feature works but with issues | Button padding off; translation typo; minor layout shift | Schedule for fix, can launch with monitoring |
| Low | Polish or minor cosmetic issue | Spacing could be tighter; consistency improvement | Post-launch improvement |

### 6.5 Sign-Off Report Template

```
# Bilingual Calculator QA Sign-Off Report

Date: [May 19, 2026]
Tested By: Release QA Engineer Alpha
Reviewed By: [CTO name]

## Summary
- Staging testing: [PASS/CONDITIONAL/FAIL]
- Production verification: [PASS/CONDITIONAL/FAIL]
- Overall recommendation: [RELEASE / RELEASE WITH MONITORING / HOLD]

## Test Coverage
- Test cases executed: [X / Y] (ZZ%)
- Pass rate: [XX%]
- Critical issues: [N]
- High issues: [N]
- Medium issues: [N]
- Low issues: [N]

## Key Findings
- [Summary of major findings, blockers, performance impact]

## SEO Status
- hreflang: ✓ Verified (all 6 calculators bidirectional)
- Canonical: ✓ Verified (no duplicates)
- OG/Twitter: ✓ Verified (both languages)
- Schema: ✓ Verified (all calculators)
- Mobile viewport: ✓ Verified

## Performance
- LCP: [Thai: X.Xs, Bilingual: X.Xs, Change: ±X%]
- CLS: [Thai: X, Bilingual: X, Status: ✓ No regression]
- Bundle size: [+X% vs baseline, within limits]

## Accessibility
- Keyboard navigation: ✓ Pass
- Screen reader: ✓ Pass (tested with NVDA/JAWS)
- Mobile touch targets: ✓ Pass (44x44 px min)

## Localization Quality
- Translation accuracy: [Spot-check pass, Y% glossary adherence]
- Number formatting: ✓ Correct locale-aware formatting
- Text overflow: ✓ No layout issues on mobile

## Open Items
- [Issue ID]: [Description, assigned to, due date]
- [Issue ID]: [Description, assigned to, due date]

## Approval
- [X] QA verified complete
- [X] CTO approved
- [X] Ready for production launch

Sign-off: [Release QA Engineer Alpha signature / timestamp]
```

---

## Part 7: Appendices

### A. Core Calculator Information

| Calculator | Thai URL | English URL | Key Inputs | Key Outputs | Formula Reference |
|------------|----------|-------------|------------|-------------|-------------------|
| Electricity Bill | /คำนวณ-electricity-bill | /en/calculator/electricity-bill | kWh, rate | Total THB | Thai electricity rate (EGAT) |
| Land Tax | /คำนวณ-land-tax | /en/calculator/land-tax | Property value | Tax THB, % | Thai land tax brackets |
| Loan Payment | /คำนวณ-loan-payment | /en/calculator/loan-payment | Loan amount, rate, term | Monthly payment, amortization | Standard loan math |
| Overtime Pay | /คำนวณ-overtime-pay | /en/calculator/overtime-pay | Hours, rate, shift type | Total pay | Thai labor law multipliers |
| Property Transfer Tax | /คำนวณ-property-transfer-tax | /en/calculator/property-transfer-tax | Transaction value | Tax, fees | Thai stamp duty + legal fees |
| Unit Converter | /คำนวณ-unit-converter | /en/calculator/unit-converter | Value, unit from, unit to | Converted value | Conversion factors |

### B. Testing Tools & Resources

| Tool | Purpose | Where to Get |
|------|---------|--------------|
| NVDA | Screen reader testing (Windows) | https://www.nvaccess.org/ |
| JAWS | Screen reader testing (Windows, premium) | https://www.freedomscientific.com/products/software/jaws/ |
| Chrome DevTools | Performance, accessibility, layout | Built into Chrome |
| WebPageTest | Core Web Vitals, waterfall analysis | https://www.webpagetest.org/ |
| Google PageSpeed Insights | CWV + recommendations | https://pagespeed.web.dev/ |
| Google Rich Results Test | Schema markup validation | https://search.google.com/test/rich-results |
| Google Search Console | hreflang, mobile usability, coverage | https://search.google.com/search-console/ |
| axe DevTools | Accessibility audit | https://www.deque.com/axe/devtools/ |
| WAVE (WebAIM) | Accessibility scan | https://wave.webaim.org/ |

### C. Approved Glossary Terms

**[Link to approved glossary from CAL-2455 or Thai Content Specialist Alpha]**

Key terms to verify per calculator:
- Electricity: "kWh", "THB", "ค่าไฟฟ้า"
- Land: "ค่าปีที่ดิน", "moo", "ตารางวา"
- Loan: "เงินกู้", "อัตราดอกเบี้ย", "เดือน"
- Overtime: "โอที", "ค่าจ้าง", "เวลาทำงาน"
- Tax: "ภาษี", "ค่าแสตมป์", "ค่าธรรมเนียม"
- Units: "เมตร", "กิโลกรัม", "นิ้ว", "ปอนด์"

---

## Conclusion

This QA test matrix provides comprehensive coverage for the bilingual (Thai/English) calculator launch. The matrix is designed to be:

1. **Executable**: Clear test cases with expected behaviors and verification methods
2. **Measurable**: Pass/fail criteria, performance thresholds, test coverage tracking
3. **Risk-focused**: Prioritizes calculator correctness, mobile quality, SEO integrity, and translation accuracy
4. **Timeline-aligned**: Integrated with staging (May 10-12) and production (May 18-19) testing phases
5. **Sign-off ready**: Includes defect triage, severity levels, and formal approval process

**Prepared for**: Calculator Thailand English Launch — May 2026  
**Target launch**: May 30, 2026 (all 6 calculators + bilingual content live)  
**Success criteria**: All calculators functional in both languages, SEO signals intact, mobile quality maintained, no regressions

---

**Document History:**
- 2026-04-28: Version 1.0 created for review and approval
