param(
  [string]$BaseUrl = "https://www.kamnuanlek.com",
  [string]$ExpectedPublisherLine = "google.com, pub-5753152813183301, DIRECT, f08c47fec0942fa0",
  [string]$ExpectedClientToken = "ca-pub-5753152813183301",
  [string]$ExpectedHost = "www.kamnuanlek.com",
  [string[]]$RepresentativePaths = @(
    "/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/",
    "/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95/",
    "/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%96/"
  ),
  [switch]$FailOnIssues,
  [string]$ReportDir = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not $ReportDir) {
  $today = Get-Date -Format "yyyy-MM-dd"
  $ReportDir = Join-Path "reports\qa\cal-197\$today" "adsense-preflight"
}
New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null

$results = New-Object System.Collections.Generic.List[object]

function Add-Result {
  param(
    [string]$Check,
    [string]$Severity,
    [bool]$Pass,
    [string]$Details
  )

  $results.Add([PSCustomObject]@{
    check = $Check
    severity = $Severity
    pass = $Pass
    details = $Details
  })
}

function Get-Url {
  param([string]$Path)
  return "{0}{1}" -f $BaseUrl.TrimEnd('/'), $Path
}

function Get-Page {
  param([string]$Url)

  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 30
    return [PSCustomObject]@{
      status = [int]$response.StatusCode
      content = [string]$response.Content
      error = ""
    }
  }
  catch {
    if ($_.Exception.Response) {
      return [PSCustomObject]@{
        status = [int]$_.Exception.Response.StatusCode
        content = ""
        error = $_.Exception.Message
      }
    }

    return [PSCustomObject]@{
      status = "ERR"
      content = ""
      error = $_.Exception.Message
    }
  }
}

Write-Host "[AdSense preflight] Base URL: $BaseUrl"

$adsUrl = Get-Url -Path "/ads.txt"
$adsPage = Get-Page -Url $adsUrl
$adsTxtHasPublisherLine = $false
if ($adsPage.status -eq 200) {
  $adsTxtHasPublisherLine = $adsPage.content -match [regex]::Escape($ExpectedPublisherLine)
}
Add-Result -Check "ads.txt status 200" -Severity "high" -Pass ($adsPage.status -eq 200) -Details ("status={0} url={1}" -f $adsPage.status, $adsUrl)
Add-Result -Check "ads.txt publisher line present" -Severity "high" -Pass $adsTxtHasPublisherLine -Details ("expected='{0}'" -f $ExpectedPublisherLine)

$robotsUrl = Get-Url -Path "/robots.txt"
$robotsPage = Get-Page -Url $robotsUrl
$robotsAllowsRoot = $false
$robotsDisallowAll = $false
$sitemapHosts = @()
$sitemapHostMismatch = @()
if ($robotsPage.status -eq 200) {
  $robotsAllowsRoot = $robotsPage.content -match "(?mi)^Allow:\s*/\s*$"
  $robotsDisallowAll = $robotsPage.content -match "(?mi)^Disallow:\s*/\s*$"
  $sitemapMatches = [regex]::Matches($robotsPage.content, "(?mi)^Sitemap:\s*(https?://\S+)\s*$")
  foreach ($match in $sitemapMatches) {
    $sitemapUrl = $match.Groups[1].Value
    $sitemapHosts += ([Uri]$sitemapUrl).Host
  }
  $sitemapHostMismatch = @($sitemapHosts | Where-Object { $_ -ne $ExpectedHost })
}
Add-Result -Check "robots.txt status 200" -Severity "medium" -Pass ($robotsPage.status -eq 200) -Details ("status={0} url={1}" -f $robotsPage.status, $robotsUrl)
Add-Result -Check "robots allow root crawl" -Severity "high" -Pass ($robotsAllowsRoot -and -not $robotsDisallowAll) -Details ("allow_root={0} disallow_all={1}" -f $robotsAllowsRoot, $robotsDisallowAll)
Add-Result -Check "robots sitemap host matches custom domain" -Severity "high" -Pass ($sitemapHostMismatch.Count -eq 0) -Details ("hosts={0}" -f (($sitemapHosts | Select-Object -Unique) -join ", "))

