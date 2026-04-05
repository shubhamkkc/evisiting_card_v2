# 🤖 Agent Context — eVisiting Card

> This file gives any AI assistant a complete understanding of this project — its purpose, architecture, conventions, and gotchas — so it can contribute effectively without repeated exploration.

---

## 📌 Project Overview

**eVisiting Card** is a **SaaS platform** that generates beautiful, SEO-optimized digital business cards for local businesses. Each business gets a unique public URL (`/[slug]`) that acts as their digital visiting card — shareable via WhatsApp, QR code, or link.

### Business Model
- Admin creates business profiles via a protected dashboard
- Business owners get a login to manage their own card (edit info, upload images, etc.)
- Public pages (`/[slug]`) are accessible to anyone without login

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4** |
| Database ORM | **Prisma** (PostgreSQL in prod, SQLite `dev.db` locally) |
| Auth | **NextAuth.js v4** (JWT strategy, Credentials provider) |
| Image Storage | **Cloudinary** |
| Image Compression | `browser-image-compression`, `sharp` |
| VCard Generation | `vcf` + `qrcode` |
| UI Components | `shadcn/ui`, `lucide-react`, `@base-ui/react` |
| Deployment | **Netlify** (`netlify.toml` present) |

---

## 🗂️ Project Structure

```
evisiting_card/
├── prisma/
│   └── schema.prisma          # Single "Business" model (see below)
├── public/                    # Static assets
├── scripts/                   # Utility/one-off scripts
├── src/
│   ├── app/
│   │   ├── [slug]/            # Public business card page (dynamic route)
│   │   ├── admin/             # Admin portal (dashboard, businesses, login)
│   │   ├── owner/             # Business owner portal (dashboard, edit, login)
│   │   ├── login/             # Generic login redirect
│   │   ├── api/               # API routes (see below)
│   │   ├── page.tsx           # Homepage / landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── robots.ts          # SEO robots
│   │   └── sitemap.ts         # SEO sitemap
│   ├── components/
│   │   ├── card/              # Business card UI components
│   │   ├── admin/             # Admin dashboard components
│   │   ├── owner/             # Owner dashboard components
│   │   ├── ui/                # Shadcn/base UI primitives
│   │   ├── AutoScrollingIframe.tsx
│   │   └── Providers.tsx      # NextAuth SessionProvider wrapper
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── googleReviews.ts   # Google Places API integration
│   │   ├── types.ts           # Shared TypeScript types
│   │   └── utils.ts           # cn() utility
│   └── middleware.ts          # Route protection (JWT-based)
├── .env.example               # Required env vars (copy → .env)
├── package.json
├── next.config.ts
├── netlify.toml
└── seed.js                    # DB seed script
```

---

## 🗄️ Database Schema

There is a **single model** — `Business` — in `prisma/schema.prisma`:

