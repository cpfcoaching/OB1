# Release Day

> Publish an accurate, timely briefing when something important ships in your field.

Source inspiration: https://unlock-ai.natebjones.com/open-skills/runbooks

## What It Does

This runbook turns a current release, announcement, or market event into a same-day briefing with source checks, branded visuals, publishing, and stakeholder notification.

## Skill Chain

```text
Current Information Search -> Release Briefing -> Branded Image Prompting -> Image Gateway -> Site Publisher -> Stakeholder Update Email
```

Local equivalents:

- Web search with primary sources
- `release-briefing` when available
- `branded-image-prompting`
- `image-gateway`
- `site-publisher`
- `stakeholder-update-email`

## Guided Prompt

```text
Use the Release Day runbook.

Release or event:
- Topic: <what shipped or changed>
- Primary sources to check: <URLs if known>
- Audience: <who needs the briefing>
- Deadline: <time or date>
- Publish destination: <site or artifact only>

Workflow:
1. Verify the release from current primary sources.
2. Capture exact dates, source URLs, and what changed.
3. Draft a concise briefing in my standard format.
4. Create or prompt for an on-brand visual only after facts are verified.
5. Publish only if I explicitly ask to publish.
6. Draft a stakeholder update after the page or artifact is verified.

Definition of done:
- Claims are tied to current sources.
- Dates are explicit.
- The briefing is published or ready to publish.
- The update email is drafted, not sent, unless I explicitly confirm sending.
```

## Prerequisites

- Network access for current source verification
- Known audience and deadline
- Brand guidance for visuals
- Publishing destination if live publication is required

## Steps

1. Gather current primary sources.
2. Extract what changed, who is affected, and why it matters.
3. Draft the briefing with clear dates and source links.
4. Generate or draft the visual prompt.
5. Build the artifact or page.
6. Verify the output.
7. Draft a stakeholder update.

## Expected Outcome

An accurate briefing is ready or live the same day, with source-backed claims and a stakeholder update draft.

## Troubleshooting

**Issue: Sources conflict**
Solution: Preserve the conflict and stop before publishing.

**Issue: No primary source is available**
Solution: Draft an internal watch note, not a public briefing.

**Issue: Visual generation drifts off brand**
Solution: Use the corrective prompt recipes from the branded image workflow.
