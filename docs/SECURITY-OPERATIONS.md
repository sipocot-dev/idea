# Security and Operations

## Secrets

Configure secrets through Vercel environment variables or Kubernetes Secrets/external secret manager. Never commit .env files containing credentials.

Expected configuration groups:
- PostgreSQL connection string
- Redis connection string
- Auth.js secret and application URL
- OAuth client IDs/secrets for enabled providers
- S3 endpoint, bucket, region, access key, secret key
- Email provider credentials
- Malware scanning service configuration

Commit only a sanitized .env.example when implementation begins.

## Authentication and account safety

- Enforce HTTPS and secure session cookies.
- Use OAuth state and PKCE where supported.
- Verify email where available and needed.
- Prevent account linking based solely on matching unverified email.
- Re-authenticate before linking/unlinking providers or changing sensitive settings.
- Protect admin accounts with MFA through the identity provider where possible.
- Rate-limit login callbacks and account-sensitive actions.

## Authorization

- Server-side RBAC on every protected route.
- Proponents can edit only their drafts and requested revisions.
- Department reviewers can access only assigned proposals.
- Auditors are read-only.
- Require elevated role for user/role management.
- Record privileged actions in append-only audit history.

## Upload security

- Use private object storage.
- Server generates opaque object keys and constrained short-lived presigned URLs.
- Enforce extension, MIME, magic-byte, size, and checksum checks.
- Scan uploads before making them available.
- Do not render untrusted HTML or SVG inline.
- Set download Content-Disposition and safe content types.
- Keep public/private attachment visibility explicit.

## Backups

- Schedule PostgreSQL backups and WAL/PITR where supported.
- Store encrypted backups in a separate S3 bucket or account.
- Apply retention policy and object versioning/immutability where appropriate.
- Back up schema/migration history and required configuration metadata, never secrets in plaintext.
- Perform and document regular restore tests.
- Treat attachments and database backups as separate recovery domains.

## Operations

- Provide /api/health and /api/ready endpoints.
- Readiness checks should validate required dependencies without exposing credentials.
- Monitor HTTP latency/errors, database pool saturation, Redis availability, queue lag, upload/scan failures, and email delivery.
- Use structured logs with request/correlation IDs.
- Redact OAuth tokens, cookies, secrets, email addresses, and proposal content from logs.
- Define retention and deletion policies for personal data and attachments.
