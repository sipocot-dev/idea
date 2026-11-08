# Technical Architecture

## Deployment target

- Application: Next.js on Vercel or containerized Kubernetes
- Domain: ideas.bettersipocot.org
- Kubernetes namespace (if deployed in the BetterSipocot cluster): better-community
- PostgreSQL: managed PostgreSQL or PostgreSQL operator
- Redis: managed Redis/Upstash or in-cluster Redis
- Object storage: AWS S3, Cloudflare R2, or Ceph RGW

Keep the application independently deployable while integrating with shared BetterSipocot identity and platform services where practical.

## Logical components

1. Next.js public site and administration interface
2. Server-side API/Route Handlers
3. Authentication and authorization layer
4. PostgreSQL persistence through Drizzle ORM
5. Redis cache, rate limiting, and job coordination
6. S3-compatible private attachment storage
7. Background worker for notifications, scanning, exports, and scheduled tasks
8. OpenAPI specification and generated API documentation

## Suggested source organization

```
src/
  app/
    (public)/
    (auth)/
    dashboard/
    admin/
    api/v1/
    docs/
  components/
  features/
    ideas/
    reviews/
    departments/
    notifications/
    users/
  lib/
    auth/
    db/
    redis/
    storage/
    permissions/
    validation/
  server/
    services/
    repositories/
drizzle/
docs/
```

## Authentication

Use Auth.js with OAuth providers for Google, GitHub, Microsoft Entra ID, Facebook, and X. Alternatively, use the existing shared Keycloak OIDC service as the single identity broker when configured.

Store provider identity in an accounts table; support linking/unlinking accounts only after re-authentication and collision checks. Use secure, HTTP-only, SameSite cookies and production HTTPS. Validate OAuth state and PKCE where supported. Never expose provider client secrets to browser code.

## Authorization

Enforce RBAC on the server for every protected route and mutation. Scope department reviewers to assigned records. Auditors get read-only access. Verify ownership for draft edits and never rely on hidden UI controls as authorization.

## PostgreSQL

PostgreSQL is the source of truth. Use migrations, foreign keys, indexes, transactions for status transitions, and optimistic concurrency or row locking for simultaneous reviews.

## Redis

Use Redis for:
- Rate limits and abuse protection
- Cache for public list/statistics queries
- Background job queue coordination
- Short-lived workflow coordination

Do not use Redis as the durable source of truth. Ensure the app behaves safely when the cache is unavailable.

## S3-compatible storage

Store attachment metadata in PostgreSQL and object bytes in S3. Use opaque object keys, private buckets, server-generated presigned URLs, upload size/type limits, checksum verification, malware scanning, and lifecycle/retention policies. Never accept arbitrary bucket/key values from a client.

## Background jobs

Use a durable queue pattern (for example, a PostgreSQL-backed outbox plus Redis/BullMQ worker). Record notifications in PostgreSQL before delivery. Retry transient errors with bounded backoff and dead-letter handling.

## API documentation

Maintain an OpenAPI 3 specification. Serve interactive Swagger UI at /docs. Document authentication, authorization requirements, pagination, errors, and rate limits. Do not expose administrative schemas or data through public endpoints.

## Observability

Provide structured logs with request IDs, health/readiness endpoints, metrics for request latency/error rate, job queue depth, database/Redis connectivity, object-storage errors, and notification delivery. Avoid logging tokens, secrets, personal data, or full proposal contents.
