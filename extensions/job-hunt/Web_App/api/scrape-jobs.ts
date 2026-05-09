// Vercel Serverless Function: /api/scrape-jobs
// Integrate job-ops, JobSpy, career-ops scraping here
import type { VercelRequest, VercelResponse } from '@vercel/node'

function buildScrapeResponse(body: any) {
  const { source } = body || {}
  // Simulate scraping for demo; replace with real integration (e.g., Python child_process, API call)
  let jobs = []
  if (source === 'job-ops') {
    jobs = [
      { position: 'Backend Engineer', company: 'Acme Corp', url: 'https://acme.com/jobs/1' },
      { position: 'Frontend Developer', company: 'Beta Inc', url: 'https://beta.com/jobs/2' }
    ]
  } else if (source === 'jobspy') {
    jobs = [
      { position: 'DevOps Engineer', company: 'Gamma LLC', url: 'https://gamma.com/jobs/3' },
      { position: 'QA Tester', company: 'Delta Ltd', url: 'https://delta.com/jobs/4' }
    ]
  } else if (source === 'career-ops') {
    jobs = [
      { position: 'Product Manager', company: 'Epsilon AG', url: 'https://epsilon.com/jobs/5' },
      { position: 'Data Scientist', company: 'Zeta GmbH', url: 'https://zeta.com/jobs/6' }
    ]
  }
  return { message: `Scraped ${jobs.length} jobs from ${source}.`, jobs }
}

async function fetchHandler(request: Request) {
  const body = await request.json().catch(() => ({}))
  return new Response(JSON.stringify(buildScrapeResponse(body)), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}

async function nodeHandler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json(buildScrapeResponse(req.body))
}

const handler = async (req: VercelRequest | Request, res?: VercelResponse) => {
  if (res) {
    return nodeHandler(req as VercelRequest, res)
  }

  return fetchHandler(req as Request)
}

;(handler as typeof handler & { fetch: typeof fetchHandler }).fetch = fetchHandler

export default handler as typeof handler & { fetch: typeof fetchHandler }
