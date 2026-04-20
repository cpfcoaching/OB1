<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Job Hunt Pipeline</h1>
        <p class="text-gray-600">Powered by Open Brain & AI</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-700 text-sm">{{ error }}</p>
      </div>

      <!-- Sign In Form -->
      <div class="space-y-6">
        <button
          @click="handleGoogleSignIn"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
        >
          <svg v-if="!loading" class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign in with Google</span>
        </button>
      </div>

      <!-- Info -->
      <p class="text-center text-gray-500 text-sm mt-8">
        Secure login with Google OAuth
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAnalytics } from '@/composables/useAnalytics'

const router = useRouter()
const { user, loading, error, isAuthenticated, signInWithGoogle, initializeAuth } = useAuth()
const { trackUserSignIn } = useAnalytics()

onMounted(async () => {
  await initializeAuth()
  if (isAuthenticated.value) {
    router.push('/dashboard')
  }
})

const handleGoogleSignIn = async () => {
  try {
    await signInWithGoogle()
    
    // Track sign in
    trackUserSignIn('google')
    
    if (isAuthenticated.value) {
      router.push('/dashboard')
    }
  } catch (err) {
    console.error('Sign-in failed:', err)
  }
}
</script>

<style scoped>
</style>
