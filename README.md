# Marcelino School Management Platform

World-class school management system for **Marcelino International Academy** — public website, student/teacher/parent/admin portals, finance with Africa-first payments, and advanced modules.

## Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts
- **Backend:** Express.js REST API, Socket.io
- **Database:** PostgreSQL 16, Prisma ORM
- **Auth:** JWT + optional Firebase Auth sync
- **Payments:** Flutterwave, MTN MoMo, Airtel Money, Stripe, PayPal

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL & Redis)

### 1. Clone & install

```bash
cd marcelino
pnpm install
```

### 2. Environment

```bash
copy .env.example .env
```

Edit `.env` with your secrets (JWT keys, payment keys, etc.).

### 3. Start infrastructure

```bash
docker compose up -d
```

### 4. Database

```bash
pnpm db:push
pnpm db:seed
```

### 5. Run development

```bash
pnpm dev
```

- **Website:** http://localhost:3000
- **API:** http://localhost:4000
- **API Docs:** http://localhost:4000/api/docs

## Demo Accounts

| Role    | Email                   | Password        |
|---------|-------------------------|-----------------|
| Admin   | admin@marcelino.edu     | Admin@123456    |
| Teacher | teacher1@marcelino.edu  | Password@123    |
| Student | student1@marcelino.edu  | Password@123    |
| Parent  | parent1@marcelino.edu   | Password@123    |

## Project Structure

```
marcelino/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express API
├── packages/
│   ├── database/     # Prisma schema & seed
│   └── shared/       # Shared types & Zod schemas
├── docs/             # Documentation
├── scripts/          # Demo recording & utilities
└── docker-compose.yml
```

## Features

### Public Website
Home, About, Admissions, Academics, Courses, Teachers, Student Life, News, Gallery, Contact, FAQs, Testimonials, Careers, Downloads, Blog

### Portals
- **Student:** Dashboard, schedule, attendance, grades, assignments, exams, messaging
- **Teacher:** Attendance, grades, assignments, analytics, live class links, exams
- **Parent:** Child performance, attendance, fee payments (multi-gateway)
- **Admin:** Full CRUD, finance, payroll, library, hostel, transport, inventory, reports

### Payments
Flutterwave (primary), MTN Mobile Money, Airtel Money, Stripe, PayPal — with receipts and webhooks

### Advanced
AI chatbot, library, hostel, transport, inventory, HR, analytics, PDF/Excel export, dark mode

## Demo Video & Screenshots

```bash
# Start app first, then:
pnpm demo:screenshots
pnpm demo:record
```

Output: `dist/demo/marcelino-school-demo.mp4` and `dist/screenshots/`

## Documentation

- [Installation](docs/INSTALLATION.md)
- [Deployment](docs/DEPLOYMENT.md)
- [API Reference](docs/API.md)
- [Admin Setup](docs/ADMIN_SETUP.md)
- [Upgrades](docs/UPGRADES.md)
- [Demo Walkthrough](docs/demo-walkthrough.md)

## License

Proprietary — Marcelino International Academy
