#!/bin/bash

echo "=== DETAILED ARTICLE SCHEMA CHECK ==="
ARTICLE_FILE="dist/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.html"

if [ -f "$ARTICLE_FILE" ]; then
  echo "Article file size: $(wc -c < "$ARTICLE_FILE") bytes"
  echo ""
  echo "Schema blocks detected:"
  grep -c '<script type="application/ld\+json">' "$ARTICLE_FILE" && echo "  - JSON-LD blocks present"
  
  echo ""
  echo "Schema @type instances:"
  grep -o '"@type":"[^"]*"' "$ARTICLE_FILE" | sort | uniq -c | sort -rn
fi

echo ""
echo "=== CALCULATOR DIRECTORY CHECK ==="
ls -la dist/calculator/ 2>/dev/null | tail -10

echo ""
echo "=== MISSING CALCULATOR DETECTION ==="
MISSING_CALCS=(
  "bmi"
  "age"
  "savings"
  "loan-payment"
  "property-transfer-tax"
  "unit-converter"
  "electricity-bill"
  "overtime-pay"
)

for calc in "${MISSING_CALCS[@]}"; do
  if [ -f "dist/calculator/$calc/index.html" ]; then
    echo "✅ /calculator/$calc/ — Present"
  else
    echo "⚠️  /calculator/$calc/ — Missing (check redirects)"
  fi
done

echo ""
echo "=== REDIRECT CHECK ==="
if find dist -name "*redirect*" -o -name "*302*" 2>/dev/null | head -5; then
  echo "(Checking for redirect pages)"
fi

