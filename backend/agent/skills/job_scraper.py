"""Job scraper skill for autonomous job board scraping."""

import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime
import httpx
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger(__name__)


class JobScraper:
    """Autonomous job scraper skill."""
    
    # Job board configurations
    JOB_BOARDS = {
        "linkedin": {
            "base_url": "https://www.linkedin.com/jobs/search/",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        },
        "indeed": {
            "base_url": "https://www.indeed.com/jobs",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        },
        "glassdoor": {
            "base_url": "https://www.glassdoor.com/Job/jobs.htm",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        },
        "builtin": {
            "base_url": "https://builtin.com/jobs",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        }
    }
    
    def __init__(self, timeout: int = 30, max_results: int = 50):
        """Initialize job scraper."""
        self.timeout = timeout
        self.max_results = max_results
    
    async def scrape_jobs(
        self,
        keywords: List[str],
        locations: List[str],
        remote_only: bool = False,
        job_boards: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Scrape jobs from multiple job boards.
        
        Args:
            keywords: Job search keywords (e.g., ["Python", "Backend"])
            locations: Geographic locations
            remote_only: Only fetch remote positions
            job_boards: Which boards to scrape (None = all)
        
        Returns:
            Dictionary with scraped jobs organized by source
        """
        if job_boards is None:
            job_boards = list(self.JOB_BOARDS.keys())
        
        results = {}
        
        # Create async tasks for each job board
        tasks = []
        for board in job_boards:
            if board in self.JOB_BOARDS:
                task = self._scrape_board(board, keywords, locations, remote_only)
                tasks.append((board, task))
        
        # Execute all scraping tasks concurrently
        for board, task in tasks:
            try:
                jobs = await task
                results[board] = jobs
                logger.info(f"Scraped {len(jobs)} jobs from {board}")
            except Exception as e:
                logger.error(f"Error scraping {board}: {str(e)}")
                results[board] = {"error": str(e), "jobs": []}
        
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "search_params": {
                "keywords": keywords,
                "locations": locations,
                "remote_only": remote_only
            },
            "results": results,
            "total_jobs": sum(len(r.get("jobs", [])) for r in results.values())
        }
    
    async def _scrape_board(
        self,
        board: str,
        keywords: List[str],
        locations: List[str],
        remote_only: bool
    ) -> List[Dict[str, Any]]:
        """Scrape a single job board."""
        board_config = self.JOB_BOARDS[board]
        
        # Build search query
        query_params = self._build_query_params(board, keywords, locations, remote_only)
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    board_config["base_url"],
                    params=query_params,
                    headers=board_config["headers"]
                )
                response.raise_for_status()
                
                # Parse results based on board
                jobs = self._parse_jobs(board, response.text)
                return jobs[:self.max_results]
        
        except Exception as e:
            logger.error(f"Error scraping {board}: {str(e)}")
            return []
    
    def _build_query_params(
        self,
        board: str,
        keywords: List[str],
        locations: List[str],
        remote_only: bool
    ) -> Dict[str, str]:
        """Build query parameters specific to each job board."""
        keyword = " ".join(keywords) if keywords else ""
        location = locations[0] if locations else ""
        
        params = {
            "q": keyword,
            "l": location,
        }
        
        # Board-specific parameters
        if board == "linkedin":
            if remote_only:
                params["f_WT"] = "2"  # Remote work
        elif board == "indeed":
            if remote_only:
                params["sc"] = "0kf%3Alocation%28us_remote%29%3B"
        elif board == "glassdoor":
            if remote_only:
                params["includeNoSalaryJobs"] = "true"
                params["remoteWorkType"] = "1"
        
        return params
    
    def _parse_jobs(self, board: str, html_content: str) -> List[Dict[str, Any]]:
        """Parse jobs from HTML content."""
        soup = BeautifulSoup(html_content, "html.parser")
        jobs = []
        
        # This is a simplified parser - in production use board-specific APIs
        # or more sophisticated selectors
        
        if board == "linkedin":
            job_cards = soup.find_all("div", class_="base-card")
        elif board == "indeed":
            job_cards = soup.find_all("div", class_="resultContent")
        elif board == "glassdoor":
            job_cards = soup.find_all("li", class_="react-job-listing")
        else:
            job_cards = []
        
        for card in job_cards[:self.max_results]:
            try:
                job = self._extract_job_info(board, card)
                if job:
                    jobs.append(job)
            except Exception as e:
                logger.debug(f"Error parsing job card: {str(e)}")
                continue
        
        return jobs
    
    def _extract_job_info(self, board: str, card) -> Optional[Dict[str, Any]]:
        """Extract job information from a card element."""
        job = {
            "source": board,
            "scraped_at": datetime.utcnow().isoformat()
        }
        
        # Extract title
        if board == "linkedin":
            title_elem = card.find("h3", class_="base-search-card__title")
            company_elem = card.find("h4", class_="base-search-card__subtitle")
            location_elem = card.find("span", class_="job-search-card__location")
            link_elem = card.find("a", class_="base-card__full-link")
        elif board == "indeed":
            title_elem = card.find("h2", class_="jobTitle")
            company_elem = card.find("span", class_="companyName")
            location_elem = card.find("div", class_="companyLocation")
            link_elem = card.find("a", {"data-jk": True})
        else:
            return None
        
        job["title"] = title_elem.get_text(strip=True) if title_elem else ""
        job["company"] = company_elem.get_text(strip=True) if company_elem else ""
        job["location"] = location_elem.get_text(strip=True) if location_elem else ""
        job["url"] = link_elem.get("href") if link_elem else ""
        
        return job if job.get("title") else None
    
    def validate_job_posting(self, job: Dict[str, Any]) -> bool:
        """Validate that a job posting has required fields."""
        required_fields = ["title", "company", "source"]
        return all(job.get(field) for field in required_fields)
