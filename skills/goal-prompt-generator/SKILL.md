---
name: goal-prompt-generator
description: Turn an implementation plan, task description, issue, or scoped work request into a self-contained autonomous goal prompt for another agent session. Use when the user asks to package work for another session, write a goal prompt, hand off a task, prepare a task for autonomous execution, make a bounded objective, or convert a plan into verifiable instructions.
---

# Goal Prompt Generator

## Purpose

Create bounded goal prompts that a fresh agent session can execute without prior conversation context and that the user can verify without reconstructing the plan.

## Required Inputs

Before drafting, gather or infer:

- Target repo or workspace absolute path.
- Objective and business reason.
- Files or areas that may be modified.
- Files or areas that must not be touched.
- Verification commands and expected results.
- Any required external systems, credentials, tools, or known blockers.
- Whether the receiver should implement, investigate, review, or only plan.

If any required input cannot be inferred safely, ask for it before drafting.

## Goal Prompt Structure

Every goal prompt must use this structure exactly:

```markdown
<goal_prompt>
  <objective>
    One paragraph stating the concrete outcome, the workspace or repo path, and any required background the receiving session needs.
  </objective>

  <definition_of_done>
    - [ ] Verifiable statement 1.
    - [ ] Verifiable statement 2.
    - [ ] Verifiable statement 3.
  </definition_of_done>

  <repo_constraints>
    <may_modify>
      - /absolute/path/or/glob
    </may_modify>
    <must_not_touch>
      - /absolute/path/or/glob
    </must_not_touch>
    <style_and_contracts>
      - Existing conventions, writing rules, API contracts, queue formats, or product constraints.
    </style_and_contracts>
  </repo_constraints>

  <verification_gates>
    - command: `exact command`
      cwd: `/absolute/path`
      expected: Exact expected result, status, row count, file existence, test count, HTTP code, or explicit acceptable blocker.
  </verification_gates>

  <stop_conditions>
    - Halt and ask if this happens.
    - Halt and ask if required credentials or live access are missing.
    - Halt and ask before modifying anything outside allowed paths.
  </stop_conditions>

  <reporting_requirements>
    - Report changed files, commands run, results, skipped checks, blockers, and final artifact paths or URLs.
    - Separate completed, partial, and blocked work.
  </reporting_requirements>
</goal_prompt>
```

## Definition Of Done Rules

Write `definition_of_done` as a checklist of observable facts, not intentions.

Good:

- The generated file exists at `/absolute/path/output.json`.
- `npm test` exits `0`.
- The live URL returns HTTP `200` and contains `noindex`.

Bad:

- The implementation is good.
- The agent considered edge cases.
- Tests were probably run.

## Repo Constraints Rules

Always include both allowed and forbidden areas.

If the user did not specify constraints, infer conservative defaults:

- May modify only the files required for the stated task.
- Must not touch secrets, generated dependency folders, unrelated docs, unrelated tests, global config, or live production data.

Use exact absolute paths when the workspace is known.

## Verification Gates Rules

Give commands the receiving agent can actually run.

Each gate must include:

- Command.
- Working directory.
- Expected result.
- What counts as an acceptable blocker, if any.

Prefer deterministic checks over model judgment:

- Tests.
- Linters.
- Build commands.
- File existence checks.
- JSON parsing.
- HTTP status checks.
- Tool output with exact IDs or counts.

## Stop Conditions

Stop conditions must be concrete. Include at least these unless irrelevant:

- Required file, repo, or issue is missing.
- The work would require editing outside allowed paths.
- A command fails in a way that changes the plan.
- Live credentials or authenticated access are unavailable.
- Existing user changes conflict with the task.
- The agent cannot verify completion with the required gates.

## Self-Containment Rule

Assume the receiving session has none of the current conversation. Include all needed background, exact paths, issue IDs, URLs, commands, expected outputs, and constraints. Do not write "as discussed" or "same as above."

## Quality Check

Before delivering, answer this silently and revise until the answer is yes:

"Could a competent agent with zero context execute this, and could I verify the result without re-deriving the plan?"

If the answer is no, add missing paths, constraints, expected results, or stop conditions.
