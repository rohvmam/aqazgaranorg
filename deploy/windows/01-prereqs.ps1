<#
    01-prereqs.ps1 - installs everything the app needs on a bare Windows Server.

    Installs: Node.js 22 LTS, Git, PostgreSQL 18, Caddy, NSSM.
    Also applies the Windows-specific tweaks this stack needs (long paths,
    Defender exclusion) that otherwise cause confusing failures later.

    Safe to re-run: every step checks whether it is already done.

    Usage (PowerShell as Administrator):
        Set-ExecutionPolicy -Scope Process Bypass -Force
        .\01-prereqs.ps1

    If the PostgreSQL download fails (EDB changes filenames occasionally),
    download the Windows x64 installer for PostgreSQL 18 by hand and re-run:
        .\01-prereqs.ps1 -PostgresInstaller "C:\path\to\postgresql-18-windows-x64.exe"
#>

[CmdletBinding()]
param(
    [string] $AppDir            = "C:\apps\aqazgaran",
    [string] $ToolsDir          = "C:\tools",
    [string] $PostgresVersion   = "18.0-1",
    [string] $PostgresPassword,          # superuser (postgres) password; prompted if omitted
    [string] $PostgresInstaller          # optional: path to an already-downloaded installer
)

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Write-Step  { param($m) Write-Host "`n=== $m ===" -ForegroundColor Cyan }
function Write-Ok    { param($m) Write-Host "  [ok] $m"   -ForegroundColor Green }
function Write-Skip  { param($m) Write-Host "  [skip] $m" -ForegroundColor DarkGray }
function Write-Warn2 { param($m) Write-Host "  [warn] $m" -ForegroundColor Yellow }

if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()
        ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw "Run this script from an elevated PowerShell (Run as Administrator)."
}

$dl = Join-Path $env:TEMP "aqazgaran-setup"
New-Item -ItemType Directory -Force -Path $dl, $ToolsDir, $AppDir | Out-Null

function Get-File {
    param([string]$Uri, [string]$OutFile)
    if (Test-Path $OutFile) { Write-Skip "already downloaded: $(Split-Path $OutFile -Leaf)"; return }
    Write-Host "  downloading $Uri"
    $ProgressPreference = "SilentlyContinue"   # hugely faster Invoke-WebRequest
    Invoke-WebRequest -Uri $Uri -OutFile $OutFile -UseBasicParsing -TimeoutSec 600
}

function Test-Command { param([string]$Name) return [bool](Get-Command $Name -ErrorAction SilentlyContinue) }

function Add-ToMachinePath {
    param([string]$Dir)
    $cur = [Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($cur -split ";" -notcontains $Dir) {
        [Environment]::SetEnvironmentVariable("Path", ($cur.TrimEnd(";") + ";" + $Dir), "Machine")
        Write-Ok "added to system PATH: $Dir"
    }
    if ($env:Path -split ";" -notcontains $Dir) { $env:Path = $env:Path.TrimEnd(";") + ";" + $Dir }
}

# --------------------------------------------------------------------------
Write-Step "Windows tweaks"

# node_modules paths blow past 260 chars; without this npm ci fails oddly.
$fsKey = "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem"
if ((Get-ItemProperty -Path $fsKey -Name LongPathsEnabled -ErrorAction SilentlyContinue).LongPathsEnabled -ne 1) {
    Set-ItemProperty -Path $fsKey -Name LongPathsEnabled -Value 1 -Type DWord
    Write-Ok "enabled NTFS long paths (a reboot makes it apply everywhere)"
} else { Write-Skip "long paths already enabled" }

# Defender scanning every file npm writes turns a 2 minute install into 15.
try {
    Add-MpPreference -ExclusionPath $AppDir -ErrorAction Stop
    Write-Ok "Defender exclusion added for $AppDir"
} catch { Write-Skip "Defender exclusion not applied (Defender may be absent): $($_.Exception.Message)" }

# IE Enhanced Security blocks browser downloads on Server SKUs; harmless to relax.
$iehard = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A7-37EF-4b3f-8CFC-4F3A74704073}"
if (Test-Path $iehard) {
    Set-ItemProperty -Path $iehard -Name IsInstalled -Value 0 -ErrorAction SilentlyContinue
    Write-Ok "IE Enhanced Security Configuration relaxed for Administrators"
}

