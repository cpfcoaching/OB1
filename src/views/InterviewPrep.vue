<template>
  <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-screen">
    <TopBanner />

    <!-- Page Header -->
    <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b p-6">
      <div class="max-w-7xl mx-auto">
        <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-2">📚 Interview Prep</h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Organize interview questions, research, and prep strategies by company</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto p-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Total Interviews</p>
          <p class="text-3xl font-bold text-indigo-600 mt-2">{{ interviewStats.total }}</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Upcoming</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">{{ interviewStats.upcoming }}</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Past</p>
          <p class="text-3xl font-bold text-green-600 mt-2">{{ interviewStats.past }}</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">With Q&As</p>
          <p class="text-3xl font-bold text-purple-600 mt-2">{{ interviewStats.withQuestions }}</p>
        </div>
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm font-medium">Total Questions</p>
          <p class="text-3xl font-bold text-orange-600 mt-2">{{ interviewStats.totalQuestions }}</p>
        </div>
      </div>

      <!-- Add Interview Form & Search -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Add Interview Form -->
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 lg:col-span-2">
          <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">➕ Create Interview Prep</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <input
                v-model="newInterview.company"
                type="text"
                placeholder="Company"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                v-model="newInterview.role"
                type="text"
                placeholder="Role"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <input
                v-model="newInterview.interviewDate"
                type="date"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                v-model="newInterview.interviewType"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Type</option>
                <option value="phone">Phone</option>
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="panel">Panel</option>
                <option value="other">Other</option>
              </select>
            </div>
            <textarea
              v-model="newInterview.companyResearch"
              placeholder="Company Research (optional)"
              :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
              class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              rows="2"
            />
            <textarea
              v-model="newInterview.salaryExpectations"
              placeholder="Salary Expectations (optional)"
              :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
              class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              rows="2"
            />
            <textarea
              v-model="newInterview.notes"
              placeholder="General Notes (optional)"
              :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
              class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              rows="2"
            />
            <button
              @click="handleAddInterview"
              :disabled="isLoading || !newInterview.company || !newInterview.role"
              class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              {{ isLoading ? '⏳ Adding...' : '✅ Create Interview Prep' }}
            </button>
          </div>
        </div>

        <!-- Search -->
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
          <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">🔍 Search</h2>
          <div class="space-y-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Company or role..."
              :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
              class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div :class="isDark ? 'bg-gray-700' : 'bg-blue-50'" class="p-3 rounded-lg">
              <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-sm">
                <span class="font-bold">{{ filteredInterviews.length }}</span> interview{{ filteredInterviews.length !== 1 ? 's' : '' }} found
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Interviews List -->
      <div v-if="filteredInterviews.length === 0" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-8 text-center">
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">No interviews found</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="interview in filteredInterviews"
          :key="interview.id"
          :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
          class="border rounded-lg shadow-sm overflow-hidden"
        >
          <!-- Interview Header -->
          <div
            @click="toggleInterviewExpanded(interview.id!)"
            :class="isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'"
            class="p-6 cursor-pointer transition flex justify-between items-center"
          >
            <div class="flex-1">
              <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold">{{ interview.company }}</h3>
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
                {{ interview.role }}
                <span v-if="interview.interviewType" class="ml-2">• {{ getInterviewTypeIcon(interview.interviewType) }} {{ interview.interviewType }}</span>
                <span v-if="interview.interviewDate" class="ml-2">• 📅 {{ formatDate(interview.interviewDate) }}</span>
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">{{ interview.questions?.length || 0 }} Q&As</span>
              <button @click.stop="handleDeleteInterview(interview.id!)" class="text-red-600 hover:text-red-700">🗑️</button>
              <span class="text-gray-400">{{ expandedInterview === interview.id ? '▼' : '▶' }}</span>
            </div>
          </div>

          <!-- Interview Details (Expandable) -->
          <div v-if="expandedInterview === interview.id" :class="isDark ? 'bg-gray-750 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'" class="p-6 space-y-6">
            <!-- Company Research -->
            <div v-if="interview.companyResearch" class="space-y-2">
              <h4 :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="font-semibold">🏢 Company Research</h4>
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm whitespace-pre-wrap">{{ interview.companyResearch }}</p>
            </div>

            <!-- Salary Expectations -->
            <div v-if="interview.salaryExpectations" class="space-y-2">
              <h4 :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="font-semibold">💰 Salary Expectations</h4>
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm whitespace-pre-wrap">{{ interview.salaryExpectations }}</p>
            </div>

            <!-- Notes -->
            <div v-if="interview.notes" class="space-y-2">
              <h4 :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="font-semibold">📝 Notes</h4>
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm whitespace-pre-wrap">{{ interview.notes }}</p>
            </div>

            <!-- Questions Section -->
            <div class="border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'" :style="{ paddingTop: '1.5rem' }">
              <h4 :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="font-semibold mb-4">❓ Interview Questions ({{ interview.questions?.length || 0 }})</h4>

              <div v-if="!interview.questions || interview.questions.length === 0" :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm italic">
                No questions added yet
              </div>

              <div v-else class="space-y-4 mb-4">
                <div
                  v-for="(question, qIdx) in interview.questions"
                  :key="question.id"
                  :class="[isDark ? 'bg-gray-700' : 'bg-white', 'p-4 rounded border', isDark ? 'border-gray-600' : 'border-gray-300']"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                      <p :class="isDark ? 'text-gray-200' : 'text-gray-800'" class="font-medium">{{ question.text }}</p>
                      <div v-if="question.difficulty || question.category" class="flex gap-2 mt-2">
                        <span v-if="question.category" :class="getDifficultyClass(question.difficulty)" class="text-xs px-2 py-1 rounded">
                          {{ question.category }}
                        </span>
                        <span v-if="question.difficulty" :class="getDifficultyClass(question.difficulty)" class="text-xs px-2 py-1 rounded">
                          {{ question.difficulty }}
                        </span>
                      </div>
                    </div>
                    <button
                      @click="handleDeleteQuestion(interview.id!, question.id!)"
                      class="text-red-600 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <div v-if="question.answer" class="mt-3 p-3 rounded" :class="isDark ? 'bg-gray-600' : 'bg-gray-100'">
                    <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-sm">
                      <span class="font-semibold">Answer:</span> {{ question.answer }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Add Question Form -->
              <div :class="isDark ? 'bg-gray-700' : 'bg-gray-50'" class="p-4 rounded">
                <h5 :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="font-semibold text-sm mb-3">Add Question</h5>
                <div class="space-y-2">
                  <input
                    v-model="newQuestions[interview.id!]!.text"
                    type="text"
                    placeholder="Question text..."
                    :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                    class="w-full border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <textarea
                    v-model="newQuestions[interview.id!]!.answer"
                    placeholder="Answer (optional)..."
                    :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                    class="w-full border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    rows="2"
                  />
                  <div class="grid grid-cols-2 gap-2">
                    <select
                      v-model="newQuestions[interview.id!]!.difficulty"
                      :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                      class="border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Difficulty</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <input
                      v-model="newQuestions[interview.id!]!.category"
                      type="text"
                      placeholder="Category (optional)"
                      :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                      class="border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    @click="handleAddQuestion(interview.id!)"
                    class="w-full text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import TopBanner from '@/components/TopBanner.vue'
import { useInterviewPrep, type InterviewPrep, type InterviewQuestion } from '@/composables/useInterviewPrep'

const { isDark, initializeAuth } = useAuth()
const {
  filteredInterviews,
  interviewStats,
  searchQuery,
  isLoading,
  error,
  loadInterviews,
  addInterview,
  deleteInterview,
  addQuestion,
  deleteQuestion
} = useInterviewPrep()

const expandedInterview = ref<string | null>(null)

const newInterview = ref<InterviewPrep>({
  jobId: '',
  company: '',
  role: '',
  interviewDate: '',
  interviewType: undefined,
  questions: [],
  notes: ''
})

const newQuestions = ref<Record<string, InterviewQuestion>>({})

const toggleInterviewExpanded = (interviewId: string) => {
  expandedInterview.value = expandedInterview.value === interviewId ? null : interviewId
}

const handleAddInterview = async () => {
  if (!newInterview.value.company || !newInterview.value.role) {
    alert('Please enter company and role')
    return
  }

  try {
    const interviewId = await addInterview(newInterview.value)
    newQuestions.value[interviewId] = {
      text: '',
      answer: '',
      difficulty: '',
      category: ''
    }
    newInterview.value = {
      jobId: '',
      company: '',
      role: '',
      interviewDate: '',
      interviewType: undefined,
      questions: [],
      notes: ''
    }
    alert('✅ Interview prep created!')
  } catch (err) {
    alert('❌ Error creating interview: ' + error.value)
  }
}

const handleDeleteInterview = async (interviewId: string) => {
  if (confirm('Are you sure you want to delete this interview prep?')) {
    try {
      await deleteInterview(interviewId)
      alert('✅ Interview deleted!')
    } catch (err) {
      alert('❌ Error deleting interview: ' + error.value)
    }
  }
}

const handleAddQuestion = async (interviewId: string) => {
  const question = newQuestions.value[interviewId]
  if (!question || !question.text) {
    alert('Please enter a question')
    return
  }

  try {
    await addQuestion(interviewId, question)
    newQuestions.value[interviewId] = {
      text: '',
      answer: '',
      difficulty: '',
      category: ''
    }
    alert('✅ Question added!')
  } catch (err) {
    alert('❌ Error adding question: ' + error.value)
  }
}

const handleDeleteQuestion = async (interviewId: string, questionId: string) => {
  if (confirm('Delete this question?')) {
    try {
      await deleteQuestion(interviewId, questionId)
      alert('✅ Question deleted!')
    } catch (err) {
      alert('❌ Error deleting question: ' + error.value)
    }
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getInterviewTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    phone: '☎️',
    technical: '💻',
    behavioral: '💬',
    panel: '👥',
    other: '📞'
  }
  return icons[type] || '📞'
}

const getDifficultyClass = (difficulty?: string) => {
  const classes: Record<string, string> = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  }
  return classes[difficulty || ''] || 'bg-gray-100 text-gray-800'
}

onMounted(async () => {
  await initializeAuth()
  await loadInterviews()

  // Initialize question form state
  filteredInterviews.value.forEach(interview => {
    if (interview.id && !newQuestions.value[interview.id]) {
      newQuestions.value[interview.id] = {
        text: '',
        answer: '',
        difficulty: '',
        category: ''
      }
    }
  })
})
</script>
