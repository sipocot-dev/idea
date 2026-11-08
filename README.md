# BetterSipocot Ideas Portal

Civic participation platform for residents, organizations, students, and developers to submit ideas, community projects, and policy proposals for Sipocot.

**Target URL:** https://ideas.bettersipocot.org

## Product capabilities
- Structured idea, project, and policy proposal submissions
- Google, GitHub, Microsoft, Facebook, and X sign-in
- Drafts, external links (GitHub, demo, docs), and S3 attachments
- Transparent review lifecycle and status history
- Department/reviewer assignment, evaluation, and administrator workflows
- Public browsing, endorsements, moderated comments, milestones, and reports

## Planned stack
Next.js + TypeScript + Bootstrap 5 · PostgreSQL + Drizzle ORM · Redis · S3-compatible object storage · Auth.js or shared Keycloak OIDC · OpenAPI/Swagger.

## Status legend
| Status | Meaning |
|---|---|
| Draft | Saved, not submitted |
| Submitted | Received, awaiting initial review |
| Under Review | Being evaluated |
| For Revision | Proposer must provide more information |
| Approved | Accepted for implementation/development |
| In Progress | Implementation started |
| Completed | Work completed |
| Rejected | Not accepted; reason recorded |
| Archived | Closed and retained for records |

Every transition records previous/new status, actor, timestamp, remarks, and visibility.

## Documentation
- [Product requirements](docs/PRODUCT.md)
- [Technical architecture](docs/ARCHITECTURE.md)
- [Data model](docs/DATA-MODEL.md)
- [API plan](docs/API.md)
- [Security and operations](docs/SECURITY-OPERATIONS.md)
- [Implementation roadmap](docs/ROADMAP.md)

## Deployment
Target namespace: better-community. Independently deployable with optional BetterSipocot shared identity integration. Never commit secrets. Bootstrap the first super administrator through a secure one-time CLI/deployment procedure; no public administrator registration.
