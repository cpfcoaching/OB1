/**
 * LinkedIn Profile Data Parser
 * Parses LinkedIn JSON data and converts it to resume format
 */

interface LinkedInProfile {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  location?: string
  headline?: string
  summary?: string
  experience?: Array<{
    title?: string
    companyName?: string
    startDate?: string
    endDate?: string
    description?: string
  }>
  education?: Array<{
    schoolName?: string
    fieldOfStudy?: string
    startDate?: string
    endDate?: string
  }>
  skills?: string[]
}

export interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
  }
  summary: string
  experience: Array<{
    position: string
    company: string
    startDate: string
    endDate: string
    description: string
  }>
  education: Array<{
    degree: string
    school: string
    graduationDate: string
  }>
  skills: string[]
}

/**
 * Parse LinkedIn JSON profile data
 */
export function parseLinkedInData(jsonData: string): Partial<ResumeData> | null {
  try {
    const profile: LinkedInProfile = JSON.parse(jsonData)
    
    return {
      personalInfo: {
        fullName: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || ''
      },
      summary: profile.summary || profile.headline || '',
      experience: (profile.experience || []).map(exp => ({
        position: exp.title || '',
        company: exp.companyName || '',
        startDate: formatDate(exp.startDate),
        endDate: exp.endDate ? formatDate(exp.endDate) : '',
        description: exp.description || ''
      })),
      education: (profile.education || []).map(edu => ({
        degree: edu.fieldOfStudy || '',
        school: edu.schoolName || '',
        graduationDate: formatDate(edu.endDate)
      })),
      skills: profile.skills || []
    }
  } catch (error) {
    console.error('Error parsing LinkedIn data:', error)
    return null
  }
}

/**
 * Validate LinkedIn URL format
 */
export function isValidLinkedInURL(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.includes('linkedin.com')
  } catch {
    return false
  }
}

/**
 * Format date string from various formats to YYYY-MM
 */
function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  
  try {
    // Handle various date formats
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
  } catch {
    return ''
  }
}

/**
 * Merge parsed LinkedIn data with existing resume data
 */
export function mergeWithResume(
  currentResume: ResumeData,
  linkedInData: Partial<ResumeData>
): ResumeData {
  return enrichResumeWithLinkedInContext(currentResume, linkedInData)
}

/**
 * Enrich a base resume with LinkedIn context.
 * Base resume content (e.g. parsed from DOCX/PDF) stays primary, while
 * LinkedIn fills gaps and contributes extra identity/context entries.
 */
export function enrichResumeWithLinkedInContext(
  baseResume: ResumeData,
  linkedInData: Partial<ResumeData>
): ResumeData {
  const linkedInExperience = linkedInData.experience || []
  const linkedInEducation = linkedInData.education || []
  const linkedInSkills = linkedInData.skills || []

  return {
    personalInfo: {
      fullName: linkedInData.personalInfo?.fullName || baseResume.personalInfo.fullName,
      email: linkedInData.personalInfo?.email || baseResume.personalInfo.email,
      phone: linkedInData.personalInfo?.phone || baseResume.personalInfo.phone,
      location: linkedInData.personalInfo?.location || baseResume.personalInfo.location
    },
    summary: chooseSummary(baseResume.summary, linkedInData.summary),
    experience: mergeExperience(baseResume.experience, linkedInExperience),
    education: mergeEducation(baseResume.education, linkedInEducation),
    skills: mergeSkills(baseResume.skills, linkedInSkills)
  }
}

function chooseSummary(baseSummary: string, linkedInSummary?: string): string {
  if (!baseSummary?.trim()) {
    return linkedInSummary?.trim() || ''
  }

  return baseSummary
}

function mergeExperience(
  base: ResumeData['experience'],
  linkedIn: ResumeData['experience']
): ResumeData['experience'] {
  const merged = [...base]

  for (const entry of linkedIn) {
    const key = normalizeKey(`${entry.position}|${entry.company}|${entry.startDate}|${entry.endDate}`)
    const existingIndex = merged.findIndex((candidate) => {
      const candidateKey = normalizeKey(
        `${candidate.position}|${candidate.company}|${candidate.startDate}|${candidate.endDate}`
      )
      return candidateKey === key
    })

    if (existingIndex === -1) {
      merged.push(entry)
      continue
    }

    const existing = merged[existingIndex]
    merged[existingIndex] = {
      position: existing.position || entry.position,
      company: existing.company || entry.company,
      startDate: existing.startDate || entry.startDate,
      endDate: existing.endDate || entry.endDate,
      description:
        existing.description?.trim().length >= entry.description?.trim().length
          ? existing.description
          : entry.description
    }
  }

  return merged
}

function mergeEducation(
  base: ResumeData['education'],
  linkedIn: ResumeData['education']
): ResumeData['education'] {
  const merged = [...base]

  for (const entry of linkedIn) {
    const key = normalizeKey(`${entry.degree}|${entry.school}|${entry.graduationDate}`)
    const existingIndex = merged.findIndex((candidate) => {
      const candidateKey = normalizeKey(
        `${candidate.degree}|${candidate.school}|${candidate.graduationDate}`
      )
      return candidateKey === key
    })

    if (existingIndex === -1) {
      merged.push(entry)
      continue
    }

    const existing = merged[existingIndex]
    merged[existingIndex] = {
      degree: existing.degree || entry.degree,
      school: existing.school || entry.school,
      graduationDate: existing.graduationDate || entry.graduationDate
    }
  }

  return merged
}

function mergeSkills(base: string[], linkedIn: string[]): string[] {
  const seen = new Set<string>()
  const merged: string[] = []

  for (const skill of [...base, ...linkedIn]) {
    const normalized = normalizeKey(skill)
    if (!normalized || seen.has(normalized)) {
      continue
    }

    seen.add(normalized)
    merged.push(skill)
  }

  return merged
}

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+.#/\-\s|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function hasLinkedInContext(linkedInData: Partial<ResumeData> | null): boolean {
  if (!linkedInData) {
    return false
  }

  return Boolean(
    linkedInData.personalInfo?.fullName ||
      linkedInData.personalInfo?.email ||
      linkedInData.summary ||
      linkedInData.experience?.length ||
      linkedInData.education?.length ||
      linkedInData.skills?.length
  )
}

export function linkedInContextStats(linkedInData: Partial<ResumeData> | null): {
  experienceCount: number
  educationCount: number
  skillCount: number
} {
  return {
    experienceCount: linkedInData?.experience?.length || 0,
    educationCount: linkedInData?.education?.length || 0,
    skillCount: linkedInData?.skills?.length || 0
  }
}

export function summarizeMergeDelta(previous: ResumeData, next: ResumeData): {
  experienceAdded: number
  educationAdded: number
  skillsAdded: number
} {
  return {
    experienceAdded: Math.max(next.experience.length - previous.experience.length, 0),
    educationAdded: Math.max(next.education.length - previous.education.length, 0),
    skillsAdded: Math.max(next.skills.length - previous.skills.length, 0)
  }
}
