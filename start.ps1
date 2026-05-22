# Marcelino School — local dev startup
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Installing dependencies..." -ForegroundColor Cyan
pnpm install
if ($LASTEXITCODE -ne 0) {
  Write-Host "Install failed. If you see EPERM errors, move the project OUT of OneDrive or pause OneDrive sync." -ForegroundColor Yellow
  exit 1
}

if (Get-Command docker -ErrorAction SilentlyContinue) {
  Write-Host "Starting PostgreSQL + Redis..." -ForegroundColor Cyan
  docker compose up -d
  Start-Sleep -Seconds 5
  Write-Host "Setting up database..." -ForegroundColor Cyan
  pnpm db:generate
  pnpm db:push
  pnpm db:seed
} else {
  Write-Host "Docker not found — using DEV_MOCK_AUTH (demo login without Postgres)." -ForegroundColor Yellow
  Write-Host "For real data: install Docker Desktop OR set DATABASE_URL to Neon, then set DEV_MOCK_AUTH=false." -ForegroundColor Yellow
  if (-not (Select-String -Path ".env" -Pattern "DEV_MOCK_AUTH" -Quiet)) {
    Add-Content ".env" "`nDEV_MOCK_AUTH=true"
  }
}

Write-Host "Starting API (port 4000) and Web (port 3000)..." -ForegroundColor Green
pnpm dev
