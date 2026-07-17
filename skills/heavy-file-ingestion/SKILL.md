---
name: heavy-file-ingestion
description: Use when a user provides or asks to analyze a heavyweight or binary file such as PDF, PPTX, DOCX, XLSX, CSV, TSV, long text, or a document dump. First convert the source into lightweight Markdown or CSV artifacts under the OpenBrain Intake _ingested folder, generate an index, and analyze only the converted artifacts, never the original heavy file directly.
---

# Heavy File Ingestion

## Core Rule

Convert first, index second, analyze last. Do not read or reason from the original heavy file directly when a deterministic conversion path exists. Read `index.md` first, then only the relevant Markdown, CSV, or chunk artifacts.

Default artifact root:

`/Volumes/Crucial X9 Pro For Mac/Library/OpenBrain/Intake/_ingested/`

The converter creates a per-source folder named from the source stem plus a short path hash. Use `--output-dir` only when the user explicitly asks for another destination.

## Trigger Conditions

Use this skill when any request touches:

- A PDF, slide deck, spreadsheet, CSV or TSV dump, DOCX, long Markdown or text document, or other binary-heavy file.
- A folder of such files.
- Analysis, summarization, extraction, comparison, QA, or reporting based on one of those files.
- A file large enough that loading it raw would waste context or risk missed structure.

## Standard Workflow

1. Identify the source path, extension, size, and whether it is one file or a batch.
2. Convert with the bundled script before analysis:

```bash
python /Users/MacAttack/.agents/skills/heavy-file-ingestion/scripts/convert_heavy_file.py /absolute/path/to/source.ext
```

3. If dependencies are missing, install them for the run with `uv`:

```bash
uv run \
  --with pdfplumber \
  --with python-docx \
  --with python-pptx \
  --with openpyxl \
  python /Users/MacAttack/.agents/skills/heavy-file-ingestion/scripts/convert_heavy_file.py /absolute/path/to/source.ext
```

4. Read the generated `index.md` first.
5. Read only the converted artifacts listed in the index. Use chunk files for very large outputs.
6. Base the answer, extraction, or analysis on the converted artifacts. Cite the artifact folder and any quality flags.

## File Type Recipes

- PDF: Use native `pdfplumber` page extraction by default. If the index flags `scanned_pdf_suspected`, `low_text_density`, or `low_text_output`, retry with MarkItDown or a stronger OCR/layout tool. Do not feed the PDF itself into the model until deterministic extraction has failed and the user approves escalation.
- PPTX: Use `python-pptx` to extract slide titles, text blocks, and speaker notes into `presentation.md`.
- DOCX: Use MarkItDown when available, otherwise use `python-docx` to extract headings, paragraphs, and table previews into `document.md`.
- XLSX: Use `openpyxl` to create one CSV per sheet plus `workbook.md` with sheet names, row counts, headers, and previews.
- CSV or TSV: Normalize to `table.csv` and create `table.md` with row, column, header, and preview details.
- Long TXT or MD: Copy into a Markdown working artifact and chunk it if needed.

## Index Requirements

Every conversion must leave:

- `index.md`: human-readable map of source path, type, size, converter, recommended next step, quality flags, artifact list, one-line artifact summaries, stats, and preview lines.
- `index.json`: machine-readable copy of the same metadata.
- Converted artifacts such as `document.md`, `presentation.md`, `workbook.md`, per-sheet CSVs, `table.csv`, or `chunks/`.

If no trustworthy text is extracted, the index must say so through quality flags instead of pretending the extraction succeeded.

## Chunking Guidance

Keep artifacts comfortably readable:

- Markdown and text artifacts over about 40,000 characters should also produce `chunks/<artifact-stem>/NNN.md`.
- CSV artifacts over about 5,000 data rows should also produce `chunks/<artifact-stem>/NNN.csv`.
- Analyze the smallest relevant chunk or CSV sheet first, then expand only when the index shows the answer needs more coverage.
- For very large batch jobs, convert every file first, then make a top-level summary from the generated indexes.

## Fallbacks

If the bundled script cannot convert a file:

1. Read `index.md` and record the exact warning or quality flag.
2. Install the missing dependency with `uv run --with ...` or `pip install ...` only when needed for the requested file type.
3. Try MarkItDown for mixed office documents:

```bash
uvx --from 'markitdown[pdf,docx,pptx,xlsx]' markitdown /absolute/path/to/source.ext
```

4. Use Docling or OCR only after the deterministic first pass proves the cheaper path is insufficient.
5. Ask before using paid services, public uploads, or anything that changes customer-facing systems.

## Completion Check

Before answering the user's substantive question, verify:

- The artifact folder exists under the Intake root or the user-approved override.
- `index.md` and `index.json` exist.
- The answer uses converted artifacts, not the original heavy file.
- Any weak extraction, missing dependency, skipped file, or unsupported type is surfaced clearly.
