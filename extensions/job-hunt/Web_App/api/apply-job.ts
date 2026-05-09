// Vercel Serverless Function: /api/apply-job
// Integrate JobSpy or ACE agent for auto-apply here
import type { VercelRequest, VercelResponse } from '@vercel/node'

function buildApplyResponse(body: any) {
  // Simulate auto-apply for demo; replace with real JobSpy/ACE integration
  const { jobs = [] } = body || {}
  return { message: `Auto-applied to ${jobs.length} jobs.` }
}

async function fetchHandler(request: Request) {
  const body = await request.json().catch(() => ({}))
  return new Response(JSON.stringify(buildApplyResponse(body)), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}

async function nodeHandler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json(buildApplyResponse(req.body))
}

const handler = async (req: VercelRequest | Request, res?: VercelResponse) => {
  if (res) {
    return nodeHandler(req as VercelRequest, res)
  }

  return fetchHandler(req as Request)
}

;(handler as typeof handler & { fetch: typeof fetchHandler }).fetch = fetchHandler

export default handler as typeof handler & { fetch: typeof fetchHandler }
