# Video Production Line

> Turn raw talking-head footage into a reviewed edit with graphics and a stakeholder handoff.

Source inspiration: https://unlock-ai.natebjones.com/open-skills/runbooks

## What It Does

This runbook makes video production an explicit pipeline: transcript first, paper edit next, graphics after approval, NLE assembly after the editorial decision is stable, and stakeholder update at the end.

## Skill Chain

```text
Media Transcription -> Radio Edit -> B-Roll Pipeline -> NLE Assistant -> Stakeholder Update Email
```

Local equivalents:

- `gemini-multimodal-transcription-tips` or media transcription workflow
- radio edit workflow when available
- `broll-pipeline` when available
- `nle-assistant`
- `stakeholder-update-email`

## Guided Prompt

```text
Use the Video Production Line runbook.

Inputs:
- Source video: <path>
- Timestamped transcript: <path if already available>
- Target platform: <YouTube, LinkedIn, course, internal>
- Desired length: <duration>
- Review stakeholder: <name or email>

Workflow:
1. Produce or verify the timestamped transcript.
2. Create a paper edit or radio edit before touching the timeline.
3. Ask me to approve the paper edit.
4. Identify moments that need motion graphics after the edit is approved.
5. Build or queue graphics against the shared visual contract.
6. Assemble in the editor only on duplicated timelines.
7. Draft the stakeholder update when the review copy is ready.

Definition of done:
- Transcript exists and is usable.
- Editorial decisions are made before graphics and NLE work.
- Timeline work happens only on a copy.
- Review output and stakeholder draft are ready.
```

## Prerequisites

- Source video file
- Transcription tool or transcript
- Scriptable editor access for NLE work
- Visual contract for motion graphics when using overlays

## Steps

1. Transcribe the video.
2. Produce a paper edit.
3. Get approval for the editorial cut.
4. Build a graphics manifest.
5. Generate graphics in batches.
6. Assemble the timeline in the NLE on a duplicate.
7. Export a review copy and draft the stakeholder update.

## Expected Outcome

A review-ready video edit exists, with editorial decisions made cheaply on paper before timeline and graphics work.

## Troubleshooting

**Issue: Transcript is not timestamped**
Solution: Stop and create a timestamped transcript before editing.

**Issue: The user has not approved the paper edit**
Solution: Do not build graphics or timeline edits yet.

**Issue: NLE automation cannot connect**
Solution: Leave an edit decision list and report the editor access blocker.
