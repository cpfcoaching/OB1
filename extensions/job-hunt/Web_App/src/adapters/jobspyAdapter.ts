/**
 * JobSpy Adapter
 *
 * The ONLY module that communicates with the JobSpy backend service
 * (cpfcoaching/JobSpy fork via cpfcoaching/JobHunter_CPF-Coaching API).
 * All other layers consume the normalized JobListing interface.
 *
 * Backend endpoint is configured via VITE_JOBSPY_API_URL.
 */

// ─── Normalized interfaces ────────────────────────────────────────────────────

export interface JobListing {
  id: string                                          // internal dedup key
  externalId: string                                  // source-assigned id
  source: string                                      // JobSpy source identifier
  title: string
  company: string
  location: string
  remoteType: 'on-site' | 'hybrid' | 'remote' | 'unknown'
  payMin: number | null
  payMax: number | null
  payPeriod: 'annual' | 'hourly' | 'unknown' | null
  description: string
  url: string
  postedAt: string                                    // ISO 8601
  fetchedAt: string                                   // ISO 8601
}

export interface RecommendationFilter {
  titleKeywords: string[]
  location: string
  remoteType: 'on-site' | 'hybrid' | 'remote' | 'any'
  companyInclude: string[]
  companyExclude: string[]
  payMin: number | null
  payMax: number | null
  payStrictMode: boolean                              // opt-in; false = include unknown-pay listings
  recencyDays: number
  sources: string[]
}

export const GLOBAL_FILTER_DEFAULTS: RecommendationFilter = {
  titleKeywords: [],
  location: '',
  remoteType: 'any',
  companyInclude: [],
  companyExclude: [],
  payMin: null,
  payMax: null,
  payStrictMode: false,
  recencyDays: 14,
  sources: ['linkedin', 'indeed', 'glassdoor'],
}

// ─── Internal constants ───────────────────────────────────────────────────────

const MAX_RESULTS = 250          // results_wanted sent to backend
const REQUEST_TIMEOUT_MS = 30_000
const MAX_RETRIES = 3

// ─── Telemetry ────────────────────────────────────────────────────────────────

function emitTelemetry(event: string, data: Record<string, unknown>): void {
  // Replace with your telemetry provider (Application Insights, Mixpanel, etc.)
  console.debug(`[jobspy:${event}]`, data)
}

// ─── HTTP with retry + timeout ────────────────────────────────────────────────

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  attempt = 1,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timer)

    if (res.status === 429) {
      if (attempt === 1) {
        await delay(60_000)
        return fetchWithRetry(url, options, 2)
      }
      throw new Error(`Rate limited after retry`)
    }

    if (res.status >= 400 && res.status < 500) {
      throw new Error(`Client error ${res.status}`)
    }

    if (res.status >= 500) {
      if (attempt < MAX_RETRIES) {
        await delay(1_000 * Math.pow(2, attempt - 1))
        return fetchWithRetry(url, options, attempt + 1)
      }
      throw new Error(`Server error ${res.status} after ${attempt} attempts`)
    }

    return res
  } catch (err) {
    clearTimeout(timer)
    if (
      attempt < MAX_RETRIES &&
      !(err instanceof Error && err.message.startsWith('Client error'))
    ) {
      await delay(1_000 * Math.pow(2, attempt - 1))
      return fetchWithRetry(url, options, attempt + 1)
    }
    throw err
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── Deduplication ────────────────────────────────────────────────────────────

function dedupeKey(raw: Omit<JobListing, 'id' | 'fetchedAt'>): string {
  if (raw.externalId) return `${raw.source}::${raw.externalId}`
  return `${raw.title}::${raw.company}::${raw.location}`
}

// ─── Pay filter (post-fetch) ──────────────────────────────────────────────────

function applyPayFilter(
  listings: JobListing[],
  filters: RecommendationFilter,
): JobListing[] {
  const { payMin, payMax, payStrictMode } = filters
  if (payMin === null && payMax === null) return listings

  return listings.filter(listing => {
    const hasPay = listing.payMin !== null || listing.payMax !== null
    if (!hasPay) return !payStrictMode

    if (payMin !== null && listing.payMax !== null && listing.payMax < payMin) return false
    if (payMax !== null && listing.payMin !== null && listing.payMin > payMax) return false
    return true
  })
}

// ─── Public fetch function ────────────────────────────────────────────────────

export async function fetchListings(
  filters: RecommendationFilter,
  userId: string,
): Promise<JobListing[]> {
  const baseUrl = import.meta.env.VITE_JOBSPY_API_URL as string | undefined
  if (!baseUrl) {
    throw new Error('VITE_JOBSPY_API_URL is not configured')
  }

  const body = {
    search_term: filters.titleKeywords.join(' ') || undefined,
    location: filters.location || undefined,
    is_remote:
      filters.remoteType === 'remote' ? true :
      filters.remoteType === 'on-site' ? false :
      undefined,
    hours_old: filters.recencyDays * 24,
    site_name: filters.sources,
    company_include: filters.companyInclude.length ? filters.companyInclude : undefined,
    company_exclude: filters.companyExclude.length ? filters.companyExclude : undefined,
    results_wanted: MAX_RESULTS,
  }

  emitTelemetry('fetch.start', { sources: filters.sources, userId })

  const start = Date.now()
  let rawListings: Omit<JobListing, 'id' | 'fetchedAt'>[]

  try {
    const res = await fetchWithRetry(`${baseUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    rawListings = (await res.json()) as Omit<JobListing, 'id' | 'fetchedAt'>[]
    emitTelemetry('fetch.success', {
      sources: filters.sources,
      listingCount: rawListings.length,
      latencyMs: Date.now() - start,
    })
  } catch (err) {
    emitTelemetry('fetch.error', { sources: filters.sources, error: String(err) })
    throw err
  }

  // Dedup
  const seen = new Set<string>()
  const fetchedAt = new Date().toISOString()
  const deduped: JobListing[] = []

  for (const raw of rawListings) {
    const key = dedupeKey(raw)
    if (!seen.has(key)) {
      seen.add(key)
      deduped.push({ ...raw, id: key, fetchedAt })
    }
  }

  emitTelemetry('dedup.summary', {
    rawCount: rawListings.length,
    dedupedCount: deduped.length,
    collisionCount: rawListings.length - deduped.length,
  })

  if (deduped.length === 0) {
    emitTelemetry('fetch.empty', { sources: filters.sources, filters })
  }

  // Company blocklist (post-fetch safety net)
  const blocked = new Set(filters.companyExclude.map(c => c.toLowerCase()))
  const afterBlocklist = filters.companyExclude.length
    ? deduped.filter(l => !blocked.has(l.company.toLowerCase()))
    : deduped

  return applyPayFilter(afterBlocklist, filters)
}
