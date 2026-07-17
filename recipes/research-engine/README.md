# Research Engine

> Turn messy research inputs into a traceable, stress-tested report or reading pack.

Source inspiration: https://unlock-ai.natebjones.com/open-skills/runbooks

## What It Does

This runbook coordinates heavy-file ingestion, current search, assumption checking, meeting synthesis, artifact creation, and reading-pack assembly. It is built for research where chain of custody matters.

## Skill Chain

```text
Heavy File Ingestion -> Current Information Search -> Assumption Checker -> Meeting Synthesis -> HTML Artifacts -> Reading Pack Builder
```

Local equivalents:

- `heavy-file-ingestion`
- web search with current primary sources
- assumption-checking workflow when available
- `meeting-synthesis`
- `html-artifacts`
- reading-pack workflow when available

## Guided Prompt

```text
Use the Research Engine runbook.

Research question:
- Question or claim: <question>
- Source folder or files: <paths>
- Meetings or notes: <paths>
- Required freshness: <current as of date or not needed>
- Output format: <report, dashboard, reading pack, memo>

Workflow:
1. Convert heavy files into lightweight artifacts before analysis.
2. Build an index of converted artifacts.
3. Search current primary sources for gaps or freshness-sensitive facts.
4. Check assumptions adversarially.
5. Synthesize meeting or note inputs separately from source documents.
6. Build the report or reading pack with source traceability.

Definition of done:
- Heavy files were not analyzed directly when conversion was possible.
- Claims trace to artifacts or current sources.
- Assumptions and weak points are named.
- Output is ready as a report, artifact, or reading pack.
```

## Prerequisites

- Source files, folders, or meeting notes
- Ingestion tools for PDFs, docs, slides, sheets, or CSVs
- Network access if current information is required

## Steps

1. Ingest and index source files.
2. Identify the research question and decision use.
3. Search current sources if the topic is time-sensitive.
4. Run assumption checking.
5. Synthesize findings.
6. Render the report or reading pack.
7. List source limitations and unresolved questions.

## Expected Outcome

A traceable research output where every important claim is linked to an artifact, source, or explicitly marked assumption.

## Troubleshooting

**Issue: A source cannot be converted**
Solution: Mark it in the index and ask before using direct file analysis.

**Issue: Current sources conflict**
Solution: Preserve the conflict and avoid averaging the claims.

**Issue: The research question is too broad**
Solution: narrow to the decision the output must support.
