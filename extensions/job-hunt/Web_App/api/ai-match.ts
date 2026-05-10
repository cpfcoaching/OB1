import type { VercelRequest, VercelResponse } from '@vercel/node'

type AnyRecord = Record<string, unknown>

type MatchRequestBody = {
  jobs?: AnyRecord[]
  resume?: AnyRecord | null
  contextProfile?: AnyRecord | null
  preferences?: AnyRecord | null
  [key: string]: unknown
}

type MatchResult = {
  matchScore: number
  reasons: string[]
  matchedSkills: string[]
}

type HandlerResponse = {
  status: number
  payload: AnyRecord
}

function asString(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (value == null) {
    return ''
  }

  return String(value).trim()
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s+/#.-]/g, ' ')
    .split(/[\s,;|/]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2)
}

function uniqueTokens(values: string[]): string[] {
  return [...new Set(values.flatMap((value) => tokenize(value)))]
}

function scoreSkills(jobText: string, skillTokens: string[]): { score: number; matched: string[] } {
  if (!skillTokens.length) {
    return { score: 20, matched: [] }
  }

  const matched = skillTokens.filter((skill) => jobText.includes(skill))
  const ratio = matched.length / skillTokens.length
  const score = Math.round(Math.min(1, ratio) * 45)

  return { score, matched }
}

function scoreRole(jobText: string, roleTokens: string[]): number {
  if (!roleTokens.length) {
    return 10
  }

  const matches = roleTokens.filter((token) => jobText.includes(token)).length
  return Math.round(Math.min(1, matches / Math.max(1, roleTokens.length)) * 20)
}

function scoreLocation(jobText: string, locations: string[]): number {
  if (!locations.length) {
    return 8
  }

  const hasLocationMatch = locations.some((location) => {
    const token = location.toLowerCase()
    return token && (jobText.includes(token) || (token.includes('remote') && jobText.includes('remote')))
  })

  return hasLocationMatch ? 15 : 0
}

function scoreSummary(jobText: string, summaryText: string): number {
  if (!summaryText) {
    return 5
  }

  const summaryTokens = uniqueTokens([summaryText]).slice(0, 40)
  if (!summaryTokens.length) {
    return 5
  }

  const hits = summaryTokens.filter((token) => jobText.includes(token)).length
  return Math.round(Math.min(1, hits / summaryTokens.length) * 20)
}

function buildContext(body: MatchRequestBody): {
  skills: string[]
  roleHints: string[]
  locations: string[]
  summary: string
} {
  const resume = (body.resume || {}) as AnyRecord
  const profile = (body.contextProfile || {}) as AnyRecord
  const preferences = (body.preferences || {}) as AnyRecord

  const resumeSkills = Array.isArray(resume.skills) ? resume.skills.map(asString) : []
  const profileSkills = Array.isArray(profile.skills) ? profile.skills.map(asString) : []
  const preferenceSkills = Array.isArray(preferences.skills) ? preferences.skills.map(asString) : []

  const roleHints = [
    asString(profile.targetRole),
    asString(preferences.targetRole),
    asString(resume.headline),
    ...(Array.isArray(profile.targetRolesInclude) ? profile.targetRolesInclude.map(asString) : [])
  ].filter(Boolean)

  const locations = [
    asString(profile.locationRequirements),
    asString(preferences.location),
    asString(resume.location),
    ...(Array.isArray(profile.locationRequirements) ? profile.locationRequirements.map(asString) : [])
  ].filter(Boolean)

  const summary = [
    asString(resume.summary),
    asString(profile.backgroundSummary),
    asString(profile.experienceSummary)
  ]
    .filter(Boolean)
    .join(' ')

  return {
    skills: [...new Set([...resumeSkills, ...profileSkills, ...preferenceSkills].filter(Boolean))],
    roleHints,
    locations,
    summary
  }
}

function normalizeJob(job: AnyRecord): AnyRecord {
  const position =
    asString(job.position) || asString(job.title) || asString(job.jobTitle) || asString(job.job_title) || 'Untitled Role'
  const company =
    asString(job.company) || asString(job.companyName) || asString(job.company_name) || asString(job.employer) || 'Unknown Company'

  return {
    ...job,
    position,
    company,
    description: asString(job.description),
    location: asString(job.location),
    source: asString(job.source)
  }
}

function scoreJob(job: AnyRecord, context: ReturnType<typeof buildContext>): MatchResult {
  const normalized = normalizeJob(job)
  const text = `${normalized.position} ${normalized.company} ${asString(normalized.description)} ${asString(normalized.location)}`
    .toLowerCase()
    .trim()

  const skillTokens = uniqueTokens(context.skills)
  const roleTokens = uniqueTokens(context.roleHints)

  const skillScore = scoreSkills(text, skillTokens)
  const roleScore = scoreRole(text, roleTokens)
  const locationScore = scoreLocation(text, context.locations)
  const summaryScore = scoreSummary(text, context.summary)

  let total = 15 + skillScore.score + roleScore + locationScore + summaryScore
  total = Math.max(15, Math.min(98, total))

  const reasons: string[] = []
  if (skillScore.matched.length) {
    reasons.push(`Matched skills: ${skillScore.matched.slice(0, 6).join(', ')}`)
  }
  if (roleScore >= 12) {
    reasons.push('Role alignment is strong')
  }
  if (locationScore > 0) {
    reasons.push('Location preferences align')
  }
  if (!reasons.length) {
    reasons.push('General profile alignment')
  }

  return {
    matchScore: total,
    reasons,
    matchedSkills: skillScore.matched.slice(0, 10)
  }
}

function matchJobs(body: MatchRequestBody): HandlerResponse {
  const jobs = Array.isArray(body.jobs) ? body.jobs.filter((job): job is AnyRecord => !!job && typeof job === 'object') : []

  if (!jobs.length) {
    return {
      status: 400,
      payload: {
        message: 'No jobs provided for matching.',
        matchedJobs: []
      }
    }
  }

  const context = buildContext(body)
  const matchedJobs = jobs
    .map((job) => {
      const normalized = normalizeJob(job)
      const result = scoreJob(normalized, context)
      return {
        ...normalized,
        ...result
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)

  const strongMatches = matchedJobs.filter((job) => job.matchScore >= 80).length
  const averageMatch = Math.round(
    matchedJobs.reduce((sum, job) => sum + Number(job.matchScore || 0), 0) / Math.max(1, matchedJobs.length)
  )

  return {
    status: 200,
    payload: {
      message: `AI matched ${matchedJobs.length} jobs using resume/profile context.`,
      matchedJobs,
      metrics: {
        jobsFound: matchedJobs.length,
        strongMatches,
        averageMatch
      }
    }
  }
}

async function fetchHandler(request: Request) {
  const body = (await request.json().catch(() => ({}))) as MatchRequestBody
  const { status, payload } = matchJobs(body)

  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' }
  })
}

async function nodeHandler(req: VercelRequest, res: VercelResponse) {
  const { status, payload } = matchJobs((req.body || {}) as MatchRequestBody)
  res.status(status).json(payload)
}

const handler = async (req: VercelRequest | Request, res?: VercelResponse) => {
  if (res) {
    return nodeHandler(req as VercelRequest, res)
  }

  return fetchHandler(req as Request)
}

;(handler as typeof handler & { fetch: typeof fetchHandler }).fetch = fetchHandler

export default handler as typeof handler & { fetch: typeof fetchHandler }
