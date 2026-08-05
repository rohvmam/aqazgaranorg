<#
    00-connectivity.ps1 - run this FIRST, before installing anything.

    Everything else depends on the VPS being able to reach npm, GitHub and
    Let's Encrypt. If any of these fail the deployment needs a different
    approach (registry mirror, or a host in another region), so it is worth
    five minutes here rather than an hour of failed installs.

    Usage (PowerShell as Administrator):
        Set-ExecutionPolicy -Scope Process Bypass -Force
        .\00-connectivity.ps1
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Continue"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "=== Aqazgaran VPS connectivity check ===" -ForegroundColor Cyan
Write-Host ""

# --- Basic host facts, useful when pasting results back -------------------
$os = Get-CimInstance Win32_OperatingSystem
$cs = Get-CimInstance Win32_ComputerSystem
Write-Host ("OS      : {0} (build {1})" -f $os.Caption, $os.BuildNumber)
Write-Host ("CPU/RAM : {0} logical cores / {1:N1} GB" -f $cs.NumberOfLogicalProcessors, ($cs.TotalPhysicalMemory / 1GB))
$sys = Get-PSDrive -Name C
Write-Host ("Disk C: : {0:N1} GB free of {1:N1} GB" -f ($sys.Free / 1GB), (($sys.Used + $sys.Free) / 1GB))
Write-Host ("PowerShell: {0}" -f $PSVersionTable.PSVersion)
Write-Host ""

# --- Public IP - you need this for the DNS A record ------------------------
Write-Host "--- Public IP (point your domain's A record here) ---" -ForegroundColor Cyan
try {
    $ip = (Invoke-RestMethod -Uri "https://api.ipify.org?format=json" -TimeoutSec 20).ip
    Write-Host ("Public IP: {0}" -f $ip) -ForegroundColor Green
} catch {
    Write-Host "Could not determine public IP automatically: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# --- Outbound reachability -------------------------------------------------
$targets = @(
    @{ Name = "npm registry";    Host = "registry.npmjs.org";            Port = 443; Why = "npm ci will fail without this" },
    @{ Name = "GitHub";          Host = "github.com";                    Port = 443; Why = "cloning the repo" },
    @{ Name = "GitHub codeload"; Host = "codeload.github.com";           Port = 443; Why = "release downloads (Caddy, Git)" },
    @{ Name = "Node.js dist";    Host = "nodejs.org";                    Port = 443; Why = "Node installer download" },
    @{ Name = "Let's Encrypt";   Host = "acme-v02.api.letsencrypt.org";  Port = 443; Why = "automatic HTTPS certificates" },
    @{ Name = "EnterpriseDB";    Host = "get.enterprisedb.com";          Port = 443; Why = "PostgreSQL installer download" },
    @{ Name = "Gmail SMTP";      Host = "smtp.gmail.com";                Port = 587; Why = "sending OTP emails" },
    @{ Name = "Render Postgres"; Host = "dpg-d9cnfvu1a83c739elco0-a.oregon-postgres.render.com"; Port = 5432; Why = "migrating existing data (optional)" }
)

$failed = @()
Write-Host "--- Outbound connectivity ---" -ForegroundColor Cyan
foreach ($t in $targets) {
    $ok = $false
    try {
        $ok = (Test-NetConnection -ComputerName $t.Host -Port $t.Port -InformationLevel Quiet -WarningAction SilentlyContinue)
    } catch {
        $ok = $false
    }
    if ($ok) {
        Write-Host ("  [ OK ] {0,-16} {1}:{2}" -f $t.Name, $t.Host, $t.Port) -ForegroundColor Green
    } else {
        Write-Host ("  [FAIL] {0,-16} {1}:{2}  <- {3}" -f $t.Name, $t.Host, $t.Port, $t.Why) -ForegroundColor Red
        $failed += $t
    }
}
Write-Host ""

# --- Verdict ---------------------------------------------------------------
$critical = $failed | Where-Object { $_.Name -in @("npm registry", "GitHub", "Node.js dist") }
if ($critical) {
    Write-Host "STOP. Critical endpoints are unreachable from this VPS." -ForegroundColor Red
    Write-Host "Send this whole output back before running 01-prereqs.ps1 - the plan has to change." -ForegroundColor Red
    exit 1
}

if ($failed) {
    Write-Host "Usable, with caveats. These non-critical endpoints failed:" -ForegroundColor Yellow
    foreach ($f in $failed) { Write-Host ("  - {0} ({1})" -f $f.Name, $f.Why) -ForegroundColor Yellow }
    Write-Host ""
    Write-Host "Let's Encrypt failing means no automatic HTTPS." -ForegroundColor Yellow
    Write-Host "Render Postgres failing only means data migration must be skipped (a fresh seeded DB is used instead)." -ForegroundColor Yellow
} else {
    Write-Host "All endpoints reachable. Continue with 01-prereqs.ps1." -ForegroundColor Green
}
