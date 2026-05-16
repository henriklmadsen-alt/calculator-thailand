# SEO Data Model Implementation Guide — CAL-3720

**Status:** Implementation specification for CAL-3716 redesign cluster  
**Owner:** SEO Specialist (CAL-3720)  
**Integration:** CAL-3717 (UX), CAL-3718 (CTO), CAL-3719 (CMO/SEO)  
**Target Audience:** Developers implementing redesign, CMO for approval, SEO specialist for audit  
**Date:** 2026-05-16  

---

## Overview

This guide implements the **data model delta** from CAL-3719 (Section 3: Internal-Link Blueprint). It formalizes:

1. **Intent classification** (4 intent classes for search strategy)
2. **Link structure** (enhanced with clusterKey, intentRole, priority)
3. **Metadata patterns** (standardized title/description by intent)
4. **Validation rules** (cluster minimum: 1 inbound + 2 outbound + 1 CTA)
5. **Calculator/Article metadata** (structured schema for redesign templates)

**Key Files:**
- `src/lib/seo-data-model.ts` — Type definitions, patterns, validators
- `src/lib/internal-links.ts` — Migration target (extend existing with new fields)
- `docs/seo-data-model-implementation-guide.md` — This guide

---

## 1. Intent Classes (Non-Negotiable)

Every calculator and article **must declare exactly one primary intent class**. This determines title pattern, CTA strategy, and cluster linking structure.

| Intent | Primary Query | Page Type | H1 Pattern | CTA Action | Cluster Role |
|--------|---|---|---|---|---|
| `calculate-now` | "คำนวณ...เท่าไร" | Calculator | "คำนวณ{หัวข้อ} {ปี} — รู้ผลทันที" | Complete calc | Core tool |
| `compare-options` | "แบบไหนคุ้ม", "เทียบ..." | Calc + Article | "เทียบ{A} vs {B}" | Click comparison | Decision support |
| `learn-before-action` | "วิธีคำนวณ...", "คืออะไร" | Article | "{หัวข้อ} {ปี}: วิธีคิดทีละขั้น" | Click to calc | Planning guide |
| `example-check` | "เงินเดือน...เสียภาษีเท่าไร" | Article | "{หัวข้อ}: ตัวอย่างจริง + วิธีเช็ก" | Try own calc | Verification |

### Choosing the Right Intent

**Use `calculate-now` when:**
- User wants **immediate result** (no learning, no comparison)
- Examples: Income tax calc, electricity calc, loan payment calc
- H1: `คำนวณ{หัวข้อ} 2569 — รู้ผลทันที`

**Use `compare-options` when:**
- User wants to **choose between alternatives** (compare before deciding)
- Examples: Fixed vs. floating loan, different insurance levels
- H1: `เทียบ{ตัวเลือก A} vs {ตัวเลือก B}`

**Use `learn-before-action` when:**
- User wants **to understand a concept first**, then apply it
- Examples: "How to calculate VAT", "What is depreciation", "Understanding tax deductions"
- H1: `{หัวข้อ} 2569: วิธีคิดทีละขั้น + ข้อควรระวัง`

**Use `example-check` when:**
- User wants a **worked example** to verify their own calculation
- Examples: "Income tax 2569 with actual salary example", "How to check your property tax calculation"
- H1: `{หัวข้อ}: ตัวอย่างจริง + วิธีเช็กผลด้วยตัวเอง`

---

## 2. Enhanced Link Structure

### Old Structure (internal-links.ts, pre-CAL-3720)

```typescript
interface RelatedLink {
  href: string;
  title: string;
  desc: string;
  date?: string;
  author?: string;
}

interface CalculatorLinks {
  calculators: RelatedLink[];
  articles: RelatedLink[];
}
```

### New Structure (EnhancedLink, CAL-3720)

```typescript
interface EnhancedLink {
  href: string;
  title: string;
  desc: string;
  clusterKey: string;          // ← NEW: cluster identifier (e.g., 'tax-income')
  intentClass: IntentClass;    // ← NEW: intent of linked page
  linkRole: LinkRole;          // ← NEW: why this link exists
  priority: LinkPriority;      // ← NEW: primary vs secondary
  date?: string;
  author?: string;
}
```

### New Fields Explained

**`clusterKey`**
- Machine-readable cluster identifier
- Must match one of the 11 defined clusters: `tax-income`, `tax-business`, `tax-property`, `loan-mortgage`, `loan-vehicle`, `loan-personal`, `insurance-life`, `investment-return`, `savings-compound`, `health-bmi`, `business-profit`
- Purpose: Enable validation that links stay within their semantic cluster

**`intentClass`**
- Intent of the **linked page** (not the current page)
- Lets components know how to position the link (e.g., "This leads to a learning resource" vs. "This is a calculation tool")

