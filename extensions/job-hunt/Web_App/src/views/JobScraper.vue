<template>
  <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-screen">
    <!-- Banner Navigation -->
    <TopBanner />

    <!-- Page Header -->
    <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b p-6">
      <div class="max-w-6xl mx-auto">
        <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-1">🌐 Job Scraper</h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Import jobs from various sources or paste job listings</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Input Section -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Templates -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">📋 Job Sources</h2>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mb-4">
              Choose a template or paste raw job data
            </p>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="source in jobSources"
                :key="source.id"
                @click="selectedSource = source.id"
                :class="selectedSource === source.id
                  ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-900')
                  : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
                class="px-4 py-2 rounded-lg transition font-medium text-sm"
              >
                {{ source.emoji }} {{ source.name }}
              </button>
            </div>
            <div class="grid grid-cols-1 gap-2 mt-4">
              <button @click="scrapeJobs('job-ops')" :disabled="loading.jobOps" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition">
                {{ loading.jobOps ? 'Scraping (job-ops)...' : '🔎 Scrape with job-ops' }}
              </button>
              <button @click="scrapeJobs('jobspy')" :disabled="loading.jobSpy" class="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-purple-700 transition">
                {{ loading.jobSpy ? 'Scraping (JobSpy)...' : '🕵️ Scrape with JobSpy' }}
              </button>
              <button @click="scrapeJobs('career-ops')" :disabled="loading.careerOps" class="bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-green-700 transition">
                {{ loading.careerOps ? 'Scraping (career-ops)...' : '🌍 Scrape with career-ops' }}
              </button>
              <button @click="aiMatch" :disabled="loading.aiMatch" class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition">
                {{ loading.aiMatch ? 'Matching (AI)...' : '🤖 AI Match Jobs' }}
              </button>
              <button @click="autoApply" :disabled="loading.autoApply" class="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-yellow-700 transition">
                {{ loading.autoApply ? 'Applying...' : '⚡ Auto-Apply to Jobs' }}
              </button>
            </div>
            <div v-if="integrationResult" class="mt-3 p-3 rounded bg-gray-100 text-gray-800 text-xs border border-gray-300">
              <span v-if="integrationResult.success">✅ {{ integrationResult.message }}</span>
              <span v-else>❌ {{ integrationResult.message }}</span>
            </div>
          </div>

          <!-- Input Area -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">📝 Paste Job Data</h2>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mb-3">
              {{ getCurrentSourceDescription() }}
            </p>
            <textarea
              v-model="pastedData"
              :placeholder="getPlaceholder()"
              :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
              class="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              rows="10"
            ></textarea>
            <div class="flex gap-3 mt-4">
              <button
                @click="parseJobs"
                :disabled="!pastedData.trim()"
                :class="pastedData.trim() ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'"
                class="flex-1 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                🔍 Parse Jobs
              </button>
              <button
                @click="pastedData = ''"
                class="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          <!-- Sample Data -->
          <div v-if="!parsedJobs.length" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-sm font-bold mb-3">💡 Quick Start</h3>
            <button
              @click="loadSampleData"
              class="text-indigo-600 hover:text-indigo-700 text-sm font-medium underline"
            >
              Load Sample Jobs
            </button>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs mt-2">
              Try parsing sample data to see how it works
            </p>
          </div>
        </div>

        <!-- Preview Section -->
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 h-fit sticky top-6">
          <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">👁️ Preview</h2>
          
          <div v-if="parsedJobs.length === 0" :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm text-center py-8">
            <p>No jobs parsed yet</p>
            <p class="text-xs mt-2">Paste job data and click "Parse Jobs"</p>
          </div>

          <div v-else class="space-y-3">
            <div class="flex justify-between items-center mb-3">
              <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="font-semibold text-sm">
                Found {{ parsedJobs.length }} jobs
              </p>
              <button
                @click="importJobs"
                :disabled="!parsedJobs.length"
                :class="parsedJobs.length ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'"
                class="text-white px-3 py-1 rounded text-xs transition font-medium"
              >
                ✅ Import All
              </button>
            </div>
            
            <div class="space-y-2 max-h-96 overflow-y-auto">
              <div
                v-for="(job, idx) in parsedJobs.slice(0, 10)"
                :key="idx"
                :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'"
                class="border rounded p-2 text-xs cursor-pointer hover:shadow-md transition"
                @click="toggleJobSelection(idx)"
              >
                <div class="flex items-start gap-2">
                  <input
                    type="checkbox"
                    :checked="selectedJobIndices.includes(idx)"
                    @click.stop="toggleJobSelection(idx)"
                    class="mt-1"
                  />
                  <div class="flex-1 min-w-0">
                    <p :class="isDark ? 'text-white' : 'text-gray-900'" class="font-semibold truncate">
                      {{ job.position }}
                    </p>
                    <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="truncate">
                      {{ job.company }}
                    </p>
                    <p v-if="job.url" :class="isDark ? 'text-blue-400' : 'text-blue-600'" class="text-xs truncate">
                      🔗 {{ job.url.substring(0, 20) }}...
                    </p>
                  </div>
                </div>
              </div>
              <p v-if="parsedJobs.length > 10" :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs text-center py-2">
                +{{ parsedJobs.length - 10 }} more
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Smart Job Matching / Search Section -->
      <div v-if="parsedJobs.length > 0" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 mt-6">
        <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">🎯 Smart Job Matching</h3>
        
        <!-- Search Criteria -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-1">Skills/Keywords</label>
            <input
              v-model="searchCriteria.keywords"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              type="text"
              placeholder="e.g., Python, React, AI"
              class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-1">Location</label>
            <input
              v-model="searchCriteria.location"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              type="text"
              placeholder="e.g., Remote, NYC, San Francisco"
              class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-1">Min Salary</label>
            <input
              v-model.number="searchCriteria.minSalary"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              type="number"
              placeholder="e.g., 100000"
              class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-1">Experience Level</label>
            <select
              v-model="searchCriteria.experience"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead / Manager</option>
            </select>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 mb-4">
          <button
            @click="matchJobs"
            :class="isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'"
            class="text-white px-4 py-2 rounded-lg transition font-medium text-sm"
          >
            🔍 Find Matches
          </button>
          <button
            @click="() => { searchCriteria = { keywords: '', location: '', minSalary: null, experience: '' }; matchedJobs = [] }"
            :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'"
            class="px-4 py-2 rounded-lg transition font-medium text-sm"
          >
            Clear
          </button>
        </div>

        <!-- Matched Jobs Results -->
        <div v-if="matchedJobs.length > 0" class="space-y-3">
          <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-sm font-semibold">Found {{ matchedJobs.length }} matching job(s)</p>
          <div v-for="(match, idx) in matchedJobs" :key="idx" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'" class="border rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <div class="flex-1">
                <p :class="isDark ? 'text-white' : 'text-gray-900'" class="font-bold text-sm">{{ match.job.position }}</p>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs">{{ match.job.company }}</p>
              </div>
              <div :class="match.score >= 80 ? 'bg-green-100 text-green-800' : match.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-800'" class="rounded-full px-3 py-1 text-sm font-bold">
                {{ match.score }}% Match
              </div>
            </div>
            <div v-if="match.reasons.length > 0" class="text-xs space-y-1">
              <p v-for="(reason, i) in match.reasons" :key="i" :class="isDark ? 'text-gray-400' : 'text-gray-600'">✓ {{ reason }}</p>
            </div>
            <a v-if="match.job.url" :href="match.job.url" target="_blank" :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'" class="text-xs mt-2 inline-block underline">View Job →</a>
          </div>
        </div>
        <div v-else-if="Object.values(searchCriteria).some(v => v)" :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm text-center py-4">
          No jobs matched your criteria. Try adjusting your search.
        </div>
      </div>

      <!-- Import History -->
      <div v-if="importedCount > 0" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 mt-6">
        <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-2">✅ Import Status</h3>
        <p :class="isDark ? 'text-green-400' : 'text-green-600'" class="text-sm font-medium">
          🎉 Successfully imported {{ importedCount }} job(s)!
        </p>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-1">
          Check your Job Tracker to view imported jobs
        </p>
      </div>

      <!-- Help Section -->
      <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 mt-6">
        <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">❓ How to Use</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p :class="isDark ? 'text-gray-300' : 'text-gray-900'" class="font-semibold mb-2">1️⃣ Select Source</p>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              Choose the job board or format you're using (LinkedIn, Indeed, etc.)
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-300' : 'text-gray-900'" class="font-semibold mb-2">2️⃣ Paste Data</p>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              Copy and paste job listings into the text area. One job per line or JSON format.
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-300' : 'text-gray-900'" class="font-semibold mb-2">3️⃣ Import</p>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              Click "Parse Jobs", review the preview, then "Import All" to add to tracker
            </p>
          </div>
        </div>

        <div :class="isDark ? 'bg-gray-700' : 'bg-blue-50'" class="rounded-lg p-4 mt-4">
          <p :class="isDark ? 'text-blue-300' : 'text-blue-900'" class="text-sm font-semibold mb-2">💡 Pro Tips:</p>
          <ul :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs space-y-1">
            <li>✓ Copy job title, company, and URL from job listings</li>
            <li>✓ Use one job per line: "Position, Company, https://url.com"</li>
            <li>✓ Can paste JSON format: {"position":"...", "company":"...", "url":"..."}</li>
            <li>✓ URLs are optional but recommended for quick reference</li>
            <li>✓ All imported jobs default to "Saved" status</li>
          </ul>
        </div>
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
import axios from 'axios'

