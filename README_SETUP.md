# Project Setup & Infrastructure

## Prerequisites

- Node.js 18+
- PostgreSQL (or Vercel Postgres / Neon / Supabase)
- Redis (or Vercel KV / Upstash)

## Environment Variables

Create a `.env.local` file with the following:

\`\`\`bash
# Amadeus API
AMADEUS_API_KEY=your_api_key
AMADEUS_API_SECRET=your_api_secret
AMADEUS_BASE_URL=https://test.api.amadeus.com

# Database
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public"

# Redis
REDIS_URL="redis://default:password@host:port"
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

# Google Maps configuration is handled in lib/api-config.ts
