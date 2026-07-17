import json

result = {
    "task_id": 'plan-architecture',
    "task_description": 'Create architecture notes for: Route a new OpenBrain request using the Ruflo-style swarm approach',
    "goal_excerpt": 'Route a new OpenBrain request using the Ruflo-style swarm approach',
    "status": "ok"
}
print(json.dumps(result, sort_keys=True))
