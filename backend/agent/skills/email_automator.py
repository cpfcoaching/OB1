"""Email automation skill for follow-ups and applications."""

from typing import List, Dict, Any
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

logger = logging.getLogger(__name__)


class EmailAutomator:
    """Autonomous email automation skill."""
    
    # Email templates
    TEMPLATES = {
        "followup": """
Dear {recruiter_name},

I hope this email finds you well. I recently applied for the {position} role at {company} and wanted to follow up on my application.

I'm very interested in this opportunity and believe my background in {skills} aligns well with the requirements.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
{user_name}
""",
        "inquiry": """
Hello {recruiter_name},

I recently came across the {position} opening at {company} and was impressed by the role and team.

With my experience in {skills}, I believe I could make a valuable contribution to your team.

I would love to discuss how I can help {company} achieve its goals.

Best regards,
{user_name}
""",
        "thank_you": """
Dear {recruiter_name},

Thank you for taking the time to interview me for the {position} position at {company}.

I appreciated learning more about the team and the exciting projects you're working on. I remain very interested in this opportunity.

Please let me know if you need any additional information from me.

Best regards,
{user_name}
"""
    }
    
    def __init__(self, smtp_server: str = "smtp.gmail.com", smtp_port: int = 587):
        """Initialize email automator."""
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.sent_emails = []
    
    async def send_followup_emails(
        self,
        applications: List[Dict[str, Any]],
        user_email: str,
        user_password: str,
        user_name: str,
        template_type: str = "followup"
    ) -> Dict[str, Any]:
        """
        Send follow-up emails to recruiters.
        
        Args:
            applications: List of applications with recruiter info
            user_email: Gmail address to send from
            user_password: Gmail app password
            user_name: User's name for signature
            template_type: Which template to use
        
        Returns:
            Results of email sending attempts
        """
        results = {
            "sent": [],
            "failed": [],
            "timestamp": datetime.utcnow().isoformat()
        }
        
        for app in applications:
            try:
                # Prepare email
                email_body = self._prepare_email(template_type, app, user_name)
                recipient = app.get("recruiter_email")
                
                if not recipient:
                    results["failed"].append({
                        "application": app,
                        "reason": "No recruiter email provided"
                    })
                    continue
                
                # Send email
                success = await self._send_email(
                    user_email,
                    user_password,
                    recipient,
                    subject=f"Re: {app.get('position')} at {app.get('company')}",
                    body=email_body
                )
                
                if success:
                    results["sent"].append({
                        "to": recipient,
                        "company": app.get("company"),
                        "position": app.get("position"),
                        "sent_at": datetime.utcnow().isoformat()
                    })
                else:
                    results["failed"].append({
                        "application": app,
                        "reason": "Failed to send"
                    })
            
            except Exception as e:
                logger.error(f"Error sending followup email: {str(e)}")
                results["failed"].append({
                    "application": app,
                    "reason": str(e)
                })
        
        return results
    
    def _prepare_email(
        self,
        template_type: str,
        application: Dict[str, Any],
        user_name: str
    ) -> str:
        """Prepare email body from template."""
        template = self.TEMPLATES.get(template_type, self.TEMPLATES["followup"])
        
        # Extract skills as comma-separated string
        skills = ", ".join(application.get("skills", ["Python", "Backend", "Data"]))
        
        # Format template with application details
        body = template.format(
            recruiter_name=application.get("recruiter_name", "Hiring Manager"),
            position=application.get("position", "Software Engineer"),
            company=application.get("company", "Company"),
            skills=skills,
            user_name=user_name
        )
        
        return body
    
    async def _send_email(
        self,
        from_email: str,
        password: str,
        to_email: str,
        subject: str,
        body: str
    ) -> bool:
        """Send email via SMTP."""
        try:
            msg = MIMEMultipart()
            msg["From"] = from_email
            msg["To"] = to_email
            msg["Subject"] = subject
            
            msg.attach(MIMEText(body, "plain"))
            
            # Connect and send
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(from_email, password)
            server.send_message(msg)
            server.quit()
            
            logger.info(f"Email sent to {to_email}")
            return True
        
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return False
    
    def get_draft_emails(
        self,
        applications: List[Dict[str, Any]],
        user_name: str,
        template_type: str = "followup"
    ) -> List[Dict[str, Any]]:
        """
        Generate draft emails for review before sending.
        This implements the 'ask_user' confirmation principle.
        """
        drafts = []
        
        for app in applications:
            body = self._prepare_email(template_type, app, user_name)
            drafts.append({
                "to": app.get("recruiter_email"),
                "company": app.get("company"),
                "position": app.get("position"),
                "subject": f"Re: {app.get('position')} at {app.get('company')}",
                "body": body,
                "requires_approval": True
            })
        
        return drafts
