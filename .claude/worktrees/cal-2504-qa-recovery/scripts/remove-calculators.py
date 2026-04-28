#!/usr/bin/env python3
# Remove deleted calculator entries from calculators.ts
import re
import sys

DELETED_PAGE_DIRS = set([
    # Jewelry KLC 0901-0925
    *[f'เครื่องประดับ-klc{i:04d}' for i in range(901, 926)],
    # Farming pages
    'คำนวณ-ต้นทุนเพาะเลี้ยงปลา',
    'คำนวณ-ต้นทุนเลี้ยงผึ้ง',
    'คำนวณ-ต้นทุนมันสำปะหลัง',
    'คำนวณ-วางแผนหมุนเพาะปลูก',
    'คำนวณ-ต้นทุนฟาร์มนม',
    'คำนวณ-ต้นทุนโรงเรือน',
    'คำนวณ-เห็ด',
    'คำนวณ-ต้นทุนสวนผลไม้',
    'คำนวณ-ต้นทุนปาล์มน้ำมัน',
    'คำนวณ-ต้นทุนสัตว์ปีก',
    'คำนวณ-ต้นทุนเลี้ยงไหม',
    'คำนวณ-ต้นทุนอ้อย',
    # Manufacturing pages
    'คำนวณ--roi-การลงทุนโรงงาน',
    'คำนวณ-ความสามารถการผลิต',
    'คำนวณ-ค่าบำรุงรักษาเครื่องจักร',
    'คำนวณ-ค่าเก็บรักษาสินค้าคงคลัง',
    'คำนวณ-ค่าเสื่อมราคาเครื่องจักร',
    'คำนวณ-ค่าแทนที่เครื่องจักร',
    'คำนวณ-จัดสรรค่าใช้สอยโรงงาน',
    'คำนวณ-จุดคุ้มทุนการผลิต',
    'คำนวณ-ต้นทุนการขยายการผลิต',
    'คำนวณ-ต้นทุนควบคุมคุณภาพ',
    'คำนวณ-ต้นทุนผลิตต่อหน่วย',
    'คำนวณ-ต้นทุนวัตถุดิบต่อหน่วย',
    'คำนวณ-ประสิทธิภาพการผลิต',
    'คำนวณ-อัตราการใช้งานโรงงาน',
    'คำนวณ-อัตราผลตอบแทน-roi-เครื่องจักร',
    'คำนวณ-บำรุงรักษาเครื่องจักร',
    # Pages importing deleted lib files
    'คำนวณ-ค่าเลี้ยงต่อคน',
    'คำนวณค่าจอดรถ',
    'คำนวณค่าน้ำหนักกระเป๋าเสริม',
    'คำนวณค่าเชื้อเพลิง',
    'คำนวณค่าเช่ามอเตอร์ไซค์',
    'คำนวณค่าแท็กซี่',
    'คำนวณเบี้ยเลี้ยงขึ้นเครื่อง',
])

# Build set of hrefs to remove
deleted_hrefs = set()
for d in DELETED_PAGE_DIRS:
    deleted_hrefs.add(f'/{d}/')

print(f'Hrefs to remove: {len(deleted_hrefs)}', file=sys.stderr)

# Read calculators.ts
with open('src/lib/calculators.ts', 'r', encoding='utf-8') as f:
    content = f.read()

original_lines = content.count('\n')

# Strategy: find each calculator object block and check if its href is in deleted_hrefs
# A calculator entry looks like:
#   {
#     title: '...',
#     ...
#     href: '/some-path/',
#     ...
#   },
# We need to remove the entire block including the leading whitespace and trailing comma

removed_count = 0

for href in deleted_hrefs:
    # Escape the href for regex (/ and - are special in some contexts)
    escaped = re.escape(href)
    # Pattern: match a calculator object that contains this href
    # The object starts with optional whitespace then {, ends with },
    # and contains href: 'the_href'
    pattern = r'\n  \{[^{}]*?href:\s*[\'"]' + escaped + r'[\'"][^{}]*?\},'

    matches = re.findall(pattern, content, re.DOTALL)
    if matches:
        content = re.sub(pattern, '', content, flags=re.DOTALL)
        removed_count += len(matches)
    else:
        # Try without trailing comma
        pattern2 = r'\n  \{[^{}]*?href:\s*[\'"]' + escaped + r'[\'"][^{}]*?\}'
        matches2 = re.findall(pattern2, content, re.DOTALL)
        if matches2:
            content = re.sub(pattern2, '', content, flags=re.DOTALL)
            removed_count += len(matches2)

new_lines = content.count('\n')
print(f'Removed {removed_count} entries ({original_lines - new_lines} lines removed)', file=sys.stderr)

# Write back
with open('src/lib/calculators.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done', file=sys.stderr)
