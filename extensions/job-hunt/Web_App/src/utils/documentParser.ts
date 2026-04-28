/**
 * Document Parser for Resume Text
 * Extracts resume sections from plain text and uploaded files.
 */

import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

export interface ResumeSections {
  summary?: string
  experience?: ParsedExperienceEntry[]
  education?: ParsedEducationEntry[]
  skills?: string[]
}

export interface ParsedExperienceEntry {
  position: string
  company: string
  startDate: string
  endDate: string
  summary: string
  bullets: string[]
  tags: string[]
}

export interface ParsedEducationEntry {
  degree: string
  school: string
  graduationDate: string
}

type SectionName = 'general' | 'summary' | 'experience' | 'education' | 'skills' | 'discard'

const SECTION_KEYWORDS: Record<Exclude<SectionName, 'general' | 'discard'>, string[]> = {
  summary: [
    'summary', 'professional summary', 'overview', 'profile', 'objective', 'about me',
    'career objective', 'professional profile', 'executive summary', 'career summary',
    'about', 'bio',
  ],
  experience: [
    'experience', 'professional experience', 'work history', 'employment history', 'work experience',
    'career history', 'professional background', 'relevant experience', 'employment',
    'career experience', 'work and experience',
  ],
  education: [
    'education', 'academic background', 'academic history', 'educational background',
    'education and training', 'education training', 'degrees', 'academic qualifications',
  ],
  skills: [
    'skills', 'top skills', 'technical skills', 'core competencies', 'expertise', 'proficiencies',
    'key skills', 'technical expertise', 'areas of expertise', 'competencies',
    'technologies', 'tools and technologies', 'tech stack', 'technical proficiencies',
    'software', 'programming languages',
  ],
}

// These sections appear in LinkedIn PDF sidebars and plain-text resumes but
// contain noise we don't want mixed into other sections.
const DISCARD_SECTION_KEYWORDS = [
  'contact', 'languages', 'publications', 'honors', 'awards',
  'honors awards', 'certifications', 'licenses', 'certifications and licenses',
  'volunteering', 'volunteer experience',
  'courses', 'recommendations', 'accomplishments',
  'interests', 'hobbies', 'activities', 'personal interests',
  'patents', 'test scores', 'organizations', 'affiliations',
  'references', 'additional information',
]

const MONTHS = {
  jan: '01',
  january: '01',
  feb: '02',
  february: '02',
  mar: '03',
  march: '03',
  apr: '04',
  april: '04',
  may: '05',
  jun: '06',
  june: '06',
  jul: '07',
  july: '07',
  aug: '08',
  august: '08',
  sep: '09',
  sept: '09',
  september: '09',
  oct: '10',
  october: '10',
  nov: '11',
  november: '11',
  dec: '12',
  december: '12',
} as const

const DATE_RANGE_REGEX =
  /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4})\s*(?:-|–|—|to)\s*((?:present|current|now)|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4})/i

const DEGREE_REGEX = /(bachelor|master|ph\.?d|mba|associate|certificate|diploma)/i
const TITLE_HINT_REGEX = /(advisor|architect|analyst|consultant|director|engineer|founder|lead|manager|officer|principal|specialist|security|cto|cio|ciso|vp)/i
const SCHOOL_HINT_REGEX = /(university|college|school|institute|academy)/i

const SUPPORTED_RESUME_FILE_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const SUPPORTED_RESUME_EXTENSIONS = ['.pdf', '.docx']

export function isSupportedResumeFile(file: File): boolean {
  return (
    SUPPORTED_RESUME_FILE_TYPES.has(file.type) ||
    SUPPORTED_RESUME_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension))
  )
}

export async function extractTextFromResumeFile(file: File): Promise<string> {
  if (!isSupportedResumeFile(file)) {
    throw new Error('Unsupported file type. Please choose a PDF or DOCX resume.')
  }

  const fileName = file.name.toLowerCase()

  if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
    return extractTextFromPdf(file)
  }

  if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return extractTextFromDocx(file)
  }

  throw new Error('Unsupported file type. Please choose a PDF or DOCX resume.')
}

async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  const pageTexts: string[] = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const textContent = await page.getTextContent()
    const pageText = groupPdfTextIntoLines(textContent.items)
    pageTexts.push(pageText)
  }

  return normalizeExtractedText(pageTexts.join('\n\n'))
}

