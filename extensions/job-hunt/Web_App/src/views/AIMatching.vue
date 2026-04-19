<template>
  <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-screen">
    <!-- Banner Navigation -->
    <TopBanner />

    <!-- Page Header -->
    <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b p-6">
      <div class="max-w-6xl mx-auto">
        <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-1">🤖 AI Matching</h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Get AI-powered job recommendations based on your profile and saved jobs</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto p-6">
      <!-- Analysis Section -->
      <div v-if="!analysisComplete" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-8 text-center">
        <p class="text-5xl mb-4">📊</p>
        <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-4">Ready to get job matches?</h2>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="mb-6 max-w-md mx-auto">
          The AI will analyze your saved jobs and resume to find the best matches and provide personalized recommendations.
        </p>
        <button
          @click="analyzeJobs"
          :disabled="!hasJobsAndResume || isAnalyzing"
          :class="hasJobsAndResume ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'"
          class="text-white px-8 py-3 rounded-lg transition font-medium text-lg"
        >
          {{ isAnalyzing ? '⏳ Analyzing...' : '🚀 Analyze My Jobs' }}
        </button>
        <p v-if="!hasJobsAndResume" :class="isDark ? 'text-red-400' : 'text-red-600'" class="mt-4 text-sm">
          ⚠️ Add some jobs to your tracker and build a resume first!
        </p>
      </div>

      <!-- Results Section -->
      <div v-else class="space-y-6">
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-indigo-600">{{ matchedJobs.length }}</p>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-1">Jobs Analyzed</p>
          </div>
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-green-600">{{ topMatches.length }}</p>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-1">Great Fits (80%+)</p>
          </div>
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-yellow-600">{{ avgScore }}</p>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-1">Average Match</p>
          </div>
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4 text-center">
            <button
              @click="analyzeJobs"
              class="text-indigo-600 hover:text-indigo-700 font-medium text-sm hover:underline"
            >
              🔄 Re-analyze
            </button>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-3">Run Analysis Again</p>
          </div>
        </div>

        <!-- Filter & Sort -->
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <div class="flex flex-wrap gap-3">
            <button
              v-for="score in [90, 75, 60, 0]"
              :key="score"
              @click="filterScore = score"
              :class="filterScore === score
                ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-900')
                : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
              class="px-4 py-2 rounded-lg text-sm transition font-medium"
            >
              {{ score === 90 ? '⭐ 90%+' : score === 75 ? '👍 75%+' : score === 60 ? '📌 60%+' : '📊 All' }}
            </button>
          </div>
        </div>

        <!-- Jobs List -->
        <div v-if="filteredJobs.length > 0" class="space-y-4">
          <div
            v-for="job in filteredJobs"
            :key="job.id"
            :class="isDark ? 'bg-gray-800 border-gray-700 hover:border-indigo-600' : 'bg-white border-gray-200 hover:border-indigo-400'"
            class="border rounded-lg shadow-sm p-6 transition cursor-pointer"
          >
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold">{{ job.position }}</h3>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">{{ job.company }}</p>
              </div>
              <div class="text-right">
                <!-- Match Score -->
                <div class="flex items-center gap-2">
                  <div class="text-right">
                    <p class="text-3xl font-bold" :class="getScoreColor(job.matchScore)">{{ job.matchScore }}%</p>
                    <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs">Match Score</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Match Details -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div :class="isDark ? 'bg-gray-700' : 'bg-gray-50'" class="rounded p-3 text-center">
                <p class="text-sm font-semibold" :class="isDark ? 'text-indigo-400' : 'text-indigo-600'">{{ job.matchDetails.skillsMatched }}/{{ job.matchDetails.skillsTotal }}</p>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs mt-1">Skills Match</p>
              </div>
              <div :class="isDark ? 'bg-gray-700' : 'bg-gray-50'" class="rounded p-3 text-center">
                <p class="text-sm font-semibold" :class="isDark ? 'text-green-400' : 'text-green-600'">{{ job.matchDetails.experienceRelevance }}%</p>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs mt-1">Experience Fit</p>
              </div>
              <div :class="isDark ? 'bg-gray-700' : 'bg-gray-50'" class="rounded p-3 text-center">
                <p class="text-sm font-semibold" :class="isDark ? 'text-blue-400' : 'text-blue-600'">{{ job.matchDetails.roleAlignment }}%</p>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs mt-1">Role Alignment</p>
              </div>
              <div :class="isDark ? 'bg-gray-700' : 'bg-gray-50'" class="rounded p-3 text-center">
                <p class="text-sm font-semibold" :class="isDark ? 'text-purple-400' : 'text-purple-600'">{{ job.matchDetails.keywordMatch }}%</p>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs mt-1">Keywords</p>
              </div>
            </div>

            <!-- Matched Skills -->
            <div v-if="job.matchedSkills.length > 0" class="mb-4">
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs font-semibold mb-2">✅ Your Matching Skills:</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in job.matchedSkills.slice(0, 5)"
                  :key="skill"
                  :class="isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-900'"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ skill }}
                </span>
                <span v-if="job.matchedSkills.length > 5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs self-center">
                  +{{ job.matchedSkills.length - 5 }} more
                </span>
              </div>
            </div>

            <!-- Gap Skills -->
            <div v-if="job.gapSkills.length > 0" class="mb-4">
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs font-semibold mb-2">🎯 Skills to Develop:</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in job.gapSkills.slice(0, 5)"
                  :key="skill"
                  :class="isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-900'"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ skill }}
                </span>
                <span v-if="job.gapSkills.length > 5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs self-center">
                  +{{ job.gapSkills.length - 5 }} more
                </span>
              </div>
            </div>

            <!-- Recommendation -->
            <div :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-900'" class="rounded p-3 text-sm">
              <strong>💡 AI Recommendation:</strong> {{ job.recommendation }}
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-8 text-center">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'">No jobs match the selected criteria. Try adjusting the filter.</p>
        </div>
      </div>

      <!-- Info Section -->
      <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 mt-6">
        <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">ℹ️ How AI Matching Works</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Skills Match:</strong> Compares your resume skills against job requirements
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Experience Fit:</strong> Evaluates years of experience and relevance
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Role Alignment:</strong> Analyzes job title and role similarity
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Keyword Matching:</strong> Extracts and matches industry keywords
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAnalytics } from '@/composables/useAnalytics'
import TopBanner from '@/components/TopBanner.vue'

