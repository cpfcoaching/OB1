"""Interview preparation skill."""

from typing import Dict, Any, List
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class InterviewPrep:
    """Interview preparation skill."""
    
    def __init__(self):
        """Initialize interview prep."""
        self.research_sources = [
            "company_website",
            "glassdoor_reviews",
            "crunchbase",
            "linkedin_news",
            "technical_blog"
        ]
    
    async def prepare_for_interview(
        self,
        company: str,
        position: str,
        interview_date: str
    ) -> Dict[str, Any]:
        """
        Prepare comprehensive interview package.
        
        Args:
            company: Company name
            position: Job position
            interview_date: When the interview is
        
        Returns:
            Interview preparation data
        """
        return {
            "company": company,
            "position": position,
            "interview_date": interview_date,
            "preparation": {
                "company_research": await self._research_company(company),
                "role_research": await self._research_role(position),
                "interview_tips": self._get_interview_tips(position),
                "technical_prep": self._get_technical_prep(position),
                "questions_to_ask": self._get_questions_to_ask(company, position),
                "talking_points": self._generate_talking_points(company, position)
            },
            "prepared_at": datetime.utcnow().isoformat()
        }
    
    async def _research_company(self, company: str) -> Dict[str, Any]:
        """Research company information."""
        return {
            "company": company,
            "sources": self.research_sources,
            "key_info": [
                f"Mission and values of {company}",
                f"Recent news and announcements",
                f"Product/service offerings",
                f"Company culture (based on Glassdoor/LinkedIn)",
                f"Key competitors and market position"
            ],
            "note": "Use these sources to build comprehensive company knowledge"
        }
    
    async def _research_role(self, position: str) -> Dict[str, Any]:
        """Research role-specific information."""
        return {
            "position": position,
            "research_points": [
                "Typical responsibilities and day-to-day tasks",
                "Required skills and experience",
                "Growth opportunities in this role",
                "Common challenges faced by someone in this role",
                "How this role impacts the company's business"
            ]
        }
    
    def _get_interview_tips(self, position: str) -> List[str]:
        """Get general interview tips."""
        return [
            "Arrive 10-15 minutes early (or join video call early)",
            "Research the interviewers on LinkedIn",
            "Prepare specific examples (STAR method)",
            "Ask thoughtful questions about the role and company",
            "Follow up within 24 hours with personalized thank you",
            "Be specific about your experiences, not generic",
            "Show enthusiasm for the role and company",
            "Discuss how your skills solve their problems"
        ]
    
    def _get_technical_prep(self, position: str) -> Dict[str, Any]:
        """Get technical preparation resources."""
        resources = {
            "data_science": [
                "LeetCode SQL problems",
                "Statistics and probability refresher",
                "A/B testing case studies",
                "Product metrics frameworks"
            ],
            "backend": [
                "System design patterns",
                "Database optimization",
                "API design principles",
                "Distributed systems concepts"
            ],
            "frontend": [
                "React/Vue patterns and hooks",
                "CSS layout and responsive design",
                "Performance optimization",
                "Browser debugging tools"
            ],
            "general": [
                "Algorithm review",
                "Data structure refresher",
                "Coding problem practice",
                "Whiteboarding techniques"
            ]
        }
        
        # Determine tech role type and return relevant resources
        lower_pos = position.lower()
        if "data" in lower_pos:
            return {"focus": "data_science", "resources": resources["data_science"]}
        elif "backend" in lower_pos or "backend" in lower_pos:
            return {"focus": "backend", "resources": resources["backend"]}
        elif "frontend" in lower_pos:
            return {"focus": "frontend", "resources": resources["frontend"]}
        else:
            return {"focus": "general", "resources": resources["general"]}
    
    def _get_questions_to_ask(self, company: str, position: str) -> List[str]:
        """Get suggested questions to ask interviewer."""
        return [
            f"What does success look like in the first 90 days for this role?",
            f"How do you measure performance in this position?",
            f"What are the biggest challenges the team is facing right now?",
            f"What attracted you to {company} and working on this team?",
            f"What does career progression look like for this role?",
            f"How is the team structured and who would I be working with?",
            f"What are your expectations for collaboration within the team?",
            f"What's one thing you wish you had known before joining {company}?"
        ]
    
    def _generate_talking_points(self, company: str, position: str) -> List[str]:
        """Generate talking points for the interview."""
        return [
            f"Why you're interested in {company} specifically",
            f"Specific examples of relevant projects or experiences",
            f"How your skills solve problems this role faces",
            f"Questions about their tech stack and development practices",
            f"Your approach to learning and professional growth"
        ]
    
    def create_study_schedule(
        self,
        days_until_interview: int,
        focus_areas: List[str]
    ) -> Dict[str, Any]:
        """Create a personalized study schedule."""
        daily_hours = 2
        total_hours = days_until_interview * daily_hours
        
        return {
            "duration_days": days_until_interview,
            "daily_hours": daily_hours,
            "total_hours": total_hours,
            "focus_areas": focus_areas,
            "schedule": {
                "week_1": "Foundation review - algorithms and data structures",
                "week_2": "System design and role-specific concepts",
                "week_3": "Practice problems and mock interviews",
                "final_3_days": "Company research and final review"
            },
            "resources": [
                "LeetCode/HackerRank for coding",
                "YouTube videos for systems design",
                "Company blog for technical insights",
                "Glassdoor for interview experiences"
            ]
        }
