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
  description: string
}

export interface ParsedEducationEntry {
  degree: string
  school: string
  graduationDate: string
}

type SectionName = 'general' | 'summary' | 'experience' | 'education' | 'skills'

const SECTION_KEYWORDS: Record<Exclude<SectionName, 'general'>, string[]> = {
  summary: ['summary', 'professional summary', 'overview', 'profile', 'objective'],
  experience: ['experience', 'professional experience', 'work history', 'employment history'],
  education: ['education', 'academic background', 'certifications'],
  skills: ['skills', 'technical skills', 'core competencies', 'expertise', 'proficiencies'],
}

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
  const lines: Array<{ y: number; chunks: Array<{ x: number; text: string }> }> = []

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

      if (!text || transform.length < 6) {
        continue
      }

      const x = transform[4]
      const y = transform[5]
      let targetLine = lines.find((line) => Math.abs(line.y - y) <= 2)

      if (!targetLine) {
        targetLine = { y, chunks: [] }
        lines.push(targetLine)
      }

      targetLine.chunks.push({ x, text })
    }
  }

  const orderedLines = lines
    .sort((a, b) => b.y - a.y)
    .map((line) =>
      line.chunks
        .sort((a, b) => a.x - b.x)
        .map((chunk) => chunk.text)
        .join(' ')
        .replace(/\s{2,}/g, ' ')
        .trim(),
    )
    .filter(Boolean)

  return orderedLines.join('\n')
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
  }

  let currentSection: SectionName = 'general'

  for (const line of lines) {
    const heading = identifySectionHeading(line)

    if (heading) {
      currentSection = heading
      continue
    }

    sectionLines[currentSection].push(line)
  }

  const summary = parseSummary(sectionLines.summary, sectionLines.general)
  const experience = parseExperienceEntries(
    sectionLines.experience.length > 0 ? sectionLines.experience : sectionLines.general,
  )
  const education = parseEducationEntries(
    sectionLines.education.length > 0 ? sectionLines.education : sectionLines.general,
  )
  const skills = parseSkills(sectionLines.skills.length > 0 ? sectionLines.skills : sectionLines.general)

  return {
    summary: summary || undefined,
    experience: experience.length > 0 ? experience : undefined,
    education: education.length > 0 ? education : undefined,
    skills: skills.length > 0 ? skills : undefined,
  }
}

function identifySectionHeading(line: string): Exclude<SectionName, 'general'> | null {
  const normalized = line
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!normalized || normalized.length > 40) {
    return null
  }

  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS) as Array<
    [Exclude<SectionName, 'general'>, string[]]
  >) {
    if (keywords.some((keyword) => normalized === keyword || normalized.startsWith(`${keyword} `))) {
      return section
    }
  }

  return null
}

function parseSummary(summaryLines: string[], generalLines: string[]): string {
  const source = summaryLines.length > 0 ? summaryLines : generalLines.slice(4, 12)
  const merged = source.join(' ').replace(/\s{2,}/g, ' ').trim()

  if (merged.length < 30) {
    return ''
  }

  return merged.slice(0, 500)
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
    .filter((entry) => Boolean(entry.position || entry.company || entry.description))
    .slice(0, 12)
}

function startsNewExperienceChunk(line: string, currentChunk: string[]): boolean {
  const hasCurrentContent = currentChunk.join(' ').length > 40

  if (!hasCurrentContent) {
    return false
  }

  if (DATE_RANGE_REGEX.test(line)) {
    return true
  }

  return looksLikeRoleCompanyLine(line)
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

  const description = cleaned
    .slice(1)
    .filter((line) => line !== subline || !TITLE_HINT_REGEX.test(subline))
    .filter((line) => !DATE_RANGE_REGEX.test(line))
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim()

  return {
    position: position.trim(),
    company: company.trim(),
    startDate: dates.startDate,
    endDate: dates.endDate,
    description,
  }
}

function parseEducationEntries(lines: string[]): ParsedEducationEntry[] {
  const relevant = lines.filter((line) => DEGREE_REGEX.test(line) || SCHOOL_HINT_REGEX.test(line) || DATE_RANGE_REGEX.test(line) || /\b\d{4}\b/.test(line))

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

function parseSkills(lines: string[]): string[] {
  const rawItems = lines
    .flatMap((line) => {
      const cleaned = line.replace(/^skills?:?/i, '').trim()
      return cleaned.split(/[•;,|]/g)
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

  if (DATE_RANGE_REGEX.test(line)) {
    return true
  }

  if (splitByToken(line, '|') || splitByToken(line, ' - ') || splitByToken(line, ' – ') || splitByToken(line, ' at ')) {
    return /[A-Za-z]{3,}/.test(line)
  }

  return TITLE_HINT_REGEX.test(line)
}

function looksLikeContactLine(line: string): boolean {
  return /@|\+?\d[\d\s().-]{6,}|linkedin\.com|github\.com|www\./i.test(line)
}
