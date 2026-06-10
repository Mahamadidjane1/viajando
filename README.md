# Viajando

Viajando is a professional travel booking platform built with Next.js, TypeScript, Prisma, PostgreSQL, Stripe, and the Amadeus API. The project implements a realistic booking flow: search for trips, review options, create reservations, manage a user dashboard, and process checkout.

## Product Vision

Viajando is designed as a production-oriented travel product for comparing and booking transport options across Europe. The repository demonstrates a full-stack product architecture with frontend flows, server actions, API integration, authentication, database modeling, payment integration, cache, and environment-based configuration.

## Features

- Multilingual routes with Portuguese, English, Spanish, and French dictionaries.
- Flight search using Amadeus, with cache and mock fallback.
- User registration and login with NextAuth.
- Dashboard for bookings, favorites, wallet, and settings.
- Admin area for platform overview and configuration screens.
- Booking flow with passenger data validation.
- Stripe checkout and webhook handling for paid bookings.
- Prisma schema for users, sessions, bookings, and search logs.
- Redis-compatible cache with in-memory fallback for local development.

## HCI and Product Principles

- Clear navigation with a working mobile menu and visible account actions.
- Search form with explicit labels, keyboard-friendly native controls, validation feedback, and route swap action.
- Reduced visual noise: no external font dependency, fewer decorative effects, restrained radius, and clearer spacing.
- Progressive disclosure: advanced filters stay on the results page while the home page keeps the primary action focused.
- Resilient integrations: Stripe, Google Auth, and Amadeus fail gracefully when environment variables are missing.

## Tech Stack

- Next.js App Router
- React and TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth
- Stripe
- Amadeus API
- Upstash Redis or Vercel KV
- Tailwind CSS and Radix UI components
- Zod validation

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill the values required for your environment.

```bash
cp .env.example .env.local
```

At minimum, configure:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AMADEUS_API_KEY`
- `AMADEUS_API_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### 3. Prepare the database

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Scripts

```bash
npm run dev        # start development server
npm run build      # generate Prisma client and build Next.js
```

## Security Notes

Secrets must never be committed. Amadeus, Stripe, Google, database, and auth credentials must stay in `.env.local` locally and in the hosting provider environment variables in production.

If any real key was previously committed, revoke it in the provider dashboard and create a new one.

## Project Structure

```text
app/              Next.js routes, server actions, and API routes
components/       Shared UI and feature components
dictionaries/     Translation dictionaries
lib/              Integrations, auth helpers, cache, and utilities
prisma/           Database schema
public/           Static assets
scripts/          SQL/bootstrap scripts
```

## Author

Mahamadi Djane  
GitHub: https://github.com/Mahamadidjane1
