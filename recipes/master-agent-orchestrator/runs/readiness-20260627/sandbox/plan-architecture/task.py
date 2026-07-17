import json

result = {
    "task_id": 'plan-architecture',
    "task_description": 'Create architecture notes for: Readiness check: create a tiny python file that prints OK and verify it',
    "goal_excerpt": 'Readiness check: create a tiny python file that prints OK and verify it',
    "status": "ok"
}
print(json.dumps(result, sort_keys=True))
