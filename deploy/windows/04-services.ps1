<#
    04-services.ps1 - registers the app and Caddy as Windows services.

    Two services, both auto-start at boot and restart on crash:
      aqazgaran-app    next start, bound to 127.0.0.1:3000 (not public)
      aqazgaran-caddy  reverse proxy on 80/443 with automatic HTTPS

    Safe to re-run: existing services are reconfigured in place.

    Usage (elevated PowerShell):
        .\04-services.ps1 -Domain "example.com"
        .\04-services.ps1 -Domain "example.com" -NoCaddy    # app service only
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $Domain,                       # e.g. aqazgaran.com (no scheme)
    [string] $AppDir   = "C:\apps\aqazgaran",
    [string] $ToolsDir = "C:\tools",
    [int]    $Port     = 3000,
    [switch] $NoCaddy
)

$ErrorActionPreference = "Stop"

function Write-Step { param($m) Write-Host "`n=== $m ===" -ForegroundColor Cyan }
function Write-Ok   { param($m) Write-Host "  [ok] $m"   -ForegroundColor Green }

if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()
        ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw "Run this script from an elevated PowerShell (Run as Administrator)."
}

$nssm     = Join-Path $ToolsDir "nssm\nssm.exe"
$caddyExe = Join-Path $ToolsDir "caddy\caddy.exe"
$nodeExe  = Join-Path $env:ProgramFiles "nodejs\node.exe"
$nextBin  = Join-Path $AppDir "node_modules\next\dist\bin\next"
$logDir   = Join-Path $AppDir "logs"

foreach ($p in @($nssm, $nodeExe, $nextBin)) {
    if (-not (Test-Path $p)) { throw "Missing: $p (run 01-prereqs.ps1 and 03-app.ps1 first)" }
}
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

function Invoke-Nssm {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]] $Args)
    $out = & $nssm @Args 2>&1
    # nssm writes UTF-16 to stdout; normalise so messages are readable in logs.
    return (($out | Out-String) -replace "`0", "").Trim()
}

function Set-NssmService {
    param(
        [string] $Name,
        [string] $Application,
        [string] $Arguments,
        [string] $WorkingDir,
        [string] $StdoutLog,
        [string] $StderrLog
    )
    $existing = Get-Service -Name $Name -ErrorAction SilentlyContinue
    if ($existing) {
        if ($existing.Status -ne "Stopped") { Invoke-Nssm stop $Name | Out-Null; Start-Sleep -Seconds 2 }
        Write-Host "  reconfiguring existing service $Name"
    } else {
        Invoke-Nssm install $Name $Application $Arguments | Out-Null
        Write-Host "  installed service $Name"
    }

    Invoke-Nssm set $Name Application       $Application | Out-Null
    Invoke-Nssm set $Name AppParameters     $Arguments   | Out-Null
    Invoke-Nssm set $Name AppDirectory      $WorkingDir  | Out-Null
    Invoke-Nssm set $Name AppStdout         $StdoutLog   | Out-Null
    Invoke-Nssm set $Name AppStderr         $StderrLog   | Out-Null
    Invoke-Nssm set $Name AppRotateFiles    1            | Out-Null
    Invoke-Nssm set $Name AppRotateBytes    10485760     | Out-Null   # 10 MB
    Invoke-Nssm set $Name Start             SERVICE_AUTO_START | Out-Null
    Invoke-Nssm set $Name AppExit Default   Restart      | Out-Null
    Invoke-Nssm set $Name AppRestartDelay   5000         | Out-Null   # 5 s between restarts
    Invoke-Nssm set $Name AppStopMethodSkip 0            | Out-Null
}

