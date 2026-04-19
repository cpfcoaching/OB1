<template>
  <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-screen">
    <!-- Banner Navigation -->
    <TopBanner />

    <!-- Page Header -->
    <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b p-6">
      <div class="max-w-6xl mx-auto">
        <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-1">💬 Interview Prep</h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Practice with common interview questions and get AI feedback</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto p-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar: Categories & Questions -->
        <div class="lg:col-span-1">
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm overflow-hidden">
            <div :class="isDark ? 'bg-gray-700' : 'bg-indigo-50'" class="p-4 border-b border-gray-700">
              <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="font-bold">Categories</h2>
            </div>
            <div class="divide-y divide-gray-700">
              <button
                v-for="category in categories"
                :key="category"
                @click="selectedCategory = category"
                :class="selectedCategory === category
                  ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-900')
                  : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50')"
                class="w-full text-left px-4 py-3 transition font-medium text-sm"
              >
                {{ getCategoryEmoji(category) }} {{ category }}
              </button>
            </div>
          </div>

          <!-- Questions in Category -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm overflow-hidden mt-6">
            <div :class="isDark ? 'bg-gray-700' : 'bg-indigo-50'" class="p-4 border-b border-gray-700">
              <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="font-bold text-sm">Questions</h3>
            </div>
            <div class="divide-y divide-gray-700 max-h-96 overflow-y-auto">
              <button
                v-for="(q, idx) in getQuestionsByCategory(selectedCategory)"
                :key="idx"
                @click="selectQuestion(idx)"
                :class="currentQuestionIndex === idx
                  ? (isDark ? 'bg-green-600 text-white' : 'bg-green-100 text-green-900')
                  : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50')"
                class="w-full text-left px-4 py-2 transition text-sm border-b"
              >
                <div class="truncate font-medium">Q{{ idx + 1 }}: {{ q.question.substring(0, 30) }}...</div>
                <div class="text-xs opacity-75">Difficulty: {{ q.difficulty }}</div>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content: Question & Answer -->
        <div class="lg:col-span-3">
          <div v-if="currentQuestion" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <!-- Question Header -->
            <div class="mb-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold">{{ currentQuestion.question }}</h2>
                  <div class="flex gap-2 mt-2">
                    <span :class="getDifficultyColor(currentQuestion.difficulty)" class="text-xs px-3 py-1 rounded-full font-medium">
                      {{ currentQuestion.difficulty }}
                    </span>
                    <span :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'" class="text-xs px-3 py-1 rounded-full">
                      {{ currentQuestion.type }}
                    </span>
                  </div>
                </div>
                <!-- Timer -->
                <div v-if="isTimerRunning" :class="isDark ? 'bg-gray-700' : 'bg-gray-100'" class="px-4 py-2 rounded-lg text-center">
                  <div class="text-2xl font-bold" :class="timerSeconds < 60 ? 'text-red-600' : isDark ? 'text-indigo-400' : 'text-indigo-600'">
                    {{ formatTime(timerSeconds) }}
                  </div>
                  <div :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs">Elapsed</div>
                </div>
              </div>

              <!-- Tip -->
              <div :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-900'" class="p-4 rounded-lg text-sm">
                <strong>💡 Tip:</strong> {{ currentQuestion.tip }}
              </div>
            </div>

            <!-- Answer Area -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <label :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="block text-sm font-medium">Your Answer</label>
                <span :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-xs">{{ userAnswer.length }} / 500 characters</span>
              </div>
              <textarea
                v-model="userAnswer"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                placeholder="Type your answer here. Practice answering within 2-3 minutes for behavioral questions..."
                rows="8"
              ></textarea>
            </div>

            <!-- Controls -->
            <div class="flex gap-3 flex-wrap mb-6">
              <button
                @click="toggleTimer"
                :class="isTimerRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'"
                class="text-white px-4 py-2 rounded-lg transition font-medium"
              >
                {{ isTimerRunning ? '⏹️ Stop Timer' : '⏱️ Start Timer' }}
              </button>
              <button
                @click="showFeedback ? (showFeedback = false) : showAnswerFeedback()"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                {{ showFeedback ? '✅ Hide' : '🎯 Get Feedback' }}
              </button>
              <button
                @click="clearAnswer"
                :class="isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
                class="px-4 py-2 rounded-lg transition font-medium"
              >
                🗑️ Clear
              </button>
              <button
                @click="nextQuestion"
                :class="isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
                class="px-4 py-2 rounded-lg transition font-medium"
              >
                ⏭️ Next
              </button>
            </div>

            <!-- AI Feedback -->
            <div v-if="showFeedback && userAnswer.length > 10" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'" class="border rounded-lg p-4">
              <h3 :class="isDark ? 'text-green-400' : 'text-green-900'" class="font-bold mb-3">✨ Feedback & Tips</h3>
              <div :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="space-y-2 text-sm">
                <p><strong>Length:</strong> {{ userAnswer.length }} characters (aim for 150-300 for behavioral questions)</p>
                <p><strong>Structure:</strong> Try using the STAR method (Situation, Task, Action, Result) for behavioral questions</p>
                <p v-if="currentQuestion.type === 'Behavioral'" class="mt-3 p-3 rounded" :class="isDark ? 'bg-gray-600' : 'bg-blue-100'">
                  💡 <strong>Pro Tip:</strong> Focus on YOUR specific actions and outcomes, not the team's results.
                </p>
                <p v-else-if="currentQuestion.type === 'Technical'" class="mt-3 p-3 rounded" :class="isDark ? 'bg-gray-600' : 'bg-blue-100'">
                  💡 <strong>Pro Tip:</strong> Walk through your solution step-by-step and explain your reasoning.
                </p>
                <p v-else class="mt-3 p-3 rounded" :class="isDark ? 'bg-gray-600' : 'bg-blue-100'">
                  💡 <strong>Pro Tip:</strong> Show enthusiasm and align your answer with company values.
                </p>
              </div>
            </div>

            <!-- Empty Feedback State -->
            <div v-if="showFeedback && userAnswer.length <= 10" :class="isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'" class="rounded-lg p-4 text-center text-sm">
              Start typing your answer to get feedback! 📝
            </div>
          </div>

          <!-- No Question Selected -->
          <div v-else :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-8 text-center">
            <p class="text-4xl mb-4">📋</p>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'">Select a question to get started</p>
          </div>
        </div>
      </div>

      <!-- Practice Tips -->
      <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 mt-6">
        <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">🎯 Interview Practice Tips</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>STAR Method:</strong> Use for behavioral questions - Situation, Task, Action, Result
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Practice Out Loud:</strong> Actually speak your answers to improve delivery
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Be Specific:</strong> Use concrete examples, not hypotheticals
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Time Your Answers:</strong> Aim for 1-2 minutes per response
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
const { trackInterviewPractice, trackFeatureView } = useAnalytics()

