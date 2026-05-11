$ErrorActionPreference = "Stop"

$repoRoot = "C:\Users\Henrik Madsen\.paperclip\instances\default\projects\3fee8de0-ac05-47ee-a8bd-b3b8a17cc09e\7bc34589-7df0-4922-a15b-7effc6367f4d\calculator-thailand"
$scriptPath = Join-Path $repoRoot "scripts\ceo_7day_autopilot.ps1"
$taskName = "CAL2757_CEO_7DAY_AUTOPILOT"

if (!(Test-Path $scriptPath)) {
  throw "Autopilot script not found: $scriptPath"
}

$startAt = (Get-Date).AddMinutes(2)
$endAt = $startAt.AddDays(7)
$repetitionInterval = New-TimeSpan -Hours 6
$repetitionDuration = New-TimeSpan -Days 7

$action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""

$trigger = New-ScheduledTaskTrigger -Once -At $startAt `
  -RepetitionInterval $repetitionInterval `
  -RepetitionDuration $repetitionDuration

# Ensure previous task is removed
if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
  Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Description "CAL-2757 7-day CEO autopilot SEO/GEO monitor" | Out-Null
Start-ScheduledTask -TaskName $taskName

Write-Output "Scheduled task installed: $taskName"
Write-Output ("Start: " + $startAt.ToString("yyyy-MM-dd HH:mm"))
Write-Output ("End: " + $endAt.ToString("yyyy-MM-dd HH:mm"))
Write-Output "Frequency: every 6 hours"

