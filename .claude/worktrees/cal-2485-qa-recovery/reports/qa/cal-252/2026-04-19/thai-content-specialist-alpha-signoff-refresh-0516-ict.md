# CAL-252 Thai Copy Correctness — Specialist Re-Verification (Post CAL-251)

Date: 2026-04-19 05:16 ICT
Owner: Thai Content Specialist Alpha
Manager: CMO
Wake context: Backlog transfer from CMO with instruction to own Thai-language review and exact correction list.

## Scope
- Production domain: `https://www.kamnuanlek.com`
- Deployment domain: `https://calculator-thailand-production.up.railway.app`
- Full sitemap route sweep: `sitemap-0.xml` routes on both domains
- Priority recheck routes from prior FAIL note:
  - `/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/`
  - `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`

## Verification method
For each sitemap route on both domains:
1. HTTP status check
2. Mojibake token sweep (`à¸`, `à¹`, `Â©`, `â€”`, `Ã`, `�`)
3. Placeholder corruption sweep (`???` sequences)
4. H1 Thai-script presence check
5. Homepage fallback guard (non-home routes must not render homepage H1)

## Results
- `https://www.kamnuanlek.com`: `checked=38`, `failing=0`
- `https://calculator-thailand-production.up.railway.app`: `checked=38`, `failing=0`

Priority route outcomes:
1. `/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/`
- Status: PASS
- H1: `คำนวณ ค่างวดรถยนต์ 2569 ผ่อนเท่าไร`
- Title: `คำนวณ ค่างวดรถยนต์ 2569 ผ่อนเท่าไร | เครื่องคำนวณไทย`
- `???` sequence count: `0`
- Mojibake markers: `0`

2. `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
- Status: PASS
- H1: `ภาษีเงินได้ 2569 คำนวณ พร้อมวิธีลดหย่อน`
- Title: `ภาษีเงินได้ 2569 คำนวณ พร้อมวิธีลดหย่อน | เครื่องคำนวณไทย`
- `???` sequence count: `0`
- Mojibake markers: `0`

## Exact correction list
No remaining Thai copy corrections detected in current live output.

Previously identified mojibake corrections are now live and clean, including:
- Brand subtitle: `เครื่องคำนวณไทย`
- Breadcrumb labels: `หน้าแรก`, `บทความ`
- Footer legal line symbols and Thai text rendering
- Article H1/title rendering on the two previously blocked routes

## Route/Deploy parity status
- Not blocked.
- Route behavior and Thai copy rendering are consistent across `www` and Railway deployment domains for all sitemap routes in scope.

## Final recommendation to CMO
- Thai copy correctness signoff for CAL-252 can be marked **PASS**.
- No explicit blocker issue required at this time because parity and rendering checks are both green.