const categories = ref(['Behavioral', 'Technical', 'HR', 'Situational'])
const selectedCategory = ref('Behavioral')
const currentQuestionIndex = ref(0)
const userAnswer = ref('')
const showFeedback = ref(false)
const isTimerRunning = ref(false)
const timerSeconds = ref(0)

const questions = ref([
  // Behavioral
  { question: 'Tell me about a time you had a conflict with a coworker. How did you resolve it?', type: 'Behavioral', category: 'Behavioral', difficulty: 'Medium', tip: 'Focus on the resolution and what you learned. Use STAR method.' },
  { question: 'Describe a situation where you had to meet a tight deadline.', type: 'Behavioral', category: 'Behavioral', difficulty: 'Easy', tip: 'Highlight your planning and execution skills.' },
  { question: 'Tell me about a time you failed and how you handled it.', type: 'Behavioral', category: 'Behavioral', difficulty: 'Hard', tip: 'Show vulnerability and growth. Focus on what you learned.' },
  { question: 'Give an example of when you went above and beyond your job responsibilities.', type: 'Behavioral', category: 'Behavioral', difficulty: 'Medium', tip: 'Show initiative and commitment to excellence.' },
  { question: 'Tell me about a time you had to learn something new quickly.', type: 'Behavioral', category: 'Behavioral', difficulty: 'Easy', tip: 'Demonstrate adaptability and learning ability.' },
  
  // Technical
  { question: 'How would you approach a problem you\'ve never seen before?', type: 'Technical', category: 'Technical', difficulty: 'Medium', tip: 'Walk through your problem-solving methodology step by step.' },
  { question: 'Explain your approach to debugging a complex issue.', type: 'Technical', category: 'Technical', difficulty: 'Medium', tip: 'Describe systematic approaches like logs, testing, and isolation.' },
  { question: 'How do you stay updated with new technologies?', type: 'Technical', category: 'Technical', difficulty: 'Easy', tip: 'Mention blogs, courses, side projects, or communities.' },
  { question: 'Tell me about a technical project you\'re proud of.', type: 'Technical', category: 'Technical', difficulty: 'Easy', tip: 'Focus on challenges, your role, and the impact.' },
  
  // HR Questions
  { question: 'Why do you want to work at this company?', type: 'HR', category: 'HR', difficulty: 'Medium', tip: 'Show you\'ve researched the company. Connect your values to theirs.' },
  { question: 'Where do you see yourself in 5 years?', type: 'HR', category: 'HR', difficulty: 'Medium', tip: 'Show ambition but align with the role/company.' },
  { question: 'What are your greatest strengths?', type: 'HR', category: 'HR', difficulty: 'Easy', tip: 'Pick 2-3 genuine strengths with examples.' },
  { question: 'What are your biggest weaknesses?', type: 'HR', category: 'HR', difficulty: 'Hard', tip: 'Be honest but show how you\'re improving.' },
  { question: 'Why are you leaving your current job?', type: 'HR', category: 'HR', difficulty: 'Medium', tip: 'Stay positive. Focus on growth, not complaints.' },
  
  // Situational
  { question: 'How would you handle a situation where you disagree with your manager\'s decision?', type: 'Situational', category: 'Situational', difficulty: 'Hard', tip: 'Show respect, communication, and willingness to listen.' },
  { question: 'What would you do if you had two urgent deadlines at the same time?', type: 'Situational', category: 'Situational', difficulty: 'Medium', tip: 'Demonstrate prioritization and communication skills.' },
  { question: 'How would you handle working with a difficult team member?', type: 'Situational', category: 'Situational', difficulty: 'Medium', tip: 'Show empathy and problem-solving ability.' },
  { question: 'What if you made a mistake that affected your team\'s project?', type: 'Situational', category: 'Situational', difficulty: 'Medium', tip: 'Own it, fix it, and explain what you learned.' },
])