function groupPdfTextIntoLines(items: Array<unknown>): string {
  type ChunkData = { x: number; text: string; fontSize: number }
  type LineData = { y: number; maxFontSize: number; chunks: ChunkData[] }

  const lines: LineData[] = []

  for (const item of items) {
    if (
      typeof item === 'object' &&
      item !== null &&
      'str' in item &&
      'transform' in item &&
      Array.isArray((item as { transform: unknown }).transform)
    ) {
      const text = String((item as { str: unknown }).str).trim()
      const transform = (item as { transform: number[] }).transform

      if (!text || transform.length < 6) continue

      const x = transform[4]
      const y = transform[5]
      // Font size ≈ magnitude of the x-scale component of the transform matrix
      const fontSize = Math.abs(transform[0]) || Math.abs(transform[3]) || 12

      let targetLine = lines.find((line) => Math.abs(line.y - y) <= 2)
      if (!targetLine) {
        targetLine = { y, maxFontSize: fontSize, chunks: [] }
        lines.push(targetLine)
      } else if (fontSize > targetLine.maxFontSize) {
        targetLine.maxFontSize = fontSize
      }
      targetLine.chunks.push({ x, text, fontSize })
    }
  }

  if (lines.length === 0) return ''

  // ── Column detection ──────────────────────────────────────────────────────
  // LinkedIn PDFs (and two-column resumes) render sidebar content at a
  // distinct x-offset. Separating columns ensures sidebar headings like
  // "Contact", "Languages", "Certifications" appear as proper standalone
  // lines so DISCARD routing works correctly.
  const allChunks = lines.flatMap((l) => l.chunks)
  const columnSplit = detectPdfColumnSplit(allChunks)

  let primaryLines: LineData[]
  let sidebarLines: LineData[]

  if (columnSplit !== null) {
    primaryLines = lines
      .map((l) => ({ ...l, chunks: l.chunks.filter((c) => c.x <= columnSplit) }))
      .filter((l) => l.chunks.length > 0)
    sidebarLines = lines
      .map((l) => ({ ...l, chunks: l.chunks.filter((c) => c.x > columnSplit) }))
      .filter((l) => l.chunks.length > 0)
  } else {
    primaryLines = lines
    sidebarLines = []
  }

  const renderColumn = (colLines: LineData[]): string => {
    const sorted = [...colLines].sort((a, b) => b.y - a.y)
    if (sorted.length === 0) return ''

    // ── y-gap section-break detection ────────────────────────────────────
    const yGaps: number[] = []
    for (let i = 0; i < sorted.length - 1; i++) {
      yGaps.push(sorted[i].y - sorted[i + 1].y)
    }
    const sortedGaps = [...yGaps].sort((a, b) => a - b)
    const medianYGap = sortedGaps[Math.floor(sortedGaps.length / 2)] || 12
    const sectionGapThreshold = medianYGap * 2.5

    // ── font-size heading detection ───────────────────────────────────────
    const fontSizes = sorted.map((l) => l.maxFontSize).sort((a, b) => a - b)
    const medianFontSize = fontSizes[Math.floor(fontSizes.length / 2)] || 12
    const headingFontThreshold = medianFontSize * 1.3

    const out: string[] = []
    for (let i = 0; i < sorted.length; i++) {
      const line = sorted[i]
      const lineText = line.chunks
        .sort((a, b) => a.x - b.x)
        .map((c) => c.text)
        .join(' ')
        .replace(/\s{2,}/g, ' ')
        .trim()

      if (!lineText) continue

      const gapBefore = i > 0 ? sorted[i - 1].y - line.y : 0
      const isLargeFont = line.maxFontSize >= headingFontThreshold

      // Insert blank line before large y-gaps (section breaks) or large-font
      // heading lines so normalizeExtractedText preserves them as boundaries.
      if (i > 0 && (gapBefore > sectionGapThreshold || isLargeFont)) {
        out.push('')
      }
      out.push(lineText)
    }
    return out.join('\n')
  }

  const mainText = renderColumn(primaryLines)
  const sidebarText = sidebarLines.length > 0 ? renderColumn(sidebarLines) : ''
  return sidebarText ? mainText + '\n\n' + sidebarText : mainText
}

