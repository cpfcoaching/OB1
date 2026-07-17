# AGENTS.md (master-agent-orchestrator)

Any agent operating in this directory (including the Codex CLI, which loads the
nearest AGENTS.md) must follow `OPERATING_AGREEMENT.md` in this folder.

Summary of the binding rules:

- Run only builds the human approved. Approved by the human and deemed safe under this
  agreement means authorized for execution with monitoring; in-scope work proceeds
  without further interaction.
- Stay inside the PermissionPolicy (default allows only `python task.py`). Do not
  widen it or run side-effecting commands on your own; that is a human-review
  escalation.
- Never move money, place orders, or take unreviewed side-effecting actions to
  finish a build.
- If a safety concern cannot be mitigated within scope and policy, stop, leave the
  request incomplete, and return it for human review with specifics.
- Keep API keys in the worker command environment only.

Enforcement is partly automatic via `master_agent.py` (PermissionPolicy for generated
task execution) and `contracts/capability-registry.json` (declared tool surface and
side-effect profiles). Human approval, provider-wrapper setup, and manual agent actions
remain governed by this agreement and require review discipline. Read
`OPERATING_AGREEMENT.md` for the full text.
