---
name: self-pr-merge
description: Review and merge pull requests authored by the user or current agent with real review discipline despite GitHub self-approval limits. Use when the user asks to merge their own PR, review and merge a PR they wrote, self-merge a branch, land a self-authored PR, or close out a PR authored by this agent.
---

# Self PR Merge

## Purpose

Review self-authored pull requests with fresh eyes before merging. GitHub may not allow self-approval, so this skill requires an honest review pass, pre-merge checks, and an explicit stop on unresolved findings or failed checks.

## Defaults

- Merge strategy: `merge`.
- Remote branch cleanup: keep the remote branch for 15 days by default. Do not delete it immediately unless the user explicitly overrides this for that PR.
- Preferred CLI: `gh`.
- Auth preflight: `gh auth status` must show an authenticated account with repo access.

## Trigger Conditions

Use this skill when the user asks to:

- Merge a PR they authored.
- Review and merge a PR written by this agent.
- Land a self-authored branch.
- Close out a PR when GitHub self-approval is unavailable.
- Perform a disciplined merge without asking another reviewer.

Do not use this skill to bypass required branch protections, missing approvals, or failed CI.

## Inputs To Confirm

Before acting, identify:

- PR number or URL.
- Repository path.
- Intended base branch.
- Whether the PR is self-authored.
- Any user override for merge strategy or branch retention.

If no override is given, use the defaults above.

## Review Pass First

Review before merging. Do not check CI and merge first.

Required review steps:

```bash
gh pr view <pr> --json number,title,author,headRefName,baseRefName,isDraft,mergeStateStatus,reviewDecision,url
gh pr diff <pr> --patch
gh pr diff <pr> --name-only
```

Read the full diff with fresh eyes and inspect touched files locally when useful. Look specifically for:

- Bugs or behavioral regressions.
- Debug leftovers, test-only hacks, TODOs, or accidental logs.
- Missing or weak tests.
- Scope creep beyond the PR objective.
- Secrets or credentials.
- Generated files or dependency churn that should not be included.
- Risky deletes, migrations, or worktree-sensitive changes.

Report findings to the user before any merge attempt.

Finding nothing must be a stated conclusion based on the review, not a default. Say what was reviewed and why no blockers were found.

## Stop On Findings

Stop and come back to the user when:

- Any review finding is unresolved.
- The PR objective or ownership is unclear.
- The diff contains unexpected scope.
- Secrets or destructive changes appear.
- Tests are missing and the risk is not explicitly accepted by the user.

Do not merge while a substantive finding remains open.

## Pre-Merge Checks

Run these after the review pass and before merge:

```bash
gh pr checks <pr>
gh pr view <pr> --json mergeable,mergeStateStatus,reviewDecision,isDraft,headRefName,baseRefName,url
git status --short
git worktree list
```

Confirm:

- CI checks pass or there are no required checks.
- PR is mergeable.
- No conflicts are present.
- PR is not draft.
- Local dirty state does not affect the merge.
- Branch protection does not require an approval that is unavailable.

State the self-approval limitation honestly. Example:

```text
GitHub does not allow me to approve my own PR. I completed a fresh review pass, but this is not a GitHub approval.
```

Do not fabricate an approval, dismiss required reviews, or use admin bypass unless the user explicitly instructs that and the repo policy allows it.

## Merge Procedure

Use the selected strategy:

- `merge`: `gh pr merge <pr> --merge`
- `squash`: `gh pr merge <pr> --squash`
- `rebase`: `gh pr merge <pr> --rebase`

Because the default branch cleanup is retention for 15 days, do not pass `--delete-branch` by default.

After merge:

```bash
gh pr view <pr> --json state,mergedAt,mergedBy,url,headRefName
```

Report merge state, URL, merged time, and who merged it.

## Branch Cleanup

Default cleanup preference:

- Keep the remote branch for 15 days.
- Record the branch name and retention date in the final report.
- Delete the remote branch only if the user explicitly overrides this default.

If deletion is requested:

```bash
git ls-remote --heads origin <branch>
git push origin --delete <branch>
```

Local cleanup must be worktree-safe:

```bash
git worktree list
```

If the branch is checked out in any worktree, do not run plain `git branch -d` or `git branch -D`. Instead:

- Report the owning worktree path.
- Ask whether to remove that worktree.
- Use `git worktree remove <path>` only after confirmation.
- Then prune if appropriate with `git worktree prune`.

If no worktree owns the branch, local deletion may use:

```bash
git branch -d <branch>
```

Do not force delete local branches unless the user explicitly approves it after seeing the risk.

## Final Report

Include:

- PR title and URL.
- Review findings or explicit no-findings conclusion.
- CI and mergeability result.
- Self-approval limitation note.
- Merge strategy used.
- Merge result.
- Remote branch retention or deletion action.
- Local worktree cleanup status.
- Any skipped checks or unresolved risks.

## Hard Stop Rules

Do not merge when:

- CI fails, is pending, or cannot be checked unless the user explicitly accepts that risk after disclosure.
- PR has conflicts or is not mergeable.
- PR is draft.
- Required review or branch protection blocks merge.
- Review finds unresolved issues.
- The PR appears not to be authored by the user or current agent and the user has not confirmed ownership.
- The merge would require deleting or modifying a worktree without explicit confirmation.
