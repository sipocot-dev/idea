# BetterSipocot Ideas Portal

Next.js application for community ideas, projects, and policy proposals.

**Repository:** https://github.com/sipocot-dev/idea  
**Planned domain:** https://ideas.bettersipocot.org

## Stack
- Next.js App Router, TypeScript, Bootstrap 5
- Auth.js credentials and OAuth providers: Google, GitHub, Microsoft Entra ID, Facebook, X
- Prisma Postgres with Drizzle ORM
- Upstash Redis REST API for rate limiting
- File storage, images, and attachments are deferred to the final feature milestone

## Implemented
- Public landing page, proposal listing and detail pages\n- Email/password registration and login; optional email verification through Resend\n- OAuth login with Google, GitHub, Facebook, X (Twitter), and Microsoft Entra ID\n- Role-based access control and administrator-managed staff invitations\n- Markdown authoring and sanitized Markdown rendering
- Authenticated proposal submission and personal submission list
- Admin proposal queue, reviewer assignment, controlled status transitions, and audit history
- Category CRUD with 15 seeded community categories
- Reporting dashboard by proposal status and category
- Proposal editing for drafts and proposals returned for revision
- Transactional status history and audit log
- PostgreSQL schema for users, roles, departments, categories, proposals, comments, supporters, and audit events
- Public JSON API and health endpoint
- Dockerfile, local PostgreSQL Compose service, Kubernetes manifests, and CI workflow

## Environment setup
Copy .env.example to .env.local and configure:
- AUTH_SECRET and AUTH_URL
- DATABASE_URL (direct Prisma Postgres connection, used by Drizzle migrations)
- DATABASE_URL_POOLED (pooled Prisma Postgres connection, used by the app)
- KV_REST_API_URL and KV_REST_API_TOKEN (Upstash Redis REST)

Never commit .env.local or production credentials. The read-only Upstash token is not suitable for rate-limit counters; use the write token server-side.

## Local development
1. Install Node.js 22.
2. Start local PostgreSQL: docker compose up -d.
3. Configure .env.local. For local PostgreSQL, set DATABASE_URL and DATABASE_URL_POOLED to your local connection string. Upstash REST credentials are still needed for rate limiting.
4. Install dependencies: npm install.
5. Apply the committed migration: npm run db:migrate.
6. Start Next.js: npm run dev.

Vercel uses `vercel-build` to apply Drizzle migrations before building. Set direct `DATABASE_URL` for migrations and pooled `DATABASE_URL_POOLED` for runtime. When `REQUIRE_EMAIL_VERIFICATION=true`, configure `RESEND_API_KEY` and a verified `RESEND_FROM_EMAIL`.

## First administrator
The account must sign in once with an enabled OAuth provider. Then run from a trusted operator environment:
npm run admin:bootstrap -- admin@example.com "System Administrator"\n\nThe command creates or promotes the account to `super_admin`, generates a cryptographically random password, and prints it once. Store it in a password manager and sign in at `/login`. Do not commit the generated password.

There is no public administrator registration. Bootstrap a single initial administrator from a trusted environment with database access. The command generates a high-entropy password and prints it once; immediately store it in a password manager. For Vercel, use `vercel env pull .env.local` in a trusted workstation before running the command.

## OAuth callback URLs
https://ideas.bettersipocot.org/api/auth/callback/{provider}
Local: http://localhost:3000/api/auth/callback/{provider}

Provider IDs: google, github, microsoft-entra-id, facebook, twitter. Configure each provider's client ID and secret in Vercel. Social login buttons appear only when both values are set.\n\n## Staff roles and invitations\nAdministrators invite users from `/admin/users`; the invited person receives a time-limited link to set their password. Assign only the minimum role required. Department reviewers and evaluators see proposals assigned to their account and can add private internal review notes. Municipal representatives have the same assigned-proposal visibility. Community moderators can hide or restore comments. Auditors have read-only access to audit events. Only a super administrator can grant the super administrator role.\n\nEmail verification for public signup is optional and controlled by `REQUIRE_EMAIL_VERIFICATION`. Set it to `true` and configure Resend to send verification emails. Staff invitations always require the recipient to use the emailed invitation link to set a password.

## Routes
- / — public landing page and proposal counters
- /ideas — public proposal list and search
- /ideas/[slug] — proposal detail and public status history
- /submit — authenticated proposal submission
- /my-ideas — current user's submissions
- /admin — administrator review queue\n- /admin/users — invite users, assign roles, activate/deactivate accounts\n- /workspace — staff workspace for assigned proposals and audit visibility\n- /register — public account registration\n- /verify-email — optional email verification\n- /accept-invite — staff invitation acceptance
- /api/v1/ideas — public JSON endpoint
- /api/health — PostgreSQL health check

## Database connection policy
Use DATABASE_URL_POOLED for normal Next.js runtime traffic on Vercel/serverless. Use DATABASE_URL (direct connection) for schema migration and Drizzle Kit operations. Do not expose either connection string to client-side code.

## Deferred final milestone
S3-compatible object storage, image uploads, attachments, presigned upload endpoints, attachment metadata, malware scanning, and related UI are intentionally excluded for now. Add them as a separately tested final feature after the core proposal workflow is complete.

## Production checklist
Before launch: configure OAuth credentials, rotate any credentials that have been shared, run and verify Drizzle migrations, add automated integration/e2e tests, review security headers and rate limits, test database backup/restore, and verify the Vercel environment variables.
