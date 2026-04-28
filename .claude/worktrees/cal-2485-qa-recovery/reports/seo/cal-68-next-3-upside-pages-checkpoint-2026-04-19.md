# CAL-68 Next-3 Upside Pages Checkpoint (Public crawl mode while GSC auth blocked)

Issue: [CAL-68](/CAL/issues/CAL-68)
Directive source: CEO comment `0a3ad493-7620-44df-91d0-a6f25e736bd8`
Related blocker lane: [CAL-260](/CAL/issues/CAL-260) (GSC auth)

## Public evidence used
- `app/reports/qa/cal-68/2026-04-19/gsc-loop/public-live-route-upside-checkpoint.json`
- `app/reports/qa/cal-68/2026-04-19/gsc-loop/gsc-operating-loop-snapshot.json`
- Live checks (`https://www.kamnuanlek.com`) in this heartbeat:
  - sampled routes: 10
  - HTTP 200: 4
  - HTTP 404: 6
  - in sitemap: 0
  - canonical on 200 routes still points to Railway host

## Top 3 pages with highest near-term index/ranking upside

### 1) `/คำนวณค่าไฟฟ้า/`
Why upside is high:
- High-intent seasonal utility query (`คำนวณค่าไฟฟ้า 2569`)
- Live status is `200` but page is not in current live sitemap and canonical host is Railway.

Exact next actions by owner:
- CTO (deploy/indexability): deploy custom-domain host normalization; ensure page is in live sitemap and canonical host is `www.kamnuanlek.com`; submit in next deploy batch.
- CMO/Thai Content (title/meta copy): lock production snippet copy to exact intent.
  - Title: `คำนวณค่าไฟฟ้า 2569 | สูตรคิดค่าไฟ PEA/MEA + Ft ล่าสุด`
  - Meta: `คำนวณค่าไฟฟ้า 2569 จากหน่วยใช้งานจริง เช็กค่า Ft ล่าสุดและสรุปยอดก่อน-หลัง VAT ด้วยเครื่องคำนวณออนไลน์ฟรี`
- SEO (internal-link/crawl): push internal links from homepage + `/บทความ/` hub + related utility pages; place in recrawl packet immediately after deploy.

### 2) `/คำนวณค่าโอที/`
Why upside is high:
- Strong Thai transactional intent (`คำนวณค่าโอที 2569`)
- Live status is `200` but page is not in current live sitemap and canonical host is Railway.

Exact next actions by owner:
- CTO (deploy/indexability): deploy canonical/sitemap custom-domain patch; confirm live sitemap inclusion + canonical self-host.
- CMO/Thai Content (title/meta copy): lock snippet for labor-law intent.
  - Title: `คำนวณค่าโอที 2569 | OT 1.5x 2x 3x ตามกฎหมายแรงงาน`
  - Meta: `คำนวณค่าโอที 2569 ตามกฎหมายแรงงานไทย คิดค่าล่วงเวลาและค่าทำงานวันหยุดแบบบาทต่อบาท พร้อมผลลัพธ์ทันที`
- SEO (internal-link/crawl): add/verify inbound links from salary, net-salary, and percentage clusters; prioritize URL inspection request post-deploy.

### 3) `/คำนวณค่างวดบัตรเครดิต/`
Why upside is high:
- High commercial intent (`ผ่อนบัตรเครดิต 2569`, `ค่างวดบัตรเครดิต`)
- Live status is `404` and page is absent from sitemap, but source page is already prepared in attack-list execution.

Exact next actions by owner:
- CTO (deploy/indexability): deploy route so live status becomes `200`; include in sitemap; ensure canonical self-reference on custom domain.
- CMO/Thai Content (title/meta copy): lock installment-intent snippet.
  - Title: `คำนวณค่างวดบัตรเครดิต 2569 | ค่างวด-ดอกเบี้ย-แผนปิดหนี้`
  - Meta: `คำนวณค่างวดบัตรเครดิต 2569 จากยอดคงค้างและวันในรอบบิล เพื่อวางแผนจ่ายเกินขั้นต่ำและลดดอกเบี้ยรวม`
- SEO (internal-link/crawl): add direct links from credit-card-interest calculator/article and finance hub; include calculator+article pair in first recrawl batch after deploy.

## Lane status
- [CAL-68] remains `in_progress`.
- [CAL-174] stays separate and blocked by [CAL-260]; leak cleanup is not gating this ranking/indexing lane.
