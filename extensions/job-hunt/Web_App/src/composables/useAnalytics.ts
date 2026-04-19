// Analytics composable for tracking user events
// Uses Google Analytics 4 (gtag) and LinkedIn Insight Tag

export const useAnalytics = () => {
  // Get the global gtag function (injected by vue-gtag)
  const gtag = typeof window !== 'undefined' ? (window as any).gtag : undefined

  // Track page views
  const trackPageView = (pageName: string, pageTitle: string) => {
    if (gtag) {
      gtag('config', 'pageview', {
        page_path: `/${pageName}`,
        page_title: pageTitle,
        page_location: window.location.href
      })
    }
  }

  // Track events with custom parameters
  const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
    if (gtag) {
      gtag('event', eventName, eventData)
    }
  }

  // Feature-specific tracking
  const trackFeatureView = (feature: string) => {
    trackEvent('view_feature', {
      feature_name: feature,
      timestamp: new Date().toISOString()
    })
  }

  const trackJobAdded = (jobData: { company: string; position: string; status: string }) => {
    trackEvent('job_added', {
      company: jobData.company,
      position: jobData.position,
      status: jobData.status,
      timestamp: new Date().toISOString()
    })
  }

  const trackJobDeleted = (jobData: { company: string; position: string }) => {
    trackEvent('job_deleted', {
      company: jobData.company,
      position: jobData.position,
      timestamp: new Date().toISOString()
    })
  }

  const trackResumeBuilt = (resumeData: { skills: string[]; experience: any[] }) => {
    trackEvent('resume_built', {
      skill_count: resumeData.skills.filter((s: string) => s.trim()).length,
      experience_count: resumeData.experience.length,
      timestamp: new Date().toISOString()
    })
  }

  const trackResumeSaved = () => {
    trackEvent('resume_saved', {
      timestamp: new Date().toISOString()
    })
  }

  const trackInterviewPractice = (questionData: { category: string; difficulty: string; answered: boolean }) => {
    trackEvent('interview_practice', {
      category: questionData.category,
      difficulty: questionData.difficulty,
      answered: questionData.answered,
      timestamp: new Date().toISOString()
    })
  }

  const trackAIMatching = (matchData: { total_jobs: number; top_matches: number; avg_score: number }) => {
    trackEvent('ai_matching_run', {
      total_jobs_analyzed: matchData.total_jobs,
      high_match_count: matchData.top_matches,
      average_match_score: matchData.avg_score,
      timestamp: new Date().toISOString()
    })
  }

  const trackJobsImported = (count: number, source: string) => {
    trackEvent('jobs_imported', {
      job_count: count,
      source: source,
      timestamp: new Date().toISOString()
    })
  }

  const trackEmailTemplateCopied = (templateName: string) => {
    trackEvent('email_template_copied', {
      template_name: templateName,
      timestamp: new Date().toISOString()
    })
  }

  const trackUserSignIn = (provider: string) => {
    trackEvent('user_signin', {
      provider: provider,
      timestamp: new Date().toISOString()
    })
  }

  const trackUserSignOut = () => {
    trackEvent('user_signout', {
      timestamp: new Date().toISOString()
    })
  }

  const trackThemeToggle = (theme: 'light' | 'dark') => {
    trackEvent('theme_toggle', {
      theme: theme,
      timestamp: new Date().toISOString()
    })
  }

  // LinkedIn Pixel tracking
  const trackLinkedInEvent = (eventName: string, eventData: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && (window as any).lintrk) {
      (window as any).lintrk('track', eventName, eventData)
    }
  }

  const trackLinkedInConversion = (conversionId: string, value?: number) => {
    if (typeof window !== 'undefined' && (window as any).lintrk) {
      (window as any).lintrk('track', 'conversion', {
        conversion_id: conversionId,
        value: value || 0
      })
    }
  }

  return {
    trackPageView,
    trackEvent,
    trackFeatureView,
    trackJobAdded,
    trackJobDeleted,
    trackResumeBuilt,
    trackResumeSaved,
    trackInterviewPractice,
    trackAIMatching,
    trackJobsImported,
    trackEmailTemplateCopied,
    trackUserSignIn,
    trackUserSignOut,
    trackThemeToggle,
    trackLinkedInEvent,
    trackLinkedInConversion
  }
}
