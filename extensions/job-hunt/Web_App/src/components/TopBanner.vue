<template>
  <div>
    <!-- Top Header -->
    <nav :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b sticky top-0 z-40 shadow-sm">
      <div class="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
        <!-- Logo & Title -->
        <router-link to="/dashboard" class="flex items-center gap-3 min-w-0 hover:opacity-80 transition">
          <div :class="isDark ? 'bg-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-blue-600'" class="w-10 h-10 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">JH</span>
          </div>
          <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-xl font-bold hidden sm:block truncate">Job Hunt</h1>
        </router-link>

        <!-- Right Actions -->
        <div class="flex items-center gap-3 ml-auto">
          <!-- Theme Toggle -->
          <button 
            @click="() => { trackThemeToggle(isDark ? 'light' : 'dark'); isDark = !isDark }"
            :class="isDark ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'"
            class="p-2 rounded-lg hover:opacity-80 transition"
            :title="isDark ? 'Light mode' : 'Dark mode'"
          >
            {{ isDark ? '☀️' : '🌙' }}
          </button>

          <!-- Profile Dropdown -->
          <div class="relative">
            <button 
              @click="showProfileMenu = !showProfileMenu"
              class="flex items-center gap-2 hover:opacity-80 transition"
            >
              <img v-if="user?.photoURL" :src="user.photoURL" :alt="user.displayName || 'Profile'" class="w-8 h-8 rounded-full" />
              <div v-else :class="isDark ? 'bg-gray-600' : 'bg-gray-300'" class="w-8 h-8 rounded-full"></div>
            </button>
            
            <!-- Dropdown Menu -->
            <div 
              v-if="showProfileMenu"
              :class="isDark ? 'bg-gray-800 border-gray-700 shadow-xl' : 'bg-white border-gray-200 shadow-lg'"
              class="absolute right-0 mt-2 w-48 rounded-lg border z-50"
            >
              <div :class="isDark ? 'text-gray-200 border-gray-700' : 'text-gray-900 border-gray-200'" class="p-4 border-b">
                <p class="font-semibold truncate">{{ user?.displayName }}</p>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm truncate">{{ user?.email }}</p>
              </div>
              <button 
                @click="handleLogout"
                :class="isDark ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'"
                class="w-full text-left px-4 py-2 transition font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Feature Navigation Bar -->
    <nav :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'" class="border-b sticky top-12 z-30 overflow-x-auto">
      <div class="px-4 sm:px-6 lg:px-8 flex gap-1 min-w-max sm:min-w-0 sm:flex-wrap">
        <router-link 
          to="/dashboard"
          :class="isActive('dashboard') 
            ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700')
            : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-white')"
          class="flex items-center gap-2 px-4 py-3 rounded-t-lg transition font-medium text-sm whitespace-nowrap"
        >
          <span>📊</span> <span class="hidden sm:inline">Dashboard</span>
        </router-link>
        <router-link 
          to="/job-tracker"
          :class="isActive('job-tracker') 
            ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700')
            : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-white')"
          class="flex items-center gap-2 px-4 py-3 rounded-t-lg transition font-medium text-sm whitespace-nowrap"
        >
          <span>💼</span> <span class="hidden sm:inline">Jobs</span>
        </router-link>
        <router-link 
          to="/ai-matching"
          :class="isActive('ai-matching') 
            ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700')
            : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-white')"
          class="flex items-center gap-2 px-4 py-3 rounded-t-lg transition font-medium text-sm whitespace-nowrap"
        >
          <span>🤖</span> <span class="hidden sm:inline">Matching</span>
        </router-link>
        <router-link 
          to="/resume-builder"
          :class="isActive('resume-builder') 
            ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700')
            : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-white')"
          class="flex items-center gap-2 px-4 py-3 rounded-t-lg transition font-medium text-sm whitespace-nowrap"
        >
          <span>📝</span> <span class="hidden sm:inline">Resume</span>
        </router-link>
        <router-link 
          to="/interview-prep"
          :class="isActive('interview-prep') 
            ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700')
            : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-white')"
          class="flex items-center gap-2 px-4 py-3 rounded-t-lg transition font-medium text-sm whitespace-nowrap"
        >
          <span>💬</span> <span class="hidden sm:inline">Interview</span>
        </router-link>
        <router-link 
          to="/job-scraper"
          :class="isActive('job-scraper') 
            ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700')
            : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-white')"
          class="flex items-center gap-2 px-4 py-3 rounded-t-lg transition font-medium text-sm whitespace-nowrap"
        >
          <span>🌐</span> <span class="hidden sm:inline">Scraper</span>
        </router-link>
        <router-link 
          to="/email-templates"
          :class="isActive('email-templates') 
            ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700')
            : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-white')"
          class="flex items-center gap-2 px-4 py-3 rounded-t-lg transition font-medium text-sm whitespace-nowrap"
        >
          <span>📧</span> <span class="hidden sm:inline">Emails</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAnalytics } from '@/composables/useAnalytics'

const router = useRouter()
const { user, logout, isDark } = useAuth()
const { trackUserSignOut, trackThemeToggle } = useAnalytics()

const showProfileMenu = ref(false)

const isActive = (route: string) => {
  return router.currentRoute.value.path.includes(route)
}

const handleLogout = async () => {
  // Track sign out
  trackUserSignOut()
  
  await logout()
  router.push('/login')
}
</script>