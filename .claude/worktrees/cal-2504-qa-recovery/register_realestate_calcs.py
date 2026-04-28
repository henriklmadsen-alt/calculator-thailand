#!/usr/bin/env python3
"""Register 25 Real Estate calculators in src/lib/calculators.ts"""

# Calculator registry data
registry_entries = [
    ('0851', 'ค่าใช้จ่ายการซื้อทรัพย์สิน', '/ค่าใช้จ่ายการซื้อทรัพย์สิน/', '🏠'),
    ('0852', 'ผลตอบแทนการลงทุนอสังหาฯ', '/ผลตอบแทนการลงทุนอสังหา/', '📈'),
    ('0853', 'ผลตอบแทนค่าเช่าต่อปี', '/ผลตอบแทนค่าเช่า/', '💰'),
    ('0854', 'ผลตอบแทนสุทธิค่าเช่า', '/ผลตอบแทนสุทธิค่าเช่า/', '📊'),
    ('0855', 'คำนวณมูลค่าทรัพย์สินเพิ่มขึ้น', '/มูลค่าทรัพย์สินเพิ่มขึ้น/', '📈'),
    ('0856', 'คำนวณรายได้เช่าในอนาคต', '/รายได้เช่าในอนาคต/', '💵'),
    ('0857', 'เปรียบเทียบค่าใช้จ่ายทรัพย์สิน', '/เปรียบเทียบทรัพย์สิน/', '🏘️'),
    ('0858', 'คำนวณเงินดาวน์ทรัพย์สิน', '/เงินดาวน์ทรัพย์สิน/', '💳'),
    ('0859', 'คำนวณการสินเชื่อโครงสร้างใหม่', '/สินเชื่อโครงสร้างใหม่/', '🔄'),
    ('0860', 'ประเมินมูลค่าพอร์ตโฟลิโออสังหา', '/พอร์ตโฟลิโออสังหา/', '📊'),
    ('0861', 'คำนวณค่าเช่ารายเดือน', '/ค่าเช่ารายเดือน/', '💰'),
    ('0862', 'ติดตามค่าใช้จ่ายการเช่า', '/ค่าใช้จ่ายการเช่า/', '📋'),
    ('0863', 'ภาษีเงินได้จากการให้เช่า', '/ภาษีเงินได้เช่า/', '📊'),
    ('0864', 'งบประมาณซ่อมบำรุงอสังหา', '/งบประมาณซ่อม/', '🔧'),
    ('0865', 'ค่าประกันทรัพย์สินให้เช่า', '/ค่าประกันเช่า/', '🛡️'),
    ('0866', 'การทำกำไรจากการให้เช่า', '/กำไรเช่า/', '📈'),
    ('0867', 'ค่าคัดกรองผู้เช่า', '/คัดกรองผู้เช่า/', '👤'),
    ('0868', 'ค่าจัดการคอนโดมิเนียม', '/ค่าจัดการคอนโด/', '🏢'),
    ('0869', 'รายได้ที่พักตากอากาศ', '/รายได้ที่พัก/', '🏖️'),
    ('0870', 'ค่าพื้นที่ร่วมคอนโด', '/พื้นที่ร่วมคอนโด/', '🏘️'),
    ('0871', 'สินเชื่อจำนองอสังหา', '/จำนองอสังหา/', '🏦'),
    ('0872', 'ภาษีโอนทรัพย์สิน', '/ภาษีโอนทรัพย์/', '📋'),
    ('0873', 'ภาษีกำไรจากการขายอสังหา', '/ภาษีกำไรขายอสังหา/', '📊'),
    ('0874', 'หักค่าเสื่อมราคาทรัพย์สิน', '/เสื่อมราคาทรัพย์/', '📉'),
    ('0875', 'ไทมไลน์การลงทุนอสังหา', '/ไทมไลน์อสังหา/', '📅'),
]

# Read the file
with open('src/lib/calculators.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find where to insert (before the ];)
# Look for the last calculator entry before ];
insert_pos = content.rfind('  },\n];')
if insert_pos == -1:
    print("ERROR: Could not find insertion point")
    exit(1)

# Move to after the }, but before the \n];
insert_pos += len('  },')

# Generate registry entries
entries = []
for klc, title, href, icon in registry_entries:
    entry = f"""
  {{
    title: '{title}',
    desc: 'Real Estate {title} Calculator',
    href: '{href}',
    icon: '{icon}',
    categoryId: 'realestate',
    tag: 'KLC-{klc}',
    tagColor: 'bg-rose-50 text-rose-600',
  }},"""
    entries.append(entry)

# Insert all entries
insertion_text = ''.join(entries)
new_content = content[:insert_pos] + insertion_text + content[insert_pos:]

# Write back
with open('src/lib/calculators.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("[OK] Registered all 25 Real Estate calculators in calculators.ts")
print(f"     Lines added: {len(entries)}")