const router = useRouter()
const { user, initializeAuth, isDark } = useAuth()
const { trackJobsImported, trackFeatureView } = useAnalytics()

const selectedSource = ref('linkedin')
const pastedData = ref('')
const parsedJobs = ref<any[]>([])
const selectedJobIndices = ref<number[]>([])
const importedCount = ref(0)

// Smart Job Matching
const searchCriteria = ref({
  keywords: '',
  location: '',
  minSalary: null as number | null,
  experience: ''
})
const matchedJobs = ref<any[]>([])

const jobSources = [
  { id: 'linkedin', name: 'LinkedIn', emoji: '🔵' },
  { id: 'indeed', name: 'Indeed', emoji: '🔴' },
  { id: 'glassdoor', name: 'Glassdoor', emoji: '🟢' },
  { id: 'custom', name: 'Custom Format', emoji: '📋' }
]

onMounted(async () => {
  await initializeAuth()
  if (!user.value) {
    router.push('/login')
  }
  // Select all jobs by default when parsed
  updateSelectedJobs()
  // Track feature view
  trackFeatureView('job_scraper')
})

const getCurrentSourceDescription = () => {
  const source = jobSources.find(s => s.id === selectedSource.value)
  const descriptions: { [key: string]: string } = {
    linkedin: 'Paste LinkedIn job listings. Format: Job Title, Company, https://url',
    indeed: 'Paste Indeed job listings. Format: Job Title, Company, https://url',
    glassdoor: 'Paste Glassdoor job listings. Format: Job Title, Company, https://url',
    custom: 'Paste in any format: Job Title, Company, URL (one per line) or JSON'
  }
  return descriptions[selectedSource.value] || 'Paste job data'
}

