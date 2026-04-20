<template>
  <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-screen">
    <!-- Banner Navigation -->
    <TopBanner />

    <!-- Page Header -->
    <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b p-6">
      <div class="max-w-6xl mx-auto">
        <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-1">🤖 AI Matching</h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Paste a job description and get instant skill matching analysis</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto p-6">
      <!-- Input Section -->
      <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 mb-6">
        <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-semibold mb-3">
          📋 Paste Job Description
        </label>
        <textarea
          v-model="jobDescription"
          :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'"
          class="w-full border rounded-lg p-4 font-mono text-sm h-40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Paste job description here... (title, requirements, responsibilities, etc.)"
        />
        <div class="flex gap-3 mt-4">
          <button
            @click="analyzeJob"
            :disabled="!jobDescription.trim() || isAnalyzing"
            :class="jobDescription.trim() && !isAnalyzing
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-400 cursor-not-allowed'"
            class="text-white px-6 py-2 rounded-lg transition font-medium"
          >
            {{ isAnalyzing ? '⏳ Analyzing...' : '✨ Analyze' }}
          </button>
          <button
            @click="jobDescription = ''"
            class="text-gray-600 px-4 py-2 rounded-lg transition font-medium hover:bg-gray-100"
            :class="isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Error Section -->
      <div v-if="error" :class="isDark ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-800'" class="border rounded-lg p-4 mb-6">
        <p class="text-sm">
          <strong>❌ Error:</strong> {{ error }}
        </p>
      </div>

      <!-- Results Section -->
      <div v-if="lastAnalysis" class="space-y-6">
        <!-- Score Card -->
        <div :class="[
          getMatchBgColor(lastAnalysis.overallScore, isDark),
          isDark ? 'border-gray-700' : 'border-gray-200'
        ]" class="border rounded-lg shadow-sm p-8 text-center">
          <div class="flex items-center justify-center gap-6">
            <div>
              <p class="text-6xl font-bold" :class="getMatchColor(lastAnalysis.overallScore)">
                {{ lastAnalysis.overallScore }}%
              </p>
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-2">Overall Match</p>
            </div>
            <div :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-lg">
              {{ getMatchGrade(lastAnalysis.overallScore) }}
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
          <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-base leading-relaxed">
            {{ lastAnalysis.summary }}
          </p>
        </div>

        <!-- Matched Skills -->
        <div v-if="lastAnalysis.matchedSkills.length > 0" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
          <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">✅ Your Matching Skills ({{ lastAnalysis.matchedSkills.length }})</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in lastAnalysis.matchedSkills"
              :key="skill"
              :class="isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-900'"
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Missing Skills -->
        <div v-if="lastAnalysis.missingSkills.length > 0" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
          <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">🎯 Skills to Develop ({{ lastAnalysis.missingSkills.length }})</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in lastAnalysis.missingSkills"
              :key="skill"
              :class="isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-900'"
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Highlighted Strengths -->
        <div v-if="lastAnalysis.highlightedStrengths.length > 0" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
          <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">💪 Your Strengths</h3>
          <div class="space-y-2">
            <p v-for="(strength, idx) in lastAnalysis.highlightedStrengths" :key="idx" :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-base">
              {{ strength }}
            </p>
          </div>
        </div>

        <!-- Experience Gap -->
        <div v-if="lastAnalysis.experienceGap" :class="isDark ? 'bg-blue-900 border-blue-700 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'" class="border rounded-lg p-4">
          <p class="text-base">{{ lastAnalysis.experienceGap }}</p>
        </div>

        <!-- Recommendations -->
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
          <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">💡 Recommendations</h3>
          <div class="space-y-3">
            <div v-for="(rec, idx) in lastAnalysis.recommendations" :key="idx" :class="isDark ? 'bg-gray-700' : 'bg-gray-50'" class="rounded p-3">
              <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-sm">
                {{ rec }}
              </p>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <button
          @click="reset"
          :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'"
          class="w-full px-6 py-3 rounded-lg transition font-medium"
        >
          🔄 Analyze Another Job
        </button>
      </div>

      <!-- Empty State -->
      <div v-else :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-12 text-center">
        <p class="text-5xl mb-4">🔍</p>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-base">
          Paste a job description above to get started
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAnalytics } from '@/composables/useAnalytics'
import { useAIMatching } from '@/composables/useAIMatching'
import TopBanner from '@/components/TopBanner.vue'

const router = useRouter()
const { user, initializeAuth, isDark } = useAuth()
const { trackFeatureView } = useAnalytics()
const { isAnalyzing, error, lastAnalysis, analyzeJobDescription, getMatchColor, getMatchBgColor } = useAIMatching()

const jobDescription = ref('')

onMounted(async () => {
  await initializeAuth()
  if (!user.value) {
    router.push('/login')
  }
  
  trackFeatureView('ai_matching')
})

const analyzeJob = async () => {
  try {
    await analyzeJobDescription(jobDescription.value)
  } catch (err) {
    console.error('Analysis error:', err)
  }
}

const reset = () => {
  jobDescription.value = ''
}

const getMatchGrade = (score: number): string => {
  if (score >= 85) return '⭐⭐⭐⭐⭐'
  if (score >= 70) return '⭐⭐⭐⭐'
  if (score >= 55) return '⭐⭐⭐'
  if (score >= 40) return '⭐⭐'
  return '⭐'
}
</script>
