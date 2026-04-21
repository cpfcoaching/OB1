/**OpenRouter API integration for AI-powered evaluations.*/

import { OpenRouter } from '@openrouter/sdk'

const client = new OpenRouter({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY
})

export interface ResumeEvaluation {
  scores: {
    overall: number
    format: number
    content: number
    ats_optimization: number
    keywords: number
  }
  recommendations: Array<{
    category: string
    suggestion: string
    priority: 'high' | 'medium' | 'low'
  }>
  ats_pass_likelihood: string
  strengths: string[]
  improvements: string[]
}

export interface LinkedInEvaluation {
  scores: {
    overall: number
    completeness: number
    content_quality: number
  }
  recommendations: Array<{
    category: string
    suggestion: string
  }>
  resume_data?: any
}

/**Evaluate a resume against a job description using Claude.*/
export async function evaluateResume(
  resumeData: any,
  jobDescription: string = '',
  roleType: string = 'general'
): Promise<ResumeEvaluation> {
  const prompt = `You are an expert resume reviewer and career coach. Evaluate the following resume and provide a detailed assessment.

Resume:
${JSON.stringify(resumeData, null, 2)}

${jobDescription ? `Target Job Description:\n${jobDescription}` : ''}

Role Type: ${roleType}

Please evaluate this resume and respond with ONLY valid JSON (no markdown, no code blocks) in this exact structure:
{
  "scores": {
    "overall": <0-100>,
    "format": <0-100>,
    "content": <0-100>,
    "ats_optimization": <0-100>,
    "keywords": <0-100>
  },
  "recommendations": [
    {
      "category": "string",
      "suggestion": "string",
      "priority": "high|medium|low"
    }
  ],
  "ats_pass_likelihood": "percentage like 75%",
  "strengths": ["string"],
  "improvements": ["string"]
}

Provide realistic scores and actionable recommendations.`

  try {
    const result = await client.callModel({
      model: 'openai/gpt-4-mini',
      instructions: 'You are an expert resume evaluator. Provide detailed, honest feedback. Always respond with valid JSON only.',
      input: prompt
    })

    const responseText = await result.getText()
    
    // Parse JSON response
    try {
      return JSON.parse(responseText)
    } catch {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error('Failed to parse evaluation response')
    }
  } catch (error) {
    console.error('Resume evaluation error:', error)
    throw error
  }
}

/**Evaluate a LinkedIn profile and extract resume data.*/
export async function evaluateLinkedInProfile(
  linkedinUrl: string,
  profileData: any
): Promise<LinkedInEvaluation> {
  const prompt = `You are a LinkedIn profile expert. Evaluate the following LinkedIn profile data.

LinkedIn Profile:
${JSON.stringify(profileData, null, 2)}

URL: ${linkedinUrl}

Please evaluate this profile and respond with ONLY valid JSON (no markdown, no code blocks) in this exact structure:
{
  "scores": {
    "overall": <0-100>,
    "completeness": <0-100>,
    "content_quality": <0-100>
  },
  "recommendations": [
    {
      "category": "string",
      "suggestion": "string"
    }
  ],
  "resume_data": {
    "personalInfo": {
      "fullName": "string",
      "email": "string or empty",
      "phone": "string or empty",
      "location": "string"
    },
    "summary": "string from about section",
    "experience": [],
    "education": [],
    "skills": ["string"]
  }
}

Extract realistic data from the profile and provide constructive feedback.`

  try {
    const result = await client.callModel({
      model: 'openai/gpt-4-mini',
      instructions: 'You are a LinkedIn profile evaluator. Extract profile data and provide insights. Always respond with valid JSON only.',
      input: prompt
    })

    const responseText = await result.getText()
    
    // Parse JSON response
    try {
      return JSON.parse(responseText)
    } catch {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error('Failed to parse evaluation response')
    }
  } catch (error) {
    console.error('LinkedIn evaluation error:', error)
    throw error
  }
}

/**Parse raw markdown/text scraped from a web profile into structured resume data.*/
export async function parseScrapedProfile(markdown: string): Promise<{
  personalInfo: { fullName: string; email: string; phone: string; location: string }
  summary: string
  experience: Array<{ position: string; company: string; startDate: string; endDate: string; description: string }>
  education: Array<{ degree: string; school: string; graduationDate: string }>
  skills: string[]
}> {
  const prompt = `Extract professional resume data from the following web page content.

Web page content:
${markdown.substring(0, 8000)}

Respond with ONLY valid JSON (no markdown, no code blocks) in this exact structure:
{
  "personalInfo": {
    "fullName": "full name",
    "email": "email or empty string",
    "phone": "phone or empty string",
    "location": "city, state/country or empty string"
  },
  "summary": "professional summary or bio in one paragraph",
  "experience": [
    {
      "position": "job title",
      "company": "company name",
      "startDate": "YYYY-MM format or empty string",
      "endDate": "YYYY-MM format or empty string (empty if current role)",
      "description": "role description and key achievements"
    }
  ],
  "education": [
    {
      "degree": "degree name and field",
      "school": "institution name",
      "graduationDate": "YYYY-MM format or year only"
    }
  ],
  "skills": ["skill1", "skill2"]
}

Rules:
- List experience most recent first
- For current roles leave endDate as an empty string
- Include certifications in the skills array
- Only include data that is explicitly present in the content`

  try {
    const result = await client.callModel({
      model: 'openai/gpt-4-mini',
      instructions: 'You are a resume data extraction expert. Extract structured data from web content. Always respond with valid JSON only, no markdown.',
      input: prompt
    })

    const responseText = await result.getText()

    try {
      return JSON.parse(responseText)
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error('Failed to parse profile extraction response')
    }
  } catch (error) {
    console.error('Profile parsing error:', error)
    throw error
  }
}

/**Compare two resumes and identify differences.*/
export async function compareResumes(resume1: any, resume2: any): Promise<any> {
  const prompt = `Compare these two resumes and identify key differences and improvements.

Resume 1:
${JSON.stringify(resume1, null, 2)}

Resume 2:
${JSON.stringify(resume2, null, 2)}

Respond with ONLY valid JSON:
{
  "summary": "brief summary of differences",
  "improvements": ["list of improvements from v1 to v2"],
  "regressions": ["list of anything that got worse"],
  "skills_added": ["new skills in v2"],
  "skills_removed": ["skills removed in v2"],
  "experience_changes": "description of experience changes",
  "recommendation": "which version is better and why"
}`

  try {
    const result = await client.callModel({
      model: 'openai/gpt-4-mini',
      instructions: 'Compare the resumes and provide detailed analysis. Respond with valid JSON only.',
      input: prompt
    })

    const responseText = await result.getText()
    
    try {
      return JSON.parse(responseText)
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error('Failed to parse comparison response')
    }
  } catch (error) {
    console.error('Resume comparison error:', error)
    throw error
  }
}
