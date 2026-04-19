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
              <p class="text-xs leading-relaxed">{{ resume.summary }}</p>
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
                <p class="text-xs mt-1 leading-tight">{{ exp.description }}</p>
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

const router = useRouter()
const { user, initializeAuth, isDark } = useAuth()
const { trackResumeBuilt, trackResumeSaved, trackFeatureView } = useAnalytics()

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

const saveResume = () => {
  localStorage.setItem('resume', JSON.stringify(resume.value))
  
  // Track resume save
  trackResumeSaved()
  
  // Also track the built resume stats
  trackResumeBuilt({
    skills: resume.value.skills,
    experience: resume.value.experience
  })
  
  alert('✅ Resume saved to local storage!')
}

const downloadPDF = () => {
  alert('📥 PDF download feature coming soon! For now, use your browser\'s Print to PDF feature (Cmd+P)')
}

onMounted(async () => {
  await initializeAuth()
  if (!user.value) {
    router.push('/login')
  }
  
  // Load saved resume
  const saved = localStorage.getItem('resume')
  if (saved) {
    resume.value = JSON.parse(saved)
  }
  
  // Track feature view
  trackFeatureView('resume_builder')
})
</script>
