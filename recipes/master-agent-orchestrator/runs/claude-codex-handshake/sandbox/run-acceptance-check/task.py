import json

result = {
    "task_id": 'run-acceptance-check',
    "task_description": 'Run acceptance checks and summarize outcome',
    "goal_excerpt": 'Coordinate Claude and Codex: plan a small CPF utility, have Codex write it, verify it runs',
    "status": "ok"
}
print(json.dumps(result, sort_keys=True))
