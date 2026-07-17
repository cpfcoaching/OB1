import tempfile
import unittest
from pathlib import Path

from master_agent import (
    AiceptionLearner,
    CapabilityRegistry,
    CodeArtifact,
    CommandCoder,
    CommandJsonWorker,
    JsonlMemoryStore,
    JsonStateStore,
    MasterAgent,
    MemoryRecord,
    MockClaudeDebugger,
    MockClaudePlanner,
    MockCodexCoder,
    OpenBrainAgentMemoryProvider,
    PermissionPolicy,
    RufloRouter,
    SAFE_PYTHON_COMMAND,
    SandboxRunner,
    Task,
    WorkspaceContext,
    doctor_report,
    parse_args,
)


class FlakyCoder:
    def __init__(self):
        self.calls = 0

    def generate_code(self, goal, task, memory):
        self.calls += 1
        if self.calls == 1:
            return CodeArtifact(
                file_name="task.py",
                content="raise RuntimeError('first attempt failed')\n",
                command=SAFE_PYTHON_COMMAND,
            )
        return CodeArtifact(
            file_name="task.py",
            content="print('second attempt passed')\n",
            command=SAFE_PYTHON_COMMAND,
        )


class SingleTaskPlanner:
    def create_plan(self, goal):
        return [Task(id="single-task", description="Exercise retry handling")]


class StaticWorker:
    def __init__(self, payload):
        self.payload = payload

    def call(self, payload):
        return self.payload


class CapturingOpenBrainProvider(OpenBrainAgentMemoryProvider):
    def __init__(self):
        super().__init__(
            endpoint="https://example.test/functions/v1/agent-memory-api",
            access_key="test-key",
            workspace_id="workspace",
            project_id="project",
        )
        self.posts = []

    def _post_json(self, path, payload):
        self.posts.append((path, payload))
        if path == "/recall":
            return {
                "memories": [
                    {
                        "memory_id": "mem-1",
                        "content": "Prior orchestration should snapshot the workspace tree.",
                        "memory_type": "lesson",
                    }
                ]
            }
        return {"created": [{"id": "mem-written"}]}


