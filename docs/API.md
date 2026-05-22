# API Documentation

Base URL: `http://localhost:4000/api/v1` (development)

Interactive docs: `http://localhost:4000/api/docs`

## Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{ "email": "admin@marcelino.edu", "password": "Admin@123456" }
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "user": { "userId": "...", "email": "...", "roles": ["SUPER_ADMIN"], "permissions": ["*"] }
  }
}
```

### Authenticated requests
```http
Authorization: Bearer <accessToken>
```

### Refresh token
```http
POST /auth/refresh
Cookie: refreshToken=...
```

## Key Endpoints

| Module   | Endpoints |
|----------|-----------|
| Public   | `GET /public/school`, `/news`, `/gallery`, `/faqs` |
| Student  | `GET /student/dashboard`, `/schedule`, `/grades` |
| Teacher  | `POST /teacher/attendance`, `/grades` |
| Parent   | `GET /parent/fees`, `/children/:id/performance` |
| Admin    | `GET /admin/dashboard`, `/students`, `/reports/finance` |
| Fees     | `POST /fees/checkout`, `GET /fees/receipts/:id/pdf` |
| AI       | `POST /ai/chat` |
| Analytics| `GET /analytics/insights` |

## Payment Checkout

```http
POST /fees/checkout
Authorization: Bearer <token>

{
  "invoiceId": "clx...",
  "provider": "FLUTTERWAVE"
}
```

Returns `{ checkoutUrl, reference }` for redirect.

## Webhooks

- `POST /webhooks/flutterwave`
- `POST /webhooks/mtn-momo`
- `POST /webhooks/airtel-money`
- `POST /webhooks/stripe` (requires `STRIPE_ENABLED=true`)
- `POST /webhooks/paypal` (requires `PAYPAL_ENABLED=true`)

Mock completion (dev): `GET /webhooks/mock-complete/:reference`
