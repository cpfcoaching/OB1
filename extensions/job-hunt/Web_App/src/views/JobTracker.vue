<template>
  <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-screen">
    <!-- Banner Navigation -->
    <TopBanner />

    <!-- Page Header -->
    <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b p-6">
      <div class="max-w-6xl mx-auto">
        <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-1">💼 Job Tracker</h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Track your applications and monitor your job search pipeline</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto p-6">
      <!-- Add Job Button -->
      <div class="mb-6">
        <button 
          @click="showAddJobForm = !showAddJobForm"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          + Add New Job
        </button>
      </div>

      <!-- Add Job Form -->
      <div v-if="showAddJobForm" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-6 mb-6 shadow-sm">
        <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">Add New Job</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            v-model="newJob.company" 
            type="text" 
            placeholder="Company Name"
            :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
            class="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input 
            v-model="newJob.position" 
            type="text" 
            placeholder="Position Title"
            :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
            class="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input 
            v-model="newJob.url" 
            type="url" 
            placeholder="Job URL"
            :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
            class="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select 
            v-model="newJob.status"
            :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
            class="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="saved">📌 Saved</option>
            <option value="applied">📨 Applied</option>
            <option value="interview">💬 Interview</option>
            <option value="offer">🎯 Offer</option>
            <option value="rejected">❌ Rejected</option>
          </select>
        </div>
        <div class="flex gap-3 mt-4">
          <button 
            @click="addJob"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            Save Job
          </button>
          <button 
            @click="showAddJobForm = false"
            :class="isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            class="px-4 py-2 rounded-lg transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Jobs Grid -->
      <div v-if="jobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="job in jobs"
          :key="job.id"
          :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
          class="border rounded-lg p-6 shadow-sm hover:shadow-md transition"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="font-bold text-lg">{{ job.position }}</h3>
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">{{ job.company }}</p>
            </div>
            <span class="text-2xl">{{ getStatusEmoji(job.status) }}</span>
          </div>
          <a 
            v-if="job.url"
            :href="job.url" 
            target="_blank" 
            class="text-indigo-600 hover:text-indigo-700 text-sm underline block mb-3"
          >
            View Job →
          </a>
          <div class="flex gap-2 mt-4">
            <button 
              @click="deleteJob(job.id)"
              class="flex-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded text-sm transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-12 text-center">
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-lg mb-4">No jobs tracked yet</p>
        <button 
          @click="showAddJobForm = true"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition font-medium"
        >
          Add Your First Job
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAnalytics } from '@/composables/useAnalytics'
import TopBanner from '@/components/TopBanner.vue'

const router = useRouter()
const { user, initializeAuth, isDark } = useAuth()
const { trackJobAdded, trackJobDeleted, trackFeatureView } = useAnalytics()

const showAddJobForm = ref(false)
const jobs = ref<any[]>([])
const newJob = ref({
  company: '',
  position: '',
  url: '',
  status: 'saved'
})

onMounted(async () => {
  await initializeAuth()
  if (!user.value) {
    router.push('/login')
  }
  loadJobs()
  trackFeatureView('job_tracker')
})

const addJob = () => {
  if (!newJob.value.company || !newJob.value.position) {
    alert('Please fill in company and position')
    return
  }
  
  jobs.value.push({
    id: Date.now(),
    ...newJob.value
  })
  
  // Save to localStorage
  localStorage.setItem('jobs', JSON.stringify(jobs.value))
  
  // Track job addition
  trackJobAdded({
    company: newJob.value.company,
    position: newJob.value.position,
    status: newJob.value.status
  })
  
  // Reset form
  newJob.value = { company: '', position: '', url: '', status: 'saved' }
  showAddJobForm.value = false
}

const deleteJob = (id: number) => {
  const deletedJob = jobs.value.find(job => job.id === id)
  jobs.value = jobs.value.filter(job => job.id !== id)
  localStorage.setItem('jobs', JSON.stringify(jobs.value))
  
  // Track job deletion
  if (deletedJob) {
    trackJobDeleted({
      company: deletedJob.company,
      position: deletedJob.position
    })
  }
}

const loadJobs = () => {
  // TODO: Load from Firestore
  const stored = localStorage.getItem('jobs')
  if (stored) {
    jobs.value = JSON.parse(stored)
  }
}

const getStatusEmoji = (status: string) => {
  const emojis: Record<string, string> = {
    'saved': '📌',
    'applied': '📨',
    'interview': '💬',
    'offer': '🎯',
    'rejected': '❌'
  }
  return emojis[status] || '📌'
}
</script>
