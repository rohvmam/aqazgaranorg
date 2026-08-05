<#
    05-firewall.ps1 - opens only what the site needs: HTTP and HTTPS.

    Node (3000) and PostgreSQL (5432) stay unreachable from outside; they are
    bound to localhost and are not opened here on purpose.

    Note: most VPS providers ALSO have their own firewall / security group in
    the control panel. Opening ports here does nothing if the provider still
    blocks them - check both.

    Usage (elevated PowerShell):
        .\05-firewall.ps1
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

function Write-Step { param($m) Write-Host "`n=== $m ===" -ForegroundColor Cyan }
function Write-Ok   { param($m) Write-Host "  [ok] $m"   -ForegroundColor Green }

if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()
        ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw "Run this script from an elevated PowerShell (Run as Administrator)."
}

$rules = @(
    @{ Name = "Aqazgaran HTTP";  Port = 80  },
    @{ Name = "Aqazgaran HTTPS"; Port = 443 }
)

Write-Step "Inbound rules"
foreach ($r in $rules) {
    $existing = Get-NetFirewallRule -DisplayName $r.Name -ErrorAction SilentlyContinue
    if ($existing) {
        Set-NetFirewallRule -DisplayName $r.Name -Enabled True -Action Allow | Out-Null
        Write-Ok ("{0} (TCP {1}) already existed - ensured enabled" -f $r.Name, $r.Port)
    } else {
        New-NetFirewallRule -DisplayName $r.Name -Direction Inbound -Protocol TCP `
            -LocalPort $r.Port -Action Allow -Profile Any | Out-Null
        Write-Ok ("{0} (TCP {1}) created" -f $r.Name, $r.Port)
    }
}

Write-Step "Confirming the private ports are NOT exposed"
foreach ($p in @(3000, 5432)) {
    $open = Get-NetFirewallPortFilter | Where-Object { $_.LocalPort -eq "$p" } |
            Get-NetFirewallRule -ErrorAction SilentlyContinue |
            Where-Object { $_.Direction -eq "Inbound" -and $_.Action -eq "Allow" -and $_.Enabled -eq "True" }
    if ($open) {
        Write-Host ("  [warn] an inbound allow rule exists for port {0}: {1}" -f $p, ($open.DisplayName -join ", ")) -ForegroundColor Yellow
        Write-Host "         Node and PostgreSQL should not be reachable from the internet." -ForegroundColor Yellow
    } else {
        Write-Ok "port $p is not opened inbound (correct)"
    }
}

Write-Step "Listening sockets"
Get-NetTCPConnection -State Listen |
    Where-Object { $_.LocalPort -in @(80, 443, 3000, 5432) } |
    Select-Object LocalAddress, LocalPort, @{ N = "Process"; E = { (Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName } } |
    Sort-Object LocalPort | Format-Table -AutoSize

Write-Host "127.0.0.1 for 3000/5432 is what you want. 0.0.0.0 for 80/443 is what you want." -ForegroundColor DarkGray
Write-Host ""
Write-Host "Firewall done. Now browse to your domain over HTTPS." -ForegroundColor Green
Write-Host "Remember to open 80/443 in your VPS provider's control panel too." -ForegroundColor Yellow