/**
 * Detect a two-column split in a PDF page by finding the largest x-gap in
 * the middle 35–82 % of the page's text extent. Returns the midpoint of that
 * gap, or null if the page appears to be single-column.
 *
 * A gap ≥ 30 pt (≈ 1 cm) in that zone indicates a gutter between two columns.
 */
function detectPdfColumnSplit(chunks: Array<{ x: number }>): number | null {
  if (chunks.length < 10) return null

  // Build a sorted list of unique x-positions bucketed to 5 pt resolution
  const xBuckets = [...new Set(chunks.map((c) => Math.round(c.x / 5) * 5))].sort((a, b) => a - b)
  if (xBuckets.length < 4) return null

  const minX = xBuckets[0]
  const maxX = xBuckets[xBuckets.length - 1]
  const pageWidth = maxX - minX
  if (pageWidth < 100) return null

  // Find the largest gap between consecutive x-buckets in the middle zone
  let maxGap = 0
  let splitX = -1
  for (let i = 0; i < xBuckets.length - 1; i++) {
    const gap = xBuckets[i + 1] - xBuckets[i]
    const relative = (xBuckets[i] - minX) / pageWidth
    if (gap > maxGap && relative >= 0.35 && relative <= 0.82) {
      maxGap = gap
      splitX = (xBuckets[i] + xBuckets[i + 1]) / 2
    }
  }

  return maxGap >= 30 ? splitX : null
}

async function extractTextFromDocx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })

  return normalizeExtractedText(result.value)
}

function normalizeExtractedText(text: string): string {
  return text
    .replace(/\r/g, '')
    .replace(/\u0000/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Extract resume sections from parsed text
 * Uses simple heuristics to identify sections
 */
export function extractResumeSections(text: string): ResumeSections {
  const normalizedText = normalizeExtractedText(text)
  const lines = normalizedText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const sectionLines: Record<SectionName, string[]> = {
    general: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    discard: [],
  }

  let currentSection: SectionName = 'general'

  for (const line of lines) {
    const heading = identifySectionHeading(line)

    if (heading) {
      currentSection = heading
      // Capture any content that appears on the same line after the heading
      // keyword (e.g. "Technical Skills: Python, Java, AWS"). This is common
      // in Word resumes where the heading and list live on one line.
      if (heading !== 'discard') {
        const remainder = extractHeadingLineRemainder(line)
        if (remainder) sectionLines[currentSection].push(remainder)
      }
      continue
    }

    sectionLines[currentSection].push(line)
  }

  // Never fall back to general for structured sections — garbage-in, garbage-out.
  // Return undefined and let the user fill in manually rather than show junk.
  const summary = parseSummary(sectionLines.summary, sectionLines.general)
  const experience = parseExperienceEntries(sectionLines.experience)
  const education = parseEducationEntries(sectionLines.education)
  const skills = parseSkills(sectionLines.skills)

  return {
    summary: summary || undefined,
    experience: experience.length > 0 ? experience : undefined,
    education: education.length > 0 ? education : undefined,
    skills: skills.length > 0 ? skills : undefined,
  }
}

/**
 * If a heading line contains content after the keyword (e.g. "Skills: Python,
 * Java"), return that trailing content so it isn't silently discarded.
 */
function extractHeadingLineRemainder(line: string): string {
  const allKeywords = [
    ...Object.values(SECTION_KEYWORDS).flat(),
  ].sort((a, b) => b.length - a.length) // longest first to avoid partial matches

  const lower = line.toLowerCase()
  for (const kw of allKeywords) {
    if (lower.startsWith(kw)) {
      const rest = line.slice(kw.length).replace(/^[\s:–—\-|]+/, '').trim()
      return rest
    }
  }
  return ''
}

function identifySectionHeading(line: string): Exclude<SectionName, 'general'> | null {
  const normalized = line
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!normalized || normalized.length > 70) {
    return null
  }

  // Check discard sections first (LinkedIn sidebar noise)
  if (DISCARD_SECTION_KEYWORDS.some((kw) => normalized === kw || normalized.startsWith(`${kw} `))) {
    return 'discard'
  }

  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS) as Array<
    [Exclude<SectionName, 'general' | 'discard'>, string[]]
  >) {
    if (keywords.some((keyword) => normalized === keyword || normalized.startsWith(`${keyword} `))) {
      return section
    }
  }

  return null
}

