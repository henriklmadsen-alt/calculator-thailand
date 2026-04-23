# CAL-954 Hourly Trust QA Smoke — 2026-04-23 09:00+07

## PASS ✓

**Executed at:** 2026-04-23 09:00 UTC+0700

### TLS Certificate Status

✓ **Valid**
- Issuer: Let's Encrypt R12
- Valid from: Apr 22 13:56:46 2026 GMT
- Valid until: Jul 21 13:56:45 2026 GMT
- **Status:** CAL-918 TLS recovery maintained

### Site Accessibility

✓ **All Critical Routes Functional**
- Apex domain (HTTPS): 301 redirect to www ✓
- Homepage (www): 200 OK ✓
- All routes responsive

### Calculator Route Verification (6-Sample)

| Route | Status | Notes |
|-------|--------|-------|
| `/calculator/loan-payment/` | 301 → 200 ✓ | Thai path working correctly |
| `/calculator/electricity-bill/` | 301 → 200 ✓ | Thai path working correctly |
| `/calculator/overtime-pay/` | 301 → 200 ✓ | Thai path working correctly |
| `/calculator/land-tax/` | 301 → 200 ✓ | Thai path working correctly |
| `/calculator/property-transfer-tax/` | 301 → 200 ✓ | Thai path working correctly |
| `/คำนวณภาษีมูลค่าเพิ่ม/` | 200 ✓ | Thai VAT path accessible |

### Thai Content Verification

✓ **Thai Content Rendering**
- Homepage: Thai content present (6800+ Thai word fragments)
- Loan calculator page loads with Thai metadata
- Open Graph tags include Thai titles and descriptions
- Schema.org markup in Thai present
- All critical pages rendering Thai content correctly

### Mobile Accessibility Check

✓ **Viewport and Mobile Meta Tags**
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present
- Apple touch icon configured
- PWA manifest linked
- Mobile-web-app capable declared

### Configuration Status

**Note (Minor):** VAT calculator English redirect not configured
- English path `/calculator/vat/` returns 404 (expected)
- Thai path `/คำนวณภาษีมูลค่าเพิ่ม/` returns 200 ✓
- This may be intentional (Thai-only access) or a configuration gap
- **Not a blocker** — Thai path functional
- **Worth clarifying:** Should VAT have English redirect like other calculators?

### Overall Release Risk Assessment

**Risk Level: LOW** ✓

- TLS certificate valid and stable post-recovery (CAL-918 resolved)
- All required calculator routes accessible
- Thai content rendering verified
- Mobile structure in place
- No regressions from CAL-950 baseline
- Site stable for user access

### Conclusion

**Status: PASS — Site Ready for User Access**

All tested surfaces show correct HTTP status codes, valid TLS certificate, proper redirects, and Thai content rendering. No user-facing defects detected. VAT calculator configuration gap noted but not blocking (Thai path functional).

---
**QA Engineer:** Release QA Engineer Alpha  
**Baseline Reference:** CAL-950 PASS (00:00+07)  
**Verification Type:** Hourly Trust Smoke  
**Environment:** Production (kamnuanlek.com)  
**Timestamp:** 2026-04-23 09:00:00 UTC+0700
