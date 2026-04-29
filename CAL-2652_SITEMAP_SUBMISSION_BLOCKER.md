# CAL-2652: Submit Bilingual Sitemaps to Google Search Console — BLOCKER REPORT

**Issue**: CAL-2652  
**Task**: Pre-gate: Submit bilingual sitemaps to Google Search Console  
**Status**: ⛔ BLOCKED — GSC property not verified in service account  
**Gate Deadline**: 2026-04-29 08:00 UTC (~10 hours away)  
**Priority**: HIGH (pre-gate critical)

---

## Summary

The automated sitemap submission script is ready and functional. However, the GSC property (`www.kamnuanlek.com`) must be verified and the service account must be granted access before sitemaps can be submitted via API.

**What's Ready**: ✅ Sitemaps are properly generated and bilingual  
**What's Blocked**: ⛔ GSC property access (manual setup required)  
**What's Needed**: Manual GSC configuration (15 minutes, can be parallelized with launch)

---

## Bilingual Sitemap Structure

The site uses a **single consolidated sitemap** with bidirectional hreflang linking:

```
Sitemap Index: https://www.kamnuanlek.com/sitemap-index.xml
├─ Main Sitemap: sitemap-0.xml (5487 lines, ~2500 URLs)
│  ├─ Thai URLs (canonical): /calculator/* + 775 Thai variants /คำนวณ*/
│  └─ English URLs (hreflang linked): /en/calculator/* + /en/คำนวณ*/
├─ LLM Sitemap: sitemap-llm.txt (for AI crawlers)
└─ Other sitemaps (articles, glossary, affiliates)
```

**Languages Declared in HTML**:
- Thai (th-TH): Default, canonical
- English (en): Variant, linked via hreflang in page head
- x-default: Resolves to Thai

**Hreflang Implementation**: Bidirectional in HTML `<head>` via BaseLayout.astro (line 175)

```html
<link rel="alternate" hreflang="th-TH" href="https://www.kamnuanlek.com/calculator/..." />
<link rel="alternate" hreflang="en" href="https://www.kamnuanlek.com/en/calculator/..." />
<link rel="alternate" hreflang="x-default" href="https://www.kamnuanlek.com/calculator/..." />
```

---

## Current Blocker: GSC Property Not Verified

### Error
```
❌ 'https://www.kamnuanlek.com/' is not a verified Search Console site in this account.
❌ 'sc-domain:kamnuanlek.com' is not a verified Search Console site in this account.
```

### Root Cause
The service account (`seo-reporting-bot@kamnuanlek-seo-api.iam.gserviceaccount.com`) does not have access to any GSC property for `www.kamnuanlek.com`. The property either:
1. Does not exist in Google Search Console, OR
2. Exists but the service account was not added as an editor/owner

### Prerequisites Needed

**Manual Setup Required** (no automation available):

1. **Verify Property in Google Search Console**
   - Go to: https://search.google.com/search-console
   - Click "Add property"
   - Enter: `https://www.kamnuanlek.com/`
   - Choose verification method:
     - ✅ Recommended: **HTML file** (upload verification file)
     - ✅ **Meta tag** (already present in HTML — line 176-177 of BaseLayout.astro)
     - ✅ **DNS record** (if you control DNS)
   - Complete verification

2. **Grant Service Account Access**
   - Once property is verified, go to **Settings > Users and permissions**
   - Click **Add user**
   - Enter: `seo-reporting-bot@kamnuanlek-seo-api.iam.gserviceaccount.com`
   - Set role: **Editor** (allows sitemap submission)
   - Confirm

3. **Verify Script Access** (after manual setup)
   - Run: `node scripts/submit-sitemaps-to-gsc.mjs`
   - Expected output: ✅ Sitemap submitted successfully

---

## What Happens After GSC Setup

Once the property is verified and the service account is granted access:

### Automatic Sitemap Submission
```bash
node scripts/submit-sitemaps-to-gsc.mjs
```

**Expected Output**:
```
🚀 Google Search Console Sitemap Submission

📍 Site URL: https://www.kamnuanlek.com/
📋 Sitemap Index: https://www.kamnuanlek.com/sitemap-index.xml

🔐 Authenticating with Google...
✅ Authentication successful

🔍 Verifying site ownership (URL-level): https://www.kamnuanlek.com/
✅ Site verified in GSC: https://www.kamnuanlek.com/

📤 Submitting sitemap: https://www.kamnuanlek.com/sitemap-index.xml
   to GSC site: https://www.kamnuanlek.com/
✅ Sitemap submitted successfully

✨ Sitemap submission complete!
📊 Site Information: Thai + English bilingual, hreflang linking enabled
⏱️  Google may take 24-48 hours to crawl and index new sitemaps.
```

### Indexation Timeline
- **Immediate**: Sitemap index added to GSC
- **24-48 hours**: Google crawls sitemaps and discovers new URLs
- **1-2 weeks**: Pages begin appearing in SERP
- **Expected**: Both Thai and English variants tracked separately with hreflang deduplication

---

## Tech Details

### Script Location
`scripts/submit-sitemaps-to-gsc.mjs`

### Credentials
- **Path**: `.env.gsc` (gitignored)
- **Service Account**: `seo-reporting-bot@kamnuanlek-seo-api.iam.gserviceaccount.com`
- **Scope**: `https://www.googleapis.com/auth/webmasters` (sitemap submission + read)
- **Key ID**: `7a015520fc5e939a48850aaa88b610c87d5b2327`

### API Used
- Google Search Console API v1
- Endpoint: `searchconsole.sitemap.submit()`
- Fallback: Both URL-level (`https://www.kamnuanlek.com/`) and domain-level (`sc-domain:kamnuanlek.com`)

---

## Impact & Timeline

### Without GSC Setup
- Sitemaps not submitted = slower discovery + longer indexation
- Self-serve discovery only (slower)
- No GSC data for monitoring/KPI tracking

### With GSC Setup (15 min manual work)
- ✅ Sitemaps submitted immediately
- ✅ Google knows about bilingual structure (hreflang respected)
- ✅ Monitoring dashboard available (crawl stats, coverage, etc.)
- ✅ KPI tracking enabled for launch metrics

### Gate Status
- **Non-blocking**: Site can launch without GSC
- **Recommended**: Complete before/immediately after launch for faster indexation
- **Ideal**: Complete within 24 hours of launch for optimal SERP timing

---

## Next Steps (Priority Order)

### Immediate (If Time Allows Before Gate)
1. [ ] Go to https://search.google.com/search-console
2. [ ] Add property: `https://www.kamnuanlek.com/`
3. [ ] Verify ownership (use meta tag or HTML file)
4. [ ] Add service account as Editor
5. [ ] Run: `node scripts/submit-sitemaps-to-gsc.mjs`
6. [ ] Verify ✅ in GSC dashboard

### Post-Launch (Within 24 Hours)
1. [ ] Monitor GSC for sitemap crawl status
2. [ ] Check coverage (should show ~2500 indexed)
3. [ ] Verify hreflang linking is recognized
4. [ ] Monitor for crawl errors

### Script Automation (Future)
- Can be integrated into CI/CD pipeline post-verification
- Can be run as scheduled task (daily/weekly GSC sync)
- Credentials already stored in `.env.gsc` (secured)

---

## Escalation

**Assigned To**: CMO (for user/property access setup)  
**Context**: Board has authorized deployment (CAL-2455)  
**Effort**: 15 minutes  
**Blocker Duration**: Until manual GSC configuration  

This is the **final pre-gate SEO infrastructure requirement**. Once resolved, launch can proceed with full monitoring enabled.
