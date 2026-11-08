# Data Model

This is the initial relational model proposal. Final schema should be implemented through Drizzle migrations and reviewed before production.

## Core tables

### users
- id (UUID primary key)
- display_name
- email (nullable where provider policy permits; verified flag)
- avatar_url
- bio (optional)
- privacy settings
- account_status
- created_at, updated_at

### accounts
- id
- user_id -> users
- provider (google, github, microsoft, facebook, x)
- provider_account_id
- access/refresh tokens only if strictly required; encrypt at rest and avoid retaining when unnecessary
- created_at, updated_at
- Unique(provider, provider_account_id)

### sessions
Auth.js session persistence fields as required by selected adapter.

### departments
- id
- name
- slug
- description
- active
- created_at, updated_at

### barangays
- id
- name
- slug
- active

### idea_categories
- id
- name
- slug
- description
- active
- display_order

### ideas
- id (UUID)
- public_id (human-friendly unique identifier)
- slug
- proposer_id -> users
- title
- proposal_type
- category_id -> idea_categories
- summary
- description
- problem_statement
- proposed_solution
- expected_benefits
- department_id (nullable)
- estimated_budget (nullable numeric)
- budget_currency
- proposed_start_date, proposed_end_date
- priority
- status
- visibility
- is_open_source
- collaboration_welcome
- proposer_willing_to_participate
- submitted_at
- created_at, updated_at
- deleted_at (nullable; prefer soft-delete with audit)

### idea_barangays
- idea_id
- barangay_id
- Unique(idea_id, barangay_id)

### idea_links
- id
- idea_id
- link_type
- label
- url
- display_order

### idea_attachments
- id
- idea_id
- uploader_id
- object_key
- original_filename
- content_type
- size_bytes
- checksum
- scan_status
- visibility
- created_at

### idea_status_history
- id
- idea_id
- from_status
- to_status
- actor_id
- remarks
- visibility (public/internal)
- created_at

### idea_assignments
- id
- idea_id
- department_id
- reviewer_id
- assigned_by
- assigned_at
- active

### idea_reviews
- id
- idea_id
- reviewer_id
- recommendation
- criteria JSONB
- comments
- visibility
- created_at

### idea_comments
- id
- idea_id
- author_id
- body
- moderation_status
- created_at, updated_at

### idea_supporters
- idea_id
- user_id
- created_at
- Unique(idea_id, user_id)

### idea_internal_notes
- id
- idea_id
- author_id
- body
- created_at

### idea_milestones
- id
- idea_id
- title
- description
- due_date
- completed_at
- display_order

### notifications
- id
- user_id
- type
- payload JSONB
- read_at
- created_at

### administrators / roles
Prefer normalized roles and assignments:
- roles
- user_roles
- department_memberships

### audit_logs
- id
- actor_id
- action
- entity_type
- entity_id
- before JSONB
- after JSONB
- request_id
- created_at

## Constraints and indexes

- Unique public_id and slug (or use unique scoped slugs).
- Foreign keys with deliberate deletion behavior.
- Unique account provider identity.
- Unique endorsement per user/idea.
- Index ideas(status, submitted_at), ideas(category_id, status), ideas(department_id, status), and relevant barangay joins.
- Index comments by idea and creation time.
- Use CHECK constraints for valid enum-like values where practical.
- Store money in numeric precision, not floating point.
- Validate status transitions in a transaction and append status history and audit log atomically.
- Use UTC timestamps in the database and render local time in the UI.
