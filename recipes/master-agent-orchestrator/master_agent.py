#!/usr/bin/env python3
"""Local master agent harness for coordinating planning and code workers."""

from __future__ import annotations

import argparse
import hashlib
import json
import shlex
import shutil
import subprocess
import sys
import textwrap
import time
import urllib.error
import urllib.request
import uuid
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Protocol


SAFE_PYTHON_COMMAND = [sys.executable, "task.py"]
DEFAULT_SKIP_DIRS = {
    ".git",
    ".venv",
    "__pycache__",
    "dist",
    "node_modules",
    "runs",
}
CONTRACT_FILES = [
    "contracts/planner-response.schema.json",
    "contracts/coder-response.schema.json",
    "contracts/debugger-response.schema.json",
    "contracts/capability-registry.json",
]


@dataclass
class Task:
    id: str
    description: str
    status: str = "planned"
    attempts: int = 0
    feedback: list[str] = field(default_factory=list)


@dataclass
class CodeArtifact:
    file_name: str
    content: str
    command: list[str]


@dataclass
class RunResult:
    exit_code: int
    stdout: str
    stderr: str
    duration_ms: int


@dataclass
class MemoryRecord:
    id: str
    content: str
    tags: list[str]
    source: str
    created_at: int


@dataclass
class LearningCandidate:
    title: str
    trigger: str
    lesson: str
    evidence: str
    reusable: bool


@dataclass
class WorkspaceSnapshot:
    root: str
    file_tree: list[str]
    captured_at: int


class CapabilityRegistry:
    def __init__(self, path: Path):
        self.path = path

    def load(self) -> dict[str, Any]:
        return json.loads(self.path.read_text(encoding="utf-8"))


class Planner(Protocol):
    def create_plan(self, goal: str) -> list[Task]:
        ...


class Coder(Protocol):
    def generate_code(self, goal: str, task: Task, memory: dict[str, Any]) -> CodeArtifact:
        ...


class Debugger(Protocol):
    def diagnose(self, goal: str, task: Task, artifact: CodeArtifact, result: RunResult) -> str:
        ...


class MemoryProvider(Protocol):
    def recall(self, goal: str, limit: int = 5) -> list[MemoryRecord]:
        ...

    def write(self, record: MemoryRecord) -> None:
        ...


class Learner(Protocol):
    def extract(self, goal: str, state: dict[str, Any]) -> list[LearningCandidate]:
        ...


class JsonStateStore:
    def __init__(self, path: Path):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def load(self) -> dict[str, Any]:
        if not self.path.exists():
            return {"goal": "", "tasks": [], "history": [], "console_logs": []}
        return json.loads(self.path.read_text(encoding="utf-8"))

    def save(self, state: dict[str, Any]) -> None:
        self.path.write_text(json.dumps(state, indent=2, sort_keys=True), encoding="utf-8")


class WorkspaceContext:
    def __init__(self, root: Path, max_files: int = 200):
        self.root = root.resolve()
        self.max_files = max_files

    def snapshot(self) -> WorkspaceSnapshot:
        files: list[str] = []
        if not self.root.exists():
            return WorkspaceSnapshot(root=str(self.root), file_tree=[], captured_at=int(time.time()))
        for path in sorted(self.root.rglob("*")):
            if len(files) >= self.max_files:
                break
            if any(part in DEFAULT_SKIP_DIRS for part in path.parts):
                continue
            if path.is_file():
                files.append(path.relative_to(self.root).as_posix())
        return WorkspaceSnapshot(root=str(self.root), file_tree=files, captured_at=int(time.time()))


class JsonlMemoryStore:
    def __init__(self, path: Path):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def recall(self, goal: str, limit: int = 5) -> list[MemoryRecord]:
        if not self.path.exists():
            return []
        terms = {term.lower() for term in goal.split() if len(term) > 3}
        matches: list[MemoryRecord] = []
        for line in self.path.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            record = MemoryRecord(**json.loads(line))
            haystack = f"{record.content} {' '.join(record.tags)}".lower()
            if not terms or any(term in haystack for term in terms):
                matches.append(record)
        return matches[-limit:]

    def write(self, record: MemoryRecord) -> None:
        with self.path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(asdict(record), sort_keys=True) + "\n")


