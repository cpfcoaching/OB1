"""Firebase integration for storing results."""

import firebase_admin
from firebase_admin import credentials, firestore
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class FirebaseClient:
    """Wrapper around Firebase for storing job hunt data."""
    
    _instance = None
    
    def __new__(cls):
        """Singleton pattern."""
        if cls._instance is None:
            cls._instance = super(FirebaseClient, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        """Initialize Firebase client."""
        if self._initialized:
            return
        
        try:
            # Initialize Firebase from environment or service account
            if not firebase_admin._apps:
                # Try to initialize with default credentials
                firebase_admin.initialize_app()
            
            self.db = firestore.client()
            self._initialized = True
            logger.info("Firebase initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {str(e)}")
            self.db = None
    
    def save_job_listings(
        self,
        user_id: str,
        jobs: Dict[str, Any]
    ) -> bool:
        """Save scraped jobs to Firestore."""
        if not self.db:
            logger.warning("Firebase not initialized")
            return False
        
        try:
            doc_ref = self.db.collection("users").document(user_id)
            doc_ref.collection("job_listings").document("latest").set(
                jobs,
                merge=True
            )
            logger.info(f"Saved {jobs.get('total_jobs', 0)} jobs for user {user_id}")
            return True
        except Exception as e:
            logger.error(f"Error saving jobs to Firebase: {str(e)}")
            return False
    
    def save_email_history(
        self,
        user_id: str,
        emails: Dict[str, Any]
    ) -> bool:
        """Save email sending history."""
        if not self.db:
            return False
        
        try:
            doc_ref = self.db.collection("users").document(user_id)
            doc_ref.collection("emails").document("latest").set(
                emails,
                merge=True
            )
            logger.info(f"Saved email history for user {user_id}")
            return True
        except Exception as e:
            logger.error(f"Error saving email history: {str(e)}")
            return False
    
    def save_interview_prep(
        self,
        user_id: str,
        prep_data: Dict[str, Any]
    ) -> bool:
        """Save interview preparation data."""
        if not self.db:
            return False
        
        try:
            doc_ref = self.db.collection("users").document(user_id)
            company = prep_data.get("company", "Unknown")
            doc_ref.collection("interview_prep").document(company).set(prep_data)
            logger.info(f"Saved interview prep for {company}")
            return True
        except Exception as e:
            logger.error(f"Error saving interview prep: {str(e)}")
            return False
    
    def get_user_applications(self, user_id: str) -> list:
        """Get user's applications from Firestore."""
        if not self.db:
            return []
        
        try:
            docs = self.db.collection("users").document(user_id).collection(
                "applications"
            ).stream()
            
            applications = []
            for doc in docs:
                applications.append({**doc.to_dict(), "id": doc.id})
            
            return applications
        except Exception as e:
            logger.error(f"Error fetching applications: {str(e)}")
            return []


# Singleton instance
firebase_client = FirebaseClient()
