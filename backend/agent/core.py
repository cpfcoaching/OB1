"""Job Hunt Agent - Self-evolving autonomous agent with layered memory system."""

import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, asdict, field
from enum import Enum


class MemoryLayer(Enum):
    """Five-layer memory system inspired by GenericAgent."""
    L0_META_RULES = "meta_rules"           # Core behavioral rules
    L1_INSIGHT_INDEX = "insight_index"     # Fast routing index
    L2_GLOBAL_FACTS = "global_facts"       # Stable knowledge
    L3_TASK_SKILLS = "task_skills"         # Reusable workflows
    L4_SESSION_ARCHIVE = "session_archive" # Historical records


@dataclass
class AgentTask:
    """Represents a task for the agent."""
    task_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    task_type: str = ""  # job_scraper, email_automation, interview_prep, etc.
    description: str = ""
    status: str = "pending"  # pending, running, completed, failed
    input_data: Dict[str, Any] = field(default_factory=dict)
    output_data: Dict[str, Any] = field(default_factory=dict)
    error_message: Optional[str] = None
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    completed_at: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert task to dictionary."""
        return asdict(self)


@dataclass
class Skill:
    """Represents a skill learned by the agent."""
    skill_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    skill_type: str = ""  # job_scraper, email_template, interview_research, etc.
    name: str = ""
    description: str = ""
    steps: List[str] = field(default_factory=list)
    parameters: Dict[str, Any] = field(default_factory=dict)
    success_rate: float = 0.0
    usage_count: int = 0
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    last_used_at: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert skill to dictionary."""
        return asdict(self)


class JobHuntAgent:
    """
    Self-evolving autonomous agent for job hunting automation.
    
    Based on GenericAgent architecture with 5-layer memory system:
    - L0: Meta rules (agent constraints and core behaviors)
    - L1: Insight index (fast routing, keywords, categories)
    - L2: Global facts (stable knowledge accumulated over time)
    - L3: Task skills (reusable workflows crystallized from tasks)
    - L4: Session archive (historical task records for recall)
    """
    
    def __init__(self, memory_dir: Path, agent_name: str = "JobHuntAgent"):
        """Initialize the agent with layered memory."""
        self.agent_name = agent_name
        self.memory_dir = Path(memory_dir)
        self.memory_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize memory layers
        self.meta_rules = self._load_layer(MemoryLayer.L0_META_RULES)
        self.insight_index = self._load_layer(MemoryLayer.L1_INSIGHT_INDEX)
        self.global_facts = self._load_layer(MemoryLayer.L2_GLOBAL_FACTS)
        self.task_skills = self._load_layer(MemoryLayer.L3_TASK_SKILLS)
        self.session_archive = self._load_layer(MemoryLayer.L4_SESSION_ARCHIVE)
        
        # Initialize default meta rules if empty
        if not self.meta_rules:
            self._initialize_meta_rules()
    
    def _get_memory_file(self, layer: MemoryLayer) -> Path:
        """Get file path for a memory layer."""
        return self.memory_dir / f"{layer.value}.json"
    
    def _load_layer(self, layer: MemoryLayer) -> Dict[str, Any]:
        """Load a memory layer from disk."""
        file_path = self._get_memory_file(layer)
        if file_path.exists():
            with open(file_path, 'r') as f:
                return json.load(f)
        return {}
    
    def _save_layer(self, layer: MemoryLayer, data: Dict[str, Any]) -> None:
        """Save a memory layer to disk."""
        file_path = self._get_memory_file(layer)
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
    
    def _initialize_meta_rules(self) -> None:
        """Initialize core behavioral rules."""
        self.meta_rules = {
            "core_objectives": [
                "Automate job search pipeline",
                "Maximize interview opportunities",
                "Track applications and follow-ups",
                "Provide actionable insights"
            ],
            "constraints": [
                "Respect user privacy",
                "Don't spam recruiters",
                "Verify data before storing",
                "Always ask for confirmation on sensitive actions"
            ],
            "tools": [
                "web_scraper",
                "email_automator",
                "data_enricher",
                "insight_generator",
                "scheduler"
            ]
        }
        self._save_layer(MemoryLayer.L0_META_RULES, self.meta_rules)
    
    def learn_skill(self, skill_type: str, skill_data: Skill) -> None:
        """
        Crystallize a completed task into a reusable skill.
        This is the self-evolution mechanism.
        """
        if skill_type not in self.task_skills:
            self.task_skills[skill_type] = []
        
        self.task_skills[skill_type].append(skill_data.to_dict())
        
        # Update insight index for faster routing
        self.insight_index[skill_type] = {
            "count": len(self.task_skills[skill_type]),
            "last_used": skill_data.last_used_at,
            "avg_success": self._calculate_avg_success(skill_type)
        }
        
        self._save_layer(MemoryLayer.L3_TASK_SKILLS, self.task_skills)
        self._save_layer(MemoryLayer.L1_INSIGHT_INDEX, self.insight_index)
    
    def archive_task(self, task: AgentTask) -> None:
        """Archive a completed task for long-term recall."""
        session_date = datetime.utcnow().date().isoformat()
        
        if session_date not in self.session_archive:
            self.session_archive[session_date] = []
        
        self.session_archive[session_date].append(task.to_dict())
        self._save_layer(MemoryLayer.L4_SESSION_ARCHIVE, self.session_archive)
    
    def get_relevant_skills(self, task_type: str) -> List[Dict[str, Any]]:
        """Retrieve relevant skills for a task type from L3."""
        return self.task_skills.get(task_type, [])
    
    def get_facts(self) -> Dict[str, Any]:
        """Retrieve stable knowledge from L2."""
        return self.global_facts
    
    def add_fact(self, key: str, value: Any) -> None:
        """Add stable knowledge to L2."""
        self.global_facts[key] = {
            "value": value,
            "added_at": datetime.utcnow().isoformat()
        }
        self._save_layer(MemoryLayer.L2_GLOBAL_FACTS, self.global_facts)
    
    def _calculate_avg_success(self, skill_type: str) -> float:
        """Calculate average success rate for a skill type."""
        skills = self.task_skills.get(skill_type, [])
        if not skills:
            return 0.0
        success_rates = [s.get("success_rate", 0.0) for s in skills]
        return sum(success_rates) / len(success_rates)
    
    def get_memory_stats(self) -> Dict[str, Any]:
        """Get statistics about agent memory."""
        return {
            "meta_rules": len(self.meta_rules),
            "insight_index_entries": len(self.insight_index),
            "global_facts": len(self.global_facts),
            "task_skills": {k: len(v) for k, v in self.task_skills.items()},
            "session_archives": len(self.session_archive)
        }