class OpenBrainAgentMemoryProvider:
    def __init__(
        self,
        endpoint: str,
        access_key: str,
        workspace_id: str,
        project_id: str,
        runtime_name: str = "master-agent-orchestrator",
        runtime_version: str = "0.1.0",
    ):
        self.endpoint = endpoint.rstrip("/")
        self.access_key = access_key
        self.workspace_id = workspace_id
        self.project_id = project_id
        self.runtime_name = runtime_name
        self.runtime_version = runtime_version

    def recall(self, goal: str, limit: int = 5) -> list[MemoryRecord]:
        payload = {
            "schema_version": "openbrain.agent_memory.recall.v1",
            "workspace_id": self.workspace_id,
            "project_id": self.project_id,
            "task_id": None,
            "flow_id": None,
            "task_type": "code_orchestration",
            "channel": {"kind": "local", "id": self.project_id, "thread_id": None},
            "runtime": {"name": self.runtime_name, "version": self.runtime_version},
            "model_intent": {"provider": "mixed", "model": "claude+codex-gpt"},
            "query": goal,
            "entities": {"topics": ["master agent", "orchestration"], "files": [], "repos": ["OpenBrain"]},
            "scope": {
                "visibility": "project",
                "project_only": True,
                "include_unconfirmed": False,
                "include_stale": False,
            },
            "limits": {"max_items": limit, "max_tokens": 4000, "recency_days": 180},
            "sensitivity": {"contains_code": True, "contains_customer_data": False},
        }
        data = self._post_json("/recall", payload)
        records: list[MemoryRecord] = []
        for item in data.get("memories", []):
            records.append(
                MemoryRecord(
                    id=str(item.get("memory_id") or item.get("id")),
                    content=str(item.get("content") or item.get("summary") or ""),
                    tags=["openbrain", str(item.get("memory_type") or "memory")],
                    source="openbrain-agent-memory-api",
                    created_at=int(time.time()),
                )
            )
        return records

    def write(self, record: MemoryRecord) -> None:
        content_hash = hashlib.sha256(record.content.encode("utf-8")).hexdigest()
        payload = {
            "schema_version": "openbrain.agent_memory.writeback.v1",
            "workspace_id": self.workspace_id,
            "project_id": self.project_id,
            "task_id": "master-agent-orchestrator",
            "flow_id": None,
            "step_id": "ace-learning",
            "idempotency_key": f"{self.workspace_id}:{self.project_id}:{record.id}:{content_hash[:12]}",
            "content_hash": content_hash,
            "channel": {"kind": "local", "id": self.project_id, "thread_id": None},
            "runtime": {"name": self.runtime_name, "version": self.runtime_version},
            "models_used": [{"provider": "mixed", "model": "claude+codex-gpt", "role": "orchestration"}],
            "source_refs": [{"kind": "local_run", "uri": record.id, "title": record.source, "timestamp": None}],
            "memory_payload": {
                "decisions": [],
                "outputs": [],
                "lessons": [record.content],
                "constraints": [],
                "unresolved_questions": [],
                "next_steps": [],
                "failures": [],
                "artifacts": [],
                "entities": {"topics": record.tags, "files": [], "repos": ["OpenBrain"]},
            },
            "provenance": {"default_status": "generated", "confidence": 0.75, "requires_review": True},
            "retention": {"ttl_days": None, "stale_after_days": 180},
            "visibility": {"workspace": "restricted", "project": "shared", "channel": "restricted"},
        }
        self._post_json("/writeback", payload)

    def _post_json(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        request = urllib.request.Request(
            f"{self.endpoint}{path}",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "x-brain-key": self.access_key},
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"OpenBrain Agent Memory API failed: {exc.code} {detail}") from exc


class AiceptionLearner:
    """ACE loop: Assess run evidence, Codify candidate lessons, Embed useful memory."""

    def extract(self, goal: str, state: dict[str, Any]) -> list[LearningCandidate]:
        candidates: list[LearningCandidate] = []
        failed_logs = [log for log in state.get("console_logs", []) if log.get("exit_code") != 0]
        if failed_logs:
            first_failure = failed_logs[0]
            stderr = (first_failure.get("stderr") or "").strip()
            candidates.append(
                LearningCandidate(
                    title="Generated code failure recovery",
                    trigger=f"Task {first_failure.get('task_id')} exited with {first_failure.get('exit_code')}",
                    lesson="Keep exact stderr and retry feedback in workflow state before regenerating code.",
                    evidence=stderr[:500] or "failure captured without stderr",
                    reusable=True,
                )
            )
        if state.get("status") == "completed":
            candidates.append(
                LearningCandidate(
                    title="Completed orchestration run",
                    trigger="All planned tasks reached completed status",
                    lesson="A run is only complete after every task status and console log is persisted.",
                    evidence=f"{len(state.get('tasks', []))} tasks completed for goal: {goal[:120]}",
                    reusable=True,
                )
            )
        return candidates


