import type { VercelRequest, VercelResponse } from '@vercel/node'

type AnyRecord = Record<string, unknown>

type ScrapeRequestBody = {
  source?: string
  query?: string
  keywords?: string | string[]
  location?: string
  limit?: number
  [key: string]: unknown
}

type ScrapedJob = {
  position: string
  company: string
  url: string
  location?: string
  description?: string
  salary?: string
  source?: string
  status?: string
}

type HandlerResponse = {
  status: number
  payload: AnyRecord
}

const SOURCE_KEY_MAP: Record<string, string> = {
  'job-ops': 'JOB_OPS',
  jobspy: 'JOBSPY',
  'career-ops': 'CAREER_OPS'
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

function pickFirstString(record: AnyRecord, keys: string[]): string {
  for (const key of keys) {
    const value = asString(record[key])
    if (value) {
      return value
    }
  }

  return ''
}

function normalizeJob(job: AnyRecord, source: string): ScrapedJob {
  return {
    position: pickFirstString(job, ['position', 'title', 'jobTitle', 'job_title', 'name']) || 'Untitled Role',
    company: pickFirstString(job, ['company', 'companyName', 'company_name', 'employer', 'employer_name']) || 'Unknown Company',
    url: pickFirstString(job, ['url', 'jobUrl', 'job_url', 'applyUrl', 'apply_url', 'link']),
    location: pickFirstString(job, ['location', 'city', 'region']),
    description: pickFirstString(job, ['description', 'snippet', 'summary']),
    salary: pickFirstString(job, ['salary', 'salaryRange', 'compensation']),
    source,
    status: 'Saved'
  }
}

function extractArrayPayload(data: unknown): AnyRecord[] {
  if (Array.isArray(data)) {
    return data.filter((item): item is AnyRecord => typeof item === 'object' && item != null)
  }

  if (!data || typeof data !== 'object') {
    return []
  }

  const record = data as AnyRecord
  const candidateKeys = ['jobs', 'results', 'items', 'data', 'listings', 'records']

  for (const key of candidateKeys) {
    const value = record[key]

    if (Array.isArray(value)) {
      return value.filter((item): item is AnyRecord => typeof item === 'object' && item != null)
    }
  }

  return []
}

function envForSource(source: string): { key: string; url?: string; method: string; timeoutMs: number } {
  const sourceKey = SOURCE_KEY_MAP[source] || source.toUpperCase().replace(/[^A-Z0-9]+/g, '_')
  const url =
    process.env[`PARTNER_${sourceKey}_API_URL`] ||
    process.env[`PARTNER_${sourceKey}_URL`] ||
    process.env.PARTNER_SCRAPE_API_URL

  const method =
    (process.env[`PARTNER_${sourceKey}_METHOD`] || process.env.PARTNER_SCRAPE_METHOD || 'POST').toUpperCase()

  const timeoutMs = Number(
    process.env[`PARTNER_${sourceKey}_TIMEOUT_MS`] || process.env.PARTNER_SCRAPE_TIMEOUT_MS || 8000
  )

  return { key: sourceKey, url, method, timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : 8000 }
}

function buildHeaders(sourceKey: string): Record<string, string> {
  const headers: Record<string, string> = {
    'content-type': 'application/json'
  }

  const apiKey =
    process.env[`PARTNER_${sourceKey}_API_KEY`] ||
    process.env[`PARTNER_${sourceKey}_TOKEN`] ||
    process.env.PARTNER_SCRAPE_API_KEY

  const authHeaderName =
    process.env[`PARTNER_${sourceKey}_API_KEY_HEADER`] || process.env.PARTNER_SCRAPE_API_KEY_HEADER || 'authorization'

  if (apiKey) {
    headers[authHeaderName.toLowerCase()] =
      authHeaderName.toLowerCase() === 'authorization' ? `Bearer ${apiKey}` : apiKey
  }

  return headers
}

function withTimeout(signalMs: number): AbortSignal {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), signalMs)
  controller.signal.addEventListener('abort', () => clearTimeout(timeoutId), { once: true })
  return controller.signal
}

async function fetchPartnerJobs(body: ScrapeRequestBody): Promise<HandlerResponse> {
  const source = asString(body.source)
  if (!source) {
    return {
      status: 400,
      payload: {
        message: 'Missing required field: source',
        jobs: []
      }
    }
  }

  const { key, url, method, timeoutMs } = envForSource(source)

  if (!url) {
    return {
      status: 503,
      payload: {
        message: `Partner API URL is not configured for ${source}. Set PARTNER_${key}_API_URL in Vercel env.`,
        jobs: [],
        source,
        configured: false
      }
    }
  }

  const payload: AnyRecord = {
    source,
    ...body
  }

  const requestInit: RequestInit = {
    method,
    headers: buildHeaders(key),
    signal: withTimeout(timeoutMs)
  }

  if (method !== 'GET') {
    requestInit.body = JSON.stringify(payload)
  }

  const response = await fetch(url, requestInit)
  const raw = await response.json().catch(() => ({}))

  if (!response.ok) {
    return {
      status: response.status,
      payload: {
        message: asString((raw as AnyRecord).message) || `Partner request failed (${response.status})`,
        jobs: [],
        source,
        configured: true
      }
    }
  }

  const rows = extractArrayPayload(raw)
  const jobs = rows.map((item) => normalizeJob(item, source)).filter((job) => job.position || job.company)

  return {
    status: 200,
    payload: {
      message: `Scraped ${jobs.length} jobs from ${source}.`,
      jobs,
      source,
      configured: true
    }
  }
}

async function fetchHandler(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ScrapeRequestBody
  const { status, payload } = await fetchPartnerJobs(body)

  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' }
  })
}

async function nodeHandler(req: VercelRequest, res: VercelResponse) {
  const { status, payload } = await fetchPartnerJobs((req.body || {}) as ScrapeRequestBody)
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
