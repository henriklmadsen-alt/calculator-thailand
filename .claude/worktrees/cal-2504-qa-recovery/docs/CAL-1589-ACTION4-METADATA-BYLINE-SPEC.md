# CAL-1589: ACTION 4 — Content Metadata Format + Article Byline Alignment

**Status**: Specification Ready for Implementation  
**Date**: 2026-04-24  
**Owner**: Thai Content Specialist Alpha  
**Phase**: Phase 1 (Articles 1–10)  
**Timeline**: Writing 2026-04-27 → Publish 2026-04-30 to 2026-05-08  

---

## Executive Summary

This document defines the unified metadata format and byline/author attribution rules for all Calculator Thailand articles in Phase 1 and beyond.

**Purpose**: Ensure consistency, searchability, trust, and internal linking across all article content while maintaining natural Thai voice and reader trust.

**Key Outcomes**:
- All 10 Phase 1 articles follow identical metadata structure
- Author attribution builds credibility and consistency
- Metadata enables CMS/SEO integration and analytics tracking
- Byline alignment clarifies content ownership and expertise

---

## Part 1: Content Metadata Format

### 1.1 Required Metadata Fields

Every article **must** include the following metadata, structured as shown in the **Metadata Block** format (Section 1.2):

| Field | Type | Required | Example | Notes |
|-------|------|----------|---------|-------|
| **title** | String | ✅ Yes | ค่าแลกเปลี่ยนเงินบาท: คู่มือสกุลเงินไทย | Article headline (50–70 chars ideal) |
| **description** | String | ✅ Yes | คำอธิบายเกี่ยวกับอัตราแลกเปลี่ยน หน้าที่... | Meta description for search (120–160 chars) |
| **keyword_primary** | String | ✅ Yes | exchange-rate | Primary SEO keyword (slug form) |
| **keywords_secondary** | Array | ✅ Yes | ["baht-exchange", "currency-converter"] | 2–4 secondary keywords |
| **calculator_primary** | String | ✅ Yes | /exchange-rate-calculator | Primary calculator URL (relative) |
| **calculator_related** | Array | ✅ Yes | ["/conversion-calculator", "/currency-converter"] | 1–3 related calculator URLs |
| **word_count** | Number | ✅ Yes | 1200 | Approximate word count (range: 1200–1500w for Phase 1) |
| **author** | String | ✅ Yes | Thai Content Specialist Alpha | Author name/attribution |
| **author_role** | String | ✅ Yes | Content Specialist | Author role/title |
| **publish_date** | String (ISO) | ✅ Yes | 2026-04-30 | Publication date (YYYY-MM-DD) |
| **last_updated** | String (ISO) | ✅ Yes | 2026-04-30 | Last modification date (YYYY-MM-DD) |
| **cluster** | String | ✅ Yes | Finance | Content cluster (for internal linking) |
| **category_primary** | String | ✅ Yes | Financial Planning | Primary content category |
| **category_secondary** | Array | ❌ No | ["Currency", "Investment"] | Secondary categories (optional) |
| **tags** | Array | ✅ Yes | ["calculator-support", "thai-finance", "step-by-step"] | 3–5 content tags |
| **featured_image** | String | ✅ Yes | /images/articles/exchange-rate.jpg | Featured image path (JPG/PNG, 1200x630px minimum) |
| **featured_image_alt** | String | ✅ Yes | Thai baht coins and currency exchange rate chart | Image alt text for accessibility |
| **seo_slug** | String | ✅ Yes | thai-baht-exchange-rate-guide | URL slug (lowercase, hyphens) |
| **reading_time_minutes** | Number | ✅ Yes | 5 | Estimated reading time in minutes |
| **toc_enabled** | Boolean | ✅ Yes | true | Show table of contents (true/false) |
| **internal_links_count** | Number | ✅ Yes | 3 | Number of related-calculator links in article |
| **faq_sections** | Number | ❌ No | 2 | Number of FAQ sections (if any) |
| **qa_verified** | Boolean | ✅ Yes | true | Content verified for accuracy (QA stamp) |
| **qa_verified_date** | String (ISO) | ✅ Yes | 2026-04-24 | Date content was QA verified |

---

### 1.2 Metadata Block Format

Insert the following metadata block **immediately after the article title**, before any body content:

