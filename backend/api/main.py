"""Main FastAPI application."""

import logging
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from typing import Optional

from config import settings
from agent import initialize_agent, get_agent
from agent.core import AgentTask, Skill
from agent.skills.job_scraper import JobScraper
from agent.skills.email_automator import EmailAutomator
from agent.skills.interview_prep import InterviewPrep
from agent.skills.linkedin_evaluator import LinkedInEvaluator
from agent.skills.resume_evaluator import ResumeEvaluator
from agent.skills.resume_manager import ResumeManager
from api.models import (
    JobSearchRequest, EmailFollowupRequest, InterviewPrepRequest,
    JobScrapeResponse, EmailResponse, InterviewPrepResponse,
    TaskStatusResponse, AgentMemoryStatsResponse,
    LinkedInEvaluationRequest, LinkedInEvaluationResponse,
    ResumeEvaluationRequest, ResumeEvaluationResponse,
    ResumeSaveRequest, ResumeSaveResponse, ResumeHistoryResponse,
    ResumeComparisonRequest, ResumeComparisonResponse,
    ResumeTemplateRequest
)
from api.firebase import firebase_client

# Logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Job Hunt Agent API",
    description="Autonomous agent for job hunting automation",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Task storage for tracking
task_store = {}


@app.on_event("startup")
async def startup_event():
    """Initialize agent on startup."""
    try:
        agent = initialize_agent(settings.memory_dir)
        logger.info("Job Hunt Agent initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize agent: {str(e)}")


# ============================================================================
# Job Scraper Endpoints
# ============================================================================

@app.post("/api/scrape-jobs", response_model=JobScrapeResponse)
async def scrape_jobs(request: JobSearchRequest, background_tasks: BackgroundTasks):
    """
    Scrape jobs from multiple job boards.
    
    This endpoint triggers autonomous job scraping across LinkedIn, Indeed,
    Glassdoor, and Built In based on specified keywords and locations.
    """
    try:
        scraper = JobScraper(
            timeout=settings.scraper_timeout,
            max_results=50
        )
        
        # Run scraper
        results = await scraper.scrape_jobs(
            keywords=request.keywords,
            locations=request.locations,
            remote_only=request.remote_only,
            job_boards=request.job_boards
        )
        
        logger.info(f"Scraped {results.get('total_jobs', 0)} jobs")
        return JobScrapeResponse(**results)
    
    except Exception as e:
        logger.error(f"Error scraping jobs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/scrape-jobs-async")
