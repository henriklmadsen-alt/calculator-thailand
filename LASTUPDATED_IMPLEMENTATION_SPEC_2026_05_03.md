# "Last Updated" Date Implementation Specification

**Status**: Ready for CTO implementation  
**Created**: 2026-05-03  
**Owner**: SEO/GEO Specialist (specification) → CTO (implementation)  
**Scope**: All 942+ calculator pages + blog posts  
**Priority**: High (SEO trust signal + snippet improvement)

---

## Strategic Importance

**Why "Last Updated" Matters**:
1. **User Trust**: Users see content is actively maintained
2. **Search Snippet Improvement**: "Last Updated" in Google snippets increases CTR by 5–15% (industry data)
3. **Freshness Signal**: Google uses update frequency as ranking factor for certain query types
4. **Mobile Credibility**: Mobile users heavily rely on publication/update dates
5. **Time-Sensitive Content**: Financial calculators and tax info benefit from visible update dates

**Example SERP Improvement**:
```
Before:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
เครื่องคำนวณเงินเดือน – Calculator Thailand
คำนวณเงินเดือน ภาษี และประกาศที่ใช้บังคับในปัจจุบัน...

After:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
เครื่องคำนวณเงินเดือน – Calculator Thailand
คำนวณเงินเดือน ภาษี และประกาศที่ใช้บังคับในปัจจุบัน...
Updated: May 3, 2026  ← Improves CTR
```

---

## Implementation Requirements

### **1. Auto-Generated Last Updated Date**

**Source**: Git commit date (most recent commit affecting the page)

**For Calculator Pages**:
```
- File path: src/calculators/[slug].astro
- Read: Last git commit date for this file
- Format: "Last Updated: [Month Day, Year]" (e.g., "Last Updated: May 3, 2026")
- Timezone: UTC+7 (Thailand, ICT)
- Fallback: If no git history, use build date
```

**For Blog Posts**:
```
- File path: src/blog/[category]/[slug].md
- Read: Front matter `updated` field (or git commit date if not set)
- Format: "Updated: [Month Day, Year]" (e.g., "Updated: May 3, 2026")
- Timezone: UTC+7 (Thailand, ICT)
```

**For Translated Pages** (English → Thai redirects):
```
- Use same date as primary calculator
- Example: If Net Salary Calculator updated May 3, all Thai/English versions show May 3
```

### **2. Display Locations**

**Primary Location** (all calculator pages):
```
Position: Below calculator form, above results section
HTML: <p class="last-updated">อัปเดตครั้งล่าสุด: <time datetime="2026-05-03">3 พฤษภาคม 2569</time></p>

Styling:
- Font size: 12–14px
- Color: Gray (#666 or #999, suitable for light/dark mode)
- Position: Left-aligned or center, depending on design system
- Context: "Last Updated: [Date]" or "Updated: [Date]" (keep English term for clarity)
```

**Secondary Location** (meta tag for search snippet):
```
HTML: <meta property="article:modified_time" content="2026-05-03T00:00:00+07:00" />

Purpose:
- Informs Google Search Console of content freshness
- Allows Google to surface update date in rich results
- Enables "Latest Updates" SERP features
```

**Tertiary Location** (schema markup):
```
Add to existing schema:
{
  "@context": "https://schema.org",
  "@type": "Calculator",  // or Article
  "datePublished": "2025-01-15",  // Original publish date
  "dateModified": "2026-05-03",    // Last update date ← Add this
  "name": "เครื่องคำนวณเงินเดือน",
  ...
}
```

---

## Implementation Checklist for CTO

### **Phase 1: Infrastructure (1 day)**

- [ ] Set up utility function to extract last git commit date for any file path
  - Language: JavaScript/TypeScript (Astro framework)
  - Input: File path (e.g., `src/calculators/net-salary.astro`)
  - Output: ISO date string (e.g., `2026-05-03`)
  - Fallback: If no git history, use build date

- [ ] Create Astro component `<LastUpdated />` for reusable display
  - Props: `date` (ISO string), `format` ("short" | "long" | "thai")
  - Format options:
    - Short: "May 3, 2026"
    - Long: "Last Updated: May 3, 2026 (11:45 AM ICT)"
    - Thai: "อัปเดตครั้งล่าสุด: 3 พฤษภาคม 2569"
  - Outputs both visual text + semantic `<time>` element

- [ ] Add `article:modified_time` meta tag to calculator layout template
  - Source: Last commit date (or explicit field if provided)
  - Format: ISO 8601 with UTC+7 timezone

### **Phase 2: Schema Markup (1 day)**

- [ ] Audit existing schema for all calculator pages
  - Current types: Calculator, Article, FAQPage
  - Missing: `dateModified` field

- [ ] Add `dateModified` to calculator schema (global)
  - Source: Last git commit date
  - Format: ISO 8601 date string
  - Example:
    ```json
    {
      "@context": "https://schema.org",
      "@type": "Calculator",
      "datePublished": "2025-01-15",
      "dateModified": "2026-05-03",
      "name": "เครื่องคำนวณเงินเดือน"
    }
    ```

- [ ] Validate schema with Google Rich Results Test
  - Link: https://search.google.com/test/rich-results
  - Verify `dateModified` is properly parsed

### **Phase 3: Calculator Page Integration (2–3 days)**