const getPlaceholder = () => {
  const placeholders: { [key: string]: string } = {
    linkedin: 'Senior Software Engineer, Google, https://linkedin.com/jobs/view/123456\nProduct Manager, Facebook, https://linkedin.com/jobs/view/789012',
    indeed: 'Full Stack Developer, Microsoft, https://indeed.com/viewjob/123456\nData Scientist, Amazon, https://indeed.com/viewjob/789012',
    glassdoor: 'UX Designer, Apple, https://glassdoor.com/jobs/456789\nQA Engineer, Netflix, https://glassdoor.com/jobs/123456',
    custom: 'Software Engineer, Google, https://google.com/careers/123\nMarketing Manager, Tesla, https://tesla.com/careers/456\n\nOr JSON format:\n[{"position":"Dev","company":"Microsoft","url":"https://..."}]'
  }
  return placeholders[selectedSource.value] || 'Paste job data here...'
}

const loadSampleData = () => {
  pastedData.value = `Senior Software Engineer, Google, https://linkedin.com/jobs/123456
Product Manager, Apple, https://linkedin.com/jobs/789012
Full Stack Developer, Microsoft, https://linkedin.com/jobs/345678
Data Scientist, Amazon, https://linkedin.com/jobs/901234
UX Designer, Meta, https://linkedin.com/jobs/567890`
  parseJobs()
}

