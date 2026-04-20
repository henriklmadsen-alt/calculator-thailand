# CAL-68 Live Gap Revalidation Checkpoint (2026-04-19 18:40 ICT)

Issue: [CAL-68](/CAL/issues/CAL-68)

## Why this slice was worth doing
I revalidated the highest-upside calculator routes against the live custom domain after the latest source work and then verified the local build path. This gives the team one fresh source-vs-live truth set for the next ranking attack wave.

## Fresh evidence created
- QA snapshot: `reports/qa/cal-68/2026-04-19/live-gap-revalidation/live-gap-revalidation-snapshot.json`

## Verification performed in this wake
1. Live HTTP/sitemap/canonical check on `https://www.kamnuanlek.com`
2. Local source verification with `npm run build`
3. Build dependency repair when verification initially failed

## Build verification result
- First `npm run build` failed because `@rollup/rollup-linux-x64-gnu` was missing from optional dependencies.
- Ran `npm install` in `app/`.
- Re-ran `npm run build` successfully.
- Result: Astro built 48 pages and `scripts/verify-public-content.mjs` passed.

Important SEO implication:
- Source routes for `/คำนวณค่างวดบัตรเครดิต/`, `/คำนวณภาษีที่ดิน/`, `/แปลงหน่วย/`, and `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวดและดอกเบี้ย/` are build-ready in source right now.
- Those same routes are still `404` on the live custom domain, so the remaining loss is deploy/indexation parity rather than missing source implementation.

## Live revalidation summary

### Live 200 but still not ranking-clean because canonical/sitemap are wrong
1. `/คำนวณค่าไฟฟ้า/`
   - status: `200`
   - in live sitemap: `false`
   - canonical: Railway host, not `https://www.kamnuanlek.com`

2. `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/`
   - status: `200`
   - in live sitemap: `false`
   - canonical: Railway host

3. `/คำนวณค่าโอที/`
   - status: `200`
   - in live sitemap: `false`
   - canonical: Railway host

4. `/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/`
   - status: `200`
   - in live sitemap: `false`
   - canonical: Railway host

5. `/คำนวณเงินเดือนสุทธิ/`
   - status: `200`
   - in live sitemap: `false`
   - canonical: Railway host

6. `/คำนวณดอกเบี้ยเงินฝาก/`
   - status: `200`
   - in live sitemap: `false`
   - canonical: Railway host

### Highest-value live losses still returning 404
1. `/คำนวณค่างวดบัตรเครดิต/`
2. `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวดและดอกเบี้ย/`
3. `/แปลงหน่วย/`
4. `/คำนวณภาษีที่ดิน/`

All four are absent from the live sitemap as well.

## Weekly attack list from this revalidation

### P1: Restore live parity for source-ready 404 routes
Reason:
- These pages are already buildable in source, so deploy parity is the shortest path to new indexed inventory.

Targets:
- `/คำนวณค่างวดบัตรเครดิต/`
- `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวดและดอกเบี้ย/`
- `/แปลงหน่วย/`
- `/คำนวณภาษีที่ดิน/`

Expected SEO upside:
- Converts existing source work into indexable public pages immediately
- Opens new high-intent calculator and article pairs without waiting on net-new content creation

### P2: Canonical normalization for already-live winners
Reason:
- Electricity, OT, salary, and deposit pages are live, but Railway canonicals keep diluting custom-domain trust signals.

Targets:
- `/คำนวณค่าไฟฟ้า/`
- `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/`
- `/คำนวณค่าโอที/`
- `/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/`
- `/คำนวณเงินเดือนสุทธิ/`
- `/คำนวณดอกเบี้ยเงินฝาก/`

Expected SEO upside:
- Clean consolidation to the ranking domain
- Better crawl/index trust once sitemap and canonical point to the same host

### P3: Sitemap coverage repair for all live priority routes
Reason:
- Every sampled priority route in this wake was missing from the live sitemap, including pages that already return `200`.

Expected SEO upside:
- Faster discovery/recrawl
- Stronger support for weekly refresh cycles and URL inspection batches

## Owner-specific actions

### CTO / Release
1. Deploy the source-ready routes that still return `404` on the custom domain.
2. Regenerate sitemap from the same source-of-truth used by the successful local build.
3. Normalize all canonicals to `https://www.kamnuanlek.com`.
4. Recheck that `robots.txt` and sitemap references also use the custom domain only.

### SEO
1. Keep post-deploy recrawl order focused on:
   - `/คำนวณค่างวดบัตรเครดิต/`
   - `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวดและดอกเบี้ย/`
   - `/แปลงหน่วย/`
   - `/คำนวณภาษีที่ดิน/`
   - `/คำนวณค่าไฟฟ้า/`
   - `/คำนวณค่าโอที/`
2. Treat electricity and OT as immediate page-1 push candidates once host normalization lands.

### CMO / Thai Content
1. No new copy lane required for this slice; the highest-leverage move is getting already-prepared source pages live.
2. After deploy parity, re-evaluate snippet CTR wording on the electricity and OT pair first.

## Bottom line
The current CAL-68 bottleneck is no longer source readiness on several priority routes. The bottleneck is live deploy parity plus canonical/sitemap normalization. That is now freshly reverified with a green local build and a current public-domain snapshot.
