# Gideon Crops

**Scan your crop. Know the problem. Act fast.**

Gideon Crops is a crop disease detector for smallholder farmers in Kenya and East Africa. A farmer opens
the scanner, points a phone camera at a leaf, ticks the symptoms they can see, and gets a ranked diagnosis
with treatment and prevention advice in English or Kiswahili. Detection runs on the device against a local
symptom database, so a basic scan needs no login, no data bundle and no upload.

Built on the Alazea template (see `docs/AUDIT.md` for the template inventory and the type and colour audit).

- Live site (placeholder): https://gideon-crops.vercel.app
- WhatsApp: +254 112 272 061
- Email: hello@gideoncrops.co.ke
- Service area: Kenya and East Africa

## What is in the build

| Area | Detail |
| --- | --- |
| Home | Kenyan farmer hero, two calls to action, 8 crop cards with live condition counts, 3 step explainer, why Gideon Crops block, 3 farmer testimonials, extension officer callout |
| Scanner `/scan` | Live camera (rear camera via `facingMode: "environment"`), SVG viewfinder guide, in-memory snapshot check, 12 symptom checkboxes, ranked diagnosis, WhatsApp escalation, English and Kiswahili |
| Crop library `/crops` and `/crops/[slug]` | 8 crops (maize, tomato, potato, beans, kale, cassava, banana, wheat) with seasons, regions, conditions, symptoms and a scan call to action |
| Reports `/my-reports` | Sign in required. Filter by crop and date, download a PDF with jsPDF |
| Contact `/contact` | reCAPTCHA protected form, nodemailer delivery, extension officer account request |
| Auth `/auth/signin`, `/auth/signup` | Credentials plus optional Google OAuth. New accounts are read only farmers |
| Legal | Privacy policy, terms, cookie policy written for Kenya's Data Protection Act 2019 |
| Errors | 404 with leaf mark and back to home, 500 with try again and WhatsApp |
| Offline | Service worker caches `/scan`, `/data/symptoms.json` and static assets, offline banner, `/offline` fallback page |

The symptom database in `data/symptoms.json` holds **53 conditions** with English and Kiswahili names,
treatment and prevention text, covering every one of the 12 symptoms for every one of the 8 crops.

## Stack

Node 24 or newer (`engines: >=24.0.0`, `.nvmrc` = `24`). Next.js 16.4.2 App Router, React 19.2.0,
TypeScript 5.8.3, Tailwind CSS 4.1.10 (theme layer only, the template CSS still drives the design),
next-auth 5 beta, framer-motion, lucide-react, zustand, Vercel KV, nodemailer, zod, react-hook-form,
jsPDF, Lenis and GSAP.

### Version notes

Three packages sit above the version pinned in the original brief. The brief also requires
`npm audit --audit-level=high` to report zero high and zero critical findings, and those pins failed that
gate, so the patched releases were installed:

| Package | Pinned in brief | Installed | Reason |
| --- | --- | --- | --- |
| `next-auth` | 5.0.0-beta.28 | 5.0.0-beta.32 | beta.28 pulls `@auth/core` <= 0.41.2, three critical advisories |
| `jspdf` | 3.0.1 | 4.2.1 | 3.0.1 carries critical advisories, the PDF calls used here are unchanged in 4.x |
| `nodemailer` | 6.10.1 | 10.1.7 | eleven advisories, including address parser denial of service |
| `@vercel/blob` | 0.29.4 (never published) | 2.8.2 | the pinned version does not exist and the nearest one pulls a vulnerable `undici` |

Everything else is pinned exactly as specified, including `overrides` for `postcss`, `sharp`, `sprintf-js`,
`motion-dom` and `motion-utils`. `npm audit --audit-level=high` now reports **0 vulnerabilities**.

## Getting started

```bash
npm ci
cp .env.example .env.local   # fill in what you have, most values are optional locally
npm run dev                  # http://localhost:3000
```

`npm run dev` and `npm run build` first run `scripts/sync-data.mjs`, which copies `data/symptoms.json` to
`public/data/symptoms.json` so the service worker can cache the same file the UI reads.

Nothing except `NEXTAUTH_SECRET` and `NEXTAUTH_URL` is required for the app to boot. reCAPTCHA, Google
sign in, SMTP mail and Vercel KV each switch on when their environment variables are present, and degrade
with a clear message when they are not.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL used by metadata, sitemap and Open Graph tags |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | optional | Defaults to `254112272061` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | optional | Public reCAPTCHA v3 key. Forms run with the check skipped when absent |
| `RECAPTCHA_SECRET_KEY` | optional | Server side score check. Never sent to the browser |
| `NEXTAUTH_SECRET` | yes | Session signing secret, generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | yes | Full site URL for auth callbacks |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | optional | Enables the Google button. The provider is hidden when unset |
| `PEXELS_API_KEY` | optional | Only needed when fetching new photography, images are committed |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | optional | Vercel KV store for users and reports. Falls back to `.data/` locally |
| `BLOB_READ_WRITE_TOKEN` | optional | Reserved for scanned image storage. The scanner never uploads images today |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | optional | Contact form delivery. Without them the message is logged and the form still confirms |

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Copies the symptom data, then starts Next in development |
| `npm run build` | Copies the symptom data, then builds for production |
| `npm start` | Serves the production build |
| `npm run lint` | Next lint |
| `npm run typecheck` | `tsc --noEmit` |

