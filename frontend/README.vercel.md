# Rent & Return Frontend — Vercel Deployment Guide

## Deploying to Vercel

1. **Connect your GitHub repo to Vercel.**
2. **Set the following environment variables in Vercel dashboard:**
   - `VITE_API_BASE_URL` — e.g. `https://your-backend-production-url.railway.app/api`
   - `VITE_STRIPE_PUBLISHABLE_KEY` — your Stripe publishable key
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Framework Preset:** `Vite`

## Best Practices
- Make sure your backend CORS allows your Vercel domain.
- Never commit secrets to the repo.
- Use environment variables for all sensitive config.
- For custom domains, update `ALLOWED_ORIGINS` in backend.

---

For more details, see the main project README. 