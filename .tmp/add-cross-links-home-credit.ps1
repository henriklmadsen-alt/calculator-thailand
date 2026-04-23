chcp.com 65001 > $null

$homePath = 'src/pages/คำนวณผ่อนบ้าน/index.astro'
$homeContent = Get-Content -Raw -Path $homePath
if ($homeContent -notmatch '/คำนวณดอกเบี้ยบัตรเครดิต/' -or $homeContent -notmatch '/คำนวณค่าโอนบ้าน/') {
  $homeInsert = @"
        <a href="/คำนวณดอกเบี้ยบัตรเครดิต/" class="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-primary-500 transition-colors">
          <span class="text-primary-600 font-medium">คำนวณดอกเบี้ยบัตรเครดิต</span>
          <span class="text-gray-400 text-sm block">คำนวณดอกเบี้ยรายวันและยอดชำระขั้นต่ำตามเกณฑ์ปี 2569</span>
        </a>
        <a href="/คำนวณค่าโอนบ้าน/" class="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-primary-500 transition-colors">
          <span class="text-primary-600 font-medium">คำนวณค่าโอนบ้าน</span>
          <span class="text-gray-400 text-sm block">ประเมินค่าธรรมเนียมโอน ภาษีธุรกิจเฉพาะ และภาษีหัก ณ ที่จ่าย</span>
        </a>
"@
  $homePattern = '(?s)(<section class="mb-8">\s*<h2[^>]*>.*?</h2>\s*<div class="grid gap-3 sm:grid-cols-2">.*?)(\s*</div>\s*</section>\s*<div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">)'
  $homeContent = [regex]::Replace($homeContent, $homePattern, { param($m) return $m.Groups[1].Value + $homeInsert + $m.Groups[2].Value }, 1)
  [System.IO.File]::WriteAllText($homePath, $homeContent, [System.Text.UTF8Encoding]::new($false))
  Write-Output $homePath
}

$ccPath = 'src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro'
$ccContent = Get-Content -Raw -Path $ccPath
if ($ccContent -notmatch '/คำนวณค่าโอนบ้าน/') {
  $ccInsert = @"
        <a href="/คำนวณค่าโอนบ้าน/" class="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-primary-500 transition-colors">
          <span class="text-primary-600 font-medium">คำนวณค่าโอนบ้าน</span>
          <span class="text-gray-400 text-sm block">ประเมินค่าธรรมเนียมโอน ภาษีธุรกิจเฉพาะ และภาษีหัก ณ ที่จ่ายก่อนวันโอน</span>
        </a>
"@
  $ccPattern = '(?s)(<section class="mb-8">\s*<h2[^>]*>.*?</h2>\s*<div class="grid gap-3 sm:grid-cols-2">.*?)(\s*</div>\s*</section>\s*<section class="mb-8">\s*<h2[^>]*>.*?</h2>\s*<div class="space-y-4">)'
  $ccContent = [regex]::Replace($ccContent, $ccPattern, { param($m) return $m.Groups[1].Value + $ccInsert + $m.Groups[2].Value }, 1)
  [System.IO.File]::WriteAllText($ccPath, $ccContent, [System.Text.UTF8Encoding]::new($false))
  Write-Output $ccPath
}
