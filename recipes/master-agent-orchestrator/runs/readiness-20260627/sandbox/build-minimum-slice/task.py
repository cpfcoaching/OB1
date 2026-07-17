import json

result = {
    "task_id": 'build-minimum-slice',
    "task_description": 'Build the smallest executable slice',
    "goal_excerpt": 'Readiness check: create a tiny python file that prints OK and verify it',
    "status": "ok"
}
print(json.dumps(result, sort_keys=True))
