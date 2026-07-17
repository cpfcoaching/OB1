---
name: visible-delegation
description: Delegate scoped work to another agent session while keeping the session visible, supervisable, and recoverable. Use when the user asks to delegate, parallelize, hand work to another agent, run a visible subagent, supervise another agent session, or start a shared terminal agent run.
---

# Visible Delegation

## Purpose

Run delegate agents in named `tmux` sessions so the user and supervising agent can watch the work, intervene when needed, verify completion independently, and close sessions cleanly.

## Trigger Conditions

Use this skill when the user asks to:

- Delegate work to another agent.
- Run work in parallel through another agent session.
- Hand off a task, issue, plan, or goal prompt to a separate agent.
- Start a visible or watchable agent session.
- Supervise a long-running agent task without hiding it in the background.

Do not use hidden background `nohup`, detached shell-only jobs, or unsupervised automation for delegate agent work.

## Preflight

Before launching:

- Confirm `tmux` is installed with `command -v tmux`. Install with the local package manager if missing.
- Confirm the delegate CLI exists with `command -v <cli>`.
- Default to `codex` when available. Supported local CLIs on this machine include:
  - `codex` at `/Applications/Codex.app/Contents/Resources/codex`
  - `claude` at `/Users/MacAttack/.local/bin/claude`
  - `gemini` at `/usr/local/bin/gemini`
- Use `$goal-prompt-generator` when available to package nontrivial delegated work into a self-contained goal prompt.
- Give the session a stable name: `delegate-<short-task>-<YYYYMMDD-HHMM>`.
- Confirm the worktree is appropriate and note any dirty state that could affect the task.

## Goal Prompt

Every delegate needs a bounded prompt. For nontrivial work, first create a goal prompt with:

- Objective in one paragraph.
- Definition of done as verifiable checklist items.
- Paths the delegate may modify.
- Paths the delegate must not touch.
- Verification gates with exact commands and expected results.
- Stop conditions for missing files, failed assumptions, live access gaps, destructive operations, or scope conflicts.
- Reporting requirements.

For tiny smoke tests, an inline prompt is acceptable only if it includes the objective, allowed path, verification command, and stop condition.

## Launch Procedure

1. Create the session:

   ```bash
   tmux new-session -d -s delegate-<name> -c /absolute/workspace
   ```

2. Start the delegate agent in the session. Prefer interactive CLI launch for visible work:

   ```bash
   tmux send-keys -t delegate-<name> 'codex --cd /absolute/workspace' C-m
   ```

3. Paste the goal prompt into the agent:

   ```bash
   tmux load-buffer /absolute/path/to/goal-prompt.md
   tmux paste-buffer -t delegate-<name>
   tmux send-keys -t delegate-<name> C-m
   ```

4. Tell the user how to watch:

   ```bash
   tmux attach -t delegate-<name>
   ```

5. For explicitly noninteractive tests only, launch `codex exec` inside `tmux` so the terminal is still visible:

   ```bash
   tmux new-session -d -s delegate-<name> -c /absolute/workspace \
     'codex --ask-for-approval never exec -C /absolute/workspace -s workspace-write - < /absolute/path/to/goal-prompt.md'
   ```

## Monitoring Rules

Check the session with:

```bash
tmux capture-pane -pt delegate-<name> -S -200
```

Monitoring cadence:

- First check after 30 to 60 seconds.
- Then every 2 to 5 minutes for normal work.
- Check sooner after a tool failure, permission issue, or visible uncertainty.

Intervene when:

- The delegate attempts destructive commands outside the goal, such as deleting unrelated files, resetting the repo, or modifying secrets.
- The delegate edits outside allowed paths.
- The delegate loops on the same failure without a new hypothesis.
- The delegate asks for missing context that the supervisor can supply.
- The delegate claims completion without running required gates.
- The delegate is clearly solving a different task.

Be patient when:

- Tests, installs, builds, or searches are still progressing.
- The delegate is reading relevant files.
- The delegate is revising after a concrete failure.
- The delegate pauses briefly while a command runs.

Intervention methods:

- Send a concise correction with `tmux send-keys -t delegate-<name> '<message>' C-m`.
- Stop the delegate with `C-c` only for scope drift, destructive risk, repeated dead ends, or user request.
- If the session cannot recover, terminate it and report the blocker.

## Results Protocol

When the delegate claims completion:

- Capture the final pane output.
- Inspect changed files yourself.
- Run every verification gate from the goal prompt in the supervisor session.
- Treat missing or skipped gates as incomplete unless the goal prompt allowed that blocker.
- Report success only after supervisor verification passes.
- Separate delegate claims, supervisor verification, blockers, and remaining risks.

Do not tell the user the task succeeded solely because the delegate said it was done.

## Cleanup

Close sessions deliberately:

```bash
tmux kill-session -t delegate-<name>
```

Before closing:

- Save any useful transcript with `tmux capture-pane -pt delegate-<name> -S -1000 > /absolute/path/delegate-<name>.log` when the work is significant.
- Confirm no command is still running that the user expects to keep.
- Report the session name, attach command, final status, verification gates, and cleanup action.

If leaving a session open for the user to inspect, say so explicitly and include the attach command. Do not abandon sessions silently.
