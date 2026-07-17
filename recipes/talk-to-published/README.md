# Talk to Published

> Turn a voice memo or rough spoken idea into a published page.

Source inspiration: https://unlock-ai.natebjones.com/open-skills/runbooks

## What It Does

This runbook chains small skills into a production workflow: transcription, idea processing, voice-aware drafting, HTML artifact creation, and site publishing. The goal is to move from raw spoken input to a shareable URL without losing editorial judgment.

## Skill Chain

```text
Media Transcription -> Brain Dump Processor -> Personal Voice -> HTML Artifacts -> Site Publisher
```

Local equivalents:

- `gemini-multimodal-transcription-tips` or a media transcription skill when available
- `panning-for-gold` or brain dump processing workflow
- brand or voice skill when available
- `html-artifacts`
- `site-publisher`

## Guided Prompt

```text
Use the Talk to Published runbook.

Input:
- Source audio or transcript: <path or link>
- Target audience: <who should read it>
- Publishing destination: <site, route, or repo>
- Desired outcome: <essay, note, guide, landing page, other>
- Public or unlisted: <public or noindex>

Workflow:
1. Transcribe or read the transcript.
2. Extract and rank the ideas.
3. Ask me which idea to publish if more than one is viable.
4. Draft in my voice without adding claims that are not supported by the source.
5. Render the piece as a self-contained artifact or site page.
6. Verify locally, then publish only if I explicitly ask you to publish.

Definition of done:
- The source idea is traceable to the transcript or notes.
- The final draft is ready for review or published at a URL I can open.
- Any skipped step or blocker is stated plainly.
```

## Prerequisites

- Audio, transcript, or rough notes
- Conversion or transcription tool available
- Publishing destination identified before live publishing
- `html-artifacts` and `site-publisher` installed when using HTML and publishing steps

## Steps

1. Ingest the source audio or transcript.
2. Extract candidate ideas and rank them by usefulness, clarity, and publishability.
3. Confirm the one idea to publish if there is more than one good candidate.
4. Draft the piece in the intended voice and format.
5. Render the draft into an HTML artifact or site page.
6. Verify the output visually and technically.
7. Publish only after explicit confirmation when live deployment is involved.

## Expected Outcome

A spoken idea becomes a polished draft, artifact, or published page with a clear source trail and a verified output.

## Troubleshooting

**Issue: The transcript is weak**
Solution: Re-run transcription or ask for a cleaner source before drafting.

**Issue: Too many ideas are present**
Solution: Rank ideas and ask the user to choose one before drafting.

**Issue: Publishing destination is unclear**
Solution: Stop at a local artifact and ask for the destination.
