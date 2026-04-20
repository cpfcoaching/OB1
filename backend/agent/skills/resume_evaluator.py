"""Resume evaluation and optimization skill."""

from typing import Dict, Any, List
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class ResumeEvaluator:
    """Evaluate and score resumes for ATS and recruiter appeal."""
    
    # Resume scoring criteria
    SCORING_CRITERIA = {
        "format": 15,
        "content": 25,
        "ats_optimization": 20,
        "achievements": 20,
        "keywords": 20
    }
    
    # Common ATS-friendly keywords by role
    ATS_KEYWORDS = {
        "software_engineer": [
            "python", "java", "javascript", "c++", "go",
            "api", "database", "sql", "rest", "microservices",
            "aws", "azure", "docker", "kubernetes", "git",
            "agile", "scrum", "sprint", "ci/cd", "devops"
        ],
        "data_scientist": [
            "python", "r", "sql", "machine learning", "deep learning",
            "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
            "data analysis", "data visualization", "statistical analysis",
            "neural networks", "nlp", "cv", "predictive modeling"
        ],
        "product_manager": [
            "product strategy", "roadmap", "stakeholder management",
            "user research", "market analysis", "competitive analysis",
            "agile", "sprint planning", "metrics", "analytics",
            "a/b testing", "user experience", "ux design"
        ],
        "general": [
            "leadership", "management", "communication", "teamwork",
            "problem solving", "analytical", "strategic", "results-driven",
            "innovation", "collaboration", "project management"
        ]
    }
    
    def __init__(self):
        """Initialize resume evaluator."""
        self.max_score = 100
    
    async def evaluate_resume(
        self,
        resume_data: Dict[str, Any],
        job_description: str = "",
        role_type: str = "general"
    ) -> Dict[str, Any]:
        """
        Evaluate resume and provide scoring and recommendations.
        
        Args:
            resume_data: Resume content in dict format
            job_description: Target job description for gap analysis
            role_type: Type of role (software_engineer, data_scientist, etc.)
        
        Returns:
            Evaluation report with scores and recommendations
        """
        try:
            # Calculate individual scores
            format_score = self._evaluate_format(resume_data)
            content_score = self._evaluate_content(resume_data)
            ats_score = self._evaluate_ats_optimization(resume_data, role_type)
            achievement_score = self._evaluate_achievements(resume_data)
            keyword_score = self._evaluate_keywords(resume_data, job_description, role_type)
            
            # Calculate weighted overall score
            overall_score = (
                format_score * self.SCORING_CRITERIA["format"] +
                content_score * self.SCORING_CRITERIA["content"] +
                ats_score * self.SCORING_CRITERIA["ats_optimization"] +
                achievement_score * self.SCORING_CRITERIA["achievements"] +
                keyword_score * self.SCORING_CRITERIA["keywords"]
            ) / 100
            
            # Generate recommendations
            recommendations = self._generate_recommendations(
                resume_data, format_score, content_score, ats_score,
                achievement_score, keyword_score, job_description
            )
            
            return {
                "evaluation_date": datetime.utcnow().isoformat(),
                "role_type": role_type,
                "scores": {
                    "format": round(format_score, 1),
                    "content": round(content_score, 1),
                    "ats_optimization": round(ats_score, 1),
                    "achievements": round(achievement_score, 1),
                    "keywords": round(keyword_score, 1),
                    "overall": round(overall_score, 1)
                },
                "rating": self._get_rating(overall_score),
                "recommendations": recommendations,
                "ats_pass_likelihood": self._get_ats_likelihood(ats_score),
                "improvement_areas": self._identify_improvement_areas(
                    format_score, content_score, ats_score,
                    achievement_score, keyword_score
                )
            }
        
        except Exception as e:
            logger.error(f"Error evaluating resume: {str(e)}")
            return {"error": str(e), "evaluation_date": datetime.utcnow().isoformat()}
    
    def _evaluate_format(self, resume_data: Dict[str, Any]) -> float:
        """Evaluate resume format and structure (0-100)."""
        score = 100
        
        # Check length
        sections = len([s for s in resume_data.values() if s])
        if sections < 4:
            score -= 20
        
        # Check for clear sections
        required_sections = ["personalInfo", "summary", "experience", "skills"]
        missing_sections = [s for s in required_sections if not resume_data.get(s)]
        score -= len(missing_sections) * 10
        
        # Check formatting
        if resume_data.get("personalInfo", {}).get("fullName"):
            score = min(100, score + 5)
        
        return max(0, score)
    
    def _evaluate_content(self, resume_data: Dict[str, Any]) -> float:
        """Evaluate content quality (0-100)."""
        score = 0
        
        # Professional summary
        summary = resume_data.get("summary", "")
        if summary and len(summary) > 100:
            score += 25
        elif summary:
            score += 15
        
        # Experience
        experience = resume_data.get("experience", [])
        if len(experience) >= 2:
            score += 25
        elif len(experience) == 1:
            score += 15
        
        # Each experience entry should have description
        detailed_exp = sum(1 for exp in experience if exp.get("description"))
        if detailed_exp == len(experience) and len(experience) > 0:
            score += 15
        
        # Education
        if resume_data.get("education"):
            score += 15
        
        # Skills
        skills = resume_data.get("skills", [])
        if len(skills) >= 10:
            score += 20
        elif len(skills) >= 5:
            score += 10
        
        return min(100, score)
    
    def _evaluate_ats_optimization(self, resume_data: Dict[str, Any], role_type: str) -> float:
        """Evaluate ATS optimization (0-100)."""
        score = 50
        
        # Check for common ATS issues
        all_text = str(resume_data).lower()
        
        # Tables and graphics (bad for ATS)
        if any(char in str(resume_data) for char in ["┌", "├", "│", "└", "─"]):
            score -= 20
        
        # Standard formatting
        if resume_data.get("personalInfo", {}).get("email"):
            score += 10
        if resume_data.get("personalInfo", {}).get("phone"):
            score += 10
        
        # Date formatting consistency
        experience = resume_data.get("experience", [])
        if all(exp.get("startDate") for exp in experience):
            score += 10
        
        # Consistent structure
        if all(exp.get("description") for exp in experience):
            score += 10
        
        return min(100, score)
    
    def _evaluate_achievements(self, resume_data: Dict[str, Any]) -> float:
        """Evaluate use of achievements and metrics (0-100)."""
        score = 0
        
        # Action verbs
        action_verbs = [
            "led", "managed", "designed", "developed", "built", "created",
            "increased", "reduced", "improved", "optimized", "launched",
            "achieved", "exceeded", "collaborated", "implemented"
        ]
        
        all_text = str(resume_data).lower()
        verb_count = sum(1 for verb in action_verbs if verb in all_text)
        
        score += min(40, verb_count * 5)
        
        # Metrics/numbers
        import re
        numbers = re.findall(r'\d+[%$KM]?', all_text)
        score += min(30, len(numbers) * 2)
        
        # Specific accomplishments
        accomplishment_words = ["first", "only", "award", "recognition", "promoted"]
        accomplishment_count = sum(1 for word in accomplishment_words if word in all_text)
        score += min(30, accomplishment_count * 5)
        
        return min(100, score)
    
    def _evaluate_keywords(
        self,
        resume_data: Dict[str, Any],
        job_description: str,
        role_type: str
    ) -> float:
        """Evaluate presence of relevant keywords (0-100)."""
        score = 0
        
        all_text = str(resume_data).lower()
        
        # Check for role-specific keywords
        role_keywords = self.ATS_KEYWORDS.get(role_type, self.ATS_KEYWORDS["general"])
        keyword_matches = sum(1 for keyword in role_keywords if keyword in all_text)
        
        score += min(50, keyword_matches * 2)
        
        # Check against job description if provided
        if job_description:
            job_keywords = set(job_description.lower().split())
            job_keyword_matches = sum(1 for keyword in job_keywords if keyword in all_text)
            score += min(50, job_keyword_matches)
        else:
            score += 20  # Bonus for having general keywords
        
        return min(100, score)
    
    def _generate_recommendations(
        self,
        resume_data: Dict[str, Any],
        *scores
    ) -> List[Dict[str, str]]:
        """Generate actionable recommendations based on scores."""
        format_score, content_score, ats_score, achievement_score, keyword_score = scores
        recommendations = []
        
        # Format recommendations
        if format_score < 80:
            recommendations.append({
                "priority": "high",
                "category": "Format",
                "suggestion": "Use clean, simple formatting. Avoid tables, graphics, and unusual fonts. "
                            "Use standard fonts like Arial, Calibri, or Times New Roman."
            })
        
        # Content recommendations
        if content_score < 70:
            recommendations.append({
                "priority": "high",
                "category": "Content",
                "suggestion": "Expand your experience and education sections. Ensure each entry has "
                            "meaningful descriptions of your responsibilities and achievements."
            })
        
        # ATS recommendations
        if ats_score < 75:
            recommendations.append({
                "priority": "high",
                "category": "ATS Optimization",
                "suggestion": "Optimize for ATS systems. Use standard section headers, maintain consistent "
                            "formatting, and avoid graphics/tables. Include relevant keywords naturally."
            })
        
        # Achievement recommendations
        if achievement_score < 70:
            recommendations.append({
                "priority": "medium",
                "category": "Achievements",
                "suggestion": "Use action verbs and quantifiable metrics. Replace vague descriptions with "
                            "specific examples: 'Increased revenue by 25%' vs 'Responsible for sales.'"
            })
        
        # Keyword recommendations
        if keyword_score < 70:
            recommendations.append({
                "priority": "medium",
                "category": "Keywords",
                "suggestion": "Include more industry-specific keywords and technical terms relevant to your role. "
                            "Mirror language from job descriptions you're targeting."
            })
        
        # Quick wins
        if not recommendations:
            recommendations.append({
                "priority": "low",
                "category": "Optimization",
                "suggestion": "Consider adding a 'Projects' section to showcase specific accomplishments, "
                            "or expand your professional summary with more details about your expertise."
            })
        
        return recommendations
    
    def _get_rating(self, score: float) -> str:
        """Get resume rating."""
        if score >= 85:
            return "excellent"
        elif score >= 75:
            return "good"
        elif score >= 60:
            return "fair"
        else:
            return "needs_work"
    
    def _get_ats_likelihood(self, ats_score: float) -> str:
        """Get likelihood of passing ATS systems."""
        if ats_score >= 80:
            return "Very High (90%+)"
        elif ats_score >= 70:
            return "High (70-90%)"
        elif ats_score >= 60:
            return "Moderate (50-70%)"
        else:
            return "Low (< 50%)"
    
    def _identify_improvement_areas(self, *scores) -> List[str]:
        """Identify top areas for improvement."""
        areas = []
        score_names = ["format", "content", "ats_optimization", "achievements", "keywords"]
        
        for name, score in zip(score_names, scores):
            if score < 70:
                areas.append(name)
        
        return sorted(areas, key=lambda x: score_names.index(x))[:3]
