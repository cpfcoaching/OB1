/**Composable for importing resume data from LinkedIn and documents.*/

import { ref } from 'vue'

export interface ExtractedResumeData {
  personalInfo?: {
    fullName?: string
    email?: string
    phone?: string
    location?: string
  }
  summary?: string
  experience?: Array<{
    position: string
    company: string
    startDate: string
    endDate: string
    description: string
  }>
  education?: Array<{
    degree: string
    school: string
    graduationDate: string
  }>
  skills?: string[]
}

export function useResumeImport() {
  const isImporting = ref(false)
  const importError = ref('')
  const extractedData = ref<ExtractedResumeData | null>(null)

  /**Extract resume data from LinkedIn JSON.*/
  const parseLinkedInData = (jsonData: string): ExtractedResumeData => {
    try {
      const data = JSON.parse(jsonData)
      const extracted: ExtractedResumeData = {}

      // Extract personal info
      extracted.personalInfo = {
        fullName: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.name || '',
        email: data.email || '',
        phone: data.phoneNumber || data.phone || '',
        location: data.location || data.city || ''
      }

      // Extract summary/headline
      extracted.summary = data.headline || data.summary || ''

      // Extract experience
      if (data.experience && Array.isArray(data.experience)) {
        extracted.experience = data.experience.map((exp: any) => ({
          position: exp.title || '',
          company: exp.companyName || exp.company || '',
          startDate: formatDateToMonth(exp.startDate),
          endDate: formatDateToMonth(exp.endDate),
          description: exp.description || ''
        }))
      }

      // Extract education
      if (data.education && Array.isArray(data.education)) {
        extracted.education = data.education.map((edu: any) => ({
          degree: edu.degreeName || '',
          school: edu.schoolName || '',
          graduationDate: formatDateToMonth(edu.endDate)
        }))
      }

      // Extract skills
      if (data.skills && Array.isArray(data.skills)) {
        extracted.skills = data.skills
          .map((skill: any) => skill.name || skill)
          .filter((s: string) => s && s.trim())
      }

      extractedData.value = extracted
      return extracted
    } catch (err) {
      throw new Error('Invalid JSON format. Please check your LinkedIn data.')
    }
  }

  /**Extract resume data from text (document).*/
  const parseDocumentText = (text: string): ExtractedResumeData => {
    const extracted: ExtractedResumeData = {
      skills: []
    }

    // Split text into sections
    const sections = splitBySections(text)

    // Extract contact info from first line/section
    extractContactInfo(text, extracted)

    // Extract experience
    const expSection = findSection(sections, ['experience', 'work', 'employment', 'job'])
    if (expSection) {
      extracted.experience = parseExperienceSection(expSection)
    }

    // Extract education
    const eduSection = findSection(sections, ['education', 'degree'])
    if (eduSection) {
      extracted.education = parseEducationSection(eduSection)
    }

    // Extract skills
    const skillSection = findSection(sections, ['skills', 'technical', 'expertise', 'competencies'])
    if (skillSection) {
      extracted.skills = parseSkillsSection(skillSection)
    }

    // Extract summary
    const summarySection = findSection(sections, ['summary', 'objective', 'profile', 'about'])
    if (summarySection) {
      extracted.summary = summarySection.trim().substring(0, 500)
    }

    extractedData.value = extracted
    return extracted
  }

  /**Extract text from PDF file.*/
  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          // For now, return a message indicating PDF parsing needs pdfjs library
          // In production, you'd use pdfjs-dist to extract text
          reject(new Error('PDF parsing requires additional setup. Please export your resume as text or use copy-paste.'))
        } catch (err) {
          reject(err)
        }
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  /**Extract text from Word document.*/
  const extractTextFromDocx = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          // For now, return a message indicating DOCX parsing needs docx library
          reject(new Error('Word document parsing requires additional setup. Please export as PDF or text.'))
        } catch (err) {
          reject(err)
        }
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  /**Import resume from file.*/
  const importFromFile = async (file: File): Promise<ExtractedResumeData> => {
    isImporting.value = true
    importError.value = ''

    try {
      let text = ''

      if (file.type === 'text/plain') {
        text = await file.text()
      } else if (file.type.includes('word') || file.name.endsWith('.docx')) {
        text = await extractTextFromDocx(file)
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        text = await extractTextFromPDF(file)
      } else {
        throw new Error('Unsupported file type. Please use .txt, .pdf, or .docx')
      }

      return parseDocumentText(text)
    } catch (err: any) {
      importError.value = err.message
      throw err
    } finally {
      isImporting.value = false
    }
  }

  return {
    isImporting,
    importError,
    extractedData,
    parseLinkedInData,
    parseDocumentText,
    importFromFile
  }
}