function parseSummary(summaryLines: string[], generalLines: string[]): string {
  if (summaryLines.length > 0) {
    const merged = summaryLines.join(' ').replace(/\s{2,}/g, ' ').trim()
    if (merged.length >= 30) return merged.slice(0, 600)
  }

  // Fallback: find the first block of prose in general lines.
  // Filter out contact lines, short fragments, role/company title lines,
  // and location lines — these all appear at the top of LinkedIn PDFs and
  // produce garbage summaries if included.
  const proseLines: string[] = []
  for (const line of generalLines) {
    if (looksLikeContactLine(line)) continue
    if (line.split(' ').length < 6) continue         // too short — name/title/location fragment
    if (identifySectionHeading(line)) break           // hit a recognised section heading
    if (looksLikeRoleCompanyLine(line)) continue      // person's own title line
    if (looksLikeLocationLine(line)) continue         // "San Francisco, CA" etc.
    proseLines.push(line)
    if (proseLines.join(' ').length >= 300) break
  }

  const prose = proseLines.join(' ').replace(/\s{2,}/g, ' ').trim()
  return prose.length >= 30 ? prose.slice(0, 600) : ''
}

function parseExperienceEntries(lines: string[]): ParsedExperienceEntry[] {
  const relevant = lines.filter((line) => !looksLikeContactLine(line))

  if (relevant.length === 0) {
    return []
  }

  const chunks: string[][] = []
  let currentChunk: string[] = []

  for (const line of relevant) {
    if (currentChunk.length === 0) {
      currentChunk.push(line)
      continue
    }

    if (startsNewExperienceChunk(line, currentChunk)) {
      chunks.push(currentChunk)
      currentChunk = [line]
      continue
    }

    currentChunk.push(line)
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }

  return chunks
    .map((chunk) => mapExperienceChunk(chunk))
    .filter((entry) => Boolean(entry.position || entry.company || entry.summary || entry.bullets.length > 0))
    .slice(0, 12)
}

function startsNewExperienceChunk(line: string, currentChunk: string[]): boolean {
  const hasCurrentContent = currentChunk.join(' ').length > 40

  if (!hasCurrentContent) {
    return false
  }

  // Only split on a date range if the line is a short standalone date header,
  // not a date embedded inside a description sentence.
  if (DATE_RANGE_REGEX.test(line) && isStandaloneDateLine(line)) {
    return true
  }

  return looksLikeRoleCompanyLine(line)
}

/**
 * Returns true when a line looks like a bare date-range header
 * (e.g. "July 2024 - Present (1 year 10 months)") rather than a
 * sentence that happens to contain a date range.
 */
function isStandaloneDateLine(line: string): boolean {
  if (line.length > 80) return false
  // Strip the date range and any duration parenthetical — what remains should be minimal
  const residual = line
    .replace(DATE_RANGE_REGEX, '')
    .replace(/\(\d[^)]*\)/g, '')
    .trim()
  return residual.length < 35
}

function mapExperienceChunk(chunk: string[]): ParsedExperienceEntry {
  const cleaned = chunk.map((line) => line.trim()).filter(Boolean)
  const dateSource = cleaned.find((line) => DATE_RANGE_REGEX.test(line)) || cleaned[0] || ''
  const dates = extractDateRange(dateSource)

  let headline = (cleaned[0] || '').replace(DATE_RANGE_REGEX, '').trim()
  let subline = cleaned[1] || ''
  let position = ''
  let company = ''

  const splitFromAt = splitByToken(headline, ' at ')
  const splitFromPipe = splitByToken(headline, '|')
  const splitFromDash = splitByToken(headline, ' - ') || splitByToken(headline, ' – ')

  if (splitFromAt) {
    position = splitFromAt.left
    company = splitFromAt.right
  } else if (splitFromPipe) {
    position = splitFromPipe.left
    company = splitFromPipe.right
  } else if (splitFromDash) {
    position = splitFromDash.left
    company = splitFromDash.right
  } else if (TITLE_HINT_REGEX.test(headline) && subline) {
    position = headline
    company = subline
  } else {
    company = headline
    if (TITLE_HINT_REGEX.test(subline)) {
      position = subline
    }
  }

  if (!position && TITLE_HINT_REGEX.test(headline)) {
    position = headline
  }

  if (!company && subline && !TITLE_HINT_REGEX.test(subline)) {
    company = subline
  }

  const bodyLines = cleaned
    .slice(1)
    .filter((line) => line !== subline || !TITLE_HINT_REGEX.test(subline))
    .filter((line) => !DATE_RANGE_REGEX.test(line))

  const bulletPrefixRe = /^[•\-\*]\s+|^\d+\.\s+/
  const bullets: string[] = []
  const proseLines: string[] = []

  for (const line of bodyLines) {
    if (bulletPrefixRe.test(line)) {
      bullets.push(line.replace(bulletPrefixRe, '').trim())
    } else {
      proseLines.push(line)
    }
  }

  const summary = proseLines.join(' ').replace(/\s{2,}/g, ' ').trim()
  const tags = extractJobTags([summary, ...bullets].join(' '))

  return {
    position: position.trim(),
    company: company.trim(),
    startDate: dates.startDate,
    endDate: dates.endDate,
    summary,
    bullets,
    tags,
  }
}

