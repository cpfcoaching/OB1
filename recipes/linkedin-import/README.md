# LinkedIn Data Import

> Ingest your professional history, core expertise descriptions, and received endorsements from your LinkedIn Data Export into Open Brain as distilled searchable thoughts.

## What It Does

LinkedIn profile data contains two extremely high-value knowledge sets:

1. **`Positions.csv`**: Deep text describing your specific capabilities, strategic logic, and historical career results.
2. **`Recommendations_Received.csv`**: Highly polished peer-validations describing your strengths, superpowers, and reputation markers.

This recipe scans your LinkedIn data folder, isolates these two sources, runs them through a tailored LLM distillation prompt (focusing on actionable capability statements), and inserts the results with 1536D vector embeddings directly into your Supabase `thoughts` table.

## Prerequisites

- Working Open Brain setup
- Extract of your LinkedIn Data (Basic archive is sufficient)
- Environment variables:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENROUTER_API_KEY`

## Installation & Setup

Navigate to the recipe directory:

```bash
cd OB1/recipes/linkedin-import
```

Ensure credentials are exported in your current terminal:

```bash
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-key-here
export OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

## Usage

### 1. Do a Dry Run first

Processes records, calls the LLM for summaries, and prints the results, but skips saving to the database. Great for quality control.

```bash
node import-linkedin-data.mjs "/path/to/extracted/LinkedInExportFolder" --dry-run --limit 3
```

### 2. Run Full Import

Omitting `--dry-run` will calculate embeddings and load everything into the DB.

```bash
node import-linkedin-data.mjs "/path/to/extracted/LinkedInExportFolder"
```

## Advanced Options

| Flag | Description |
| --- | --- |
| `--dry-run` | Parse & summarize only; do not write to Supabase. |
| `--limit N` | Only process the first N records. |
| `--skip-positions` | Do not parse `Positions.csv` |
| `--skip-recommendations` | Do not parse `Recommendations_Received.csv` |
| `--verbose` | Print detailed thought extraction logic to the terminal. |

## Deduplication

The importer saves `linkedin-import-sync-log.json` which tracks the hash of every ingested record. You can safely run the importer again on the same folder — it will automatically skip any row it has already loaded previously.
