"""Agent initialization and startup."""

from pathlib import Path
from agent.core import JobHuntAgent

_agent_instance = None


def initialize_agent(memory_dir: Path) -> JobHuntAgent:
    """Initialize the job hunt agent with memory layer."""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = JobHuntAgent(memory_dir)
    return _agent_instance


def get_agent() -> JobHuntAgent:
    """Get the initialized agent instance."""
    global _agent_instance
    if _agent_instance is None:
        raise RuntimeError("Agent not initialized. Call initialize_agent() first.")
    return _agent_instance
