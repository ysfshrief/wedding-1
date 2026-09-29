# دعوة فرح — Fouad & Demiana 💍

A premium, mobile-first luxury wedding invitation website.
Next.js 15 (App Router) · TypeScript (strict) · TailwindCSS · Framer Motion · Neon (Postgres) · Vercel-ready.

**Designed & Developed by: Youssef Shrief — Joe Industries**

---

## ✨ Features

- Luxury animated **welcome screen** with a curtain-opening reveal; the invitation music starts on **Open Invitation** and plays once (no loop)
- **Hero** with the couple's framed portrait (gentle unveil + parallax), names, wedding date
- **Flip-clock countdown** → automatically replaced by a celebration message when the date arrives
- **Details / Location** card with Google Maps button
- **Masonry gallery** (Google Drive links) with fullscreen lightbox + lazy loading
- **Guest Book** — messages stored as *pending*, shown only after admin approval, as memory cards
- **Share Your Photos** — guests submit Drive links (name optional), admin-moderated
- Floating **Music** play/pause button + **Language toggle** (English LTR by default ↔ Arabic RTL; `?lang=ar` opens in Arabic)
- Hidden **Admin Dashboard** (triple-click "JOE INDUSTRIES" → password → full CMS)
- Everything editable without touching code · Website visit counter · SEO optimized

Palette: warm beige / cream / champagne / espresso, sampled from the couple's portrait · Fonts: Amiri + Tajawal (AR), Cormorant Garamond + Jost (EN)

Bundled assets: `src/assets/fouad-demiana.png` (couple portrait) and `public/audio/fouad-demiana.m4a` (invitation music).

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env.local   # fill in your Firebase values
npm run dev                  # http://localhost:3000
```

---

## 🐘 Neon Database Setup

1. Create a free project at [neon.tech](https://neon.tech) (or add the **Neon** integration from the Vercel Marketplace — it sets `DATABASE_URL` for you).
2. Copy the **connection string** (`postgresql://…neon.tech/…?sslmode=require`) into `DATABASE_URL` in `.env.local`.
3. That's it — the tables are created automatically on the first request.
   The schema is also in `db/schema.sql` if you prefer to run it in the Neon SQL editor.

### Tables
`settings` · `messages` · `gallery` · `videos` · `visits`

The browser never talks to the database directly: all reads/writes go through the app's
API routes (`src/app/api/*`). Guests can only read public data and submit *pending*
messages/links; every admin action requires the server-side admin session.

Without `DATABASE_URL` the invitation still works with the default content
(guest-book and photo forms will report that they can't be sent).

---

## ▲ Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Add these **Environment Variables** (Project Settings → Environment Variables):

| Key | Example |
|---|---|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require` |
| `ADMIN_PASSWORD` | a strong password (server-only, never sent to the browser) |
| `ADMIN_SESSION_SECRET` | optional — any long random string to sign admin sessions |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` |

4. **Deploy.** Done. 🎉

> ⚠️ If guest messages or admin changes don't save, check that `DATABASE_URL` is set in the Vercel dashboard, then redeploy.

---

## 🔐 Admin Panel

1. Scroll to the footer and **click "JOE INDUSTRIES" three times**.
2. Enter the password (default **`00000`** — set `ADMIN_PASSWORD` in production). It is checked on the server, which then issues a 12-hour httpOnly session cookie.
3. Manage: names · verse · date/time · location · maps · hero backdrop · optional music override · gallery · messages · drive links · enable/disable sections · view visits · copy site link.

---

## 🖼 Google Drive Media

- Upload images/audio to Drive → **Share → Anyone with the link**.
- Paste the normal share link anywhere a Drive link is requested — the app converts it automatically.
- Images use `drive.google.com/thumbnail`, audio uses the `uc?export=download` endpoint.

---

## 📁 Structure

```
src/
├── app/            # routes, layout, SEO (robots/sitemap/manifest)
│   ├── page.tsx    # main invitation
│   ├── admin/      # hidden dashboard route
│   └── api/        # API routes (Neon-backed data + admin session)
├── components/     # UI (Hero, Countdown, Gallery, GuestBook, ...)
│   └── admin/      # dashboard tabs
├── hooks/          # useSettings, useCountdown
├── lib/            # client data access, drive helpers
│   └── server/     # Neon client, queries, validation, admin auth
├── config/         # defaults & constants
├── messages/       # AR/EN dictionary
└── types/          # shared TypeScript types
```

---

Made with love · **Joe Industries**
