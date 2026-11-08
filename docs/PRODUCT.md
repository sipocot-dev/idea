# Product Requirements

## Product overview

The BetterSipocot Ideas Portal is a public civic participation service. It is more than a suggestion box: submissions move through a defined review process, responsible departments can respond, and the public can follow approved project progress.

## Audiences

- Residents and community groups
- Students, educators, and researchers
- Local organizations and businesses
- Developers and open-source contributors
- Department reviewers and evaluators
- System administrators and auditors

## Public navigation

- Overview
- Browse Ideas
- Projects
- Policy Proposals
- Submit an Idea
- How It Works
- About

## Submission form

### Basic information
- Title
- Proposal type: idea, community project, policy proposal, or other
- Category
- Executive summary
- Detailed description
- Problem statement
- Proposed solution
- Expected benefits

### Project information
- Target barangay (optional; support multiple barangays)
- Target beneficiaries
- Responsible department (optional)
- Estimated budget (optional, with currency)
- Proposed timeline
- Priority (low, normal, high; user-suggested only)

### Supporting links
Allow multiple typed links:
- GitHub repository
- GitHub organization
- Live demo
- Project website
- Documentation
- Other reference

Validate URLs and display them as external links. Do not automatically trust or execute content from linked repositories.

### Attachments
Support PDF and common image/document formats with configurable size limits, content-type checks, malware scanning, and private-by-default storage.

### Additional questions
- Is the proposal open source?
- Is collaboration welcome?
- Is the proposer willing to participate in implementation?
- Additional comments

Users can save drafts and submit later. On submission, capture an immutable submitted snapshot or otherwise preserve the submitted version for audit.

## Public discovery

Browse published proposals with search, pagination, and filters for:
- Category
- Proposal type
- Status
- Barangay
- Department
- Submission year

Idea detail pages show summary, description, category, proponent display name (subject to privacy settings), supporting links, public attachments, current status, public status history, endorsements, comments, department response, and implementation milestones.

## Status workflow

Draft -> Submitted -> Under Review -> For Revision -> Submitted -> Under Review -> Approved -> In Progress -> Completed.

Rejected and Archived are terminal/administrative outcomes. Administrators may reopen a proposal with a recorded reason. Enforce permitted transitions server-side; never trust a status supplied by a public client.

## Status definitions

- Draft: saved but not submitted
- Submitted: received and awaiting initial review
- Under Review: being evaluated
- For Revision: proposer action required
- Approved: accepted for implementation or further development
- In Progress: implementation started
- Completed: project completed
- Rejected: not accepted, with explanation
- Archived: closed and retained

## Community participation

- Authenticated users may endorse a public proposal once.
- Users may remove their endorsement.
- Authenticated users may comment; comments support reporting and moderation.
- Endorsements are expressions of support, not formal votes or evidence of legal/public consultation.
- Provide moderation controls and anti-spam limits.

## Administration

Roles:
- Super Administrator: full control, role management, system configuration
- Administrator: manage proposals, users, categories, departments, and reports
- Department Reviewer: access assigned proposals and submit reviews
- Evaluator: evaluate and recommend decisions
- Read-only Auditor: read records and audit history

Features:
- Proposal queue and advanced filters
- Assignment to department/reviewer
- Review rubric and recommendations
- Request revisions with a message
- Approve/reject/archive with required remarks
- Internal notes separate from public comments
- Department responses and project milestones
- User moderation
- Category and department management
- CSV/PDF reports and analytics
- Audit log viewer

No public administrator registration. Bootstrap the first super administrator through a one-time secure CLI or deployment procedure.

## Reporting

Report counts and trends by year, category, barangay, proposal type, department, and status. Include review turnaround and completion measures. Define metrics carefully and avoid presenting elapsed time for still-open items as completed review time.

## Notifications

Email and in-app notifications for submission receipt, assignment where appropriate, revision request, status changes, reviewer comments, and completion. Notification delivery should be asynchronous and retryable.

## Accessibility and privacy

Use accessible forms, keyboard navigation, clear validation, responsive layout, privacy notices, account data export/deletion workflows where legally applicable, and retention policies. Provide privacy controls for proposer identity and contact details.
