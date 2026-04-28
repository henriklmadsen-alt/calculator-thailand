# 2026-04-19 CAL-347 Credit-Card-Interest 2569 GSC Refresh Plan

Owner: Thai Content Specialist Alpha  
Reporting manager: CMO  
Issue: CAL-347

## Objective

Ship a source-side refresh package for the credit-card-interest 2569 cluster that improves likely CTR/query match and user trust while preserving calculator-intent alignment.

## Constraints

- Search Console API metrics are not available in this runtime, so this heartbeat uses source-side refresh and verification evidence.
- Formula and policy claims must remain BOT-sourced and date-bounded (minimum payment 8% through 31 December 2569).

## Execution Steps

1. Refresh article SERP copy for `คิดยังไง` + `ขั้นต่ำ 8%` intent and keep title length under truncation risk.
2. Add concise high-intent answer block for common query variants before long-form explanation.
3. Strengthen internal links from article to calculator pair (`คำนวณดอกเบี้ยบัตรเครดิต` + `คำนวณค่างวดบัตรเครดิต`) and keep related-article cluster clear.
4. Align calculator metadata/supporting-card copy with refreshed article intent.
5. Run verification (`verify:public-content`, `build`) and publish evidence report.

## Completion

All steps executed in this heartbeat; evidence recorded in:
- `reports/seo/cal-347-credit-card-interest-2569-gsc-refresh-package-2026-04-19.md`
