"""Pydantic models for API requests and responses."""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime


class JobSearchRequest(BaseModel):
    """Job search request."""
    keywords: List[str] = Field(..., example=["Python", "Backend"])
    locations: List[str] = Field(..., example=["San Francisco", "Remote"])
    remote_only: bool = False
    job_boards: Optional[List[str]] = Field(None, example=["linkedin", "indeed"])


class EmailFollowupRequest(BaseModel):
    """Email followup request."""
    applications: List[Dict[str, Any]] = Field(...)
    template_type: str = Field("followup", example="followup")
    send_immediately: bool = False  # If False, return drafts for review


class InterviewPrepRequest(BaseModel):
    """Interview prep request."""
    company: str = Field(..., example="Google")
    position: str = Field(..., example="Backend Engineer")
    interview_date: str = Field(..., example="2026-05-15")


class JobScrapeResponse(BaseModel):
    """Response from job scraping."""
    timestamp: str
    search_params: Dict[str, Any]
    results: Dict[str, Any]
    total_jobs: int


class EmailResponse(BaseModel):
    """Response from email automation."""
    sent: List[Dict[str, Any]]
    failed: List[Dict[str, Any]]
    timestamp: str


class InterviewPrepResponse(BaseModel):
    """Response from interview prep."""
    company: str
    position: str
    interview_date: str
    preparation: Dict[str, Any]
    prepared_at: str


class TaskStatusResponse(BaseModel):
    """Status of an agent task."""
    task_id: str
    task_type: str
    status: str  # pending, running, completed, failed
    progress_percent: int
    output_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None


class AgentMemoryStatsResponse(BaseModel):
    """Agent memory statistics."""
    meta_rules: int
    insight_index_entries: int
    global_facts: int
    task_skills: Dict[str, int]
    session_archives: int


# ============================================================================
# LinkedIn Evaluation Models
# ============================================================================

class LinkedInProfileData(BaseModel):
    """LinkedIn profile data."""
    name: str
    headline: str
    about: str
    photo_url: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    experience: List[Dict[str, Any]] = []
    education: List[Dict[str, Any]] = []
    skills: List[str] = []
    recommendations: List[Dict[str, Any]] = []
    endorsements: Optional[Dict[str, int]] = None


class LinkedInEvaluationRequest(BaseModel):
    """Request to evaluate LinkedIn profile."""
    linkedin_url: str
    profile_data: LinkedInProfileData


class LinkedInRecommendation(BaseModel):
    """Recommendation for LinkedIn profile."""
    priority: str  # high, medium, low
    category: str
    suggestion: str
    impact: str


class LinkedInEvaluationResponse(BaseModel):
    """Response from LinkedIn profile evaluation."""
    linkedin_url: str
    evaluation_date: str
    scores: Dict[str, float]
    status: str  # excellent, good, fair, needs_improvement
    recommendations: List[LinkedInRecommendation]
    resume_data: Dict[str, Any]
    summary: str


# ============================================================================
# Resume Evaluation Models
# ============================================================================

class ResumeData(BaseModel):
    """Resume data structure."""
    personalInfo: Dict[str, str] = {}
    summary: str = ""
    experience: List[Dict[str, str]] = []
    education: List[Dict[str, str]] = []
    skills: List[str] = []


class ResumeEvaluationRequest(BaseModel):
    """Request to evaluate resume."""
    resume_data: ResumeData
    job_description: Optional[str] = None
    role_type: str = "general"


class ResumeEvaluationResponse(BaseModel):
    """Response from resume evaluation."""
    evaluation_date: str
    role_type: str
    scores: Dict[str, float]
    rating: str
    recommendations: List[Dict[str, Any]]
    ats_pass_likelihood: str
    improvement_areas: List[str]


# ============================================================================
# Resume Management Models
# ============================================================================

class ResumeSaveRequest(BaseModel):
    """Request to save a resume."""
    resume_name: str
    resume_data: ResumeData


class ResumeSaveResponse(BaseModel):
    """Response from saving resume."""
    success: bool
    version_id: str
    name: str
    saved_at: str
    error: Optional[str] = None


class ResumeHistoryItem(BaseModel):
    """Single resume version in history."""
    version_id: str
    name: str
    created_at: str
    file_size: int
    is_latest: bool


class ResumeHistoryResponse(BaseModel):
    """List of resume versions."""
    resumes: List[ResumeHistoryItem]
    total_versions: int


class ResumeComparisonRequest(BaseModel):
    """Request to compare two resumes."""
    version_id_1: str
    version_id_2: str


class ResumeComparisonResponse(BaseModel):
    """Comparison between two resumes."""
    version_1: str
    version_2: str
    differences: Dict[str, Any]


class ResumeTemplateRequest(BaseModel):
    """Request to create resume from template."""
    resume_name: str
    template_type: str = "standard"  # standard, technical, creative, minimal
