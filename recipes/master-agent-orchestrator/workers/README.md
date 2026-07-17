# Live Provider Worker Shims

Thin bridges that let the orchestrator drive real Claude and Codex/GPT workers
instead of the built-in mock workers. Each shim reads the orchestrator payload
on stdin, wraps it in a role-specific prompt that demands the exact contract
JSON, calls your provider CLI, validates the result, and prints contract JSON on
stdout (see `CommandJsonWorker` in `../master_agent.py`).

## Files

| Shim | Lane | Reads payload | Emits | Provider env var |
| ---- | ---- | ------------- | ----- | ---------------- |
| `claude-plan` | Claude (plan) | `{role,goal}` | `{tasks:[...]}` | `MAO_CLAUDE_CMD` |
| `codex-code` | Codex (build) | `{role,goal,task,memory}` | `{file_name,content,command}` | `MAO_CODEX_CMD` |
| `claude-debug` | Claude (debug) | `{role,goal,task,artifact,result}` | `{feedback}` | `MAO_CLAUDE_CMD` |

`_shim.py` holds the shared helpers (stdin read, provider call, JSON extraction,
contract validation).

## Environment contract

Point each env var at a command that reads a prompt on **stdin** and prints the
model response on **stdout**. Keep API keys in that command's own environment,
never in arguments, payloads, generated files, or logs.

```bash
export MAO_CLAUDE_CMD="claude -p"          # your Claude CLI/wrapper (plan + debug)
export MAO_CODEX_CMD="codex exec -"        # your Codex/GPT CLI/wrapper (build)
# ANTHROPIC_API_KEY / OPENAI_API_KEY live in those tools' environment.
```

The shims tolerate prose and ```json fences in the provider response and extract
the first balanced JSON object. If a required field is missing or the output is
not parseable JSON, the shim exits nonzero with a clear stderr message so the
orchestrator surfaces the failure instead of proceeding on bad data.

## Go-live command

```bash
docker pull python:3.12-slim   # one time, host-side; the docker sandbox isolates generated code

MAO_CLAUDE_CMD="claude -p" MAO_CODEX_CMD="codex exec -" \
python3 master_agent.py "<your goal>" \
  --sandbox docker \
  --planner-command "./workers/claude-plan" \
  --coder-command   "./workers/codex-code" \
  --debugger-command "./workers/claude-debug" \
  --run-root runs/live-1 \
  --openbrain-memory-endpoint "https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/agent-memory-api" \
  --openbrain-memory-key "$OPEN_BRAIN_MCP_ACCESS_KEY" \
  --openbrain-workspace-id "openbrain" \
  --openbrain-project-id "master-agent-orchestrator"
```

## Verify a shim in isolation

```bash
echo '{"role":"planner","goal":"build a tiny feature"}' \
  | MAO_CLAUDE_CMD="claude -p" ./workers/claude-plan
```

Verified on 2026-06-27 with a mock provider: all three shims emit valid contract
JSON, fence extraction works, a missing env var fails with exit 1, and a full
`--planner/--coder/--debugger` loop completes against the local sandbox.
