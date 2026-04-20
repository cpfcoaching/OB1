<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Applications</h2>

    <div class="space-y-3">
      <div v-if="applications.length > 0" class="space-y-3">
        <div v-for="app in applications" :key="app.id" class="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-lg transition">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-semibold text-gray-900">{{ app.companyId }}</h3>
              <p class="text-gray-600 text-sm">Applied {{ formatDate(app.appliedDate) }}</p>
            </div>
            <select 
              :value="app.status"
              @change="(e) => handleStatusChange(app.id!, (e.target as HTMLSelectElement).value as any)"
              :class="[
                'px-3 py-1 rounded text-white text-sm font-medium',
                statusColors[app.status]
              ]"
            >
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
          <p v-if="app.notes" class="text-gray-600 text-sm">{{ app.notes }}</p>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        No applications yet. Add one when you apply for a job!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/composables/useAuth'
import { useJobHuntFirestore, type Application } from '@/composables/useJobHuntFirestore'

const { user } = useAuth()
const applications = ref<(Application & { id: string })[]>([])

const statusColors: Record<string, string> = {
  applied: 'bg-yellow-500',
  interviewing: 'bg-purple-500',
  offered: 'bg-green-500',
  rejected: 'bg-red-500',
  withdrawn: 'bg-gray-500',
}

const formatDate = (timestamp: any) => {
  return formatDistanceToNow(new Date(timestamp.seconds * 1000), { addSuffix: true })
}

const handleStatusChange = async (applicationId: string, newStatus: Application['status']) => {
  if (!user.value) return
  const firestore = useJobHuntFirestore(user.value.uid)
  await firestore.updateApplicationStatus(applicationId, newStatus)
  loadApplications()
}

const loadApplications = async () => {
  if (!user.value) return
  const firestore = useJobHuntFirestore(user.value.uid)
  applications.value = await firestore.getApplications()
}

onMounted(loadApplications)
</script>
