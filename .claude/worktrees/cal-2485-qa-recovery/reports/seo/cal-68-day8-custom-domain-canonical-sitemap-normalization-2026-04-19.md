# CAL-68 Day-8 Source SEO Action (Custom-domain canonical/sitemap normalization)

## Context
- Trigger comments: `8beaa91f-6152-4751-a280-d7e90af859ab`, `c6ba0cbb-d837-48a9-9ab8-90df4e95650a`, `a90644b7-630f-4b35-b436-10ec2e82766b`
- Input artifacts:
  - `app/reports/seo/cal-68-gsc-operating-loop-checkpoint-2026-04-19.md`
  - `app/reports/qa/cal-68/2026-04-19/gsc-loop/gsc-operating-loop-snapshot.json`
  - `app/reports/qa/cal-68/2026-04-19/gsc-loop/release-route-integrity-after.json`

## Day-8 unblocked ranking action shipped (source-side)
Objective: remove Railway-host canonical/sitemap defaults in source so deployed pages publish discovery signals on `https://www.kamnuanlek.com`.

### Changes implemented
1. Custom-domain sitemap/canonical base
- `astro.config.mjs`: site changed to `https://www.kamnuanlek.com`.
- `src/layouts/BaseLayout.astro`: canonical/OG/site JSON-LD base host changed to custom domain.
- `src/layouts/BlogPostLayout.astro`: canonical/JSON-LD base host changed to custom domain.

2. Calculator/article canonical fallback normalization
- Replaced default fallback host from Railway to custom domain across calculator + article pages using `siteUrl` defaults.
- Scope: all source matches in `src/` where `https://calculator-thailand-production.up.railway.app` was used as canonical fallback.

3. Crawl-surface and AI-surface host normalization
- `public/robots.txt`: sitemap declarations now point to custom-domain sitemap URLs.
- `public/sitemap.xml`: host values normalized to custom domain.
- `public/llms.txt`, `public/llms-full.txt`, `public/og-image.svg`: host text normalized to custom domain.

## Verification evidence
- Command: `npm run build`
- Result: PASS
- Build output: `48` pages generated; public-content guard PASS.
- Dist sitemap proof:
  - `dist/sitemap-index.xml` loc host = `https://www.kamnuanlek.com`
  - `dist/sitemap-0.xml` loc hosts = `https://www.kamnuanlek.com`
- Source grep proof:
  - `rg "calculator-thailand-production\.up\.railway\.app" -S astro.config.mjs src public` -> no matches

## Deploy-ready recrawl packet (submit after production deploy)
- `/คำนวณภาษีที่ดิน/`
- `/บทความ/ภาษีที่ดิน-2569-อัตราและวิธีคำนวณ/`
- `/แปลงหน่วย/`
- `/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/`
- `/คำนวณค่างวดบัตรเครดิต/`
- `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/`
- `/คำนวณวันคลอด/`
- `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/`
- `/คำนวณค่าโอที/`
- `/คำนวณค่าไฟฟ้า/`

## Remaining blockers (owner explicit)
- Deploy/live parity blocker: CTO (via CMO) must release these source changes to production before recrawl/index requests can succeed on live.
- GSC metrics blocker: CMO must provide authenticated Search Console property access; if unresolved, CMO escalates to CEO/board.

## CAL-68 status
- Kept `in_progress`.
- This heartbeat ships a concrete source-side SEO growth action while Search Console auth remains blocked.
