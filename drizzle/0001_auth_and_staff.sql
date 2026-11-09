ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'municipal_representative';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'community_moderator';
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text;
CREATE TABLE IF NOT EXISTS email_verification_tokens (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 token_hash text NOT NULL UNIQUE,
 expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_verification_user_idx ON email_verification_tokens(user_id);
CREATE TABLE IF NOT EXISTS user_invitations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 email text NOT NULL,
 token_hash text NOT NULL UNIQUE,
 role user_role NOT NULL DEFAULT 'user',
 name text NOT NULL,
 expires_at timestamptz NOT NULL,
 accepted_at timestamptz,
 created_by text REFERENCES users(id),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS user_invitations_email_idx ON user_invitations(email);
