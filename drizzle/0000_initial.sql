CREATE TYPE user_role AS ENUM ('super_admin','admin','department_reviewer','evaluator','auditor','user');
CREATE TYPE idea_status AS ENUM ('draft','submitted','under_review','for_revision','approved','in_progress','completed','rejected','archived');
CREATE TYPE proposal_type AS ENUM ('idea','community_project','policy_proposal','other');
CREATE TABLE users (id text PRIMARY KEY, name text, email text UNIQUE, email_verified timestamp, image text, role user_role NOT NULL DEFAULT 'user', is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE accounts (user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE, type text NOT NULL, provider text NOT NULL, provider_account_id text NOT NULL, refresh_token text, access_token text, expires_at integer, token_type text, scope text, id_token text, session_state text);
CREATE UNIQUE INDEX accounts_provider_account_unique ON accounts(provider, provider_account_id);
CREATE TABLE sessions (session_token text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires timestamp NOT NULL);
CREATE TABLE verification_tokens (identifier text NOT NULL, token text NOT NULL, expires timestamp NOT NULL);
CREATE UNIQUE INDEX verification_token_unique ON verification_tokens(identifier, token);
CREATE TABLE departments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL UNIQUE, slug text NOT NULL UNIQUE, active boolean NOT NULL DEFAULT true);
CREATE TABLE idea_categories (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL UNIQUE, slug text NOT NULL UNIQUE, description text, active boolean NOT NULL DEFAULT true, display_order integer NOT NULL DEFAULT 0);
CREATE TABLE ideas (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), public_id text NOT NULL UNIQUE, slug text NOT NULL UNIQUE, proposer_id text NOT NULL REFERENCES users(id), title text NOT NULL, type proposal_type NOT NULL DEFAULT 'idea', category_id uuid REFERENCES idea_categories(id), summary text NOT NULL, description text NOT NULL, problem_statement text, proposed_solution text, expected_benefits text, target_barangay text, department_id uuid REFERENCES departments(id), assigned_reviewer_id text REFERENCES users(id), estimated_budget numeric(14,2), github_url text, project_url text, documentation_url text, status idea_status NOT NULL DEFAULT 'draft', visibility text NOT NULL DEFAULT 'public', is_open_source boolean NOT NULL DEFAULT false, willing_to_collaborate boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), submitted_at timestamptz);
CREATE INDEX ideas_status_submitted_idx ON ideas(status, submitted_at);
CREATE INDEX ideas_category_status_idx ON ideas(category_id, status);
CREATE INDEX ideas_proposer_idx ON ideas(proposer_id, created_at);
CREATE TABLE idea_status_history (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), idea_id uuid NOT NULL REFERENCES ideas(id) ON DELETE CASCADE, from_status idea_status, to_status idea_status NOT NULL, actor_id text NOT NULL REFERENCES users(id), remarks text, visibility text NOT NULL DEFAULT 'public', created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX idea_history_idea_created_idx ON idea_status_history(idea_id, created_at);
CREATE TABLE idea_comments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), idea_id uuid NOT NULL REFERENCES ideas(id) ON DELETE CASCADE, author_id text NOT NULL REFERENCES users(id), body text NOT NULL, moderation_status text NOT NULL DEFAULT 'visible', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE idea_supporters (idea_id uuid NOT NULL REFERENCES ideas(id) ON DELETE CASCADE, user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now());
CREATE UNIQUE INDEX idea_supporter_unique ON idea_supporters(idea_id, user_id);
CREATE TABLE audit_logs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_id text REFERENCES users(id), action text NOT NULL, entity_type text NOT NULL, entity_id text NOT NULL, metadata jsonb, created_at timestamptz NOT NULL DEFAULT now());
INSERT INTO idea_categories (name, slug, description, display_order) VALUES
('Infrastructure','infrastructure','Roads, bridges, drainage',10),
('Education','education','Schools, scholarships, digital learning',20),
('Healthcare','healthcare','Clinics, medical services',30),
('Agriculture','agriculture','Farming, irrigation, fisheries',40),
('Environment','environment','Waste management, reforestation',50),
('Technology','technology','Digital government, open-source software',60),
('Transportation','transportation','Public transportation, traffic',70),
('Tourism','tourism','Tourism development',80),
('Livelihood','livelihood','Employment, entrepreneurship',90),
('Public Safety','public-safety','Disaster preparedness, security',100),
('Governance','governance','Transparency, public services',110),
('Policy','policy','Ordinances, resolutions, policy changes',120),
('Youth & Sports','youth-sports','Youth programs, sports facilities',130),
('Culture & Heritage','culture-heritage','Local history and preservation',140),
('Others','others','Other community proposals',150);
