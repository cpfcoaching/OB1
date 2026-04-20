<template>
  <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-screen">
    <TopBanner />

    <!-- Page Header -->
    <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b p-6">
      <div class="max-w-7xl mx-auto">
        <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-2">🎯 Pipeline Overview</h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Visual analysis of your job search pipeline and conversion rates</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto p-6">
      <!-- Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-6 shadow-sm">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Total Applications</p>
          <p class="text-4xl font-bold text-indigo-600 mt-2">{{ pipelineMetrics.totalApplications }}</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-6 shadow-sm">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Interview Rate</p>
          <p class="text-4xl font-bold text-yellow-600 mt-2">{{ pipelineMetrics.interviewRate }}</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-6 shadow-sm">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Success Rate</p>
          <p class="text-4xl font-bold text-green-600 mt-2">{{ pipelineMetrics.successRate }}</p>
        </div>
      </div>

      <!-- Additional Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-6 shadow-sm">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Avg Days to Interview</p>
          <p class="text-3xl font-bold text-purple-600 mt-2">{{ pipelineMetrics.averageDaysToInterview }}</p>
          <p :class="isDark ? 'text-gray-500' : 'text-gray-500'" class="text-xs mt-2">days from application</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-6 shadow-sm">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Avg Days to Offer</p>
          <p class="text-3xl font-bold text-emerald-600 mt-2">{{ pipelineMetrics.averageDaysToOffer }}</p>
          <p :class="isDark ? 'text-gray-500' : 'text-gray-500'" class="text-xs mt-2">days from application</p>
        </div>
      </div>

      <!-- Funnel Chart -->
      <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 mb-6">
        <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-6">📊 Application Funnel</h2>
        
        <div v-if="pipelineMetrics.totalApplications === 0" :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-center py-8">
          No applications yet. Start by adding applications to see the pipeline!
        </div>

        <div v-else class="space-y-6">
          <div v-for="(stage, idx) in pipelineStages" :key="idx" class="space-y-2">
            <div class="flex justify-between items-center mb-2">
              <span :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="font-semibold">
                {{ stage.name }}
              </span>
              <span :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
                {{ stage.count }} ({{ stage.percentage }}%)
              </span>
            </div>
            <div :class="isDark ? 'bg-gray-700' : 'bg-gray-200'" class="h-12 rounded-full overflow-hidden">
              <div
                :class="getStageColor(stage.name)"
                :style="{ width: `${Math.max(stage.percentage, 5)}%` }"
                class="h-full flex items-center justify-end pr-4 rounded-full transition-all duration-300"
              >
                <span v-if="stage.percentage > 10" class="text-white text-sm font-bold">
                  {{ stage.percentage }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Conversion Drops -->
        <div v-if="pipelineStages.length > 1 && pipelineMetrics.totalApplications > 0" class="mt-8 pt-8 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <h3 :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="font-semibold mb-4">Conversion Rates</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div :class="isDark ? 'bg-gray-700' : 'bg-blue-50'" class="p-4 rounded">
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Applied → Interview</p>
              <p class="text-2xl font-bold text-blue-600 mt-1">
                {{ pipelineStages[1]?.percentage || 0 }}%
              </p>
            </div>
            <div :class="isDark ? 'bg-gray-700' : 'bg-yellow-50'" class="p-4 rounded">
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Interview → Offer</p>
              <p class="text-2xl font-bold text-yellow-600 mt-1">
                {{ pipelineStages[1]?.count ? Math.round((pipelineStages[2]?.count || 0) / pipelineStages[1].count * 100) : 0 }}%
              </p>
            </div>
            <div :class="isDark ? 'bg-gray-700' : 'bg-green-50'" class="p-4 rounded">
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Total Success Rate</p>
              <p class="text-2xl font-bold text-green-600 mt-1">
                {{ pipelineMetrics.successRate }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stage Breakdown -->
      <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
        <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-6">📋 Stage Breakdown</h2>
        
        <div v-if="pipelineMetrics.totalApplications === 0" :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-center py-8">
          No applications to analyze.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(stage, idx) in pipelineStages" :key="idx" :class="isDark ? 'bg-gray-700' : 'bg-gray-50'" class="p-6 rounded-lg border-l-4" :style="{ borderLeftColor: getStageColorBorder(stage.name) }">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl">{{ getStageEmoji(stage.name) }}</span>
              <div>
                <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="font-bold">{{ stage.name }}</h3>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs">{{ stage.percentage }}% of total</p>
              </div>
            </div>
            <p class="text-3xl font-bold">{{ stage.count }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import TopBanner from '@/components/TopBanner.vue'
import { usePipelineOverview } from '@/composables/usePipelineOverview'
import { useJobTracker } from '@/composables/useJobTracker'

const { isDark, initializeAuth } = useAuth()
const { pipelineStages, pipelineMetrics, getStageColor, getStageColorLight, getStageEmoji, getStageColorBorder } = usePipelineOverview()
const { loadJobs } = useJobTracker()

onMounted(async () => {
  await initializeAuth()
  await loadJobs()
})
</script>
