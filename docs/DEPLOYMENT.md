# Deployment Guide

## Recommended Architecture

| Service    | Platform              |
|-----------|------------------------|
| Web (Next.js) | Vercel             |
| API (Express) | Railway / Render / Fly.io |
| PostgreSQL    | Neon / Supabase / Railway |
| Redis         | Upstash / Railway    |
| Files         | Cloudflare R2 / AWS S3 |

## Web (Vercel)

1. Connect GitHub repo to Vercel
2. Set root directory to `apps/web`
3. Environment variables:
   - `NEXT_PUBLIC_API_URL` — production API URL
   - `NEXT_PUBLIC_APP_URL` — production site URL
   - Firebase `NEXT_PUBLIC_FIREBASE_*` (optional)

## API

1. Deploy `apps/api` to Railway/Render
2. Set build: `pnpm install && pnpm --filter @marcelino/api build`
3. Start: `node apps/api/dist/index.js`
4. Required env: `DATABASE_URL`, `JWT_*`, `CORS_ORIGIN`, payment keys, `REDIS_URL`

## Database Migrations

```bash
DATABASE_URL="production-url" pnpm db:migrate
```

## Payment Webhooks

Configure production webhook URLs:
- Flutterwave: `https://api.yourdomain.com/api/v1/webhooks/flutterwave`
- Stripe: `https://api.yourdomain.com/api/v1/webhooks/stripe`
- PayPal: `https://api.yourdomain.com/api/v1/webhooks/paypal`

## Backups

Daily `pg_dump` cron + upload to S3:

```bash
pg_dump $DATABASE_URL | gzip > backup-$(date +%F).sql.gz
aws s3 cp backup-*.sql.gz s3://your-bucket/backups/
```

## SSL & Security

- Enforce HTTPS everywhere
- Set `secure: true` on cookies in production
- Rotate JWT secrets periodically
- Never commit `.env` files
