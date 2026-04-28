# CastTrack API

Backend API for the CastTrack Fishing Conditions Platform.

**Stack:** Node.js, Express, TypeScript, Prisma, PostgreSQL

## Project Structure

```
backend/
├── prisma/
│   ├── migrations/        # SQL migrations (init + name_state unique constraint)
│   ├── schema.prisma      # Database schema (all entities)
│   ├── seed.ts            # Seed CA waterbodies + dev admin
│   └── create-admin.ts    # CLI script to create or update an admin account
├── src/
│   ├── config/            # Environment config loader
│   ├── jobs/              # Scheduled cron jobs (license reminders)
│   ├── lib/               # Prisma client singleton
│   ├── middleware/        # Auth (JWT), validation (Zod), error handler
│   ├── routes/            # Express route files (one per feature)
│   ├── schemas/           # Zod validation schemas
│   ├── services/          # Business logic layer
│   ├── utils/             # Email sender
│   ├── app.ts             # Express app setup + middleware
│   └── server.ts          # Entry point
├── .env.example           # Environment variable template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v20+
- PostgreSQL database (Neon, Supabase, or local)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with real DATABASE_URL, JWT_SECRET, and SMTP credentials
   ```

3. **Generate Prisma client and run migrations**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

4. **Seed the database**
   ```bash
   npm run prisma:seed
   ```
   Populates the 10 California waterbodies and the local dev admin
   (`dev@casttrack.local` / `devpassword123`).

5. **Start dev server**
   ```bash
   npm run dev
   ```

6. **Verify**
   ```
   GET http://localhost:3000/api/health
   ```

## Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `PORT` | no | Defaults to 3000 |
| `NODE_ENV` | no | `development` or `production` |
| `DATABASE_URL` | yes | Postgres connection string |
| `JWT_SECRET` | yes | Long random string. Generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRES_IN` | no | Defaults to `7d` |
| `SMTP_HOST` | for email | e.g. `smtp.sendgrid.net` |
| `SMTP_PORT` | for email | e.g. `587` |
| `SMTP_USER` | for email | For SendGrid use the literal string `apikey` |
| `SMTP_PASS` | for email | The actual API key from SendGrid / Resend / etc. |
| `EMAIL_FROM` | for email | The "From" address shown to recipients |
| `RATE_LIMIT_WINDOW_MS` | no | Defaults to 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | no | Defaults to 100 |

## API Routes

All routes live under `/api`. Auth uses `Authorization: Bearer <jwt>`.

| Method | Endpoint                        | Auth        |
|--------|---------------------------------|-------------|
| GET    | /api/health                     | None        |
| POST   | /api/auth/register              | None        |
| POST   | /api/auth/login                 | None        |
| POST   | /api/auth/forgot-password       | None        |
| POST   | /api/auth/reset-password        | None        |
| GET    | /api/waterbodies                | Optional    |
| GET    | /api/waterbodies/:id            | Optional    |
| GET    | /api/catch-reports              | Optional    |
| GET    | /api/catch-reports/trends       | None        |
| POST   | /api/catch-reports              | Required    |
| PATCH  | /api/catch-reports/:id          | Required    |
| DELETE | /api/catch-reports/:id          | Required    |
| POST   | /api/catch-reports/:id/flag     | Required    |
| GET    | /api/events                     | None        |
| POST   | /api/events                     | Admin/Mod   |
| PATCH  | /api/events/:id                 | Admin/Mod   |
| DELETE | /api/events/:id                 | Admin       |
| GET    | /api/favorites                  | Required    |
| POST   | /api/favorites                  | Required    |
| DELETE | /api/favorites/:waterbodyId     | Required    |
| GET    | /api/reminders                  | Required    |
| POST   | /api/reminders                  | Required    |
| PATCH  | /api/reminders/:id              | 