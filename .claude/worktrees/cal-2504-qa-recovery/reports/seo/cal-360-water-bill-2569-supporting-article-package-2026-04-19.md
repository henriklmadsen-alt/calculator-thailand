# CAL-360 Thai Content Package: Water-Bill 2569 Supporting Article Refresh (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-360](/CAL/issues/CAL-360)

## Wake-scope acknowledgement

- Wake reason handled directly: `issue_assigned`.
- No pending comments in wake payload (`0/0`), so this heartbeat executed direct content refresh on the assigned water-bill 2569 cluster.
- Scope stayed on this issue and did not switch lanes.

## Target URLs

- Calculator: `/คำนวณค่าน้ำ/`
- Primary supporting article: `/บทความ/คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ/`
- Utility hub page reinforced: `/คำนวณค่าไฟฟ้า/`

## Package shipped

1. Supporting article intent refresh for long-tail billing cases
- Updated metadata to include high-intent terms around threshold and minimum-charge behavior.
  - Title: `คำนวณค่าน้ำ 2569 | เช็กบิลก่อนจ่ายจริง | เครื่องคำนวณไทย`
  - Description: `สรุปวิธีคำนวณค่าน้ำ 2569 สำหรับ กปน. และ กปภ. พร้อมเคส 50/51 หน่วย ขั้นต่ำ 150 บาท จุดพลาดที่พบบ่อย และลิงก์เครื่องคำนวณค่าน้ำ`
- Added long-tail section: `เคส Long-tail ที่คนค้นบ่อยก่อนจ่ายบิลค่าน้ำ`
  - 50 vs 51 units step-change example (PWA table 1)
  - Same units but different MWA meter-size service-fee impact
  - Very-low-use case still hitting PWA minimum 150 THB floor
- Expanded FAQ to cover real billing edge cases:
  - `ใช้น้ำ 0 หน่วยแต่ยังมียอดค่าน้ำ`
  - `เลือกตาราง กปภ. 1/2/3 อย่างไร`

2. Authority-link reinforcement from utility hub
- Added direct utility-cluster links on `/คำนวณค่าไฟฟ้า/` to:
  - `/คำนวณค่าน้ำ/`
  - `/บทความ/คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ/`
- Link copy is calculation-intent aligned (budget planning + threshold/minimum-charge context).

3. Article index freshness alignment
- Updated water article date in `/บทความ/` listing to `2026-04-19`.

## Formula/source compliance

Status: `PASS`

- Formula statements remain aligned with calculator logic and official source classes per Thai formula policy.
- Official source anchors retained and clarified in article reference section:
  - MWA service-rate page (tier rates, meter service fees, raw-water surcharge context)
  - PWA table-price page (tier tables, 150 THB minimum charge)
  - PWA customer-type page (>50 m3/month type-switch rule)

Official sources:
- https://www.mwa.co.th/services/users-should-know/users-service-rate/service-rate/
- https://www.pwa.co.th/contents/service/table-price
- https://www.pwa.co.th/contents/service/customer-type

## Quality + verification evidence

Commands executed:

```bash
node -e "/* Thai word count + metadata lengths for water article */"
rg -n "50/51|ขั้นต่ำ 150|ทำไมบางเดือนใช้น้ำ 0 หน่วย|/คำนวณค่าน้ำ/" src/pages/บทความ/คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ/index.astro src/pages/คำนวณค่าไฟฟ้า/index.astro src/pages/บทความ/index.astro -S
npm run verify:public-content
npm run build
```

Observed results:

- Water article Thai word count: `1373`
- Metadata lengths:
  - title: `56` chars
  - description: `126` chars
- New long-tail lines and utility-hub links are present in source.
- `verify:public-content` passed.
- `build` passed and generated both refreshed routes:
  - `/คำนวณค่าน้ำ/`
  - `/บทความ/คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ/`

## Files changed

- `src/pages/บทความ/คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ/index.astro`
- `src/pages/คำนวณค่าไฟฟ้า/index.astro`
- `src/pages/บทความ/index.astro`
- `reports/seo/cal-360-water-bill-2569-supporting-article-package-2026-04-19.md`