function parseEducationEntries(lines: string[]): ParsedEducationEntry[] {
  // Only consider lines that look like degree or school entries.
  // Exclude lines that look like publication titles, URLs, or descriptions.
  // Lines that mention certification/license issuance are treated as noise —
  // they appear in education sections on LinkedIn exports but aren't degrees.
  const CERT_NOISE_RE = /\b(certif|licens|credential|issued|expires|awarded|badge|nanodegree|bootcamp)\b/i

  const relevant = lines.filter((line) => {
    if (looksLikeContactLine(line)) return false
    if (line.length > 120) return false       // publication titles / long descriptions
    if (CERT_NOISE_RE.test(line)) return false // skip certification/license noise
    return DEGREE_REGEX.test(line) || SCHOOL_HINT_REGEX.test(line) || DATE_RANGE_REGEX.test(line)
  })

  if (relevant.length === 0) {
    return []
  }

  const chunks: string[][] = []
  let currentChunk: string[] = []

  for (const line of relevant) {
    if (currentChunk.length === 0) {
      currentChunk.push(line)
      continue
    }

    if ((DEGREE_REGEX.test(line) || SCHOOL_HINT_REGEX.test(line)) && currentChunk.length > 1) {
      chunks.push(currentChunk)
      currentChunk = [line]
      continue
    }

    currentChunk.push(line)
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }

  return chunks
    .map((chunk) => mapEducationChunk(chunk))
    .filter((entry) => Boolean(entry.degree || entry.school))
    .slice(0, 8)
}

function mapEducationChunk(chunk: string[]): ParsedEducationEntry {
  const cleaned = chunk.map((line) => line.trim()).filter(Boolean)
  const first = cleaned[0] || ''
  const second = cleaned[1] || ''

  let degree = ''
  let school = ''

  const splitByDash = splitByToken(first, ' - ') || splitByToken(first, ' – ') || splitByToken(first, ',')

  if (splitByDash && (DEGREE_REGEX.test(splitByDash.left) || SCHOOL_HINT_REGEX.test(splitByDash.right))) {
    degree = splitByDash.left
    school = splitByDash.right
  } else if (DEGREE_REGEX.test(first)) {
    degree = first
    school = second
  } else {
    school = first
    if (DEGREE_REGEX.test(second)) {
      degree = second
    }
  }

  const dateLine = cleaned.find((line) => DATE_RANGE_REGEX.test(line)) || cleaned.find((line) => /\b\d{4}\b/.test(line)) || ''
  const dateRange = extractDateRange(dateLine)
  const graduationDate = dateRange.endDate || extractYear(dateLine)

  return {
    degree: degree.trim(),
    school: school.trim(),
    graduationDate,
  }
}

// Common tech/domain keywords to surface as per-job tags
const JOB_TAG_KEYWORDS = [
  'python','javascript','typescript','java','kotlin','swift','go','rust','c++','c#','ruby','php','scala',
  'react','vue','angular','node','express','django','flask','spring','rails',
  'sql','postgres','mysql','mongodb','redis','elasticsearch','dynamodb','bigquery',
  'aws','azure','gcp','docker','kubernetes','terraform','ci/cd','github actions','jenkins',
  'machine learning','deep learning','nlp','llm','ai','data science','analytics',
  'rest','graphql','grpc','api','microservices','architecture','cloud',
  'agile','scrum','product management','leadership','cross-functional',
]

