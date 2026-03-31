# SpaApp2 Backend

Backend API for SpaApp2, implemented with Express + Prisma + PostgreSQL.

## Quick Start

1. Copy `.env.example` to `.env` and adjust values.
2. Install dependencies:
   - `npm install`
3. Generate Prisma client and run migrations:
   - `npm run prisma:generate`
   - `npm run prisma:migrate`
   - `npm run prisma:seed`
4. Start dev server:
   - `npm run dev`

## API Base

- `http://localhost:4000/v1`

## Main Endpoints

- Health: `GET /health`, `GET /ready`
- Auth: `POST /v1/auth/login`, `GET /v1/auth/me`
- Appointments: `POST /v1/appointments`, `POST /v1/appointments/manual`, `GET /v1/appointments`, `PATCH /v1/appointments/:id/status`
- Clients: `POST /v1/clients`, `GET /v1/clients`, `GET /v1/clients/:id`
- Settings: `GET /v1/settings`, `PATCH /v1/settings`
- Payments: `POST /v1/payments/intent`
- Webhooks: `POST /v1/webhooks/stripe`
- Reports: `GET /v1/reports/kpis`, `GET /v1/reports/clients.csv`, `GET /v1/reports/appointments.csv`
- Notifications: `POST /v1/notifications/confirmation-email`

## Default Admin (seed)

- email: `admin@medallospa.com`
- password: `Admin123!`

## Go-live Checklist

- Set strong `JWT_SECRET`.
- Set real `DATABASE_URL` and run migrations in target env.
- Configure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
- Set `FRONTEND_ORIGIN` to production domain.
- Enable centralized logs and alerts for 5xx spikes.
- Configure backup policy for PostgreSQL:
  - daily full backups
  - PITR enabled where possible
  - restoration tested at least monthly

## Rollback Notes

- Keep previous deploy artifact available.
- Apply rollback migration only if forward migration is not reversible.
- Restore last known-good DB snapshot if data migration fails.
