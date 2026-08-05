<#
    02-database.ps1 - creates the application role and database.

    Creates role `aqazgaran` and database `aqazgaran` owned by it, then prints
    the DATABASE_URL to paste into the app's .env file.

    Safe to re-run: existing role/database are left alone (the password is
    reset to the one you supply, which is what you want if you forgot it).

    Usage (elevated PowerShell):
        .\02-database.ps1
        .\02-database.ps1 -AppDbPassword "something-long" -SuperPassword "postgres-pw"
#>

[CmdletBinding()]
param(
    [string] $PgBase        = "C:\Program Files\PostgreSQL\18",
    [string] $DbName        = "aqazgaran",
    [string] $DbUser        = "aqazgaran",
    [string] $AppDbPassword,   # password for the app's role; generated if omitted
    [string] $SuperPassword    # password for `postgres`; prompted if omitted
)

$ErrorActionPreference = "Stop"

function Write-Step { param($m) Write-Host "`n=== $m ===" -ForegroundColor Cyan }
function Write-Ok   { param($m) Write-Host "  [ok] $m"   -ForegroundColor Green }
function Write-Skip { param($m) Write-Host "  [skip] $m" -ForegroundColor DarkGray }

$psql = Join-Path $PgBase "bin\psql.exe"
if (-not (Test-Path $psql)) { throw "psql not found at $psql - run 01-prereqs.ps1 first." }

if (-not $SuperPassword) {
    $sec = Read-Host "PostgreSQL superuser (postgres) password" -AsSecureString
    $SuperPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
}
if (-not $AppDbPassword) {
    # 24 bytes of randomness, URL-safe so it never needs escaping in DATABASE_URL.
    $bytes = New-Object byte[] 24
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $AppDbPassword = ([Convert]::ToBase64String($bytes) -replace '[+/=]', '')
    Write-Host "Generated a password for the '$DbUser' role (shown at the end)." -ForegroundColor Yellow
}

$env:PGPASSWORD = $SuperPassword

function Invoke-Psql {
    param([string]$Sql, [string]$Database = "postgres")
    $out = & $psql -h localhost -p 5432 -U postgres -d $Database -v ON_ERROR_STOP=1 -tAc $Sql 2>&1
    if ($LASTEXITCODE -ne 0) { throw "psql failed: $out" }
    return ($out | Out-String).Trim()
}

Write-Step "Checking the server is up"
$ver = Invoke-Psql "SELECT version();"
Write-Ok $ver

Write-Step "Role '$DbUser'"
$exists = Invoke-Psql "SELECT 1 FROM pg_roles WHERE rolname = '$DbUser';"
# Password is quoted with dollar-quoting so odd characters cannot break the statement.
if ($exists -eq "1") {
    Invoke-Psql "ALTER ROLE `"$DbUser`" WITH LOGIN PASSWORD `$pw`$$AppDbPassword`$pw`$;" | Out-Null
    Write-Skip "role already existed - password reset to the value used below"
} else {
    Invoke-Psql "CREATE ROLE `"$DbUser`" WITH LOGIN PASSWORD `$pw`$$AppDbPassword`$pw`$;" | Out-Null
    Write-Ok "role created"
}

Write-Step "Database '$DbName'"
$dbExists = Invoke-Psql "SELECT 1 FROM pg_database WHERE datname = '$DbName';"
if ($dbExists -eq "1") {
    Write-Skip "database already exists"
} else {
    # CREATE DATABASE cannot run inside a transaction block, hence its own call.
    Invoke-Psql "CREATE DATABASE `"$DbName`" OWNER `"$DbUser`" ENCODING 'UTF8';" | Out-Null
    Write-Ok "database created"
}

Invoke-Psql "GRANT ALL PRIVILEGES ON DATABASE `"$DbName`" TO `"$DbUser`";" | Out-Null
# Prisma's `db push` creates tables in `public`, so the role must own that schema.
Invoke-Psql "ALTER SCHEMA public OWNER TO `"$DbUser`";" -Database $DbName | Out-Null
Write-Ok "privileges granted"

Write-Step "Verifying the app role can actually connect"
$env:PGPASSWORD = $AppDbPassword
$who = & $psql -h localhost -p 5432 -U $DbUser -d $DbName -tAc "SELECT current_user || '@' || current_database();" 2>&1
if ($LASTEXITCODE -ne 0) { throw "The '$DbUser' role could not connect: $who" }
Write-Ok ("connected as {0}" -f ($who | Out-String).Trim())
$env:PGPASSWORD = $null

$connString = "postgresql://{0}:{1}@localhost:5432/{2}?schema=public" -f $DbUser, $AppDbPassword, $DbName

Write-Host ""
Write-Host "=== Put this in C:\apps\aqazgaran\.env ===" -ForegroundColor Green
Write-Host ""
Write-Host ("DATABASE_URL=`"{0}`"" -f $connString) -ForegroundColor White
Write-Host ""
Write-Host "Copy it now - the generated password is not stored anywhere else." -ForegroundColor Yellow
Write-Host "Next: create .env (see env.production.example), then run .\03-app.ps1" -ForegroundColor Green