class PermissionPolicy:
    def __init__(self, approved_commands: list[list[str]] | None = None):
        self.approved_commands = approved_commands or [SAFE_PYTHON_COMMAND]
        self.denied_tokens = {"rm", "sudo", "curl", "wget", "ssh", "scp"}

    def validate_command(self, command: list[str]) -> None:
        if not self._is_approved(command):
            raise PermissionError(f"Command is not approved: {shlex.join(command)}")
        if any(token in self.denied_tokens for token in command):
            raise PermissionError(f"Command contains denied token: {shlex.join(command)}")

    def _is_approved(self, command: list[str]) -> bool:
        if command in self.approved_commands:
            return True
        if len(command) == 2 and command[1] == "task.py":
            executable = Path(command[0]).name
            return executable in {"python", "python3", Path(sys.executable).name}
        return False


class SandboxRunner:
    def __init__(
        self,
        run_root: Path,
        policy: PermissionPolicy,
        mode: str = "local",
        docker_image: str = "python:3.12-slim",
        docker_entrypoint: str | None = None,
        timeout_seconds: int = 20,
    ):
        self.run_root = run_root
        self.policy = policy
        self.mode = mode
        self.docker_image = docker_image
        self.docker_entrypoint = docker_entrypoint
        self.timeout_seconds = timeout_seconds
        self.run_root.mkdir(parents=True, exist_ok=True)

    def execute(self, artifact: CodeArtifact, task_id: str) -> RunResult:
        self.policy.validate_command(artifact.command)
        task_dir = self.run_root / task_id
        task_dir.mkdir(parents=True, exist_ok=True)
        (task_dir / artifact.file_name).write_text(artifact.content, encoding="utf-8")

        started = time.monotonic()
        if self.mode == "docker":
            command = self.docker_command(task_dir, artifact.command)
            cwd = None
        else:
            command = artifact.command
            cwd = task_dir

        try:
            completed = subprocess.run(
                command,
                cwd=cwd,
                text=True,
                capture_output=True,
                timeout=self.timeout_seconds,
                check=False,
            )
            return RunResult(
                exit_code=completed.returncode,
                stdout=completed.stdout,
                stderr=completed.stderr,
                duration_ms=int((time.monotonic() - started) * 1000),
            )
        except subprocess.TimeoutExpired as exc:
            return RunResult(
                exit_code=124,
                stdout=exc.stdout or "",
                stderr=f"Timed out after {self.timeout_seconds} seconds",
                duration_ms=int((time.monotonic() - started) * 1000),
            )

    def docker_command(self, task_dir: Path, artifact_command: list[str]) -> list[str]:
        container_command = self.container_command(artifact_command)
        return [
            "docker",
            "run",
            "--rm",
            "--network",
            "none",
            "--pull=never",
            *(["--entrypoint", self.docker_entrypoint] if self.docker_entrypoint is not None else []),
            "-v",
            f"{task_dir}:/workspace",
            "-w",
            "/workspace",
            self.docker_image,
            *container_command,
        ]

    def container_command(self, artifact_command: list[str]) -> list[str]:
        if len(artifact_command) == 2 and artifact_command[1] == "task.py":
            executable = Path(artifact_command[0]).name
            if executable in {"python", "python3", Path(sys.executable).name}:
                return ["python", "task.py"]
        return artifact_command


class MockClaudePlanner:
    def create_plan(self, goal: str) -> list[Task]:
        compact_goal = " ".join(goal.split())[:120] or "unspecified goal"
        return [
            Task(id="plan-architecture", description=f"Create architecture notes for: {compact_goal}"),
            Task(id="build-minimum-slice", description="Build the smallest executable slice"),
            Task(id="run-acceptance-check", description="Run acceptance checks and summarize outcome"),
        ]


class MockCodexCoder:
    def generate_code(self, goal: str, task: Task, memory: dict[str, Any]) -> CodeArtifact:
        body = textwrap.dedent(
            f"""
            import json

            result = {{
                "task_id": {task.id!r},
                "task_description": {task.description!r},
                "goal_excerpt": {goal[:120]!r},
                "status": "ok"
            }}
            print(json.dumps(result, sort_keys=True))
            """
        ).strip()
        return CodeArtifact(file_name="task.py", content=body + "\n", command=SAFE_PYTHON_COMMAND)


