param(
  [string]$BaseUrl = "https://www.kamnuanlek.com"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$paths = @(
  "/",
  "/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95/",
  "/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%96/",
  "/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/",
  "/ads.txt"
)

$failed = @()

foreach ($path in $paths) {
  try {
    $response = Invoke-WebRequest -Uri ($BaseUrl + $path) -UseBasicParsing -TimeoutSec 30
    $status = [int]$response.StatusCode
    Write-Host "$status $path"
    if ($status -ne 200) {
      $failed += "$status $path"
    }
  }
  catch {
    if ($_.Exception.Response) {
      $status = [int]$_.Exception.Response.StatusCode
      Write-Host "$status $path"
      $failed += "$status $path"
    }
    else {
      $failed += "ERR $path $($_.Exception.Message)"
      Write-Host "ERR $path $($_.Exception.Message)"
    }
  }
}

if ($failed.Count -gt 0) {
  throw "Smoke check failed:`n$($failed -join "`n")"
}

Write-Host "Smoke check passed."
