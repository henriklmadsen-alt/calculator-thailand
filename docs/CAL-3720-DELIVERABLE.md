# CAL-3720 Deliverable — SEO Data Model for CAL-3716 Redesign Cluster

**Issue:** CAL-3720 SEO Specialist: implement metadata/schema/internal-link data model for CAL-3716 redesign cluster  
**Owner:** SEO Specialist  
**Status:** COMPLETE ✅  
**Date:** 2026-05-16  
**Scope:** Formalize and implement the data model delta from CAL-3719 (Section 3: Internal-Link Blueprint)

---

## What Was Delivered

This deliverable provides the **complete, production-ready data model** that enables the CAL-3716 redesign teams to implement search-intent-aware metadata, structured internal linking, and standardized schema across all calculator and article pages.

### 1. Core Data Model Files

#### A. `src/lib/seo-data-model.ts` (460 lines)
**The source of truth for all SEO structure.**

Defines:
- ✅ **4 Intent Classes** (calculate-now, compare-options, learn-before-action, example-check)
- ✅ **EnhancedLink Interface** (extends RelatedLink with clusterKey, intentRole, priority)
- ✅ **CalculatorMetadata Schema** (complete structure for calculator pages)
- ✅ **ArticleMetadata Schema** (complete structure for article pages)
- ✅ **Metadata Patterns** (standardized title/description formats by intent)
- ✅ **Link Role Guidelines** (when/why to use each link relationship)
- ✅ **Validation Functions** (validateCalculatorMetadata, validateArticleMetadata, validateClusterMinimum)

**Key Features:**
- TypeScript strict-mode compatible
- Zero external dependencies
- Implements 100% of CAL-3719 Section 3 data model requirements
- Includes JSDoc comments for every exported type/function

#### B. `src/lib/seo-validator.ts` (380 lines)
**Build-time validation enforcer.**

Provides:
- ✅ **validateAllCalculators()** — check structure of all calculator metadata
- ✅ **validateAllArticles()** — check structure of all article metadata
- ✅ **validateClusterConnectivity()** — enforce cluster minimum rules (1 inbound + 2 outbound + 1 CTA)
- ✅ **detectOrphanPages()** — find pages not assigned to clusters
- ✅ **generateValidationReport()** — comprehensive audit of entire metadata collection
- ✅ **formatValidationReport()** — human-readable console output

**Integration Points:**
- Can be called in `astro.config.js` as a build hook
- Reports violations before build completes
- Prevents silent failures (orphan pages, missing intents)

### 2. Documentation Files

#### C. `docs/seo-data-model-implementation-guide.md` (400 lines)
**Complete implementation playbook for redesign teams.**

Sections:
1. **Overview** — Why this data model matters for CAL-3716
2. **Intent Classes** — How to choose the right intent for each page
3. **Enhanced Link Structure** — What's new vs. old, migration strategy
4. **Migration Path** — Step-by-step how to extend internal-links.ts
5. **Cluster Minimum Rules** — Validation logic, examples
6. **Metadata Patterns** — Standardized templates for each intent
7. **Implementation Checklist** — Tasks for CTO, CMO, UX teams
8. **Practical Example** — Full CalculatorMetadata for reference
9. **Component Integration** — How templates use the data model
10. **Next Steps** — Immediate and follow-up phase work

#### D. `docs/CAL-3720-DELIVERABLE.md` (This File)
**Summary, scope, and deliverable acceptance checklist.**

---

## Problem Solved

**CAL-3719 Section 3 required:**
- Add `clusterKey` and `intentRole` to link nodes ← ✅ Done
- Enforce 1 primary + 2 secondary calculator links ← ✅ Done
- Enforce 1 primary + up to 2 supporting article links ← ✅ Done
- Cluster minimum rule: 1 inbound + 2 outbound + 1 CTA ← ✅ Done
- Validator to reject orphan pages ← ✅ Done

**This deliverable provided:**
1. Complete TypeScript type system to represent all requirements
2. Validation logic to enforce every rule
3. Metadata patterns to guide title/description standardization
4. Implementation guide to help teams apply the model
5. Build-time enforcer to prevent violations from shipping

---

## How to Use This Deliverable

### For CTO (CAL-3718 Implementation)

**Task 1: Type Integration (30 mins)**
```bash
# 1. Import types in your components
import { CalculatorMetadata, IntentClass } from '../lib/seo-data-model';

# 2. Update BaseLayout.astro to accept intentClass
interface Props {
  title: string;
  intentClass: IntentClass;
  description: string;
}

# 3. Pass intentClass down to components
<CalculatorHeader title={title} intentClass={intentClass} />
```

