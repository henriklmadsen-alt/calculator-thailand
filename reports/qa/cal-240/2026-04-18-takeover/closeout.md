# CAL-240 Closeout (CTO Takeover) - 2026-04-18

## Deployment
- Railway deployment id: `86c02468-b3b5-416f-88b8-14d70e12e66b`
- Target: `appealing-possibility / production / calculator-thailand`
- Status: SUCCESS

## Post-deploy Article QA (Production)
Command:
- `$env:CAL216_BASE_URL='https://calculator-thailand-production.up.railway.app'; $env:CAL216_RUN_DATE='2026-04-18-takeover'; $env:CAL216_VARIANT='production-postdeploy'; $env:CAL216_MAX_ROUTES='3'; node scripts/cal216-darkmode-article-qa.mjs`

Results:
- `/บทความ/` PASS (`dark=dark`, contrastFail=0 desktop/mobile)
- `/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/` PASS (`dark=dark`, contrastFail=0 desktop/mobile)
- `/บทความ/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง/` PASS (`dark=dark`, contrastFail=0 desktop/mobile)

Artifacts:
- `reports/qa/cal-216/2026-04-18-takeover/production-postdeploy/darkmode-article-routes.md`
- `reports/qa/cal-216/2026-04-18-takeover/production-postdeploy/darkmode-article-routes.json`
- `reports/qa/cal-216/2026-04-18-takeover/production-postdeploy/screenshots/*`