```
---
METADATA
title: ค่าแลกเปลี่ยนเงินบาท: คู่มือสกุลเงินไทย
description: คำอธิบายอัตราแลกเปลี่ยนเงินบาท สูตรการคำนวณ ตัวอย่าง และวิธีใช้เครื่องคำนวณแลกเปลี่ยนแบบเต็ม
keyword_primary: exchange-rate
keywords_secondary: [baht-exchange, currency-converter, thai-currency]
calculator_primary: /exchange-rate-calculator
calculator_related: [/conversion-calculator, /currency-converter]
word_count: 1200
author: Thai Content Specialist Alpha
author_role: Content Specialist
publish_date: 2026-04-30
last_updated: 2026-04-30
cluster: Finance
category_primary: Financial Planning
category_secondary: [Currency, Investment]
tags: [calculator-support, thai-finance, step-by-step, beginner-friendly]
featured_image: /images/articles/exchange-rate.jpg
featured_image_alt: Thai baht coins and currency exchange rate chart
seo_slug: thai-baht-exchange-rate-guide
reading_time_minutes: 5
toc_enabled: true
internal_links_count: 3
faq_sections: 2
qa_verified: true
qa_verified_date: 2026-04-24
---
```

---

### 1.3 Featured Image Specifications

**All Phase 1 articles require a featured image.**

| Property | Specification | Notes |
|----------|---------------|-------|
| **Format** | JPG or PNG | Compress JPG to <200KB; PNG for graphics <500KB |
| **Dimensions** | 1200px × 630px (16:9 ratio) | Recommended for social sharing + SEO |
| **Minimum Size** | 1200×630 | Do not use smaller; scales poorly on mobile |
| **Color Palette** | Thai-friendly, professional | Align with brand colors (review brand guide) |
| **Text Overlay** | Optional but recommended | Use high-contrast text if included (white/dark) |
| **File Naming** | `/images/articles/[slug].jpg` | Match `seo_slug` field; lowercase, hyphens |
| **Alt Text** | Descriptive (1–15 words) | Must match `featured_image_alt` field |
| **Storage Path** | `/public/images/articles/` | Committed to git; verify path before publishing |

**Guidelines**:
- Every image must load quickly (optimize before commit)
- Images should reflect article topic (calculators, Thai context, relevant visuals)
- Do not use stock photos without proper licensing
- Use consistent styling/branding across all images

---

### 1.4 Word Count & Reading Time Rules

**Word Count Target by Article Type:**

| Article Type | Minimum | Target | Maximum | Notes |
|--------------|---------|--------|---------|-------|
| **Finance Intro** | 1000w | 1200w | 1300w | Exchange Rate, Savings intro-level |
| **Finance Detailed** | 1200w | 1400w | 1600w | Tax, Mortgage, detailed guides |
| **Use-Case/Scenario** | 1000w | 1200w | 1400w | Real-world examples |
| **Best Practices** | 1100w | 1300w | 1500w | Tips, gotchas, Thailand context |

**Reading Time Calculation** (for `reading_time_minutes`):
- Use 200 words per minute as the standard
- Formula: `word_count ÷ 200 = reading_time_minutes`
- Round up (5.4 min → 6 min)
- Minimum: 3 minutes; Maximum: 10 minutes

**Phase 1 Article Targets:**
1. Exchange Rate: 1200w → 6 min
2. Savings: 1200w → 6 min
3. VAT: 1200w → 6 min
4. Overtime: 1300w → 7 min
5. Mortgage: 1400w → 7 min
6. Tax: 1500w → 8 min
7. ROI: 1300w → 7 min
8. Retirement: 1400w → 7 min
9. Loan: 1300w → 7 min
10. Property Tax: 1200w → 6 min

**Total Target**: ~13,000 words across Phase 1 (vs. 12,700w target from CAL-1577)

---

### 1.5 Internal Linking Specifications

**Calculator Link Requirements:**

Every article **must include**:
- **1 primary calculator link** in intro or first relevant section
- **2–3 secondary related-calculator links** in body or "Related Resources" section
- **All links must use relative URLs** (e.g., `/exchange-rate-calculator`, not full domain)

**Link Placement Rules:**

