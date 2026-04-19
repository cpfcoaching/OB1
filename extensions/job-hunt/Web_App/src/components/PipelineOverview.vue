<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Pipeline Overview</h2>
    
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <div class="text-4xl font-bold text-blue-600 mb-2">{{ stats.total }}</div>
        <div class="text-blue-700">Applications in Pipeline</div>
        <div class="text-sm text-blue-600 mt-2">{{ conversionRate }}% interview rate</div>
      </div>
      
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
        <div class="text-4xl font-bold text-green-600 mb-2">{{ stats.offered }}</div>
        <div class="text-green-700">Offers Received</div>
        <div class="text-sm text-green-600 mt-2">{{ offerRate }}% offer rate</div>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
        <div class="text-4xl font-bold text-purple-600 mb-2">{{ stats.upcomingInterviews }}</div>
        <div class="text-purple-700">Upcoming Interviews</div>
        <div class="text-sm text-purple-600 mt-2">This week</div>
      </div>
    </div>

    <!-- Status Breakdown -->
    <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Pipeline Status</h3>
      <div class="space-y-3">
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-700">Applied</span>
            <span class="font-semibold text-gray-900">{{ stats.applied }}</span>
          </div>
          <div class="w-full bg-gray-300 rounded-full h-2">
            <div class="bg-yellow-500 h-2 rounded-full" :style="{width: getPercentage(stats.applied) + '%'}"></div>
          </div>
        </div>

        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-700">Interviewing</span>
            <span class="font-semibold text-gray-900">{{ stats.interviewing }}</span>
          </div>
          <div class="w-full bg-gray-300 rounded-full h-2">
            <div class="bg-purple-500 h-2 rounded-full" :style="{width: getPercentage(stats.interviewing) + '%'}"></div>
          </div>
        </div>

        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-700">Offered</span>
            <span class="font-semibold text-gray-900">{{ stats.offered }}</span>
          </div>
          <div class="w-full bg-gray-300 rounded-full h-2">
            <div class="bg-green-500 h-2 rounded-full" :style="{width: getPercentage(stats.offered) + '%'}"></div>
          </div>
        </div>

        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-700">Rejected</span>
            <span class="font-semibold text-gray-900">{{ stats.rejected }}</span>
          </div>
          <div class="w-full bg-gray-300 rounded-full h-2">
            <div class="bg-red-500 h-2 rounded-full" :style="{width: getPercentage(stats.rejected) + '%'}"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Insights -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-blue-900 mb-2">AI Insights</h3>
      <p class="text-blue-800 text-sm leading-relaxed">
        Your pipeline is performing {{ stats.interviewing > 0 ? 'well' : 'steady' }}. Focus on companies where you haven't heard back after 5 days. 
        {{ stats.offered > 0 ? `You have ${stats.offered} offer(s) - time to evaluate and negotiate!` : 'Keep pushing - interviews lead to offers!' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useJobHuntFirestore } from '@/composables/useJobHuntFirestore'

const { user } = useAuth()
const stats = ref({
  total: 0,
  applied: 0,
  interviewing: 0,
  offered: 0,
  rejected: 0,
  upcomingInterviews: 0,
})

const conversionRate = computed(() => {
  if (stats.value.total === 0) return 0
  return Math.round((stats.value.interviewing / stats.value.total) * 100)
})

const offerRate = computed(() => {
  if (stats.value.total === 0) return 0
  return Math.round((stats.value.offered / stats.value.total) * 100)
})

const getPercentage = (value: number) => {
  if (stats.value.total === 0) return 0
  return (value / stats.value.total) * 100
}

onMounted(async () => {
  if (user.value) {
    const firestore = useJobHuntFirestore(user.value.uid)
    stats.value = await firestore.getPipelineOverview()
  }
})
</script>
