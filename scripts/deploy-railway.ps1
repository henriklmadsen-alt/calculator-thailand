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

  $sha = (git rev-parse HEAD).Trim()
  if (-not $sha) {
    throw "Could not resolve git commit SHA for Railway release metadata"
  }

  Write-Host "Stamping SOURCE_GIT_COMMIT_SHA=$sha"
  railway variable set "SOURCE_GIT_COMMIT_SHA=$sha" --skip-deploys | Out-Null

  Write-Host "Deploying from repo root: $repoRoot"
  railway deployment up --ci --message $Message
}
finally {
  Pop-Location
}