| Placement | Requirement | Example |
|-----------|-------------|---------|
| **First mention** | Primary calculator link in first section | "ใช้[เครื่องคำนวณแลกเปลี่ยน](/exchange-rate-calculator)เพื่อ..." |
| **Mid-article** | Context-relevant secondary link | "สำหรับการบันทึกรายรับ ลอง[เครื่องคำนวณรายได้](/income-calculator)" |
| **End of article** | "Related Resources" or "See Also" section | Link all 2–3 related calculators |
| **Link anchor text** | Descriptive, not generic | Use: "เครื่องคำนวณแลกเปลี่ยน" NOT: "click here" |

**Link Count Verification** (`internal_links_count`):
- Count only calculator-related links (e.g., `/คำนวณ-*` or `/[calculator-name]`)
- Do not count external reference links (e.g., rd.go.th)
- Minimum: 3; Maximum: 5 per article
- Phase 1 target: 3 per article (matching CAL-1575 internal linking spec)

**Cluster-Specific Linking** (from CAL-1575):

Each article must link to calculators in its cluster:

- **Finance Cluster** (7 articles): Exchange Rate → Savings → Tax → VAT → Retirement → Loan → Property Tax
  - Link pattern: Tax as hub; VAT, Exchange Rate, Retirement as key links
  
- **Real Estate Cluster** (2 articles): Mortgage ↔ Property Tax
  - Link pattern: Mortgage → Property Tax (entry + costs)

- **Work/Finance Cluster** (1 article): Overtime
  - Link pattern: Overtime → Salary (when Salary releases in Phase 2)

---

### 1.6 Category & Tag Taxonomy

**Primary Categories** (use exactly one per article):

- Financial Planning
- Tax & Compliance
- Real Estate & Property
- Business & Investment
- Employment & Salary
- Health & Wellness
- Travel & Conversion
- Food & Dining

**Secondary Categories** (optional, 0–2):
- Free from the Primary list above

**Content Tags** (required, minimum 3, maximum 5):

**Standard Tags** (reusable across articles):
- `calculator-support` — Article supports a specific calculator
- `thai-finance` — Thailand-specific financial content
- `step-by-step` — Includes walkthrough/tutorial
- `beginner-friendly` — No prior knowledge required
- `scenario-based` — Real-world use cases/examples
- `best-practices` — Tips, gotchas, advice
- `tax-compliance` — Thai tax rules/regulations
- `expense-tracking` — Budgeting/cost planning
- `investment-planning` — Returns, growth, portfolios
- `loan-basics` — Borrowing, interest, repayment

**Phase 1 Article Tags (Example: Exchange Rate)**:
- `calculator-support`
- `thai-finance`
- `step-by-step`
- `beginner-friendly`

---

## Part 2: Article Byline & Author Attribution

### 2.1 Byline Format & Placement

**Standard Byline Block** (insert after metadata, before article body):

```
---
BY **Thai Content Specialist Alpha**  
Content Specialist, Calculator Thailand  
*Published: 2026-04-30 | Updated: 2026-04-30 | Reading Time: 6 min*

---
```

**Line-by-Line Breakdown:**

| Line | Format | Purpose |
|------|--------|---------|
| **Author Line** | `By **[Author Name]**` | Author attribution (bold name) |
| **Role Line** | `[Author Title], Calculator Thailand` | Role + company (full attribution) |
| **Meta Line** | `*Published: YYYY-MM-DD \| Updated: YYYY-MM-DD \| Reading Time: X min*` | Publication metadata (italicized) |

---

### 2.2 Author Attribution Rules

**For Phase 1 Articles:**

**All Phase 1 articles (10 articles) use**:
```
By **Thai Content Specialist Alpha**
Content Specialist, Calculator Thailand
```

**Purpose**: 
- Establishes consistent byline across content cluster
- "Specialist" title signals expertise to readers
- "Calculator Thailand" reinforces brand/source authority

**When author changes** (Phase 2 and beyond):
- Update byline to: `By **[Name]**` (real person name)
- Include: `[Title], Calculator Thailand`
- Example: `By **Somchai Detdaree**` / `Content Writer, Calculator Thailand`

---

### 2.3 Author Credibility Signals (Optional Enhancement)

For future expansion (Phase 2+), consider adding after byline:

```
**Expertise**: Thai financial compliance, tax law, calculator design  
**Verified By**: [QA/SME Name] on [Date]
```

This adds a second credibility layer showing who verified content for accuracy.

**For Phase 1**: Not required; focus on byline consistency.

---

