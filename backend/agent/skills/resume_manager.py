"""Resume management and history skill."""

from typing import Dict, Any, List, Optional
from datetime import datetime
import json
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class ResumeManager:
    """Manage resume versions and history."""
    
    def __init__(self, storage_dir: Path):
        """Initialize resume manager."""
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)
    
    def save_resume(
        self,
        user_id: str,
        resume_name: str,
        resume_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Save a resume version.
        
        Args:
            user_id: User ID
            resume_name: Name for this resume version
            resume_data: Resume content
        
        Returns:
            Save confirmation with metadata
        """
        try:
            user_dir = self.storage_dir / user_id
            user_dir.mkdir(parents=True, exist_ok=True)
            
            # Create versioned filename
            timestamp = datetime.utcnow().isoformat()
            safe_name = "".join(c for c in resume_name if c.isalnum() or c in " _-")
            filename = f"{safe_name}_{timestamp.replace(':', '-')}.json"
            file_path = user_dir / filename
            
            # Save resume
            metadata = {
                "version_id": filename.replace(".json", ""),
                "name": resume_name,
                "created_at": timestamp,
                "data": resume_data
            }
            
            with open(file_path, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            logger.info(f"Saved resume '{resume_name}' for user {user_id}")
            
            return {
                "success": True,
                "version_id": metadata["version_id"],
                "name": resume_name,
                "saved_at": timestamp,
                "file_path": str(file_path)
            }
        
        except Exception as e:
            logger.error(f"Error saving resume: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_resume_history(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get all saved resume versions for a user.
        
        Args:
            user_id: User ID
        
        Returns:
            List of resume versions with metadata
        """
        try:
            user_dir = self.storage_dir / user_id
            
            if not user_dir.exists():
                return []
            
            resumes = []
            
            # List all resume files
            for file_path in sorted(user_dir.glob("*.json"), reverse=True):
                try:
                    with open(file_path, 'r') as f:
                        metadata = json.load(f)
                    
                    resumes.append({
                        "version_id": metadata.get("version_id"),
                        "name": metadata.get("name"),
                        "created_at": metadata.get("created_at"),
                        "file_size": file_path.stat().st_size,
                        "is_latest": file_path == sorted(user_dir.glob("*.json"), reverse=True)[0]
                    })
                
                except Exception as e:
                    logger.warning(f"Error reading resume file {file_path}: {str(e)}")
                    continue
            
            logger.info(f"Retrieved {len(resumes)} resume versions for user {user_id}")
            return resumes
        
        except Exception as e:
            logger.error(f"Error getting resume history: {str(e)}")
            return []
    
    def load_resume(self, user_id: str, version_id: str) -> Optional[Dict[str, Any]]:
        """
        Load a specific resume version.
        
        Args:
            user_id: User ID
            version_id: Resume version ID
        
        Returns:
            Resume data or None if not found
        """
        try:
            user_dir = self.storage_dir / user_id
            file_path = user_dir / f"{version_id}.json"
            
            if not file_path.exists():
                logger.warning(f"Resume version {version_id} not found for user {user_id}")
                return None
            
            with open(file_path, 'r') as f:
                metadata = json.load(f)
            
            logger.info(f"Loaded resume version {version_id}")
            return metadata.get("data")
        
        except Exception as e:
            logger.error(f"Error loading resume: {str(e)}")
            return None
    
    def delete_resume(self, user_id: str, version_id: str) -> bool:
        """
        Delete a resume version.
        
        Args:
            user_id: User ID
            version_id: Resume version ID to delete
        
        Returns:
            Success status
        """
        try:
            user_dir = self.storage_dir / user_id
            file_path = user_dir / f"{version_id}.json"
            
            if file_path.exists():
                file_path.unlink()
                logger.info(f"Deleted resume version {version_id}")
                return True
            
            logger.warning(f"Resume version {version_id} not found")
            return False
        
        except Exception as e:
            logger.error(f"Error deleting resume: {str(e)}")
            return False
    
    def compare_resumes(
        self,
        user_id: str,
        version_id_1: str,
        version_id_2: str
    ) -> Dict[str, Any]:
        """
        Compare two resume versions.
        
        Args:
            user_id: User ID
            version_id_1: First resume version ID
            version_id_2: Second resume version ID
        
        Returns:
            Comparison report showing differences
        """
        try:
            resume1 = self.load_resume(user_id, version_id_1)
            resume2 = self.load_resume(user_id, version_id_2)
            
            if not resume1 or not resume2:
                return {"error": "One or both resume versions not found"}
            
            comparison = {
                "version_1": version_id_1,
                "version_2": version_id_2,
                "differences": {
                    "experience_added": [],
                    "experience_removed": [],
                    "education_added": [],
                    "education_removed": [],
                    "skills_added": [],
                    "skills_removed": [],
                    "summary_changed": resume1.get("summary") != resume2.get("summary")
                }
            }
            
            # Compare experience
            exp1 = {exp.get("company"): exp for exp in resume1.get("experience", [])}
            exp2 = {exp.get("company"): exp for exp in resume2.get("experience", [])}
            
            for company in exp2:
                if company not in exp1:
                    comparison["differences"]["experience_added"].append(company)
            
            for company in exp1:
                if company not in exp2:
                    comparison["differences"]["experience_removed"].append(company)
            
            # Compare education
            edu1 = {edu.get("school"): edu for edu in resume1.get("education", [])}
            edu2 = {edu.get("school"): edu for edu in resume2.get("education", [])}
            
            for school in edu2:
                if school not in edu1:
                    comparison["differences"]["education_added"].append(school)
            
            for school in edu1:
                if school not in edu2:
                    comparison["differences"]["education_removed"].append(school)
            
            # Compare skills
            skills1 = set(resume1.get("skills", []))
            skills2 = set(resume2.get("skills", []))
            
            comparison["differences"]["skills_added"] = list(skills2 - skills1)
            comparison["differences"]["skills_removed"] = list(skills1 - skills2)
            
            logger.info(f"Compared resume versions {version_id_1} and {version_id_2}")
            return comparison
        
        except Exception as e:
            logger.error(f"Error comparing resumes: {str(e)}")
            return {"error": str(e)}
    
    def create_resume_from_template(
        self,
        user_id: str,
        resume_name: str,
        template_type: str = "standard"
    ) -> Dict[str, Any]:
        """
        Create a new resume from a template.
        
        Args:
            user_id: User ID
            resume_name: Name for the new resume
            template_type: Template type (standard, technical, creative, minimal)
        
        Returns:
            New resume template
        """
        templates = {
            "standard": {
                "personalInfo": {
                    "fullName": "",
                    "email": "",
                    "phone": "",
                    "location": ""
                },
                "summary": "",
                "experience": [],
                "education": [],
                "skills": []
            },
            "technical": {
                "personalInfo": {
                    "fullName": "",
                    "email": "",
                    "phone": "",
                    "location": "",
                    "github": "",
                    "linkedin": ""
                },
                "summary": "",
                "experience": [],
                "education": [],
                "skills": [],
                "projects": [],
                "certifications": []
            },
            "creative": {
                "personalInfo": {
                    "fullName": "",
                    "email": "",
                    "phone": "",
                    "location": ""
                },
                "objective": "",
                "experience": [],
                "education": [],
                "skills": [],
                "portfolio": "",
                "awards": []
            },
            "minimal": {
                "personalInfo": {
                    "fullName": "",
                    "email": "",
                    "phone": ""
                },
                "summary": "",
                "experience": [],
                "skills": []
            }
        }
        
        template = templates.get(template_type, templates["standard"])
        
        # Save the template
        result = self.save_resume(user_id, resume_name, template)
        
        if result.get("success"):
            result["template_type"] = template_type
            result["data"] = template
        
        return result
    
    def get_resume_stats(self, user_id: str) -> Dict[str, Any]:
        """Get statistics about user's resume collection."""
        try:
            history = self.get_resume_history(user_id)
            
            if not history:
                return {
                    "total_versions": 0,
                    "oldest_resume": None,
                    "newest_resume": None,
                    "total_storage": 0
                }
            
            return {
                "total_versions": len(history),
                "oldest_resume": history[-1]["created_at"] if history else None,
                "newest_resume": history[0]["created_at"] if history else None,
                "total_storage": sum(r["file_size"] for r in history),
                "resumes": history
            }
        
        except Exception as e:
            logger.error(f"Error getting resume stats: {str(e)}")
            return {}
