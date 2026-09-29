# Viajando

Viajando is a professional travel booking platform built with Next.js, TypeScript, Prisma, PostgreSQL, Stripe, and the Amadeus API. The project implements a realistic booking flow: search for trips, review options, create reservations, manage a user dashboard, and process checkout.

## Product Vision

Viajando is designed as a production-oriented travel product for comparing and booking transport options across Europe. The repository demonstrates a full-stack product architecture with frontend flows, server actions, API integration, authentication, database modeling, payment integration, cache, and environment-based configuration.

## Features

- Flight search through Amadeus (with Redis cache), plus clearly labelled demo results outside production.
- Server-side pricing: the browser only sends an offer id; the price is read from the server cache and
  re-confirmed with Amadeus (`flight-offers/pricing`) before payment.
- Stripe Checkout (card, MB WAY, Multibanco via the Stripe Dashboard) with an idempotent webhook that
  handles async payments, expiry, failures and refunds.
- Accounts with NextAuth (email/password and optional Google), rate-limited login/registration.
- Dashboard with real bookings, profile/password settings and GDPR account deletion.
- Admin area (`/admin`) with revenue, bookings and users, protected at the proxy and on every page.
- Booking confirmation emails over SMTP and a working contact form.
- Multilingual routes (`/pt`, `/en`, `/es`, `/fr`).

## Tech Stack

Next.js 16 (App Router, Server Actions) · React 19 · TypeScript · Prisma + PostgreSQL · NextAuth v5 ·
Stripe · Amadeus Self-Service API · Upstash Redis · Tailwind CSS · Zod · Vitest

## Getting Started

```bash
npm install
cp .env.example .env.local        # fill DATABASE_URL and AUTH_SECRET at minimum
npm run db:migrate                # apply migrations to your local database
npm run dev                       # http://localhost:3000
```

Without Amadeus credentials the search returns demo offers (only outside production). To test payments,
add Stripe test keys and forward webhooks with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Make a user an administrator (after registering the account):

```bash
npm run admin:promote -- you@example.com
```

## Scripts

```bash
npm run dev          # development server
npm run build        # prisma generate + production build
npm run start        # run the production build
npm run typecheck    # TypeScript
npm test             # unit tests (Vitest)
npm run db:migrate   # create/apply migrations in development
npm run db:deploy    # apply migrations in production
```

## Deployment

See [README_SETUP.md](README_SETUP.md) for the production checklist (environment, Stripe webhook,
cron job, Redis, email) and [README_SECURITY.md](README_SECURITY.md) for security notes.

## Project Structure

```text
app/              Routes, server actions (app/actions) and API routes (webhook, health, cron)
components/       UI and feature components
dictionaries/     Translation dictionaries
lib/              Integrations (Amadeus, Stripe, email), pricing/offers, cache, rate limiting, validation
prisma/           Schema and migrations
scripts/          Operational scripts (promote admin)
tests/            Unit tests
```

## Author

Mahamadi Djane  
GitHub: https://github.com/Mahamadidjane1
