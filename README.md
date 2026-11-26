# GrowX Digital Card

Digital visiting cards for small businesses — one link with call, WhatsApp,
Google Maps, services, photos and Google reviews. Live at
[card.growxdigitech.com](https://card.growxdigitech.com).

## Stack

- Next.js 16 + React 19 (App Router)
- Prisma ORM + PostgreSQL
- NextAuth v4 (email + password, admin and business-owner roles)
- Cloudinary (images), node-vibrant (brand palette from logo)
- Hosted on Netlify, auto-deploys on push to `master`

## Database

Production database is **Supabase** (PostgreSQL 17). Migrated from Neon on
26 Nov 2026 with `pg_dump` / restore; 16 businesses and 25 events verified
on both sides.

`DATABASE_URL` must be the **direct connection (port 5432)**, not the pooled
connection (6543), because the Netlify build runs `prisma db push`, which
fails through PgBouncer:

```text
DATABASE_URL=postgresql://postgres:[DB_PASSWORD]@db.vicxfvdfrhrzjcocyrvt.supabase.co:5432/postgres
```

## Environment variables

```text
DATABASE_URL=postgresql://...                       # Supabase direct connection, port 5432
NEXTAUTH_URL=https://card.growxdigitech.com        # site URL (still read under this name)
NEXT_PUBLIC_SUPABASE_URL=https://vicxfvdfrhrzjcocyrvt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...                  # Supabase dashboard → Settings → API → anon public
ADMIN_EMAIL=...                                    # super admin = this Supabase Auth user
ADMIN_PASSWORD=...                                 # unused since the Supabase Auth switch (kept for reference)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_PLACES_API_KEY=...   # Google reviews sync
```

Auth is Supabase Auth (email + OTP). Auth emails go through Gmail SMTP,
configured in the Supabase dashboard (Authentication → Emails → SMTP
Settings, smtp.gmail.com:587, Gmail App Password) — the built-in sender only
delivers to team members, 2/hour, so it cannot serve real signups.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Push to `master` — Netlify builds with `npx prisma db push && npm run build`
and deploys automatically. Allow ~3 minutes before checking a new page live.

## Themes

Cards use themes 1–6. Theme 6 is the Linktree-style card; its colours come
from each business's own logo via the Dynamic Brand Identity Engine
(`Business.brandPalette`), generated on logo upload.
