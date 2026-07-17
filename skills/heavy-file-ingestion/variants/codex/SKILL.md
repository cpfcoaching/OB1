---
name: heavy-file-ingestion-codex
description: Use in Codex when a user provides or asks to analyze a heavyweight or binary file such as PDF, PPTX, DOCX, XLSX, CSV, TSV, long text, or a document dump. Convert first into Markdown or CSV under the OpenBrain Intake _ingested folder, generate an index, then analyze only the converted artifacts.
---

# Heavy File Ingestion For Codex

## Policy

Do not inspect raw PDFs, decks, workbooks, or long document dumps directly when a deterministic conversion path exists. Convert first, read `index.md`, then analyze only the generated Markdown, CSV, or chunk artifacts.

Default artifact root:

`/Volumes/Crucial X9 Pro For Mac/Library/OpenBrain/Intake/_ingested/`

## Command

```bash
python /Users/MacAttack/.agents/skills/heavy-file-ingestion/scripts/convert_heavy_file.py /absolute/path/to/file.ext
```

If dependencies are missing, run:

```bash
uv run \
  --with pdfplumber \
  --with python-docx \
  --with python-pptx \
  --with openpyxl \
  python /Users/MacAttack/.agents/skills/heavy-file-ingestion/scripts/convert_heavy_file.py /absolute/path/to/file.ext
```

## Read Order

1. Read the generated `index.md`.
2. Read only artifacts named in the index.
3. For XLSX, prefer per-sheet CSVs and `workbook.md`.
4. For PPTX, prefer `presentation.md`.
5. For PDF or DOCX, prefer `document.md`, then chunks if present.
6. Surface any quality flags before making claims from weak extraction.
