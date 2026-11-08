# BetterSipocot Ideas Portal

Next.js application scaffold for community ideas, projects, and policy proposals.

**Domain:** https://ideas.bettersipocot.org

## Included
- Next.js App Router + TypeScript + Bootstrap 5
- Auth.js OAuth providers: Google, GitHub, Microsoft Entra ID, Facebook, X
- PostgreSQL + Drizzle schema and migration configuration
- Redis rate limiting
- S3-compatible presigned upload URL endpoint
- Public proposal list, detail pages, submission form, and user submissions
- Admin proposal queue with validated status transitions and transactional audit history
- Public JSON API, health endpoint, Docker Compose dependencies, Dockerfile, CI workflow
- Secure super-admin bootstrap command

## Quick start
1. Install Node.js 22 and Docker Compose.
2. Copy .env.example to .env.local. Configure AUTH_SECRET, DATABASE_URL, REDIS_URL, and at least one OAuth provider.
3. Start dependencies: docker compose up -d.
4. Install dependencies: npm install.
5. Generate and apply database migrations: npm run db:generate then npm run db:migrate.
6. Start the app: npm run dev.
7. Open http://localhost:3000.

The local Compose PostgreSQL password is for development only.

## First administrator
The account must sign in once using an enabled provider. Then run:
npm run admin:grant -- admin@example.com

Run this only from a trusted operator environment with database access. No public admin signup exists.

## OAuth setup
Register callback URLs at each provider:
https://ideas.bettersipocot.org/api/auth/callback/{provider}
For local development use http://localhost:3000/api/auth/callback/{provider}.
Provider IDs: google, github, microsoft-entra-id, facebook, twitter.

## Storage
Configure S3 endpoint, bucket, region, and credentials in server-side environment variables. The presign API currently accepts PDF/JPEG/PNG/WebP up to S3_MAX_UPLOAD_BYTES. Use a private bucket, restricted CORS, malware scanning, and a server-side finalize/metadata workflow before production use.

## Commands
- npm run dev — development
- npm run typecheck — TypeScript
- npm run lint — ESLint
- npm run build — production build
- npm run db:generate — generate migrations
- npm run db:migrate — apply migrations
- npm run admin:grant -- email — grant super-admin

## Routes
- / public landing page and aggregate counts
- /ideas public proposal list
- /ideas/[slug] public proposal detail and status history
- /submit authenticated proposal form
- /my-ideas authenticated user's submissions
- /admin administrator proposal queue
- /api/v1/ideas public JSON API
- /api/v1/uploads/presign authenticated upload URL endpoint
- /api/health database health check

## Production hardening still required
This is an initial application scaffold, not a finished production service. Before public launch, complete and test: file upload finalization and malware scanning; attachment metadata persistence; draft editing; reviewer/department assignment UI; email notifications; comments/endorsements; full Swagger UI; pagination and richer filters; security headers; rate-limit policy; integration/e2e tests; backup/restore drills; provider-specific OAuth verification; and accessibility review.

See docs/PRODUCT.md, docs/ARCHITECTURE.md, docs/DATA-MODEL.md, docs/API.md, docs/SECURITY-OPERATIONS.md, and docs/ROADMAP.md.