# --------------------------------------------------------------------------
Write-Step "Node.js 22 LTS"
$nodeOk = $false
if (Test-Command node) {
    $v = (& node -v).TrimStart("v")
    if ([int]($v -split "\.")[0] -ge 22) { Write-Skip "Node $v already installed"; $nodeOk = $true }
    else { Write-Warn2 "Node $v is too old; installing 22 LTS alongside" }
}
if (-not $nodeOk) {
    # Ask nodejs.org which 22.x is current rather than hardcoding a version
    # that goes stale.
    $index   = Invoke-RestMethod -Uri "https://nodejs.org/dist/index.json" -TimeoutSec 120
    $latest  = $index | Where-Object { $_.version -like "v22.*" -and $_.lts } | Select-Object -First 1
    if (-not $latest) { throw "Could not find a Node 22 LTS release on nodejs.org" }
    $msi = Join-Path $dl ("node-{0}-x64.msi" -f $latest.version)
    Get-File -Uri ("https://nodejs.org/dist/{0}/node-{0}-x64.msi" -f $latest.version) -OutFile $msi
    Write-Host "  installing Node $($latest.version) (silent)"
    $p = Start-Process msiexec.exe -ArgumentList "/i `"$msi`" /qn /norestart" -Wait -PassThru
    if ($p.ExitCode -ne 0) { throw "Node installer exited with code $($p.ExitCode)" }
    Add-ToMachinePath "C:\Program Files\nodejs"
    Write-Ok "Node installed"
}

# --------------------------------------------------------------------------
Write-Step "Git"
if (Test-Command git) {
    Write-Skip "git already installed: $((& git --version))"
} else {
    $rel = Invoke-RestMethod -Uri "https://api.github.com/repos/git-for-windows/git/releases/latest" `
        -Headers @{ "User-Agent" = "aqazgaran-setup" } -TimeoutSec 120
    $asset = $rel.assets | Where-Object { $_.name -match "^Git-.*-64-bit\.exe$" } | Select-Object -First 1
    if (-not $asset) { throw "Could not locate the 64-bit Git for Windows installer" }
    $exe = Join-Path $dl $asset.name
    Get-File -Uri $asset.browser_download_url -OutFile $exe
    Write-Host "  installing Git (silent)"
    $p = Start-Process $exe -ArgumentList "/VERYSILENT /NORESTART /NOCANCEL /SP- /SUPPRESSMSGBOXES" -Wait -PassThru
    if ($p.ExitCode -ne 0) { throw "Git installer exited with code $($p.ExitCode)" }
    Add-ToMachinePath "C:\Program Files\Git\cmd"
    Write-Ok "Git installed"
}
# Long paths again, this time for git itself.
& git config --system core.longpaths true 2>$null

# --------------------------------------------------------------------------
Write-Step "PostgreSQL 18"
$pgBase = "C:\Program Files\PostgreSQL\18"
if (Test-Path (Join-Path $pgBase "bin\psql.exe")) {
    Write-Skip "PostgreSQL 18 already installed at $pgBase"
} else {
    if (-not $PostgresPassword) {
        $sec = Read-Host "  Choose a password for the PostgreSQL superuser (postgres)" -AsSecureString
        $PostgresPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
    }
    if (-not $PostgresPassword) { throw "A PostgreSQL superuser password is required." }

    if ($PostgresInstaller) {
        $exe = $PostgresInstaller
        if (-not (Test-Path $exe)) { throw "Installer not found: $exe" }
    } else {
        $exe = Join-Path $dl ("postgresql-{0}-windows-x64.exe" -f $PostgresVersion)
        try {
            Get-File -Uri ("https://get.enterprisedb.com/postgresql/postgresql-{0}-windows-x64.exe" -f $PostgresVersion) -OutFile $exe
        } catch {
            throw @"
Could not download PostgreSQL $PostgresVersion automatically ($($_.Exception.Message)).
Download the Windows x64 installer for PostgreSQL 18 from
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
then re-run:  .\01-prereqs.ps1 -PostgresInstaller "C:\path\to\installer.exe"
"@
        }
    }

    Write-Host "  installing PostgreSQL (silent, a few minutes)"
    $pgArgs = @(
        "--mode", "unattended",
        "--unattendedmodeui", "none",
        "--superpassword", $PostgresPassword,
        "--serverport", "5432",
        "--prefix", "`"$pgBase`"",
        "--datadir", "`"$pgBase\data`"",
        "--disable-components", "stackbuilder"
    )
    $p = Start-Process $exe -ArgumentList $pgArgs -Wait -PassThru
    if ($p.ExitCode -ne 0) { throw "PostgreSQL installer exited with code $($p.ExitCode)" }
    Write-Ok "PostgreSQL installed"
}
Add-ToMachinePath (Join-Path $pgBase "bin")

