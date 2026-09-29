# Production Setup

## Requirements

- Node.js 20.9+
- PostgreSQL 14+ (Neon, Supabase, RDS, Vercel Postgres...)
- Upstash Redis / Vercel KV — **required when running more than one instance**. Without it, the offer cache,
  Amadeus token cache and rate limits live in process memory and are not shared between instances.
- Stripe account, Amadeus credentials, SMTP provider (Resend, Postmark, SES...)

## 1. Environment

Copy every variable from `.env.example` into the hosting provider. The server refuses to start in
production if `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `STRIPE_SECRET_KEY` or
`STRIPE_WEBHOOK_SECRET` are missing or invalid (see `lib/env.ts`).

## 2. Database

```bash
npm ci
npm run db:deploy        # prisma migrate deploy
npm run build
npm run start
```

Run `db:deploy` on every release before starting the new version. Never use `prisma migrate dev` or
`db push` against production.

Create the first administrator after registering the account on the site:

```bash
DATABASE_URL=... npm run admin:promote -- admin@your-domain.com
```

## 3. Stripe

1. Dashboard → Settings → Payment methods: enable Card, MB WAY and Multibanco (Checkout picks them up
   automatically; nothing to change in code).
2. Dashboard → Developers → Webhooks → add endpoint `https://<domain>/api/webhooks/stripe` with events:
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed`, `checkout.session.expired`, `charge.refunded`.
3. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## 4. Scheduled job

Call `GET /api/cron/expire-bookings` every 15 minutes with `Authorization: Bearer $CRON_SECRET`
(Vercel Cron, GitHub Actions schedule, or any external cron). It expires abandoned pending bookings if a
Stripe `checkout.session.expired` webhook was missed.

## 5. Monitoring

- `GET /api/health` returns 200 when the app and database are reachable (use it for the load balancer).
- Errors are logged to stdout; connect the platform's log drain or add Sentry.

## Known limitations before selling real tickets

- **Ticket issuance.** Payments are confirmed and stored, but the booking is not yet sent to the airline.
  Amadeus Self-Service `POST /v1/booking/flight-orders` only issues real tickets through a consolidator /
  IATA agreement; alternatively integrate an aggregator that handles ticketing (e.g. Duffel). Until then,
  keep `AMADEUS_ENVIRONMENT=test` and Stripe in test mode.
- One passenger per booking, one-way trips only.
- Booking-flow pages are in Portuguese; the `/en`, `/es`, `/fr` dictionaries only cover navigation and search.
- Terms, privacy and cookie texts must be reviewed by a lawyer before launch.
