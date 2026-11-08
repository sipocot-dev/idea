# Implementation Roadmap

1. Foundation: Next.js/TypeScript, Bootstrap 5, Drizzle, PostgreSQL, Redis, config validation, CI.
2. Identity: Auth.js or shared Keycloak OIDC, five OAuth providers, profiles, account linking, super-admin bootstrap, RBAC tests.
3. Submission lifecycle: drafts, form validation, categories/barangays/departments, external URLs, S3 uploads/scanning.
4. Public portal: browse, search/filter, details, status legends/timeline, project and policy views, accessibility.
5. Admin: queues, reviewer assignment, rubric, revision requests, status workflow, internal notes, responses, audit log.
6. Community: endorsements, moderated comments, milestones, notifications.
7. Operations: CSV/PDF reports, encrypted scheduled backups, restore tests, observability, production readiness.

## Definition of done
- Authorization tests for every protected route.
- Transactional, auditable status transitions.
- No leakage of drafts, private attachments, or contact data.
- OAuth/S3 secrets absent from client bundles and source control.
- Upload validation and malware scanning enforced.
- Repeatable migrations and CI for lint/typecheck/tests/build.
- Successful documented backup restoration test.