## Project layout

```
app/
  page.tsx                 home
  scan/                    scanner page and client experience
  crops/                   crop library and [slug] detail pages
  my-reports/              officer report browser
  about/ contact/          about and contact
  auth/                    sign in and sign up
  legal/                   privacy policy, terms, cookie policy
  offline/ not-found.tsx error.tsx global-error.tsx
  api/                     auth, register, reports, crops, contact, recaptcha
components/
  scan/                    CropScanner, SymptomSelector, ResultsPanel, SaveReportPanel, LanguageToggle
  forms/                   ContactForm, SignInForm, SignUpForm
  reports/                 ReportsBrowser
  SiteHeader, SiteFooter, Breadcrumbs, Preloader, CookieConsent, VoiceTour,
  FloatingActions, OfflineBanner, SmoothScroll, ServiceWorkerRegister
lib/                       site constants, symptoms, matcher, crops, store, auth helpers, pdf
data/symptoms.json         source of truth for the 53 conditions
public/                    images, icons, sw.js, data/symptoms.json
docs/AUDIT.md              template audit: file tree, fonts, custom properties, gaps
docs/DEPLOY.md             Vercel deployment and launch checklist
```

## How the scan works

1. **Camera.** `navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })` streams into
   a card. A capture copies the current frame to a canvas, runs a brightness and green share check so a
   shot of the sky or a dark pocket is rejected, and keeps a JPEG data URL in React state only.
2. **Symptoms.** The farmer picks the crop and ticks any of the 12 symptoms, in English or Kiswahili.
3. **Match.** `lib/symptomMatcher.ts` scores each condition for that crop by keyword overlap, sorts by score
   and returns the top three. All zero scores return an empty array and the UI asks for more symptoms rather
   than guessing.
4. **Advice.** The primary card shows condition, type, severity, treatment and prevention. Two secondary
   matches sit in an accordion. The WhatsApp button opens a pre-filled message to +254 112 272 061.

The copy is explicit that the diagnosis comes from the ticked symptoms and the local database, not from
image classification, and that it does not replace an extension officer.

## Accounts, roles and reports

- Sign up always creates a **farmer** with read only access. Asking for an officer account sets an
  `extensionRequested` flag and sends the request through the contact form.
- **Extension officers** can save a report: crop, symptoms, top diagnosis, date, notes and, only after an
  explicit in-app consent prompt, GPS coordinates. Reports live in Vercel KV, with a `.data/` fallback for
  local runs.
- `POST /api/reports/save` returns 401 without a session and 403 for anyone who is not an officer.
  `GET /api/reports/[id]` only returns a report to its owner.
- Promote an account with `node scripts/grant-officer.mjs person@example.com` (see `docs/DEPLOY.md`).

## Privacy and consent

- Leaf images and frames never leave the phone. There is no upload endpoint for photos.
- GPS is only read after a separate, explicit prompt inside the save panel. It is not part of the cookie
  banner.
- The cookie banner is Kenya DPA 2019 aware: necessary storage is locked on, functional, analytics and
  marketing are opt in, stored under `gideon_crops_consent`. Nothing optional loads before consent.
- Analytics tags only mount when the visitor allows analytics.

## Accessibility and motion

Every page has exactly one `h1`. The template leads with `h2` bands, so those band titles are promoted to
`h1` and keep the template metrics through rules in `app/globals.css`. Forms label every field, the camera
viewfinder is decorative, focus states come from the template, and `prefers-reduced-motion` disables the
pulse, slide and stagger effects. The nine motion effects (Lenis smoothing, viewfinder pulse, checkbox
bounce, result slide up, severity colour transition, crop card stagger, offline banner slide down, WhatsApp
entrance pulse, language toggle transition) all carry information rather than decoration.

## Build gate

```bash
npm ci
npx tsc --noEmit
npx next build
npm audit --audit-level=high
```

All four pass as of the last commit. The build needs `NEXTAUTH_SECRET` and `NEXTAUTH_URL` in the
environment (any value works for a local build).

## Assets and credits

Photography comes from Pexels under the free plan, all human subjects are East African, and every file is
listed with photographer, URL and licence confirmation in `public/images/image-credits.md`. The Alazea
template fonts, icons and CSS are reproduced in `app/styles`, with provenance documented in `docs/AUDIT.md`.

## Deployment

See `docs/DEPLOY.md` for the Vercel project settings (region `cdg1`), security headers, KV setup, Google
OAuth redirect URIs, reCAPTCHA keys, SMTP settings and the launch checklist.
