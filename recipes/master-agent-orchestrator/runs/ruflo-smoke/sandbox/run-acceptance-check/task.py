import json

result = {
    "task_id": 'run-acceptance-check',
    "task_description": 'Run acceptance checks and summarize outcome',
    "goal_excerpt": 'Route a new OpenBrain request using the Ruflo-style swarm approach',
    "status": "ok"
}
print(json.dumps(result, sort_keys=True))
