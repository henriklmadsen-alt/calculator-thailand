#!/usr/bin/env python3
"""Register 25 Renovation & Interior Design calculators in src/lib/calculators.ts"""

# Calculator registry data
registry_entries = [
    ('0951', 'คำนวณงบประมาณปรับปรุงบ้าน', '/งบประมาณปรับปรุง/', '🏗️'),
    ('0952', 'คำนวณค่าซ่อมแซมห้องต่างๆ', '/ค่าซ่อมแซมห้อง/', '🔨'),
    ('0953', 'คำนวณระยะเวลาและค่าใช้จ่ายปรับปรุง', '/ระยะเวลาปรับปรุง/', '⏱️'),
    ('0954', 'คำนวณการจัดหาเงินสินเชื่อปรับปรุง', '/สินเชื่อปรับปรุง/', '💰'),
    ('0955', 'คำนวณค่าปรับปรุงต่อตารางเมตร', '/ค่าปรับปรุงต่อตร.ม./', '📐'),
    ('0956', 'คำนวณเงินทุนสำรองปรับปรุง', '/เงินสำรองปรับปรุง/', '💳'),
    ('0957', 'คำนวณค่าแรงช่างก่อสร้าง', '/ค่าแรงช่าง/', '👷'),
    ('0958', 'เปรียบเทียบราคาวัสดุท้องถิ่นกับนำเข้า', '/เปรียบเทียบวัสดุ/', '📊'),
    ('0959', 'คำนวณค่าปรับปรุงห้องครัว', '/ค่าปรับปรุงห้องครัว/', '🍳'),
    ('0960', 'คำนวณงบประมาณปรับปรุงห้องน้ำ', '/งบประมาณห้องน้ำ/', '🚿'),
    ('0961', 'คำนวณค่าตู้ครัว', '/ค่าตู้ครัว/', '🗄️'),
    ('0962', 'คำนวณค่าสุขภัณฑ์ห้องน้ำ', '/ค่าสุขภัณฑ์/', '🚽'),
    ('0963', 'คำนวณผลตอบแทนการอัปเกรดอุปกรณ์', '/ผลตอบแทนอุปกรณ์/', '♻️'),
    ('0964', 'คำนวณปริมาณสีทาผนัง', '/ปริมาณสี/', '🎨'),
    ('0965', 'คำนวณจำนวนกระเบื้อง', '/จำนวนกระเบื้อง/', '⬜'),
    ('0966', 'คำนวณจำนวนม้วนวอลเปเปอร์', '/ม้วนวอลเปเปอร์/', '📜'),
    ('0967', 'คำนวณค่าพื้นตามประเภทวัสดุ', '/ค่าพื้น/', '⛳'),
    ('0968', 'คำนวณค่าไม้ก่อสร้าง', '/ค่าไม้/', '🌲'),
    ('0969', 'คำนวณค่าเพดานและการติดตั้ง', '/ค่าเพดาน/', '☁️'),
    ('0970', 'คำนวณค่าออกแบบภายใน', '/ค่าออกแบบ/', '🎭'),
    ('0971', 'คำนวณพื้นที่เรียบเรียงเฟอร์นิเจอร์', '/พื้นที่เฟอร์นิเจอร์/', '🛋️'),
    ('0972', 'จัดสรรงบประมาณเฟอร์นิเจอร์', '/งบประมาณเฟอร์นิเจอร์/', '💵'),
    ('0973', 'คำนวณค่าระบบแสงสว่าง', '/ค่าแสงสว่าง/', '💡'),
    ('0974', 'คำนวณค่าทาสีหลายสี', '/ค่าทาสี/', '🌈'),
    ('0975', 'คำนวณงบประมาณห้องทำงาน', '/งบประมาณห้องทำงาน/', '💻'),
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
    desc: 'Renovation {title} Calculator',
    href: '{href}',
    icon: '{icon}',
    categoryId: 'renovation',
    tag: 'KLC-{klc}',
    tagColor: 'bg-amber-50 text-amber-600',
  }},"""
    entries.append(entry)

# Insert all entries
insertion_text = ''.join(entries)
new_content = content[:insert_pos] + insertion_text + content[insert_pos:]

# Write back
with open('src/lib/calculators.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("[OK] Registered all 25 Renovation & Interior Design calculators in calculators.ts")
print(f"     Lines added: {len(entries)}")
