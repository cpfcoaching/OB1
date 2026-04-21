# Memory Evolution

> Adds reusable skill storage and session archives so your Open Brain can retain proven workflows, not just raw thoughts.

## What It Does

Creates two new tables and three SQL functions:

- `brain_skills` — reusable SOP-style skills with embeddings for semantic retrieval
- `session_archives` — distilled session outcomes (wins, failures, next actions)
- `upsert_brain_skill(...)` — create/update a skill by title
- `upsert_session_archive(...)` — create/update a session archive by session key
- `match_brain_skills(...)` — semantic search over skills

This schema is designed for MCP tools such as `upsert_skill`, `search_skills`, and `archive_session`.

## Prerequisites

- Working Open Brain setup ([guide](../../docs/01-getting-started.md))
- Access to Supabase SQL Editor or Supabase CLI

![Step 1](https://img.shields.io/badge/Step_1-Run_Migration-1E88E5?style=for-the-badge)

1. Open Supabase **SQL Editor**
2. Paste and run `migration.sql` from this folder

<details>
<summary>SQL: Memory evolution migration</summary>

```sql
-- Run the full contents of schemas/memory-evolution/migration.sql
```

</details>

Or via Supabase CLI:

```bash
supabase db push
```

![Step 2](https://img.shields.io/badge/Step_2-Verify-1E88E5?style=for-the-badge)

3. Verify tables exist:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('brain_skills', 'session_archives');
```

4. Verify functions exist:

```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('upsert_brain_skill', 'upsert_session_archive', 'match_brain_skills');
```

✅ **Done when:** Both tables and all three functions exist.

## Expected Outcome

After migration:

- Skills can be persisted independently of raw thoughts
- Session summaries can be archived and later consolidated
- Skills can be retrieved semantically via `match_brain_skills`

## Troubleshooting

**Issue: `relation "brain_skills" already exists`**
- The migration is idempotent and safe to re-run.

**Issue: `function auth.role() does not exist`**
- Ensure this runs on Supabase/Postgres with Supabase auth helpers enabled.

**Issue: `type vector does not exist`**
- Ensure `pgvector` is enabled. The migration includes `CREATE EXTENSION IF NOT EXISTS vector;`.