// ===== Helper Functions =====

function formatDateToMonth(dateObj: any): string {
  if (!dateObj) return ''
  
  if (typeof dateObj === 'string') {
    const match = dateObj.match(/(\d{4})-(\d{2})/)
    return match ? `${match[1]}-${match[2]}` : dateObj
  }

  if (dateObj.year && dateObj.month) {
    const month = String(dateObj.month).padStart(2, '0')
    return `${dateObj.year}-${month}`
  }

  return ''
}

function splitBySections(text: string): string[] {
  const sectionBreaks = /\n(?=[A-Z][A-Z\s]{2,})\n/g
  return text.split(sectionBreaks)
}

function findSection(sections: string[], keywords: string[]): string | null {
  for (const section of sections) {
    const lowerSection = section.toLowerCase()
    for (const keyword of keywords) {
      if (lowerSection.includes(keyword)) {
        return section
      }
    }
  }
  return null
}

function extractContactInfo(text: string, extracted: ExtractedResumeData): void {
  // Extract email
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/)
  if (emailMatch) {
    if (!extracted.personalInfo) extracted.personalInfo = {}
    extracted.personalInfo.email = emailMatch[0]
  }

  // Extract phone (US format)
  const phoneMatch = text.match(/(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/)
  if (phoneMatch) {
    if (!extracted.personalInfo) extracted.personalInfo = {}
    extracted.personalInfo.phone = phoneMatch[0]
  }

  // Extract first line as name
  const lines = text.split('\n')
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i].trim()
    if (line && line.length > 2 && line.length < 100 && !line.includes('@')) {
      if (!extracted.personalInfo) extracted.personalInfo = {}
      if (!extracted.personalInfo.fullName) {
        extracted.personalInfo.fullName = line
      }
      break
    }
  }
}

function parseExperienceSection(section: string): any[] {
  const experiences = []
  const entries = section.split(/\n(?=\S)/).slice(1) // Skip header

  for (const entry of entries) {
    if (entry.trim().length < 10) continue

    const lines = entry.trim().split('\n')
    if (lines.length < 2) continue

    const exp: any = {
      position: lines[0].trim(),
      company: lines[1].trim(),
      startDate: '',
      endDate: '',
      description: lines.slice(2).join('\n').trim()
    }

    // Try to extract dates
    const dateMatch = entry.match(/(\d{4}|\w+)\s*[-–]\s*(\d{4}|present|current|\w+)/i)
    if (dateMatch) {
      exp.startDate = dateMatch[1]
      exp.endDate = dateMatch[2]
    }

    experiences.push(exp)
  }

  return experiences
}

function parseEducationSection(section: string): any[] {
  const education = []
  const entries = section.split(/\n(?=\S)/).slice(1) // Skip header

  for (const entry of entries) {
    if (entry.trim().length < 5) continue

    const lines = entry.trim().split('\n')
    const edu: any = {
      degree: lines[0].trim(),
      school: lines[1]?.trim() || '',
      graduationDate: ''
    }

    // Try to extract year
    const yearMatch = entry.match(/(\d{4})/)
    if (yearMatch) {
      edu.graduationDate = yearMatch[1]
    }

    education.push(edu)
  }

  return education
}

function parseSkillsSection(section: string): string[] {
  const lines = section.split('\n').slice(1) // Skip header
  const skills: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Split by comma or bullet points
    const items = trimmed
      .split(/[,•\-]/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.length < 50)

    skills.push(...items)
  }

  return skills
}
