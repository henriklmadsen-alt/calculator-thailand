# CAL-68 Top-3 Internal-Link + Recrawl Packet (Public evidence mode)

Issue: [CAL-68](/CAL/issues/CAL-68)  
Wake trigger: [comment 7e606dc4](/CAL/issues/CAL-68#comment-7e606dc4-7d82-4bbd-b047-90d16d838317)  
Related auth blocker: [CAL-260](/CAL/issues/CAL-260)

## Public evidence artifacts
- `app/reports/qa/cal-68/2026-04-19/gsc-loop/public-internal-link-recrawl-source-scan.json`
- `app/reports/qa/cal-68/2026-04-19/gsc-loop/public-internal-link-presence-scan-top3.json`
- `app/reports/qa/cal-68/2026-04-19/gsc-loop/public-live-route-upside-checkpoint.json`

## Target route state (live)
- `https://www.kamnuanlek.com/คำนวณค่าไฟฟ้า/` -> `200`, not in sitemap, canonical still Railway host.
- `https://www.kamnuanlek.com/คำนวณค่าโอที/` -> `200`, not in sitemap, canonical still Railway host.
- `https://www.kamnuanlek.com/คำนวณค่างวดบัตรเครดิต/` -> `404`, not in sitemap.

## Internal-link packet (exact source pages)

| Source page (link-from) | Target URL | Anchor/context recommendation | Live evidence | Owner action |
| --- | --- | --- | --- | --- |
| `https://www.kamnuanlek.com/` | `https://www.kamnuanlek.com/คำนวณค่าไฟฟ้า/` | Anchor: `คำนวณค่าไฟฟ้า 2569`; context: utilities card in popular calculators block | link present on live | SEO keep; CTO ensure canonical+sitemap after deploy |
| `https://www.kamnuanlek.com/คำนวณค่าน้ำ/` | `https://www.kamnuanlek.com/คำนวณค่าไฟฟ้า/` | Anchor: `คำนวณค่าไฟฟ้า`; context: related calculators block for monthly utilities planning | link present on live | SEO keep; CTO deploy canonical normalization |
| `https://www.kamnuanlek.com/บทความ/คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ/` | `https://www.kamnuanlek.com/คำนวณค่าไฟฟ้า/` | Anchor: `คำนวณค่าไฟฟ้า`; context: “วางแผนค่าสาธารณูปโภครวมรายเดือน” related-tools section | link present on live | SEO keep; CMO/Thai Content keep intent wording in final copy |
| `https://www.kamnuanlek.com/` | `https://www.kamnuanlek.com/คำนวณค่าโอที/` | Anchor: `คำนวณค่าโอที 2569`; context: salary/work cluster in homepage card grid | link present on live | SEO keep; CTO ensure sitemap inclusion |
| `https://www.kamnuanlek.com/คำนวณเปอร์เซ็นต์/` | `https://www.kamnuanlek.com/คำนวณค่าโอที/` | Anchor: `คำนวณค่าโอที 2569`; context: related calculators (income growth / overtime %) | link missing on live (source prepared previously) | CTO deploy latest source; SEO verify parity after deploy |
| `https://www.kamnuanlek.com/บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/` | `https://www.kamnuanlek.com/คำนวณค่าโอที/` | Anchor: `คำนวณค่าโอที 2569`; context: related links for salary uplift calculations | link missing on live (source prepared previously) | CTO deploy latest source; SEO parity check |
| `https://www.kamnuanlek.com/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/` | `https://www.kamnuanlek.com/คำนวณค่าโอที/` | Anchor: `เครื่องคำนวณค่าโอที`; context: overtime tax note section | link missing on live (source prepared previously) | CTO deploy latest source; CMO keep labor/tax copy aligned |
| `https://www.kamnuanlek.com/` | `https://www.kamnuanlek.com/คำนวณค่างวดบัตรเครดิต/` | Anchor: `คำนวณค่างวดบัตรเครดิต`; context: debt-repayment card in homepage calculators | link missing on live | CTO deploy route (404->200); SEO verify link appears |
| `https://www.kamnuanlek.com/บทความ/` | `https://www.kamnuanlek.com/คำนวณค่างวดบัตรเครดิต/` | Anchor: `คำนวณค่างวดบัตรเครดิต`; context: article-card CTA for `ผ่อนบัตรเครดิต 2569` | link missing on live | CTO deploy route + article pair and sitemap |
| `https://www.kamnuanlek.com/คำนวณดอกเบี้ยบัตรเครดิต/` | `https://www.kamnuanlek.com/คำนวณค่างวดบัตรเครดิต/` | Anchor: `คำนวณค่างวดบัตรเครดิต`; context: related tools to convert APR into monthly payoff plan | link missing on live | CTO deploy latest source + route; SEO verify link + crawlability |
| `https://www.kamnuanlek.com/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/` | `https://www.kamnuanlek.com/คำนวณค่างวดบัตรเครดิต/` | Anchor: `คำนวณค่างวดบัตรเครดิต`; context: “แผนจ่ายรายเดือนหลายระดับ” related list | link missing on live | CTO deploy route and article; CMO keep installment snippet intent |

## Post-deploy recrawl order (submit in this order)
1. `https://www.kamnuanlek.com/sitemap.xml`
2. `https://www.kamnuanlek.com/คำนวณค่าไฟฟ้า/`
3. `https://www.kamnuanlek.com/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/`
4. `https://www.kamnuanlek.com/คำนวณค่าโอที/`
5. `https://www.kamnuanlek.com/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/`
6. `https://www.kamnuanlek.com/คำนวณค่างวดบัตรเครดิต/`
7. `https://www.kamnuanlek.com/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/`
8. `https://www.kamnuanlek.com/`
9. `https://www.kamnuanlek.com/บทความ/`
10. `https://www.kamnuanlek.com/คำนวณดอกเบี้ยบัตรเครดิต/`
11. `https://www.kamnuanlek.com/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/`
12. `https://www.kamnuanlek.com/คำนวณเปอร์เซ็นต์/`
13. `https://www.kamnuanlek.com/บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/`
14. `https://www.kamnuanlek.com/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/`
15. `https://www.kamnuanlek.com/คำนวณค่าน้ำ/`
16. `https://www.kamnuanlek.com/บทความ/คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ/`

## Blocking state and owner (explicit)
- Deploy/indexability blocker (owner: CTO via CMO):
  - `https://www.kamnuanlek.com/คำนวณค่างวดบัตรเครดิต/` and `.../บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/` still `404`.
  - Top-3 targets still missing from live sitemap.
  - Canonical on live `200` routes still points to Railway host.
- GSC authenticated indexing/inspection blocker (owner: CMO/CEO chain): [CAL-260](/CAL/issues/CAL-260).

CAL-68 remains `in_progress`.
