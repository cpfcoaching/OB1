"""LinkedIn profile evaluation skill."""

from typing import Dict, Any, List
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class LinkedInEvaluator:
    """Evaluate LinkedIn profile and extract data for resume."""
    
    # LinkedIn profile evaluation criteria
    EVALUATION_CRITERIA = {
        "profile_completeness": {
            "photo": 10,
            "headline": 10,
            "about": 15,
            "experience": 20,
            "education": 15,
            "skills": 15,
            "recommendations": 10,
            "endorsements": 5
        },
        "content_quality": {
            "headline_strength": 10,
            "about_section": 15,
            "experience_detail": 20,
            "achievements": 20,
            "keywords": 15,
            "engagement": 10,
            "recommendations": 10
        }
    }
    
    def __init__(self):
        """Initialize LinkedIn evaluator."""
        self.max_score = 100
    
    async def evaluate_profile(
        self,
        linkedin_url: str,
        profile_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Evaluate a LinkedIn profile and provide scores and suggestions.
        
        Args:
            linkedin_url: LinkedIn profile URL
            profile_data: Extracted LinkedIn profile data
        
        Returns:
            Evaluation report with scores and recommendations
        """
        try:
            # Calculate scores
            completeness_score = self._evaluate_completeness(profile_data)
            content_score = self._evaluate_content_quality(profile_data)
            overall_score = (completeness_score + content_score) / 2
            
            # Get recommendations
            recommendations = self._get_recommendations(profile_data, overall_score)
            
            # Extract resume data
            resume_data = self._extract_resume_data(profile_data)
            
            return {
                "linkedin_url": linkedin_url,
                "evaluation_date": datetime.utcnow().isoformat(),
                "scores": {
                    "completeness": round(completeness_score, 1),
                    "content_quality": round(content_score, 1),
                    "overall": round(overall_score, 1)
                },
                "status": self._get_status(overall_score),
                "recommendations": recommendations,
                "resume_data": resume_data,
                "summary": self._generate_summary(overall_score, recommendations)
            }
        
        except Exception as e:
            logger.error(f"Error evaluating LinkedIn profile: {str(e)}")
            return {
                "error": str(e),
                "linkedin_url": linkedin_url,
                "evaluation_date": datetime.utcnow().isoformat()
            }
    
    def _evaluate_completeness(self, profile_data: Dict[str, Any]) -> float:
        """Score profile completeness (0-100)."""
        score = 0
        total_weight = 0
        
        criteria = self.EVALUATION_CRITERIA["profile_completeness"]
        
        # Check each section
        if profile_data.get("photo_url"):
            score += criteria["photo"]
        total_weight += criteria["photo"]
        
        if profile_data.get("headline"):
            score += criteria["headline"]
        total_weight += criteria["headline"]
        
        if profile_data.get("about") and len(profile_data.get("about", "")) > 100:
            score += criteria["about"]
        total_weight += criteria["about"]
        
        if profile_data.get("experience"):
            score += criteria["experience"]
        total_weight += criteria["experience"]
        
        if profile_data.get("education"):
            score += criteria["education"]
        total_weight += criteria["education"]
        
        if profile_data.get("skills"):
            score += criteria["skills"]
        total_weight += criteria["skills"]
        
        if profile_data.get("recommendations", []):
            score += criteria["recommendations"]
        total_weight += criteria["recommendations"]
        
        if profile_data.get("endorsements"):
            score += criteria["endorsements"]
        total_weight += criteria["endorsements"]
        
        return (score / total_weight * 100) if total_weight > 0 else 0
    
    def _evaluate_content_quality(self, profile_data: Dict[str, Any]) -> float:
        """Score content quality (0-100)."""
        score = 0
        criteria = self.EVALUATION_CRITERIA["content_quality"]
        
        # Headline strength
        headline = profile_data.get("headline", "")
        if len(headline) > 30 and any(keyword in headline.lower() 
                                      for keyword in ["engineer", "manager", "specialist", "expert"]):
            score += criteria["headline_strength"]
        
        # About section quality
        about = profile_data.get("about", "")
        if len(about) > 300 and len(about) < 2000:
            score += criteria["about_section"]
        
        # Experience detail
        experience = profile_data.get("experience", [])
        if experience and all(exp.get("description") for exp in experience):
            score += criteria["experience_detail"]
        
        # Achievements mentioned
        all_text = str(profile_data.get("about", "")) + str([exp.get("description", "") 
                                                             for exp in experience])
        achievement_keywords = ["led", "managed", "increased", "reduced", "built", 
                               "launched", "achieved", "improved", "optimized"]
        if any(keyword in all_text.lower() for keyword in achievement_keywords):
            score += criteria["achievements"]
        
        # Keywords/skills
        skills = profile_data.get("skills", [])
        if len(skills) >= 10:
            score += criteria["keywords"]
        
        # Engagement (recommendations)
        if profile_data.get("recommendations", []):
            score += criteria["recommendations"]
        
        return (score / sum(criteria.values())) * 100
    
    def _get_recommendations(
        self,
        profile_data: Dict[str, Any],
        overall_score: float
    ) -> List[Dict[str, str]]:
        """Generate recommendations for profile improvement."""
        recommendations = []
        
        # Photo recommendation
        if not profile_data.get("photo_url"):
            recommendations.append({
                "priority": "high",
                "category": "Photo",
                "suggestion": "Add a professional profile photo. Profiles with photos get 21x more profile views.",
                "impact": "15% score improvement"
            })
        
        # Headline recommendation
        headline = profile_data.get("headline", "")
        if len(headline) < 30 or not any(keyword in headline.lower() 
                                         for keyword in ["engineer", "manager", "specialist"]):
            recommendations.append({
                "priority": "high",
                "category": "Headline",
                "suggestion": "Improve your headline. Include your role, skills, and value proposition. "
                            "Examples: 'Backend Engineer | Python/Go | Distributed Systems'",
                "impact": "10% score improvement"
            })
        
        # About section
        about = profile_data.get("about", "")
        if not about or len(about) < 150:
            recommendations.append({
                "priority": "high",
                "category": "About Section",
                "suggestion": "Write a compelling about section (150-500 words). Share your professional journey, "
                            "skills, and what you're looking to do next.",
                "impact": "15% score improvement"
            })
        
        # Experience detail
        experience = profile_data.get("experience", [])
        if not experience or not all(exp.get("description") for exp in experience):
            recommendations.append({
                "priority": "high",
                "category": "Experience",
                "suggestion": "Add detailed descriptions to your experience entries. Use action verbs and "
                            "quantify achievements (e.g., 'Led team of 5...', 'Reduced latency by 40%')",
                "impact": "20% score improvement"
            })
        
        # Skills
        if not profile_data.get("skills") or len(profile_data.get("skills", [])) < 10:
            recommendations.append({
                "priority": "medium",
                "category": "Skills",
                "suggestion": "Add at least 10-15 relevant skills. This increases your visibility in searches.",
                "impact": "10% score improvement"
            })
        
        # Recommendations
        if not profile_data.get("recommendations", []):
            recommendations.append({
                "priority": "medium",
                "category": "Recommendations",
                "suggestion": "Request recommendations from colleagues, managers, and clients. "
                            "Aim for at least 3-5 recommendations.",
                "impact": "10% score improvement"
            })
        
        return recommendations
    
    def _extract_resume_data(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract data from LinkedIn profile to populate resume."""
        return {
            "personal_info": {
                "name": profile_data.get("name", ""),
                "headline": profile_data.get("headline", ""),
                "location": profile_data.get("location", ""),
                "email": profile_data.get("email", ""),
                "phone": profile_data.get("phone", "")
            },
            "summary": profile_data.get("about", ""),
            "experience": [
                {
                    "position": exp.get("title", ""),
                    "company": exp.get("company", ""),
                    "startDate": exp.get("start_date", ""),
                    "endDate": exp.get("end_date", ""),
                    "description": exp.get("description", "")
                }
                for exp in profile_data.get("experience", [])
            ],
            "education": [
                {
                    "degree": edu.get("degree", ""),
                    "school": edu.get("school", ""),
                    "graduationDate": edu.get("graduation_date", "")
                }
                for edu in profile_data.get("education", [])
            ],
            "skills": profile_data.get("skills", [])
        }
    
    def _get_status(self, score: float) -> str:
        """Get profile status based on score."""
        if score >= 85:
            return "excellent"
        elif score >= 70:
            return "good"
        elif score >= 50:
            return "fair"
        else:
            return "needs_improvement"
    
    def _generate_summary(
        self,
        overall_score: float,
        recommendations: List[Dict[str, str]]
    ) -> str:
        """Generate a text summary of the evaluation."""
        status = self._get_status(overall_score)
        
        summary_map = {
            "excellent": f"Your LinkedIn profile is excellent! Score: {overall_score}/100. "
                        "Your profile is well-optimized and likely to attract recruiters.",
            "good": f"Your LinkedIn profile is good! Score: {overall_score}/100. "
                   "Consider the recommendations below to make it even stronger.",
            "fair": f"Your LinkedIn profile is fair. Score: {overall_score}/100. "
                   "There's significant room for improvement. Focus on the high-priority recommendations.",
            "needs_improvement": f"Your LinkedIn profile needs improvement. Score: {overall_score}/100. "
                                "Address the high-priority items to significantly boost your visibility."
        }
        
        return summary_map.get(status, "")
    
    async def analyze_gap_for_resume(
        self,
        linkedin_data: Dict[str, Any],
        resume_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Analyze gaps between LinkedIn profile and resume.
        Suggest improvements to make resume match profile better.
        """
        gaps = {
            "missing_in_resume": [],
            "missing_in_linkedin": [],
            "suggestions": []
        }
        
        # Check for experience not in resume
        linkedin_exp = [exp.get("company", "") for exp in linkedin_data.get("experience", [])]
        resume_exp = [exp.get("company", "") for exp in resume_data.get("experience", [])]
        
        for company in linkedin_exp:
            if company and company not in resume_exp:
                gaps["missing_in_resume"].append({
                    "type": "experience",
                    "value": company,
                    "suggestion": f"Add '{company}' experience to your resume"
                })
        
        # Check for skills
        linkedin_skills = set(linkedin_data.get("skills", []))
        resume_skills = set(resume_data.get("skills", []))
        
        missing_skills = linkedin_skills - resume_skills
        if missing_skills:
            gaps["missing_in_resume"].append({
                "type": "skills",
                "value": list(missing_skills),
                "suggestion": f"Add these skills to your resume: {', '.join(missing_skills)}"
            })
        
        # Check for achievements in LinkedIn not emphasized in resume
        gaps["suggestions"].append({
            "type": "emphasis",
            "suggestion": "Review LinkedIn experience descriptions and add quantifiable achievements to resume"
        })
        
        return gaps
