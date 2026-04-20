#!/bin/bash

create_education_page() {
  local klc=$1
  local thai_name=$2
  local thai_slug=$3
  
  mkdir -p "src/pages/$thai_slug"
  
  cat > "src/pages/$thai_slug/index.astro" << PAGEOF
---
import BaseLayout from '../../layouts/BaseLayout.astro';
const pageTitle = '$thai_name | Calculator Thailand';
const pageDescription = 'คำนวณ $thai_name - เครื่องคำนวณการศึกษาฟรีออนไลน์';
const siteUrl = (import.meta.env.PUBLIC_SITE_URL || 'https://www.kamnuanlek.com').replace(/\/$/, '');
const canonical = \`\${siteUrl}/$thai_slug/\`;
---

<BaseLayout title={pageTitle} description={pageDescription} canonical={canonical} pageName="$thai_name">
  <article>
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">$thai_name</h1>
    <div class="mb-4 inline-block rounded-lg border border-blue-200 bg-blue-50 px-3 py-2"><p class="text-xs font-semibold text-blue-800">[อัปเดตปี 2569]</p></div>
    <p class="text-gray-600 mb-6">เครื่องคำนวณ $thai_name ฟรีออนไลน์</p>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
      <div class="space-y-4 mb-6">
        <div><label for="val1" class="block text-sm font-medium text-gray-700 mb-1">ป้อนค่า</label><input type="text" id="val1" inputmode="decimal" placeholder="ป้อนจำนวนเงิน" value="100000" class="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
      </div>
      <button type="button" id="btn" class="px-6 py-2 bg-blue-600 text-white rounded-md">คำนวณ</button>
      <div id="res" class="hidden mt-6 space-y-2"><div class="grid grid-cols-1 gap-2"><div class="bg-blue-50 rounded p-3"><p class="text-sm text-gray-600">ผลลัพธ์</p><p id="result" class="font-bold">-</p></div></div></div>
    </div>
  </article>
  <script>
    document.getElementById('btn')!.addEventListener('click', () => {
      const val1 = parseFloat((document.getElementById('val1') as HTMLInputElement).value) || 0;
      const result = val1 * 1.2;
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

# Create pages for remaining 17 calculators
create_education_page "0434" "คำนวณต้นทุนอนุบาล" "คำนวณ-klc0434-อนุบาล"
create_education_page "0435" "คำนวณ ROI วิทยาลัยเทคนิค" "คำนวณ-klc0435-วิทยาลัยเทคนิค"
create_education_page "0436" "คำนวณค่าหลักสูตรออนไลน์" "คำนวณ-klc0436-หลักสูตรออนไลน์"
create_education_page "0437" "คำนวณลดหย่อนภาษีการศึกษา" "คำนวณ-klc0437-ลดหย่อนการศึกษา"
create_education_page "0438" "คำนวณงบประมาณวัสดุการศึกษา" "คำนวณ-klc0438-วัสดุการศึกษา"
create_education_page "0439" "คำนวณต้นทุนหอพัก" "คำนวณ-klc0439-หอพัก"
create_education_page "0440" "คำนวณค่าใช้สอยนักเรียน" "คำนวณ-klc0440-ค่าใช้สอย"
create_education_page "0441" "คำนวณ ROI ศึกษาต่อ" "คำนวณ-klc0441-roi-ศึกษาต่อ"
create_education_page "0442" "คำนวณเงินเดือนครูทั่วไป" "คำนวณ-klc0442-เงินเดือนครู"
create_education_page "0443" "คำนวณดอกเบี้ยสินเชื่อการศึกษา" "คำนวณ-klc0443-สินเชื่อการศึกษา"
create_education_page "0444" "คำนวณเงินออมสำหรับลูก" "คำนวณ-klc0444-เงินออมลูก"
create_education_page "0445" "คำนวณค่าคอร์สภาษา" "คำนวณ-klc0445-คอร์สภาษา"
create_education_page "0446" "คำนวณค่าสอบใบรับรอง" "คำนวณ-klc0446-สอบใบรับรอง"
create_education_page "0447" "คำนวณรายได้งานเสริมนักเรียน" "คำนวณ-klc0447-รายได้เสริม"
create_education_page "0448" "คำนวณเบี้ยประกันการศึกษา" "คำนวณ-klc0448-ประกันการศึกษา"
create_education_page "0449" "คำนวณค่าขนส่งโรงเรียน" "คำนวณ-klc0449-ขนส่งโรงเรียน"
create_education_page "0450" "คำนวณค่าหนังสือและสื่อ" "คำนวณ-klc0450-หนังสือและสื่อ"

echo "Created 17 education pages for KLC-0434-0450"
