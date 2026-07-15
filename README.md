# Aghazgaran Tejarat Ayandeh — آغازگران تجارت آینده

A bilingual (English / فارسی with full RTL) corporate website and admin platform for a futuristic
investment & international-trade holding. Dark-luxury design system ("The Meridian"), cinematic
GSAP + Framer Motion animation, generative visuals (canvas world map, ecosystem constellation),
and a real full-stack backend.

## Stack

- **Next.js 16** (App Router, RSC-first) · React 19 · TypeScript
- **Tailwind CSS v4** + shadcn/ui (RTL-enabled)
- **GSAP 3** (ScrollTrigger, SplitText, DrawSVG, MotionPath) + **Framer Motion** + **Lenis**
- **next-intl** — `/en` + `/fa` locale routing, mirrored RTL layouts, per-locale fonts
  (Sora / Manrope / JetBrains Mono · Vazirmatn)
- **Prisma + SQLite** — 25 models; the dashboard genuinely manages the public site
  (news, events, projects, careers, contact inbox)
- **Auth.js v5** — credentials login, JWT sessions, roles (ADMIN / MANAGER / ANALYST / VIEWER),
  **working TOTP 2FA** (otplib + QR enrollment)
- TanStack Query · React Hook Form + Zod · Recharts · Lucide

## Getting started

```bash
npm install
npx prisma migrate dev     # creates prisma/dev.db
npx prisma db seed         # bilingual demo data
npm run dev
```

Open http://localhost:3000/en (or `/fa` for Persian).

### Demo accounts (password for all: `Admin@1234`)

| Email | Role |
|---|---|
| admin@ata-holding.com | ADMIN |
| manager@ata-holding.com | MANAGER |
| analyst@ata-holding.com | ANALYST |
| viewer@ata-holding.com | VIEWER |

Dashboard: `/{locale}/dashboard` (sign in first). Enable 2FA under **Settings** —
scan the QR with any authenticator app; the login flow then asks for the rotating code.

## Structure

```
src/
  app/[locale]/(site)/   marketing pages (home + 12 inner routes)
  app/[locale]/(auth)/   login · register · forgot/reset password
  app/[locale]/(app)/    dashboard (20+ modules)
  app/api/               auth, account (2FA/reset), generic CRUD, messages, admin
  components/motion/     TextReveal, Reveal, Counter, Magnetic, Marquee, TiltCard,
                         MeridianLine, HorizontalScroll, MouseParallax…
  components/visuals/    WorldMap (canvas dots + animated trade arcs),
                         EcosystemDiagram, Particles, GradientMesh
  components/dashboard/  sidebar, topbar, ⌘K palette, EntityManager (generic CRUD),
                         charts, task board, calendar, messages, 2FA card
  content/               typed bilingual copy (11 business areas, home, pages)
  messages/              en.json · fa.json UI strings
prisma/                  schema + migration + seed
```

## Notes

- The `.env` ships with a dev `AUTH_SECRET`; generate a new one for any real deployment.
- SQLite means serverless hosts (Vercel) need a DB swap (e.g. Turso/Postgres);
  Railway/Render/VPS run it as-is.
- Every dashboard mutation writes an `ActivityLog` row; role gates are enforced
  in the API layer, not just the UI.
