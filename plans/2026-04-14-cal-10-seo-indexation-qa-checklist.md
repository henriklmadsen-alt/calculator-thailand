# CAL-10 Technical SEO QA Checklist

Last updated: 2026-04-14
Owner: CTO
Related issue: [CAL-10](/CAL/issues/CAL-10)

## Goal
Prevent crawl/index regressions before each release by validating robots, sitemap, and canonical consistency.

## 1) Pre-build configuration checks
- Confirm `PUBLIC_SITE_URL` is set to the single production domain (no trailing slash).
- Confirm `astro.config.mjs` uses `process.env.PUBLIC_SITE_URL` fallback and not hardcoded per-page domains.
- Confirm no page frontmatter references legacy domains:
  - `rg -n "calculator-thailand-production\\.up\\.railway\\.app" src -S`

## 2) Build-time SEO artifact checks
- Run build:
  - `npm run build`
- Verify generated sitemap files exist in output:
  - `dist/sitemap-index.xml`
  - one or more `dist/sitemap-*.xml`
- Verify `dist/robots.txt` includes only one sitemap authority:
  - `Sitemap: /sitemap-index.xml`

## 3) Canonical integrity checks
- Verify no mojibake canonical URLs or Thai slugs:
  - `rg -n "à" src/layouts src/pages -S`
- Spot-check representative pages in `dist` for canonical:
  - home (`/`)
  - one calculator route
  - one article route
- Confirm each page has exactly one canonical tag and it points to `PUBLIC_SITE_URL` + route.

## 4) Sitemap coverage checks
- Build expected route set from `src/pages` for live calculators and articles.
- Compare against URLs in generated sitemap files.
- Confirm no orphan calculator/article pages and no stale removed URLs.

## 5) Post-deploy checks
- Open production:
  - `/robots.txt`
  - `/sitemap-index.xml`
- Confirm HTTP 200 responses.
- Run URL Inspection in Search Console for one calculator and one article page.
- Re-submit sitemap if domain or URL structure changed.

## Release gate
Ship only when all sections above pass. If any check fails, keep issue `in_progress` or move to `blocked` with a clear blocker comment.