const router = useRouter()
const { user, initializeAuth, isDark } = useAuth()
const { trackAIMatching, trackFeatureView } = useAnalytics()

const analysisComplete = ref(false)
const isAnalyzing = ref(false)
const filterScore = ref(0)
const matchedJobs = ref<any[]>([])

onMounted(async () => {
  await initializeAuth()
  if (!user.value) {
    router.push('/login')
  }
  
  // Track feature view
  trackFeatureView('ai_matching')
})

const hasJobsAndResume = computed(() => {
  const jobs = localStorage.getItem('jobs')
  const resume = localStorage.getItem('resume')
  const jobsArray = jobs ? JSON.parse(jobs) : []
  const resumeData = resume ? JSON.parse(resume) : null
  return jobsArray.length > 0 && resumeData && resumeData.personalInfo.fullName
})

const analyzeJobs = async () => {
  isAnalyzing.value = true
  
  // Simulate AI analysis delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const jobs = localStorage.getItem('jobs')
  const resume = localStorage.getItem('resume')
  
  const jobsArray = jobs ? JSON.parse(jobs) : []
  const resumeData = resume ? JSON.parse(resume) : null
  
  // Extract user skills and experience from resume
  const userSkills = (resumeData?.skills || []).filter((s: string) => s.trim()).map((s: string) => s.toLowerCase())
  const userExperience = resumeData?.experience || []
  const userSummary = (resumeData?.summary || '').toLowerCase()
  
  // Extract common job keywords
  const jobKeywords = ['javascript', 'python', 'react', 'vue', 'node', 'aws', 'cloud', 'sql', 'data', 'management', 'communication', 'leadership']
  
  matchedJobs.value = jobsArray.map((job: any) => {
    const jobTitle = job.position.toLowerCase()
    const jobCompany = job.company.toLowerCase()
    
    // Calculate skills match
    const matchedSkills = userSkills.filter((skill: string) => 
      jobTitle.includes(skill) || jobCompany.includes(skill)
    )
    const skillsScore = userSkills.length > 0 ? Math.min(100, (matchedSkills.length / Math.max(userSkills.length, 3)) * 100) : 70
    
    // Calculate experience relevance
    const experienceRelevance = userExperience.length > 0 ? Math.min(100, 60 + (userExperience.length * 10)) : 50
    
    // Calculate role alignment
    let roleAlignment = 50
    const roleKeywords = ['developer', 'engineer', 'manager', 'designer', 'analyst', 'specialist']
    for (const keyword of roleKeywords) {
      if (jobTitle.includes(keyword) && userExperience.some((exp: any) => exp.position.toLowerCase().includes(keyword))) {
        roleAlignment = 85
        break
      }
    }
    
    // Calculate keyword match
    const matchedKeywords = jobKeywords.filter((keyword: string) => 
      jobTitle.includes(keyword) || userSummary.includes(keyword)
    )
    const keywordMatch = (matchedKeywords.length / jobKeywords.length) * 100
    
    // Calculate overall score
    const overallScore = Math.round((skillsScore * 0.4 + experienceRelevance * 0.25 + roleAlignment * 0.2 + keywordMatch * 0.15) / 1)
    
    // Generate recommendation
    let recommendation = ''
    if (overallScore >= 85) {
      recommendation = 'Excellent match! Your profile aligns well with this role. Apply immediately.'
    } else if (overallScore >= 75) {
      recommendation = 'Good match! You have most of the required skills. Consider applying.'
    } else if (overallScore >= 60) {
      recommendation = 'Moderate match. You have some relevant skills but may want to develop additional experience.'
    } else {
      recommendation = 'Growing match. This could be a good stretch goal for developing new skills.'
    }
    
    return {
      id: job.id,
      position: job.position,
      company: job.company,
      url: job.url,
      matchScore: overallScore,
      matchDetails: {
        skillsMatched: matchedSkills.length,
        skillsTotal: Math.max(userSkills.length, 3),
        experienceRelevance: Math.round(experienceRelevance),
        roleAlignment: Math.round(roleAlignment),
        keywordMatch: Math.round(keywordMatch)
      },
      matchedSkills: matchedSkills,
      gapSkills: jobKeywords.filter(k => !userSkills.includes(k)).slice(0, 5),
      recommendation
    }
  }).sort((a: any, b: any) => b.matchScore - a.matchScore)
  
  // Track AI matching analysis
  const topMatches = matchedJobs.value.filter(j => j.matchScore >= 80)
  const avgScoreValue = Math.round(matchedJobs.value.reduce((sum, j) => sum + j.matchScore, 0) / matchedJobs.value.length)
  
  trackAIMatching({
    total_jobs: matchedJobs.value.length,
    top_matches: topMatches.length,
    avg_score: avgScoreValue
  })
  
  analysisComplete.value = true
  isAnalyzing.value = false
}

const topMatches = computed(() => matchedJobs.value.filter(j => j.matchScore >= 80))

const avgScore = computed(() => {
  if (matchedJobs.value.length === 0) return '0%'
  const avg = Math.round(matchedJobs.value.reduce((sum, j) => sum + j.matchScore, 0) / matchedJobs.value.length)
  return `${avg}%`
})

const filteredJobs = computed(() => {
  return matchedJobs.value.filter(j => j.matchScore >= filterScore.value)
})

const getScoreColor = (score: number) => {
  if (score >= 85) return isDark.value ? 'text-green-400' : 'text-green-600'
  if (score >= 75) return isDark.value ? 'text-blue-400' : 'text-blue-600'
  if (score >= 60) return isDark.value ? 'text-yellow-400' : 'text-yellow-600'
  return isDark.value ? 'text-red-400' : 'text-red-600'
}
</script>
