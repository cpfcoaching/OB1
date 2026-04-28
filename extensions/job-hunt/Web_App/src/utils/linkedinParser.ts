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

type UnknownRecord = Record<string, unknown>

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
    summary: string
    bullets: string[]
    tags: string[]
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
    const profile = parseLinkedInProfileInput(jsonData)
    if (!profile) {
      return null
    }

    const profileRecord = profile as UnknownRecord

    const firstName = pickString(profileRecord, ['firstName', 'first_name', 'givenName'])
    const lastName = pickString(profileRecord, ['lastName', 'last_name', 'familyName'])
    const email = pickString(profileRecord, ['email', 'emailAddress'])
    const phone = pickString(profileRecord, ['phone', 'phoneNumber', 'mobile'])
    const location = pickString(profileRecord, ['location'])
    const headline = pickString(profileRecord, ['headline', 'title'])
    const summary = pickString(profileRecord, ['summary', 'about', 'bio'])
    const profileExperience = pickArray(profileRecord, ['experience', 'experiences', 'positions'])
    const profileEducation = pickArray(profileRecord, ['education', 'educations'])
    const profileSkills = pickArray(profileRecord, ['skills'])
    
    return {
      personalInfo: {
        fullName: `${firstName || ''} ${lastName || ''}`.trim(),
        email: email || '',
        phone: phone || '',
        location: location || ''
      },
      summary: summary || headline || '',
      experience: profileExperience
        .map((exp) => normalizeRecord(exp))
        .filter(isUnknownRecord)
        .map((exp) => {
        const rawDesc = pickString(exp, ['description', 'summary']) || ''
        const bulletPrefixRe = /^[\u2022\-\*]\s+|^\d+\.\s+/
        const descLines = rawDesc.split(/\n/).map((l: string) => l.trim()).filter(Boolean)
        const bullets: string[] = []
        const proseLines: string[] = []
        for (const line of descLines) {
          if (bulletPrefixRe.test(line)) {
            bullets.push(line.replace(bulletPrefixRe, '').trim())
          } else {
            proseLines.push(line)
          }
        }
        return {
          position: pickString(exp, ['title', 'position', 'role']) || '',
          company: pickString(exp, ['companyName', 'company', 'organization']) || '',
          startDate: formatDate(pickString(exp, ['startDate', 'start'])),
          endDate: (pickString(exp, ['endDate', 'end']) ? formatDate(pickString(exp, ['endDate', 'end'])) : ''),
          summary: proseLines.join(' ').replace(/\s{2,}/g, ' ').trim(),
          bullets,
          tags: [],
        }
      }),
      education: profileEducation
        .map((edu) => normalizeRecord(edu))
        .filter(isUnknownRecord)
        .map((edu) => ({
          degree: pickString(edu, ['fieldOfStudy', 'degree', 'program']) || '',
          school: pickString(edu, ['schoolName', 'school', 'institution']) || '',
          graduationDate: formatDate(pickString(edu, ['endDate', 'graduationDate', 'end']))
        })),
      skills: normalizeSkills(profileSkills)
    }
  } catch (error) {
    console.error('Error parsing LinkedIn data:', error)
    return null
  }
}

function parseLinkedInProfileInput(input: string): LinkedInProfile | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const parsedJson = safeParseJson(trimmed)
  if (parsedJson && typeof parsedJson === 'object') {
    return parsedJson as LinkedInProfile
  }

  const looseJson = safeParseJson(toLooselyNormalizedJson(trimmed))
  if (looseJson && typeof looseJson === 'object') {
    return looseJson as LinkedInProfile
  }

  const fromKeyValue = parseKeyValueProfile(trimmed)
  return fromKeyValue
}

function safeParseJson(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function toLooselyNormalizedJson(input: string): string {
  return input
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/,\s*([}\]])/g, '$1')
}

function parseKeyValueProfile(input: string): LinkedInProfile | null {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return null

  const profile: LinkedInProfile = {}
  for (const line of lines) {
    const idx = line.indexOf(':')
    if (idx <= 0) continue

    const rawKey = line.slice(0, idx).trim().toLowerCase()
    const rawValue = line.slice(idx + 1).trim()
    if (!rawValue) continue

    switch (rawKey) {
      case 'first name':
      case 'firstname':
        profile.firstName = rawValue
        break
      case 'last name':
      case 'lastname':
        profile.lastName = rawValue
        break
      case 'email':
        profile.email = rawValue
        break
      case 'phone':
      case 'mobile':
        profile.phone = rawValue
        break
      case 'location':
        profile.location = rawValue
        break
      case 'headline':
      case 'title':
        profile.headline = rawValue
        break
      case 'summary':
      case 'about':
      case 'bio':
        profile.summary = rawValue
        break
      case 'skills':
        profile.skills = rawValue.split(/[;,]/g).map((s) => s.trim()).filter(Boolean)
        break
      default:
        break
    }
  }

  const hasAny = Boolean(
    profile.firstName ||
    profile.lastName ||
    profile.email ||
    profile.phone ||
    profile.location ||
    profile.headline ||
    profile.summary ||
    (profile.skills && profile.skills.length > 0)
  )

  return hasAny ? profile : null
}

