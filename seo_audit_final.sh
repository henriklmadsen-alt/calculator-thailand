#!/bin/bash
DIST="dist"
cd "$DIST"

echo "=== PHASE 1 SEO HEALTH AUDIT (Thai Calculator Pages) ==="
echo ""

# 1. METADATA ON THAI CALCULATOR PAGES
echo "1. METADATA COMPLETENESS (Thai calculators)"
echo "---"

thai_calcs=$(find . -path "./คำนวณ*" -name "index.html" | wc -l)
og_title=$(find . -path "./คำนวณ*" -name "index.html" -exec grep -l 'property="og:title"' {} \; | wc -l)
og_desc=$(find . -path "./คำนวณ*" -name "index.html" -exec grep -l 'property="og:description"' {} \; | wc -l)
twitter=$(find . -path "./คำนวณ*" -name "index.html" -exec grep -l 'twitter:' {} \; | wc -l)
viewport=$(find . -path "./คำนวณ*" -name "index.html" -exec grep -l 'name="viewport"' {} \; | wc -l)
canonical=$(find . -path "./คำนวณ*" -name "index.html" -exec grep -l 'rel="canonical"' {} \; | wc -l)

echo "Thai calculator pages: $thai_calcs"
echo "  - og:title: $og_title/$thai_calcs ($((og_title * 100 / thai_calcs))%)"
echo "  - og:description: $og_desc/$thai_calcs ($((og_desc * 100 / thai_calcs))%)"
echo "  - Twitter cards: $twitter/$thai_calcs ($((twitter * 100 / thai_calcs))%)"
echo "  - viewport: $viewport/$thai_calcs ($((viewport * 100 / thai_calcs))%)"
echo "  - canonical: $canonical/$thai_calcs ($((canonical * 100 / thai_calcs))%)"
echo ""

# 2. SCHEMA.ORG MARKUP
echo "2. SCHEMA.ORG MARKUP"
echo "---"

schema_total=$(find . -path "./คำนวณ*" -name "index.html" -exec grep -l 'schema.org' {} \; | wc -l)
calc_schema=$(find . -path "./คำนวณ*" -name "index.html" -exec grep -l '"@type":"Calculator"' {} \; | wc -l)
howto_schema=$(find . -path "./คำนวณ*" -name "index.html" -exec grep -l '"@type":"HowTo"' {} \; | wc -l)
breadcrumb_schema=$(find . -path "./คำนวณ*" -name "index.html" -exec grep -l '"@type":"BreadcrumbList"' {} \; | wc -l)

echo "Pages with schema.org: $schema_total/$thai_calcs ($((schema_total * 100 / thai_calcs))%)"
echo "  - Calculator schema: $calc_schema pages"
echo "  - HowTo schema: $howto_schema pages"
echo "  - BreadcrumbList: $breadcrumb_schema pages"
echo ""

# 3. INTERNAL LINKING
echo "3. INTERNAL LINKING"
echo "---"

pages_with_links=$(find . -path "./คำนวณ*" -name "index.html" -exec grep -l '<a href="/' {} \; | wc -l)
echo "Thai pages with internal links: $pages_with_links/$thai_calcs ($((pages_with_links * 100 / thai_calcs))%)"

# Sample pages with no outbound links
no_links=$(find . -path "./คำนวณ*" -name "index.html" | while read page; do
  if ! grep -q '<a href="/' "$page"; then
    echo "$page"
  fi
done | wc -l)
echo "Pages with NO outbound internal links: $no_links (potential orphans)"
echo ""

# 4. REDIRECT STRUCTURE (English → Thai)
echo "4. REDIRECT STRUCTURE (English calculator pages)"
echo "---"

en_calcs=$(find . -path "./calculator/*" -name "index.html" | wc -l)
en_redirects=$(find . -path "./calculator/*" -name "index.html" -exec grep -l 'meta http-equiv="refresh"' {} \; | wc -l)
echo "English calculator pages: $en_calcs"
echo "Redirects to Thai: $en_redirects/$en_calcs ($((en_redirects * 100 / en_calcs))%)"
echo ""

# 5. MOBILE & PWA
echo "5. MOBILE & PWA SIGNALS"
echo "---"

manifest=$(find . -name "index.html" -exec grep -l 'rel="manifest"' {} \; | wc -l)
theme_color=$(find . -name "index.html" -exec grep -l 'name="theme-color"' {} \; | wc -l)
total_pages=$(find . -name "index.html" | wc -l)
echo "Pages with manifest: $(ls manifest.json 2>/dev/null | wc -l) (root level)"
echo "Pages with theme-color: $theme_color/$total_pages"
echo ""

# 6. CATEGORY/ARTICLE COVERAGE
echo "6. CONTENT COVERAGE"
echo "---"

categories=$(find ./หมวดหมู่ -name "index.html" 2>/dev/null | wc -l)
articles=$(find ./บทความ -name "index.html" 2>/dev/null | wc -l)
total_thai=$(find . -path "./คำนวณ*" -o -path "./หมวดหมู่/*" -o -path "./บทความ/*" | grep index.html | wc -l)

echo "Thai calculators: $thai_calcs"
echo "Categories: $categories"
echo "Articles: $articles"
echo "Total Thai pages (est.): $total_thai"
echo ""

echo "=== END AUDIT ==="
