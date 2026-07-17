---
name: session-operating-map
description: Set up and maintain a repo-local operating map for projects with parallel agent sessions. Use when the user starts parallel workstreams, asks what is in flight, asks to coordinate a repo, asks which lane owns work, asks for blockers or decisions across sessions, or requests a repo operating map.
---

# Session Operating Map

## Purpose

Create and maintain a single repo-local map that shows which agent lane owns each concern, what state each lane is in, current blockers, and decisions that affect other sessions.

## Read-First Rule

Before starting work in a coordinated repo:

- Read `docs/operating-map.md` if it exists.
- If it does not exist and coordination is needed, create it before starting the work.
- Treat the map as the current coordination source. If it conflicts with live files, inspect live state and update the map with the conflict instead of guessing.

## Map Location

Default path:

```text
docs/operating-map.md
```

Use a different path only when the repo already has an established coordination doc. Keep exactly one active map per repo.

## Map Structure

Use this structure:

```markdown
# Operating Map

Last updated: YYYY-MM-DD HH:MM TZ

## Read First

- Read this file before starting work in this repo.
- Update only when lane state meaningfully changes.
- Do not use this as a journal.

## Active Lanes

| Lane | Objective | Owning Session | State | Blockers | Last Meaningful Update |
| --- | --- | --- | --- | --- | --- |
| lane-name | One clear outcome. | session id, agent name, or owner | planned, active, blocked, handoff, review | none or exact blocker | YYYY-MM-DD brief state change |

## Decisions

| Date | Decision | Applies To | Source |
| --- | --- | --- | --- |
| YYYY-MM-DD | Concrete decision. | lane or repo area | issue, file, user instruction, or session |

## Done Lanes

| Lane | Outcome | Completed | Follow-up |
| --- | --- | --- | --- |
| lane-name | One-line outcome. | YYYY-MM-DD | none or exact next step |

## Durable Lessons To Promote

- Lesson worth moving into docs, AGENTS.md, or a skill.
```

## Lane Discipline

Use one lane per concern. A lane should be narrow enough that ownership is clear and broad enough to avoid bookkeeping for every tiny file edit.

Good lane names:

- `skill-visible-delegation`
- `skill-session-operating-map`
- `ob1-skill-mirror`
- `master-agent-orchestrator`
- `workspace-dirty-baseline`

Bad lane names:

- `misc`
- `stuff`
- `fixes`
- `agent1`

Each active lane must include:

- Short lane name.
- Objective.
- Owning session, agent, or person.
- Current state.
- Blockers.
- Last meaningful update.

## State Values

Use these states unless the repo has its own vocabulary:

- `planned`: agreed work that has not started.
- `active`: work is currently in progress.
- `blocked`: work cannot proceed without a specific input or external change.
- `handoff`: ownership is changing or another session must pick up from a specific point.
- `review`: work claims completion and needs verification.

Move finished work to `Done Lanes`; do not leave it in `Active Lanes`.

## Update Rules

Update a lane only when state meaningfully changes:

- Start.
- Block.
- Handoff.
- Review.
- Done.
- Scope or owner changes.
- A decision affects other lanes.

Do not log every command, thought, or minor edit. The map is a coordination surface, not a journal.

When updating:

- Read the current map first.
- Preserve other lanes.
- Update only the affected lane, decision, or done entry.
- Use exact blockers and exact paths when relevant.
- Include enough context that a fresh session can avoid duplicating or colliding with work.

## Archive Rules

When a lane is done:

- Remove it from `Active Lanes`.
- Add it to `Done Lanes` with a one-line outcome.
- Keep follow-up short and concrete.
- Promote durable lessons into the project docs, `AGENTS.md`, or a skill if they should affect future work.
- Do not bury reusable lessons only in the done-lane row.

## Conflict Handling

If the map and live state disagree:

- Prefer live evidence for current facts.
- Update the map to name the conflict and the inspected source.
- Do not erase another lane's claim unless you can verify it is done, stale, or superseded.
- Ask before taking ownership of a lane that another active session owns.

## Reporting

When reporting map work, include:

- Map path.
- Lanes added, changed, moved to done, or blocked.
- Decisions added.
- Any conflicts between map and live state.
- Any durable lessons promoted or still pending promotion.
