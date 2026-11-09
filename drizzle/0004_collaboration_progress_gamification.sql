CREATE TABLE IF NOT EXISTS idea_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','withdrawn')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (idea_id, user_id)
);
CREATE INDEX IF NOT EXISTS idea_collaborators_user_idx ON idea_collaborators(user_id, status);
CREATE INDEX IF NOT EXISTS idea_collaborators_idea_idx ON idea_collaborators(idea_id, status);

CREATE TABLE IF NOT EXISTS idea_progress_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  author_id text NOT NULL REFERENCES users(id),
  title text NOT NULL,
  body text NOT NULL,
  percent_complete integer CHECK (percent_complete BETWEEN 0 AND 100),
  milestone text,
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','private')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idea_progress_idea_created_idx ON idea_progress_updates(idea_id, created_at DESC);

CREATE TABLE IF NOT EXISTS user_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_key text NOT NULL,
  points integer NOT NULL CHECK (points > 0),
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_key)
);
CREATE INDEX IF NOT EXISTS user_points_user_created_idx ON user_points(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_key text NOT NULL,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_key)
);
CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by text REFERENCES users(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_style text NOT NULL DEFAULT 'initials';
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_palette text NOT NULL DEFAULT 'ocean';
