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

interface ResumeData {
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
  return {
    personalInfo: {
      ...currentResume.personalInfo,
      ...linkedInData.personalInfo
    },
    summary: linkedInData.summary || currentResume.summary,
    experience: linkedInData.experience || currentResume.experience,
    education: linkedInData.education || currentResume.education,
    skills: linkedInData.skills || currentResume.skills
  }
}
