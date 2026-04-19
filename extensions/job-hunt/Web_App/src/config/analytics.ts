// Analytics Configuration
// Get your IDs from Google Analytics and LinkedIn Insight Tag dashboards

export const ANALYTICS_CONFIG = {
  // Google Analytics 4 Measurement ID (from Google Analytics dashboard)
  // Format: G-XXXXXXXXXX
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX',

  // LinkedIn Insight Tag ID (from LinkedIn Campaign Manager)
  // Format: Just the partner ID number
  LINKEDIN_PARTNER_ID: import.meta.env.VITE_LINKEDIN_PARTNER_ID || '123456789',

  // LinkedIn Conversion IDs for specific events
  LINKEDIN_CONVERSIONS: {
    JOB_ADDED: 'job_added',
    RESUME_CREATED: 'resume_created',
    INTERVIEW_PRACTICED: 'interview_practiced',
    JOB_MATCH: 'job_match_found'
  },

  // Enable/disable analytics in development
  ENABLE_IN_DEVELOPMENT: true,

  // Custom event names
  CUSTOM_EVENTS: {
    FEATURE_VIEW: 'feature_view',
    JOB_APPLICATION: 'job_application',
    JOB_INTERVIEW: 'job_interview',
    JOB_OFFER: 'job_offer'
  }
}

export const getAnalyticsEnabled = (): boolean => {
  const isDevelopment = import.meta.env.DEV
  if (isDevelopment && !ANALYTICS_CONFIG.ENABLE_IN_DEVELOPMENT) {
    return false
  }
  return true
}
