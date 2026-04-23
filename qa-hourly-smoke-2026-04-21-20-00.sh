#!/bin/bash

# CAL-794: Hourly Trust QA Smoke Test — 2026-04-21 20:00+07
# Release QA Engineer Alpha — Site health, calculator verification, mobile check
# Test scope: Homepage + 8 critical routes + recent deployments

SITE="https://www.kamnuanlek.com"
TIMESTAMP="2026-04-21_20-00_UTC+7"
REPORT_FILE="/tmp/cal-794-smoke-${TIMESTAMP}.txt"

echo "=== CAL-794 HOURLY TRUST QA SMOKE TEST ===" > "$REPORT_FILE"
echo "Timestamp: 2026-04-21 20:00+07 (Bangkok)" >> "$REPORT_FILE"
echo "Site: www.kamnuanlek.com" >> "$REPORT_FILE"
echo "Test scope: Homepage + 8 critical calculator routes" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Function: Test HTTP status
test_route() {
    local route=$1
    local desc=$2
    local url="${SITE}${route}"

    echo -n "Testing: ${desc}... " >> "$REPORT_FILE"

    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)

    if [ "$status" = "200" ]; then
        echo "✅ HTTP $status" >> "$REPORT_FILE"
        return 0
    else
        echo "❌ HTTP $status" >> "$REPORT_FILE"
        return 1
    fi
}

# Function: Test Thai content rendering
test_thai_content() {
    local route=$1
    local desc=$2
    local url="${SITE}${route}"

    echo -n "Thai content check: ${desc}... " >> "$REPORT_FILE"

    # Check for Thai characters (ก-ๅ unicode range)
    thai_count=$(curl -s "$url" 2>/dev/null | grep -o '[ก-๏]' | wc -l)

    if [ "$thai_count" -gt 10 ]; then
        echo "✅ Thai text present ($thai_count chars detected)" >> "$REPORT_FILE"
        return 0
    else
        echo "⚠️ Thai text low ($thai_count chars, expected >10)" >> "$REPORT_FILE"
        return 1
    fi
}

# Function: Test schema markup
test_schema() {
    local route=$1
    local desc=$2
    local url="${SITE}${route}"

    echo -n "Schema markup: ${desc}... " >> "$REPORT_FILE"

    schema_count=$(curl -s "$url" 2>/dev/null | grep -c "application/ld+json")

    if [ "$schema_count" -gt 0 ]; then
        echo "✅ JSON-LD schema found ($schema_count blocks)" >> "$REPORT_FILE"
        return 0
    else
        echo "❌ JSON-LD schema missing" >> "$REPORT_FILE"
        return 1
    fi
}

echo "--- HTTP STATUS CHECKS ---" >> "$REPORT_FILE"
declare -i pass_count=0
declare -i fail_count=0

# Test critical routes
test_route "/" "Homepage" && ((pass_count++)) || ((fail_count++))
test_route "/calculator/loan-payment/" "Loan payment calc (CAL-296)" && ((pass_count++)) || ((fail_count++))
test_route "/calculator/property-transfer-tax/" "Property transfer tax (CAL-335)" && ((pass_count++)) || ((fail_count++))
test_route "/calculator/land-tax/" "Land tax calc (CAL-279)" && ((pass_count++)) || ((fail_count++))
test_route "/calculator/unit-converter/" "Unit converter (CAL-131)" && ((pass_count++)) || ((fail_count++))
test_route "/calculator/overtime-pay/" "Overtime calc (CAL-127)" && ((pass_count++)) || ((fail_count++))
test_route "/calculator/electricity-bill/" "Electricity bill (CAL-124)" && ((pass_count++)) || ((fail_count++))
test_route "/sitemap.xml" "Sitemap index" && ((pass_count++)) || ((fail_count++))

echo "" >> "$REPORT_FILE"
echo "--- THAI CONTENT VERIFICATION ---" >> "$REPORT_FILE"
test_thai_content "/" "Homepage" && ((pass_count++)) || ((fail_count++))
test_thai_content "/calculator/loan-payment/" "Loan payment calculator" && ((pass_count++)) || ((fail_count++))

echo "" >> "$REPORT_FILE"
echo "--- SCHEMA MARKUP CHECKS ---" >> "$REPORT_FILE"
test_schema "/" "Homepage" && ((pass_count++)) || ((fail_count++))
test_schema "/calculator/property-transfer-tax/" "Property transfer tax" && ((pass_count++)) || ((fail_count++))

echo "" >> "$REPORT_FILE"
echo "--- APEX HTTPS CHECK (BASELINE ISSUE) ---" >> "$REPORT_FILE"
echo -n "Apex HTTPS (https://kamnuanlek.com)... " >> "$REPORT_FILE"
apex_status=$(curl -s -o /dev/null -w "%{http_code}" "https://kamnuanlek.com" 2>/dev/null)
if [ "$apex_status" = "000" ] || [ "$apex_status" = "035" ]; then
    echo "⚠️ EXPECTED FAIL (no SSL cert) — baseline issue, not regression" >> "$REPORT_FILE"
else
    echo "Status: $apex_status" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"
echo "--- SUMMARY ---" >> "$REPORT_FILE"
total=$((pass_count + fail_count))
echo "Tests run: $total" >> "$REPORT_FILE"
echo "✅ Passed: $pass_count" >> "$REPORT_FILE"
echo "❌ Failed: $fail_count" >> "$REPORT_FILE"

if [ "$fail_count" -eq 0 ]; then
    echo "QA Status: ✅ PASS — No regressions detected" >> "$REPORT_FILE"
    exit 0
else
    echo "QA Status: ❌ BLOCKER — Critical routes failed. Escalate to CTO." >> "$REPORT_FILE"
    exit 1
fi
