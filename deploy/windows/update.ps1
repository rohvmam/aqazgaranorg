<#
    update.ps1 - deploy the latest commit. This is the day-to-day script.

    Pulls main, reinstalls, rebuilds, syncs the schema, restarts the service,
    and checks the site answers. If the build fails the running site is left
    untouched, because the service is only restarted after a successful build.

    Usage (elevated PowerShell):
        cd C:\apps\aqazgaran\deploy\windows
        .\update.ps1
#>

[CmdletBinding()]
param(
    [string] $AppDir = "C:\apps\aqazgaran",
    [string] $Branch = "main",
    [int]    $Port   = 3000
)

$ErrorActionPreference = "Stop"

function Write-Step { param($m) Write-Host "`n=== $m ===" -ForegroundColor Cyan }
function Write-Ok   { param($m) Write-Host "  [ok] $m"   -ForegroundColor Green }

# devDependencies are needed to build; see the note in 03-app.ps1.
if ($env:NODE_ENV) { $env:NODE_ENV = $null }
$env:NODE_OPTIONS = "--max-old-space-size=3072"

Set-Location $AppDir

Write-Step "Current version"
$before = (& git rev-parse --short HEAD)
Write-Host ("  HEAD before: {0}" -f $before)

Write-Step "Fetching $Branch"
& git fetch --all --prune
if ($LASTEXITCODE -ne 0) { throw "git fetch failed" }
& git reset --hard "origin/$Branch"
if ($LASTEXITCODE -ne 0) { throw "git reset failed" }
$after = (& git rev-parse --short HEAD)
Write-Ok ("HEAD now: {0}" -f $after)

if ($before -eq $after) {
    Write-Host "  nothing new to deploy - rebuilding anyway so a broken build cannot hide" -ForegroundColor DarkGray
}

Write-Step "Dependencies"
& npm ci
if ($LASTEXITCODE -ne 0) { throw "npm ci failed - the running site was not touched" }

Write-Step "Build"
& npm run build
if ($LASTEXITCODE -ne 0) { throw "next build failed - the running site was not touched" }
Write-Ok "build succeeded"

Write-Step "Schema"
& npx prisma db push --skip-generate
if ($LASTEXITCODE -ne 0) { throw "prisma db push failed" }
Write-Ok "schema in sync"

Write-Step "Restarting the service"
Restart-Service "aqazgaran-app" -Force
Write-Ok "aqazgaran-app restarted"

Write-Step "Smoke test"
$ok = $false
foreach ($attempt in 1..20) {
    Start-Sleep -Seconds 2
    try {
        $r = Invoke-WebRequest -Uri ("http://127.0.0.1:{0}/fa" -f $Port) -UseBasicParsing -TimeoutSec 15
        if ($r.StatusCode -eq 200) { $ok = $true; break }
    } catch { }
}
if (-not $ok) {
    Write-Host "  [fail] the site is not answering after the restart." -ForegroundColor Red
    Write-Host "         Get-Content $AppDir\logs\app.err.log -Tail 40" -ForegroundColor Red
    Write-Host "         Roll back with: git reset --hard $before; .\update.ps1" -ForegroundColor Red
    throw "Post-deploy smoke test failed."
}
Write-Ok "site answered 200"

Write-Host ""
Write-Host ("Deployed {0} -> {1}" -f $before, $after) -ForegroundColor Green