**`linkRole`**
- Why this relationship exists in the graph
- Values: `same-intent`, `upstream-planning`, `downstream-decision`, `comparison`, `prerequisite`, `example-support`
- Helps validators understand semantic meaning

**`priority`**
- `primary` — must have exactly 1 per calculator template
- `secondary` — must have exactly 2 per calculator template
- Enforces structure: deep relationships + surface options

---

## 3. Migration Path: Extending internal-links.ts

**Recommendation:** Keep `internal-links.ts` as-is for backward compatibility. Create a parallel migration function.

### Step 1: Create Migration Utility

```typescript
// src/lib/internal-links-migration.ts

import { EnhancedLink } from './seo-data-model';
import { calculatorLinkMap } from './internal-links';

/**
 * Migrate old RelatedLink → EnhancedLink
 * Add missing clusterKey, intentClass, linkRole, priority
 */
export function migrateToEnhancedLinks(): Record<string, EnhancedLink[]> {
  const enhanced: Record<string, EnhancedLink[]> = {};

  for (const [calcPath, links] of Object.entries(calculatorLinkMap)) {
    const allLinks: EnhancedLink[] = [];

    // Add related calculators
    links.calculators.forEach((link, idx) => {
      allLinks.push({
        ...link,
        clusterKey: detectClusterKey(link.href),
        intentClass: 'calculate-now', // Inferred; should be explicit
        linkRole: idx === 0 ? 'same-intent' : 'comparison',
        priority: idx === 0 ? 'primary' : 'secondary',
      });
    });

    // Add articles
    links.articles.forEach((link, idx) => {
      allLinks.push({
        ...link,
        clusterKey: detectClusterKey(link.href),
        intentClass: 'learn-before-action', // Inferred; should be explicit
        linkRole: idx === 0 ? 'prerequisite' : 'example-support',
        priority: idx === 0 ? 'primary' : 'secondary',
      });
    });

    enhanced[calcPath] = allLinks;
  }

  return enhanced;
}

function detectClusterKey(href: string): string {
  // Implementation: infer cluster from URL pattern or calculator name
  // TEMP: Return placeholder; requires cluster registry
  return 'unknown-cluster';
}
```

### Step 2: Create Structured Metadata

For priority calculators, create explicit `CalculatorMetadata` objects:

```typescript
// src/lib/calculator-metadata.ts

import { CalculatorMetadata, IntentClass } from './seo-data-model';

export const calculatorMetadata: Record<string, CalculatorMetadata> = {
  '/คำนวณภาษีเงินได้บุคคลธรรมดา/': {
    href: '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
    title: 'คำนวณภาษีเงินได้บุคคลธรรมดา 2569',
    intentClass: 'calculate-now',
    clusterKey: 'tax-income',
    description: 'คำนวณภาษีเงินได้ 2569 ตามขั้นบันได พร้อมลดหย่อน',
    h1: 'คำนวณภาษีเงินได้ 2569 — รู้ผลทันที',
    supportText: 'กรอกข้อมูลเงินเดือนและลดหย่อน แล้วรู้ว่าต้องเสียภาษีเท่าไร',
    relatedCalculators: [
      {
        href: '/คำนวณเงินเดือนสุทธิ/',
        title: 'คำนวณเงินเดือนสุทธิ',
        desc: 'เงินเดือนหลังหักภาษี',
        clusterKey: 'tax-income',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'primary',
      },
      {
        href: '/คำนวณประกันสังคม/',
        title: 'คำนวณประกันสังคม',
        desc: 'เงินสมทบประกันสังคม',
        clusterKey: 'tax-income',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'secondary',
      },
      {
        href: '/คำนวณหักภาษี-ณ-ที่จ่ายรายเดือน/',
        title: 'คำนวณภาษีหัก ณ ที่จ่าย',
        desc: 'ภาษีหักรายเดือน',
        clusterKey: 'tax-income',
        intentClass: 'calculate-now',
        linkRole: 'upstream-planning',
        priority: 'secondary',
      },
    ],
    relatedArticles: [
      {
        href: '/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/',
        title: 'ภาษีเงินได้ 2569 คำนวณ วิธีลดหย่อน',
        desc: 'แนะนำวิธีลดหย่อนภาษี',
        clusterKey: 'tax-income',
        intentClass: 'learn-before-action',
        linkRole: 'example-support',
        priority: 'primary',
      },
    ],
    trust: {
      updatedDate: '2026-05-08',
      source: 'สรรพากรไทย',
      author: 'Kamnuanlek Editor',
    },
  },
  // ... more calculator metadata
};
```

---

## 4. Cluster Minimum Rules (Validation)

Every published page must pass this validation:

