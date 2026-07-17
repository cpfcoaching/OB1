import json

result = {
    "task_id": 'build-minimum-slice',
    "task_description": 'Build the smallest executable slice',
    "goal_excerpt": 'Coordinate Claude and Codex: plan a small CPF utility, have Codex write it, verify it runs',
    "status": "ok"
}
print(json.dumps(result, sort_keys=True))