const parseJobs = () => {
  const lines = pastedData.value.trim().split('\n').filter(l => l.trim())
  parsedJobs.value = []

  for (const line of lines) {
    const trimmed = line.trim()
    
    // Try JSON parsing first
    try {
      const json = JSON.parse(trimmed)
      if (json.position || json.company) {
        parsedJobs.value.push({
          position: json.position || 'Untitled',
          company: json.company || 'Unknown',
          url: json.url || '',
          status: 'Saved'
        })
        continue
      }
    } catch (e) {
      // Not JSON, try CSV format
    }

    // Parse CSV format: "Position, Company, URL"
    const parts = trimmed.split(',').map(p => p.trim())
    if (parts.length >= 2) {
      parsedJobs.value.push({
        position: parts[0] || 'Untitled',
        company: parts[1] || 'Unknown',
        url: parts[2] || '',
        status: 'Saved'
      })
    }
  }

  updateSelectedJobs()
  
  if (parsedJobs.value.length === 0) {
    alert('❌ Could not parse any jobs. Please check the format.')
  }
}

const updateSelectedJobs = () => {
  selectedJobIndices.value = Array.from({ length: parsedJobs.value.length }, (_, i) => i)
}

const toggleJobSelection = (idx: number) => {
  const index = selectedJobIndices.value.indexOf(idx)
  if (index > -1) {
    selectedJobIndices.value.splice(index, 1)
  } else {
    selectedJobIndices.value.push(idx)
  }
}

const importJobs = () => {
  const jobsToImport = selectedJobIndices.value.map(idx => ({
    id: Date.now() + idx,
    ...parsedJobs.value[idx]
  }))

  // Get existing jobs
  const existing = localStorage.getItem('jobs')
  const jobs = existing ? JSON.parse(existing) : []
  
  // Add new jobs
  jobs.push(...jobsToImport)
  localStorage.setItem('jobs', JSON.stringify(jobs))

  importedCount.value = jobsToImport.length
  
  // Track jobs imported
  trackJobsImported(jobsToImport.length, selectedSource.value)
  
  // Reset form
  pastedData.value = ''
  parsedJobs.value = []
  selectedJobIndices.value = []

  // Alert user
  alert(`✅ Successfully imported ${jobsToImport.length} job(s)!`)
}

// --- Integration handlers (connect to Vercel API routes) ---

const loading = ref({ jobOps: false, jobSpy: false, careerOps: false, aiMatch: false, autoApply: false })
const integrationResult = ref<null | { success: boolean; message: string }>(null)

