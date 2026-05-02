#!/bin/bash

# Sample 10 core calculator pages and verify trust signals
PAGES=(
  "dist/calculator/electricity-bill/index.html"
  "dist/calculator/income-tax/index.html"
  "dist/calculator/loan-payment/index.html"
  "dist/calculator/net-salary/index.html"
  "dist/calculator/property-transfer-tax/index.html"
  "dist/calculator/unit-converter/index.html"
  "dist/index.html"
  "dist/หมวดหมู่/การเงิน/index.html"
  "dist/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.html"
  "dist/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/index.html"
)

declare -A signals
signals[og_image]=0
signals[viewport]=0
signals[canonical]=0
signals[schema_org]=0
signals[faq_schema]=0
signals[howto_schema]=0
signals[guarded_adslot]=0
signals[thai_content]=0
signals[focus_outline]=0
total_pages=0

for page in "${PAGES[@]}"; do
  if [ -f "$page" ]; then
    content=$(cat "$page")
    total_pages=$((total_pages + 1))
    
    # Check trust signals
    grep -q 'og:image' <<< "$content" && signals[og_image]=$((signals[og_image] + 1))
    grep -q 'viewport' <<< "$content" && signals[viewport]=$((signals[viewport] + 1))
    grep -q 'canonical' <<< "$content" && signals[canonical]=$((signals[canonical] + 1))
    grep -q '@context.*schema.org' <<< "$content" && signals[schema_org]=$((signals[schema_org] + 1))
    grep -q 'FAQPage' <<< "$content" && signals[faq_schema]=$((signals[faq_schema] + 1))
    grep -q 'HowToPage\|HowTo' <<< "$content" && signals[howto_schema]=$((signals[howto_schema] + 1))
    grep -q 'GuardedAdSlot' <<< "$content" && signals[guarded_adslot]=$((signals[guarded_adslot] + 1))
    grep -q '[ก-๙]' <<< "$content" && signals[thai_content]=$((signals[thai_content] + 1))
    grep -q 'focus:outline\|focus-visible' <<< "$content" && signals[focus_outline]=$((signals[focus_outline] + 1))
  fi
done

echo "=== UX VERIFICATION REPORT ==="
echo "Pages sampled: $total_pages"
echo ""
echo "Trust Signals:"
for signal in og_image viewport canonical schema_org faq_schema howto_schema; do
  pct=$((signals[$signal] * 100 / total_pages))
  echo "  $signal: ${signals[$signal]}/$total_pages ($pct%)"
done
echo ""
echo "Mobile & Accessibility:"
for signal in guarded_adslot thai_content focus_outline; do
  pct=$((signals[$signal] * 100 / total_pages))
  echo "  $signal: ${signals[$signal]}/$total_pages ($pct%)"
done
