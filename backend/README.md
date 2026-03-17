# CastTrack API

Backend API for the CastTrack Fishing Conditions Platform.

**Stack:** Node.js, Express, TypeScript, Prisma, PostgreSQL

## Project Structure

```
casttrack-api/
├── prisma/
│   ├── schema.prisma      # Database schema (all entities)
│   └── seed.ts            # Seed CA waterbodies
├── src/
│   ├── config/            # Environment config loader
│   ├── jobs/              # Scheduled cron jobs (license reminders)
│   ├── lib/               # Prisma client singleton
│   ├── middleware/         # Auth (JWT), validation (Zod), error handler
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
- PostgreSQL database (local, Docker, or Neon/Supabase free tier)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and JWT secret
   ```

3. **Generate Prisma client + run migrations**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Seed the database**
   ```bash
   npx ts-node prisma/seed.ts
   ```

5. **Start dev server**
   ```bash
   npm run dev
   ```

6. **Verify it's running**
   ```
   GET http://localhost:3000/api/health
   ```

## API Routes

| Method | Endpoint                        | Auth     | Status      |
|--------|---------------------------------|----------|-------------|
| GET    | /api/health                     | None     | Working     |
| POST   | /api/auth/register              | None     | Stub        |
| POST   | /api/auth/login                 | None     | Stub        |
| POST   | /api/auth/forgot-password       | None     | Stub        |
| POST   | /api/auth/reset-password        | None     | Stub        |
| GET    | /api/waterbodies                | Optional | Stub        |
| GET    | /api/waterbodies/:id            | Optional | Stub        |
| GET    | /api/catch-reports              | Optional | Stub        |
| GET    | /api/catch-reports/trends       | None     | Stub        |
| POST   | /api/catch-reports              | Required | Stub        |
| PATCH  | /api/catch-reports/:id          | Required | Stub        |
| DELETE | /api/catch-reports/:id          | Required | Stub        |
| POST   | /api/catch-reports/:id/flag     | Required | Stub        |
| GET    | /api/events                     | None     | Stub        |
| POST   | /api/events                     | Admin    | Stub        |
| PATCH  | /api/events/:id                 | Admin    | Stub        |
| DELETE | /api/events/:id                 | Admin    | Stub        |
| GET    | /api/favorites                  | Required | Stub        |
| POST   | /api/favorites                  | Required | Stub        |
| DELETE | /api/favorites/:waterbodyId     | Required | Stub        |
| GET    | /api/reminders                  | Required | Stub        |
| POST   | /api/reminders                  | Required | Stub        |
| PATCH  | /api/reminders/:id              | Required | Stub        |
| DELETE | /api/reminders/:id              | Required | Stub        |
| GET    | /api/weather/:waterbodyId       | Optional | Stub        |

**Stub** = Route registered, returns 501. Service logic is written and ready to wire up.

## Build Plan

1. ~~Setup environment / structure~~ (done)
2. Wire up waterbody routes to service
3. Wire up auth routes to service
4. Wire up favorites routes to service
5. Wire up catch reports routes to service
6. Wire up weather routes to service
7. Wire up events routes to service
8. Wire up reminders routes to service + cron
9. Testing and polishing

## Useful Commands

```bash
npm run dev              # Start dev server with hot reload
npm run build            # Compile TypeScript
npm start                # Run compiled JS (production)
npx prisma studio        # Open DB GUI browser
npx prisma migrate dev   # Create/run migrations
```