# Keep the database off the public internet - it only ever serves localhost.
$pgConf = Join-Path $pgBase "data\postgresql.conf"
if (Test-Path $pgConf) {
    $conf = Get-Content $pgConf -Raw
    if ($conf -notmatch "(?m)^\s*listen_addresses\s*=\s*'localhost'") {
        $conf = $conf -replace "(?m)^\s*#?\s*listen_addresses\s*=.*$", "listen_addresses = 'localhost'"
        Set-Content -Path $pgConf -Value $conf -Encoding UTF8
        Restart-Service postgresql* -ErrorAction SilentlyContinue
        Write-Ok "PostgreSQL bound to localhost only"
    } else { Write-Skip "PostgreSQL already bound to localhost" }
}

# --------------------------------------------------------------------------
Write-Step "Caddy (reverse proxy + automatic HTTPS)"
$caddyExe = Join-Path $ToolsDir "caddy\caddy.exe"
if (Test-Path $caddyExe) {
    Write-Skip "Caddy already present: $caddyExe"
} else {
    $rel = Invoke-RestMethod -Uri "https://api.github.com/repos/caddyserver/caddy/releases/latest" `
        -Headers @{ "User-Agent" = "aqazgaran-setup" } -TimeoutSec 120
    $asset = $rel.assets | Where-Object { $_.name -match "windows_amd64\.zip$" } | Select-Object -First 1
    if (-not $asset) { throw "Could not locate the Caddy windows_amd64 zip" }
    $zip = Join-Path $dl $asset.name
    Get-File -Uri $asset.browser_download_url -OutFile $zip
    $dest = Join-Path $ToolsDir "caddy"
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
    Expand-Archive -Path $zip -DestinationPath $dest -Force
    Write-Ok "Caddy unpacked to $dest"
}

# --------------------------------------------------------------------------
Write-Step "NSSM (runs the app and Caddy as Windows services)"
$nssmExe = Join-Path $ToolsDir "nssm\nssm.exe"
if (Test-Path $nssmExe) {
    Write-Skip "NSSM already present: $nssmExe"
} else {
    $zip = Join-Path $dl "nssm-2.24.zip"
    Get-File -Uri "https://nssm.cc/release/nssm-2.24.zip" -OutFile $zip
    $tmp = Join-Path $dl "nssm-extract"
    if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
    Expand-Archive -Path $zip -DestinationPath $tmp -Force
    $src = Get-ChildItem -Path $tmp -Recurse -Filter nssm.exe |
           Where-Object { $_.FullName -match "win64" } | Select-Object -First 1
    if (-not $src) { throw "nssm.exe (win64) not found inside the archive" }
    New-Item -ItemType Directory -Force -Path (Join-Path $ToolsDir "nssm") | Out-Null
    Copy-Item $src.FullName $nssmExe -Force
    Write-Ok "NSSM installed to $nssmExe"
}

# --------------------------------------------------------------------------
Write-Step "Summary"
$env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
$report = [ordered]@{
    "node"       = if (Test-Command node) { (& node -v) }    else { "MISSING" }
    "npm"        = if (Test-Command npm)  { (& npm -v) }     else { "MISSING" }
    "git"        = if (Test-Command git)  { (& git --version) } else { "MISSING" }
    "psql"       = if (Test-Path (Join-Path $pgBase "bin\psql.exe")) { (& (Join-Path $pgBase "bin\psql.exe") --version) } else { "MISSING" }
    "caddy"      = if (Test-Path $caddyExe) { (& $caddyExe version) } else { "MISSING" }
    "nssm"       = if (Test-Path $nssmExe)  { "present" }    else { "MISSING" }
}
$report.GetEnumerator() | ForEach-Object { Write-Host ("  {0,-6} {1}" -f $_.Key, $_.Value) }

Write-Host ""
Write-Host "Prerequisites done. Next: .\02-database.ps1" -ForegroundColor Green
Write-Host "Note: close and reopen PowerShell so PATH changes are picked up." -ForegroundColor Yellow
