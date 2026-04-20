/**AI Matching composable for comparing resumes with job descriptions.*/

import { ref, computed } from 'vue'
import { useJobTracker } from './useJobTracker'

export interface MatchingAnalysis {
  overallScore: number
  summary: string
  matchedSkills: string[]
  missingSkills: string[]
  recommendations: string[]
  experienceGap?: string
  highlightedStrengths: string[]
}

export function useAIMatching() {
  const { jobs } = useJobTracker()
  const isAnalyzing = ref(false)
  const error = ref('')
  const lastAnalysis = ref<MatchingAnalysis | null>(null)

  /**Extract skills from text using keyword matching.*/
  const extractSkills = (text: string): string[] => {
    const skillKeywords = [
      'javascript', 'typescript', 'python', 'java', 'c#', 'golang', 'rust', 'ruby', 'php',
      'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'gatsby', 'remix',
      'node.js', 'express', 'fastapi', 'django', 'flask', 'spring', 'nestjs',
      'postgresql', 'mysql', 'mongodb', 'firestore', 'redis', 'elasticsearch',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible',
      'git', 'ci/cd', 'jenkins', 'gitlab', 'github actions', 'circleci',
      'testing', 'jest', 'pytest', 'vitest', 'mocha', 'jasmine',
      'agile', 'scrum', 'kanban', 'jira', 'asana',
      'rest', 'graphql', 'soap', 'microservices', 'grpc',
      'sql', 'nosql', 'orm', 'sql injection',
      'html', 'css', 'tailwind', 'bootstrap', 'sass',
      'responsive design', 'accessibility', 'seo',
      'performance optimization', 'caching', 'load balancing',
      'security', 'authentication', 'authorization', 'oauth',
      'communication', 'leadership', 'problem solving',
      'ml', 'ai', 'machine learning', 'deep learning', 'nlp',
      'devops', 'monitoring', 'logging', 'observability',
      'api design', 'system design', 'architecture'
    ]

    const textLower = text.toLowerCase()
    const foundSkills = new Set<string>()

    skillKeywords.forEach(skill => {
      const regex = new RegExp(`\\b${skill}\\b`, 'gi')
      if (regex.test(textLower)) {
        foundSkills.add(skill)
      }
    })

    return Array.from(foundSkills).sort()
  }

  /**Analyze job description against resume.*/
  const analyzeJobDescription = async (jobDescription: string, resumeText?: string): Promise<MatchingAnalysis> => {
    try {
      isAnalyzing.value = true
      error.value = ''

      // Extract skills from job description
      const jobSkills = extractSkills(jobDescription)

      // Get resume text (from first job or parameter)
      let resumeContent = resumeText || ''
      if (!resumeContent && jobs.value.length > 0) {
        resumeContent = jobs.value.map(j => `${j.company} ${j.role} ${j.notes || ''}`).join(' ')
      }

      // Extract skills from resume
      const resumeSkills = extractSkills(resumeContent)

      // Calculate matching
      const matchedSkills = jobSkills.filter(skill => resumeSkills.includes(skill))
      const missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill))

      // Calculate score
      const matchPercentage = jobSkills.length > 0 
        ? Math.round((matchedSkills.length / jobSkills.length) * 100)
        : 50

      // Generate analysis text
      const analysisText = generateAnalysis(matchPercentage, matchedSkills, missingSkills, jobDescription, resumeContent)

      // Generate recommendations
      const recommendations = generateRecommendations(missingSkills, matchPercentage)

      // Find highlighted strengths
      const highlightedStrengths = generateStrengths(matchedSkills)

      const analysis: MatchingAnalysis = {
        overallScore: matchPercentage,
        summary: analysisText,
        matchedSkills,
        missingSkills,
        recommendations,
        highlightedStrengths,
        experienceGap: calculateExperienceGap(jobDescription, resumeContent)
      }

      lastAnalysis.value = analysis
      return analysis
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isAnalyzing.value = false
    }
  }

  const generateAnalysis = (score: number, matched: string[], missing: string[], job: string, resume: string): string => {
    if (score >= 80) {
      return `Excellent match! You have ${matched.length} of the ${matched.length + missing.length} required skills. This role aligns well with your background.`
    } else if (score >= 60) {
      return `Good match! You have ${matched.length} of the ${matched.length + missing.length} key skills. With focused learning on the missing skills, you'd be competitive for this role.`
    } else if (score >= 40) {
      return `Moderate match. You have ${matched.length} key skills but are missing ${missing.length} important ones. Consider upskilling before applying.`
    } else {
      return `There's a skills gap. You have only ${matched.length} of ${matched.length + missing.length} required skills. Focus on developing the missing skills first.`
    }
  }

  const generateRecommendations = (missing: string[], score: number): string[] => {
    const recommendations: string[] = []

    if (missing.length > 0) {
      recommendations.push(`📚 Learn the top missing skills: ${missing.slice(0, 3).join(', ')}`)
    }

    if (score < 60) {
      recommendations.push('💼 Build projects demonstrating the required skills')
      recommendations.push('🎓 Take online courses or certifications in missing areas')
    }

    if (score >= 60) {
      recommendations.push('✍️ Highlight your matched skills prominently in your resume')
      recommendations.push('🎯 Frame your experience to match job requirements')
    }

    recommendations.push('🔗 Connect on LinkedIn with hiring managers at this company')
    recommendations.push('📝 Customize your cover letter to address skill gaps proactively')

    return recommendations
  }

  const generateStrengths = (matched: string[]): string[] => {
    const strengths: string[] = []

    // Categorize strengths
    const frontend = matched.filter(s => ['react', 'vue', 'angular', 'typescript', 'javascript', 'html', 'css', 'tailwind'].includes(s))
    const backend = matched.filter(s => ['node.js', 'python', 'java', 'golang', 'express', 'django'].includes(s))
    const devops = matched.filter(s => ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ci/cd'].includes(s))
    const databases = matched.filter(s => ['postgresql', 'mongodb', 'firebase', 'sql'].includes(s))
    const soft = matched.filter(s => ['communication', 'leadership', 'agile', 'problem solving'].includes(s))

    if (frontend.length > 0) strengths.push(`🎨 Strong frontend skills: ${frontend.join(', ')}`)
    if (backend.length > 0) strengths.push(`⚙️ Strong backend skills: ${backend.join(', ')}`)
    if (devops.length > 0) strengths.push(`🚀 DevOps expertise: ${devops.join(', ')}`)
    if (databases.length > 0) strengths.push(`💾 Database experience: ${databases.join(', ')}`)
    if (soft.length > 0) strengths.push(`💬 Soft skills: ${soft.join(', ')}`)

    return strengths
  }

  const calculateExperienceGap = (job: string, resume: string): string => {
    // Simple heuristic: check for seniority keywords
    const jobHasSenior = /senior|lead|principal|staff|architect|manager|director/i.test(job)
    const jobHasJunior = /junior|intern|entry|graduate/i.test(job)
    const jobHasMid = /mid-level|3-5 years|3-4 years/i.test(job)

    if (jobHasSenior) {
      return '⬆️ This is a senior role - ensure your experience demonstrates leadership'
    } else if (jobHasJunior || jobHasJunior) {
      return '✅ This is an entry-level role - focus on foundational skills'
    } else if (jobHasMid) {
      return '→ This is a mid-level role - align your experience accordingly'
    }

    return ''
  }

  const getMatchColor = (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMatchBgColor = (score: number, isDark: boolean): string => {
    if (score >= 80) return isDark ? 'bg-green-900' : 'bg-green-100'
    if (score >= 60) return isDark ? 'bg-blue-900' : 'bg-blue-100'
    if (score >= 40) return isDark ? 'bg-yellow-900' : 'bg-yellow-100'
    return isDark ? 'bg-red-900' : 'bg-red-100'
  }

  return {
    isAnalyzing,
    error,
    lastAnalysis,
    analyzeJobDescription,
    extractSkills,
    getMatchColor,
    getMatchBgColor
  }
}
