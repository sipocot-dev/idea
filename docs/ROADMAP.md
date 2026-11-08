# Implementation Roadmap

## Phase 1 — Foundation
- Next.js + TypeScript app scaffold
- Bootstrap 5 layout and design system
- PostgreSQL connection and Drizzle schema/migrations
- Redis connection and health checks
- Environment validation and local development setup
- CI checks: lint, typecheck, unit tests, build

## Phase 2 — Authentication and user profiles
- Auth.js or shared Keycloak OIDC
- Google, GitHub, Microsoft, Facebook, and X providers
- Profile and account linking
- Secure bootstrap super-admin command
- RBAC middleware and tests

## Phase 3 — Proposal lifecycle
- Create/edit drafts
- Submission validation
- Categories, barangays, departments
- GitHub and external link fields
- S3 presigned attachments and malware scanning
- Submission confirmation

## Phase 4 — Public portal
- Browse/search/filter/paginate proposals
- Detail pages and status legends
- Public status timeline
- Published projects and policy proposals
- Accessibility and responsive design

## Phase 5 — Administration and evaluation
- Admin dashboard and review queue
- Assign reviewers/departments
- Review rubric and recommendations
- Revision requests
- Status transition workflow
- Internal notes and public department responses
- Audit logs

## Phase 6 — Community features
- Endorsements
- Comments and moderation
- Notifications and email queue
- Project milestones and progress updates

## Phase 7 — Reporting and operations
- CSV/PDF reports
- Analytics by category, barangay, department, year, and status
- Scheduled encrypted PostgreSQL backups to S3
- Restore tests
- Observability and production readiness review

## Definition of done

- All protected routes have server-side authorization tests.
- Status transitions are transactional and auditable.
- Draft and private data cannot leak through public APIs.
- OAuth secrets and S3 credentials are never exposed to client bundles.
- Upload validation and malware scanning are enforced.
- Database migrations are repeatable.
- CI passes lint, typecheck, tests, and production build.
- Backup restoration is tested and documented.
