---
name: CAL-2709 Critical Blocker — English Pages Not Generated
description: Hreflang tags point to /en/* pages that don't exist in dist; release blocker until fixed
type: project
---

## CRITICAL RELEASE BLOCKER — CAL-2709 QA Heartbeat (2026-04-29 04:05 UTC)

### Finding
**English pages (`/en/*`) do not exist in dist/, but hreflang tags point to them** → All hreflang=en links return 404s

### Evidence
1. Build: c7a61be (CAL-2706), 908 pages, 36.97s, clean exit
2. Thai pages contain valid hreflang tags:
   ```html
   <link rel="alternate" hreflang="th-TH" href="...">
   <link rel="alternate" hreflang="en" href="https://www.kamnuanlek.com/en/คำนวณ-*/">
   <link rel="alternate" hreflang="x-default" href="...">
   ```
3. But: `find dist -type d -name "en"` returns NOTHING
4. No `/en/` prefix pages in sitemap
5. i18n.ts configured for both 'th' and 'en' BUT no page generation logic

### Root Cause
- CAL-2619 merged hreflang TAGS (reference `/en/*` paths)
- But English page GENERATION was never implemented
- English calculator routes at `/calculator/*` redirect 301 to Thai (this is correct)
- Missing: `/en/*` mirror pages

### Impact
**RELEASE BLOCKER** — Cannot ship with broken hreflang links:
- SEO: Search engines crawl hreflang links → 404s → penalize crawl efficiency
- Trust: Missing English version signals incomplete implementation
- Verification: Prior cycles (CAL-2693, CAL-2679) marked "hreflang verified" but only checked TAGS, not actual pages

### Why Prior Cycles Missed This
CAL-2693 (UX) and CAL-2679 (QA) both verified "hreflang bidirectional ✓". But their checks only looked for:
- `grep "hreflang"` in pages (tags exist ✓)
- NOT: `find dist -name "*en*"` (pages exist? ✗)

This is a **verification gap** — must check both tags AND actual generated pages.

### Recommended Fix
**Option A** (Complete): Generate `/en/*` pages
- Mirror each Thai calculator at `/en/path/`
- Same calculator, English interface labels (via i18n.ts)
- Requires Astro dynamic page generation or static page creation

**Option B** (Interim): Remove broken hreflang tags
- Remove `hreflang="en"` links
- Keep only `hreflang="th-TH"` + `hreflang="x-default"`
- Simpler fix, no English pages needed
- Less ideal for multi-language strategy

### Status
- **Issue**: CAL-2709 (blocked)
- **Escalation**: Awaiting CTO decision on hreflang strategy
- **QA Status**: FAILED — Release cannot proceed until resolved
- **Launch Date**: 2026-04-30 (at risk)

### Future QA Verification
**Update QA checklist**:
- ✓ Verify hreflang TAGS exist
- ✓ Verify hreflang pages EXIST in dist (`find dist -path "*/en/*"`)
- ✓ Spot-check both th and en versions load
- ✓ Verify no 404 links in hreflang

**Do NOT mark "hreflang bidirectional verified" until both tags AND pages are confirmed.**

---

**Master Status**: Blocked by CAL-2709 hreflang issue
**Previous GREEN cycles**: CAL-2693 (UX), CAL-2679 (QA) — both missed page generation issue
