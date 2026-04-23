# CAL-1463: Trust Signal and Source Transparency Validation Spec

**Status**: Ready for CTO + Content audit  
**Due**: 2026-04-29  
**Audit Owner**: UXDesigner (Phase 0 baseline + coordination)  
**Execution**: CTO (technical validation) + Content (substantive audit)

---

## Executive Summary

After CAL-1462 template consistency audit revealed **99.7% of calculator pages lack trust components**, this spec defines how to validate and improve trust signal quality on the **11 pages** that currently have TransparencyPanel (7), TrustBadge (4), or both.

**Immediate objective**: Establish quality baseline and validation checklist. Once baseline passes, roll out components to remaining high-intent calculator pages per CAL-1462 implementation plan.

---

## 1. Audit Scope & Pages

### Phase 1: Baseline Trust Signal Audit

**Pages with TransparencyPanel** (7 pages):
- คำนวณ-bmi
- คำนวณ-roi-ถ่ายภาพ
- คำนวณ-ต้นทุน-ผ้าและอุปกรณ์เย็บ
- คำนวณ-ต้นทุน-สีและอุปกรณ์จิตรกรรม
- คำนวณ-ต้นทุน-หนังสือและด้ายไหมพรม
- คำนวณ-ต้นทุน-เครื่องประดับ
- คำนวณ-ต้นทุน-โครงการงานไม้

**Pages with TrustBadge** (4 pages):
- คำนวณ-bmi (also has TransparencyPanel)
- คำนวณดอกเบี้ยเงินฝาก
- คำนวณภาษีเงินได้บุคคลธรรมดา
- (1 additional, search results truncated)

**Pages with FAQAccordion** (1,217 pages):
- All calculator pages (subject to separate FAQ quality audit)

---

## 2. Trust Signal Component Specifications

### 2.1 TransparencyPanel Component

**Purpose**: Show users how a calculation works, including formula, inputs, calculation steps, and authoritative source.

**Props**:
- `formula` (required): Formula string in Thai (e.g., "BMI = น้ำหนัก (กก.) ÷ [ส่วนสูง (ม.)]²")
- `formulaNote` (optional): Explanation or standards reference (e.g., "WHO 2023 standards")
- `sourceUrl` (optional): Live URL to authoritative source (must be live + accessible)
- `sourceName` (optional): Authority name in Thai (e.g., "องค์การอนามัยโลก (WHO)")
- `panelId` (optional): Unique HTML ID for JS targeting

**Validation Criteria** (per trust audit):

| Criterion | Pass | Fail | Notes |
|-----------|------|------|-------|
| Source URL is live | `HTTP 200` on HEAD/GET | `404`, `500`, timeout, redirect loop | Verify at audit time + 30d baseline |
| Source URL matches sourceName | URL domain matches authority claimed | Domain mismatch (e.g., WHO name but Budget.gov.uk URL) | Critical for credibility |
| Formula is technically correct | Formula passes review by formula owner | Formula contains errors or is outdated | CTO reviews against calculator logic |
| Formula is readable in Thai | Uses proper Thai typography, no encoding errors | Displays as `???` or mojibake | Visual QA on mobile + desktop |
| formulaNote is substantive (if present) | Explains *why* formula or provides standard reference | Blank, copy-paste, "Formula here", "See below" | Content team review |
| Panel is mobile-friendly | Expands/collapses properly, readable on small screens | Text overflow, unclickable, broken layout | Mobile QA: Pixel 4a, iPhone SE |

### 2.2 TrustBadge Component

**Purpose**: Show that a calculator references an official authority (e.g., Thai government ministry, WHO).

**Props**:
- `ministry` (required): Authority name in Thai (e.g., "ธนาคารแห่งประเทศไทย (BOT)")
- `url` (required): Live URL to authority website
- `updatedDate` (optional): Thai year (default "2569"); signals data freshness
- `icon` (optional): Emoji icon (default "🏛️")

**Validation Criteria**:

