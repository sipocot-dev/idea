ALTER TABLE ideas ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS ideas_view_count_idx ON ideas (view_count DESC);
CREATE INDEX IF NOT EXISTS idea_supporters_idea_idx ON idea_supporters (idea_id);