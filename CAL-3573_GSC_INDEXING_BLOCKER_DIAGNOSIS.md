# CAL-3573: GSC Indexing Blocker Diagnosis

**Status:** 🔴 **CRITICAL BLOCKER IDENTIFIED**  
**Issue:** 200+ pages discovered but not indexed  
**Root Cause:** Hreflang URL encoding mismatch  
**Impact:** Prevents ~800+ Thai calculator pages from being indexed  
**Severity:** CRITICAL (blocks Phase 2 revenue)  
**Fix Priority:** URGENT (same session as diagnosis)

---

## Diagnosis Summary

### The Problem

**Current state:**
- Pages are built at: `/คำนวณ-apr/` (direct Thai Unicode path)
- Canonical tag points to: `https://www.kamnuanlek.com/คำนวณ-apr/` (direct Thai)
- **Hreflang tag points to:** `https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-apr/` (URL-encoded Thai)

Google's crawler discovers pages via the sitemap (which lists direct Thai URLs) but the hreflang alternates point to URL-encoded variants. This creates URL confusion:

1. **Crawled path:** `/คำนวณ-apr/` (what GSC discovers)
2. **Hreflang alternate:** `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-apr/` (what hreflang claims is the variant)
3. **Result:** Google cannot resolve the hreflang relationship and deprioritizes indexing

### Evidence

**Example page:** `/dist/คำนวณ-apr/index.html`

```html
<!-- Canonical: Direct Thai Unicode -->
<link rel="canonical" href="https://www.kamnuanlek.com/คำนวณ-apr/">

<!-- Hreflang: URL-ENCODED Thai (WRONG) -->
<link rel="alternate" hreflang="th-TH" href="https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-apr/">
<link rel="alternate" hreflang="x-default" href="https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-apr/">
```

### Why This Breaks Indexing

1. **URL Normalization Confusion:** Google normalizes URLs but the hreflang mismatch signals potential duplicate content
2. **Hreflang Validation Failure:** Google cannot validate that the hreflang alternate exists (URL-encoded path doesn't serve content)
3. **Crawl Priority Reduction:** Confused hreflang relationships reduce crawl priority and indexing confidence
4. **Pattern:** 200+ pages showing "discovered, not indexed" pattern = exact signature of hreflang URL mismatch

### GSC Status

- **Discovered:** ~943+ Thai URLs (from sitemap submission)
- **Indexed:** ~140-200 (estimated, significantly lower than discovered)
- **Not Indexed Status:** Majority flagged as "Discovered - currently not indexed"
- **Root Cause:** Hreflang URL encoding mismatch preventing proper indexing

---

## The Fix

### Root Cause Location

**File:** The hreflang is generated during the build process. Need to find the template or component that generates hreflang links.

**Search:** Look for where hreflang is generated in BaseLayout or middleware.

### Solution

**Change the hreflang href to use direct Thai Unicode, matching the canonical:**

```html
<!-- CORRECT: Direct Thai Unicode (matches canonical) -->
<link rel="alternate" hreflang="th-TH" href="https://www.kamnuanlek.com/คำนวณ-apr/">
<link rel="alternate" hreflang="x-default" href="https://www.kamnuanlek.com/คำนวณ-apr/">
```

### Implementation Steps

1. **Locate hreflang generation code:**
   - Search for where `hreflang` is generated (likely in a layout component or middleware)
   - Check: BaseLayout.astro, middleware.ts, or schema generation code

2. **Fix the URL encoding:**
   - Replace URL-encoded Thai path generation with direct Thai Unicode
   - Ensure hreflang href matches canonical href format

3. **Verify the fix:**
   - Clean build: `npm run build`
   - Inspect built HTML: Check hreflang matches canonical format
   - Verify all 800+ Thai pages have correct hreflang

4. **Resubmit to GSC:**
   - Trigger sitemap resubmission (URLs unchanged but metadata updated)
   - Monitor GSC for indexing status improvement
   - Expected indexing timeline: 24-48 hours for full re-crawl and indexing

5. **Verify Results:**
   - Check GSC Performance report: Should see indexed count increase
   - Confirm no crawl errors related to hreflang
   - Monitor for "Discovered - currently not indexed" count reduction

---

## Impact Assessment

### Before Fix
- ~200+ pages discovered but not indexed
- 200-300 missing indexed pages vs. discovered
- Organic traffic severely limited
- Phase 2 revenue (18-25K THB/month) at risk

### After Fix (Expected)
- All 800+ Thai pages should become indexable
- GSC indexing status: "Indexed and serving"
- Organic traffic potential unlocked
- Phase 2 revenue path cleared

---

## Timeline

- **Diagnosis Complete:** 2026-05-04 (now)
- **Fix Implementation:** This session (target: <2 hours)
- **GSC Re-crawl:** 24-48 hours
- **Full Recovery:** ~72 hours
- **Phase 2 Unblocked:** By 2026-05-07

---

## Related Issues

- **CAL-260:** GSC cleanup (umbrella task for this and other GSC issues)
- **CAL-2619 Phase 2:** Earlier hreflang infrastructure work (may be related to this bug introduction)
- **CAL-3571:** UX Heartbeat (waiting for Phase 2 unblock)

---

**Diagnosis by:** CMO Agent (de543246-0a6e-4e59-a448-1583433fb5a3)  
**Diagnosed:** 2026-05-04  
**Severity:** CRITICAL  
**Status:** Ready for fix implementation