class MasterAgentTests(unittest.TestCase):
    def build_agent(self, tmpdir, planner=None, coder=None):
        run_root = Path(tmpdir)
        (run_root / "workspace").mkdir()
        (run_root / "workspace" / "app.py").write_text("print('hello')\n", encoding="utf-8")
        return MasterAgent(
            planner=planner or MockClaudePlanner(),
            coder=coder or MockCodexCoder(),
            debugger=MockClaudeDebugger(),
            sandbox=SandboxRunner(run_root / "sandbox", PermissionPolicy()),
            state_store=JsonStateStore(run_root / "state.json"),
            memory=JsonlMemoryStore(run_root / "memory.jsonl"),
            learner=AiceptionLearner(),
            workspace_context=WorkspaceContext(run_root / "workspace"),
            capability_registry=CapabilityRegistry(Path(__file__).resolve().parents[1] / "contracts" / "capability-registry.json"),
            ruflo_router=RufloRouter(),
        )

    def test_mock_run_completes_and_persists_state(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            agent = self.build_agent(tmpdir)
            state = agent.run("Coordinate planning and coding workers")

            self.assertEqual(state["status"], "completed")
            self.assertTrue((Path(tmpdir) / "state.json").exists())
            self.assertEqual(len(state["tasks"]), 3)
            self.assertTrue(all(task["status"] == "completed" for task in state["tasks"]))
            self.assertEqual(len(state["console_logs"]), 3)
            self.assertGreaterEqual(len(state["learning_candidates"]), 1)
            self.assertTrue((Path(tmpdir) / "memory.jsonl").exists())
            self.assertIn("workspace", state)
            self.assertIn("app.py", state["workspace"]["file_tree"])
            self.assertIn("capabilities", state)
            self.assertIn("create_task_list", {tool["name"] for tool in state["capabilities"]["roles"]["claude"]["tools"]})
            self.assertEqual(state["ruflo_flow"]["approach"], "ruflo")
            self.assertEqual(state["task_routes"]["plan-architecture"]["agent"], "architect")
            self.assertEqual(state["task_routes"]["build-minimum-slice"]["agent"], "coder")
            self.assertEqual(state["task_routes"]["run-acceptance-check"]["agent"], "tester")

    def test_failed_code_gets_debug_feedback_and_retries(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            agent = self.build_agent(tmpdir, planner=SingleTaskPlanner(), coder=FlakyCoder())
            state = agent.run("Retry a failing generated task")

            task = state["tasks"][0]
            self.assertEqual(state["status"], "completed")
            self.assertEqual(task["attempts"], 2)
            self.assertIn("first attempt failed", task["feedback"][0])
            self.assertEqual(state["console_logs"][0]["exit_code"], 1)
            self.assertEqual(state["console_logs"][1]["exit_code"], 0)
            self.assertTrue(any("failure" in item["title"].lower() for item in state["learning_candidates"]))

    def test_permission_policy_rejects_unapproved_command(self):
        policy = PermissionPolicy()
        with self.assertRaises(PermissionError):
            policy.validate_command(["bash", "-lc", "rm -rf /tmp/example"])

    def test_state_store_round_trips_json(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            store = JsonStateStore(Path(tmpdir) / "state.json")
            state = {"goal": "test", "tasks": [], "history": [], "console_logs": []}
            store.save(state)
            self.assertEqual(store.load(), state)

    def test_memory_store_recalls_matching_records(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            store = JsonlMemoryStore(Path(tmpdir) / "memory.jsonl")
            store.write(
                MemoryRecord(
                    id="m1",
                    content="Docker sandbox needs network disabled for generated code",
                    tags=["sandbox"],
                    source="test",
                    created_at=1,
                )
            )

            recalled = store.recall("Use docker sandbox for generated code")

            self.assertEqual(len(recalled), 1)
            self.assertEqual(recalled[0].id, "m1")

    def test_workspace_snapshot_stops_at_max_files(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            for index in range(25):
                (root / f"file-{index:02d}.txt").write_text("x", encoding="utf-8")

            snapshot = WorkspaceContext(root, max_files=5).snapshot()

            self.assertEqual(len(snapshot.file_tree), 5)

    def test_command_coder_rejects_missing_contract_fields(self):
        coder = CommandCoder(StaticWorker({"file_name": "task.py", "content": "print('x')\n"}))

        with self.assertRaises(ValueError):
            coder.generate_code("goal", Task(id="t", description="desc"), {})

    def test_openbrain_memory_provider_maps_recall_and_writeback(self):
        provider = CapturingOpenBrainProvider()

        recalled = provider.recall("orchestrate code with memory", limit=3)
        provider.write(
            MemoryRecord(
                id="learning-1",
                content="Keep shared memory compact and source-backed.",
                tags=["aiception"],
                source="test",
                created_at=1,
            )
        )

        self.assertEqual(recalled[0].id, "mem-1")
        self.assertEqual(provider.posts[0][0], "/recall")
        self.assertEqual(provider.posts[0][1]["limits"]["max_items"], 3)
        self.assertEqual(provider.posts[1][0], "/writeback")
        self.assertEqual(provider.posts[1][1]["memory_payload"]["lessons"], ["Keep shared memory compact and source-backed."])

    def test_cli_defaults_to_docker_sandbox(self):
        args = parse_args(["Build a feature"])

        self.assertEqual(args.sandbox, "docker")

    def test_cli_defaults_to_ruflo_orchestration(self):
        args = parse_args(["Build a feature"])

        self.assertEqual(args.orchestration, "ruflo")

    def test_docker_command_disables_network_and_mounts_task_dir(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            runner = SandboxRunner(
                Path(tmpdir),
                PermissionPolicy(),
                mode="docker",
                docker_image="python:test",
                docker_entrypoint="",
            )
            command = runner.docker_command(Path(tmpdir) / "task", SAFE_PYTHON_COMMAND)

            self.assertIn("--network", command)
            self.assertIn("none", command)
            self.assertIn("--pull=never", command)
            self.assertIn("--entrypoint", command)
            self.assertEqual(command[command.index("--entrypoint") + 1], "")
            self.assertIn("-v", command)
            self.assertIn(f"{Path(tmpdir) / 'task'}:/workspace", command)
            self.assertEqual(command[command.index("-w") + 1], "/workspace")
            self.assertEqual(command[-2:], ["python", "task.py"])

    def test_doctor_reports_missing_docker_for_default_sandbox(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            args = parse_args(["--doctor", "--workspace-root", tmpdir])
            report = doctor_report(args, docker_lookup=lambda name: None, image_lookup=lambda image: False)

            self.assertFalse(report["checks"]["ready"])
            self.assertTrue(report["checks"]["docker_required"])
            self.assertFalse(report["checks"]["docker_available"])
            self.assertFalse(report["checks"]["docker_image_present"])

    def test_doctor_allows_local_sandbox_without_docker(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            args = parse_args(["--doctor", "--sandbox", "local", "--workspace-root", tmpdir])
            report = doctor_report(args, docker_lookup=lambda name: None, image_lookup=lambda image: False)

            self.assertTrue(report["checks"]["ready"])
            self.assertFalse(report["checks"]["docker_required"])

    def test_doctor_requires_docker_image_for_default_sandbox(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            args = parse_args(["--doctor", "--workspace-root", tmpdir])
            report = doctor_report(args, docker_lookup=lambda name: "/usr/local/bin/docker", image_lookup=lambda image: False)

            self.assertFalse(report["checks"]["ready"])
            self.assertTrue(report["checks"]["docker_available"])
            self.assertFalse(report["checks"]["docker_image_present"])

    def test_capability_registry_contains_required_tool_surface(self):
        registry = CapabilityRegistry(Path(__file__).resolve().parents[1] / "contracts" / "capability-registry.json").load()
        claude_tools = {tool["name"] for tool in registry["roles"]["claude"]["tools"]}
        codex_tools = {tool["name"] for tool in registry["roles"]["codex"]["tools"]}

        self.assertTrue({"create_task_list", "delegate_to_codex", "approve_and_proceed"}.issubset(claude_tools))
        self.assertTrue({"write_file", "patch_code", "run_terminal_command"}.issubset(codex_tools))

    def test_ruflo_router_routes_tasks_by_role(self):
        router = RufloRouter(topology="mesh", memory_namespace="test-memory")
        flow = router.initialize("Build a feature", {})
        routes = router.route_tasks(
            [
                Task(id="plan-system", description="Plan architecture"),
                Task(id="write-code", description="Build code"),
                Task(id="verify-output", description="Run acceptance checks"),
            ]
        )

        self.assertEqual(flow["swarm"]["topology"], "mesh")
        self.assertEqual(flow["memory"]["namespace"], "test-memory")
        self.assertEqual(routes["plan-system"]["agent"], "architect")
        self.assertEqual(routes["write-code"]["agent"], "coder")
        self.assertEqual(routes["verify-output"]["agent"], "tester")


if __name__ == "__main__":
    unittest.main()