class MockClaudeDebugger:
    def diagnose(self, goal: str, task: Task, artifact: CodeArtifact, result: RunResult) -> str:
        stderr = result.stderr.strip() or "no stderr captured"
        return f"Task {task.id} failed with exit code {result.exit_code}: {stderr}"


class CommandJsonWorker:
    """Optional bridge for live workers that speak JSON over stdin and stdout."""

    def __init__(self, command: list[str]):
        self.command = command

    def call(self, payload: dict[str, Any]) -> dict[str, Any]:
        completed = subprocess.run(
            self.command,
            input=json.dumps(payload),
            text=True,
            capture_output=True,
            timeout=120,
            check=False,
        )
        if completed.returncode != 0:
            raise RuntimeError(completed.stderr.strip() or f"Worker failed: {shlex.join(self.command)}")
        try:
            return json.loads(completed.stdout)
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"Worker returned invalid JSON: {completed.stdout[:500]}") from exc


def require_fields(data: dict[str, Any], fields: list[str], role: str) -> None:
    missing = [field for field in fields if field not in data]
    if missing:
        raise ValueError(f"{role} response missing required fields: {', '.join(missing)}")


class CommandPlanner:
    def __init__(self, worker: CommandJsonWorker):
        self.worker = worker

    def create_plan(self, goal: str) -> list[Task]:
        data = self.worker.call({"role": "planner", "goal": goal})
        require_fields(data, ["tasks"], "planner")
        return [Task(**item) for item in data["tasks"]]


class CommandCoder:
    def __init__(self, worker: CommandJsonWorker):
        self.worker = worker

    def generate_code(self, goal: str, task: Task, memory: dict[str, Any]) -> CodeArtifact:
        data = self.worker.call({"role": "coder", "goal": goal, "task": asdict(task), "memory": memory})
        require_fields(data, ["file_name", "content", "command"], "coder")
        return CodeArtifact(**data)


class CommandDebugger:
    def __init__(self, worker: CommandJsonWorker):
        self.worker = worker

    def diagnose(self, goal: str, task: Task, artifact: CodeArtifact, result: RunResult) -> str:
        data = self.worker.call(
            {
                "role": "debugger",
                "goal": goal,
                "task": asdict(task),
                "artifact": asdict(artifact),
                "result": asdict(result),
            }
        )
        require_fields(data, ["feedback"], "debugger")
        return data["feedback"]


