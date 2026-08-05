# Deploying to a Windows Server VPS

Runbook for putting this site on a self-managed Windows Server 2019 box
(2 vCPU / 4 GB RAM / 50 GB SSD).

**What ends up running**

| Piece | Role | Exposed? |
|---|---|---|
| Caddy | reverse proxy, automatic HTTPS | yes — 80/443 |
| Next.js (`next start`) | the app | no — `127.0.0.1:3000` |
| PostgreSQL 18 | database | no — localhost |
| NSSM | keeps both services alive and starts them at boot | — |

Everything runs as a Windows service, so a reboot brings the site back with
no intervention.

---

## Before you start

- RDP access to the VPS with an **Administrator** account.
- The VPS public IP (`00-connectivity.ps1` prints it).
- Your domain's DNS control panel.
- A Gmail **App Password** if you want real emails — see the SMTP section.

Every script is safe to run twice. If one fails halfway, fix the cause and
run *that* script again; you never need to start over.

Open PowerShell **as Administrator**, then:

```powershell
Set-ExecutionPolicy -Scope Process Bypass -Force
```

---

## Step 0 — Can this server reach the internet it needs?

```powershell
cd C:\apps\aqazgaran\deploy\windows   # or wherever you copied these files
.\00-connectivity.ps1
```

This is the gate. It checks npm, GitHub, Let's Encrypt, Gmail and Render, and
prints the public IP.

- **All OK** → continue.
- **npm / GitHub / nodejs.org fail** → stop and send me the output. Nothing
  else will work and the approach has to change.
- **Only Let's Encrypt fails** → no automatic HTTPS; tell me and we adapt.
- **Only Render fails** → fine, you just skip the data migration in step 5.

---

## Step 1 — Point the domain at the server

Do this **now**, before installing anything, because DNS takes time to spread
and Caddy cannot get a certificate until it has.

At your registrar / DNS provider create two records:

| Type | Name | Value |
|---|---|---|
| A | `@` | *the public IP from step 0* |
| A | `www` | *the same IP* |

Check from your own computer (not the VPS):

```powershell
nslookup yourdomain.com
```

When it answers with the VPS IP, continue. This can take minutes or hours
depending on the registrar.

---

## Step 2 — Install the prerequisites

```powershell
.\01-prereqs.ps1
```

Installs Node 22 LTS, Git, PostgreSQL 18, Caddy and NSSM, and applies the
Windows fixes this stack needs (long paths, a Defender exclusion for the app
folder — without it npm installs crawl).

It asks you to choose a **PostgreSQL superuser password**. Write it down.

Takes 5–15 minutes, mostly PostgreSQL. When it finishes, **close PowerShell
and open a new Administrator window** so the updated PATH is picked up.

> If the PostgreSQL download fails, EDB has renamed the file. Download the
> PostgreSQL 18 Windows x64 installer manually and re-run:
> `.\01-prereqs.ps1 -PostgresInstaller "C:\Users\Administrator\Downloads\postgresql-18-windows-x64.exe"`

---

## Step 3 — Create the database

```powershell
.\02-database.ps1
```

Enter the superuser password from step 2. The script creates the `aqazgaran`
role and database and prints a `DATABASE_URL` line.

**Copy that line now** — the generated password is not saved anywhere else.

---

## Step 4 — Write the .env file

```powershell
New-Item -ItemType Directory -Force C:\apps\aqazgaran | Out-Null
Copy-Item .\env.production.example C:\apps\aqazgaran\.env
notepad C:\apps\aqazgaran\.env
```

Fill in:

- `DATABASE_URL` — the line from step 3.
- `AUTH_SECRET` — generate a fresh one:
  ```powershell
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- `SITE_URL` — `https://yourdomain.com` (real domain, real `https`). Password
  reset links and the sitemap are built from this; a wrong value here is a bug
  that only shows up in emails.
- SMTP — see the section below. Leaving `SMTP_USER` and `SMTP_PASSWORD` empty
  is fine for now; codes get written to `logs\app.out.log` instead.

---

## Step 5 — Build the app

```powershell
.\03-app.ps1
```

Clones the repo to `C:\apps\aqazgaran`, installs, builds, creates the schema
and seeds demo data. The first build on a 2-core box takes a few minutes.

