<#
    03-app.ps1 - fetches the code, builds it, and prepares the database schema.

    Run this after .env exists at $AppDir\.env (see env.production.example).

    Safe to re-run: it pulls the latest commit and rebuilds. This is also the
    script `update.ps1` calls for redeploys.

    Usage (elevated PowerShell):
        .\03-app.ps1
        .\03-app.ps1 -SkipSeed        # schema only, no demo data
#>

[CmdletBinding()]
param(
    [string] $AppDir  = "C:\apps\aqazgaran",
    [string] $RepoUrl = "https://github.com/rohvmam/aqazgaranorg.git",
    [string] $Branch  = "main",
    [switch] $SkipSeed
)

$ErrorActionPreference = "Stop"

function Write-Step { param($m) Write-Host "`n=== $m ===" -ForegroundColor Cyan }
function Write-Ok   { param($m) Write-Host "  [ok] $m"   -ForegroundColor Green }

# `npm ci` must install devDependencies: next build needs tailwindcss and
# typescript, and `db:seed` needs tsx. NODE_ENV=production would skip them and
# the build would fail with confusing "module not found" errors.
if ($env:NODE_ENV) {
    Write-Host "  clearing NODE_ENV=$env:NODE_ENV for the build (devDependencies are required)" -ForegroundColor Yellow
    $env:NODE_ENV = $null
}
# 4 GB box: give the build enough heap without letting it swap the machine.
$env:NODE_OPTIONS = "--max-old-space-size=3072"

foreach ($cmd in @("git", "node", "npm")) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        throw "$cmd is not on PATH. Run 01-prereqs.ps1, then open a NEW PowerShell window."
    }
}

Write-Step "Source code"
if (Test-Path (Join-Path $AppDir ".git")) {
    Push-Location $AppDir
    & git fetch --all --prune
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw "git fetch failed" }
    & git checkout $Branch
    & git reset --hard "origin/$Branch"
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw "git reset failed" }
    Pop-Location
    Write-Ok "updated to latest origin/$Branch"
} else {
    $parent = Split-Path $AppDir -Parent
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
    if ((Test-Path $AppDir) -and (Get-ChildItem $AppDir -Force | Where-Object { $_.Name -ne ".env" })) {
        throw "$AppDir already has files but is not a git repo. Move it aside and re-run."
    }
    # Preserve a .env that was created before the clone.
    $envBackup = $null
    if (Test-Path (Join-Path $AppDir ".env")) {
        $envBackup = Join-Path $env:TEMP "aqazgaran.env.bak"
        Copy-Item (Join-Path $AppDir ".env") $envBackup -Force
    }
    if (Test-Path $AppDir) { Remove-Item $AppDir -Recurse -Force }
    & git clone --branch $Branch $RepoUrl $AppDir
    if ($LASTEXITCODE -ne 0) { throw "git clone failed" }
    if ($envBackup) { Copy-Item $envBackup (Join-Path $AppDir ".env") -Force }
    Write-Ok "cloned $RepoUrl"
}

Set-Location $AppDir

Write-Step "Environment file"
$envFile = Join-Path $AppDir ".env"
if (-not (Test-Path $envFile)) {
    throw @"
$envFile is missing.
Copy deploy\windows\env.production.example to $envFile and fill it in
(DATABASE_URL came from 02-database.ps1), then re-run this script.
"@
}
$envText = Get-Content $envFile -Raw
foreach ($required in @("DATABASE_URL", "AUTH_SECRET", "SITE_URL")) {
    # [ \t] rather than \s around the '=': \s matches newlines, so a bare
    # "AUTH_SECRET=" would otherwise be satisfied by text on the NEXT line.
    # The optional quote must be followed by real content so NAME="" fails too.
    if ($envText -notmatch "(?m)^[ \t]*$required[ \t]*=[ \t]*`"?[^`"\s]") {
        throw "$required is missing or empty in $envFile"
    }
}
if ($envText -match "REPLACE_ME") {
    throw "$envFile still contains REPLACE_ME placeholders - fill them in before deploying."
}
if ($envText -match "(?m)^\s*SITE_URL\s*=\s*`"?http://localhost") {
    Write-Host "  [warn] SITE_URL still points at localhost - password-reset links and sitemap will be wrong." -ForegroundColor Yellow
}
Write-Ok "required variables present"

Write-Step "Dependencies (npm ci)"
& npm ci
if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
Write-Ok "dependencies installed (postinstall ran prisma generate)"

Write-Step "Build (next build)"
& npm run build
if ($LASTEXITCODE -ne 0) { throw "next build failed" }
Write-Ok "build complete"

Write-Step "Database schema (prisma db push)"
& npx prisma db push --skip-generate
if ($LASTEXITCODE -ne 0) { throw "prisma db push failed - check DATABASE_URL in .env" }
Write-Ok "schema in sync"

if ($SkipSeed) {
    Write-Host "  [skip] seeding (-SkipSeed)" -ForegroundColor DarkGray
} else {
    Write-Step "Seed data"
    # prisma/seed.ts returns immediately when users already exist, so this is
    # a no-op on an already-populated database.
    & npm run db:seed
    if ($LASTEXITCODE -ne 0) { Write-Host "  [warn] seed failed - not fatal, the app still runs" -ForegroundColor Yellow }
    else { Write-Ok "seed finished (skips itself if the database already has users)" }
}

Write-Host ""
Write-Host "App is built and the database is ready." -ForegroundColor Green
Write-Host "Next: .\04-services.ps1 (then 05-firewall.ps1)" -ForegroundColor Green