$routeEvidence = New-Object System.Collections.Generic.List[object]
foreach ($path in $RepresentativePaths) {
  $url = Get-Url -Path $path
  $page = Get-Page -Url $url
  $canonicalHref = ""
  $canonicalHost = ""
  $hasAdsScript = $false
  $hasExpectedClient = $false
  $hasAdsIns = $false
  $slotAttrs = 0

  if ($page.status -eq 200) {
    $matchCanonical = [regex]::Match($page.content, "<link[^>]+rel=""canonical""[^>]+href=""([^""]+)""")
    if ($matchCanonical.Success) {
      $canonicalHref = $matchCanonical.Groups[1].Value
      try {
        $canonicalHost = ([Uri]$canonicalHref).Host
      }
      catch {
        $canonicalHost = ""
      }
    }

    $hasAdsScript = $page.content -match "pagead2\.googlesyndication\.com/pagead/js/adsbygoogle\.js\?client="
    $hasExpectedClient = $page.content -match [regex]::Escape($ExpectedClientToken)
    $hasAdsIns = $page.content -match '<ins[^>]+class=""adsbygoogle""'
    $slotAttrs = ([regex]::Matches($page.content, "data-ad-slot=")).Count
  }

  $routeEvidence.Add([PSCustomObject]@{
    path = [Uri]::UnescapeDataString($path)
    status = $page.status
    canonical = $canonicalHref
    canonical_host = $canonicalHost
    has_ads_script = $hasAdsScript
    has_expected_client = $hasExpectedClient
    has_ads_ins = $hasAdsIns
    slot_attrs = $slotAttrs
    error = $page.error
  })
}

$allRepresentative200 = (@($routeEvidence | Where-Object { $_.status -ne 200 }).Count -eq 0)
$allRepresentativeAdsClient = (@($routeEvidence | Where-Object { -not $_.has_expected_client }).Count -eq 0)
$allRepresentativeAdMarkup = (@($routeEvidence | Where-Object { -not $_.has_ads_script -or (-not $_.has_ads_ins -and $_.slot_attrs -le 0) }).Count -eq 0)
$canonicalMismatch = @($routeEvidence | Where-Object { $_.canonical_host -ne $ExpectedHost })

Add-Result -Check "representative routes return 200" -Severity "high" -Pass $allRepresentative200 -Details ("routes={0}" -f (($routeEvidence.path) -join ", "))
Add-Result -Check "AdSense client token present in representative HTML" -Severity "high" -Pass $allRepresentativeAdsClient -Details ("expected_client={0}" -f $ExpectedClientToken)
Add-Result -Check "representative routes contain ad script/slot behavior" -Severity "high" -Pass $allRepresentativeAdMarkup -Details "requires ads script + ins/slot markers"
Add-Result -Check "canonical host uses custom domain" -Severity "high" -Pass ($canonicalMismatch.Count -eq 0) -Details ("expected_host={0}" -f $ExpectedHost)

$failed = @($results | Where-Object { -not $_.pass })
$passedCount = ($results.Count - $failed.Count)

Write-Host "[AdSense preflight] Check summary"
$results | Format-Table -AutoSize | Out-Host

Write-Host "[AdSense preflight] Representative route evidence"
$routeEvidence | Format-Table -AutoSize | Out-Host

$jsonPath = Join-Path $ReportDir "adsense-preflight.json"
$mdPath = Join-Path $ReportDir "adsense-preflight.md"

$payload = [PSCustomObject]@{
  generated_at = (Get-Date).ToString("s")
  base_url = $BaseUrl
  expected_host = $ExpectedHost
  expected_publisher_line = $ExpectedPublisherLine
  expected_client_token = $ExpectedClientToken
  checks = $results
  representative_routes = $routeEvidence
  passed = $passedCount
  failed = $failed.Count
}
$payload | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $jsonPath -Encoding utf8

$md = @()
$md += "# AdSense Launch Preflight"
$md += ""
$md += ("Base URL: {0}" -f $BaseUrl)
$md += ("Generated at: {0}" -f (Get-Date).ToString("s"))
$md += ""
$md += ("Passed: {0}" -f $passedCount)
$md += ("Failed: {0}" -f $failed.Count)
$md += ""
$md += "## Checks"
$md += ""
foreach ($row in $results) {
  $statusText = if ($row.pass) { "PASS" } else { "FAIL" }
  $md += ("- [{0}] ({1}) {2} - {3}" -f $statusText, $row.severity, $row.check, $row.details)
}
$md += ""
$md += "## Representative route evidence"
$md += ""
foreach ($row in $routeEvidence) {
  $md += ("- {0}: status={1}, canonical_host={2}, ads_script={3}, ads_ins={4}, slot_attrs={5}, expected_client={6}" -f $row.path, $row.status, $row.canonical_host, $row.has_ads_script, $row.has_ads_ins, $row.slot_attrs, $row.has_expected_client)
}
$md += ""

$md -join "`n" | Set-Content -LiteralPath $mdPath -Encoding utf8

Write-Host ("[AdSense preflight] Evidence JSON: {0}" -f $jsonPath)
Write-Host ("[AdSense preflight] Evidence MD: {0}" -f $mdPath)

if ($FailOnIssues -and $failed.Count -gt 0) {
  throw ("AdSense launch preflight failed ({0} checks failed)." -f $failed.Count)
}
