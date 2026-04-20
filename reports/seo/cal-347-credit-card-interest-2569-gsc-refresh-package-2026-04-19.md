# CAL-347 Thai Content Specialist: GSC Refresh Package for Credit-Card-Interest 2569 (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-347](/CAL/issues/CAL-347)

## Wake-scope acknowledgement

- Wake reason used directly: `issue_assigned`.
- No pending wake comments (`0/0`), so this heartbeat executed direct source-side refresh on the assigned credit-card-interest 2569 scope.

## GSC data constraint

- Search Console API access is not available in this runtime, so this package is delivered as a source-side CTR/intent refresh with verification evidence.
- Scope stayed on the assigned route cluster and did not switch issues.

## Target URLs

- Calculator: `/คำนวณดอกเบี้ยบัตรเครดิต/`
- Primary supporting article: `/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/`
- Legacy compatibility article route kept live: `/บทความ/ดอกเบี้ยบัตรเครดิต-คิดยังไง-จ่ายขั้นต่ำ-2569/`

## Refresh shipped

1. SERP-intent metadata refresh (`คิดยังไง`, `ขั้นต่ำ 8%`)
- Article title updated to:
  - `ดอกเบี้ยบัตรเครดิต 2569 คิดยังไง | ขั้นต่ำ 8% | ลดหนี้เร็ว`
- Article description updated for clearer query alignment while preserving BOT-grounded context.
- Calculator title updated to:
  - `คำนวณดอกเบี้ยบัตรเครดิต 2569 | คิดยังไง ขั้นต่ำ 8%`
- Metadata length check:
  - article title: `58` chars
  - article description: `144` chars
  - calculator title: `50` chars
  - calculator description: `121` chars

2. Query-answer block added above long-form section
- New section: `คำค้นที่คนหาบ่อย และคำตอบสั้นก่อนคำนวณ`
- Covers high-intent variants before the deep explanation:
  - `ดอกเบี้ยบัตรเครดิตคิดรายวันหรือรายเดือน`
  - `จ่ายขั้นต่ำ 8% พอไหม`
  - `ควรเริ่มคำนวณจากยอดไหน`

3. Internal-link strengthening for conversion path
- Added fast-path article link to `/คำนวณค่างวดบัตรเครดิต/` in shortcut section.
- Added `/คำนวณค่างวดบัตรเครดิต/` in related calculators section.
- Updated calculator-side supporting card label to match refreshed article intent copy.
- Updated article hub card title/description for the refreshed page.

4. FAQ intent expansion
- Added FAQ item:
  - `ดอกเบี้ยบัตรเครดิตคิดรายวันหรือรายเดือน?`
- Answer explicitly maps to daily-rate framing and round-bill day counting.

## Formula and source compliance

Status: `PASS`

- Formula/policy claims remain aligned with calculator logic and BOT references.
- Date-bound policy wording retained:
  - temporary minimum payment at `8%` through `31 ธันวาคม 2569`
- Official sources retained:
  - `https://www.bot.or.th/th/satang-story/digital-fin-lit/creditcard.html`
  - `https://www.bot.or.th/th/news-and-media/news/news-20251204-2.html`

## Verification evidence

Commands executed:

```bash
node -e "/* Thai word count + title/description lengths for article */"
node -e "/* title/description lengths for calculator */"
rg -n "const title =|const pageTitle =|คำนวณค่างวดบัตรเครดิต|ดอกเบี้ยบัตรเครดิตคิดรายวันหรือรายเดือน|news-20251204-2" \
  src/pages/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/index.astro \
  src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro \
  src/pages/บทความ/index.astro -S
npm run verify:public-content
npm run build
```

Observed:

- Article content density after refresh: `wordCount=1331`
- Metadata length checks passed target range for this refresh.
- New/updated intent lines and links present in source.
- `verify:public-content` passed.
- `build` passed and generated:
  - `/คำนวณดอกเบี้ยบัตรเครดิต/index.html`
  - `/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/index.html`
  - `/บทความ/ดอกเบี้ยบัตรเครดิต-คิดยังไง-จ่ายขั้นต่ำ-2569/index.html`

## Files changed

- `src/pages/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/index.astro`
- `src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro`
- `src/pages/บทความ/index.astro`
- `docs/superpowers/plans/2026-04-19-cal-347-credit-card-interest-gsc-refresh.md`
- `reports/seo/cal-347-credit-card-interest-2569-gsc-refresh-package-2026-04-19.md`
