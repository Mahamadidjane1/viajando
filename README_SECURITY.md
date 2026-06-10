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

- Zod validation for API and form input.
- Stripe webhook signature verification.
- Server-side API access for Amadeus credentials.
- Environment-based configuration.
- Mock fallback when external providers are unavailable.

## Deploy Checklist

- [ ] `.env.local` is not committed.
- [ ] Required production variables are configured in the hosting provider.
- [ ] Old Amadeus keys that appeared in Git history were revoked.
- [ ] Stripe webhook signing secret is configured.
- [ ] `NEXT_PUBLIC_` is only used for values that can be visible in the browser.
