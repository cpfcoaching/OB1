<template>
  <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-screen">
    <!-- Banner Navigation -->
    <TopBanner />

    <!-- Page Header -->
    <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b p-6">
      <div class="max-w-6xl mx-auto">
        <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-1">🤖 AI Matching</h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
          Analyze a job description or browse personalized recommendations from your resume
        </p>
        <!-- Tab Switcher -->
        <div class="flex gap-2 mt-4">
          <button
            @click="activeTab = 'analyze'"
            :class="activeTab === 'analyze'
              ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white')
              : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
            class="px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            ✨ Analyze Job
          </button>
          <button
            @click="activateRecommendations"
            :class="activeTab === 'recommendations'
              ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white')
              : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
            class="px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            🎯 Smart Recommendations
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto p-6">

      <!-- ═══════════════════════════════════════════════════════
           TAB 1 — Analyze Job Description
      ════════════════════════════════════════════════════════ -->
      <template v-if="activeTab === 'analyze'">
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
              :class="isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'"
              class="px-4 py-2 rounded-lg transition font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Analyze Error -->
        <div v-if="error" :class="isDark ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-800'" class="border rounded-lg p-4 mb-6">
          <p class="text-sm"><strong>❌ Error:</strong> {{ error }}</p>
        </div>

        <!-- Results Section -->
        <div v-if="lastAnalysis" class="space-y-6">
          <!-- Score Card -->
          <div :class="[getMatchBgColor(lastAnalysis.overallScore, isDark), isDark ? 'border-gray-700' : 'border-gray-200']" class="border rounded-lg shadow-sm p-8 text-center">
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
            <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-base leading-relaxed">{{ lastAnalysis.summary }}</p>
          </div>
          <!-- Matched Skills -->
          <div v-if="lastAnalysis.matchedSkills.length > 0" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">✅ Your Matching Skills ({{ lastAnalysis.matchedSkills.length }})</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="skill in lastAnalysis.matchedSkills" :key="skill" :class="isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-900'" class="px-3 py-1 rounded-full text-sm font-medium">{{ skill }}</span>
            </div>
          </div>
          <!-- Missing Skills -->
          <div v-if="lastAnalysis.missingSkills.length > 0" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">🎯 Skills to Develop ({{ lastAnalysis.missingSkills.length }})</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="skill in lastAnalysis.missingSkills" :key="skill" :class="isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-900'" class="px-3 py-1 rounded-full text-sm font-medium">{{ skill }}</span>
            </div>
          </div>
          <!-- Highlighted Strengths -->
          <div v-if="lastAnalysis.highlightedStrengths.length > 0" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">💪 Your Strengths</h3>
            <div class="space-y-2">
              <p v-for="(strength, idx) in lastAnalysis.highlightedStrengths" :key="idx" :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-base">{{ strength }}</p>
            </div>
          </div>
          <!-- Experience Gap -->
          <div v-if="lastAnalysis.experienceGap" :class="isDark ? 'bg-blue-900 border-blue-700 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'" class="border rounded-lg p-4">
            <p class="text-base">{{ lastAnalysis.experienceGap }}</p>
          </div>
          <!-- Recommendations list -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">💡 Recommendations</h3>
            <div class="space-y-3">
              <div v-for="(rec, idx) in lastAnalysis.recommendations" :key="idx" :class="isDark ? 'bg-gray-700' : 'bg-gray-50'" class="rounded p-3">
                <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-sm">{{ rec }}</p>
              </div>
            </div>
          </div>
          <!-- Reset -->
          <button @click="reset" :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'" class="w-full px-6 py-3 rounded-lg transition font-medium">
            🔄 Analyze Another Job
          </button>
        </div>

        <!-- Empty State -->
        <div v-else :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-12 text-center">
          <p class="text-5xl mb-4">🔍</p>
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-base">Paste a job description above to get started</p>
        </div>
      </template>

      <!-- ═══════════════════════════════════════════════════════
           TAB 2 — Smart Recommendations
      ════════════════════════════════════════════════════════ -->
      <template v-else>
        <!-- Error banner -->
        <div v-if="recError" :class="isDark ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-800'" class="border rounded-lg p-4 mb-6">
          <p class="text-sm"><strong>❌</strong> {{ recError }}</p>
        </div>

        <!-- Resume notice banner -->
        <div v-if="resumeNotice" :class="isDark ? 'bg-yellow-900 border-yellow-700 text-yellow-200' : 'bg-yellow-50 border-yellow-200 text-yellow-800'" class="border rounded-lg p-4 mb-6">
          <p class="text-sm">💡 {{ resumeNotice }}</p>
        </div>

        <!-- Stats bar -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-indigo-600">{{ recommendations.length }}</p>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-1">Jobs Found</p>
          </div>
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-green-600">{{ strongMatchCount }}</p>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-1">Strong Matches (80%+)</p>
          </div>
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-yellow-600">{{ avgScoreDisplay }}</p>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-1">Average Match</p>
          </div>
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4 text-center">
            <button @click="refresh" :disabled="recLoading" class="text-indigo-600 hover:text-indigo-700 font-medium text-sm hover:underline disabled:opacity-50">
              {{ recLoading ? '⏳ Loading...' : '🔄 Refresh' }}
            </button>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-3">Update Results</p>
          </div>
        </div>

        <!-- Score filter bar -->
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4 mb-6">
          <div class="flex flex-wrap gap-3">
            <button
              v-for="threshold in [90, 75, 60, 0]"
              :key="threshold"
              @click="minScore = threshold"
              :class="minScore === threshold
                ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-900')
                : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
              class="px-4 py-2 rounded-lg text-sm transition font-medium"
            >
              {{ threshold === 90 ? '⭐ 90%+' : threshold === 75 ? '👍 75%+' : threshold === 60 ? '📌 60%+' : '📊 All' }}
            </button>

            <!-- Filter expander toggle -->
            <button
              @click="showFilters = !showFilters"
              :class="isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="ml-auto px-4 py-2 rounded-lg text-sm transition font-medium"
            >
              {{ showFilters ? '🔽 Hide Filters' : '🔧 Filters' }}
            </button>
          </div>

          <!-- Expandable filter panel -->
          <div v-if="showFilters" class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="block text-xs font-semibold mb-1">Job Title Keywords</label>
              <input
                v-model="filterTitle"
                @blur="applyFilters"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'"
                class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Senior Engineer"
              />
            </div>
            <div>
              <label :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="block text-xs font-semibold mb-1">Location</label>
              <input
                v-model="filterLocation"
                @blur="applyFilters"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900'"
                class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Remote, New York"
              />
            </div>
            <div>
              <label :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="block text-xs font-semibold mb-1">Remote Type</label>
              <select
                v-model="filterRemoteType"
                @change="applyFilters"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'"
                class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="any">Any</option>
                <option value="remote">Remote only</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="recLoading" class="space-y-4">
          <div
            v-for="n in 4"
            :key="n"
            :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
            class="border rounded-lg p-6 animate-pulse"
          >
            <div :class="isDark ? 'bg-gray-700' : 'bg-gray-200'" class="h-4 rounded w-2/3 mb-3"></div>
            <div :class="isDark ? 'bg-gray-700' : 'bg-gray-200'" class="h-3 rounded w-1/3 mb-4"></div>
            <div class="grid grid-cols-4 gap-3">
              <div v-for="i in 4" :key="i" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'" class="h-12 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Job cards -->
        <div v-else-if="filteredRecommendations.length > 0" class="space-y-4">
          <div
            v-for="item in filteredRecommendations"
            :key="item.listing.id"
            :class="isDark ? 'bg-gray-800 border-gray-700 hover:border-indigo-600' : 'bg-white border-gray-200 hover:border-indigo-400'"
            class="border rounded-lg shadow-sm p-6 transition"
          >
            <!-- Header row -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold">{{ item.listing.title }}</h3>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
                  {{ item.listing.company }}
                  <span v-if="item.listing.location"> · {{ item.listing.location }}</span>
                  <span v-if="item.listing.remoteType && item.listing.remoteType !== 'on-site'" class="ml-2 px-2 py-0.5 rounded-full text-xs" :class="isDark ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-700'">
                    {{ item.listing.remoteType }}
                  </span>
                </p>
              </div>
              <!-- Score badge -->
              <div class="text-right ml-4">
                <p class="text-3xl font-bold" :class="scoreColor(item.score)">{{ Math.round(item.score * 100) }}%</p>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs">Match Score</p>
              </div>
            </div>

            <!-- Pay range -->
            <p v-if="item.listing.payMin || item.listing.payMax" :class="isDark ? 'text-green-400' : 'text-green-700'" class="text-sm font-medium mb-3">
              💰 {{ formatPay(item.listing.payMin, item.listing.payMax, item.listing.payPeriod) }}
            </p>

            <!-- Source badge + posted date -->
            <div class="flex items-center gap-3 mb-4 text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              <span class="uppercase font-semibold tracking-wide">{{ item.listing.source }}</span>
              <span v-if="item.listing.postedAt">· {{ formatDate(item.listing.postedAt) }}</span>
            </div>

            <!-- Action row -->
            <div class="flex flex-wrap gap-2">
              <a
                v-if="item.listing.url"
                :href="item.listing.url"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                @click="recordOutcome(item.listing.id, 'applied')"
              >
                🚀 Apply
              </a>
              <button
                @click="recordOutcome(item.listing.id, 'saved')"
                :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
                class="px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                🔖 Save
              </button>
              <button
                @click="recordOutcome(item.listing.id, 'ignored')"
                :class="isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'"
                class="px-3 py-2 rounded-lg text-sm transition"
              >
                ✕ Not interested
              </button>
            </div>
          </div>
        </div>

        <!-- Empty / first-run state -->
        <div v-else :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-12 text-center">
          <p class="text-5xl mb-4">🎯</p>
          <p :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-semibold mb-2">No recommendations yet</p>
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mb-6">
            Make sure your resume is saved, then click Refresh to fetch personalized job matches.
          </p>
          <button
            @click="refresh"
            :disabled="recLoading"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            🔄 Load Recommendations
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAnalytics } from '@/composables/useAnalytics'
import { useAIMatching } from '@/composables/useAIMatching'
import { useRecommendations } from '@/composables/useRecommendations'
import TopBanner from '@/components/TopBanner.vue'