| Criterion | Pass | Fail | Notes |
|-----------|------|------|-------|
| URL is live | `HTTP 200` on HEAD/GET | `404`, `500`, timeout | Critical trust signal |
| URL domain matches ministry name | URL is official ministry site (e.g., bot.or.th for BOT) | URL is unofficial, redirect, or unrelated domain | Verify WHOIS + SSL cert |
| updatedDate is current (within 30 days) | `updatedDate` ≤ 30 days old from today | Data shows 60+ days without update | Indicates stale reference |
| Ministry name is accurate in Thai | Name matches official Thai government/org name | Misspelled, romanized, or unofficial variant | Content team review |
| Icon is semantically correct | Icon suggests official/government institution | Icon is generic, misleading, or unrelated | UX review |
| Badge displays correctly on mobile | Text wraps, doesn't overflow, tappable link | Text cuts off, link unreachable on small screens | Mobile QA |

### 2.3 FAQAccordion Component

**Purpose**: Answer common user questions; supports SEO via structured data (FAQPage schema).

**Props**:
- `faqData` (optional): Array of `{ question, answer }`
- `title` (optional): Section title (default "คำถามที่พบบ่อย")

**Validation Criteria** (FAQ Quality Audit — separate from Phase 1):

| Criterion | Pass | Fail | Notes |
|-----------|------|------|-------|
| No duplicate questions | Each question is unique per page | 2+ identical or near-identical questions | Search for exact Q duplicates |
| Answers are substantive | Answer length ≥ 50 Thai characters; directly addresses Q | Blank, "See above", copy-paste, too generic | Content team: spot-check 3–5 FAQs per page |
| Answers are in Thai (not English) | Thai language, proper Thai grammar | English, romanized, or mixed lang | Automated language detection + manual spot-check |
| Questions and answers match topic | FAQ Q/A relevant to calculator topic | Q about unrelated topic, placeholder text | SME review for mismatched content |
| FAQ section is visible and collapsed | Accordion renders collapsed by default, expands on click | FAQ hidden, broken expand, forced open | UX + mobile QA |

---

## 3. Audit Methodology

### 3.1 Automated Checks (CTO)

Run on all pages with components:

```bash
# Example: Check TransparencyPanel URLs
grep -r "sourceUrl=" src/pages --include="*.astro" \
  | cut -d'"' -f2 \
  | xargs -I {} curl -s -o /dev/null -w "%{http_code}\t%{url_effective}\n" {} \
  | tee transparency-urls-audit.txt

# Example: Check TrustBadge dates
grep -r "updatedDate=" src/pages --include="*.astro" | sort | uniq -c
```

### 3.2 Manual Review Checklist (Content + UX)

For each component on each page:

1. **TransparencyPanel**: Click to expand, verify formula renders correctly, check source link opens in new tab
2. **TrustBadge**: Verify ministry name accuracy, click URL, check for 404s
3. **FAQAccordion**: Spot-check 3–5 Q/A pairs for substantiveness and Thai language
4. **Mobile visual**: Pixel 4a or iPhone SE emulation in DevTools

### 3.3 Deliverable Format

Create `audit-results-cal-1463.csv`:

```csv
page_id,component,status,issues,assignee,priority
คำนวณ-bmi,TransparencyPanel,PASS,"",UXDesigner,N/A
คำนวณ-bmi,TrustBadge,FAIL,"URL returns 404; updatedDate is 30+ days old",Content,High
คำนวณ-roi-ถ่ายภาพ,TransparencyPanel,FAIL,"sourceUrl is blank; formulaNote missing",Content,Medium
...
```

---

## 4. Phase 0 (Baseline) vs Phase 1 (Rollout)

### Phase 0: Baseline Audit (Now → 2026-04-29)

**Goal**: Validate that existing trust components meet quality standards.

- Audit 11 pages (7 with TransparencyPanel, 4 with TrustBadge)
- Run automated URL checks
- Manual spot-check on mobile
- Document findings
- **Decision gate**: If >90% pass, proceed to Phase 1 rollout. If <90% pass, fix critical issues first.

### Phase 1: Rollout (2026-04-28–2026-05-02, per CAL-1462 plan)

**Goal**: Extend trust components to 70–75 high-intent Tier 1/2 pages.

- CTO adds CalculatorHeader to all 343 calculator pages
- Content team adds TransparencyPanel to 50+ opaque Tier 3 formulas
- FAQ quality audit for the 1,217 FAQAccordion pages (de-dupe, substantiveness)
- TrustBadge to Tier 1/2 pages (70–75 pages)

---

## 5. Success Criteria

