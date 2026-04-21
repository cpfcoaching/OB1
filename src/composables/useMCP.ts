import axios from 'axios'

export interface MCPRequest {
  jsonrpc: string
  id: string | number
  method: string
  params?: Record<string, any>
}

export interface MCPResponse {
  jsonrpc: string
  id: string | number
  result?: any
  error?: {
    code: number
    message: string
    data?: any
  }
}

const mcpClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

// Separate client for Open Brain with SSE streaming support
const openBrainClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream',
  },
})

export const useMCP = () => {
  const jobHuntMcpUrl = import.meta.env.VITE_JOB_HUNT_MCP_URL
  const openBrainMcpUrl = import.meta.env.VITE_OPEN_BRAIN_MCP_URL
  const openBrainJwt = import.meta.env.VITE_OPEN_BRAIN_MCP_JWT
  const openBrainAccessKey = import.meta.env.VITE_OPEN_BRAIN_MCP_ACCESS_KEY

  const callJobHuntTool = async (method: string, params: Record<string, any>) => {
    try {
      const response = await mcpClient.post<MCPResponse>(jobHuntMcpUrl, {
        jsonrpc: '2.0',
        id: `${Date.now()}-${Math.random()}`,
        method,
        params,
      })

      if (response.data.error) {
        throw new Error(response.data.error.message)
      }

      return response.data.result
    } catch (error) {
      console.error(`MCP call failed for ${method}:`, error)
      throw error
    }
  }

  const callOpenBrainTool = async (method: string, params: Record<string, any>) => {
    try {
      const response = await openBrainClient.post<MCPResponse>(openBrainMcpUrl, {
        jsonrpc: '2.0',
        id: `${Date.now()}-${Math.random()}`,
        method,
        params,
      }, {
        headers: {
          'Authorization': openBrainJwt ? `Bearer ${openBrainJwt}` : undefined,
          'x-brain-key': openBrainAccessKey || undefined,
        },
      })

      if (response.data.error) {
        throw new Error(response.data.error.message)
      }

      return response.data.result
    } catch (error) {
      console.error(`MCP call failed for ${method}:`, error)
      throw error
    }
  }

  // Job Hunt Pipeline Tools
  const addCompanyViaAI = async (name: string, industry: string, location: string, details?: string) => {
    return callJobHuntTool('add_company', {
      name,
      industry,
      location,
      notes: details,
    })
  }

  const addJobPostingViaAI = async (companyId: string, title: string, level: string, salary?: string) => {
    return callJobHuntTool('add_job_posting', {
      company_id: companyId,
      title,
      level,
      salary_range: salary,
    })
  }

  const submitApplicationViaAI = async (postingId: string, resumeVersion: string) => {
    return callJobHuntTool('submit_application', {
      posting_id: postingId,
      resume_version: resumeVersion,
    })
  }

  const scheduleInterviewViaAI = async (applicationId: string, type: string, scheduledAt: string) => {
    return callJobHuntTool('schedule_interview', {
      application_id: applicationId,
      interview_type: type,
      scheduled_at: scheduledAt,
    })
  }

  const getPipelineOverviewViaAI = async () => {
    return callJobHuntTool('get_pipeline_overview', {})
  }

  const getUpcomingInterviewsViaAI = async () => {
    return callJobHuntTool('get_upcoming_interviews', {})
  }

  // Open Brain Integration
  const captureThoughtViaAI = async (content: string, metadata?: Record<string, any>) => {
    return callOpenBrainTool('capture_thought', {
      content,
      metadata,
    })
  }

  const searchThoughtsViaAI = async (query: string) => {
    return callOpenBrainTool('search_thoughts', {
      query,
    })
  }

  return {
    addCompanyViaAI,
    addJobPostingViaAI,
    submitApplicationViaAI,
    scheduleInterviewViaAI,
    getPipelineOverviewViaAI,
    getUpcomingInterviewsViaAI,
    captureThoughtViaAI,
    searchThoughtsViaAI,
  }
}