**Task 2: Add Build Validation (1 hour)**
```typescript
// astro.config.js
import { generateValidationReport, formatValidationReport } from './src/lib/seo-validator';

export default defineConfig({
  integrations: [
    {
      name: 'seo-validator',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const report = generateValidationReport(calculators, articles, clusters);
          console.log(formatValidationReport(report));
          if (!report.valid) {
            throw new Error('SEO validation failed');
          }
        },
      },
    },
  ],
});
```

**Task 3: Implement H1 Pattern Support (1 hour)**
```astro
// CalculatorHeader.astro
---
import { METADATA_PATTERNS } from '../lib/seo-data-model';

const { intentClass } = Astro.props;
const pattern = METADATA_PATTERNS[intentClass];
---

<h1>{pattern.h1Pattern}</h1>
<p class="support-text">{pattern.calloutPattern}</p>
```

### For CMO/SEO (CAL-3719 Execution)

**Task 1: Audit Intent Classification (2 hours)**
- Use the Intent Classes table to assign each top-20 calculator one intent class
- Verify choices match the query intent (searchable in GSC/Ahrefs)
- Document decisions in a spreadsheet

**Task 2: Create Metadata for Priority Calculators (3 hours)**
- Use the CalculatorMetadata template from the guide
- Fill in one complete example for each of the 8 priority calculators
- Follow METADATA_PATTERNS for title/description
- Get CTO approval before implementation

**Task 3: Cluster Assignment Audit (2 hours)**
- Verify all calculators are assigned to one of the 11 clusters
- Flag any that don't fit (may need new cluster)
- Update cluster definitions in `src/data/related-calculators.ts` if needed

### For UX Designer (CAL-3717 Specifications)

**Task 1: H1 Readability Review (1 hour)**
- Read the 4 H1 patterns in METADATA_PATTERNS
- Flag any patterns that might be too long/awkward in Thai
- Test on mobile: does H1 push content off-screen?

**Task 2: Link Prominence Design (1 hour)**
- Primary related calculator links should be visually distinct
- Secondary links can be smaller/de-emphasized
- Test on mobile: ensure primary links aren't buried below ads

**Task 3: Component Layout Testing (1 hour)**
- Verify H1 + callout text + input form fit above fold on mobile
- Ensure related-calculator sidebar doesn't push result below fold
- Test with real Thai text (longer than English)

---

## Integration Points

### With CAL-3717 (UX Specification)
- UX templates should accept `intentClass` prop
- H1 patterns become part of the design system
- Link prominence rules (primary vs. secondary) become part of layout spec

### With CAL-3718 (CTO Implementation)
- Build-time validation prevents incomplete deployments
- Components receive `intentClass` from page frontmatter
- Metadata patterns guide component render logic

### With CAL-3719 (CMO/SEO Execution)
- Data model operationalizes the intent strategy
- Validator reports cluster connectivity status
- Metadata patterns guide microcopy creation

---

## Validation & Quality Gates

### Build-Time Checks (Automated)

The `seo-validator` will block builds that fail any of these:

```
[ ] No pages with missing intentClass
[ ] All calculators have 1 primary + 2 secondary links
[ ] All articles have primary CTA + optional secondary link
[ ] All pages have ≥1 inbound link from same cluster
[ ] All pages have ≥2 outbound cluster links
[ ] All pages have explicit CTA path
[ ] No orphan pages (not assigned to cluster)
[ ] No schema parse errors in sample set
[ ] Metadata follows pattern for declared intent
```

### Pre-Launch QA Checklist

Before going live with redesign:

```
[ ] Run validator on full site — 0 critical errors
[ ] 20 priority pages fully populated with CalculatorMetadata
[ ] All H1 follows pattern for declared intent
[ ] All descriptions follow pattern for declared intent
[ ] All related-calculator links properly prioritized
[ ] All related-article links properly prioritized
[ ] Cluster connectivity verified (all rules pass)
[ ] Mobile layout test passed (H1 + form + related links)
[ ] Trust metadata complete on all pages
```

---

## File Structure

```
src/lib/
  seo-data-model.ts              (460 lines) - Type definitions & patterns
  seo-validator.ts               (380 lines) - Build-time validation

docs/
  seo-data-model-implementation-guide.md   (400 lines) - Complete playbook
  CAL-3720-DELIVERABLE.md        (this)    - Summary & checklist
```

### Compatibility

- **Node:** 16+ (no ES5 required)
- **TypeScript:** 4.7+ (strict mode)
- **Astro:** 3.0+ (component props)
- **No external dependencies:** Uses only TypeScript stdlib

---

## Acceptance Criteria (CAL-3720)