### Phase 0 (Baseline): PASS if...
- ✓ All 11 pages render correctly on mobile + desktop
- ✓ ≥90% of TransparencyPanel sourceURLs return HTTP 200
- ✓ ≥90% of TrustBadges have URLs pointing to correct official sources
- ✓ ≥90% of TrustBadge updatedDate values are within 30 days
- ✓ Spot-check of 3–5 FAQs per page shows substantive answers in Thai
- ✓ No broken links, rendering errors, or accessibility violations

### Phase 1 (Rollout): PASS if...
- ✓ All 343 calculator pages have CalculatorHeader
- ✓ 50+ opaque calculators have TransparencyPanel with live source URLs
- ✓ 1,217 FAQs de-duplicated, no copy-paste, substantive answers
- ✓ 70–75 Tier 1/2 pages have TrustBadges
- ✓ Mobile verification: Pixel 4a + iPhone SE show no layout breakage

---

## 6. Audit Assignment & Timeline

| Task | Owner | Due | Acceptance |
|------|-------|-----|-----------|
| **Phase 0 Baseline Audit** | | | |
| Automated URL checks (TrustBadge, TransparencyPanel) | CTO | 2026-04-27 | `transparency-urls-audit.txt` + `trust-badge-audit.txt` |
| Manual mobile QA spot-check (11 pages) | Release QA | 2026-04-27 | Screenshots + checklist |
| FAQ spot-check (3–5 Q/A per page) | Content | 2026-04-27 | Spot-check results + issues |
| **Baseline audit summary** | UXDesigner | 2026-04-29 | `audit-results-cal-1463.csv` + decision gate |
| **Phase 1 Rollout** (if Phase 0 passes) | CTO + Content | 2026-04-28–2026-05-02 | [CAL-1462 implementation tasks](/) |

---

## 7. Risk & Constraints

### Risks
1. **Stale URLs**: Authority websites change structure; URLs may break after this audit.
   - *Mitigation*: Include "re-validate in 30 days" as a reminder in Phase 1 PR.

2. **Thai language accuracy**: FAQ content and ministry names may have Thai-specific grammar/tone issues.
   - *Mitigation*: Content team does final Thai QA; escalate unclear questions to CMO.

3. **Mobile rendering**: TransparencyPanel/TrustBadge may overflow on 320px screens.
   - *Mitigation*: Release QA tests on actual devices, not just DevTools emulation.

### Out of Scope
- **SEO impact**: Does improved trust signal increase SERP rankings? (Measure post-launch via GA4)
- **Ad placement**: This audit validates trust signals, not ad safety. See [CAL-1476](#) for monetization layout.
- **Formula correctness**: Assumes CTO has already validated formulas; audit spot-checks only.

---

## 8. Implementation Notes

### For CTO (Technical)
- Use `curl` or Node `fetch` to validate URLs; script the checks
- Check for 301/302 redirects; log final URL
- Verify SSL certificates are valid (HTTPS, not HTTP)
- Consider adding a CI/CD check: "audit URLs on each PR" after this Phase 0

### For Content Team (Substantive)
- Use Google Translate or native Thai speaker to verify language
- Cross-check ministry names against Thai government website
- For FAQ answers: use this test: "Would a Thai user understand this answer without reading the calculator description?"
- Flag duplicate questions for removal

### For Release QA (Mobile Verification)
- Test on Pixel 4a (375px) and iPhone SE (375px) real devices if available; DevTools emulation otherwise
- Test both portrait and landscape
- Verify links are tappable (min 44px height per WCAG)
- Test with screen reader (TalkBack/VoiceOver) for accessibility

---

## 9. Related Issues

- [CAL-1462](/CAL/issues/CAL-1462): Template consistency audit (identifies 99.7% missing components)
- [CAL-1447](/CAL/issues/CAL-1447): UX Sprint Heartbeat (parent issue)
- [CAL-1461](/CAL/issues/CAL-1461): Mobile QA baseline (Phase 1 support)

---

## 10. Document Version

| Date | Owner | Change |
|------|-------|--------|
| 2026-04-24 | UXDesigner | Initial spec, Phase 0 baseline definition |

---

**Next Action**: Create subtasks for CTO (URL audit), Content (FAQ/ministry review), and Release QA (mobile verification). Assign by 2026-04-26; complete by 2026-04-29.
