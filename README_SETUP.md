# Project Setup & Infrastructure

## Prerequisites

- Node.js 18+
- PostgreSQL (or Vercel Postgres / Neon / Supabase)
- Redis (or Vercel KV / Upstash, optional because the app has an in-memory fallback)

## Environment Variables

Copy `.env.example` to `.env.local` and fill the values for your environment.

\`\`\`bash
# Amadeus API
AMADEUS_API_KEY=your_api_key
AMADEUS_API_SECRET=your_api_secret
AMADEUS_ENVIRONMENT=test
AMADEUS_ACTIVE=true

# Database
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public"

# Cache
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Auth and payments
AUTH_SECRET=change-this-value
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
\`\`\`

## Installation

\`\`\`bash
npm install
\`\`\`

## Database Setup

1. Generate Prisma client:
   \`\`\`bash
   npx prisma generate
   \`\`\`

2. Run migrations (requires DB connection):
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

## Running Locally

\`\`\`bash
npm run dev
\`\`\`

## Architecture

- **Backend**: Next.js App Router + Server Actions
- **Database**: Prisma ORM + PostgreSQL
- **Cache**: Redis (with in-memory fallback)
- **Validation**: Zod

Google Maps configuration uses `NEXT_PUBLIC_GOOGLE_MAPS_KEY`. Server-side secrets must stay outside client components.
