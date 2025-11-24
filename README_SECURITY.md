# Security Guidelines & Procedures

## 🚨 Critical Security Rules

1. **No Hardcoded Secrets**: Never commit API keys, passwords, or tokens to the repository. Use environment variables (`.env.local`).
2. **Token Exposure**: If a secret is accidentally committed, revoke it immediately in the provider's dashboard (Amadeus, Google Cloud, etc.).
3. **Frontend Leaks**: Never use server-side keys (like `AMADEUS_API_SECRET`) in client-side code (components starting with "use client").

## 🔑 Key Rotation Procedure

If you suspect a key compromise:

1. **Amadeus API**:
   - Log in to Amadeus for Developers.
   - Go to "My Apps".
   - Click "Reset Secret" or create a new app.
   - Update `AMADEUS_API_SECRET` in your Vercel environment variables.

2. **Google Maps**:
   - Go to Google Cloud Console > Credentials.
   - Regenerate the API Key.
   - Update the environment variable.

## 🛡️ Application Security Features

- **Rate Limiting**: The backend implements throttling to prevent API abuse.
- **Input Validation**: All API inputs are validated with Zod schemas.
- **Error Suppression**: Detailed errors are logged server-side but sanitized before reaching the client.

## 📝 Checklist for Deploy

- [ ] Ensure all `.env` variables are set in Vercel.
- [ ] Verify that `NEXT_PUBLIC_` is only used for non-sensitive keys.
- [ ] Check Amadeus Quota limits.