| Rule | Requirement | Violation |
|------|---|---|
| **Inbound** | ≥ 1 link FROM same cluster | "No inbound links from {cluster}" |
| **Outbound** | ≥ 2 links TO cluster pages | "Only N outbound links; need 2+" |
| **CTA Path** | ≥ 1 explicit next-step CTA | "No CTA to next action" |

### Validation in Practice

```typescript
import { validateClusterMinimum, ClusterMinimumRule } from './seo-data-model';

const rule: ClusterMinimumRule = {
  pageHref: '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
  clusterKey: 'tax-income',
  inboundLinkCount: 3,  // How many pages in 'tax-income' cluster link to this page?
  outboundLinkCount: 3, // How many cluster pages does this page link to?
  hasCTAPath: true,     // Does page have a clear "next step" CTA?
  compliant: true,
  violations: [],
};

const result = validateClusterMinimum(rule);
// result.valid === true ✓
// result.violations === []
```

---

## 5. Metadata Patterns by Intent

### Pattern Templates (from METADATA_PATTERNS)

Each intent class has a standardized pattern for:
- **Title** (for `<title>` tag and Google SERP)
- **Description** (for `<meta name="description">` and SERP snippet)
- **H1** (page heading, user-facing)
- **Callout** (support text under H1)

**Example: `calculate-now` intent**

```
titlePattern:       "คำนวณ{หัวข้อ} {ปี} — รู้ผลทันที"
descriptionPattern: "คำนวณ{หัวข้อ} {ปี} ฟรี รู้ผลทันที พร้อมคำอธิบาย"
h1Pattern:          "คำนวณ{หัวข้อ} {ปี} — รู้ผลทันที"
calloutPattern:     "ทำอะไรได้: คำนวณ{หัวข้อ}ของคุณตามข้อมูลจริง"
```

**Filled-in Example: Income Tax Calculator**

```
title:       "คำนวณภาษีเงินได้ 2569 — รู้ผลทันที"
description: "คำนวณภาษีเงินได้ 2569 ฟรี รู้ผลทันที พร้อมคำอธิบายวิธีคิด"
h1:          "คำนวณภาษีเงินได้ 2569 — รู้ผลทันที"
callout:     "ทำอะไรได้: คำนวณภาษีเงินได้ของคุณตามข้อมูลเงินเดือนจริง"
```

### How Templates Use Patterns

**Component: CalculatorHeader.astro**
```astro
---
import { METADATA_PATTERNS } from '../../lib/seo-data-model';
interface Props {
  title: string;
  intentClass: 'calculate-now' | 'compare-options' | ...;
}
const { title, intentClass } = Astro.props;
const pattern = METADATA_PATTERNS[intentClass];
---

<h1>{pattern.h1Pattern}</h1>
<p class="callout">{pattern.calloutPattern}</p>
```

---

## 6. Implementation Checklist for CAL-3716 Redesign Teams

### For CTO (CAL-3718)

- [ ] Add `seo-data-model.ts` import to type-checking in build
- [ ] Extend `BaseLayout.astro` to accept `intentClass` prop
- [ ] Extend `CalculatorHeader.astro` to apply H1 pattern based on intent
- [ ] Create migration utility to populate missing `clusterKey` + `intentRole` fields
- [ ] Add test gate to reject builds with orphan calculator pages
- [ ] Verify all components pass TypeScript strict mode with new types

### For CMO/SEO (CAL-3719)

- [ ] Audit existing calculator/article metadata for intent classification
- [ ] Assign each priority calculator an explicit `intentClass`
- [ ] Verify cluster assignments for all top-20 pages
- [ ] Create enhanced link map for 8 priority calculators (full CalculatorMetadata)
- [ ] Approve final intent assignments before implementation freeze
- [ ] Define final title/description for each page using patterns

### For UX (CAL-3717)

- [ ] Review H1 patterns for each intent class (Thai readability + clarity)
- [ ] Ensure callout text fits responsive layout
- [ ] Verify link prominence for primary vs. secondary related links
- [ ] Mobile test: related-calculator cards don't push result off-screen

### Shared: Validation Gates

- [ ] Build gate 1: No missing `clusterKey` or `intentClass` fields
- [ ] Build gate 2: All calculator pages pass `validateCalculatorMetadata()`
- [ ] Build gate 3: All article pages pass `validateArticleMetadata()`
- [ ] Build gate 4: All pages pass `validateClusterMinimum()` rules
- [ ] Pre-launch audit: Run orphan-page detector on final site

---

## 7. Practical Example: Complete Calculator Metadata

Here's a fully-populated `CalculatorMetadata` for reference:

