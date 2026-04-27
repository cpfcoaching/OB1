import { ref } from 'vue'

export interface AIMatchResult {
  overallScore: number
  summary: string
  experienceGap?: string
  matchedSkills: string[]
  missingSkills: string[]
  highlightedStrengths: string[]
  recommendations: string[]
}

const KNOWN_SKILLS = [
  'javascript',
  'typescript',
  'vue',
  'react',
  'node',
  'python',
  'sql',
  'aws',
  'azure',
  'docker',
  'kubernetes',
  'firebase',
  'rest',
  'graphql',
  'git',
  'ci/cd',
  'tailwind',
  'testing',
] as const

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s/+-]/g, ' ')
}

function detectSkills(jobDescription: string): string[] {
  const text = normalize(jobDescription)
  return KNOWN_SKILLS.filter((skill) => text.includes(skill))
}

function scoreFromSkills(foundSkills: string[]): number {
  const base = 45
  const skillBoost = Math.min(45, foundSkills.length * 5)
  return Math.max(20, Math.min(95, base + skillBoost))
}

function buildSummary(score: number, foundSkills: string[]): string {
  if (foundSkills.length === 0) {
    return 'This posting is light on concrete technical requirements. Add a fuller description for a better analysis.'
  }

  if (score >= 80) {
    return 'Strong alignment detected. Your profile appears to match most of the role\'s technical signals.'
  }

  if (score >= 65) {
    return 'Good potential fit with room to improve. Highlight relevant projects and outcomes tied to the listed stack.'
  }

  return 'Partial fit. Focus your resume on the core technologies in this posting and close the highest-impact skill gaps.'
}

function buildRecommendations(foundSkills: string[], missingSkills: string[]): string[] {
  const recs: string[] = []

  if (foundSkills.length > 0) {
    recs.push(`Lead with ${foundSkills.slice(0, 3).join(', ')} in your resume summary and top bullet points.`)
  }

  if (missingSkills.length > 0) {
    recs.push(`Address likely gaps in ${missingSkills.slice(0, 2).join(' and ')} with concrete project examples.`)
  }

  recs.push('Quantify impact in each relevant experience bullet (performance, revenue, reliability, or speed).')
  recs.push('Mirror critical wording from the posting to improve ATS keyword alignment.')

  return recs
}

export function useAIMatching() {
  const isAnalyzing = ref(false)
  const error = ref<string | null>(null)
  const lastAnalysis = ref<AIMatchResult | null>(null)

  async function analyzeJobDescription(jobDescription: string): Promise<void> {
    const input = jobDescription.trim()
    if (!input) {
      error.value = 'Please paste a job description first.'
      return
    }

    isAnalyzing.value = true
    error.value = null

    try {
      const matchedSkills = detectSkills(input)
      const missingSkills = KNOWN_SKILLS.filter((s) => !matchedSkills.includes(s)).slice(0, 6)
      const overallScore = scoreFromSkills(matchedSkills)

      lastAnalysis.value = {
        overallScore,
        summary: buildSummary(overallScore, matchedSkills),
        experienceGap:
          matchedSkills.length < 3
            ? 'The posting expects broader stack coverage than currently reflected. Add targeted project bullets for adjacent tools and responsibilities.'
            : undefined,
        matchedSkills: matchedSkills.map((s) => s.toUpperCase()).slice(0, 10),
        missingSkills: missingSkills.map((s) => s.toUpperCase()),
        highlightedStrengths: [
          matchedSkills.length >= 1 ? `Relevant stack coverage: ${matchedSkills.slice(0, 4).join(', ')}` : 'Technology stack is unclear in the posting.',
          'Opportunity to tailor bullets to role-specific requirements.',
        ],
        recommendations: buildRecommendations(matchedSkills, missingSkills),
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to analyze the job description.'
    } finally {
      isAnalyzing.value = false
    }
  }

  function getMatchColor(score: number): string {
    if (score >= 85) return 'text-green-500'
    if (score >= 70) return 'text-blue-500'
    if (score >= 55) return 'text-yellow-500'
    return 'text-red-500'
  }

  function getMatchBgColor(score: number, isDark: boolean): string {
    if (score >= 85) return isDark ? 'bg-green-900/20' : 'bg-green-50'
    if (score >= 70) return isDark ? 'bg-blue-900/20' : 'bg-blue-50'
    if (score >= 55) return isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'
    return isDark ? 'bg-red-900/20' : 'bg-red-50'
  }

  return {
    isAnalyzing,
    error,
    lastAnalysis,
    analyzeJobDescription,
    getMatchColor,
    getMatchBgColor,
  }
}
