# Security and Operations

## Secrets
- Store production values only in Vercel Environment Variables or Kubernetes Secrets.
- Never commit .env.local, database URLs, OAuth secrets, or Upstash tokens.
- Rotate credentials immediately if they are pasted into chat, logs, tickets, or source control.
- KV_REST_API_TOKEN is the server-side write token used for rate limiting. KV_REST_API_READ_ONLY_TOKEN must not be used for writes.
- Do not expose database URLs or Redis tokens to browser code.

## Database
- Use the pooled Prisma Postgres URL for application runtime.
- Use the direct Prisma Postgres URL for Drizzle migrations.
- Require TLS and use least-privilege database credentials.
- Run migrations from a controlled deployment step; do not run schema migrations on every application request.
- Test backups and restores before launch.

## Rate limiting
- Upstash Redis REST backs rate limiting across serverless instances.
- Abuse-sensitive operations fail closed when Redis is unavailable.
- Monitor rate-limit failures and tune thresholds based on legitimate usage.

## Deferred uploads
File uploads, S3 credentials, attachment endpoints, image processing, and malware scanning are not enabled in this milestone. Add them only in the final feature phase with private bucket access, strict content/size validation, scanning, and ownership checks.
