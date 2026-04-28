param(
  [string]$Message = "Manual deploy"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

Push-Location $repoRoot
try {
  if (-not (Test-Path -LiteralPath "railway.toml")) {
    throw "railway.toml not found at repo root: $repoRoot"
  }

  Write-Host "Deploying from repo root: $repoRoot"
  railway deployment up --ci --message $Message
}
finally {
  Pop-Location
}
