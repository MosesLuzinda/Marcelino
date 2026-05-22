# Installation Guide

## Local Development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy `.env.example` to `.env` in the project root. Minimum required:

```env
DATABASE_URL=postgresql://marcelino:marcelino_dev@localhost:5432/marcelino_school
JWT_ACCESS_SECRET=your-32-char-minimum-secret-here
JWT_REFRESH_SECRET=your-32-char-refresh-secret-here
BOOTSTRAP_SECRET=your-bootstrap-secret
API_PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Docker services

```bash
docker compose up -d
```

Wait for PostgreSQL health check to pass.

### 4. Initialize database

```bash
pnpm db:push
pnpm db:seed
```

### 5. Bootstrap admin (if seed skipped)

```bash
curl -X POST http://localhost:4000/api/v1/auth/bootstrap \
  -H "Content-Type: application/json" \
  -d "{\"secret\":\"YOUR_BOOTSTRAP_SECRET\"}"
```

### 6. Run apps

```bash
pnpm dev
```

## Troubleshooting

- **Port in use:** Change `API_PORT` or Next.js port in `apps/web/package.json`
- **DB connection failed:** Ensure Docker is running and `DATABASE_URL` matches `docker-compose.yml`
- **Prisma errors:** Run `pnpm db:generate` then `pnpm db:push`
