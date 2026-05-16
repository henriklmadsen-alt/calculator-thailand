[HANDOFF_TO_CMO]
T082 completed and validated.

Scope delivered:
- Audited sitemap generation/output for priority tax-cluster pages touched in T074-T081.
- Confirmed canonical inclusion + non-empty ISO `lastmod` + priority rule consistency.
- Added regression test:
  - `tests/sitemap-t082-priority-lastmod.test.mjs`
- Produced audit evidence file:
  - `.tmp/t082_sitemap_audit.md`

Priority rule applied:
- Tax-intent cluster routes use `priority=0.9`.

Acceptance evidence:
1) Target test
- Command: `node --test tests/sitemap-t082-priority-lastmod.test.mjs`
- Result: PASS (4/4)

2) Build
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

3) Railway deploy
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1`
- Result: SUCCESS
- Deployment ID: `ac72e3eb-db86-498b-bc9d-1d1bbbe14b8a`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=ac72e3eb-db86-498b-bc9d-1d1bbbe14b8a&`

4) Live sitemap verification (both domains)
- `https://www.kamnuanlek.com/sitemap.xml` => HTTP 200
- `https://www.kamnuanlek.com/sitemap-index.xml` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/sitemap.xml` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/sitemap-index.xml` => HTTP 200
- Referenced shard check (`sitemap-0.xml`) on live: HTTP 200 on both hosts
- Audited route proof (encoded route -> lastmod -> priority -> status):
  - `%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%A5%E0%B8%94%E0%B8%AB%E0%B8%A2%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89-%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B9%80%E0%B8%9A%E0%B8%B4%E0%B8%81%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%AB%E0%B8%A2%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%B9%E0%B8%87%E0%B8%AA%E0%B8%B8%E0%B8%94/` -> `2026-05-14` -> `0.9` -> PASS
  - `%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2-2569-%E0%B8%84%E0%B8%B7%E0%B8%AD%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3/` -> `2026-05-14` -> `0.9` -> PASS
  - `%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B8%84%E0%B8%A3%E0%B8%B6%E0%B9%88%E0%B8%87%E0%B8%9B%E0%B8%B5-2569-%E0%B8%A2%E0%B8%B7%E0%B9%88%E0%B8%99%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%84%E0%B8%A3-%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%A3/` -> `2026-05-14` -> `0.9` -> PASS
  - `%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89-2569-%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%A5%E0%B8%94%E0%B8%AB%E0%B8%A2%E0%B9%88%E0%B8%AD%E0%B8%99/` -> `2026-05-14` -> `0.9` -> PASS

Evidence artifacts:
- `.tmp/t082_sitemap_audit.md`
- `.tmp/t082_live_sitemap_check.md`
- `.tmp/t082_route_evidence.json`
- `.tmp/t082_live_www.kamnuanlek.com_sitemap.xml`
- `.tmp/t082_live_www.kamnuanlek.com_sitemap-index.xml`
- `.tmp/t082_live_www.kamnuanlek.com_sitemap-0.xml`
- `.tmp/t082_live_calculator-thailand-production.up.railway.app_sitemap.xml`
- `.tmp/t082_live_calculator-thailand-production.up.railway.app_sitemap-index.xml`
- `.tmp/t082_live_calculator-thailand-production.up.railway.app_sitemap-0.xml`

Ready for independent QA and next P0 assignment.
