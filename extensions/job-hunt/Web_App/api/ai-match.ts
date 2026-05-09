// Vercel Serverless Function: /api/ai-match
// Integrate ACE agent or other AI matching logic here
import type { VercelRequest, VercelResponse } from '@vercel/node'

function buildMatchResponse(body: any) {
  // Simulate AI matching for demo; replace with real ACE agent integration
  const { jobs = [] } = body || {}
  const matchedJobs = jobs.map((job: any, i: number) => ({ ...job, matchScore: 80 + i * 5 }))
  return { message: `AI matched ${matchedJobs.length} jobs.`, matchedJobs }
}

async function fetchHandler(request: Request) {
  const body = await request.json().catch(() => ({}))
  return new Response(JSON.stringify(buildMatchResponse(body)), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}

async function nodeHandler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json(buildMatchResponse(req.body))
}

const handler = async (req: VercelRequest | Request, res?: VercelResponse) => {
  if (res) {
    return nodeHandler(req as VercelRequest, res)
  }

  return fetchHandler(req as Request)
}

;(handler as typeof handler & { fetch: typeof fetchHandler }).fetch = fetchHandler

export default handler as typeof handler & { fetch: typeof fetchHandler }
