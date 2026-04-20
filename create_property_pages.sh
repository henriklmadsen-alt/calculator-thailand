#!/bin/bash

create_property_page() {
  local klc=$1
  local thai_name=$2
  local thai_slug=$3
  
  mkdir -p "src/pages/$thai_slug"
  
  cat > "src/pages/$thai_slug/index.astro" << PAGEOF
---
import BaseLayout from '../../layouts/BaseLayout.astro';
const pageTitle = '$thai_name | Calculator Thailand';
const pageDescription = 'คำนวณ $thai_name - เครื่องคำนวณอสังหาริมทรัพย์ฟรีออนไลน์';
const siteUrl = (import.meta.env.PUBLIC_SITE_URL || 'https://www.kamnuanlek.com').replace(/\/$/, '');
const canonical = \`\${siteUrl}/$thai_slug/\`;
---

<BaseLayout title={pageTitle} description={pageDescription} canonical={canonical} pageName="$thai_name">
  <article>
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">$thai_name</h1>
    <div class="mb-4 inline-block rounded-lg border border-rose-200 bg-rose-50 px-3 py-2"><p class="text-xs font-semibold text-rose-800">[อัปเดตปี 2569]</p></div>
    <p class="text-gray-600 mb-6">คำนวณ $thai_name ฟรีออนไลน์</p>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
      <div class="space-y-4 mb-6">
        <div><label for="amount" class="block text-sm font-medium text-gray-700 mb-1">จำนวนเงิน (บาท)</label><input type="text" id="amount" inputmode="decimal" placeholder="ป้อนจำนวนเงิน" value="1000000" class="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
      </div>
      <button type="button" id="btn" class="px-6 py-2 bg-rose-600 text-white rounded-md">คำนวณ</button>
      <div id="res" class="hidden mt-6 space-y-2"><div class="grid grid-cols-1 gap-2"><div class="bg-rose-50 rounded p-3"><p class="text-sm text-gray-600">ผลลัพธ์</p><p id="result" class="font-bold">-</p></div></div></div>
    </div>
  </article>
  <script>
    document.getElementById('btn')!.addEventListener('click', () => {
      const amount = parseFloat((document.getElementById('amount') as HTMLInputElement).value) || 0;
      const result = amount * 0.05;
      const fmt = (n: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(n);
      (document.getElementById('result') as HTMLElement).textContent = fmt(result);
      (document.getElementById('res') as HTMLElement).classList.remove('hidden');
      trackCalculatorUsed('$thai_slug');
    });
    document.getElementById('btn')!.click();
  </script>
</BaseLayout>
PAGEOF
}

# Create remaining 10 property calculator pages
create_property_page "0311" "ค่าเสื่อมราคาที่ดินเช่า" "คำนวณ-klc0311-เสื่อมราคา"
create_property_page "0312" "ค่าใช้จ่ายบริหารที่ดิน" "คำนวณ-klc0312-บริหารที่ดิน"
create_property_page "0313" "ต้นทุนคัดกรองผู้เช่า" "คำนวณ-klc0313-คัดกรองผู้เช่า"
create_property_page "0314" "ประกันเจ้าของที่ดิน" "คำนวณ-klc0314-ประกันเจ้าของ"
create_property_page "0315" "ขาดทุนที่ดินว่างเปล่า" "คำนวณ-klc0315-ว่างเปล่า"
create_property_page "0316" "ค่าปรับค่าเช่าล่าช้า" "คำนวณ-klc0316-ค่าปรับ"
create_property_page "0317" "บัญชีเงินมัดจำผู้เช่า" "คำนวณ-klc0317-มัดจำ"
create_property_page "0318" "ต้นทุนตรวจสอบที่ดิน" "คำนวณ-klc0318-ตรวจสอบ"
create_property_page "0319" "ค่าตรวจสอบสิทธิ" "คำนวณ-klc0319-สิทธิ"
create_property_page "0320" "แก้ไขปัญหาสิทธิที่ดิน" "คำนวณ-klc0320-แก้ไข"

echo "Created 10 remaining property pages for KLC-0311-0320"