```typescript
export const incomeTaxCalculator: CalculatorMetadata = {
  href: '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
  title: 'คำนวณภาษีเงินได้บุคคลธรรมดา 2569',
  intentClass: 'calculate-now',
  clusterKey: 'tax-income',
  description: 'คำนวณภาษีเงินได้บุคคล 2569 ตามขั้นบันได พร้อมลดหย่อนครบ',
  h1: 'คำนวณภาษีเงินได้บุคคล 2569 — รู้ผลทันที',
  supportText: 'กรอกข้อมูลเงินเดือน ลดหย่อน และเงินสมทบประกันสังคม แล้วรู้เลยว่าต้องเสียภาษีกี่บาท',
  relatedCalculators: [
    {
      href: '/คำนวณเงินเดือนสุทธิ/',
      title: 'คำนวณเงินเดือนสุทธิ',
      desc: 'เงินเดือนหลังหักภาษี',
      clusterKey: 'tax-income',
      intentClass: 'calculate-now',
      linkRole: 'same-intent',
      priority: 'primary',
    },
    {
      href: '/คำนวณประกันสังคม/',
      title: 'คำนวณประกันสังคม ม.33 ม.39 ม.40',
      desc: 'เงินสมทบประกันสังคมทุกประเภท',
      clusterKey: 'tax-income',
      intentClass: 'calculate-now',
      linkRole: 'same-intent',
      priority: 'secondary',
    },
    {
      href: '/คำนวณหักภาษี-ณ-ที่จ่ายรายเดือน/',
      title: 'คำนวณภาษีหัก ณ ที่จ่าย',
      desc: 'ภาษีหักรายเดือนตามขั้นบันได',
      clusterKey: 'tax-income',
      intentClass: 'calculate-now',
      linkRole: 'upstream-planning',
      priority: 'secondary',
    },
  ],
  relatedArticles: [
    {
      href: '/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/',
      title: 'ภาษีเงินได้ 2569 คำนวณ วิธีลดหย่อน',
      desc: 'แนะนำวิธีลดหย่อนภาษีครบ',
      clusterKey: 'tax-income',
      intentClass: 'learn-before-action',
      linkRole: 'example-support',
      priority: 'primary',
      author: 'Kamnuanlek Editor',
      date: '2026-05-08',
    },
  ],
  trust: {
    updatedDate: '2026-05-08',
    source: 'สรรพากรไทย (ตามกฎหมายว่าด้วยภาษีเงินได้)',
    author: 'Kamnuanlek Team',
  },
};
```

---

## 8. Integration with Components

### Example: RelatedCalculators.astro

```astro
---
import { EnhancedLink, LinkPriority } from '../lib/seo-data-model';

interface Props {
  links: EnhancedLink[];
}

const { links } = Astro.props;
const primaryLinks = links.filter(l => l.priority === 'primary');
const secondaryLinks = links.filter(l => l.priority === 'secondary');
---

<aside class="related-calculators">
  {primaryLinks.length > 0 && (
    <div class="primary-group">
      <h3>เครื่องมือที่เกี่ยวข้อง</h3>
      {primaryLinks.map(link => (
        <a href={link.href} data-role={link.linkRole}>
          <strong>{link.title}</strong>
          <span>{link.desc}</span>
        </a>
      ))}
    </div>
  )}

  {secondaryLinks.length > 0 && (
    <div class="secondary-group">
      <h4>ทางเลือกอื่น</h4>
      {secondaryLinks.map(link => (
        <a href={link.href} data-role={link.linkRole}>
          <span>{link.title}</span>
        </a>
      ))}
    </div>
  )}
</aside>
```

---

## 9. Next Steps

### Immediate (This Week)

1. **SEO Specialist (CAL-3720):**
   - ✅ Create enhanced data model (seo-data-model.ts)
   - ✅ Document patterns and rules (this guide)
   - [ ] Audit top-20 calculators for intent assignment
   - [ ] Create CalculatorMetadata for priority 8 calculators

2. **CMO (CAL-3719):**
   - [ ] Review and approve intent classifications
   - [ ] Provide final title/description guidance per intent
   - [ ] Validate cluster assignments

3. **CTO (CAL-3718):**
   - [ ] Review TypeScript interfaces for integration feasibility
   - [ ] Plan component updates to support intentClass
   - [ ] Prototype migration utility

### Next Phase (Before Release)

- [ ] Implement migration tool to populate all calculator metadata
- [ ] Add build-time validation gates
- [ ] Full audit of cluster connectivity
- [ ] Component testing with real metadata
- [ ] 14-day + 30-day KPI tracking setup

---

## References

- **CAL-3716:** World class website design (parent issue)
- **CAL-3717:** UX Designer specification (redesign spec)
- **CAL-3718:** CTO implementation plan (technical rollout)
- **CAL-3719:** CMO/SEO cluster alignment (strategy + microcopy)
- **CAL-3720:** SEO Specialist data model (this implementation)