function extractJobTags(text: string): string[] {
  const lower = text.toLowerCase()
  return JOB_TAG_KEYWORDS.filter((kw) => lower.includes(kw)).slice(0, 10)
}

function parseSkills(lines: string[]): string[] {
  if (lines.length === 0) return []

  const rawItems = lines
    .flatMap((line) => {
      const cleaned = line.replace(/^(?:top\s+)?skills?:?/i, '').trim()
      // Split on bullets, semicolons, and commas (Word resume lists).
      // Do NOT split on pipes — LinkedIn headlines use pipes as separators.
      return cleaned.split(/[•;,]/g)
    })
    // Filter out lines that look like contact info, URLs, or long sentences
    .filter((item) => {
      const t = item.trim()
      if (!t) return false
      if (looksLikeContactLine(t)) return false
      if (t.split(' ').length > 10) return false  // too long to be a skill
      return true
    })
    .map((item) => item.trim())
    .filter(Boolean)

  const deduped = new Map<string, string>()

  for (const skill of rawItems) {
    const normalized = skill.toLowerCase().replace(/[^a-z0-9+#./\-\s]/g, '').trim()

    if (!normalized || normalized.length < 2 || normalized.length > 50) {
      continue
    }

    if (/^[\d\s]+$/.test(normalized) || normalized.split(' ').length > 6) {
      continue
    }

    if (!deduped.has(normalized)) {
      deduped.set(normalized, skill)
    }
  }

  return Array.from(deduped.values()).slice(0, 60)
}

function splitByToken(line: string, token: string): { left: string; right: string } | null {
  const index = line.toLowerCase().indexOf(token.toLowerCase())

  if (index <= 0) {
    return null
  }

  const split = line.split(token)

  if (split.length < 2) {
    return null
  }

  const left = split[0].trim()
  const right = split.slice(1).join(token).trim()
  return left && right ? { left, right } : null
}

function extractDateRange(line: string): { startDate: string; endDate: string } {
  const match = line.match(DATE_RANGE_REGEX)

  if (!match) {
    return { startDate: '', endDate: '' }
  }

  return {
    startDate: normalizeDateToken(match[1]),
    endDate: normalizeDateToken(match[2]),
  }
}

function normalizeDateToken(token: string): string {
  const normalized = token.toLowerCase().replace(/\./g, '').trim()

  if (['present', 'current', 'now'].includes(normalized)) {
    return ''
  }

  const monthYearMatch = normalized.match(/^([a-z]+)\s+(\d{4})$/)

  if (monthYearMatch) {
    const month = MONTHS[monthYearMatch[1] as keyof typeof MONTHS]

    if (month) {
      return `${monthYearMatch[2]}-${month}`
    }
  }

  const yearMatch = normalized.match(/\b(19\d{2}|20\d{2})\b/)
  return yearMatch ? `${yearMatch[1]}-01` : ''
}

function extractYear(line: string): string {
  const yearMatch = line.match(/\b(19\d{2}|20\d{2})\b/)
  return yearMatch ? `${yearMatch[1]}-01` : ''
}

function looksLikeRoleCompanyLine(line: string): boolean {
  if (line.length < 6 || line.length > 140) {
    return false
  }

  // Date-range lines are handled separately in startsNewExperienceChunk;
  // skip them here to avoid double-triggering.
  if (DATE_RANGE_REGEX.test(line)) {
    return false
  }

  if (splitByToken(line, '|') || splitByToken(line, ' - ') || splitByToken(line, ' – ') || splitByToken(line, ' at ')) {
    return /[A-Za-z]{3,}/.test(line)
  }

  return TITLE_HINT_REGEX.test(line)
}

function looksLikeLocationLine(line: string): boolean {
  // "San Francisco, CA" / "New York, NY" / "London, United Kingdom"
  return /^[A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]{1,30}$/.test(line.trim())
}

function looksLikeContactLine(line: string): boolean {
  return /@|\+?\d[\d\s().-]{6,}|linkedin\.com|github\.com|www\./i.test(line)
}
