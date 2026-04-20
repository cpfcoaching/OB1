/**Pipeline Overview composable for analytics and visualization.*/

import { ref, computed } from 'vue'
import { useJobTracker } from './useJobTracker'
import { useApplicationTracker } from './useApplicationTracker'

export interface PipelineStage {
  name: 'Applied' | 'Interviewed' | 'Offer' | 'Rejected'
  count: number
  percentage: number
}

export interface PipelineMetrics {
  totalApplications: number
  conversionRate: string
  averageDaysToInterview: number
  averageDaysToOffer: number
  successRate: string
  interviewRate: string
}

export function usePipelineOverview() {
  const { jobs, jobStats } = useJobTracker()
  const { applications } = useApplicationTracker()

  const pipelineStages = computed(() => {
    const total = jobStats.value.total || 1
    return [
      {
        name: 'Applied' as const,
        count: jobStats.value.applied,
        percentage: Math.round((jobStats.value.applied / total) * 100)
      },
      {
        name: 'Interviewed' as const,
        count: jobStats.value.interviewed,
        percentage: Math.round((jobStats.value.interviewed / total) * 100)
      },
      {
        name: 'Offer' as const,
        count: jobStats.value.offers,
        percentage: Math.round((jobStats.value.offers / total) * 100)
      },
      {
        name: 'Rejected' as const,
        count: jobStats.value.rejected,
        percentage: Math.round((jobStats.value.rejected / total) * 100)
      }
    ]
  })

  const pipelineMetrics = computed(() => {
    const total = jobStats.value.total || 1
    const interviewed = jobStats.value.interviewed
    const offers = jobStats.value.offers

    // Calculate conversion rates
    const interviewRate = ((interviewed / total) * 100).toFixed(1)
    const successRate = ((offers / total) * 100).toFixed(1)
    
    // Calculate average days to milestones
    let totalDaysToInterview = 0
    let interviewCount = 0
    let totalDaysToOffer = 0
    let offerCount = 0

    if (jobs.value && jobs.value.length > 0) {
      jobs.value.forEach(job => {
        const appliedDate = new Date(job.dateApplied)
        
        if (job.status === 'Interviewed' || job.status === 'Offer') {
          totalDaysToInterview += Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24))
          interviewCount++
        }
        
        if (job.status === 'Offer') {
          totalDaysToOffer += Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24))
          offerCount++
        }
      })
    }

    return {
      totalApplications: total,
      conversionRate: `${successRate}%`,
      averageDaysToInterview: interviewCount > 0 ? Math.round(totalDaysToInterview / interviewCount) : 0,
      averageDaysToOffer: offerCount > 0 ? Math.round(totalDaysToOffer / offerCount) : 0,
      successRate: `${successRate}%`,
      interviewRate: `${interviewRate}%`
    }
  })

  const funnelChartData = computed(() => {
    return pipelineStages.value.map(stage => ({
      stage: stage.name,
      count: stage.count,
      width: `${Math.max(stage.percentage, 5)}%`
    }))
  })

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      Applied: 'bg-blue-500',
      Interviewed: 'bg-yellow-500',
      Offer: 'bg-green-500',
      Rejected: 'bg-red-500'
    }
    return colors[stage] || 'bg-gray-500'
  }

  const getStageColorLight = (stage: string) => {
    const colors: Record<string, string> = {
      Applied: 'bg-blue-100 text-blue-800',
      Interviewed: 'bg-yellow-100 text-yellow-800',
      Offer: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800'
    }
    return colors[stage] || 'bg-gray-100 text-gray-800'
  }

  const getStageEmoji = (stage: string) => {
    const emojis: Record<string, string> = {
      Applied: '📨',
      Interviewed: '💬',
      Offer: '🎉',
      Rejected: '❌'
    }
    return emojis[stage] || '📌'
  }

  const getStageColorBorder = (stage: string) => {
    const colors: Record<string, string> = {
      Applied: '#3b82f6',
      Interviewed: '#eab308',
      Offer: '#22c55e',
      Rejected: '#ef4444'
    }
    return colors[stage] || '#6b7280'
  }

  return {
    pipelineStages,
    pipelineMetrics,
    funnelChartData,
    getStageColor,
    getStageColorLight,
    getStageEmoji,
    getStageColorBorder,
    jobs,
    jobStats
  }
}
