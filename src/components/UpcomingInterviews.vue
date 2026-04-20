<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Upcoming Interviews</h2>

    <div class="space-y-3">
      <div v-if="interviews.length > 0" class="space-y-3">
        <div v-for="interview in upcomingOnly" :key="interview.id" class="bg-white p-4 border border-l-4 border-l-blue-500 rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-semibold text-gray-900 capitalize">{{ interview.type }} Interview</h3>
              <p class="text-gray-600 text-sm">{{ formatDate(interview.scheduledAt) }}</p>
            </div>
            <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
              {{ dayCountdown(interview.scheduledAt) }} days away
            </span>
          </div>
          <p v-if="interview.notes" class="text-gray-600 text-sm mt-2">{{ interview.notes }}</p>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        No upcoming interviews scheduled.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { formatDistanceToNow, differenceInDays } from 'date-fns'
import { useAuth } from '@/composables/useAuth'
import { useJobHuntFirestore, type Interview } from '@/composables/useJobHuntFirestore'

const { user } = useAuth()
const interviews = ref<(Interview & { id: string })[]>([])

const upcomingOnly = computed(() => {
  return interviews.value.filter(i => {
    const scheduled = new Date(i.scheduledAt.seconds * 1000)
    return scheduled > new Date()
  }).sort((a, b) => a.scheduledAt.seconds - b.scheduledAt.seconds)
})

const formatDate = (timestamp: any) => {
  return formatDistanceToNow(new Date(timestamp.seconds * 1000), { addSuffix: true })
}

const dayCountdown = (timestamp: any) => {
  return Math.ceil(differenceInDays(new Date(timestamp.seconds * 1000), new Date()))
}

const loadInterviews = async () => {
  if (!user.value) return
  const firestore = useJobHuntFirestore(user.value.uid)
  interviews.value = await firestore.getInterviews()
}

onMounted(loadInterviews)
</script>
