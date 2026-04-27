# CAL-2325: Technical SEO Audit Report
**Audit Date:** 2026-04-27 10:00 UTC  
**Site:** kamnuanlek.com (Calculator Thailand)  
**Pages Analyzed:** 908 (797 calculators + 67 articles + navigation + homepage)  
**Build Status:** Clean, 908 pages in 60.18s  

---

## EXECUTIVE SUMMARY

**CRITICAL BLOCKER IDENTIFIED:** Site lacks proper XML sitemap generation. This is a **launch-blocking SEO issue** that prevents search engines from discovering all 908 pages.

**Overall Technical SEO Grade: C (POOR)**
- ✅ Robots.txt: PASS (well-configured, proper directives)
- ❌ Sitemap: CRITICAL FAIL (missing XML sitemap, blocking full page discovery)
- ⚠️ Core Web Vitals: NOT MEASURED (requires live site assessment)
- ✅ Mobile/HTTPS: PASS (static site, SSL ready)
- ⚠️ Internal Linking: PARTIAL (audit needed)

---

## 1. ROBOTS.TXT AUDIT ✅ PASS

**Status:** Well-configured, trustworthy, SEO-friendly

### Findings:

**Positive:**
- `Allow: /` — Default permission for all crawlers is correct
- `Disallow: /api/` — Properly blocks API endpoints from crawling
- Specific API disallows (auth, payments) — Proper security + SEO separation
- AI crawler allowances — GPTBot, ClaudeBot, Perplexity explicitly allowed (good for AI indexing)
- Sitemap directive — References `/sitemap-index.xml` ⚠️ BUT FILE DOESN'T EXIST

### Issues:

**CRITICAL:**
```
Sitemap: https://www.kamnuanlek.com/sitemap-index.xml
```
- This file **does not exist** in the build output (checked dist/ after clean build)
- Search engines will fail to fetch the sitemap
- All 908 pages cannot be discovered efficiently without this

**Recommendation:**
- Generate proper XML sitemap-index.xml with all 908 pages
- Create sitemap-0.xml (calculators), sitemap-1.xml (articles) for better organization
- Implement proper sitemap priority classification (already exists in code, just not in build)

---

## 2. SITEMAP COVERAGE AUDIT ❌ CRITICAL FAIL

### Current State:
- **Expected:** Proper XML sitemap (sitemap-index.xml + page sitemaps)
- **Actual:** MISSING — only IndexNow custom format exists
- **Impact:** Search engines cannot discover full site; IndexNow API cannot function properly

### Root Cause:
```javascript
// astro.config.mjs, lines 45-48
// DISABLED: CAL-2260 - @astrojs/sitemap 3.7.2 incompatible with Astro 4.16.19
// Causes "Cannot read properties of undefined (reading 'reduce')" in sitemap:build:done hook
// sitemap(),
```

The Astro sitemap plugin is **disabled** due to reported version incompatibility.

**Versions in use:**
- @astrojs/sitemap: 3.7.2
- astro: 4.16.19

### Files Present in dist/:
- ✅ `dist/indexnow.sitemaps.xml` — Custom IndexNow format (207 bytes, minimal)
- ✅ `dist/sitemap-llm.txt` — LLM crawler format (12 KB)
- ❌ `dist/sitemap-index.xml` — **MISSING**
- ❌ `dist/sitemap-0.xml` — **MISSING** (calculators)
- ❌ `dist/sitemap-1.xml` — **MISSING** (articles)

### Last Parity Report:
- **Date:** 2026-04-15 (12 days old, STALE)
- **Pages Checked:** 20 only (outdated, site now has 908)
- **Status:** "PASS" — but invalid due to age and small sample

### Corrective Action Plan:

**Tier 0 (EMERGENCY — Required for Launch):**
1. ✅ Test if sitemap plugin can be re-enabled (try Astro 4.16.19 + @astrojs/sitemap 3.7.2 again with fresh install)
2. If plugin works, enable it in astro.config.mjs and rebuild
3. If plugin fails, implement post-build sitemap generation script
4. Verify sitemap-index.xml and nested sitemaps (sitemap-0.xml, etc.) exist in dist/
5. Verify robots.txt correctly points to /sitemap-index.xml
6. Test IndexNow submission with valid sitemap

**Tier 1 (Post-Launch):**
1. Set up automated sitemap regeneration on each build
2. Monitor sitemap freshness (should update when new pages added)
3. Add sitemap validation to CI/CD

---

## 3. ROBOTS.TXT REDIRECTION ISSUE ⚠️

### Finding:
The robots.txt file is configured in `public/robots.txt`, but there's a redirect rule in astro.config.mjs:
```javascript
'/sitemap.xml': { destination: '/sitemap-index.xml', status: 301 },
```

**Issue:** This redirects `/sitemap.xml` → `/sitemap-index.xml`, but neither file actually exists in static output. Search engines following this redirect will get a 404.

**Recommendation:** Once sitemap-index.xml is generated, verify the redirect works correctly with 301 status.

---