function normalizeRecord(value: unknown): UnknownRecord | null {
  if (!value || typeof value !== 'object') return null
  return value as UnknownRecord
}

function isUnknownRecord(value: UnknownRecord | null): value is UnknownRecord {
  return Boolean(value)
}

function pickString(record: UnknownRecord, keys: string[]): string {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }
  return ''
}

function pickArray(record: UnknownRecord, keys: string[]): unknown[] {
  for (const key of keys) {
    const value = record[key]
    if (Array.isArray(value)) {
      return value
    }
  }
  return []
}

function normalizeSkills(rawSkills: unknown[]): string[] {
  const values: string[] = []
  for (const item of rawSkills) {
    if (typeof item === 'string') {
      values.push(item)
      continue
    }
    if (item && typeof item === 'object') {
      const record = item as UnknownRecord
      const name = pickString(record, ['name', 'skill'])
      if (name) values.push(name)
    }
  }

  return Array.from(new Set(values.map((s) => s.trim()).filter(Boolean)))
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
  const linkedInExperience = coerceExperienceArray(linkedInData.experience)
  const linkedInEducation = coerceEducationArray(linkedInData.education)
  const linkedInSkills = coerceStringArray(linkedInData.skills)

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
  const merged = [...coerceExperienceArray(base)]

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
    const existingBullets = coerceStringArray(existing.bullets)
    const entryBullets = coerceStringArray(entry.bullets)
    const existingTags = coerceStringArray(existing.tags)
    const entryTags = coerceStringArray(entry.tags)
    const existingSummaryLen = (existing.summary || '').trim().length + existingBullets.join(' ').length
    const entrySummaryLen = (entry.summary || '').trim().length + entryBullets.join(' ').length
    const mergedTags = Array.from(new Set([...existingTags, ...entryTags]))
    merged[existingIndex] = {
      position: existing.position || entry.position,
      company: existing.company || entry.company,
      startDate: existing.startDate || entry.startDate,
      endDate: existing.endDate || entry.endDate,
      summary: existingSummaryLen >= entrySummaryLen ? existing.summary : entry.summary,
      bullets: existingSummaryLen >= entrySummaryLen
        ? (existingBullets.length > 0 ? existingBullets : entryBullets)
        : (entryBullets.length > 0 ? entryBullets : existingBullets),
      tags: mergedTags,
    }
  }

  return merged
}

function mergeEducation(
  base: ResumeData['education'],
  linkedIn: ResumeData['education']
): ResumeData['education'] {
  const merged = [...coerceEducationArray(base)]

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

  const safeBase = coerceStringArray(base)
  const safeLinkedIn = coerceStringArray(linkedIn)

  for (const skill of [...safeBase, ...safeLinkedIn]) {
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
  const experience = coerceExperienceArray(linkedInData?.experience)
  const education = coerceEducationArray(linkedInData?.education)
  const skills = coerceStringArray(linkedInData?.skills)

  return {
    experienceCount: experience.length,
    educationCount: education.length,
    skillCount: skills.length
  }
}

export function summarizeMergeDelta(previous: ResumeData, next: ResumeData): {
  experienceAdded: number
  educationAdded: number
  skillsAdded: number
} {
  const previousExperience = coerceExperienceArray(previous.experience)
  const previousEducation = coerceEducationArray(previous.education)
  const previousSkills = coerceStringArray(previous.skills)
  const nextExperience = coerceExperienceArray(next.experience)
  const nextEducation = coerceEducationArray(next.education)
  const nextSkills = coerceStringArray(next.skills)

  return {
    experienceAdded: Math.max(nextExperience.length - previousExperience.length, 0),
    educationAdded: Math.max(nextEducation.length - previousEducation.length, 0),
    skillsAdded: Math.max(nextSkills.length - previousSkills.length, 0)
  }
}

function coerceStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
}

function coerceExperienceArray(value: unknown): ResumeData['experience'] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((entry): entry is ResumeData['experience'][number] => {
    return Boolean(entry && typeof entry === 'object')
  })
}

function coerceEducationArray(value: unknown): ResumeData['education'] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((entry): entry is ResumeData['education'][number] => {
    return Boolean(entry && typeof entry === 'object')
  })
}