- [ ] Update calculator page template to include `<LastUpdated />` component
  - Position: Below calculator form (above results)
  - Usage example:
    ```astro
    <LastUpdated date={getLastCommitDate(Astro.file)} format="thai" />
    ```

- [ ] Test on sample calculators:
  - Net Salary Calculator (high-traffic)
  - Income Tax Calculator (time-sensitive, needs frequent updates)
  - Electricity Calculator (baseline calculator)
  - Loan Calculator (financial product)
  - Unit Converter (utility calculator)

- [ ] Verify date accuracy:
  - Compare displayed date vs git commit log
  - Ensure timezone is correct (UTC+7)
  - Check fallback behavior (if no git history)

### **Phase 4: Blog Post Integration (1 day)**

- [ ] Update blog post template to include `<LastUpdated />` component
  - Position: Below post title, in metadata row (alongside author, publish date)
  - Format: "Updated: May 3, 2026"
  - Show only if `dateModified > datePublished`

- [ ] Set front matter structure for blog posts:
  ```yaml
  ---
  title: "Post Title"
  slug: "post-slug"
  datePublished: "2026-05-03"
  dateModified: "2026-05-03"  // Auto-update on git commit
  author: "Thai Content Specialist"
  ---
  ```

### **Phase 5: Quality Assurance (1 day)**

- [ ] Build and test full site locally
  - Verify last-updated dates on 10+ random calculator pages
  - Verify dates on 3+ blog posts
  - Check mobile rendering (responsive design)
  - Check both light and dark mode (if applicable)

- [ ] Verify search snippet in Google Search Console
  - Submit sample URLs to GSC
  - Check that `article:modified_time` is picked up
  - Wait 1–2 days for Google to re-crawl and cache
  - Verify date appears in SERP snippet (if applicable)

- [ ] Test on production build
  - Deploy to staging first
  - Verify dates on live URLs
  - Check performance impact (should be minimal)

---

## Technical Specifications

### **Date Format Standards**

**For Display** (User-facing):
- English: "May 3, 2026"
- Thai: "3 พฤษภาคม 2569"
- Pattern: "[Day] [Month Name in Thai], [Year in Buddhist Era]"

**For Meta Tags** (Search Engine):
- ISO 8601: `2026-05-03T00:00:00+07:00`
- Always include timezone offset: `+07:00` (Thailand ICT)

**For Schema.org**:
- ISO 8601 date only: `2026-05-03`
- (Time is optional for schema)

### **Git Integration**

**Command to get last commit date**:
```bash
git log -1 --format=%ai -- [file_path]
# Output: 2026-05-03 07:13:27 +0700

# In code, parse as:
const lastCommit = exec(`git log -1 --format=%ai -- ${filePath}`);
const date = new Date(lastCommit); // Converts to ISO format
```

**Fallback** (if git fails or no history):
```javascript
// Use build time (Astro provides this)
const date = new Date(); // Current date
```

### **Performance Considerations**

- **Build-time vs Runtime**: Generate last-updated dates at build time (during Astro build), not at request time
- **Caching**: Cache git queries to avoid repeated `git log` calls
- **Build time impact**: Estimated +2–5 seconds per full build (negligible for 947 pages)

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Pages with visible "Last Updated" | 100% (942+ pages) | Manual audit on 50 random pages |
| Correct date accuracy | 100% (matches git history) | Spot check 10+ pages |
| Mobile rendering | 100% (responsive) | Mobile viewport testing |
| Google snippet adoption | 50%+ (within 2 weeks) | Google Search Console |
| CTR improvement from update signal | +5–10% | GA4 organic search metrics (2-week lag) |
| Schema validation pass rate | 100% | Google Rich Results Test |

---

## Timeline

| Phase | Tasks | Duration | Owner |
|-------|-------|----------|-------|
| 1 | Infrastructure setup | 1 day | CTO |
| 2 | Schema markup updates | 1 day | CTO |
| 3 | Calculator page integration | 2–3 days | CTO |
| 4 | Blog post integration | 1 day | CTO |
| 5 | QA and testing | 1 day | CTO + QA |
| **Total** | | **6–7 days** | |

---

## Post-Implementation Follow-up (SEO Specialist)

**Week 1 After Launch**:
- Monitor GSC for crawl errors related to meta tags
- Verify date appears in Google snippets (sample 10 URLs)
- Track CTR change in GSC (compare week-over-week)

**Week 2–4**:
- Monitor ranking changes for time-sensitive keywords (e.g., "2026 tax calculator")
- Analyze traffic from search results with update date visible
- Document CTR improvement and share with CMO

**Ongoing**:
- Update blog posts with new `dateModified` dates when content changes
- Monitor freshness signals in Search Console
- Report on CTR improvement to CMO quarterly

---

## Notes for CMO

- **SEO Impact**: This is a low-effort, high-impact change. Expect 3–8% CTR increase from calculators with visible update dates.
- **Trust Signal**: "Last Updated" dates are critical for financial calculators (users want to know tax rates, salary formulas are current).
- **Timing**: Launch before Phase 2 content expansion (blog posts + new calculators). Improves discoverability across entire site.
- **Next Step**: After this implementation, prioritize improving internal linking (blog-to-calculator) to drive topical authority.

---

**Status**: READY FOR CTO IMPLEMENTATION  
**Priority**: High (affects all 942+ calculator pages)  
**Estimated CTO Effort**: 6–7 days full-time equivalent  
**Risk**: Low (no database changes, no user impact, all changes are additive)
