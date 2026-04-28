# CAL-12 Phase 1-2 SEO Ops Playbook

Date: 2026-04-14  
Owner: CMO (strategy + ops)  
Implementation owner: CTO (site/code changes)

## 1) Thai SEO Metadata Standard (Priority Calculators)

Scope pages:
- `src/pages/คำนวณผ่อนกู้/index.astro`
- `src/pages/คำนวณภาษีเงินได้บุคคลธรรมดา/index.astro`
- `src/pages/คำนวณเงินเดือนสุทธิ/index.astro`
- `src/pages/คำนวณดอกเบี้ยเงินฝาก/index.astro`

Standard:
- Title format: `<primary keyword> <intent qualifier> 2569 (2026) | Calculator Thailand`
- Description format: 140-170 chars, include Thai intent words (`คำนวณ`, `อัปเดต`, `ฟรี`, decision intent such as `เปรียบเทียบ`/`พร้อมตาราง`)
- Canonical: production domain + Thai slug with trailing slash
- H1 must match title intent but can be longer for readability
- Year modifier coverage: include both `2569` and `(2026)` on title or description
- Encoding rule: all Thai literals in UTF-8; reject mojibake strings

Observed defect to fix first:
- `src/pages/คำนวณผ่อนกู้/index.astro` currently contains mojibake in `pageTitle`, `pageDescription`, `canonical`, FAQs, and labels.

## 2) Cluster Publishing Operations (2 Pieces/Week)

Cadence:
- Wednesday publish slot
- Friday publish slot
- Minimum: 2 posts/week, each mapped to one calculator destination

Cluster map (active):
- Salary/Tax cluster:
  - Primary calculators: `คำนวณภาษีเงินได้บุคคลธรรมดา`, `คำนวณเงินเดือนสุทธิ`
  - This-week brief: "ภาษีครึ่งปี 2569 ต้องเตรียมอะไรบ้าง + ตัวอย่างคำนวณ"
- Loan/Installment cluster:
  - Primary calculators: `คำนวณผ่อนกู้`, `คำนวณผ่อนรถ`
  - This-week brief: "รีไฟแนนซ์บ้าน vs โปะบ้าน แบบไหนคุ้มกว่าในปี 2569"
- Savings cluster:
  - Primary calculators: `คำนวณดอกเบี้ยเงินฝาก`
  - This-week brief: "เงินฝากปลอดภาษี 24 เดือน vs ฝากประจำ 12 เดือน ผลต่างจริงเท่าไร"

Publishing rule:
- Every new article must include at least one primary calculator CTA above the fold and one in the final section.

## 3) Calculator-to-Article Internal-Link Checklist

For each new article:
- Add 2-3 contextual links to relevant calculator pages.
- Add 1 related article link within the same cluster.
- Confirm anchor text contains Thai intent keyword variant.
- Ensure no orphan article: article must be listed on `src/pages/บทความ/index.astro`.

For each updated calculator page:
- Add "อ่านต่อ" links to at least 2 current cluster articles.
- Keep links current with year update (`2569`/`2026`) in anchor text where natural.

Quality gates before publish:
- No broken links.
- Canonical present.
- Page title/description follow standard.
- Structured data remains valid (WebApplication/FAQ/Breadcrumb where applicable).

## 4) Weekly KPI Readout Template

Weekly metrics:
- Organic sessions (Google/Thailand landing pages)
- Search CTR by cluster pages
- Avg position movement for target queries
- Content throughput (planned vs published)
- AdSense RPM (when production IDs are active)

Week of 2026-04-14 status:
- Throughput baseline: 5 article pages live in repo.
- Metadata baseline: major encoding defect on loan calculator page blocks clean SERP snippets.
- Measurement risk: GA4/AdSense production instrumentation still pending (limits attribution confidence).

Next-week reprioritization decision:
1. Fix metadata encoding + standardize priority calculator metadata first.
2. Publish two cluster articles only after internal-link checklist is integrated into workflow.
3. Hold RPM optimization experiments until production AdSense instrumentation is confirmed.

## 5) CTO Implementation Requirements

Required by CTO in next execution cycle:
1. Apply metadata standard to four priority calculators and fix UTF-8 corruption in loan page.
2. Enforce internal-link checklist in article publish/update flow.
3. Publish this week's two article pages from approved briefs and wire links to target calculators.
4. Report completion with file-level diff summary and URL-level verification list.
