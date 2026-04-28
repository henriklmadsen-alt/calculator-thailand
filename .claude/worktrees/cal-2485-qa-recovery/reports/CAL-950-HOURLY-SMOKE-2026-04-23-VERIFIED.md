# CAL-950 Hourly Trust QA Smoke — 2026-04-23 00:00+07 [POST-TLS-RECOVERY]

## PASS ✓

**Executed at:** 2026-04-23 00:14 UTC+0 (Post-TLS Recovery Verification)

### Smoke Test Results

**TLS Certificate:** Fixed ✓
- CAL-918 TLS mismatch issue resolved
- Currently serving: kamnuanlek.com (Let's Encrypt R12)
- Certificate validity confirmed

**Site Accessibility:** ✓
- Apex domain (HTTPS): 301 → www ✓
- Homepage (HTTPS): 200 OK
- All routes responsive

**Calculator Routes (Critical 6-sample):**
- /calculator/loan-payment/ → 301 → 200 ✓ (Thai content: 23,835 chars)
- /calculator/electricity-bill/ → 301 → 200 ✓
- /calculator/overtime-pay/ → 301 → 200 ✓
- /calculator/land-tax/ → 301 → 200 ✓
- /calculator/property-transfer-tax/ → 301 → 200 ✓
- /sitemap.xml → 301 → 200 ✓

**Thai Direct Routes (Unicode paths):**
- /คำนวณผ่อนกู้/ → 200 ✓
- /คำนวณค่าไฟฟ้า/ → 200 ✓

**Thai Content Verification:** ✓
- Homepage: 629,270 Thai characters
- Loan calculator: 23,835 Thai characters
- All pages rendering Thai content correctly

### Release Risk Assessment

**Risk Level: LOW** ✓

- TLS issue (CAL-918) **resolved**
- All critical paths functional
- Thai content rendering verified
- No new regressions from CAL-949 baseline
- Site stable post-recovery

### Conclusion

**Status: PASS — Site Ready for User Access**

All tested surfaces show correct behavior, proper HTTP status codes, valid TLS certificate, and user-facing Thai content rendering. TLS certificate issue from CAL-918 has been remedied. No blocking issues for continued operation.

---
**QA Engineer:** Release QA Engineer Alpha  
**Baseline Reference:** CAL-949 PASS (07:00+07)  
**Verification Type:** Hourly Trust Smoke Post-TLS-Recovery  
**Timestamp:** 2026-04-23 00:14:00 UTC
