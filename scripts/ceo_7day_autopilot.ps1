param(
  [string]$RepoRoot = "C:\Users\Henrik Madsen\.paperclip\instances\default\projects\3fee8de0-ac05-47ee-a8bd-b3b8a17cc09e\7bc34589-7df0-4922-a15b-7effc6367f4d\calculator-thailand",
  [string]$SiteUrl = "https://www.kamnuanlek.com"
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$outDir = Join-Path $RepoRoot "reports\ceo-autopilot"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
$logPath = Join-Path $outDir "$timestamp.md"

function Write-Log([string]$line) {
  Add-Content -Path $logPath -Value $line
}

function Parse-Percent([string]$text, [string]$pattern) {
  $m = [regex]::Match($text, $pattern)
  if ($m.Success) { return [int]$m.Groups[1].Value }
  return 0
}

function Parse-RatioPercent([string]$text, [string]$label) {
  $m = [regex]::Match($text, "${label}:\s+(\d+)\/(\d+)")
  if ($m.Success) {
    $num = [double]$m.Groups[1].Value
    $den = [double]$m.Groups[2].Value
    if ($den -gt 0) {
      return [int][math]::Round(($num / $den) * 100)
    }
  }
  return 0
}

Push-Location $RepoRoot
try {
  Write-Log "# CEO Autopilot Report - $timestamp"
  Write-Log ""
  Write-Log "## Local Signal Checks"

  $checkSignals = node check-signals-public.mjs 2>&1 | Out-String
  $verifyPublic = node verify-public-signals.mjs 2>&1 | Out-String
  $setupCheck = node scripts/test-cal-2757-setup.mjs 2>&1 | Out-String

  Write-Log "### check-signals-public.mjs"
  Write-Log '```text'
  Write-Log $checkSignals.TrimEnd()
  Write-Log '```'
  Write-Log ""

  Write-Log "### verify-public-signals.mjs"
  Write-Log '```text'
  Write-Log $verifyPublic.TrimEnd()
  Write-Log '```'
  Write-Log ""

  Write-Log "### test-cal-2757-setup.mjs"
  Write-Log '```text'
  Write-Log $setupCheck.TrimEnd()
  Write-Log '```'
  Write-Log ""

  $og = Parse-RatioPercent $checkSignals 'OG'
  $twitter = Parse-RatioPercent $checkSignals 'Twitter'
  $schema = Parse-RatioPercent $checkSignals 'Schema'
  $ga4 = Parse-RatioPercent $checkSignals 'GA4'
  $viewport = Parse-RatioPercent $checkSignals 'Viewport'
  $pwa = Parse-RatioPercent $checkSignals 'PWA'

  Write-Log "## Live Production Checks"
  $robotsCode = curl.exe -L --silent -o NUL -w "%{http_code}" "$SiteUrl/robots.txt"
  $sitemapCode = curl.exe -L --silent -o NUL -w "%{http_code}" "$SiteUrl/sitemap-index.xml"
  $llmsCode = curl.exe -L --silent -o NUL -w "%{http_code}" "$SiteUrl/llms.txt"

  $salaryUrl = "$SiteUrl/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%B4/"
  $articleUrl = "$SiteUrl/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%B4-%E0%B8%84%E0%B8%B7%E0%B8%AD%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3/"

  $salaryHtml = curl.exe -L --silent $salaryUrl
  $articleHtml = curl.exe -L --silent $articleUrl

  $hasTrackingBridge = [bool]($salaryHtml -match "__ctSharedTracking")
  $hasSalarySchema = [bool]($salaryHtml -match '"@type":"SalaryCalculator"')
  $articleLeak = [bool](($articleHtml -match '"@type":"SalaryCalculator"') -or ($articleHtml -match '"@type":"LoanCalculator"') -or ($articleHtml -match '"@type":"Calculator"'))
  $hasAiAttribution = [bool]($salaryHtml -match "ai_referrer_source")

  Write-Log "- robots.txt status: $robotsCode"
  Write-Log "- sitemap-index.xml status: $sitemapCode"
  Write-Log "- llms.txt status: $llmsCode"
  Write-Log "- tracking bridge on salary page: $hasTrackingBridge"
  Write-Log "- salary calculator schema on salary page: $hasSalarySchema"
  Write-Log "- calculator schema leakage on article page: $articleLeak"
  Write-Log "- AI attribution signal present: $hasAiAttribution"
  Write-Log ""

  $seoScore = [int][math]::Round((($og + $twitter + $schema + $ga4 + $viewport + $pwa) / 6))
  if ($robotsCode -ne "200") { $seoScore -= 3 }
  if ($sitemapCode -ne "200") { $seoScore -= 4 }
  if (-not $hasSalarySchema) { $seoScore -= 3 }
  if ($articleLeak) { $seoScore -= 4 }

  $geoScore = [int][math]::Round((($schema + $ga4 + $viewport) / 3))
  if ($llmsCode -ne "200") { $geoScore -= 7 }
  if (-not $hasAiAttribution) { $geoScore -= 5 }
  if (-not $hasTrackingBridge) { $geoScore -= 3 }
  if ($articleLeak) { $geoScore -= 4 }

  if ($seoScore -lt 0) { $seoScore = 0 }
  if ($geoScore -lt 0) { $geoScore = 0 }
  if ($seoScore -gt 100) { $seoScore = 100 }
  if ($geoScore -gt 100) { $geoScore = 100 }

  Write-Log "## Scores"
  Write-Log "- SEO score: $seoScore/100"
  Write-Log "- GEO score: $geoScore/100"
  Write-Log ""

  $alertPath = Join-Path $outDir "ALERT_$timestamp.txt"
  if ($seoScore -lt 88 -or $geoScore -lt 85 -or $articleLeak) {
    @(
      "CRITICAL ALERT - $timestamp",
      "SEO score: $seoScore",
      "GEO score: $geoScore",
      "Article schema leakage: $articleLeak"
    ) | Set-Content -Path $alertPath
    Write-Log "## Alert"
    Write-Log "Critical threshold breached. See $([System.IO.Path]::GetFileName($alertPath))."
  } else {
    Write-Log "## Alert"
    Write-Log "No critical threshold breach."
  }
}
finally {
  Pop-Location
}
