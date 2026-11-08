# Security and Operations

## Secrets
Configure database, Redis, Auth.js, OAuth, S3, and email credentials through Vercel environment variables or Kubernetes Secrets/external secret manager. Never commit real credentials. Commit only sanitized .env.example files.

## Identity and authorization
- HTTPS, secure HTTP-only SameSite cookies, OAuth state and PKCE where available
- No automatic provider linking on unverified email
- Re-authenticate for linking/unlinking providers
- MFA for privileged accounts through identity provider
- Server-side RBAC for every protected operation
- Reviewers scoped to assigned records; auditors read-only
- Admin role changes and privileged actions audited

## Uploads
Private bucket, opaque object keys, constrained short-lived presigned URLs, extension/MIME/magic-byte/size/checksum validation, malware scan before exposure, safe download content headers, explicit public/private visibility. Never render untrusted HTML/SVG inline.

## Backups
Schedule encrypted PostgreSQL backups and WAL/PITR where supported. Store backups in a separate S3 bucket/account with retention and versioning/immutability where possible. Keep DB backups separate from attachment storage. Perform regular restore tests and document recovery objectives. Never include plaintext secrets in backups/config exports.

## Operations
/api/health and /api/ready without credential disclosure. Monitor HTTP latency/errors, DB pool, Redis, queue lag, S3 failures, scanning failures, and email delivery. Structured logs with correlation IDs; redact tokens, cookies, secrets, email addresses, and proposal contents. Define retention/deletion policy for personal data and files.
