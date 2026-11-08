# Product Requirements

## Purpose and audiences
A civic engagement platform, not just a suggestion box. Residents, students, educators, civic groups, businesses, developers, and local organizations can propose initiatives. Departments evaluate proposals, publish responses, and report implementation progress.

## Public pages
Overview, Browse Ideas, Projects, Policy Proposals, Submit an Idea, How It Works, About.

## Submission form
### Basic
- Title; proposal type (idea, community project, policy proposal, other); category
- Executive summary and detailed description
- Problem statement, proposed solution, expected benefits

### Project details
- One or more target barangays
- Target beneficiaries; responsible department (optional)
- Estimated budget and currency (optional)
- Proposed timeline; user-suggested priority

### Links and attachments
Accept multiple typed URLs: GitHub repository, GitHub organization, live demo, project website, documentation, other reference. Accept PDF/images/documents through secure S3 presigned uploads. Validate URL syntax and file content; never execute linked content. Draft save/resume is supported.

### Additional
Open-source status, willingness to collaborate, willingness to participate in implementation, additional comments.

## Public discovery
Search, pagination, and filters by category, type, status, barangay, department, and year. Public detail includes summary, description, links, public attachments, proponent display identity per privacy settings, status timeline, endorsements, moderated comments, department response, and project milestones.

## Workflow
Draft -> Submitted -> Under Review -> For Revision -> Submitted -> Under Review -> Approved -> In Progress -> Completed. Rejected and Archived are closing outcomes. Reopening requires privileged permission and a recorded reason. Enforce transitions server-side in a transaction.

## Status definitions
- Draft: saved but not submitted
- Submitted: received and awaiting initial review
- Under Review: assigned for evaluation
- For Revision: proposer must add information
- Approved: accepted for implementation or further development
- In Progress: implementation started
- Completed: work complete
- Rejected: declined with explanation
- Archived: closed and retained

## Community features
Authenticated users may endorse once per idea and remove their endorsement. Comments require moderation/reporting tools and rate limits. Endorsements are expressions of support, not formal elections or legally sufficient consultation.

## Administration
Roles:
- Super Administrator: all access, system configuration, role management
- Administrator: manage proposals, users, categories, departments, reports
- Department Reviewer: access assigned proposals and submit reviews
- Evaluator: evaluate and recommend decisions
- Read-only Auditor: view records and audit logs only

Functions: triage queue; assign department/reviewer; request revisions; approve/reject/archive with remarks; review rubric; internal notes; public department responses; milestones; user moderation; categories/departments; reports; audit viewer.

No public admin registration. First super-admin created using a one-time CLI or secure deployment procedure.

## Reporting and notifications
Aggregate by year, barangay, category, proposal type, status, and department. Report review turnaround separately for open vs completed reviews. Notify users of receipt, revision requests, status changes, and completion. Persist notification records before asynchronous delivery and retry safely.

## Privacy/accessibility
Responsive accessible forms, keyboard navigation, explicit privacy notice and identity display controls. Keep private drafts and contact information out of public APIs. Define retention, export, and deletion policies.
