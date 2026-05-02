#!/bin/bash

# Sample Thai calculator pages and verify mobile/UX signals
PAGES=(
  "dist/คำนวณค่าไฟฟ้า/index.html"
  "dist/คำนวณเงินเดือนสุทธิ/index.html"
  "dist/คำนวณผ่อนบ้าน/index.html"
  "dist/คำนวณภาษีเงินได้บุคคลธรรมดา/index.html"
  "dist/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.html"
)

declare -A checks
checks[viewport]=0
checks[responsive_design]=0
checks[form_inputs]=0
checks[button_accessibility]=0
checks[related_links]=0
checks[breadcrumb]=0
checks[schema_breadcrumb]=0
total_pages=0

for page in "${PAGES[@]}"; do
  if [ -f "$page" ]; then
    content=$(cat "$page")
    total_pages=$((total_pages + 1))
    
    # Mobile & UX checks
    grep -q 'viewport' <<< "$content" && checks[viewport]=$((checks[viewport] + 1))
    grep -q 'class=".*responsive\|flex\|grid' <<< "$content" && checks[responsive_design]=$((checks[responsive_design] + 1))
    grep -q '<input.*type=".*"' <<< "$content" && checks[form_inputs]=$((checks[form_inputs] + 1))
    grep -q 'button\|href.*aria-label\|role="button"' <<< "$content" && checks[button_accessibility]=$((checks[button_accessibility] + 1))
    grep -q 'href.*calculator\|href.*บทความ' <<< "$content" && checks[related_links]=$((checks[related_links] + 1))
    grep -q 'BreadcrumbList' <<< "$content" && checks[breadcrumb]=$((checks[breadcrumb] + 1))
    grep -q 'BreadcrumbList' <<< "$content" && checks[schema_breadcrumb]=$((checks[schema_breadcrumb] + 1))
  fi
done

echo "=== MOBILE & CALCULATOR UX REPORT ==="
echo "Pages sampled: $total_pages"
echo ""
echo "Mobile & Responsiveness:"
for signal in viewport responsive_design; do
  pct=$((checks[$signal] * 100 / total_pages))
  echo "  $signal: ${checks[$signal]}/$total_pages ($pct%)"
done
echo ""
echo "Input & Navigation:"
for signal in form_inputs button_accessibility related_links breadcrumb; do
  pct=$((checks[$signal] * 100 / total_pages))
  echo "  $signal: ${checks[$signal]}/$total_pages ($pct%)"
done
