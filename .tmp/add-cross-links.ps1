chcp.com 65001 > $null
$paths = Get-ChildItem src/pages -Directory | Where-Object { $_.Name -ne 'บทความ' } | ForEach-Object { Join-Path $_.FullName 'index.astro' } | Where-Object { Test-Path $_ }
$pattern = '(?s)(<h2[^>]*>[^<]*เครื่องคำนวณที่เกี่ยวข้อง[^<]*</h2>\s*<div class="grid gap-3 sm:grid-cols-2">)(.*?)(\s*</div>\s*</section>)'
$changed = @()
foreach ($path in $paths) {
  $content = Get-Content -Raw -Path $path
  $dirName = Split-Path (Split-Path $path -Parent) -Leaf
  $newContent = [regex]::Replace($content, $pattern, {
      param($m)
      $start = $m.Groups[1].Value
      $body = $m.Groups[2].Value
      $end = $m.Groups[3].Value
      $snippets = @()

      if ($dirName -ne 'คำนวณดอกเบี้ยบัตรเครดิต' -and $body -notmatch '/คำนวณดอกเบี้ยบัตรเครดิต/') {
        $snippets += @"
        <a href="/คำนวณดอกเบี้ยบัตรเครดิต/" class="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-primary-500 transition-colors">
          <span class="text-primary-600 font-medium">คำนวณดอกเบี้ยบัตรเครดิต</span>
          <span class="text-gray-400 text-sm block">คำนวณดอกเบี้ยรายวันและยอดชำระขั้นต่ำตามเกณฑ์ปี 2569</span>
        </a>
"@
      }

      if ($dirName -ne 'คำนวณค่าโอนบ้าน' -and $body -notmatch '/คำนวณค่าโอนบ้าน/') {
        $snippets += @"
        <a href="/คำนวณค่าโอนบ้าน/" class="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-primary-500 transition-colors">
          <span class="text-primary-600 font-medium">คำนวณค่าโอนบ้าน</span>
          <span class="text-gray-400 text-sm block">ประเมินค่าธรรมเนียมโอน ภาษีธุรกิจเฉพาะ และภาษีหัก ณ ที่จ่าย</span>
        </a>
"@
      }

      if ($snippets.Count -eq 0) {
        return $m.Value
      }

      return $start + $body + ($snippets -join '') + $end
    }, 1)

  if ($newContent -ne $content) {
    [System.IO.File]::WriteAllText($path, $newContent, [System.Text.UTF8Encoding]::new($false))
    $changed += $path
  }
}
$changed | ForEach-Object { $_.Replace((Get-Location).Path + '\\','') }
