# Security Guidelines

## Critical Security Rules

1. No hardcoded secrets: never commit API keys, passwords, tokens, or database URLs.
2. Use `.env.local` for local secrets and hosting provider environment variables in production.
3. Never expose server-side keys in client components or variables prefixed with `NEXT_PUBLIC_`.
4. If a real secret was ever committed, revoke it in the provider dashboard and generate a new one.

## Key Rotation Procedure

### Amadeus

1. Open Amadeus for Developers.
2. Go to the application credentials.
3. Reset the secret or create a new application.
4. Update `AMADEUS_API_KEY` and `AMADEUS_API_SECRET` in the deployment environment.

### Stripe

1. Open the Stripe Dashboard.
2. Rotate the secret key and webhook secret.
3. Update `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
4. Test checkout and webhook delivery.

### Google Maps

1. Open Google Cloud Console.
2. Restrict the browser key by domain.
3. Regenerate the key if it was exposed.
4. Update `NEXT_PUBLIC_GOOGLE_MAPS_KEY`.

## Application Security Features

- Prices are never accepted from the browser: checkout receives an opaque offer id, the amount comes from the
  server-side offer cache and is re-confirmed with the provider; the webhook rejects payments whose amount
  differs from the booking.
- Stripe webhook signature verification and idempotency (`WebhookEvent` table); status transitions never
  move backwards (e.g. PAID cannot become EXPIRED).
- Protected areas (`/admin`, `/<lang>/dashboard`) are checked in `proxy.ts` and again on every page and
  server action (a layout-only check does not protect pages in the App Router).
- Rate limiting on login (per IP and per email), registration, search, checkout and contact form.
- Passwords hashed with bcrypt (cost 12), minimum 8 characters with letters and numbers.
- Open-redirect protection on `callbackUrl`.
- Security headers: HSTS, CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy.
- Environment validation at startup (`instrumentation.ts`).
- GDPR: users can delete their account; personal data is erased and paid bookings are kept anonymised.

## Deploy Checklist

- [ ] `.env.local` is not committed.
- [ ] Every variable in `.env.example` is set in the hosting provider.
- [ ] Old Amadeus keys that appeared in Git history were revoked.
- [ ] Stripe webhook endpoint and signing secret configured (see README_SETUP.md).
- [ ] `KV_REST_API_URL` / `KV_REST_API_TOKEN` set when running more than one instance.
- [ ] `CRON_SECRET` set and the expiry job scheduled.
- [ ] `NEXT_PUBLIC_` is only used for values that can be visible in the browser.
