# Skill Library Flywheel

> Preserve useful discoveries as skills, testing runbooks, memory, and operating-map updates.

Source inspiration: https://unlock-ai.natebjones.com/open-skills/runbooks

## What It Does

This runbook is a posture for compounding a skill library. It evaluates substantial sessions for reusable patterns, drafts skill updates when the bar is met, records testing discoveries in the repo where they belong, and keeps the operating map current.

## Skill Chain

```text
Session-to-Skill Extractor -> Testing Runbook Creator -> Page Testing Memory -> Session Operating Map
```

Local equivalents:

- `session-to-skill-extractor`
- repo-local testing runbook workflow
- page testing memory workflow when available
- `session-operating-map`

## Guided Prompt

```text
Use the Skill Library Flywheel runbook.

Session:
- Work completed: <summary>
- Repo path: <absolute path>
- Artifacts created: <paths>
- Tests or checks run: <commands>
- Corrections or discoveries: <list>

Workflow:
1. Evaluate whether any pattern is recurring, non-obvious, and codifiable.
2. Check the existing skill library before proposing a new skill.
3. If an existing skill covers most of the pattern, draft an update instead.
4. If the lesson is repo-specific, write it into a repo-local runbook or operating map.
5. If testing knowledge was discovered, add it to the appropriate testing runbook.
6. Move completed lanes to Done Lanes in the operating map.

Definition of done:
- The extraction decision is explicit.
- No duplicate skill is created.
- Any draft lands in a review area.
- Repo-local lessons stay in repo-local docs.
```

## Prerequisites

- Existing skill library access
- Repo-local operating map when working in a coordinated repo
- Test or verification evidence from the session

## Steps

1. Summarize the completed session.
2. List candidate reusable patterns.
3. Apply the high extraction bar.
4. Search existing skills for overlap.
5. Draft a skill or update only when justified.
6. Promote repo-specific lessons to local docs.
7. Update the operating map.

## Expected Outcome

Useful discoveries are preserved in the right layer: reusable skills for general procedure, repo-local runbooks for project specifics, and the operating map for coordination state.

## Troubleshooting

**Issue: Everything feels worth saving**
Solution: Apply the recurring, non-obvious, and codifiable bar strictly.

**Issue: The pattern is mostly covered by an existing skill**
Solution: Draft an update instead of creating a new skill.

**Issue: The lesson contains project secrets or client specifics**
Solution: Sanitize the skill draft and keep specifics in repo-local docs.
