---
name: agentic-harness-designer
description: Design, evaluate, or debug AI-agent-powered products, tools, automations, and serious workflows as agent systems rather than model-choice problems. Use when the user asks to design an agent, review an agent architecture, evaluate an automation, debug a harness, choose tool contracts, define approval gates, plan durable workflow state, design memory, define evals, add observability, or produce a phased implementation plan for an agent-powered system.
---

# Agentic Harness Designer

## Purpose

Turn agent-product ideas into concrete system designs. Treat tools, permissions, state, memory, evals, and observability as the architecture, not as afterthoughts.

## Trigger Conditions

Use this skill when designing, reviewing, or debugging:

- Agent-powered products.
- AI tools that can act on files, APIs, browsers, editors, calendars, email, code, or production systems.
- Serious automations with decisions, retries, side effects, or user-visible output.
- Multi-session or multi-agent workflows.
- Harnesses, copilots, assistants, runbooks, workflow engines, or agent platforms.

Do not reduce the problem to model selection. Model choice is a detail after the harness contract is clear.

## Design Walk

Work through these sections in order.

### 1. Tools And Contracts

Define exactly what the agent can call:

- Tool name.
- Inputs and schema.
- Outputs and error shape.
- Idempotency behavior.
- Side effects.
- Retry policy.
- Rate limits or budgets.
- Human-readable audit line for each call.

If a tool contract is vague, mark it as a design blocker.

### 2. Permission Model

Classify every action:

- `autonomous`: agent may do it without asking.
- `approval_required`: agent must ask before doing it.
- `forbidden`: agent must not do it.

Include approval reasons, approval UI or channel, timeout behavior, and escalation path.

### 3. Workflow State And Durability

Define what survives:

- Crash.
- Restart.
- Network failure.
- User interruption.
- Agent handoff.
- Partial tool success.

Name the state store, state shape, resume point, and cleanup policy.

### 4. Context And Memory Strategy

Define what the agent knows:

- Static instructions.
- User-provided inputs.
- Retrieved project data.
- Short-term run state.
- Long-term memory.

Also define what it must not accumulate, such as secrets, private client details, stale decisions, raw transcripts, or unbounded logs.

### 5. Evaluation

Define concrete checks, not vibes:

- Unit tests for deterministic components.
- Replay tests for known runs.
- Golden task fixtures.
- Safety and permission tests.
- Regression checks.
- Human review gates where judgment is required.

Every phase needs at least one verification gate.

### 6. Observability

Define what the operator can see:

- Current run state.
- Tool calls and outcomes.
- Pending approvals.
- Cost or token budget when relevant.
- Errors and retries.
- Decision rationale summaries.
- Final receipts and artifacts.

Invisible execution is a design defect.

## Failure-Mode Review

Review against these common killers:

- Missing approval gates.
- Non-durable state.
- Unbounded context growth.
- No evals or only subjective evals.
- Invisible execution.
- Tools with unclear side effects.
- No idempotency or resume design.
- Stale memory treated as truth.
- No operator stop or rollback path.

For each risk, mark:

- `present`
- `mitigated`
- `not applicable`
- `unknown`

Unknowns become phase-one discovery tasks.

## Output Contract

Produce a design doc with these sections:

```markdown
# <System Name> Agentic Harness Design

## Executive Summary

## Assumptions

## Tools And Contracts

## Permission Model

## Workflow State And Durability

## Context And Memory Strategy

## Evaluation Plan

## Observability And Operator UX

## Failure-Mode Review

## Decisions And Rationale

## Phased Implementation Plan
```

Each implementation phase must be independently shippable and testable:

- Phase name.
- Outcome.
- Scope.
- Verification gates.
- Stop conditions.
- What is explicitly deferred.

## Decision Rules

- Prefer the smallest harness that can be operated and verified.
- Add multiple agents only when one agent cannot safely own the workflow.
- Prefer explicit state machines over prompt-only process memory for long runs.
- Prefer narrow tools with typed contracts over broad tools with hidden behavior.
- Treat approvals, evals, and observability as launch requirements, not polish.
- Surface missing information as a design assumption or blocker.

## Final Report

When using this skill, report:

- Design doc path or full design doc.
- Highest-risk failure modes.
- First shippable phase.
- Verification gates.
- Open decisions that need the user.