async def scrape_jobs_async(request: JobSearchRequest, background_tasks: BackgroundTasks):
    """
    Async job scraping with background task.
    Returns task ID immediately.
    """
    try:
        task_id = f"scrape_{len(task_store)}"
        task = AgentTask(
            task_id=task_id,
            task_type="job_scraper",
            description=f"Scrape jobs for {', '.join(request.keywords)}",
            input_data=request.dict()
        )
        
        # Store task
        task_store[task_id] = {
            "task": task,
            "status": "running",
            "progress": 0
        }
        
        # Run in background
        async def run_scraper():
            try:
                scraper = JobScraper()
                results = await scraper.scrape_jobs(
                    keywords=request.keywords,
                    locations=request.locations,
                    remote_only=request.remote_only
                )
                task_store[task_id]["task"].output_data = results
                task_store[task_id]["task"].status = "completed"
                task_store[task_id]["progress"] = 100
            except Exception as e:
                task_store[task_id]["task"].error_message = str(e)
                task_store[task_id]["task"].status = "failed"
        
        background_tasks.add_task(run_scraper)
        
        return {"task_id": task_id, "status": "started"}
    
    except Exception as e:
        logger.error(f"Error starting async scrape: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Email Automation Endpoints
# ============================================================================

@app.post("/api/email-drafts")
async def generate_email_drafts(request: EmailFollowupRequest):
    """
    Generate draft emails for review (no sending).
    Implements the 'ask_user' confirmation principle.
    """
    try:
        emailer = EmailAutomator()
        drafts = emailer.get_draft_emails(
            applications=request.applications,
            user_name="Your Name",  # Get from user context
            template_type=request.template_type
        )
        
        return {
            "drafts": drafts,
            "count": len(drafts),
            "requires_approval": True
        }
    
    except Exception as e:
        logger.error(f"Error generating email drafts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/send-emails", response_model=EmailResponse)
async def send_followup_emails(request: EmailFollowupRequest):
    """
    Send follow-up emails to recruiters.
    
    Requires user's Gmail credentials and applications list.
    """
    try:
        if request.send_immediately is False:
            # Return drafts instead
            emailer = EmailAutomator()
            drafts = emailer.get_draft_emails(
                applications=request.applications,
                user_name="Your Name",
                template_type=request.template_type
            )
            return EmailResponse(
                sent=[],
                failed=[{"message": "Review drafts above and approve to send"}],
                timestamp=""
            )
        
        emailer = EmailAutomator()
        results = await emailer.send_followup_emails(
            applications=request.applications,
            user_email="your-email@gmail.com",  # Get from context
            user_password="app-password",  # Get from secure storage
            user_name="Your Name",
            template_type=request.template_type
        )
        
        logger.info(f"Sent {len(results['sent'])} emails")
        return EmailResponse(**results)
    
    except Exception as e:
        logger.error(f"Error sending emails: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Interview Prep Endpoints
# ============================================================================

@app.post("/api/interview-prep", response_model=InterviewPrepResponse)
async def prepare_for_interview(request: InterviewPrepRequest):
    """
    Generate comprehensive interview preparation package.
    
    Includes company research, role research, technical prep,
    interview tips, and suggested questions.
    """
    try:
        prep = InterviewPrep()
        results = await prep.prepare_for_interview(
            company=request.company,
            position=request.position,
            interview_date=request.interview_date
        )
        
        logger.info(f"Generated interview prep for {request.company}")
        return InterviewPrepResponse(**results)
    
    except Exception as e:
        logger.error(f"Error preparing for interview: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/study-schedule")
async def create_study_schedule(
    company: str,
    position: str,
    days_until_interview: int
):
    """Create personalized study schedule for interview."""
    try:
        prep = InterviewPrep()
        schedule = prep.create_study_schedule(
            days_until_interview=days_until_interview,
            focus_areas=["algorithms", "system design", "behavioral"]
        )
        return schedule
    
    except Exception as e:
        logger.error(f"Error creating schedule: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Agent Memory & Stats Endpoints
# ============================================================================

@app.get("/api/agent/memory-stats", response_model=AgentMemoryStatsResponse)
async def get_memory_stats():
    """Get agent memory statistics."""
    try:
        agent = get_agent()
        stats = agent.get_memory_stats()
        return AgentMemoryStatsResponse(**stats)
    
    except Exception as e:
        logger.error(f"Error fetching memory stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/agent/skills")
async def get_available_skills():
    """Get list of available skills."""
    try:
        agent = get_agent()
        skills = {}
        
        for skill_type, skill_list in agent.task_skills.items():
            skills[skill_type] = {
                "count": len(skill_list),
                "avg_success": agent._calculate_avg_success(skill_type)
            }
        
        return {
            "available_skills": skills,
            "total_skills": sum(len(v) for v in agent.task_skills.values())
        }
    
    except Exception as e:
        logger.error(f"Error fetching skills: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/task/{task_id}", response_model=TaskStatusResponse)
async def get_task_status(task_id: str):
    """Get status of a background task."""
    if task_id not in task_store:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_data = task_store[task_id]
    return TaskStatusResponse(
        task_id=task_id,
        task_type=task_data["task"].task_type,
        status=task_data["status"],
        progress_percent=task_data.get("progress", 0),
        output_data=task_data["task"].output_data,
        error_message=task_data["task"].error_message
    )


# ============================================================================
# LinkedIn Evaluation Endpoints
# ============================================================================

@app.post("/api/linkedin/evaluate", response_model=LinkedInEvaluationResponse)
async def evaluate_linkedin_profile(request: LinkedInEvaluationRequest):
    """
    Evaluate LinkedIn profile and extract data for resume building.
    
    Analyzes profile completeness, content quality, and provides
    recommendations for improvement plus extracted resume data.
    """
    try:
        evaluator = LinkedInEvaluator()
        result = await evaluator.evaluate_profile(
            linkedin_url=request.linkedin_url,
            profile_data=request.profile_data.dict()
        )
        
        logger.info(f"Evaluated LinkedIn profile: {request.linkedin_url}")
        return LinkedInEvaluationResponse(**result)
    
    except Exception as e:
        logger.error(f"Error evaluating LinkedIn profile: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/linkedin/gap-analysis")
async def analyze_linkedin_gap(
    linkedin_data: LinkedInProfileData,
    resume_data: dict
):
    """
    Analyze gaps between LinkedIn profile and resume.
    Suggests what to add to resume from LinkedIn data.
    """
    try:
        evaluator = LinkedInEvaluator()
        gaps = await evaluator.analyze_gap_for_resume(
            linkedin_data=linkedin_data.dict(),
            resume_data=resume_data
        )
        
        return gaps
    
    except Exception as e:
        logger.error(f"Error analyzing gap: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Resume Evaluation Endpoints
# ============================================================================

@app.post("/api/resume/evaluate", response_model=ResumeEvaluationResponse)
async def evaluate_resume(request: ResumeEvaluationRequest):
    """
    Evaluate resume for quality, ATS optimization, and fit to job description.
    
    Scores across format, content, ATS optimization, achievements, and keywords.
    Provides actionable recommendations for improvement.
    """
    try:
        evaluator = ResumeEvaluator()
        result = await evaluator.evaluate_resume(
            resume_data=request.resume_data.dict(),
            job_description=request.job_description or "",
            role_type=request.role_type
        )
        
        logger.info(f"Evaluated resume for {request.role_type} role")
        return ResumeEvaluationResponse(**result)
    
    except Exception as e:
        logger.error(f"Error evaluating resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Resume Management Endpoints
# ============================================================================

@app.post("/api/resume/save", response_model=ResumeSaveResponse)
async def save_resume(user_id: str, request: ResumeSaveRequest):
    """Save a resume version."""
    try:
        manager = ResumeManager(settings.memory_dir / "resumes")
        result = manager.save_resume(
            user_id=user_id,
            resume_name=request.resume_name,
            resume_data=request.resume_data.dict()
        )
        
        logger.info(f"Saved resume '{request.resume_name}' for user {user_id}")
        
        if result.get("success"):
            return ResumeSaveResponse(**result)
        else:
            raise HTTPException(status_code=400, detail=result.get("error"))
    
    except Exception as e:
        logger.error(f"Error saving resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/resume/history")
async def get_resume_history(user_id: str):
    """Get all saved resume versions for a user."""
    try:
        manager = ResumeManager(settings.memory_dir / "resumes")
        resumes = manager.get_resume_history(user_id)
        
        return ResumeHistoryResponse(
            resumes=resumes,
            total_versions=len(resumes)
        )
    
    except Exception as e:
        logger.error(f"Error getting resume history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/resume/load")
async def load_resume(user_id: str, version_id: str):
    """Load a specific resume version."""
    try:
        manager = ResumeManager(settings.memory_dir / "resumes")
        resume_data = manager.load_resume(user_id, version_id)
        
        if not resume_data:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        return {"resume_data": resume_data}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error loading resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/resume/delete")
async def delete_resume(user_id: str, version_id: str):
    """Delete a resume version."""
    try:
        manager = ResumeManager(settings.memory_dir / "resumes")
        success = manager.delete_resume(user_id, version_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        return {"success": True, "message": "Resume deleted"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/resume/compare", response_model=ResumeComparisonResponse)
async def compare_resumes(user_id: str, request: ResumeComparisonRequest):
    """Compare two resume versions."""
    try:
        manager = ResumeManager(settings.memory_dir / "resumes")
        comparison = manager.compare_resumes(
            user_id=user_id,
            version_id_1=request.version_id_1,
            version_id_2=request.version_id_2
        )
        
        if "error" in comparison:
            raise HTTPException(status_code=400, detail=comparison["error"])
        
        return ResumeComparisonResponse(**comparison)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error comparing resumes: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/resume/template")
async def create_resume_from_template(user_id: str, request: ResumeTemplateRequest):
    """Create a new resume from a template."""
    try:
        manager = ResumeManager(settings.memory_dir / "resumes")
        result = manager.create_resume_from_template(
            user_id=user_id,
            resume_name=request.resume_name,
            template_type=request.template_type
        )
        
        logger.info(f"Created resume from {request.template_type} template")
        return result
    
    except Exception as e:
        logger.error(f"Error creating resume from template: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/resume/stats")
async def get_resume_stats(user_id: str):
    """Get statistics about user's resume collection."""
    try:
        manager = ResumeManager(settings.memory_dir / "resumes")
        stats = manager.get_resume_stats(user_id)
        
        return stats
    
    except Exception as e:
        logger.error(f"Error getting resume stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Health Check
# ============================================================================

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    try:
        agent = get_agent()
        memory_stats = agent.get_memory_stats()
        
        return {
            "status": "healthy",
            "agent": "ready",
            "memory_stats": memory_stats
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Job Hunt Agent API",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.api_host,
        port=settings.api_port,
        log_level="info"
    )