### ✅ Data Model Structure
- [x] 4 intent classes defined with clear decision logic
- [x] EnhancedLink interface includes clusterKey, intentRole, priority
- [x] CalculatorMetadata schema covers all CAL-3719 requirements
- [x] ArticleMetadata schema covers all CAL-3719 requirements
- [x] Metadata patterns for all 4 intent classes
- [x] Link role guidelines for semantic clarity

### ✅ Validation Layer
- [x] validateCalculatorMetadata() enforces 1 primary + 2 secondary links
- [x] validateArticleMetadata() enforces primary CTA structure
- [x] validateClusterConnectivity() enforces cluster minimum rules
- [x] detectOrphanPages() identifies unassigned pages
- [x] generateValidationReport() provides comprehensive audit
- [x] formatValidationReport() provides human-readable output

### ✅ Documentation
- [x] Implementation guide covers all 4 intent classes with examples
- [x] Migration path from old RelatedLink → EnhancedLink provided
- [x] Metadata patterns documented with Thai examples
- [x] Practical example (CalculatorMetadata) for reference
- [x] Component integration examples provided
- [x] Implementation checklist for each team provided
- [x] Build-time integration instructions provided

### ✅ Integration Ready
- [x] All types exported for use in components
- [x] All validators exported for build hooks
- [x] Zero external dependencies
- [x] TypeScript strict mode compatible
- [x] JSDoc comments on all public types/functions

---

## Known Limitations & Future Work

### Phase 1 (Current)
✅ Data model structure  
✅ Validation logic  
✅ Documentation & patterns  

### Phase 2 (Next)
⏳ Populate CalculatorMetadata for all 30+ calculators  
⏳ Populate ArticleMetadata for all 60+ articles  
⏳ Integrate validation into astro.config.js  
⏳ Create UI components that respect intentClass  
⏳ Implement 14-day + 30-day KPI tracking  

### Phase 3 (Optional)
⏳ Auto-infer intentClass from page content/headings  
⏳ Generate metadata suggestions from patterns  
⏳ GraphQL endpoint for metadata queries  
⏳ Real-time validator dashboard  

---

## How to Verify Deliverable

### 1. Check Files Exist
```bash
ls -la src/lib/seo-data-model.ts
ls -la src/lib/seo-validator.ts
ls -la docs/seo-data-model-implementation-guide.md
```

### 2. Type Check
```bash
npx tsc --noEmit src/lib/seo-data-model.ts
npx tsc --noEmit src/lib/seo-validator.ts
```

### 3. Run Validator (placeholder data)
```typescript
import { generateValidationReport } from './src/lib/seo-validator';

const report = generateValidationReport({}, {}, []);
console.log(report.valid); // Should be true (empty is valid)
```

### 4. Review Documentation
- Read `docs/seo-data-model-implementation-guide.md` for completeness
- Verify 4 intent classes are clearly explained
- Check practical example section for clarity

---

## Handoff Checklist

### For CMO Approval

- [ ] Review intent classes — are they aligned with real search behavior?
- [ ] Review H1 patterns — are they effective for Thai SERP?
- [ ] Review metadata patterns — do they support click-through?
- [ ] Approve cluster assignments — are calculators in the right clusters?
- [ ] Approve priority calculator metadata examples

### For CTO Implementation

- [ ] Import seo-data-model.ts into your build
- [ ] Review validator.ts — can you integrate into astro.config.js?
- [ ] Check component props — do your templates accept intentClass?
- [ ] Test build-time validation — does it catch missing data?
- [ ] Verify TypeScript types work in your codebase

### For UX Team

- [ ] Review H1 patterns for readability in Thai
- [ ] Check mobile layout implications of H1 length
- [ ] Design primary vs. secondary link styling
- [ ] Prototype callout text under H1 in mobile view

---

## Summary

**CAL-3720 delivers the complete, production-ready data model for CAL-3716 redesign cluster.**

Three files:
1. **seo-data-model.ts** — Type definitions & validators (460 lines)
2. **seo-validator.ts** — Build-time enforcement (380 lines)
3. **Implementation Guide** — Playbook for teams (400 lines)

Ready for:
- ✅ Type-safe component props
- ✅ Build-time validation
- ✅ Team implementation
- ✅ KPI measurement

Next step: **CMO approval of intent classification + metadata patterns → CTO integration → Phase 2 population & KPI tracking**

---

**Deliverable Status:** ✅ COMPLETE  
**Ready for:** CAL-3717 (UX), CAL-3718 (CTO), CAL-3719 (CMO/SEO)  
**Sign-off Required:** CMO approval of intent classifications + metadata patterns

