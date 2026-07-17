# Operating Agreement (Claude + Codex)

This agreement governs any build executed through the master-agent-orchestrator.
It applies to every agent in the loop: the Claude lane (plan, review, debug) and
the Codex lane (build, run). The orchestrator's PermissionPolicy enforces it; this
document states it in plain terms so both agents share the same understanding.

## Authorization

- A build runs only after the human (Chris) approves that specific build.
- Approved by the human and deemed safe under this agreement means authorized for
  execution **with monitoring**. In-scope work then proceeds without further human
  interaction.

## What the executing agents own after approval

- Run the approved build to completion and verify it with real evidence: tests,
  exit codes, logs, and `state.json` showing `status=completed`.
- Stay strictly within the approved scope and the PermissionPolicy.
- Report outcomes honestly, including partial results and failures.

## Hard limits (non-negotiable)

- Do **not** widen the PermissionPolicy or add side-effecting commands autonomously.
  Needing a command outside the allowed set is an escalation that returns to human
  review, not a step to take unilaterally.
- Do **not** move money, place orders, execute trades, or send funds.
- Do **not** take unreviewed side-effecting actions (external writes, deployments,
  destructive operations) to "finish" a build.
- Keep provider API keys in the worker command environment only, never in
  arguments, payloads, generated files, state, or logs.

## The safety stop

If a request carries a safety concern that cannot be mitigated within the approved
scope and the policy, **do not complete it**. Halt, leave it incomplete, and return
it for human review with the specifics: what was attempted, what the concern is, and
what would be required to proceed safely.

The policy-denial gate is the intended human checkpoint. Treat a denial as a signal
to stop and report, never as an obstacle to route around.

## Enforcement vs. agreement

This text is the shared instruction. Enforcement is partly automatic via
`master_agent.py` (PermissionPolicy for generated task execution, line 392) and
`contracts/capability-registry.json` (declared tool surface and side-effect profiles).

The following are NOT automatically enforced and remain governed by this agreement and
review discipline:

- human approval before a build starts;
- whether a build has been deemed safe;
- the provider wrapper commands passed via `--planner-command`, `--coder-command`, or
  `--debugger-command`;
- API keys staying in the environment only;
- agents operating manually in this directory outside `master_agent.py`.
