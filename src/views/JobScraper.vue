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
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAnalytics } from '@/composables/useAnalytics'
import TopBanner from '@/components/TopBanner.vue'

const router = useRouter()
const { user, initializeAuth, isDark } = useAuth()
const { trackJobsImported, trackFeatureView } = useAnalytics()

const selectedSource = ref('linkedin')
const pastedData = ref('')
const parsedJobs = ref<any[]>([])
const selectedJobIndices = ref<number[]>([])
const importedCount = ref(0)

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
</script>