const currentQuestion = computed(() => {
  const filtered = getQuestionsByCategory(selectedCategory.value)
  return filtered[currentQuestionIndex.value] || null
})

const getQuestionsByCategory = (category: string) => {
  return questions.value.filter(q => q.category === category)
}

const getCategoryEmoji = (category: string) => {
  const emojis: Record<string, string> = {
    'Behavioral': '🎭',
    'Technical': '💻',
    'HR': '🤝',
    'Situational': '⚡'
  }
  return emojis[category] || '❓'
}

const getDifficultyColor = (difficulty: string) => {
  if (difficulty === 'Easy') return isDark.value ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-900'
  if (difficulty === 'Medium') return isDark.value ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-900'
  return isDark.value ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-900'
}

const selectQuestion = (idx: number) => {
  currentQuestionIndex.value = idx
  userAnswer.value = ''
  showFeedback.value = false
  timerSeconds.value = 0
  isTimerRunning.value = false
}

const nextQuestion = () => {
  const filtered = getQuestionsByCategory(selectedCategory.value)
  currentQuestionIndex.value = (currentQuestionIndex.value + 1) % filtered.length
  selectQuestion(currentQuestionIndex.value)
}

const clearAnswer = () => {
  userAnswer.value = ''
  showFeedback.value = false
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const toggleTimer = () => {
  if (isTimerRunning.value) {
    isTimerRunning.value = false
  } else {
    isTimerRunning.value = true
    const interval = setInterval(() => {
      if (isTimerRunning.value) {
        timerSeconds.value++
      } else {
        clearInterval(interval)
      }
    }, 1000)
  }
}

const showAnswerFeedback = () => {
  showFeedback.value = true
  
  // Get current question data
  const filtered = getQuestionsByCategory(selectedCategory.value)
  const currentQuestion = filtered[currentQuestionIndex.value]
  
  // Track interview practice
  trackInterviewPractice({
    category: selectedCategory.value,
    difficulty: currentQuestion?.difficulty || 'Medium',
    answered: userAnswer.value.length > 10
  })
}

onMounted(async () => {
  await initializeAuth()
  if (!user.value) {
    router.push('/login')
  }
  
  // Track feature view
  trackFeatureView('interview_prep')
})
</script>
