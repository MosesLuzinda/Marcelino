# Quick database setup (no Docker)

1. Create a free database at https://neon.tech (takes 2 minutes).
2. Copy the connection string.
3. Edit `C:\dev\marcelino\.env`:
   ```
   DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Run:
   ```powershell
   cd C:\dev\marcelino
   pnpm db:push
   pnpm db:seed
   pnpm dev
   ```
