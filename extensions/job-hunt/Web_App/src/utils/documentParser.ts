/**
 * Document Parser for Resume Text
 * Extracts resume sections from plain text
 */

/**
 * Extract resume sections from parsed text
 * Uses simple heuristics to identify sections
 */
export function extractResumeSections(text: string): {
  summary?: string
  experience?: string[]
  education?: string[]
  skills?: string[]
} {
  const sections: any = {}
  
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
