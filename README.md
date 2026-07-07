# Browse — Curation & Directory Site

A clean-room rebuild of the "Browse" curated-directory template as a real, ownable codebase:
**React 19 + Vite + TypeScript + Tailwind CSS v4**, with **Appwrite** powering membership,
bookmarks, submissions, and email capture. Faithful to the extracted design system — semantic
color tokens, OS-driven dark mode, Inter 400/500/600, hairline-ring elevation, accent reserved
for conversion CTAs (and the saved-bookmark state).

> **Demo content notice** — the catalog rows in `src/data/sites.ts`, their thumbnails (served
> from an Appwrite Storage bucket), and the blog posts are placeholders carried over from the
> template. Replace them with your own content (see below). Screenshots are copyrighted by their
> respective owners.

## Quick start

```bash
npm install
npm run dev
```

Runs immediately in **demo mode** (no env vars needed): full catalog, live search, category
filters, blog, pricing, submit form, product detail pages, and bookmarks (stored in the browser).
Auth pages explain how to connect the backend.

## Pages

`/` gallery + hero + email capture · `/category/:slug` (9 categories, Filter dropdown on mobile) ·
`/site/:slug` product detail · `/pricing` · `/submit` · `/blog` + 6 articles · `/bookmarks` ·
`/signin` `/signup` `/account` · `/start-here-delete-later` (hidden setup guide) · 404

## Connect the backend (Appwrite)

The web app talks to Appwrite with just the **project id + endpoint** (both public) and each
user's session. A **server API key** is used only once, from your machine, to provision the
database — it is never shipped to the browser or committed.

1. Create a project in the [Appwrite console](https://cloud.appwrite.io). Note the **Project ID**
   and the **API endpoint** (e.g. `https://nyc.cloud.appwrite.io/v1`).
2. Create a server **API key** with `databases.*` + `documents.*` scopes, then run the seeder —
   it creates the `browse` database, the `sites` / `submissions` / `subscribers` / `bookmarks`
   collections, their attributes + indexes, and loads the demo catalog (idempotent):
   ```bash
   APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1 \
   APPWRITE_PROJECT_ID=your-project-id \
   APPWRITE_API_KEY=your-server-key \
   python3 appwrite/provision.py
   ```
3. In the console, add a **Web platform** (Settings → Platforms) for your production domain and
   `localhost` — this is the CORS allowlist for the browser SDK. (Platforms can't be created with
   a project API key, so this step is done in the console.)
4. Copy `.env.example` → `.env` and set the two public values; add the same two on Vercel:
   ```
   VITE_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your-project-id
   ```

That enables: email/password accounts, per-user bookmarks (browser-local bookmarks merge up on
first sign-in), and real submission + subscriber storage. Collection + document permissions keep
each user's bookmarks private; submissions/subscribers are create-only from the client.

## Data model (Appwrite)

| Collection | Fields | Access |
|---|---|---|
| `sites` | slug, name, category_slug, category_label, url, thumb, sort | read: any |
| `submissions` | email, url, comment, status | create: any |
| `subscribers` | email (unique) | create: any |
| `bookmarks` | userId, siteSlug | create: users; per-document read/update/delete by owner |

## Stripe placeholder (intentionally not wired)

The $8/mo Bookmarking tier's checkout is stubbed on purpose:

- `api/create-checkout-session.ts` + `api/stripe-webhook.ts` → return 501 with notes.
- `src/lib/config.ts` → `REQUIRE_PLAN_FOR_BOOKMARKS = false` keeps bookmarking free for all
  members meanwhile; the webhook will flip `is_pro` on the Appwrite account prefs.
- Commented env vars in `.env.example`. UI copy already says "payments coming soon."

## Replace the demo content

- **Images live in Appwrite Storage** (public `assets` bucket), not the repo. Upload new ones with
  `appwrite/upload_storage.py` (see below); each file's public URL is
  `…/storage/buckets/assets/files/<fileId>/view?project=<projectId>`.
- **Cards**: edit `src/data/sites.ts` (slug, name, category, url, thumb) — set `thumb` to the
  Storage URL of the uploaded image. With Appwrite connected, re-run `appwrite/provision.py` (reads
  `appwrite/seed-sites.json`) or edit the `sites` collection — DB rows win over the local seed.
- **Categories**: `src/data/categories.ts` (pill order = array order).
- **Blog**: `src/data/blog.ts` (each `cover` is a Storage URL).

### Migrate images to Storage

`appwrite/upload_storage.py` creates the public `assets` bucket and uploads images, printing a
URL map. It's the one-time migration used for the demo assets:

```bash
APPWRITE_ENDPOINT=… APPWRITE_PROJECT_ID=… APPWRITE_API_KEY=… python3 appwrite/upload_storage.py
```

## Design system

Tokens live in `src/styles/global.css`: light/dark palettes bound to the same semantic slots
(dark via `prefers-color-scheme` only), the full type ramp (display 54→36 responsive), 4px spacing
scale, radius scale (6/8/10–11/14/999), hairline-ring elevation, 0.3s `cubic-bezier(0.12,0.23,0.5,1)`
motion on opacity/color only. Breakpoints: phone ≤809 · tablet 810–1199 · desktop ≥1200.

## Deploy (Vercel)

Import the repo → framework preset **Vite** → add the two Appwrite env vars → deploy.
`vercel.json` handles SPA rewrites (and keeps `/api/*` routed to the serverless stubs).

## Scripts

`npm run dev` · `npm run build` (typecheck + bundle) · `npm run preview`
