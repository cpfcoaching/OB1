<template>
  <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-screen">
    <TopBanner />

    <!-- Page Header -->
    <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b p-6">
      <div class="max-w-7xl mx-auto">
        <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-2">📋 Applications Timeline</h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Track your application journey with follow-ups and contact info</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto p-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Total Applications</p>
          <p class="text-3xl font-bold text-indigo-600 mt-2">{{ applicationStats.total }}</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Need Follow-up</p>
          <p class="text-3xl font-bold text-red-600 mt-2">{{ applicationStats.needsFollowUp }}</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">With Follow-ups</p>
          <p class="text-3xl font-bold text-green-600 mt-2">{{ applicationStats.withFollowUps }}</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">No Contact Info</p>
          <p class="text-3xl font-bold text-yellow-600 mt-2">{{ applicationStats.noContact }}</p>
        </div>
      </div>

      <!-- Add Application Form & Filter -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Add Application Form -->
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 lg:col-span-2">
          <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">➕ Link Application to Job</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <input
                v-model="newApp.company"
                type="text"
                placeholder="Company"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                v-model="newApp.role"
                type="text"
                placeholder="Job Role"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <input
                v-model="newApp.appliedDate"
                type="date"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                v-model="newApp.jobId"
                type="text"
                placeholder="Job ID (optional)"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <input
                v-model="newApp.contactName"
                type="text"
                placeholder="Contact Name (optional)"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                v-model="newApp.contactEmail"
                type="email"
                placeholder="Contact Email (optional)"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <input
              v-model="newApp.contactPhone"
              type="tel"
              placeholder="Contact Phone (optional)"
              :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
              class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              v-model="newApp.notes"
              placeholder="Notes (optional)"
              :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
              class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              rows="2"
            />
            <button
              @click="handleAddApplication"
              :disabled="isLoading || !newApp.company || !newApp.role"
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
                <span class="font-bold">{{ filteredApplications.length }}</span> application{{ filteredApplications.length !== 1 ? 's' : '' }} found
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Applications List -->
      <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm overflow-hidden">
        <div v-if="filteredApplications.length === 0" class="p-8 text-center">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">No applications found</p>
        </div>

        <div v-else class="divide-y" :class="isDark ? 'divide-gray-700' : 'divide-gray-200'">
          <div
            v-for="app in filteredApplications"
            :key="app.id"
            :class="isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'"
            class="p-6 transition"
          >
            <!-- Application Header -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold">{{ app.company }}</h3>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">{{ app.role }} • Applied {{ formatDate(app.appliedDate) }}</p>
              </div>
              <button
                @click="handleDeleteApplication(app.id!)"
                class="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                🗑️ Delete
              </button>
            </div>

            <!-- Contact Info -->
            <div v-if="app.contactName || app.contactEmail || app.contactPhone" class="mb-4 p-3 rounded" :class="isDark ? 'bg-gray-700' : 'bg-blue-50'">
              <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-sm">
                <span v-if="app.contactName" class="block">👤 {{ app.contactName }}</span>
                <span v-if="app.contactEmail" class="block">📧 {{ app.contactEmail }}</span>
                <span v-if="app.contactPhone" class="block">📞 {{ app.contactPhone }}</span>
              </p>
            </div>

            <!-- Notes -->
            <div v-if="app.notes" class="mb-4 p-3 rounded" :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
              <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-sm">📝 {{ app.notes }}</p>
            </div>

            <!-- Follow-ups Timeline -->
            <div class="mb-4">
              <h4 :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-sm font-semibold mb-3">Follow-up History</h4>
              <div v-if="app.followUps && app.followUps.length > 0" class="space-y-2 mb-3">
                <div
                  v-for="(followUp, idx) in app.followUps"
                  :key="idx"
                  :class="isDark ? 'bg-gray-700' : 'bg-gray-50'"
                  class="p-3 rounded flex justify-between items-start"
                >
                  <div>
                    <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-sm">
                      <span class="font-semibold">{{ getFollowUpIcon(followUp.type) }} {{ followUp.type }}</span>
                      • {{ formatDate(followUp.date) }}
                      <span v-if="followUp.completed" class="ml-2 text-green-600">✅ Completed</span>
                    </p>
                    <p v-if="followUp.notes" :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs mt-1">{{ followUp.notes }}</p>
                  </div>
                  <button
                    @click="handleDeleteFollowUp(app.id!, idx)"
                    class="text-red-600 hover:text-red-700 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div v-else :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm italic">No follow-ups yet</div>
            </div>

            <!-- Add Follow-up Form -->
            <div :class="isDark ? 'bg-gray-700' : 'bg-gray-50'" class="p-3 rounded">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  v-model="newFollowUps[app.id!]!.date"
                  type="date"
                  :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                  class="border rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <select
                  v-model="newFollowUps[app.id!]!.type"
                  :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                  class="border rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="email">Email</option>
                  <option value="call">Call</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="other">Other</option>
                </select>
                <input
                  v-model="newFollowUps[app.id!]!.notes"
                  type="text"
                  placeholder="Notes..."
                  :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                  class="border rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                @click="handleAddFollowUp(app.id!)"
                class="mt-2 w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition"
              >
                + Add Follow-up
              </button>
            </div>
          </div>
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
import { useApplicationTracker, type Application, type FollowUp } from '@/composables/useApplicationTracker'

