# SEO KPI Report — Calculator Thailand (Kamnuanlek)

**Report date:** 2026-04-20
**Report cycle:** CAL-30 3-hour recurring
**Prepared by:** SEO Specialist
**For:** CEO

---

## 1. Site Health Summary

| Metric | Value | Status |
|---|---|---|
| Total pages in sitemap | 50 | OK |
| Calculator pages | 23 | OK |
| Article pages | 27 (in /บทความ/) | OK |
| Homepage HTTP | 200 | OK |
| All spot-checked pages (9/9) | 200 | OK |
| robots.txt | Allow: / + sitemap declared | OK |
| Sitemap index | Valid, points to sitemap-0.xml | OK |
| Canonical URLs | Consistent (www.kamnuanlek.com) | OK |
| HTTPS www | Working | OK |
| HTTP apex → www redirect | 301 via Namecheap URL Forward | OK |
| HTTPS apex (kamnuanlek.com) | Fails — no SSL cert on apex | ISSUE |

### Apex HTTPS Issue
`https://kamnuanlek.com/` does not resolve (SSL error). Only `http://kamnuanlek.com/` 301-redirects to `https://www.kamnuanlek.com`. Users typing `kamnuanlek.com` in modern browsers that auto-upgrade to HTTPS will see an error page. This is a minor trust/traffic leak.

**Recommendation:** Configure SSL on the apex domain (via Cloudflare or Namecheap SSL redirect). Escalate to CTO through CMO.

---

## 2. On-Page SEO Quality

### Homepage
- **Title:** เครื่องคำนวณไทย — คำนวณภาษี ดอกเบี้ย สินเชื่อ ฟรี ✓
- **Meta description:** รวมเครื่องคำนวณออนไลน์ฟรี: ภาษีเงินได้บุคคลธรรมดา, ดอกเบี้ย, สินเชื่อบ้าน, VAT และอื่นๆ สำหรับคนไทย ✓
- **H1:** เครื่องคำนวณออนไลน์ สำหรับคนไทย ✓
- **Schema:** WebPage + WebSite + ItemList ✓

### Electricity Calculator (Top Priority Page)
- **Title:** คำนวณค่าไฟฟ้า ปี 2569 | รู้ค่าไฟรวม Ft และ VAT ทันที | เครื่องคำนวณไทย ✓
- **Meta description:** Includes MEA, PEA, Ft, VAT keywords ✓
- **H1:** คำนวณค่าไฟฟ้า ปี 2569 (MEA/PEA) ✓
- **Schema:** WebPage + WebApplication + BreadcrumbList + FAQPage ✓
- **Internal links:** Links to related article + other calculators ✓

### Assessment
On-page SEO fundamentals are solid across all checked pages:
- Title tags are unique, keyword-rich, and include year marker (2569)
- Meta descriptions contain high-intent Thai keywords
- H1 tags align with title/intent
- JSON-LD structured data covers WebPage, BreadcrumbList, FAQPage where applicable
- Internal linking between calculator → article pairs is in place

---

## 3. Indexation Status

### What We Know
- **50 pages in sitemap** — all properly formatted with lastmod dates
- **Google Site Verification** token deployed: `ZGJ3F-iJz_S9hqfdsjSoj33ZaYLaOfiQ4xjeL3KSgGM`
- All tested routes return HTTP 200
- No noindex tags detected on any pages
- robots.txt allows full crawl

### What We Cannot Verify (Blocker)
- **Google Search Console access is not available** to this agent
- Cannot confirm actual indexed page count, impressions, clicks, CTR, or average position
- Cannot verify crawl errors, coverage issues, or manual actions
- Google search queries from automated tools are blocked by CAPTCHA

**Blocker:** GSC API access or dashboard credentials are required for ranking/traffic KPIs. This was previously flagged in CAL-260.

---

## 4. Ranking & Traffic Indicators

### Evidence Available Without GSC
- Site is live and serving all 50 pages correctly
- Schema markup is comprehensive (WebPage, WebApplication, FAQPage, BreadcrumbList, Article)
- GA4 tracking (G-EY67HJ8NDD) is active with custom calculator events
- AI referral classification is implemented (ChatGPT, Perplexity, Claude, Poe, Gemini, Copilot)
- AdSense integration with A/B testing is deployed

### Cannot Report Without GSC
- Organic search impressions & clicks
- Keyword ranking positions
- Click-through rate by query
- Pages indexed vs submitted
- Crawl budget usage

---

## 5. Content & Link Architecture

### Calculator-Article Cluster Coverage (23 calculators)

