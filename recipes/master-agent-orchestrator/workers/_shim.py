"""Shared helpers for master-agent-orchestrator live-provider worker shims.

Each shim is a thin bridge the orchestrator calls with a JSON payload on stdin
(see CommandJsonWorker in master_agent.py). The shim:

  1. reads the orchestrator payload from stdin,
  2. wraps it in a role-specific prompt that demands the exact contract JSON,
  3. runs the provider command named in an environment variable,
  4. extracts and validates the JSON the provider returns,
  5. prints that JSON on stdout (or a clear error on stderr + nonzero exit).

Design rules:
  - Provider API keys live in the provider command's own environment, never in
    arguments, payloads, generated files, or logs.
  - The provider command must read its prompt from stdin and print its response
    to stdout. Point the env var at your Claude or Codex CLI (or a wrapper).
"""

from __future__ import annotations

import json
import os
import re
import shlex
import subprocess
import sys
from typing import Any


def read_payload() -> dict[str, Any]:
    raw = sys.stdin.read()
    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        fail(f"shim could not parse orchestrator payload as JSON: {exc}")
        raise  # unreachable


def fail(message: str) -> None:
    sys.stderr.write(message.rstrip() + "\n")
    sys.exit(1)


def provider_command(env_var: str) -> list[str]:
    raw = os.environ.get(env_var, "").strip()
    if not raw:
        fail(
            f"{env_var} is not set. Point it at your provider CLI that reads a "
            f"prompt on stdin and prints the response on stdout. "
            f"Keep API keys in that command's environment."
        )
    return shlex.split(raw)


def run_provider(env_var: str, prompt: str) -> str:
    command = provider_command(env_var)
    try:
        completed = subprocess.run(
            command,
            input=prompt,
            text=True,
            capture_output=True,
            timeout=180,
            check=False,
        )
    except FileNotFoundError:
        fail(f"{env_var} command not found: {command[0]!r}")
        raise
    if completed.returncode != 0:
        fail(
            f"provider command failed ({env_var}, exit {completed.returncode}): "
            f"{completed.stderr.strip()[:500]}"
        )
    return completed.stdout


_FENCE = re.compile(r"```(?:json)?\s*(.*?)```", re.DOTALL)


def extract_json(text: str) -> dict[str, Any]:
    """Pull the first JSON object out of a provider response.

    Tolerates code fences and surrounding prose, since CLIs rarely return bare
    JSON. Prefers a fenced block, then the first balanced ``{...}`` span.
    """
    candidates: list[str] = []
    fenced = _FENCE.search(text)
    if fenced:
        candidates.append(fenced.group(1))
    candidates.append(text)

    for candidate in candidates:
        start = candidate.find("{")
        if start == -1:
            continue
        depth = 0
        for i in range(start, len(candidate)):
            ch = candidate[i]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    blob = candidate[start : i + 1]
                    try:
                        return json.loads(blob)
                    except json.JSONDecodeError:
                        break
    fail(f"provider did not return parseable JSON. First 500 chars:\n{text[:500]}")
    raise  # unreachable


def require(data: dict[str, Any], fields: list[str], role: str) -> None:
    missing = [f for f in fields if f not in data]
    if missing:
        fail(f"{role} response missing required field(s): {', '.join(missing)}")


def emit(data: dict[str, Any]) -> None:
    json.dump(data, sys.stdout)
    sys.stdout.write("\n")
