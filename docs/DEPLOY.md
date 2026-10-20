# Deploying Gideon Crops

This guide covers a Vercel deployment, the optional services, and the checks to run before the site is
announced. The repository is already configured: `vercel.json` sets the framework, build command, region and
security headers, and `next.config.ts` allows Pexels photography through `next/image`.

## 1. Requirements

- Node 24 locally (`nvm use` reads `.nvmrc`).
- A Vercel account with the repository connected.
- Optional but recommended for production: Vercel KV, SMTP credentials, reCAPTCHA keys, Google OAuth.

## 2. First deploy

1. Push the branch and import the repository in Vercel.
2. Framework preset: **Next.js**. Build command `npm run build`, output directory `.next`, install command
   `npm ci`. Region **cdg1** is already set in `vercel.json`, keep it.
3. Add the environment variables below under **Settings, Environment Variables** for Production and Preview.
4. Deploy. The build itself only needs `NEXTAUTH_SECRET` and `NEXTAUTH_URL`.

`vercel.json` sends these headers on every response:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Permissions-Policy: camera=(self), microphone=(), geolocation=()`

`camera=(self)` is what allows the scanner to open the rear camera inside the page. Do not remove it, and do
not widen it to `*`. Geolocation stays disabled at the header level on purpose: the save panel reads GPS
only through the browser prompt, and the header value here restricts microphone and geolocation to nothing.

## 3. Environment variables

| Variable | Where to get it | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | your domain | `https://gideoncrops.co.ke` style, no trailing slash |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | fixed | `254112272061` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | rotating it signs every session out |
| `NEXTAUTH_URL` | your domain | must match the deployed URL exactly |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud console, OAuth client (Web) | optional, the provider is hidden when unset |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA admin console, v3 key | public, safe in the bundle |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA admin console, v3 secret | server only, never expose it |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Vercel KV, or an Upstash Redis REST endpoint | without them accounts and reports fall back to `.data/`, which is ephemeral on Vercel |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob | reserved, the scanner does not upload images |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | your mail provider | without them the contact form logs the message and still confirms |
| `PEXELS_API_KEY` | Pexels | only for fetching new photography, not needed at runtime |

Send both `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` with the same origin, otherwise auth callbacks and
canonical links disagree.

## 4. Storage

Reports and accounts use `lib/store.ts`:

- With `KV_REST_API_URL` and `KV_REST_API_TOKEN` set, every write goes to Vercel KV under `gideon:user:*`,
  `gideon:report:*` and `gideon:reports:*`.
- Without them the store uses an in-process map plus the `.data/` folder. That is fine for a laptop and is
  **not durable on Vercel**, so configure KV before inviting officers.

To grant the officer role after an account request has been checked:

```bash
KV_REST_API_URL=... KV_REST_API_TOKEN=... node scripts/grant-officer.mjs officer@example.com
```

Locally, without KV credentials, the same script edits `.data/user-<email>.json`. The officer signs out and
back in to pick up the role, because the role is carried in the session token.

## 5. Google sign in

1. Google Cloud console, **APIs and Services, Credentials, Create credentials, OAuth client ID, Web
   application**.
2. Authorised JavaScript origin: your site origin.
3. Authorised redirect URI: `https://your-domain/api/auth/callback/google` and, for previews,
   `https://<preview-domain>/api/auth/callback/google`.
4. Paste the client ID and secret into Vercel and redeploy.

A Google sign up creates a read only farmer, exactly like the email form.

## 6. reCAPTCHA

1. Create a **v3** key for the domain in the reCAPTCHA admin console.
2. Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY`.
3. The client asks for a token at submit time with an action name (`signup`, `signin`, `contact`), the server
   verifies it in `lib/recaptcha.ts`, and a score below 0.5 asks the visitor to complete a visible checkbox
   before the form is accepted again. The checkbox renders with the same site key and is verified with the
   same secret, no second key is needed.
4. With no keys set, verification reports `skipped: true` and forms stay usable. That is the development
   behaviour, do not ship production without keys.

## 7. Mail

The contact form posts to `/api/contact`, which verifies reCAPTCHA, validates with zod and sends through
nodemailer using the `SMTP_*` values. `SMTP_FROM` is both the sender and the destination by default. Without
SMTP configuration the route logs a summary and returns `{ ok: true, delivered: false }` so the visitor is not
blocked.

Extension officer requests arrive with `mode: "officer"` in the subject line, which makes them easy to filter.

## 8. Launch checklist

```bash
npm ci
npx tsc --noEmit
npx next build
npm audit --audit-level=high   # expect 0 vulnerabilities
```

Then, on the deployed URL:

- `/` loads, hero reads "Scan your crop. Know the problem. Act fast.", 8 crop cards show condition counts.
- `/scan` opens the camera on a phone over HTTPS, the symptom checklist submits, a diagnosis appears, the
  Kiswahili toggle changes the advice, WhatsApp opens with the scan message.
- Airplane mode: `/scan` still matches from the cached database and the offline banner appears.
- `/my-reports` redirects to sign in when signed out. Signed in as a farmer it shows the empty state. Signed in
  as an officer it saves a report and the PDF downloads.
- `/contact` delivers a message to the mailbox, and the browser console shows no reCAPTCHA errors.
- `/legal/privacy-policy`, `/legal/terms`, `/legal/cookie-policy` render, and the cookie banner offers
  Accept all and Manage preferences with necessary storage locked.
- `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/sw.js` respond 200, and a bad URL shows the 404
  with the leaf mark.
- Response headers include the five security headers and `Permissions-Policy: camera=(self)`.
- Run a Lighthouse pass on mobile for `/` and `/scan`: performance and accessibility above 90, PWA installable.

## 9. Rollback and housekeeping

- Redeploys are immutable in Vercel, promote the previous deployment to roll back.
- The service worker caches `/scan` and `/data/symptoms.json`. After a content release bump the cache name in
  `public/sw.js` if farmers report stale advice.
- Keep `public/data/symptoms.json` in sync by editing `data/symptoms.json` only. `npm run build` copies it.
