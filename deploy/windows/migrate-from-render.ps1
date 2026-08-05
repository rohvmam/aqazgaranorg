<#
    migrate-from-render.ps1 - copies the live Render database onto this VPS.

    Run this ON THE VPS. The developer's home network cannot reach Render's
    Postgres (port 5432 is blocked there), but the VPS normally can - that is
    the whole reason this runs here.

    pg_dump refuses to read a server newer than itself, so the local
    PostgreSQL must be version 18 or higher (Render runs 18).

    This OVERWRITES the local database. It is meant to run once, before the
    site takes real traffic on this server.

    Usage (elevated PowerShell):
        .\migrate-from-render.ps1 -RenderUrl "postgresql://user:pass@host/db?sslmode=require"

    If it fails, nothing is lost: 03-app.ps1 already created the schema and
    seeded demo data, so the site works - you just re-register your account.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $RenderUrl,                                  # External Database URL from the Render dashboard
    [string] $LocalUrl = $null,                           # defaults to DATABASE_URL from .env
    [string] $PgBase   = "C:\Program Files\PostgreSQL\18",
    [string] $AppDir   = "C:\apps\aqazgaran",
    [switch] $Force                                       # skip the confirmation prompt
)

$ErrorActionPreference = "Stop"

function Write-Step { param($m) Write-Host "`n=== $m ===" -ForegroundColor Cyan }
function Write-Ok   { param($m) Write-Host "  [ok] $m"   -ForegroundColor Green }

$pgDump    = Join-Path $PgBase "bin\pg_dump.exe"
$pgRestore = Join-Path $PgBase "bin\pg_restore.exe"
$psql      = Join-Path $PgBase "bin\psql.exe"
foreach ($p in @($pgDump, $pgRestore, $psql)) {
    if (-not (Test-Path $p)) { throw "Missing $p - run 01-prereqs.ps1 first." }
}

# Read DATABASE_URL out of .env unless one was passed explicitly.
if (-not $LocalUrl) {
    $envFile = Join-Path $AppDir ".env"
    if (-not (Test-Path $envFile)) { throw "No -LocalUrl given and $envFile does not exist." }
    $line = Select-String -Path $envFile -Pattern '^\s*DATABASE_URL\s*=\s*"?([^"\r\n]+)"?' | Select-Object -First 1
    if (-not $line) { throw "DATABASE_URL not found in $envFile" }
    $LocalUrl = $line.Matches[0].Groups[1].Value
}
Write-Host "Source : Render (remote)"
Write-Host ("Target : {0}" -f ($LocalUrl -replace ':[^:@/]+@', ':****@'))

Write-Step "Version check"
# pg_dump must be at least as new as the server it reads.
$dumpVer = (& $pgDump --version) -replace '[^\d\.]', ''
$dumpMajor = [int]($dumpVer -split '\.')[0]
Write-Host ("  local pg_dump : {0}" -f $dumpVer)
$remoteVer = & $psql $RenderUrl -tAc "SHOW server_version;" 2>&1
if ($LASTEXITCODE -ne 0) {
    throw @"
Cannot reach the Render database from this VPS:
$remoteVer

Skip the migration - the site already works with the seeded database.
"@
}
$remoteVer = ($remoteVer | Out-String).Trim()
$remoteMajor = [int](($remoteVer -split '\.')[0])
Write-Host ("  Render server : {0}" -f $remoteVer)
if ($dumpMajor -lt $remoteMajor) {
    throw "pg_dump $dumpMajor cannot read a PostgreSQL $remoteMajor server. Install PostgreSQL $remoteMajor locally and re-run."
}
Write-Ok "versions are compatible"

if (-not $Force) {
    Write-Host ""
    Write-Host "This REPLACES every table in the local database with Render's data." -ForegroundColor Yellow
    $answer = Read-Host "Type YES to continue"
    if ($answer -ne "YES") { Write-Host "Aborted."; exit 0 }
}

# --------------------------------------------------------------------------
Write-Step "Stopping the app while the database changes underneath it"
$appWasRunning = $false
$svc = Get-Service -Name "aqazgaran-app" -ErrorAction SilentlyContinue
if ($svc -and $svc.Status -eq "Running") {
    Stop-Service "aqazgaran-app"
    $appWasRunning = $true
    Write-Ok "aqazgaran-app stopped"
} else { Write-Host "  [skip] service not running" -ForegroundColor DarkGray }

try {
    Write-Step "Dumping from Render"
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupDir = Join-Path $AppDir "backups"
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    $dumpFile = Join-Path $backupDir "render-$stamp.dump"

    # Custom format (-Fc) so pg_restore can drop/recreate objects cleanly.
    & $pgDump --format=custom --no-owner --no-privileges --file $dumpFile $RenderUrl
    if ($LASTEXITCODE -ne 0) { throw "pg_dump failed" }
    $sizeMb = (Get-Item $dumpFile).Length / 1MB
    Write-Ok ("dumped {0:N2} MB to {1}" -f $sizeMb, $dumpFile)

    Write-Step "Backing up the current local database first"
    $localBackup = Join-Path $backupDir "local-before-migrate-$stamp.dump"
    & $pgDump --format=custom --no-owner --no-privileges --file $localBackup $LocalUrl
    if ($LASTEXITCODE -eq 0) { Write-Ok "local snapshot saved to $localBackup" }
    else { Write-Host "  [warn] could not snapshot the local database (it may be empty)" -ForegroundColor Yellow }

    Write-Step "Restoring into the local database"
    # --clean --if-exists drops existing objects first; exit code 1 usually
    # just means "some DROP had nothing to drop", which is fine.
    & $pgRestore --clean --if-exists --no-owner --no-privileges --dbname $LocalUrl $dumpFile
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [warn] pg_restore reported non-fatal errors (usual for --clean on a fresh database)" -ForegroundColor Yellow
    }

    Write-Step "Verifying"
    $counts = & $psql $LocalUrl -tAc @"
SELECT 'users=' || (SELECT count(*) FROM users)
    || ' roles=' || (SELECT count(*) FROM "Role")
    || ' projects=' || (SELECT count(*) FROM "Project");
"@ 2>&1
    if ($LASTEXITCODE -ne 0) {
        # Table names differ if the schema did not restore; show what did land.
        Write-Host "  [warn] count query failed; listing tables instead" -ForegroundColor Yellow
        & $psql $LocalUrl -c "\dt"
    } else {
        Write-Ok ("row counts: {0}" -f ($counts | Out-String).Trim())
    }
}
finally {
    if ($appWasRunning) {
        Start-Service "aqazgaran-app"
        Write-Ok "aqazgaran-app restarted"
    }
}

Write-Host ""
Write-Host "Migration finished. Sign in with your existing account to confirm." -ForegroundColor Green
Write-Host "Backups are in $AppDir\backups - keep them until you are satisfied." -ForegroundColor DarkGray