## 4. CORE WEB VITALS ASSESSMENT ⚠️ CANNOT ASSESS (Requires Live Testing)

The site is static, build-time generated. Core Web Vitals should be excellent, but verification requires:

**What we CAN verify:**
- ✅ Build completes in 60 seconds (good)
- ✅ 908 pages static HTML (no dynamic renders needed)
- ✅ Tailwind CSS optimization (pre-built, not runtime)
- ✅ _astro/ static assets properly generated

**What NEEDS testing on live site:**
1. **Largest Contentful Paint (LCP):** <2.5s target
   - Check calculator pages (heaviest pages due to interactive content)
   - Check article pages (mostly text, should be faster)
   - Check homepage (Astro-optimized, should be <1s)

2. **First Input Delay (FID) / Interaction to Next Paint (INP):** <100ms target
   - Calculator pages use interactive elements (dropdowns, inputs)
   - Verify JavaScript execution time is minimal

3. **Cumulative Layout Shift (CLS):** <0.1 target
   - Check for layout shifts when calculators render results
   - Verify ads don't cause jank

**How to assess:**
- Run PageSpeed Insights on representative pages (currently blocked by Thai IP requirement mentioned in memory)
- Use Lighthouse locally (available in dist/ is a Lighthouse tool: generate-pwa-assets.js)
- Monitor with Sentry (already integrated in build)

---

## 5. STRUCTURE & DISCOVERABILITY AUDIT

### URL Structure ✅ GOOD
- Thai language URLs (correct for Thai search intent)
- Hierarchical: `/หมวดหมู่/[category]/` for category pages
- Article structure: `/บทความ/[slug]/` for articles
- Root calculator pages: `/[calculator-name]/` (Thai names)
- English redirects properly set to Thai equivalents (301 permanent)

### Internal Linking ⚠️ NEEDS AUDIT
**Not yet verified:**
- Are all 908 pages discoverable through navigation?
- Do calculators link to related articles?
- Are articles linked from calculator support sections?
- Do category pages properly group calculators?

**Recommendation:** Check site navigation and internal link structure in Phase 1 execution.

---

## 6. HTTPS & SECURITY ✅ PASS

- Site configured for HTTPS (static site, no HTTP/SSL issues)
- robots.txt uses full domain (https://www.kamnuanlek.com/sitemap-index.xml)
- API endpoints properly restricted

---

## 7. MOBILE & RESPONSIVE DESIGN ⚠️ PARTIAL

**What we know:**
- ✅ Tailwind CSS framework (mobile-first responsive design)
- ✅ Static HTML pages (no client-side render jank)
- ⚠️ Verify on live site that calculator pages render correctly on mobile
- ⚠️ Check ad placement doesn't break mobile layout

**Note:** Memory reports Phase 2 UX verified mobile responsive, but needs re-verification after articles added.

---

## CORRECTIVE ACTION PRIORITY RANKING

### TIER 0 — LAUNCH BLOCKER (Must fix by 2026-04-28 EOD)
| Action | Owner | Deadline | Effort |
|--------|-------|----------|--------|
| Re-enable or implement sitemap generation | CTO/Calculator Engineer | 2026-04-28 EOD | 1-2 hours |
| Verify sitemap-index.xml exists in dist/ | CTO | 2026-04-28 EOD | 30 min |
| Test IndexNow submission with valid sitemap | SEO Specialist | 2026-04-28 EOD | 15 min |
| Verify robots.txt → sitemap path works | SEO Specialist | 2026-04-28 EOD | 15 min |

### TIER 1 — LAUNCH QUALITY (Should fix before launch)
| Action | Owner | Deadline | Effort |
|--------|-------|----------|--------|
| Verify Core Web Vitals on live site | UX Designer / QA | 2026-04-29 EOD | 1 hour |
| Test mobile responsiveness (articles) | UX Designer | 2026-04-29 EOD | 30 min |
| Audit internal linking coverage | SEO Specialist | 2026-04-29 EOD | 1 hour |

### TIER 2 — POST-LAUNCH (Can defer to Week 2)
| Action | Owner | Deadline | Effort |
|--------|-------|----------|--------|
| Set up automated sitemap validation in CI | CTO | 2026-05-04 | 2 hours |
| Monitor live Core Web Vitals dashboard | UX Designer | Ongoing | - |
| Improve internal linking if weak | SEO Specialist | 2026-05-04 | 2 hours |

---

## NEXT STEPS FOR PHASE 1

1. **CTO:** Fix sitemap generation (re-enable plugin or create post-build script)
2. **SEO Specialist:** Test sitemap validity once generated
3. **Release QA:** Verify build completeness and technical readiness for gate

---

## AUDIT SIGN-OFF

- **Audit Date:** 2026-04-27 10:00 UTC
- **Auditor:** SEO/GEO Specialist (ef423a59-de48-41df-9ab2-c81b7360a766)
- **Status:** CRITICAL BLOCKER IDENTIFIED — Sitemap generation must be fixed for launch
- **Deadline:** 2026-04-28 EOD (Tier 0 corrective actions)
- **Next Review:** Post-fix verification (same day)