class MasterAgent:
    def __init__(
        self,
        planner: Planner,
        coder: Coder,
        debugger: Debugger,
        sandbox: SandboxRunner,
        state_store: JsonStateStore,
        memory: MemoryProvider | None = None,
        learner: Learner | None = None,
        workspace_context: WorkspaceContext | None = None,
        capability_registry: CapabilityRegistry | None = None,
        max_attempts: int = 3,
    ):
        self.planner = planner
        self.coder = coder
        self.debugger = debugger
        self.sandbox = sandbox
        self.state_store = state_store
        self.memory = memory
        self.learner = learner
        self.workspace_context = workspace_context
        self.capability_registry = capability_registry
        self.max_attempts = max_attempts

    def run(self, goal: str) -> dict[str, Any]:
        state = self.state_store.load()
        state["goal"] = goal
        if self.capability_registry and "capabilities" not in state:
            state["capabilities"] = self.capability_registry.load()
            self._checkpoint(state, "capability_registry_loaded")
        if self.workspace_context and "workspace" not in state:
            state["workspace"] = asdict(self.workspace_context.snapshot())
            self._checkpoint(state, "workspace_snapshot_captured")
        if self.memory and "recalled_memory" not in state:
            recalled = self.memory.recall(goal)
            state["recalled_memory"] = [asdict(record) for record in recalled]
            self._checkpoint(state, f"memory_recalled:{len(recalled)}")
        if not state.get("tasks"):
            state["tasks"] = [asdict(task) for task in self.planner.create_plan(goal)]
            self._checkpoint(state, "plan_created")

        tasks = [Task(**task) for task in state["tasks"]]
        for task in tasks:
            if task.status == "completed":
                continue
            task.status = "executing"
            while task.attempts < self.max_attempts:
                task.attempts += 1
                artifact = self.coder.generate_code(goal, task, state)
                result = self.sandbox.execute(artifact, task.id)
                self._record_console(state, task, artifact, result)
                if result.exit_code == 0:
                    task.status = "completed"
                    self._replace_task(state, task)
                    self._checkpoint(state, f"task_completed:{task.id}")
                    break
                feedback = self.debugger.diagnose(goal, task, artifact, result)
                task.feedback.append(feedback)
                self._replace_task(state, task)
                self._checkpoint(state, f"task_failed:{task.id}:attempt:{task.attempts}")
            if task.status != "completed":
                task.status = "failed"
                self._replace_task(state, task)
                self._checkpoint(state, f"task_terminal_failure:{task.id}")
                break

        if all(item["status"] == "completed" for item in state["tasks"]):
            state["status"] = "completed"
        else:
            state["status"] = "failed"
        if self.learner:
            candidates = self.learner.extract(goal, state)
            state["learning_candidates"] = [asdict(candidate) for candidate in candidates]
            if self.memory:
                for candidate in candidates:
                    if candidate.reusable:
                        self.memory.write(
                            MemoryRecord(
                                id=f"learning-{uuid.uuid4().hex[:12]}",
                                content=f"{candidate.title}: {candidate.lesson}",
                                tags=["master-agent-orchestrator", "aiception", "ace-learning"],
                                source="aiception-learner",
                                created_at=int(time.time()),
                            )
                        )
        self._checkpoint(state, f"run_{state['status']}")
        return state

    def _checkpoint(self, state: dict[str, Any], event: str) -> None:
        state.setdefault("history", []).append({"event": event, "time": int(time.time())})
        self.state_store.save(state)

    def _replace_task(self, state: dict[str, Any], task: Task) -> None:
        state["tasks"] = [asdict(task) if item["id"] == task.id else item for item in state["tasks"]]

    def _record_console(
        self,
        state: dict[str, Any],
        task: Task,
        artifact: CodeArtifact,
        result: RunResult,
    ) -> None:
        state.setdefault("console_logs", []).append(
            {
                "task_id": task.id,
                "attempt": task.attempts,
                "command": artifact.command,
                "exit_code": result.exit_code,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "duration_ms": result.duration_ms,
            }
        )


def build_agent(args: argparse.Namespace) -> MasterAgent:
    run_root = Path(args.run_root).expanduser().resolve()
    state_store = JsonStateStore(run_root / "state.json")
    if args.openbrain_memory_endpoint and args.openbrain_memory_key:
        memory_store: MemoryProvider = OpenBrainAgentMemoryProvider(
            endpoint=args.openbrain_memory_endpoint,
            access_key=args.openbrain_memory_key,
            workspace_id=args.openbrain_workspace_id,
            project_id=args.openbrain_project_id,
        )
    else:
        memory_store = JsonlMemoryStore(run_root / "memory.jsonl")
    workspace_context = WorkspaceContext(Path(args.workspace_root).expanduser().resolve(), max_files=args.max_files)
    capability_registry = CapabilityRegistry(Path(__file__).resolve().parent / "contracts" / "capability-registry.json")
    policy = PermissionPolicy()
    sandbox = SandboxRunner(
        run_root / "sandbox",
        policy,
        mode=args.sandbox,
        docker_image=args.docker_image,
        docker_entrypoint=args.docker_entrypoint,
    )

    if args.planner_command:
        planner: Planner = CommandPlanner(CommandJsonWorker(shlex.split(args.planner_command)))
    else:
        planner = MockClaudePlanner()
    if args.coder_command:
        coder: Coder = CommandCoder(CommandJsonWorker(shlex.split(args.coder_command)))
    else:
        coder = MockCodexCoder()
    if args.debugger_command:
        debugger: Debugger = CommandDebugger(CommandJsonWorker(shlex.split(args.debugger_command)))
    else:
        debugger = MockClaudeDebugger()

    return MasterAgent(
        planner,
        coder,
        debugger,
        sandbox,
        state_store,
        memory=memory_store,
        learner=AiceptionLearner(),
        workspace_context=workspace_context,
        capability_registry=capability_registry,
        max_attempts=args.max_attempts,
    )


def command_available(command: str) -> bool:
    parts = shlex.split(command)
    if not parts:
        return False
    executable = parts[0]
    if "/" in executable:
        return Path(executable).exists()
    return shutil.which(executable) is not None


def docker_image_present(image: str) -> bool:
    completed = subprocess.run(
        ["docker", "image", "inspect", image],
        text=True,
        capture_output=True,
        timeout=10,
        check=False,
    )
    return completed.returncode == 0