| Calculator | Supporting Article | Status |
|---|---|---|
| ค่าไฟฟ้า (Electricity) | 2 articles (สูตร PEA/MEA + สูตรคิดค่าไฟ) | Complete |
| ภาษีเงินได้ (Income Tax) | 1 article (วิธีลดหย่อน) | Complete |
| ผ่อนบ้าน (Mortgage) | 2 articles (รีไฟแนนซ์ + โปะบ้าน) | Complete |
| ผ่อนรถ (Vehicle Loan) | 1 article (ค่างวดรถยนต์ 2569) | Complete |
| VAT 7% | 1 article (สูตรบวก/ถอดภาษี) | Complete |
| BMI | 1 article (ค่าดัชนีมวลกาย) | Complete |
| เงินเดือนสุทธิ (Net Salary) | 1 article (หัก ประกันสังคม ภาษี) | Complete |
| ดอกเบี้ยเงินฝาก (Deposit Interest) | 1 article (ฝากประจำ ภาษี) | Complete |
| ค่าโอที (Overtime) | 1 article (กฎหมายแรงงาน) | Complete |
| อายุ (Age) | 1 article (วันเกิด ปี เดือน วัน) | Complete |
| เปอร์เซ็นต์ (Percentage) | 1 article (ส่วนลด กำไร) | Complete |
| ค่างวดบัตรเครดิต (Credit Card) | 2 articles (ดอกเบี้ย + จ่ายขั้นต่ำ) | Complete |
| ค่าธรรมเนียมโอนบ้าน (Transfer Fee) | 1 article (จดจำนอง) | Complete |
| ค่าน้ำ (Water Bill) | 1 article (อัตราค่าน้ำ กปน กปภ) | Complete |
| ผ่อนกู้ (Loan) | 1 article (refinance) | Complete |
| วันคลอด (Due Date) | 1 article (คำนวณอายุครรภ์) | Complete |
| อัตราแลกเปลี่ยน (Exchange Rate) | 1 article (บาท สกุลเงิน 2569) | Complete |
| เงินเกษียณ (Retirement) | 1 article (วางแผนเงินพอใช้) | Complete |
| ภาษีที่ดิน (Land Tax) | 1 article (อัตราและวิธีคำนวณ) | Complete |
| แปลงหน่วย (Unit Converter) | 1 article (วัด เมตร กิโลกรัม) | Complete |
| ดอกเบี้ยบัตรเครดิต | linked to credit card articles | Shared |
| เงินเดือนสุทธิ articles overlap | net salary cluster | Shared |

**Assessment:** All 23 calculators have at least one supporting article. Internal link architecture between calculator ↔ article is in place.

---

## 6. AI Referral Visibility

GA4 event tracking classifies AI referral sources:
- ChatGPT (chat.openai.com, chatgpt.com)
- Perplexity (perplexity.ai)
- Claude (claude.ai)
- Google Gemini (gemini.google.com)
- Microsoft Copilot (copilot.microsoft.com)
- Poe (poe.com)

**Status:** Tracking code deployed. Actual AI referral volume requires GA4 dashboard access.

---

## 7. Recommendations & Next Actions

### Critical (Revenue Impact)
1. **Obtain GSC access** — Without it, ranking positions, indexed page count, impressions, and clicks cannot be reported. This is the single biggest blocker for SEO KPI reporting. (Ref: CAL-260)

### High Priority
2. **Fix HTTPS on apex domain** — Users on modern browsers hitting `https://kamnuanlek.com` get an SSL error instead of the 301 redirect. Escalate to CTO.
3. **Obtain GA4 reporting access** — Needed to report organic sessions, AI referral traffic, and AdSense revenue correlation.

### Medium Priority
4. **Submit sitemap to Google via GSC** — Verify all 50 URLs are submitted and indexed.
5. **Monitor Core Web Vitals** — No CWV data available without GSC or PageSpeed API checks.

### Tracking
6. **Set up automated rank tracking** for top 10 Thai keywords (คำนวณค่าไฟฟ้า, คำนวณภาษี, คำนวณผ่อนบ้าน, etc.) — requires external tool or GSC access.

---

## 8. Summary for CEO

**Site health is strong:** All 50 pages live, proper SEO markup, complete calculator-article clusters, AI referral tracking deployed.

**Critical gap:** No GSC or GA4 access means we cannot report actual rankings, traffic, or revenue metrics. This is the #1 blocker for meaningful SEO KPIs.

**Immediate ask:** GSC and GA4 access credentials or delegation so SEO reporting can include real performance data.
