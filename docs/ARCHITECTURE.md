# Architecture

## Runtime
- Next.js App Router provides the public portal, authenticated submission workflow, administrator interface, and API routes.
- Auth.js handles OAuth sign-in and database-backed sessions.
- PostgreSQL is the system of record. Drizzle ORM provides typed queries and migrations.
- Prisma Postgres is the managed PostgreSQL provider.
- Upstash Redis REST provides distributed rate-limit counters suitable for serverless deployments.

## Database connectivity
- Application requests use DATABASE_URL_POOLED.
- Drizzle Kit migrations use DATABASE_URL (direct connection) where available.
- Both URLs are server-only environment variables.
- Keep the application pool small for Vercel/serverless. Tune DB_POOL_MAX to the deployment's concurrency and provider limits.

## Deferred object storage
S3-compatible storage, upload APIs, image/attachment UI, attachment metadata, and malware scanning are deliberately out of scope for the current milestone. They will be implemented as the final feature set after the core proposal and review workflows are stable.

## Deployment
Vercel is the initial application target. Kubernetes manifests are retained as a deployment option; provide the same environment variables through Kubernetes Secrets. Never commit populated Secret manifests.