### 2.4 Author Profile & Bio (Future)

Currently not required for Phase 1. For Phase 2+, define:
- Short author bio (50–100 words)
- Author photo (100x100px minimum, square)
- Author expertise/credentials
- Link to author archive/other articles

---

## Part 3: CMS & Technical Implementation

### 3.1 Article Storage & Naming

**File Structure** (proposed for future CMS):

```
/content/articles/
  /[seo_slug]/
    article.md
    featured-image.jpg
    metadata.yaml
```

**Example**:
```
/content/articles/thai-baht-exchange-rate-guide/
  article.md
  featured-image.jpg
  metadata.yaml
```

**Current Workflow** (before CMS):
- Articles stored in `/content/` as markdown files
- Named: `CAL-[Issue]-[Title].md`
- Example: `CAL-1577-PHASE1-Article1-Exchange-Rate.md`

---

### 3.2 Metadata Integration Checklist

Before publishing any Phase 1 article:

- [ ] Metadata block filled in completely (all required fields)
- [ ] Featured image uploaded to `/public/images/articles/[slug].jpg`
- [ ] Featured image dimensions verified (1200×630px)
- [ ] Image alt text matches `featured_image_alt`
- [ ] Word count matches article length (±50 words)
- [ ] Reading time calculated and verified
- [ ] Primary calculator link inserted in intro section
- [ ] 2–3 secondary calculator links distributed in body
- [ ] All links use relative URLs (no full domains)
- [ ] Byline block formatted correctly with dates
- [ ] Publication date matches scheduled publish date
- [ ] QA verified (`qa_verified: true`) with date
- [ ] Metadata reviewed by SEO Specialist (internal linking validation)
- [ ] Thai readability review complete (natural voice, no machine translation)

---

### 3.3 Content Approval Workflow

**Before Publishing, Verify**:

1. **Thai Content Specialist Alpha** → Draft completed with metadata + byline
2. **SEO Specialist** → Verify:
   - Keywords match search intent
   - Internal links match CAL-1575 cluster map
   - Link count correct (3 per article)
   - Metadata slug + keywords aligned
3. **CTO/QA** (if applicable) → Verify:
   - Featured image loads & displays correctly
   - Metadata renders in template
   - Byline displays with correct formatting
   - Links are functional (relative URLs resolve)
4. **CMO** (final approval) → Verify:
   - Article meets quality standard
   - Byline consistency checked
   - Publish date scheduled correctly
   - Ready for publication

**Approval Sign-Off**: All parties add approval comment in Paperclip before article goes live.

---

## Part 4: Quality & Consistency Standards

### 4.1 Metadata Quality Checklist

| Check | Standard | Failure Case |
|-------|----------|--------------|
| **Title Length** | 50–70 chars | Titles >80 chars fail; <30 chars fail |
| **Description Length** | 120–160 chars | <100 or >170 chars fail |
| **Primary Keyword** | Slug format (lowercase, hyphens) | Keywords with spaces, capitals, or special chars fail |
| **Calculator Links** | Exact relative URLs from CAL-1576 mapping | Non-existent URLs fail; full domains fail |
| **Word Count** | Within Phase 1 target (1200–1500w) | <1000w or >1600w fail |
| **Dates** | ISO format (YYYY-MM-DD) | Non-ISO dates fail; future dates fail |
| **Cluster Match** | Article topic matches cluster (Finance, Real Estate, etc.) | Mismatched clusters fail |
| **Tags Count** | 3–5 tags | <3 or >5 tags fail |
| **Image Specs** | 1200×630px JPG/PNG | Wrong size/format fails; >500KB fails |
| **Reading Time** | Calculated from word count (÷200) | Incorrect calculation fails |

---

### 4.2 Byline Consistency

**All Phase 1 articles must use**:
```
By **Thai Content Specialist Alpha**
Content Specialist, Calculator Thailand
```

**Verification**:
- Check exact spelling (Capital A in Alpha)
- Verify title is "Content Specialist" (not Specialist or Writer)
- Verify "Calculator Thailand" (not Kamnuanlek or other variant)
- Verify meta line format: `*Published: ... \| Updated: ... \| Reading Time: ...*`

**Consistency Check Script** (for QA):
- Grep all Phase 1 articles for byline
- Flag any variant spellings or formatting
- Require standardization before publication

---

