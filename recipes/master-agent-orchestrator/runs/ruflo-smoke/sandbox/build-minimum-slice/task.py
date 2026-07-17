import json

result = {
    "task_id": 'build-minimum-slice',
    "task_description": 'Build the smallest executable slice',
    "goal_excerpt": 'Route a new OpenBrain request using the Ruflo-style swarm approach',
    "status": "ok"
}
print(json.dumps(result, sort_keys=True))
