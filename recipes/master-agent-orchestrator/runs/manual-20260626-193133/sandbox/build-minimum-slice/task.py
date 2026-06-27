import json

result = {
    "task_id": 'build-minimum-slice',
    "task_description": 'Build the smallest executable slice',
    "goal_excerpt": 'Coordinate Claude for planning and debugging with Codex/GPT for code generation and execution using shared OpenBrain sta',
    "status": "ok"
}
print(json.dumps(result, sort_keys=True))
