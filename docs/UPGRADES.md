# Upgrade Guide

## Versioning

This project uses semantic versioning. Check `package.json` version before upgrading.

## Database Migrations

1. Pull latest code
2. Review new Prisma migrations in `packages/database/prisma/migrations`
3. Backup production database
4. Run:
   ```bash
   pnpm db:migrate
   ```

## Feature Flags

Enable optional features via environment:

| Flag | Feature |
|------|---------|
| `STRIPE_ENABLED=true` | Stripe payments |
| `PAYPAL_ENABLED=true` | PayPal payments |
| `OPENAI_API_KEY` | AI chatbot (OpenAI) |

## Breaking Changes

Document breaking API changes in CHANGELOG.md when releasing major versions.

## Rollback

1. Revert deployment to previous release
2. Restore database from backup if migrations were applied
3. Never run `migrate reset` on production
