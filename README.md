# دعوة فرح — Fouad & Demiana 💍

A premium, mobile-first luxury wedding invitation website.
Next.js 15 (App Router) · TypeScript (strict) · TailwindCSS · Framer Motion · Firebase · Vercel-ready.

**Designed & Developed by: Youssef Shrief — Joe Industries**

---

## ✨ Features

- Luxury animated **welcome screen** with curtain-opening animation + background music trigger
- **Hero** with couple names, wedding date, animated gold typography
- **Flip-clock countdown** → automatically replaced by a celebration message when the date arrives
- **Details / Location** card with Google Maps button
- **Masonry gallery** (Google Drive links) with fullscreen lightbox + lazy loading
- **Guest Book** — messages stored as *pending*, shown only after admin approval, as memory cards
- **Share Your Photos** — guests submit Drive links (name optional), admin-moderated
- Floating **Music** play/pause button + **Language toggle** (Arabic RTL ↔ English LTR)
- Hidden **Admin Dashboard** (triple-click "JOE INDUSTRIES" → password → full CMS)
- Everything editable without touching code · Website visit counter · SEO optimized

Palette: White / Gold / Burgundy · Fonts: Amiri + Tajawal (AR), Cormorant Garamond + Jost (EN)

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env.local   # fill in your Firebase values
npm run dev                  # http://localhost:3000
```

---

## 🔥 Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Build → Firestore Database → Create database** (production mode).
3. **Project Settings → General → Your apps → Web (`</>`)** — copy the config values into `.env.local`.
4. **Firestore → Rules** — paste the contents of `firestore.rules` and Publish.

### Collections (auto-created on first use)
`settings` · `messages` · `gallery` · `videos` · `visits`

The `settings/main` document is seeded automatically the first time the site loads.

---

## ▲ Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Add these **Environment Variables** (Project Settings → Environment Variables):

| Key | Example |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIza...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `your-app.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `your-app` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `your-app.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `1234567890` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123:web:abc` |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | `00000` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` |

4. **Deploy.** Done. 🎉

> ⚠️ If the Vercel build fails, it is almost always because the environment variables above were **not** added in the dashboard. Add them and redeploy.

---

## 🔐 Admin Panel

1. Scroll to the footer and **click "JOE INDUSTRIES" three times**.
2. Enter the password (default **`00000`**, change via `NEXT_PUBLIC_ADMIN_PASSWORD`).
3. Manage: names · verse · date/time · location · maps · hero image · music link · gallery · messages · drive links · enable/disable sections · view visits · copy site link.

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
│   └── admin/      # hidden dashboard route
├── components/     # UI (Hero, Countdown, Gallery, GuestBook, ...)
│   └── admin/      # dashboard tabs
├── hooks/          # useSettings, useCountdown
├── lib/            # firebase, data access, drive helpers
├── config/         # defaults & constants
├── messages/       # AR/EN dictionary
└── types/          # shared TypeScript types
```

---

Made with love · **Joe Industries**