const { isDark, initializeAuth } = useAuth()
const {
  filteredApplications,
  applicationStats,
  searchQuery,
  isLoading,
  error,
  loadApplications,
  addApplication,
  deleteApplication,
  addFollowUp,
  deleteFollowUp
} = useApplicationTracker()

const newApp = ref<Application>({
  jobId: '',
  company: '',
  role: '',
  appliedDate: new Date().toISOString().split('T')[0],
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  notes: '',
  followUps: []
})

const newFollowUps = ref<Record<string, FollowUp>>({})

const handleAddApplication = async () => {
  if (!newApp.value.company || !newApp.value.role) {
    alert('Please enter company and role')
    return
  }

  try {
    await addApplication(newApp.value)
    newApp.value = {
      jobId: '',
      company: '',
      role: '',
      appliedDate: new Date().toISOString().split('T')[0],
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: '',
      followUps: []
    }
    alert('✅ Application added!')
  } catch (err) {
    alert('❌ Error adding application: ' + error.value)
  }
}

const handleDeleteApplication = async (appId: string) => {
  if (confirm('Are you sure you want to delete this application?')) {
    try {
      await deleteApplication(appId)
      alert('✅ Application deleted!')
    } catch (err) {
      alert('❌ Error deleting application: ' + error.value)
    }
  }
}

const handleAddFollowUp = async (appId: string) => {
  const followUp = newFollowUps.value[appId]
  if (!followUp || !followUp.date) {
    alert('Please enter follow-up date')
    return
  }

  try {
    await addFollowUp(appId, {
      date: followUp.date,
      type: followUp.type || 'email',
      notes: followUp.notes || '',
      completed: false
    })
    newFollowUps.value[appId] = {
      date: '',
      type: 'email',
      notes: '',
      completed: false
    }
    alert('✅ Follow-up added!')
  } catch (err) {
    alert('❌ Error adding follow-up: ' + error.value)
  }
}

const handleDeleteFollowUp = async (appId: string, followUpIndex: number) => {
  if (confirm('Delete this follow-up?')) {
    try {
      await deleteFollowUp(appId, followUpIndex)
      alert('✅ Follow-up deleted!')
    } catch (err) {
      alert('❌ Error deleting follow-up: ' + error.value)
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

const getFollowUpIcon = (type: string) => {
  const icons: Record<string, string> = {
    email: '📧',
    call: '☎️',
    linkedin: '💼',
    other: '📌'
  }
  return icons[type] || '📌'
}

onMounted(async () => {
  await initializeAuth()
  await loadApplications()
  
  // Initialize follow-up form state
  filteredApplications.value.forEach(app => {
    if (app.id && !newFollowUps.value[app.id]) {
      newFollowUps.value[app.id] = {
        date: '',
        type: 'email',
        notes: '',
        completed: false
      }
    }
  })
})
</script>
