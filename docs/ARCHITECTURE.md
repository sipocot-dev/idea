# Technical Architecture

## Deployment
- Public URL: ideas.bettersipocot.org
- Hosting: Vercel or containerized Kubernetes
- Kubernetes namespace: better-community
- Primary DB: PostgreSQL (managed or operator-managed)
- Cache/queue coordination: Redis (managed or in-cluster)
- Files: AWS S3, Cloudflare R2, or Ceph RGW

## Components
1. Next.js public UI and admin UI
2. Server-side Route Handlers/API services
3. Authentication and RBAC
4. PostgreSQL via Drizzle ORM (source of truth)
5. Redis for cache, rate limits, and queue coordination
6. Private S3-compatible attachment bucket
7. Background worker for notifications, malware scanning, exports
8. OpenAPI specification and Swagger UI

## Suggested source layout
```
src/
  app/(public)/ (auth)/ dashboard/ admin/ api/v1/ docs/
  components/
  features/ideas reviews departments notifications users/
  lib/auth db redis storage permissions validation/
  server/services/ server/repositories/
drizzle/ docs/ openapi/
```

## Identity
Auth.js with Google, GitHub, Microsoft Entra ID, Facebook, and X OAuth, or shared BetterSipocot Keycloak via OIDC. Store provider identities in accounts table. Account linking requires re-authentication and collision checks; never link solely by matching unverified email. Use OAuth state, PKCE where supported, HTTPS, secure HTTP-only SameSite cookies. Keep provider secrets server-side.

## Authorization
Server-side RBAC on every protected API and mutation. Proponents edit only their own drafts/revision-requested records. Department reviewers see assigned records only. Auditors are read-only. UI hiding is not authorization.

## PostgreSQL
Source of truth. Use migrations, foreign keys, transactions, indexes, bounded connection pools, and row-level concurrency control for review/status changes.

## Redis
Use for cache, rate limits, and queue coordination. Do not store the only copy of durable business state in Redis. Degrade safely on cache outage.

## S3 object storage
Keep metadata in PostgreSQL and bytes in S3. Private bucket, opaque object keys, short-lived server-generated presigned URLs, size/type/magic-byte checks, checksum validation, malware scanning, and retention policies. Do not accept arbitrary bucket/key paths from clients.

## Background jobs
Use a durable outbox pattern (PostgreSQL) with a worker/queue (e.g. BullMQ + Redis). Retry transient failures with bounded backoff and dead-letter handling.

## API and observability
OpenAPI 3 served at /docs. Include auth schemes, role constraints, pagination, and error responses. Provide health/readiness endpoints, structured logs, request IDs, metrics for latency/errors, queue lag, DB pool, Redis, S3 failures, and notification delivery. Redact secrets, tokens, PII, and proposal contents from logs.
