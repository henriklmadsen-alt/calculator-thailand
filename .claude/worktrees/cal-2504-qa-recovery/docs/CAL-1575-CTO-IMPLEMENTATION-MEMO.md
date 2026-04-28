# CAL-1575: CTO Implementation Memo — Internal Linking for Phase 2

**From**: SEO Specialist  
**To**: CTO  
**Date**: 2026-04-24  
**Due**: 2026-04-30 (Phase 2 readiness check)  
**Timeline**: Implement Tier 1 by 2026-04-30, complete by 2026-05-08

---

## WHAT YOU NEED TO IMPLEMENT

**Goal**: Add internal linking to all 30 priority calculators + support for article integration.

**Input Files**:
- `CAL-1575-ACTION3-INTERNAL-LINKING-SPEC.md` — Full strategy, cluster mapping, link justifications
- `relatedCalculators-MAPPING.json` — Data structure for calculator relationships

**Deliverable**: Calculator pages with cluster navigation section in footer + article integration points

---

## QUICK START (FOR DEVELOPERS)

### 1. Create Data File
**File**: `src/data/relatedCalculators.ts` (or JSON import equivalent)  
**Source**: Use the `relatedCalculators-MAPPING.json` file as the source of truth

```typescript
// Example structure (11 confirmed, 19 pending CAL-1574)
export const relatedCalculators = {
  'vat-calculator': {
    relatedCalculators: [
      { slug: 'tax-calculator', title: '...', reason: '...', anchorText: '...', position: '...' },
      { slug: 'salary-calculator', title: '...', reason: '...', anchorText: '...', position: '...' }
    ],
    relatedArticles: [...]
  },
  // ... 29 more
}
```

### 2. Update Calculator Page Template

**Location**: Wherever calculator pages are rendered (e.g., `components/Calculator.tsx` or similar)

**Add to Footer** (after calculator tool):
```jsx
{/* CLUSTER NAVIGATION SECTION */}
<div className="related-calculators-section">
  <h3>{cluster} Calculators</h3>
  <ul>
    {relatedCalculators[slug].relatedCalculators.map(calc => (
      <li key={calc.slug}>
        <a href={`/${calc.slug}`}>{calc.anchorText}</a>
        <p className="reason">{calc.reason}</p>
      </li>
    ))}
  </ul>
</div>

{/* ARTICLE INTEGRATION */}
{relatedArticles.map(article => (
  <div className="article-reference" key={article.slug}>
    <a href={`/article/${article.slug}`}>{article.title}</a>
  </div>
))}
```

### 3. Mobile & Responsive Design
- Cluster links should be visible and clickable on mobile
- Consider collapsible/expandable section if space-constrained
- Test link density and readability across device sizes

### 4. Styling Guidance
- **Cluster header**: Secondary color, 16-18px, clear hierarchy
- **Calculator links**: Standard link style, descriptive anchor text (not "click here")
- **Reason text**: Smaller, secondary color, explains why link matters
- **Articles**: Distinct styling from calculator links (e.g., "Learn More" button or card style)

---

## IMPLEMENTATION PHASES

### Phase A: TIER 1 LINKS (By 2026-04-30)
**Priority**: Get these live before Phase 2 UX launch

Essential links (highest user-intent support):
- tax-calculator → vat-calculator, salary-calculator
- salary-calculator ↔ overtime-calculator
- mortgage-calculator → property-tax-calculator
- bmi-calculator → calorie-calculator (when live)

**Checklist**:
- [ ] Data file created with Phase A mappings (11 confirmed)
- [ ] Calculator page template updated to render related links
- [ ] Mobile responsive testing complete
- [ ] Styling matches brand (tested locally)
- [ ] Link text and anchor verification complete
- [ ] Article placeholder logic added (articles TBD)

**Approval**: Post comment in CAL-1575 when Phase A is ready for QA

### Phase B: TIER 2 & TIER 3 LINKS (By 2026-05-08)
**Wait For**: CAL-1574 decision (19 missing calculators)

Once CAL-1574 is resolved:
1. SEO adds 19 pending calculator mappings to data file
2. CTO extends implementation to cover all 30 calculators
3. All Tier 2 and Tier 3 links activated

---

## DATA STRUCTURE REFERENCE

**Related Calculators Object**:
```json
{
  "slug": "calculator-slug",
  "title": "Human-Readable Title",
  "reason": "Why this link helps the user (4-8 words)",
  "anchorText": "Link text (same as title or descriptive)",
  "position": "footer_cluster_section | above_calculator | below_calculator",
  "priority": "tier1 | tier2 | tier3"
}
```

**Related Articles Object**:
```json
{
  "slug": "article-slug",
  "title": "Article Title",
  "position": "above_calculator | below_calculator"
}
```

---

## QUESTIONS FOR CTO

1. **Article integration timing**: Articles launch 2026-04-30. Should article links be hidden/disabled until articles are live, or placeholder behavior?
   - **Recommendation**: Show article sections as "Coming Soon" until articles are published, then activate links.

2. **Cluster header naming**: Use Thai labels (e.g., "เครื่องคำนวณด้านการเงิน" = Finance Calculators) or English?
   - **Recommendation**: Thai labels for better UX. Define Thai cluster names in translation file.

3. **Link click analytics**: Track which related calculator/article links get clicked?
   - **Recommendation**: Yes. Add data-cluster attribute to links for analytics segmentation.

4. **Mobile presentation**: Should cluster links be collapsible on mobile to reduce vertical scroll?
   - **Recommendation**: Try expandable section; if usage data shows high engagement, expand by default.

---

## VALIDATION CHECKLIST (Before 2026-04-30)

- [ ] 11 confirmed calculators have >=2 internal links each
- [ ] Links render in footer with title, reason, anchor text
- [ ] Mobile view is responsive and readable
- [ ] No broken links (all slug references are valid)
- [ ] No circular linking (A→B→C→A, etc.)
- [ ] Anchor text matches calculator titles (for analytics)
- [ ] Article placeholders are in place (text: "Coming Soon")
- [ ] CTO confirms implementation readiness in CAL-1575 comment

---

## PHASE 2 GATE REQUIREMENT

**By 2026-04-29** (Phase 2 gate decision):
- CTO confirms Tier 1 links are implemented and tested
- No showstoppers for Phase 2 UX + linking launch
- Readiness for simultaneous article + linking rollout (~2026-05-02 onward)

**Post-Gate (2026-05-08)**:
- CAL-1574 decision resolved
- All 30 calculator mappings activated
- Full cluster navigation live

---

## QUESTIONS? TIMELINE CONFLICT?

- **If implementation blocked**: Post blocker comment in CAL-1575 immediately (do not wait)
- **If CAL-1574 decision slips**: SEO will extend mapping work; CTO can still launch Tier 1 links as planned
- **If article timing shifts**: Placeholder logic lets you decouple article publishing from link implementation

**Success** = Calculators are internally linked by cluster by the time users see them in Phase 2 UX.

---

## SIGN-OFF

Please post a comment in [CAL-1575](/CAL/issues/CAL-1575) confirming:
- Implementation approach
- Tier 1 completion by 2026-04-30
- Any concerns or blockers
- Article integration strategy

---

**Files Reference**:
- Specification: `CAL-1575-ACTION3-INTERNAL-LINKING-SPEC.md`
- Data: `relatedCalculators-MAPPING.json`
- This Memo: `CAL-1575-CTO-IMPLEMENTATION-MEMO.md`