const router = useRouter()
const { user, initializeAuth, isDark } = useAuth()
const { trackFeatureView } = useAnalytics()
const { isAnalyzing, error, lastAnalysis, analyzeJobDescription, getMatchColor, getMatchBgColor } = useAIMatching()

// ── Tab state ────────────────────────────────────────────────────────────────
const activeTab = ref<'analyze' | 'recommendations'>('analyze')
let recInit = false

const jobDescription = ref('')

onMounted(async () => {
  await initializeAuth()
  if (!user.value) {
    router.push('/login')
    return
  }
  trackFeatureView('ai_matching')
})

// ── Tab 1 helpers ─────────────────────────────────────────────────────────────
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

// ── Tab 2 — Smart Recommendations ────────────────────────────────────────────
// Lazily initialised when user first opens the recommendations tab.
const {
  recommendations,
  isLoading: recLoading,
  error: recError,
  resumeNotice,
  refresh,
  recordOutcome,
  updateFilters,
} = useRecommendations(user.value?.uid ?? '')

const minScore = ref(0)
const showFilters = ref(false)
const filterTitle = ref('')
const filterLocation = ref('')
const filterRemoteType = ref<'any' | 'remote' | 'hybrid' | 'onsite'>('any')

const filteredRecommendations = computed(() =>
  recommendations.value.filter(r => Math.round(r.score * 100) >= minScore.value)
)
const strongMatchCount = computed(() =>
  recommendations.value.filter(r => Math.round(r.score * 100) >= 80).length
)
const avgScoreDisplay = computed(() => {
  if (recommendations.value.length === 0) return '—'
  const avg = recommendations.value.reduce((s, r) => s + r.score, 0) / recommendations.value.length
  return `${Math.round(avg * 100)}%`
})

