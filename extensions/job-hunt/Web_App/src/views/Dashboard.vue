<template>
  <div :class="isDark ? 'dark' : ''" class="min-h-screen transition-colors duration-300">
    <!-- Top Banner -->
    <TopBanner />

    <!-- Dashboard Content -->
    <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-[calc(100vh-8rem)]">
      <!-- Main Content -->
      <main class="flex-1" :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'">
        <div class="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
          <!-- Welcome Section -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="rounded-xl shadow-sm border p-6 sm:p-8 mb-8">
            <div class="flex items-start justify-between">
              <div>
                <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-3xl font-bold mb-2">Welcome back, {{ user?.displayName }}! 👋</h2>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-lg">
                  Your AI-powered job search management platform powered by Open Brain.
                </p>
              </div>
              <div class="hidden sm:block text-4xl">🚀</div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="rounded-lg border shadow-sm p-6 hover:shadow-md transition">
              <div class="flex items-center justify-between">
                <div>
                  <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium mb-1">Job Opportunities</p>
                  <p :class="isDark ? 'text-white' : 'text-gray-900'" class="text-3xl font-bold">0</p>
                </div>
                <span class="text-4xl opacity-50">💼</span>
              </div>
            </div>
            <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="rounded-lg border shadow-sm p-6 hover:shadow-md transition">
              <div class="flex items-center justify-between">
                <div>
                  <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium mb-1">Applications</p>
                  <p :class="isDark ? 'text-white' : 'text-gray-900'" class="text-3xl font-bold">0</p>
                </div>
                <span class="text-4xl opacity-50">📨</span>
              </div>
            </div>
            <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="rounded-lg border shadow-sm p-6 hover:shadow-md transition">
              <div class="flex items-center justify-between">
                <div>
                  <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium mb-1">Interviews</p>
                  <p :class="isDark ? 'text-white' : 'text-gray-900'" class="text-3xl font-bold">0</p>
                </div>
                <span class="text-4xl opacity-50">💬</span>
              </div>
            </div>
            <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="rounded-lg border shadow-sm p-6 hover:shadow-md transition">
              <div class="flex items-center justify-between">
                <div>
                  <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium mb-1">Offers</p>
                  <p :class="isDark ? 'text-white' : 'text-gray-900'" class="text-3xl font-bold">0</p>
                </div>
                <span class="text-4xl opacity-50">🎯</span>
              </div>
            </div>
          </div>

          <!-- Filter Section -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="rounded-lg border shadow-sm p-4 mb-8">
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="filter in filters"
                :key="filter"
                :class="activeFilter === filter 
                  ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700')
                  : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
                @click="activeFilter = filter"
                class="px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                {{ filter }}
              </button>
            </div>
          </div>

          <!-- Features Section -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="rounded-xl shadow-sm border p-8 mb-8">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-6">Features</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <router-link
                v-for="feature in features"
                :key="feature.title"
                :to="feature.route"
                :class="isDark ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 hover:from-indigo-50 border-gray-200'"
                class="border-2 rounded-lg p-6 transition duration-300 cursor-pointer group block relative"
              >
                <div class="text-3xl mb-3 group-hover:scale-110 transition">{{ feature.emoji }}</div>
                <div class="flex items-center mb-2">
                  <div :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-semibold">{{ feature.title }}</div>
                  <span
                    v-if="feature.status"
                    :class="[
                      'ml-2 px-2 py-0.5 rounded text-xs font-bold',
                      feature.status === 'Stable' ? (isDark ? 'bg-green-700 text-green-200' : 'bg-green-100 text-green-700') : '',
                      feature.status === 'Beta' ? (isDark ? 'bg-yellow-700 text-yellow-200' : 'bg-yellow-100 text-yellow-700') : '',
                      feature.status === 'Experimental' ? (isDark ? 'bg-red-700 text-red-200' : 'bg-red-100 text-red-700') : ''
                    ]"
                    :title="feature.tooltip"
                  >
                    {{ feature.status }}
                  </span>
                  <span v-if="feature.tooltip" class="ml-1 cursor-help" :title="feature.tooltip">ℹ️</span>
                </div>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">{{ feature.description }}</p>
              </router-link>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import TopBanner from '@/components/TopBanner.vue'

const router = useRouter()
const { user, logout, initializeAuth, isDark } = useAuth()

// UI State
const showProfileMenu = ref(false)
const searchQuery = ref('')
const activeFilter = ref('All')

// Data
const filters = ref(['All', 'Active', 'In Progress', 'Completed', 'Archived'])
const features = ref([
  {
    title: 'Job Tracker',
    emoji: '📊',
    description: 'Track applications and monitor pipeline progress',
    route: '/job-tracker',
    status: 'Stable',
    tooltip: 'Fully functional. Track your job applications and progress.'
  },
  {
    title: 'AI Matching',
    emoji: '🤖',
    description: 'AI-powered job recommendations based on your profile',
    route: '/ai-matching',
    status: 'Beta',
    tooltip: 'AI matching is available but may not always return results. Improvements ongoing.'
  },
  {
    title: 'Resume Builder',
    emoji: '📝',
    description: 'Create and optimize your resume with AI assistance',
    route: '/resume-builder',
    status: 'Stable',
    tooltip: 'Fully functional. Create and edit your resume.'
  },
  {
    title: 'Interview Prep',
    emoji: '💬',
    description: 'Practice interviews with AI coach',
    route: '/interview-prep',
    status: 'Experimental',
    tooltip: 'Some features may be limited or in development.'
  },
  {
    title: 'Job Scraper',
    emoji: '🌐',
    description: 'Automatic job discovery from multiple sources',
    route: '/job-scraper',
    status: 'Beta',
    tooltip: 'Job scraping is available but may not cover all sources. Integration with job-ops, JobSpy, and career-ops in progress.'
  },
  {
    title: 'Email Templates',
    emoji: '📧',
    description: 'Pre-written templates for follow-ups and inquiries',
    route: '/email-templates',
    status: 'Stable',
    tooltip: 'Ready to use.'
  }
])

onMounted(async () => {
  await initializeAuth()
  if (!user.value) {
    router.push('/login')
  }
})

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (err) {
    console.error('Logout failed:', err)
  }
}
</script>

<style scoped>
</style>