def doctor_report(
    args: argparse.Namespace,
    docker_lookup=shutil.which,
    image_lookup=docker_image_present,
) -> dict[str, Any]:
    recipe_root = Path(__file__).resolve().parent
    workspace_root = Path(args.workspace_root).expanduser().resolve()
    docker_path = docker_lookup("docker")
    image_present = image_lookup(args.docker_image) if docker_path else False
    provider_commands = {
        "planner": args.planner_command,
        "coder": args.coder_command,
        "debugger": args.debugger_command,
    }
    provider_status = {
        role: {
            "configured": bool(command),
            "available": command_available(command) if command else None,
        }
        for role, command in provider_commands.items()
    }
    contracts = {
        contract: (recipe_root / contract).exists()
        for contract in CONTRACT_FILES
    }
    memory_backend = "openbrain-agent-memory-api" if args.openbrain_memory_endpoint or args.openbrain_memory_key else "local-jsonl"
    openbrain_memory_ready = bool(args.openbrain_memory_endpoint and args.openbrain_memory_key)
    checks = {
        "workspace_root_exists": workspace_root.exists(),
        "contracts_present": all(contracts.values()),
        "docker_required": args.sandbox == "docker",
        "docker_available": docker_path is not None,
        "docker_image_present": image_present,
        "openbrain_memory_config_complete": memory_backend == "local-jsonl" or openbrain_memory_ready,
        "provider_commands_available": all(
            status["available"] is not False for status in provider_status.values()
        ),
    }
    required_check_keys = [
        "workspace_root_exists",
        "contracts_present",
        "openbrain_memory_config_complete",
        "provider_commands_available",
    ]
    if checks["docker_required"]:
        required_check_keys.extend(["docker_available", "docker_image_present"])
    checks["ready"] = all(checks[key] for key in required_check_keys)
    return {
        "service": "master-agent-orchestrator",
        "sandbox": args.sandbox,
        "workspace_root": str(workspace_root),
        "memory_backend": memory_backend,
        "checks": checks,
        "docker": {
            "path": docker_path,
            "image": args.docker_image,
            "image_present": image_present,
        },
        "contracts": contracts,
        "provider_commands": provider_status,
    }


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the OB1 master agent orchestrator recipe.")
    parser.add_argument("goal", nargs="?", help="Goal to execute. If omitted, stdin is used.")
    parser.add_argument("--doctor", action="store_true", help="Print readiness checks and exit.")
    parser.add_argument("--run-root", default=f"runs/{uuid.uuid4().hex[:10]}", help="Directory for state and sandbox files.")
    parser.add_argument("--sandbox", choices=["local", "docker"], default="docker", help="Execution isolation mode.")
    parser.add_argument("--docker-image", default="python:3.12-slim", help="Docker image for docker sandbox mode.")
    parser.add_argument("--docker-entrypoint", help="Optional Docker entrypoint override. Use an empty string to clear an image entrypoint.")
    parser.add_argument("--max-attempts", type=int, default=3, help="Maximum attempts per task.")
    parser.add_argument("--planner-command", help="Command that returns planner JSON.")
    parser.add_argument("--coder-command", help="Command that returns coder JSON.")
    parser.add_argument("--debugger-command", help="Command that returns debugger JSON.")
    parser.add_argument("--workspace-root", default=".", help="Workspace root to snapshot into shared state.")
    parser.add_argument("--max-files", type=int, default=200, help="Maximum files to include in the workspace snapshot.")
    parser.add_argument("--openbrain-memory-endpoint", help="Optional OB1 Agent Memory API endpoint.")
    parser.add_argument("--openbrain-memory-key", help="Optional OB1 Agent Memory API access key.")
    parser.add_argument("--openbrain-workspace-id", default="local-openbrain", help="OB1 Agent Memory workspace id.")
    parser.add_argument("--openbrain-project-id", default="master-agent-orchestrator", help="OB1 Agent Memory project id.")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    if args.doctor:
        report = doctor_report(args)
        print(json.dumps(report, indent=2, sort_keys=True))
        return 0 if report["checks"]["ready"] else 1
    goal = args.goal or sys.stdin.read().strip()
    if not goal:
        print("A goal is required.", file=sys.stderr)
        return 2
    agent = build_agent(args)
    state = agent.run(goal)
    print(json.dumps({"status": state["status"], "state_path": str(Path(args.run_root) / "state.json")}, indent=2))
    return 0 if state["status"] == "completed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
