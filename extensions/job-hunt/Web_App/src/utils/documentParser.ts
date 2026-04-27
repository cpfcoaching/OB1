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
  experience?: string[]
  education?: string[]
  skills?: string[]
}

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
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    pageTexts.push(pageText)
  }

  return normalizeExtractedText(pageTexts.join('\n\n'))
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
  const sections: ResumeSections = {}
  
  // Extract summary (typically first paragraph or after contact info)
  const summaryMatch = text.match(
    /(?:summary|overview|professional summary|objective)([\s\S]*?)(?=experience|work|education|skills|$)/i
  )
  if (summaryMatch) {
    const summaryText = summaryMatch[1]
      .trim()
      .split('\n')[0]
      .trim()
    if (summaryText.length > 10 && summaryText.length < 500) {
      sections.summary = summaryText
    }
  }
  
  // Extract experience entries - look for job titles and company names
  const experienceMatch = text.match(
    /(?:experience|work history|employment)([\s\S]*?)(?=education|skills|certification|$)/i
  )
  if (experienceMatch) {
    const expText = experienceMatch[1]
    // Split by common patterns: newlines followed by capital letters (likely job titles)
    const entries = expText
      .split(/\n(?=[A-Z][a-z]+ (?:at |for |–|-|\|))/g)
      .filter(line => line.trim().length > 5)
      .slice(0, 10) // Limit to 10 entries
    
    sections.experience = entries.map((entry: string) => entry.trim())
  }
  
  // Extract education entries
  const educationMatch = text.match(
    /(?:education|academic|degree|university|school)([\s\S]*?)(?=skills|certification|$)/i
  )
  if (educationMatch) {
    const eduText = educationMatch[1]
    const entries = eduText
      .split(/\n(?=[A-Z])/g)
      .filter(line => line.trim().length > 3)
      .slice(0, 10) // Limit to 10 entries
    
    sections.education = entries.map((entry: string) => entry.trim())
  }
  
  // Extract skills - more aggressive matching
  const skillsMatch = text.match(
    /(?:skills|technical skills|core competencies|expertise|abilities|proficiencies)[\s\-:]*([^\n]+(?:\n(?![A-Z]{2,})[^\n]+)*)/i
  )
  if (skillsMatch) {
    const skillsText = skillsMatch[1]
    // Try different separators
    let skills: string[] = []
    
    if (skillsText.includes(',')) {
      skills = skillsText.split(',')
    } else if (skillsText.includes(';')) {
      skills = skillsText.split(';')
    } else if (skillsText.includes('•')) {
      skills = skillsText.split('•')
    } else if (skillsText.includes('-')) {
      skills = skillsText.split('-')
    } else {
      skills = skillsText.split('\n')
    }
    
    sections.skills = skills
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length > 1 && skill.length < 100 && !/^[\d\s]+$/.test(skill))
      .slice(0, 50) // Limit to 50 skills
  }
  
  return sections
}
