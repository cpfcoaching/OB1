# Delegate and Verify

> Run parallel engineering lanes with visible delegation, acceptance gates, review, merge, and stakeholder closeout.

Source inspiration: https://unlock-ai.natebjones.com/open-skills/runbooks

## What It Does

This runbook lets one operator run multiple agent sessions without losing control. It records lane ownership, packages work into a goal prompt, launches a visible delegate, verifies the result, reviews and merges if appropriate, then drafts the stakeholder update.

## Skill Chain

```text
Session Operating Map -> Goal Prompt Generator -> Visible Delegation -> Self PR Merge -> Stakeholder Update Email
```

Local equivalents:

- `session-operating-map`
- `goal-prompt-generator`
- `visible-delegation`
- `self-pr-merge`
- `stakeholder-update-email`

## Guided Prompt

```text
Use the Delegate and Verify runbook.

Task:
- Repo path: <absolute path>
- Lane name: <short name>
- Objective: <one paragraph>
- Allowed files or areas: <paths>
- Forbidden files or areas: <paths>
- Verification commands: <commands and expected results>
- PR needed: <yes or no>
- Stakeholder to update: <name or email, or none>

Workflow:
1. Read or create the operating map.
2. Claim a lane with objective, owner, state, and blockers.
3. Generate a self-contained goal prompt.
4. Launch the delegate in a visible tmux session.
5. Monitor for drift, blockers, and destructive commands.
6. When the delegate claims completion, run the verification gates yourself.
7. If a PR exists, review it before merge and obey branch cleanup preferences.
8. Draft a stakeholder update only if stakeholder-visible work shipped.

Definition of done:
- Lane state is current.
- Delegate work is verified by the supervisor, not just claimed.
- PR is reviewed and merged only if checks pass.
- Stakeholder update is drafted when relevant.
```

## Prerequisites

- `tmux` installed
- Delegate CLI available
- GitHub CLI authenticated if PR merge is in scope
- Operating map available or created

## Steps

1. Read `docs/operating-map.md`.
2. Create or update the lane.
3. Write the goal prompt.
4. Launch visible delegation.
5. Monitor and intervene when required.
6. Verify outputs.
7. Review and merge PR if appropriate.
8. Draft stakeholder update if visible value shipped.
9. Move the lane to done or blocked.

## Expected Outcome

Parallel work moves forward with explicit ownership, visible execution, verifiable acceptance gates, and no hidden completion claims.

## Troubleshooting

**Issue: The delegate edits outside scope**
Solution: Stop the session, preserve evidence, and report the drift.

**Issue: Verification fails**
Solution: Keep the lane active or blocked. Do not merge or send updates.

**Issue: GitHub blocks self-approval**
Solution: State the limitation plainly and do not bypass branch protection.