# --------------------------------------------------------------------------
Write-Step "Service: aqazgaran-app"
# -H 127.0.0.1 keeps Node off the public interface; only Caddy may reach it.
Set-NssmService -Name "aqazgaran-app" `
    -Application $nodeExe `
    -Arguments ("`"{0}`" start -H 127.0.0.1 -p {1}" -f $nextBin, $Port) `
    -WorkingDir $AppDir `
    -StdoutLog (Join-Path $logDir "app.out.log") `
    -StderrLog (Join-Path $logDir "app.err.log")
# next start reads .env itself, so no environment block is needed here.
Invoke-Nssm set "aqazgaran-app" AppEnvironmentExtra "NODE_ENV=production" | Out-Null
Start-Service "aqazgaran-app"
Write-Ok "aqazgaran-app started on 127.0.0.1:$Port"

Write-Step "Local smoke test"
$ok = $false
foreach ($attempt in 1..20) {
    Start-Sleep -Seconds 2
    try {
        $r = Invoke-WebRequest -Uri ("http://127.0.0.1:{0}/en" -f $Port) -UseBasicParsing -TimeoutSec 15
        if ($r.StatusCode -eq 200) { $ok = $true; break }
    } catch { }
}
if ($ok) {
    Write-Ok "app answered 200 on http://127.0.0.1:$Port/en"
} else {
    Write-Host "  [fail] the app did not answer. Check the log:" -ForegroundColor Red
    Write-Host "         Get-Content $logDir\app.err.log -Tail 40" -ForegroundColor Red
    throw "App service is not serving requests."
}

# --------------------------------------------------------------------------
if ($NoCaddy) {
    Write-Host "`nSkipping Caddy (-NoCaddy). The app is only reachable locally." -ForegroundColor Yellow
} else {
    Write-Step "Caddy configuration"
    if (-not (Test-Path $caddyExe)) { throw "Caddy not found at $caddyExe - run 01-prereqs.ps1" }

    $caddyDir  = Split-Path $caddyExe -Parent
    $caddyfile = Join-Path $caddyDir "Caddyfile"
    $template  = Join-Path $PSScriptRoot "Caddyfile"
    if (-not (Test-Path $template)) { throw "Caddyfile template not found next to this script" }

    $caddyText = (Get-Content $template -Raw).
        Replace("{{DOMAIN}}", $Domain).
        Replace("{{PORT}}", "$Port")
    # Must be BOM-less: Set-Content -Encoding UTF8 on PS 5.1 writes a BOM,
    # which Caddy's parser rejects at the first token.
    [System.IO.File]::WriteAllText($caddyfile, $caddyText, (New-Object System.Text.UTF8Encoding($false)))
    Write-Ok "wrote $caddyfile for $Domain"

    # Fail fast on a bad Caddyfile rather than in a service that just won't start.
    $fmt = & $caddyExe validate --config $caddyfile 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Caddyfile is invalid:`n$fmt" }
    Write-Ok "Caddyfile validated"

    Write-Step "Service: aqazgaran-caddy"
    Set-NssmService -Name "aqazgaran-caddy" `
        -Application $caddyExe `
        -Arguments ("run --config `"{0}`" --adapter caddyfile" -f $caddyfile) `
        -WorkingDir $caddyDir `
        -StdoutLog (Join-Path $logDir "caddy.out.log") `
        -StderrLog (Join-Path $logDir "caddy.err.log")
    Start-Service "aqazgaran-caddy"
    Write-Ok "aqazgaran-caddy started"

    Write-Host ""
    Write-Host "Caddy requests a certificate on the first HTTPS request." -ForegroundColor Yellow
    Write-Host "That only works once $Domain resolves to this server's public IP" -ForegroundColor Yellow
    Write-Host "and ports 80/443 are open (run 05-firewall.ps1)." -ForegroundColor Yellow
}

# --------------------------------------------------------------------------
Write-Step "Status"
Get-Service -Name "aqazgaran-*" | Format-Table Name, Status, StartType -AutoSize

Write-Host "Next: .\05-firewall.ps1" -ForegroundColor Green
Write-Host "Logs live in $logDir" -ForegroundColor DarkGray
