-- Memory Evolution Schema
-- Adds reusable skill storage and session archives for long-term learning loops.
-- Safe to run multiple times.

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Shared updated_at trigger function.
CREATE OR REPLACE FUNCTION update_updated_at_generic()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS brain_skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  summary text NOT NULL,
  sop_steps jsonb DEFAULT '[]'::jsonb,
  tags text[] DEFAULT '{}'::text[],
  source_session_key text,
  metadata jsonb DEFAULT '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_brain_skills_title_unique
  ON brain_skills (lower(title));

CREATE INDEX IF NOT EXISTS idx_brain_skills_tags
  ON brain_skills USING gin (tags);

CREATE INDEX IF NOT EXISTS idx_brain_skills_metadata
  ON brain_skills USING gin (metadata);

CREATE INDEX IF NOT EXISTS idx_brain_skills_embedding
  ON brain_skills USING hnsw (embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS session_archives (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_key text NOT NULL UNIQUE,
  summary text NOT NULL,
  wins text[] DEFAULT '{}'::text[],
  failures text[] DEFAULT '{}'::text[],
  next_actions text[] DEFAULT '{}'::text[],
  source text DEFAULT 'manual',
  consolidated_at timestamptz,
  consolidated_skill_id uuid REFERENCES brain_skills(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_session_archives_source
  ON session_archives (source);

CREATE INDEX IF NOT EXISTS idx_session_archives_consolidated_at
  ON session_archives (consolidated_at);

CREATE INDEX IF NOT EXISTS idx_session_archives_metadata
  ON session_archives USING gin (metadata);

CREATE INDEX IF NOT EXISTS idx_session_archives_embedding
  ON session_archives USING hnsw (embedding vector_cosine_ops);

DROP TRIGGER IF EXISTS brain_skills_updated_at ON brain_skills;
CREATE TRIGGER brain_skills_updated_at
  BEFORE UPDATE ON brain_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_generic();

DROP TRIGGER IF EXISTS session_archives_updated_at ON session_archives;
CREATE TRIGGER session_archives_updated_at
  BEFORE UPDATE ON session_archives
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_generic();

ALTER TABLE brain_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_archives ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'brain_skills'
      AND policyname = 'Service role full access brain_skills'
  ) THEN
    CREATE POLICY "Service role full access brain_skills"
      ON brain_skills
      FOR ALL
      USING (auth.role() = 'service_role');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'session_archives'
      AND policyname = 'Service role full access session_archives'
  ) THEN
    CREATE POLICY "Service role full access session_archives"
      ON session_archives
      FOR ALL
      USING (auth.role() = 'service_role');
  END IF;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.brain_skills TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.session_archives TO service_role;

CREATE OR REPLACE FUNCTION upsert_brain_skill(
  p_title text,
  p_summary text,
  p_sop_steps jsonb DEFAULT '[]'::jsonb,
  p_tags text[] DEFAULT '{}'::text[],
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_source_session_key text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_id uuid;
BEGIN
  SELECT id INTO v_id
  FROM brain_skills
  WHERE lower(title) = lower(p_title)
  LIMIT 1;

  IF v_id IS NULL THEN
    INSERT INTO brain_skills (
      title,
      summary,
      sop_steps,
      tags,
      metadata,
      source_session_key
    )
    VALUES (
      p_title,
      p_summary,
      COALESCE(p_sop_steps, '[]'::jsonb),
      COALESCE(p_tags, '{}'::text[]),
      COALESCE(p_metadata, '{}'::jsonb),
      p_source_session_key
    )
    RETURNING id INTO v_id;
  ELSE
    UPDATE brain_skills
    SET
      summary = p_summary,
      sop_steps = COALESCE(p_sop_steps, brain_skills.sop_steps),
      tags = COALESCE(p_tags, brain_skills.tags),
      metadata = COALESCE(brain_skills.metadata, '{}'::jsonb) || COALESCE(p_metadata, '{}'::jsonb),
      source_session_key = COALESCE(p_source_session_key, brain_skills.source_session_key)
    WHERE id = v_id;
  END IF;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION upsert_session_archive(
  p_session_key text,
  p_summary text,
  p_wins text[] DEFAULT '{}'::text[],
  p_failures text[] DEFAULT '{}'::text[],
  p_next_actions text[] DEFAULT '{}'::text[],
  p_source text DEFAULT 'manual',
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO session_archives (
    session_key,
    summary,
    wins,
    failures,
    next_actions,
    source,
    metadata
  )
  VALUES (
    p_session_key,
    p_summary,
    COALESCE(p_wins, '{}'::text[]),
    COALESCE(p_failures, '{}'::text[]),
    COALESCE(p_next_actions, '{}'::text[]),
    COALESCE(p_source, 'manual'),
    COALESCE(p_metadata, '{}'::jsonb)
  )
  ON CONFLICT (session_key) DO UPDATE SET
    summary = EXCLUDED.summary,
    wins = EXCLUDED.wins,
    failures = EXCLUDED.failures,
    next_actions = EXCLUDED.next_actions,
    source = EXCLUDED.source,
    metadata = COALESCE(session_archives.metadata, '{}'::jsonb) || COALESCE(EXCLUDED.metadata, '{}'::jsonb)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION match_brain_skills(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 10,
  tag_filter text[] DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  summary text,
  sop_steps jsonb,
  tags text[],
  metadata jsonb,
  source_session_key text,
  similarity float,
  created_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.title,
    s.summary,
    s.sop_steps,
    s.tags,
    s.metadata,
    s.source_session_key,
    1 - (s.embedding <=> query_embedding) AS similarity,
    s.created_at
  FROM brain_skills s
  WHERE s.embedding IS NOT NULL
    AND 1 - (s.embedding <=> query_embedding) > match_threshold
    AND (
      tag_filter IS NULL
      OR cardinality(tag_filter) = 0
      OR s.tags && tag_filter
    )
  ORDER BY s.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;