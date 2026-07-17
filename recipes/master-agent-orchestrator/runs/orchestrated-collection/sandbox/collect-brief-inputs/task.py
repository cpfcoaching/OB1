import sys
sys.path.insert(0, '/sessions/beautiful-dreamy-feynman/mnt/OpenBrain/OB1/recipes/master-agent-orchestrator/workers/collectors')
import brief_inputs
sys.argv = ["brief_inputs.py", "--memory-file", '/sessions/beautiful-dreamy-feynman/mnt/OpenBrain/chief-of-staff/memory.md', "--out", '/sessions/beautiful-dreamy-feynman/mnt/OpenBrain/OB1/recipes/master-agent-orchestrator/runs/orchestrated-collection/brief_inputs.json',
            "--news-feed", "https://feeds.feedburner.com/TheHackersNews"]
raise SystemExit(brief_inputs.main())