const scrapeJobs = async (source: string) => {
  integrationResult.value = null
  loading.value.jobOps = source === 'job-ops'
  loading.value.jobSpy = source === 'jobspy'
  loading.value.careerOps = source === 'career-ops'
  try {
    const res = await axios.post('/api/scrape-jobs', { source })
    integrationResult.value = { success: true, message: res.data.message || 'Scraping complete.' }
    if (res.data.jobs && Array.isArray(res.data.jobs)) {
      parsedJobs.value = res.data.jobs.map((j: any) => ({ ...j, status: 'Saved' }))
      updateSelectedJobs()
    }
  } catch (err: any) {
    integrationResult.value = { success: false, message: err?.response?.data?.message || err.message || 'Scraping failed.' }
  } finally {
    loading.value.jobOps = false
    loading.value.jobSpy = false
    loading.value.careerOps = false
  }
}

const aiMatch = async () => {
  integrationResult.value = null
  loading.value.aiMatch = true
  try {
    const res = await axios.post('/api/ai-match', { jobs: parsedJobs.value })
    integrationResult.value = { success: true, message: res.data.message || 'AI matching complete.' }
    if (res.data.matchedJobs && Array.isArray(res.data.matchedJobs)) {
      parsedJobs.value = res.data.matchedJobs
      updateSelectedJobs()
    }
  } catch (err: any) {
    integrationResult.value = { success: false, message: err?.response?.data?.message || err.message || 'AI matching failed.' }
  } finally {
    loading.value.aiMatch = false
  }
}

const autoApply = async () => {
  integrationResult.value = null
  loading.value.autoApply = true
  try {
    const res = await axios.post('/api/apply-job', { jobs: parsedJobs.value })
    integrationResult.value = { success: true, message: res.data.message || 'Auto-apply complete.' }
  } catch (err: any) {
    integrationResult.value = { success: false, message: err?.response?.data?.message || err.message || 'Auto-apply failed.' }
  } finally {
    loading.value.autoApply = false
  }
}

// --- Smart Job Matching ---

const matchJobs = () => {
  matchedJobs.value = []

  parsedJobs.value.forEach((job: any) => {
    let score = 100
    const reasons: string[] = []

    const jobText = `${job.position} ${job.company}`.toLowerCase()

    // 1. Keywords/Skills matching
    if (searchCriteria.value.keywords.trim()) {
      const keywords = searchCriteria.value.keywords.toLowerCase().split(/[\s,]+/).filter(k => k)
      let keywordMatches = 0
      keywords.forEach(kw => {
        if (jobText.includes(kw)) {
          keywordMatches++
        }
      })
      const keywordScore = keywords.length > 0 ? (keywordMatches / keywords.length) * 100 : 100
      if (keywordScore < 100) {
        score = Math.min(score, keywordScore)
      } else {
        reasons.push(`Contains keywords: ${keywords.join(', ')}`)
      }
    }

    // 2. Location matching
    if (searchCriteria.value.location.trim()) {
      const location = searchCriteria.value.location.toLowerCase()
      if (jobText.includes(location) || jobText.includes('remote') && location.includes('remote')) {
        reasons.push(`Location matches: ${searchCriteria.value.location}`)
      } else {
        score *= 0.7 // Reduce score if location doesn't match
      }
    }

    // 3. Experience level matching
    if (searchCriteria.value.experience) {
      const expLevels: { [key: string]: string[] } = {
        entry: ['junior', 'entry', 'entry-level', 'graduate', 'fresh'],
        mid: ['mid', 'mid-level', 'intermediate', 'mid-senior'],
        senior: ['senior', 'lead', 'principal', 'architect'],
        lead: ['lead', 'manager', 'director', 'head', 'principal']
      }
      const requiredLevels = expLevels[searchCriteria.value.experience] || []
      const hasExpMatch = requiredLevels.some(level => jobText.includes(level))
      if (hasExpMatch) {
        reasons.push(`Experience level: ${searchCriteria.value.experience}`)
      }
    }

    // Only include jobs with reasonable match (>40% without keywords, or any match with keywords)
    if (score >= 40 || reasons.length > 0) {
      matchedJobs.value.push({
        job,
        score: Math.round(score),
        reasons
      })
    }
  })

  // Sort by score descending
  matchedJobs.value.sort((a, b) => b.score - a.score)
}
</script>