### Optional: bring the existing data over from Render

Only if step 0 showed Render as reachable:

```powershell
.\migrate-from-render.ps1 -RenderUrl "postgresql://...the External Database URL..."
```

Get that URL from the Render dashboard → your database → **External Database
URL**. The script backs up the local database first and replaces it with
Render's data — accounts, news, projects and all.

Skipping this is not a problem: you get the seeded demo data and re-register
your account.

---

## Step 6 — Run it as a service

```powershell
.\04-services.ps1 -Domain "yourdomain.com"
```

Registers `aqazgaran-app` and `aqazgaran-caddy`, starts both, and checks the
app answers on `http://127.0.0.1:3000/en` before moving on. Pass `-NoCaddy` to
run without the proxy while testing.

---

## Step 7 — Open the firewall

```powershell
.\05-firewall.ps1
```

Opens 80 and 443 and confirms 3000/5432 are **not** exposed.

**Also open 80/443 in your VPS provider's own firewall / security group.**
Most providers have one, and Windows Firewall rules do nothing if the provider
still blocks the port. This is the single most common reason "the site works
on the server but not from outside".

Now open `https://yourdomain.com`. The first request is slow — Caddy is
fetching the certificate. After that it should be under a second.

---

## Email (OTP codes)

Codes only reach real inboxes once SMTP is configured. Until then they appear
in `C:\apps\aqazgaran\logs\app.out.log`.

To turn on real sending, get a Gmail App Password
(`myaccount.google.com` → Security → 2-Step Verification → App passwords —
your normal Gmail password will be rejected), then set **both** of these in
`.env` in the same edit and restart:

```
SMTP_USER="you@gmail.com"
SMTP_PASSWORD="the 16-character app password"
```

```powershell
Restart-Service aqazgaran-app
```

> Setting `SMTP_USER` without `SMTP_PASSWORD` is worse than setting neither:
> sending switches on, authentication fails, **and** the log fallback stops —
> so nobody can receive a code at all. Always set the pair together.

Gmail allows roughly 500 messages a day. Beyond that, switch to Resend or SES
by changing these variables — no code change needed.

---

## Everyday operations

**Deploy the latest commit**

```powershell
cd C:\apps\aqazgaran\deploy\windows
.\update.ps1
```

Builds first and only restarts the service if the build succeeded, so a broken
commit cannot take the site down.

**Logs**

```powershell
Get-Content C:\apps\aqazgaran\logs\app.err.log -Tail 50 -Wait
Get-Content C:\apps\aqazgaran\logs\app.out.log -Tail 50        # OTP codes land here
Get-Content C:\apps\aqazgaran\logs\caddy.err.log -Tail 50      # certificate problems
```

**Service control**

```powershell
Get-Service aqazgaran-*
Restart-Service aqazgaran-app
Restart-Service aqazgaran-caddy
```

**Change the domain** — edit `Caddyfile` in this folder, then re-run
`.\04-services.ps1 -Domain "newdomain.com"`.

---

## When something breaks

| Symptom | Where to look |
|---|---|
| Site unreachable from outside, fine on the server | provider firewall, then `05-firewall.ps1` |
| Browser shows a certificate warning | `caddy.err.log`; usually DNS not resolving to this IP yet |
| 502 from Caddy | `aqazgaran-app` is down — `app.err.log` |
| Build fails on `tailwindcss` / `tsx` not found | `NODE_ENV=production` was set before `npm ci`; clear it and re-run |
| `prisma db push` fails | `DATABASE_URL` wrong in `.env`, or PostgreSQL service stopped |
| Login code never arrives | SMTP not set (check `app.out.log`), or `SMTP_USER` set without a password |
| Everything slow after a reboot | check both services are `Running` and set to `Automatic` |

When you send me output, include the last ~40 lines of the relevant log and
the exact command you ran.

---

## Still to do after this works

- **Backups.** One VPS means one copy of the data. A scheduled `pg_dump` to
  disk (and off the box) should be the next thing added.
- **Render.** Keep it running until you have used the VPS for a few days.
  Its free database is deleted on **2026-08-16**, so decide before then.
