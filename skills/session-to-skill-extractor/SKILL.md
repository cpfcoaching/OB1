---
name: session-to-skill-extractor
description: Evaluate substantial completed work sessions for reusable skill-worthy patterns and draft a new skill or update proposal only when the pattern is recurring, non-obvious, and codifiable. Use when the user says wrap up, asks anything worth keeping, asks what should become a skill, or at the natural end of a nontrivial session.
---

# Session To Skill Extractor

## Purpose

Decide whether a work session produced a reusable procedural pattern worth preserving as a skill or skill update. Most sessions produce no new skill, and `nothing worth extracting` is a valid outcome.

## High Extraction Bar

Extract only when the pattern is all three:

- `Recurring`: the user will plausibly need it again.
- `Non-obvious`: a fresh session would not naturally derive it from general ability and normal repo reading.
- `Codifiable`: it can be written as a repeatable procedure with triggers, gates, and outputs.

If any one test fails, do not draft a skill. Explain the failure briefly.

## Read Existing Skills First

Before proposing a new skill:

- List local skill folders in the active harness skill library.
- Search skill names and descriptions for the pattern.
- Read any likely existing skill before deciding.
- If an existing skill covers about 80 percent of the pattern, propose an update to that skill instead of a new skill.
- If the pattern is project-specific, propose a repo-local runbook or operating-map update instead of a general skill.

Prefer updating existing skills over adding more skills.

## Evaluation Procedure

1. Identify the session outcome.
2. List candidate reusable patterns from the session.
3. Apply the extraction bar to each candidate.
4. Check existing skills for overlap.
5. Choose one of:
   - `nothing worth extracting`
   - `update existing skill`
   - `draft new skill`
   - `repo-local runbook only`
6. Show the reasoning before drafting.

## Draft Location

Never silently write into the live skill library.

Drafts must land in a review area, for example:

```text
drafts/skills/<skill-name>/SKILL.md
```

If the repo has no `drafts/` convention, use:

```text
docs/skill-drafts/<skill-name>.md
```

Only install or modify a live skill after the user explicitly approves the draft.

## Draft Format

Draft new skills in the standard skill shape:

```markdown
---
name: skill-name
description: What it does and exactly when to use it.
---

# Skill Title

## Purpose

## Trigger Conditions

## Procedure

## Gates And Stop Rules

## Outputs
```

For existing-skill updates, draft:

- Skill to update.
- Why update instead of new skill.
- Proposed changed sections.
- Any new trigger wording.
- Any migration or mirror steps.

## Sanitize Rule

Generalize the reusable pattern:

- Strip client names, project names, private URLs, secrets, account IDs, and temporary incident details.
- Keep project-specific facts in repo-local docs, runbooks, or operating maps.
- Preserve only the procedure that should transfer to future sessions.

## Nothing Worth Extracting

When no pattern meets the bar, answer shortly:

```text
Nothing worth extracting.

Reason: <one to three bullets explaining which bar failed>.
```

Do not pad the answer with weak candidates.

## Reporting

Report:

- Candidate patterns considered.
- Extraction-bar result.
- Existing-skill overlap checked.
- Decision.
- Draft path, if created.
- Any repo-local runbook update recommended instead.
