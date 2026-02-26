# 1:1 Dance Consult Portal

Premium booking + client/consultant workspace that mirrors the Apple-minimal look and feel of 1on1consult.org. The marketing site remains static HTML while the `/portal` subtree is now a React + TypeScript SPA compiled with Vite and styled with Tailwind + the existing gradient/glass system. Supabase powers auth/data + Netlify Functions bridge Stripe for checkout.

## Repository map

```
.
├── netlify/                  # Existing analytics helper functions + new Stripe functions
│   └── functions/
│       ├── createCheckoutSession.js
│       ├── stripeWebhook.js
│       ├── pixel.js / r.js   # existing tracking utils
│       ├── package.json / package-lock.json
├── portal-app/               # Vite + React + TS source code
│   ├── src/
│   │   ├── components/       # Glass/gradient primitives, nav, loaders
│   │   ├── context/          # Supabase auth provider w/ demo mode fallback
│   │   ├── layout/           # Portal shell w/ animated gradient system
│   │   ├── lib/              # Supabase client + data service w/ demo seeds
│   │   ├── pages/            # Login, onboarding, dashboards, booking, admin
│   │   └── types/            # Shared TypeScript models
│   ├── src/styles/brand.css  # Gradient/glass/glow utilities reused from marketing site
│   ├── tailwind.config.js    # Tokens + keyframes shared with 1on1consult.org
│   └── .env.example          # Supabase env template
├── portal/                   # Generated build artifacts (ignored in git)
├── supabase/
│   └── migrations/001_portal.sql  # Tables + RLS policies for profiles/client_profiles/etc.
├── _redirects                # Ensures /portal/* routes fall through to the SPA
└── netlify.toml              # Updated build pipeline + redirects + headers
```

## Environment variables

| Location            | Variable                       | Description |
|---------------------|--------------------------------|-------------|
| `portal-app/.env`   | `VITE_SUPABASE_URL`            | Supabase project URL |
|                     | `VITE_SUPABASE_ANON_KEY`       | Supabase anon key for client SDK |
|                     | `VITE_STRIPE_DEPOSIT_PRICE_ID` | Optional Stripe Price ID for the booking deposit button |
| Netlify Functions   | `STRIPE_SECRET_KEY`            | Restricted Stripe secret used for Checkout sessions |
|                     | `STRIPE_WEBHOOK_SECRET`        | Signing secret for the Stripe webhook endpoint |

## Initial setup

1. **Install portal SPA dependencies**
   ```bash
   npm install --prefix portal-app
   ```
2. **Install Netlify Function deps (Stripe SDK)**
   ```bash
   npm install --prefix netlify/functions
   ```
3. **Copy the env template and fill in Supabase keys**
   ```bash
   cp portal-app/.env.example portal-app/.env
   ```
4. **Supabase: run the schema + RLS migration**
   ```bash
   # assuming Supabase CLI is logged-in
   supabase db push --file supabase/migrations/001_portal.sql
   ```
5. **Provision Netlify env vars** – set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` inside your Netlify site dashboard (or via `netlify env:set ...` for local dev).

## Local development workflow

### Portal SPA (React)

```bash
npm run dev --prefix portal-app
```

- Runs Vite dev server on http://localhost:5173 with the animated gradient system, role-based routing, onboarding wizard, consultant/admin dashboards, and Supabase data hooks (falls back to demo data when env vars are missing).
- Tailwind tokens, brand gradients, glass styles, skeletons, and optimistic mutations are all wired into this app.

### Marketing site + Netlify Functions (Stripe) via `netlify dev`

1. Build the SPA once to sync `/portal` static assets (Netlify will handle this automatically during deploys):
   ```bash
   npm run build --prefix portal-app
   ```
2. Start the Netlify local server from the repo root:
   ```bash
   netlify dev
   ```
   - Serves the static marketing pages, `/portal` build output, and all Netlify Functions (including `/.netlify/functions/createCheckoutSession` + `/.netlify/functions/stripeWebhook`).
   - Handy for end-to-end tests involving the Calendly bridge, Stripe checkout, and webhook logging.
3. When actively iterating on React screens, keep `npm run dev --prefix portal-app` running in a second terminal for instant HMR, and rebuild (`npm run build --prefix portal-app`) whenever you want `netlify dev` to reflect the latest SPA artifacts.

## Deployment notes

- **Build command** (`netlify.toml`): `npm --prefix netlify/functions install && npm --prefix portal-app install && npm --prefix portal-app run build`. This installs Stripe dependencies, builds the SPA, and syncs the compiled assets into `/portal` before Netlify uploads everything in `publish = "."`.
- **Redirects**: `_redirects` + `netlify.toml` ensure `/portal/*` always falls back to `/portal/index.html`, preserving SPA routing even on direct deep links.
- **Stripe Functions**:
  - `createCheckoutSession` expects `POST` JSON `{ priceId, quantity?, metadata?, successUrl?, cancelUrl?, customerEmail? }` and returns `{ id, url }`.
  - `stripeWebhook` verifies signatures with `STRIPE_WEBHOOK_SECRET`, logs `checkout.session.completed` + `checkout.session.expired`, and is ready for future Supabase updates.
- **Supabase policies**: `supabase/migrations/001_portal.sql` provisions all required tables and row-level security rules:
  - Clients can read/write only their intake + bookings.
  - Consultants read assigned bookings + related client profiles, and can update their consultant card + leave notes.
  - Admin role (in `profiles.role`) bypasses restrictions.

## Testing & linting

- `npm run build --prefix portal-app` – type-checks, bundles, and copies the SPA output into `/portal`.
- `netlify dev` – validates static marketing pages + Netlify Functions locally.
- Optional: configure Stripe CLI (`stripe listen --forward-to localhost:8888/.netlify/functions/stripeWebhook`) for webhook end-to-end verification.

## Next steps

- Phase 2 scheduler: replace Calendly deep link in `portal-app/src/pages/Booking.tsx` with Google Calendar availability once OAuth + GCal free/busy endpoints are wired up.
- Wire webhook + Supabase updates: inside `stripeWebhook.js`, swap console logs for Supabase writes (e.g., mark `bookings.payment_status = 'paid'`).
- Add supabase edge functions or cron for reminder emails once bookings confirmed.
