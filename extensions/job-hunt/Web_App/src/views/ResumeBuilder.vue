<template>
  <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-screen">
    <!-- Banner Navigation -->
    <TopBanner />

    <!-- Page Header -->
    <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b p-6">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-1">📝 Resume Builder</h1>
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Create and optimize your professional resume</p>
        </div>
        <button
          @click="downloadPDF"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition font-medium"
        >
          ⬇️ Download PDF
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto p-6">
      <!-- Import Section -->
      <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 mb-6">
        <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-6">💼 Import Resume Data</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- LinkedIn Profile Import -->
          <div :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'" class="border rounded-lg p-6">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-md font-semibold mb-4">🔗 LinkedIn Profile</h3>
            
            <div class="space-y-4">
              <div>
                <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-2">Profile Data (JSON or plain text)</label>
                <textarea
                  v-model="linkedinJsonData"
                  placeholder="Paste your LinkedIn profile data here — JSON format OR plain text copied from your LinkedIn profile page both work."
                  :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                  class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                  rows="8"
                ></textarea>
              </div>
              
              <div :class="isDark ? 'bg-gray-600 border-gray-500' : 'bg-blue-50 border-blue-200'" class="border rounded p-4 text-xs space-y-2">
                <p :class="isDark ? 'text-gray-200' : 'text-gray-700'" class="font-semibold mb-2">📋 How to Export LinkedIn Data:</p>
                <ol :class="isDark ? 'text-gray-300' : 'text-gray-600'" class="list-decimal list-inside space-y-1">
                  <li>Open your LinkedIn profile in a browser</li>
                  <li><strong>Option A – plain text:</strong> Select all (Cmd/Ctrl+A), copy, paste here</li>
                  <li><strong>Option B – data export:</strong> Settings → Data Privacy → "Get a copy of your data" → download Profile.csv and paste its contents</li>
                  <li><strong>Option C – JSON:</strong> Open DevTools Console (F12), run:<br>
                    <code class="block bg-gray-900 text-green-400 px-2 py-1 rounded mt-1 overflow-x-auto whitespace-pre-wrap">copy(JSON.stringify(window.__NEXT_DATA__?.props?.pageProps?.data?.identity?.profile || {firstName:'',lastName:''}))</code>
                  </li>
                </ol>
              </div>
              
              <button
                @click="importFromLinkedIn"
                :disabled="!linkedinJsonData || isLoadingLinkedin"
                :class="linkedinJsonData && !isLoadingLinkedin 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'"
                class="w-full text-white px-4 py-3 rounded-lg transition font-medium"
              >
                {{ isLoadingLinkedin ? '⏳ Importing...' : '📥 Import from LinkedIn' }}
              </button>
              
              <div v-if="linkedinError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                ❌ {{ linkedinError }}
              </div>
              
              <div v-if="linkedinSuccess" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
                ✅ {{ linkedinSuccess }}
              </div>
            </div>
          </div>
          
          <!-- Document Upload -->
          <div :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'" class="border rounded-lg p-6">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-md font-semibold mb-4">📄 Resume Document</h3>
            
            <div class="space-y-4">
              <div class="space-y-3">
                <div>
                  <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-2">Upload File</label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    @change="handleFileUpload"
                    :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                    class="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-xs mt-1">Supported: .txt, .pdf, .docx</p>
                </div>
                <div>
                  <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-1">Or paste resume text</label>
                  <textarea
                    v-model="resumeText"
                    placeholder="Copy your resume text and paste it here..."
                    :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                    class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                    rows="5"
                  ></textarea>
                </div>
              </div>
              
              <div :class="isDark ? 'bg-gray-600 border-gray-500' : 'bg-amber-50 border-amber-200'" class="border rounded p-4 text-xs space-y-2">
                <p :class="isDark ? 'text-gray-200' : 'text-gray-700'" class="font-semibold mb-2">📋 How to Export Your Resume:</p>
                <div :class="isDark ? 'text-gray-300' : 'text-gray-600'" class="space-y-2">
                  <div>
                    <p class="font-semibold">From PDF:</p>
                    <p>1. Open in Adobe Reader or browser PDF viewer</p>
                    <p>2. Select all text (Cmd+A or Ctrl+A)</p>
                    <p>3. Copy (Cmd+C or Ctrl+C) and paste above</p>
                  </div>
                  <div>
                    <p class="font-semibold">From Word (.docx):</p>
                    <p>1. Open in Microsoft Word</p>
                    <p>2. Select all (Cmd+A or Ctrl+A)</p>
                    <p>3. Copy (Cmd+C or Ctrl+C) and paste above</p>
                  </div>
                  <div>
                    <p class="font-semibold">From Google Docs:</p>
                    <p>1. Open your document</p>
                    <p>2. Select all text (Cmd+A or Ctrl+A)</p>
                    <p>3. Copy (Cmd+C or Ctrl+C) and paste above</p>
                  </div>
                </div>
              </div>
              
              <button
                @click="parseResumeDocument"
                :disabled="!resumeText || isLoadingDocument"
                :class="resumeText && !isLoadingDocument 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-gray-400 cursor-not-allowed'"
                class="w-full text-white px-4 py-3 rounded-lg transition font-medium"
              >
                {{ isLoadingDocument ? '⏳ Parsing...' : '📥 Parse & Import Resume' }}
              </button>
              
              <div v-if="documentError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                ❌ {{ documentError }}
              </div>
              
              <div v-if="documentSuccess" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
                ✅ {{ documentSuccess }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Editor Panel -->
        <div class="space-y-6">
          <!-- Personal Info Section -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">👤 Personal Info</h2>
            <div class="space-y-4">
              <input
                v-model="resume.personalInfo.fullName"
                type="text"
                placeholder="Full Name"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                v-model="resume.personalInfo.email"
                type="email"
                placeholder="Email"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                v-model="resume.personalInfo.phone"
                type="tel"
                placeholder="Phone"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                v-model="resume.personalInfo.location"
                type="text"
                placeholder="City, State"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <!-- Professional Summary -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">📄 Professional Summary</h2>
            <textarea
              v-model="resume.summary"
              placeholder="Brief overview of your professional background and goals..."
              :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
              class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
            ></textarea>
          </div>

          <!-- Experience Section -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold">💼 Experience</h2>
              <button
                @click="addExperience"
                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
              >
                + Add
              </button>
            </div>
            <div class="space-y-4">
              <div
                v-for="(exp, idx) in resume.experience"
                :key="idx"
                :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'"
                class="border rounded-lg p-4 space-y-3"
              >
                <div class="flex justify-between">
                  <input
                    v-model="exp.position"
                    type="text"
                    placeholder="Job Title"
                    :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                    class="flex-1 border rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    @click="removeExperience(idx)"
                    class="text-red-600 hover:text-red-700 ml-2 text-sm"
                  >
                    🗑️
                  </button>
                </div>
                <input
                  v-model="exp.company"
                  type="text"
                  placeholder="Company"
                  :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                  class="w-full border rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div class="grid grid-cols-2 gap-2">
                  <input
                    v-model="exp.startDate"
                    type="month"
                    :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                    class="border rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    v-model="exp.endDate"
                    type="month"
                    placeholder="End Date (or current)"
                    :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                    class="border rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <textarea
                  v-model="exp.description"
                  placeholder="Describe your responsibilities and achievements..."
                  :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                  class="w-full border rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Education Section -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold">🎓 Education</h2>
              <button
                @click="addEducation"
                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
              >
                + Add
              </button>
            </div>
            <div class="space-y-4">
              <div
                v-for="(edu, idx) in resume.education"
                :key="idx"
                :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'"
                class="border rounded-lg p-4 space-y-3"
              >
                <div class="flex justify-between">
                  <input
                    v-model="edu.degree"
                    type="text"
                    placeholder="Degree"
                    :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                    class="flex-1 border rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    @click="removeEducation(idx)"
                    class="text-red-600 hover:text-red-700 ml-2 text-sm"
                  >
                    🗑️
                  </button>
                </div>
                <input
                  v-model="edu.school"
                  type="text"
                  placeholder="School/University"
                  :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                  class="w-full border rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  v-model="edu.graduationDate"
                  type="month"
                  :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                  class="w-full border rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <!-- Skills Section -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">⚡ Skills</h2>
            <div class="space-y-2">
              <div
                v-for="(skill, idx) in resume.skills"
                :key="idx"
                class="flex gap-2"
              >
                <input
                  v-model="resume.skills[idx]"
                  type="text"
                  placeholder="Add a skill"
                  :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                  class="flex-1 border rounded px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  @click="removeSkill(idx)"
                  class="text-red-600 hover:text-red-700 px-2"
                >
                  🗑️
                </button>
              </div>
              <button
                @click="addSkill"
                class="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition mt-2"
              >
                + Add Skill
              </button>
            </div>
          </div>

          <!-- Save Button -->
          <button
            @click="saveResume"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition font-medium"
          >
            💾 Save Resume
          </button>
        </div>

        <!-- Preview Panel -->
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-8 sticky top-6 h-fit">
          <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-xs font-bold uppercase tracking-wider mb-6 text-gray-500">Preview</h2>
          
          <!-- Resume Preview -->
          <div :class="isDark ? 'text-gray-200' : 'text-gray-900'" class="space-y-4 text-sm">
            <!-- Header -->
            <div class="border-b pb-4">
              <h1 class="text-2xl font-bold">{{ resume.personalInfo.fullName || 'Your Name' }}</h1>
              <div class="text-xs mt-2 space-y-1">
                <p v-if="resume.personalInfo.email">{{ resume.personalInfo.email }}</p>
                <p v-if="resume.personalInfo.phone">{{ resume.personalInfo.phone }}</p>
                <p v-if="resume.personalInfo.location">{{ resume.personalInfo.location }}</p>
              </div>
            </div>

            <!-- Summary -->
            <div v-if="resume.summary">
              <p class="text-xs text-gray-500 font-bold mb-2">PROFESSIONAL SUMMARY</p>
              <p class="text-xs leading-relaxed whitespace-pre-line">{{ resume.summary }}</p>
            </div>

            <!-- Experience -->
            <div v-if="resume.experience.length > 0">
              <p class="text-xs text-gray-500 font-bold mb-2">EXPERIENCE</p>
              <div v-for="(exp, idx) in resume.experience" :key="idx" class="mb-3">
                <div class="flex justify-between">
                  <p class="font-semibold text-xs">{{ exp.position }}</p>
                  <p class="text-xs">{{ exp.startDate }} - {{ exp.endDate || 'Present' }}</p>
                </div>
                <p class="text-xs opacity-75">{{ exp.company }}</p>
                <p class="text-xs mt-1 leading-tight whitespace-pre-line">{{ exp.description }}</p>
              </div>
            </div>

            <!-- Education -->
            <div v-if="resume.education.length > 0">
              <p class="text-xs text-gray-500 font-bold mb-2">EDUCATION</p>
              <div v-for="(edu, idx) in resume.education" :key="idx" class="mb-2">
                <div class="flex justify-between">
                  <p class="font-semibold text-xs">{{ edu.degree }}</p>
                  <p class="text-xs">{{ edu.graduationDate }}</p>
                </div>
                <p class="text-xs opacity-75">{{ edu.school }}</p>
              </div>
            </div>

            <!-- Skills -->
            <div v-if="resume.skills.filter(s => s).length > 0">
              <p class="text-xs text-gray-500 font-bold mb-2">SKILLS</p>
              <p class="text-xs leading-relaxed">{{ resume.skills.filter(s => s).join(' • ') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 mt-6">
        <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">💡 Resume Tips</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Keep it Concise:</strong> Aim for 1 page for entry-level, 2 max for experienced
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Use Action Verbs:</strong> Started, Led, Designed, Increased, Reduced, etc.
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Include Numbers:</strong> Quantify achievements: "Increased sales by 25%"
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Tailor for ATS:</strong> Use keywords from job description
            </p>
          </div>
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
import { parseLinkedInData, mergeWithResume } from '@/utils/linkedinParser'
import { extractResumeSections, extractTextFromFile } from '@/utils/documentParser'
import { useJobHuntFirestore } from '@/composables/useJobHuntFirestore'

const router = useRouter()
const { user, initializeAuth, isDark } = useAuth()
const { trackResumeBuilt, trackResumeSaved, trackFeatureView } = useAnalytics()

// LinkedIn import state
const linkedinUrl = ref('')
const linkedinJsonData = ref('')
const isLoadingLinkedin = ref(false)
const linkedinError = ref('')
const linkedinSuccess = ref('')

// Document import state
const resumeText = ref('')
const isLoadingDocument = ref(false)
const documentError = ref('')
const documentSuccess = ref('')

const resume = ref({
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: ''
  },
  summary: '',
  experience: [
    { position: '', company: '', startDate: '', endDate: '', description: '' }
  ],
  education: [
    { degree: '', school: '', graduationDate: '' }
  ],
  skills: ['']
})

const addExperience = () => {
  resume.value.experience.push({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    description: ''
  })
}

const removeExperience = (idx: number) => {
  resume.value.experience.splice(idx, 1)
}

const addEducation = () => {
  resume.value.education.push({
    degree: '',
    school: '',
    graduationDate: ''
  })
}

const removeEducation = (idx: number) => {
  resume.value.education.splice(idx, 1)
}

const addSkill = () => {
  resume.value.skills.push('')
}

const removeSkill = (idx: number) => {
  resume.value.skills.splice(idx, 1)
}

const saveResume = async () => {
  // Always keep a local copy as backup
  localStorage.setItem('resume', JSON.stringify(resume.value))

  // Persist to Firestore when authenticated so data survives across devices & deployments
  if (user.value?.uid) {
    const { saveResume: saveToFirestore } = useJobHuntFirestore(user.value.uid)
    await saveToFirestore(resume.value)
  }

  trackResumeSaved()
  trackResumeBuilt({
    skills: resume.value.skills,
    experience: resume.value.experience
  })

  alert('✅ Resume saved!')
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const nlToBr = (value: string) => escapeHtml(value).replace(/\n/g, '<br/>')

const downloadPDF = () => {
  const previewHtml = `
    <html>
      <head>
        <title>${escapeHtml(resume.value.personalInfo.fullName || 'Resume')}</title>
        <style>
          @page { size: A4; margin: 14mm; }
          body { font-family: Arial, sans-serif; color: #111827; line-height: 1.45; }
          h1 { margin: 0 0 8px 0; font-size: 28px; }
          .muted { color: #4b5563; font-size: 12px; margin: 0; }
          .section { margin-top: 16px; }
          .section-title { font-weight: 700; font-size: 11px; letter-spacing: 0.08em; color: #4b5563; margin-bottom: 6px; }
          .row { display: flex; justify-content: space-between; gap: 12px; }
          .item { margin-bottom: 10px; }
          .small { font-size: 12px; }
          .bold { font-weight: 700; }
          .list-inline { font-size: 12px; }
          .divider { border-bottom: 1px solid #d1d5db; margin-bottom: 12px; padding-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="divider">
          <h1>${escapeHtml(resume.value.personalInfo.fullName || 'Your Name')}</h1>
          ${resume.value.personalInfo.email ? `<p class="muted">${escapeHtml(resume.value.personalInfo.email)}</p>` : ''}
          ${resume.value.personalInfo.phone ? `<p class="muted">${escapeHtml(resume.value.personalInfo.phone)}</p>` : ''}
          ${resume.value.personalInfo.location ? `<p class="muted">${escapeHtml(resume.value.personalInfo.location)}</p>` : ''}
        </div>

        ${resume.value.summary ? `
          <div class="section">
            <div class="section-title">PROFESSIONAL SUMMARY</div>
            <div class="small">${nlToBr(resume.value.summary)}</div>
          </div>
        ` : ''}

        ${resume.value.experience.filter(exp => exp.position || exp.company || exp.description).length ? `
          <div class="section">
            <div class="section-title">EXPERIENCE</div>
            ${resume.value.experience
              .filter(exp => exp.position || exp.company || exp.description)
              .map(exp => `
                <div class="item">
                  <div class="row small">
                    <div class="bold">${escapeHtml(exp.position || '')}</div>
                    <div>${escapeHtml(exp.startDate || '')}${exp.startDate || exp.endDate ? ' - ' : ''}${escapeHtml(exp.endDate || 'Present')}</div>
                  </div>
                  ${exp.company ? `<div class="small">${escapeHtml(exp.company)}</div>` : ''}
                  ${exp.description ? `<div class="small">${nlToBr(exp.description)}</div>` : ''}
                </div>
              `)
              .join('')}
          </div>
        ` : ''}

        ${resume.value.education.filter(edu => edu.degree || edu.school).length ? `
          <div class="section">
            <div class="section-title">EDUCATION</div>
            ${resume.value.education
              .filter(edu => edu.degree || edu.school)
              .map(edu => `
                <div class="item">
                  <div class="row small">
                    <div class="bold">${escapeHtml(edu.degree || '')}</div>
                    <div>${escapeHtml(edu.graduationDate || '')}</div>
                  </div>
                  ${edu.school ? `<div class="small">${escapeHtml(edu.school)}</div>` : ''}
                </div>
              `)
              .join('')}
          </div>
        ` : ''}

        ${resume.value.skills.filter(s => s.trim()).length ? `
          <div class="section">
            <div class="section-title">SKILLS</div>
            <div class="list-inline">${resume.value.skills.filter(s => s.trim()).map(escapeHtml).join(' • ')}</div>
          </div>
        ` : ''}
      </body>
    </html>
  `

  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=1024,height=768')
  if (!printWindow) {
    alert('Could not open print window. Please allow pop-ups and try again.')
    return
  }

  printWindow.document.open()
  printWindow.document.write(previewHtml)
  printWindow.document.close()
  printWindow.focus()

  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

// LinkedIn import handler
const importFromLinkedIn = () => {
  linkedinError.value = ''
  linkedinSuccess.value = ''
  isLoadingLinkedin.value = true
  
  try {
    const parsedData = parseLinkedInData(linkedinJsonData.value)
    
    if (!parsedData) {
      linkedinError.value = 'Failed to parse LinkedIn data. Please check the JSON format and try again.'
      return
    }
    
    // Merge the parsed data with current resume
    resume.value = mergeWithResume(resume.value, parsedData)
    
    const skillCount = parsedData.skills?.length || 0
    const expCount = parsedData.experience?.length || 0
    linkedinSuccess.value = `✅ Successfully imported! Added ${skillCount} skills and ${expCount} experiences.`
    
    // Clear inputs after successful import
    setTimeout(() => {
      linkedinJsonData.value = ''
      linkedinSuccess.value = ''
    }, 3000)
  } catch (error) {
    linkedinError.value = error instanceof Error ? error.message : 'Error importing LinkedIn data'
  } finally {
    isLoadingLinkedin.value = false
  }
}

// Parse resume document handler
const parseResumeDocument = async () => {
  documentError.value = ''
  documentSuccess.value = ''
  isLoadingDocument.value = true
  
  try {
    const textContent = resumeText.value.trim()
    
    if (!textContent) {
      documentError.value = 'No content to parse. Please paste your resume text.'
      return
    }
    
    // Extract resume sections from the text
    const sections = extractResumeSections(textContent)
    
    // Update resume with extracted data
    if (sections.summary) {
      resume.value.summary = sections.summary
    }
    
    if (sections.experience && sections.experience.length > 0) {
      resume.value.experience = sections.experience.map((exp: string) => ({
        position: exp.split('-')[0]?.trim() || exp,
        company: exp.split('-')[1]?.trim() || '',
        startDate: '',
        endDate: '',
        description: exp
      }))
    }
    
    if (sections.education && sections.education.length > 0) {
      resume.value.education = sections.education.map((edu: string) => ({
        degree: edu.split(',')[0]?.trim() || edu,
        school: edu.split(',')[1]?.trim() || '',
        graduationDate: ''
      }))
    }
    
    if (sections.skills && sections.skills.length > 0) {
      resume.value.skills = sections.skills
    }
    
    const skillCount = sections.skills?.length || 0
    const expCount = sections.experience?.length || 0
    const eduCount = sections.education?.length || 0
    
    documentSuccess.value = `✅ Successfully parsed! Found ${skillCount} skills, ${expCount} experiences, ${eduCount} education entries.`
    
    // Clear input after successful parse
    setTimeout(() => {
      resumeText.value = ''
      documentSuccess.value = ''
    }, 3000)
  } catch (error) {
    documentError.value = error instanceof Error ? error.message : 'Error parsing resume document'
  } finally {
    isLoadingDocument.value = false
  }
}

// File upload handler
const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  documentError.value = ''
  documentSuccess.value = ''
  isLoadingDocument.value = true
  try {
    const text = await extractTextFromFile(file)
    resumeText.value = text
    // Auto-parse immediately after extraction
    await parseResumeDocument()
  } catch (err) {
    documentError.value = err instanceof Error ? err.message : 'Failed to read file'
  } finally {
    isLoadingDocument.value = false
  }
}

onMounted(async () => {
  await initializeAuth()
  if (!user.value) {
    router.push('/login')
    return
  }

  // Try Firestore first (survives deployments & device changes)
  if (user.value.uid) {
    try {
      const { loadResume } = useJobHuntFirestore(user.value.uid)
      const firestoreResume = await loadResume()
      if (firestoreResume) {
        resume.value = firestoreResume as typeof resume.value
        trackFeatureView('resume_builder')
        return
      }
    } catch (e) {
      console.warn('Could not load resume from Firestore, falling back to localStorage', e)
    }
  }

  // Fallback to localStorage
  const saved = localStorage.getItem('resume')
  if (saved) {
    resume.value = JSON.parse(saved)
  }

  trackFeatureView('resume_builder')
})
</script>
