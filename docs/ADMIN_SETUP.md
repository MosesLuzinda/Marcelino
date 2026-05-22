# Admin Setup Guide

## Initial Admin Account

After seeding, use:
- **Email:** admin@marcelino.edu
- **Password:** Admin@123456

**Change this password immediately in production.**

## Firebase (Optional)

1. Create Firebase project at https://console.firebase.google.com
2. Enable Email/Password authentication
3. Copy web config to `.env`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   ```
4. Generate service account JSON → set `FIREBASE_ADMIN_SDK_JSON` as stringified JSON on API

Client sync flow:
1. User signs in with Firebase on web
2. Web calls `POST /auth/sync-firebase` with `idToken`
3. API returns JWT access token

## Payment Providers

### Flutterwave (Primary)
1. Register at https://flutterwave.com
2. Get test/live API keys
3. Set `FLUTTERWAVE_PUBLIC_KEY`, `FLUTTERWAVE_SECRET_KEY`, `FLUTTERWAVE_WEBHOOK_HASH`

### MTN MoMo
1. Register at https://momodeveloper.mtn.com
2. Set subscription key, API user, API key
3. `MTN_MOMO_ENV=sandbox` for testing

### Airtel Money
1. Register at Airtel Open API
2. Set `AIRTEL_MONEY_CLIENT_ID`, `AIRTEL_MONEY_CLIENT_SECRET`

### Stripe / PayPal (Optional)
Set `STRIPE_ENABLED=true` or `PAYPAL_ENABLED=true` with respective keys.

## RBAC

Roles: SUPER_ADMIN, ADMIN, FINANCE, HR, TEACHER, STUDENT, PARENT, LIBRARIAN, TRANSPORT, HOSTEL

Assign roles via Admin Portal → Settings or API:
```http
POST /admin/users/:userId/roles
{ "roleId": "..." }
```
