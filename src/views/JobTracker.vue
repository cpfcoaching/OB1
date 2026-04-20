<template>
  <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-screen">
    <TopBanner />

    <!-- Page Header -->
    <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b p-6">
      <div class="max-w-7xl mx-auto">
        <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-2">📊 Job Tracker</h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Track all your job applications through the pipeline</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto p-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Total Applied</p>
          <p class="text-3xl font-bold text-indigo-600 mt-2">{{ jobStats.total }}</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Applied</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">{{ jobStats.applied }}</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Interviews</p>
          <p class="text-3xl font-bold text-yellow-600 mt-2">{{ jobStats.interviewed }}</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Offers</p>
          <p class="text-3xl font-bold text-green-600 mt-2">{{ jobStats.offers }}</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Rejected</p>
          <p class="text-3xl font-bold text-red-600 mt-2">{{ jobStats.rejected }}</p>
        </div>
      </div>

      <!-- Add Job Form & Filter Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Add Job Form -->
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 lg:col-span-2">
          <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">➕ Add New Application</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <input
                v-model="newJob.company"
                type="text"
                placeholder="Company"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                v-model="newJob.role"
                type="text"
                placeholder="Job Role"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <input
                v-model="newJob.dateApplied"
                type="date"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                v-model="newJob.status"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Applied</option>
                <option>Interviewed</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <input
                v-model="newJob.location"
                type="text"
                placeholder="Location"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                v-model="newJob.salary"
                type="text"
                placeholder="Salary (optional)"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <textarea
              v-model="newJob.notes"
              placeholder="Notes (optional)"
              :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
              class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              rows="2"
            />
            <input
              v-model="newJob.link"
              type="url"
              placeholder="Job posting link (optional)"
              :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
              class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              @click="handleAddJob"
              :disabled="isLoading || !newJob.company || !newJob.role"
              class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              {{ isLoading ? '⏳ Adding...' : '✅ Add Application' }}
            </button>
          </div>
        </div>

        <!-- Filter & Search -->
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
          <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">🔍 Filter & Search</h2>
          <div class="space-y-4">
            <div>
              <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-2">Status</label>
              <select
                v-model="filterStatus"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>All</option>
                <option>Applied</option>
                <option>Interviewed</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>
            <div>
              <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-2">Search</label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Company or role..."
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div :class="isDark ? 'bg-gray-700' : 'bg-blue-50'" class="p-3 rounded-lg">
              <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-sm">
                <span class="font-bold">{{ filteredJobs.length }}</span> application{{ filteredJobs.length !== 1 ? 's' : '' }} found
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Jobs List -->
      <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm overflow-hidden">
        <div v-if="filteredJobs.length === 0" class="p-8 text-center">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">No jobs found</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'" class="border-b">
              <tr>
                <th :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="px-6 py-3 text-left text-sm font-semibold">Company</th>
                <th :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="px-6 py-3 text-left text-sm font-semibold">Role</th>
                <th :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="px-6 py-3 text-left text-sm font-semibold">Applied</th>
                <th :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="px-6 py-3 text-left text-sm font-semibold">Location</th>
                <th :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="job in filteredJobs"
                :key="job.id"
                :class="isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'"
                class="border-b transition"
              >
                <td :class="isDark ? 'text-white' : 'text-gray-900'" class="px-6 py-4 font-medium">{{ job.company }}</td>
                <td :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="px-6 py-4">{{ job.role }}</td>
                <td :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="px-6 py-4 text-sm">{{ formatDate(job.dateApplied) }}</td>
                <td class="px-6 py-4">
                  <select
                    :value="job.status"
                    @change="(e) => handleStatusChange(job.id!, (e.target as HTMLSelectElement).value as any)"
                    :class="getStatusColor(job.status)"
                    class="px-3 py-1 rounded-full text-sm font-medium cursor-pointer outline-none border-0"
                  >
                    <option>Applied</option>
                    <option>Interviewed</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </td>
                <td :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="px-6 py-4 text-sm">{{ job.location || '-' }}</td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex gap-2">
                    <button
                      v-if="job.link"
                      @click="openLink(job.link)"
                      class="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      🔗 Link
                    </button>
                    <button
                      @click="handleDeleteJob(job.id!)"
                      class="text-red-600 hover:text-red-700 font-medium"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import TopBanner from '@/components/TopBanner.vue'
import { useJobTracker, type Job } from '@/composables/useJobTracker'

const { isDark, initializeAuth } = useAuth()
const {
  filteredJobs,
  jobStats,
  filterStatus,
  searchQuery,
  isLoading,
  error,
  loadJobs,
  addJob,
  deleteJob,
  updateJobStatus
} = useJobTracker()

const newJob = ref<Job>({
  company: '',
  role: '',
  dateApplied: new Date().toISOString().split('T')[0],
  status: 'Applied',
  link: '',
  notes: '',
  salary: '',
  location: ''
})

const handleAddJob = async () => {
  if (!newJob.value.company || !newJob.value.role) {
    alert('Please enter company and role')
    return
  }

  try {
    await addJob(newJob.value)
    newJob.value = {
      company: '',
      role: '',
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'Applied',
      link: '',
      notes: '',
      salary: '',
      location: ''
    }
    alert('✅ Job added!')
  } catch (err) {
    alert('❌ Error adding job: ' + error.value)
  }
}

const handleStatusChange = async (jobId: string, newStatus: Job['status']) => {
  try {
    await updateJobStatus(jobId, newStatus)
  } catch (err) {
    alert('❌ Error updating status: ' + error.value)
  }
}

const handleDeleteJob = async (jobId: string) => {
  if (confirm('Are you sure you want to delete this application?')) {
    try {
      await deleteJob(jobId)
      alert('✅ Job deleted!')
    } catch (err) {
      alert('❌ Error deleting job: ' + error.value)
    }
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getStatusColor = (status: Job['status']) => {
  const colors: Record<Job['status'], string> = {
    Applied: 'bg-blue-100 text-blue-800',
    Interviewed: 'bg-yellow-100 text-yellow-800',
    Offer: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

onMounted(async () => {
  await initializeAuth()
  await loadJobs()
})
</script>