### 4.3 Thai Language & Readability Standards

**Metadata Thai Quality**:
- Titles: Natural, user-focused (not machine-translated)
- Descriptions: Clear benefit statement, keyword-inclusive
- Tags: Use natural Thai (not romanized or hybrid)

**Article Thai Quality** (enforced in writing phase):
- Conversational tone (ใช้ภาษาธรรมชาติ)
- Clear explanations (ไม่โต้งอ)
- Relevant examples (ตัวอย่างท้องถิ่นไทย)
- Mobile-readable (short sentences, clear breaks)

---

## Part 5: Rollout Timeline

### Phase 1 Article Publication (Concurrent Writing & Spec)

| Date | Articles | Status |
|------|----------|--------|
| **2026-04-27** | Writing begins (Articles 1–2) | Spec finalized, QA team briefed |
| **2026-04-30** | Article 1–2 publish | Exchange Rate, Savings (metadata live) |
| **2026-05-02** | Article 3–4 publish | VAT, Overtime |
| **2026-05-03** | Article 5 publish | Mortgage |
| **2026-05-04** | Article 6 publish | Tax |
| **2026-05-05** | Article 7 publish | ROI |
| **2026-05-06** | Article 8 publish | Retirement |
| **2026-05-07** | Article 9 publish | Loan |
| **2026-05-08** | Article 10 publish | Property Tax |

**Key Dependency**:
- SEO Specialist delivers CAL-1575 internal linking map **by 2026-04-28**
- All calculator URLs confirmed in mapping **before article 1 publishes (2026-04-30)**

---

## Part 6: Appendix

### A. Metadata Block Template (Copy-Paste Ready)

```yaml
---
METADATA
title: [Article Title in Thai]
description: [SEO Meta Description 120–160 chars]
keyword_primary: [slug-form-keyword]
keywords_secondary: [keyword-1, keyword-2, keyword-3]
calculator_primary: [/calculator-slug]
calculator_related: [/calc-1, /calc-2, /calc-3]
word_count: [1200–1500]
author: Thai Content Specialist Alpha
author_role: Content Specialist
publish_date: YYYY-MM-DD
last_updated: YYYY-MM-DD
cluster: [Finance/Real Estate/Business/Work]
category_primary: [Primary Category]
category_secondary: [Category 2, Category 3]
tags: [tag-1, tag-2, tag-3, tag-4, tag-5]
featured_image: /images/articles/[slug].jpg
featured_image_alt: [Image description 1–15 words]
seo_slug: [slug-form-url]
reading_time_minutes: [word_count ÷ 200, rounded up]
toc_enabled: true
internal_links_count: 3
faq_sections: [0–2]
qa_verified: true
qa_verified_date: YYYY-MM-DD
---
```

### B. Byline Block Template (Copy-Paste Ready)

```
---
BY **Thai Content Specialist Alpha**  
Content Specialist, Calculator Thailand  
*Published: YYYY-MM-DD | Updated: YYYY-MM-DD | Reading Time: X min*

---
```

### C. Sample Full Article Structure

```
# [Article Title in Thai] ← Article Heading

---
METADATA
[Metadata block from template]
---

---
BY **Thai Content Specialist Alpha**  
Content Specialist, Calculator Thailand  
*Published: 2026-04-30 | Updated: 2026-04-30 | Reading Time: 6 min*

---

## Introduction Section

[Article body text...]

## Section 2

[More content with calculator links]

### Subsection 2.1

[Content...]

## Related Resources

[Links to 2–3 related calculators]

---

**References**: [External citations]
```

---

## Approval & Sign-Off

**Document Created**: 2026-04-24  
**Owner**: Thai Content Specialist Alpha  
**Ready for**: Phase 1 Article Writing (2026-04-27 onwards)  

**Approval Status**: Pending CMO review  

**Next Steps**:
1. CMO approval of this spec (by 2026-04-25)
2. SEO Specialist finalizes CAL-1575 internal linking (by 2026-04-28)
3. QA team briefed on metadata + byline verification (by 2026-04-26)
4. First article writing begins 2026-04-27
5. Article 1 publishes 2026-04-30 with full metadata/byline

---

**Document Location**: `/docs/CAL-1589-ACTION4-METADATA-BYLINE-SPEC.md`  
**Issue**: CAL-1589  
**Status**: READY FOR IMPLEMENTATION
