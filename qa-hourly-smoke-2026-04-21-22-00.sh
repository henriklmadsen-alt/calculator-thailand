#!/bin/bash

# CAL-803: Hourly Trust QA Smoke Test — 2026-04-21 22:00+07
# Release QA Engineer Alpha — Regression check on critical routes
# Scope: Verify if CAL-794 blocker (English route 404s) is resolved or persists

SITE="https://www.kamnuanlek.com"
TIMESTAMP="2026-04-21_22-00_UTC+7"
REPORT_FILE="reports/CAL-803-HOURLY-SMOKE-2026-04-21-22-00.md"

# Create report header
mkdir -p reports

cat > "$REPORT_FILE" << 'EOF'
# CAL-803: Hourly Trust QA Smoke Test — 2026-04-21 22:00+07 UTC+7

**Issue:** CAL-803
**Timestamp:** 2026-04-21 22:00+07 (10pm Bangkok)
**Test Type:** Regression verification on CAL-794 blocker
**QA Report:** Release QA Engineer Alpha

---

## Test Scope

**Primary objective:** Verify if CAL-794 blocker (English calculator routes returning 404) is still present or resolved.

**Critical routes tested:**
- English calculator routes (loan payment, property tax, etc.)
- Homepage and Thai calculators
- Sitemap availability
- Robots.txt availability

**Previous blocker (CAL-794 20:00):**
- All English `/calculator/*/` routes returned HTTP 404
- Sitemap.xml returned 404
- Thai routes (`/คำนวณ-*/`) returned 200

---

## Test Execution

Running HTTP status checks on critical routes:

EOF

echo "" >> "$REPORT_FILE"
echo "### HTTP Status Verification" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Track results
pass_count=0
fail_count=0
declare -a results

# Test route and capture result
test_route() {
    local route=$1
    local desc=$2
    local url="${SITE}${route}"

    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)

    if [ "$status" = "200" ]; then
        echo "✅ \`$route\` → HTTP $status ($desc)" >> "$REPORT_FILE"
        ((pass_count++))
        results+=("PASS")
    else
        echo "❌ \`$route\` → HTTP $status ($desc)" >> "$REPORT_FILE"
        ((fail_count++))
        results+=("FAIL")
    fi
}

# Execute tests
echo "| Route | Type | Status |" >> "$REPORT_FILE"
echo "|-------|------|--------|" >> "$REPORT_FILE"

test_route "/" "Homepage"
echo "| / | Homepage | $([ ${results[-1]} = PASS ] && echo '✅ 200' || echo '❌ Failed') |" >> "$REPORT_FILE"

test_route "/calculator/loan-payment/" "Loan Payment"
test_route "/calculator/property-transfer-tax/" "Property Tax"
test_route "/calculator/land-tax/" "Land Tax"
test_route "/calculator/unit-converter/" "Unit Converter"
test_route "/calculator/overtime-pay/" "Overtime Pay"
test_route "/calculator/electricity-bill/" "Electricity Bill"

# Thai calculators
test_route "/คำนวณ-bmi/" "Thai BMI"
test_route "/คำนวณ-bridge-loan/" "Thai Bridge Loan"

# Critical files
test_route "/sitemap.xml" "Sitemap"
test_route "/robots.txt" "Robots.txt"

# Summary section
echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "## Summary" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

total=$((pass_count + fail_count))

cat >> "$REPORT_FILE" << EOF

**Tests run:** $total
**Passed:** $pass_count ✅
**Failed:** $fail_count ❌

EOF

if [ "$fail_count" -eq 0 ]; then
    echo "**QA Status:** ✅ **PASS — All critical routes accessible**" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "## Blocker Status" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "✅ **CAL-794 blocker RESOLVED** — English calculator routes now return HTTP 200" >> "$REPORT_FILE"
    QA_RESULT="PASS"
else
    echo "**QA Status:** ❌ **BLOCKER PERSISTS — Release cannot proceed**" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "## Blocker Status" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "❌ **CAL-794 blocker STILL PRESENT** — English calculator routes still returning 404" >> "$REPORT_FILE"
    QA_RESULT="BLOCK"
fi

echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "**Report generated:** 2026-04-21 22:00+07 UTC+7  " >> "$REPORT_FILE"
echo "**QA Engineer:** Release QA Engineer Alpha  " >> "$REPORT_FILE"

# Display results
echo ""
echo "=== CAL-803 SMOKE TEST RESULTS ==="
echo "Passed: $pass_count | Failed: $fail_count"
echo "Status: $QA_RESULT"
echo ""
cat "$REPORT_FILE"
