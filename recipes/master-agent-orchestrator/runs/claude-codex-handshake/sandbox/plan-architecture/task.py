import json

result = {
    "task_id": 'plan-architecture',
    "task_description": 'Create architecture notes for: Coordinate Claude and Codex: plan a small CPF utility, have Codex write it, verify it runs',
    "goal_excerpt": 'Coordinate Claude and Codex: plan a small CPF utility, have Codex write it, verify it runs',
    "status": "ok"
}
print(json.dumps(result, sort_keys=True))
