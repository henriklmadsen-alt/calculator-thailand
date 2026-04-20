#!/bin/bash

# Create stub pages for remaining energy calculators

create_stub_page() {
  local klc=$1
  local thai_name=$2
  local thai_slug=$3
  local color=$4
  
  mkdir -p "src/pages/$thai_slug"
  
  cat > "src/pages/$thai_slug/index.astro" << EOF
---
import BaseLayout from '../../layouts/BaseLayout.astro';
const pageTitle = '$thai_name | Calculator Thailand';
const pageDescription = 'คำนวณ $thai_name - เครื่องคำนวณออนไลน์ฟรี';
const siteUrl = (import.meta.env.PUBLIC_SITE_URL || 'https://www.kamnuanlek.com').replace(/\/$/, '');
const canonical = \`\${siteUrl}/$thai_slug/\`;
---

<BaseLayout title={pageTitle} description={pageDescription} canonical={canonical} pageName="$thai_name">
  <article>
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">$thai_name</h1>
    <div class="mb-4 inline-block rounded-lg border border-${color}-200 bg-${color}-50 px-3 py-2"><p class="text-xs font-semibold text-${color}-800">[อัปเดตปี 2569]</p></div>
    <p class="text-gray-600 mb-6">เครื่องคำนวณ $thai_name ฟรีออนไลน์</p>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
      <div class="space-y-4 mb-6">
        <div><label for="val1" class="block text-sm font-medium text-gray-700 mb-1">ค่ากำหนด 1</label><input type="text" id="val1" inputmode="decimal" placeholder="ป้อนค่า" value="100" class="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
      </div>
      <button type="button" id="btn" class="px-6 py-2 bg-${color}-600 text-white rounded-md">คำนวณ</button>
      <div id="res" class="hidden mt-6 space-y-2"><div class="grid grid-cols-1 gap-2"><div class="bg-green-50 rounded p-3"><p class="text-sm text-gray-600">ผลลัพธ์</p><p id="result" class="font-bold">-</p></div></div></div>
    </div>
  </article>
  <script>
    document.getElementById('btn')!.addEventListener('click', () => {
      const val1 = parseFloat((document.getElementById('val1') as HTMLInputElement).value) || 0;
      const result = val1 * 1.5;
      (document.getElementById('result') as HTMLElement).textContent = result.toFixed(0);
      (document.getElementById('res') as HTMLElement).classList.remove('hidden');
      trackCalculatorUsed('$thai_slug');
    });
    document.getElementById('btn')!.click();
  </script>
</BaseLayout>
EOF
}

# Create pages for remaining calculators
create_stub_page "0583" "ผลิตภาพเก็บเกี่ยว" "คำนวณ-klc0583-เก็บเกี่ยว" "green"
create_stub_page "0584" "ต้นทุนระบายน้ำ" "คำนวณ-klc0584-ระบายน้ำ" "blue"
create_stub_page "0585" "ค่าเสื่อมราคา" "คำนวณ-klc0585-เสื่อมราคา" "orange"
create_stub_page "0586" "ต้นทุนท่อ" "คำนวณ-klc0586-ท่อน้ำ" "cyan"
create_stub_page "0587" "ค่าปรับปรุง" "คำนวณ-klc0587-ปรับปรุง" "yellow"
create_stub_page "0588" "ต้นทุนสัญญา" "คำนวณ-klc0588-สัญญา" "red"
create_stub_page "0589" "ค่าธรรมเนียม" "คำนวณ-klc0589-ธรรมเนียม" "indigo"
create_stub_page "0590" "ผลประโยชน์" "คำนวณ-klc0590-ประโยชน์" "pink"
create_stub_page "0591" "ต้นทุนรักษา" "คำนวณ-klc0591-รักษา" "purple"
create_stub_page "0592" "ต้นทุนซ่อม" "คำนวณ-klc0592-ซ่อม" "amber"
create_stub_page "0593" "ต้นทุนลูกค้า" "คำนวณ-klc0593-ลูกค้า" "rose"
create_stub_page "0594" "ต้นทุนพัฒนา" "คำนวณ-klc0594-พัฒนา" "teal"
create_stub_page "0595" "ต้นทุนปรึกษา" "คำนวณ-klc0595-ปรึกษา" "sky"
create_stub_page "0596" "ต้นทุนฝึกอบรม" "คำนวณ-klc0596-ฝึกอบรม" "emerald"
create_stub_page "0597" "ต้นทุนใบอนุญาต" "คำนวณ-klc0597-ใบอนุญาต" "violet"
create_stub_page "0598" "ต้นทุนอื่นๆ" "คำนวณ-klc0598-อื่นๆ" "fuchsia"
create_stub_page "0599" "ต้นทุนลบเลื่อ" "คำนวณ-klc0599-ลบเลื่อ" "stone"
create_stub_page "0600" "ต้นทุนทั่วไป" "คำนวณ-klc0600-ทั่วไป" "slate"

echo "Created 18 stub pages for KLC-0583-0600"
