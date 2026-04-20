"""Configuration management for Job Hunt Agent Backend."""

import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Firebase
    firebase_project_id: str = ""
    firebase_private_key_id: str = ""
    firebase_private_key: str = ""
    firebase_client_email: str = ""
    firebase_client_id: str = ""
    firebase_auth_uri: str = "https://accounts.google.com/o/oauth2/auth"
    firebase_token_uri: str = "https://oauth2.googleapis.com/token"
    
    # LLM APIs
    anthropic_api_key: str = ""
    google_api_key: str = ""
    
    # Server
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = False
    
    # Agent Configuration
    scraper_timeout: int = 30
    scraper_headless: bool = True
    max_workers: int = 3
    
    # Paths
    base_dir: Path = Path(__file__).parent
    memory_dir: Path = Path(__file__).parent / "agent" / "memory"
    skills_dir: Path = Path(__file__).parent / "agent" / "skills"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"


settings = Settings()

# Ensure memory directory exists
settings.memory_dir.mkdir(parents=True, exist_ok=True)