const activateRecommendations = async () => {
  activeTab.value = 'recommendations'
  if (!recInit) {
    recInit = true
    await refresh()
  }
}

const applyFilters = async () => {
  const overrides: Record<string, unknown> = {}
  if (filterTitle.value.trim()) overrides.titleKeywords = filterTitle.value.trim().split(/\s*,\s*/)
  if (filterLocation.value.trim()) overrides.location = filterLocation.value.trim()
  if (filterRemoteType.value !== 'any') overrides.remoteType = filterRemoteType.value
  await updateFilters(overrides)
  await refresh()
}

const scoreColor = (score: number) => {
  const pct = score * 100
  if (pct >= 85) return isDark.value ? 'text-green-400' : 'text-green-600'
  if (pct >= 75) return isDark.value ? 'text-blue-400' : 'text-blue-600'
  if (pct >= 60) return isDark.value ? 'text-yellow-400' : 'text-yellow-600'
  return isDark.value ? 'text-red-400' : 'text-red-600'
}

const formatPay = (min?: number | null, max?: number | null, period?: string | null): string => {
  const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`
  const suffix = period === 'hourly' ? '/hr' : period === 'monthly' ? '/mo' : '/yr'
  if (min && max) return `${fmt(min)} – ${fmt(max)}${suffix}`
  if (min) return `${fmt(min)}+${suffix}`
  if (max) return `Up to ${fmt(max)}${suffix}`
  return ''
}

const formatDate = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(iso))
  } catch {
    return ''
  }
}
</script>
