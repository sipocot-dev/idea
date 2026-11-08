# Initial Data Model

Implement with Drizzle migrations; review indexes and deletion semantics before production.

- users: UUID, display_name, verified email (nullable as appropriate), avatar, bio, privacy settings, account status, timestamps
- accounts: user_id, provider (google/github/microsoft/facebook/x), provider_account_id, timestamps; unique(provider, provider_account_id). Retain OAuth tokens only when necessary and encrypt at rest.
- sessions: Auth.js adapter session fields as required
- departments: name, slug, description, active
- barangays: name, slug, active
- idea_categories: name, slug, description, active, display_order
- ideas: UUID, public_id, slug, proposer_id, title, proposal_type, category_id, summary, description, problem_statement, proposed_solution, expected_benefits, optional department_id, numeric estimated_budget/currency, proposed dates, priority, status, visibility, open_source/collaboration/participation flags, submitted_at, timestamps, soft-delete marker
- idea_barangays: idea_id, barangay_id; unique pair
- idea_links: idea_id, link_type, label, URL, display_order
- idea_attachments: idea_id, uploader_id, object_key, original_filename, content_type, size_bytes, checksum, scan_status, visibility, created_at
- idea_status_history: idea_id, from_status, to_status, actor_id, remarks, public/internal visibility, created_at
- idea_assignments: idea_id, department_id, reviewer_id, assigned_by, assigned_at, active
- idea_reviews: idea_id, reviewer_id, recommendation, criteria JSONB, comments, visibility, created_at
- idea_comments: idea_id, author_id, body, moderation_status, timestamps
- idea_supporters: idea_id, user_id, created_at; unique(idea_id, user_id)
- idea_internal_notes: idea_id, author_id, body, created_at
- idea_milestones: idea_id, title, description, due_date, completed_at, display_order
- notifications: user_id, type, payload JSONB, read_at, created_at
- roles, user_roles, department_memberships: normalized authorization assignments
- audit_logs: actor_id, action, entity_type/id, before/after JSONB, request_id, created_at

Constraints: unique public_id; unique provider identity; unique endorsement; foreign keys; CHECK constraints for statuses/types; numeric not float for money. Index status/submission date, category/status, department/status, comments by idea/date. Status history and audit events must be written atomically with status changes. Use UTC database timestamps.
