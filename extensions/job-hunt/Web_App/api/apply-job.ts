import type { VercelRequest, VercelResponse } from '@vercel/node'

type AnyRecord = Record<string, unknown>

type ApplyRequestBody = {
  jobs?: AnyRecord[]
  dryRun?: boolean
  [key: string]: unknown
}

type HandlerResponse = {
  status: number
  payload: AnyRecord
}

function asBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    return ['true', '1', 'yes'].includes(value.toLowerCase())
  }

  return false
}

function withTimeout(signalMs: number): AbortSignal {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), signalMs)
  controller.signal.addEventListener('abort', () => clearTimeout(timeoutId), { once: true })
  return controller.signal
}

function partnerConfig() {
  const timeoutMs = Number(process.env.PARTNER_AUTO_APPLY_TIMEOUT_MS || 10000)
  return {
    url: process.env.PARTNER_AUTO_APPLY_URL,
    apiKey: process.env.PARTNER_AUTO_APPLY_API_KEY,
    apiKeyHeader: (process.env.PARTNER_AUTO_APPLY_API_KEY_HEADER || 'authorization').toLowerCase(),
    timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : 10000
  }
}

function buildHeaders(config: ReturnType<typeof partnerConfig>): Record<string, string> {
  const headers: Record<string, string> = {
    'content-type': 'application/json'
  }

  if (config.apiKey) {
    headers[config.apiKeyHeader] = config.apiKeyHeader === 'authorization' ? `Bearer ${config.apiKey}` : config.apiKey
  }

  return headers
}

async function applyJobs(body: ApplyRequestBody): Promise<HandlerResponse> {
  const jobs = Array.isArray(body.jobs) ? body.jobs.filter((job) => job && typeof job === 'object') : []
  const dryRun = asBoolean(body.dryRun)

  if (!jobs.length) {
    return {
      status: 400,
      payload: {
        message: 'No jobs provided for auto-apply.',
        appliedCount: 0
      }
    }
  }

  const config = partnerConfig()

  if (!config.url) {
    return {
      status: 200,
      payload: {
        message:
          'Auto-apply partner endpoint is not configured. Set PARTNER_AUTO_APPLY_URL to enable live apply. Returning dry-run summary.',
        appliedCount: 0,
        attemptedCount: jobs.length,
        dryRun: true,
        configured: false
      }
    }
  }

  if (dryRun) {
    return {
      status: 200,
      payload: {
        message: `Dry-run prepared ${jobs.length} jobs for partner auto-apply.`,
        appliedCount: 0,
        attemptedCount: jobs.length,
        dryRun: true,
        configured: true
      }
    }
  }

  const response = await fetch(config.url, {
    method: 'POST',
    headers: buildHeaders(config),
    body: JSON.stringify({ jobs, ...body }),
    signal: withTimeout(config.timeoutMs)
  })

  const raw = await response.json().catch(() => ({}))

  if (!response.ok) {
    return {
      status: response.status,
      payload: {
        message: String((raw as AnyRecord).message || `Partner auto-apply failed (${response.status}).`),
        appliedCount: 0,
        attemptedCount: jobs.length,
        configured: true
      }
    }
  }

  const appliedCount = Number((raw as AnyRecord).appliedCount ?? (raw as AnyRecord).count ?? 0)

  return {
    status: 200,
    payload: {
      message: String((raw as AnyRecord).message || `Auto-applied to ${appliedCount || jobs.length} jobs.`),
      appliedCount: Number.isFinite(appliedCount) ? appliedCount : jobs.length,
      attemptedCount: jobs.length,
      configured: true,
      dryRun: false,
      partnerResponse: raw
    }
  }
}

async function fetchHandler(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ApplyRequestBody
  const { status, payload } = await applyJobs(body)

  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' }
  })
}

async function nodeHandler(req: VercelRequest, res: VercelResponse) {
  const { status, payload } = await applyJobs((req.body || {}) as ApplyRequestBody)
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