```prisma
model Business {
  id                 String   @id @default(cuid())
  slug               String   @unique          // URL slug: /[slug]
  businessName       String
  ownerName          String?
  designation        String?
  phone              String
  whatsapp           String?
  email              String?
  website            String?
  address            String?
  googleMapsUrl      String?
  googlePlaceId      String?                   // For Google Reviews widget
  googleReviewWidget String?
  logo               String?                   // Cloudinary URL
  coverPhoto         String?                   // Cloudinary URL
  about              String?
  category           String?
  yearEstd           String?
  socialLinks        String?                   // JSON string (stringified array/object)
  services           String?                   // JSON string
  gallery            String?                   // JSON string (array of Cloudinary URLs)
  theme              String   @default("theme1")
  themeColor         String   @default("#0ea5e9")
  isActive           Boolean  @default(true)
  ownerEmail         String?  @unique          // Owner login email
  ownerPassword      String?                   // bcryptjs hashed
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

> **Important**: `socialLinks`, `services`, and `gallery` are stored as **JSON strings** — always `JSON.parse()` when reading, `JSON.stringify()` when writing.

---

## 🔗 API Routes (`src/app/api/`)

| Route | Purpose |
|---|---|
| `api/auth/[...nextauth]` | NextAuth handler |
| `api/businesses` | CRUD for businesses (admin) |
| `api/[slug]` | Fetch single business by slug |
| `api/owner` | Owner self-update (profile edit) |
| `api/upload` | Cloudinary image upload (gallery max 30, services max 10) |
| `api/compress` | Image compression utility |
| `api/places` | Google Places API proxy |
| `api/reviews` | Google Reviews fetch |
| `api/vcard` | VCard / QR code generation |

---

## 🔐 Authentication & Roles

**Two roles** are supported via NextAuth JWT:

### Admin (`role: "admin"`)
- Credentials: `ADMIN_EMAIL` + `ADMIN_PASSWORD` (env vars, plain text comparison)
- Can access `/admin/dashboard` and `/admin/businesses`
- Manages all business profiles

### Business Owner (`role: "owner"`)
- Credentials: `ownerEmail` + `ownerPassword` (bcryptjs hashed in DB)
- Can access `/owner/dashboard` and `/owner/edit`
- Can only edit their own business profile

### Middleware (`src/middleware.ts`)
Route protection is handled by `middleware.ts`. It:
1. Reads the JWT token via `getToken()`
2. Redirects unauthenticated users to the appropriate login page
3. Redirects users with the wrong role to their correct portal

**Protected routes (matcher config):**
```
/admin/dashboard/:path*
/admin/businesses/:path*
/owner/dashboard/:path*
/owner/edit/:path*
```

---

## 🌍 Environment Variables

Copy `.env.example` → `.env` and fill in:

```env
GOOGLE_PLACES_API_KEY=      # Google Places API (New) key
DATABASE_URL=               # PostgreSQL connection string (or leave for SQLite locally)
NEXTAUTH_SECRET=            # Random secret string
NEXTAUTH_URL=               # e.g. http://localhost:3000
CLOUDINARY_CLOUD_NAME=      # Cloudinary cloud name
CLOUDINARY_API_KEY=         # Cloudinary API key
CLOUDINARY_API_SECRET=      # Cloudinary API secret
ADMIN_EMAIL=                # Super admin email
ADMIN_PASSWORD=             # Super admin password (plain text, stored in env only)
```

---

## 🏃 Running Locally

```bash
# Install dependencies
npm install

# Generate Prisma client + start dev server
npm run dev

# Build for production (also runs prisma generate)
npm run build
```

> The local dev DB (`prisma/dev.db`) is SQLite. Production uses PostgreSQL.

---

## 🖼️ Image Handling

- All images are uploaded to **Cloudinary**
- Upload endpoint: `POST /api/upload`
- Limits enforced server-side:
  - Gallery images: max **30**
  - Products/Services: max **10**
- When images are deleted or updated, the old Cloudinary asset must be destroyed via `cloudinary.uploader.destroy(publicId)`
- Image compression is handled client-side via `browser-image-compression` before upload

---

## 🎨 Theming

Each business card supports:
- **`theme`** — e.g. `"theme1"`, `"theme2"`, etc. (controls card layout/style)
- **`themeColor`** — hex color (e.g. `"#0ea5e9"`) used as brand accent

---

## ⚠️ Known Gotchas & Conventions

1. **Prisma type assertion**: The Prisma client may be out of sync with the schema. Use `(prisma.business as any).findUnique(...)` pattern where needed to avoid TypeScript errors.

2. **JSON string fields**: `socialLinks`, `services`, `gallery` are stored as raw JSON strings. Always parse/stringify them:
   ```ts
   const services = JSON.parse(business.services ?? "[]");
   ```

3. **Auth role check in API routes**: Always verify `session.user.role` in protected API routes. Don't trust client-side role data.

4. **Prisma generate on build**: The `build` script runs `prisma generate && next build`. Don't forget to run `prisma generate` after schema changes locally too.

5. **Dev DB vs Prod DB**: `prisma/dev.db` is SQLite (local). `DATABASE_URL` in `.env` for production points to PostgreSQL. The schema provider is `postgresql` — use a local PostgreSQL or `npx prisma migrate dev` with the correct `DATABASE_URL` for local development.

6. **Admin password is plain text in env**: The admin login compares `credentials.password === process.env.ADMIN_PASSWORD` directly. This is intentional — admin is a single super-user configured via env.

---

## 📡 External Services

| Service | Usage |
|---|---|
| **Cloudinary** | Image storage and CDN |
| **Google Places API (New)** | Business search, place details, reviews |
| **NextAuth.js** | JWT-based session management |

---

## 🚀 Deployment

- Deployed on **Netlify** (see `netlify.toml`)
- Build command: `npm run build` (which runs `prisma generate && next build`)
- Ensure all env vars are set in the Netlify dashboard

---

*Last updated: April 2026*
