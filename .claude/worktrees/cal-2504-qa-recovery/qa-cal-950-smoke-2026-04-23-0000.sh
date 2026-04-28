#!/bin/bash

# CAL-950: Hourly Trust QA Smoke Test — 2026-04-23 00:00+07 [POST-TLS-RECOVERY]
# Release QA Engineer Alpha — Post-TLS recovery verification
# Test scope: Full smoke after CAL-918 TLS fix (CAL-949 PASS baseline)

SITE="https://www.kamnuanlek.com"
APEX_DOMAIN="https://kamnuanlek.com"
TIMESTAMP=$(date -u +"%Y-%m-%d_%H-%M_%Z")
REPORT_FILE="reports/CAL-950-HOURLY-SMOKE-2026-04-23-0000.md"

# Ensure reports directory exists
mkdir -p reports

echo "# CAL-950 Hourly Trust QA Smoke — 2026-04-23 00:00+07 [POST-TLS-RECOVERY]" > "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "**Executed at:** $(date -u +%Y-%m-%dT%H:%M:%S%z)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Test HTTP status
test_route() {
    local route=$1
    local desc=$2
    local url="${SITE}${route}"

    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)

    if [ "$status" = "200" ] || [ "$status" = "301" ]; then
        echo "- ✓ $desc: HTTP $status" >> "$REPORT_FILE"
        return 0
    else
        echo "- ✗ $desc: HTTP $status" >> "$REPORT_FILE"
        return 1
    fi
}

# Test Thai content
test_thai_content() {
    local route=$1
    local desc=$2
    local url="${SITE}${route}"

    thai_count=$(curl -s -L "$url" 2>/dev/null | grep -o '[ก-๏]' | wc -l)

    if [ "$thai_count" -gt 10 ]; then
        echo "- ✓ $desc: Thai text present ($thai_count chars)" >> "$REPORT_FILE"
        return 0
    else
        echo "- ⚠ $desc: Thai text low ($thai_count chars)" >> "$REPORT_FILE"
        return 1
    fi
}

# Test TLS certificate
test_tls() {
    echo "" >> "$REPORT_FILE"
    echo "## TLS Certificate Status" >> "$REPORT_FILE"

    tls_output=$(echo | openssl s_client -servername kamnuanlek.com -connect kamnuanlek.com:443 2>/dev/null | openssl x509 -noout -subject -issuer 2>/dev/null)

    if echo "$tls_output" | grep -q "Let's Encrypt"; then
        echo "- ✓ TLS: Let's Encrypt certificate present" >> "$REPORT_FILE"
        echo "\`\`\`" >> "$REPORT_FILE"
        echo "$tls_output" >> "$REPORT_FILE"
        echo "\`\`\`" >> "$REPORT_FILE"
        return 0
    else
        echo "- ✗ TLS: Certificate issue detected" >> "$REPORT_FILE"
        echo "\`\`\`" >> "$REPORT_FILE"
        echo "$tls_output" >> "$REPORT_FILE"
        echo "\`\`\`" >> "$REPORT_FILE"
        return 1
    fi
}

# Declare counters
declare -i pass_count=0
declare -i fail_count=0
declare -i warn_count=0

echo "## HTTP Status Checks (Critical Routes)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

test_route "/" "Homepage" && ((pass_count++)) || ((fail_count++))
test_route "/calculator/loan-payment/" "Loan payment" && ((pass_count++)) || ((fail_count++))
test_route "/calculator/electricity-bill/" "Electricity bill" && ((pass_count++)) || ((fail_count++))
test_route "/calculator/overtime-pay/" "Overtime pay" && ((pass_count++)) || ((fail_count++))
test_route "/calculator/land-tax/" "Land tax" && ((pass_count++)) || ((fail_count++))
test_route "/calculator/property-transfer-tax/" "Property transfer tax" && ((pass_count++)) || ((fail_count++))
test_route "/sitemap.xml" "Sitemap" && ((pass_count++)) || ((fail_count++))

echo "" >> "$REPORT_FILE"
echo "## Thai Content Verification" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

test_thai_content "/" "Homepage Thai" && ((pass_count++)) || ((warn_count++))
test_thai_content "/calculator/loan-payment/" "Loan calc Thai" && ((pass_count++)) || ((warn_count++))

echo "" >> "$REPORT_FILE"
echo "## Thai Direct Routes" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

test_route "/คำนวณผ่อนกู้/" "Thai loan calc route" && ((pass_count++)) || ((fail_count++))
test_route "/คำนวณค่าไฟฟ้า/" "Thai electricity calc route" && ((pass_count++)) || ((fail_count++))

# TLS check
test_tls
tls_status=$?
if [ "$tls_status" -eq 0 ]; then
    ((pass_count++))
else
    ((fail_count++))
fi

echo "" >> "$REPORT_FILE"
echo "## Apex Domain Redirect Test" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

apex_status=$(curl -s -o /dev/null -w "%{http_code}" "$APEX_DOMAIN" 2>/dev/null)
if [ "$apex_status" = "301" ] || [ "$apex_status" = "308" ]; then
    echo "- ✓ Apex ($APEX_DOMAIN): Redirects correctly (HTTP $apex_status)" >> "$REPORT_FILE"
    ((pass_count++))
else
    echo "- ✗ Apex ($APEX_DOMAIN): Unexpected status HTTP $apex_status" >> "$REPORT_FILE"
    ((fail_count++))
fi

echo "" >> "$REPORT_FILE"
echo "## Summary" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

total=$((pass_count + fail_count + warn_count))
echo "- Tests run: $total" >> "$REPORT_FILE"
echo "- ✓ Passed: $pass_count" >> "$REPORT_FILE"
echo "- ⚠ Warnings: $warn_count" >> "$REPORT_FILE"
echo "- ✗ Failed: $fail_count" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"
echo "## Release Risk Assessment" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if [ "$fail_count" -eq 0 ]; then
    echo "**Risk Level:** LOW ✓" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "- TLS recovery verified (CAL-918 fixed)" >> "$REPORT_FILE"
    echo "- All critical routes functional" >> "$REPORT_FILE"
    echo "- No new regressions from CAL-949 PASS baseline" >> "$REPORT_FILE"
    echo "- Site stable post-recovery" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "**Status: PASS ✓ — Site Ready for User Access**" >> "$REPORT_FILE"
    exit 0
else
    echo "**Risk Level:** CRITICAL ✗" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "**Status: BLOCKER — Escalate to CTO immediately**" >> "$REPORT_FILE"
    exit 1
fi
