<template>
  <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-screen">
    <!-- Banner Navigation -->
    <TopBanner />

    <!-- Page Header -->
    <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b p-6">
      <div class="max-w-6xl mx-auto">
        <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-1">📧 Email Templates</h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Professional email templates for job search communications</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Templates List -->
        <div class="lg:col-span-1">
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm overflow-hidden">
            <div :class="isDark ? 'bg-gray-700' : 'bg-indigo-50'" class="p-4 border-b border-gray-700">
              <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="font-bold">Templates</h2>
            </div>
            <div class="divide-y divide-gray-700">
              <button
                v-for="(template, index) in templates"
                :key="index"
                @click="selectedTemplate = index"
                :class="selectedTemplate === index
                  ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-900')
                  : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50')"
                class="w-full text-left px-4 py-3 transition font-medium"
              >
                {{ template.emoji }} {{ template.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Template Editor -->
        <div class="lg:col-span-2">
          <div v-if="templates[selectedTemplate]" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <!-- Template Header -->
            <div class="mb-6">
              <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-2">
                {{ templates[selectedTemplate].emoji }} {{ templates[selectedTemplate].name }}
              </h2>
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm mb-4">
                {{ templates[selectedTemplate].description }}
              </p>
              <div v-if="templates[selectedTemplate].variables.length > 0" :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-900'" class="text-xs rounded p-3 mb-4">
                <strong>Variables:</strong> {{ templates[selectedTemplate].variables.join(', ') }}
                <br/>
                <span class="text-xs opacity-75">Customize by replacing [Variable] with your actual values</span>
              </div>
            </div>

            <!-- Subject Line -->
            <div class="mb-6">
              <label :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="block text-sm font-medium mb-2">Subject Line</label>
              <input
                v-model="editingTemplate.subject"
                type="text"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <!-- Email Body -->
            <div class="mb-6">
              <label :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="block text-sm font-medium mb-2">Email Body</label>
              <textarea
                v-model="editingTemplate.body"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                rows="16"
              ></textarea>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 flex-wrap">
              <button
                @click="copyToClipboard('both')"
                class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                📋 Copy All
              </button>
              <button
                @click="copyToClipboard('subject')"
                :class="isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
                class="flex-1 px-4 py-2 rounded-lg transition font-medium"
              >
                📄 Copy Subject
              </button>
              <button
                @click="copyToClipboard('body')"
                :class="isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
                class="flex-1 px-4 py-2 rounded-lg transition font-medium"
              >
                ✉️ Copy Body
              </button>
              <button
                @click="resetTemplate"
                :class="isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
                class="flex-1 px-4 py-2 rounded-lg transition font-medium"
              >
                🔄 Reset
              </button>
            </div>

            <!-- Copy Confirmation -->
            <div v-if="copyConfirmation" :class="isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-900'" class="mt-4 p-3 rounded-lg text-sm">
              ✅ {{ copyConfirmation }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6 mt-6">
        <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold mb-4">💡 Tips for Success</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Personalize:</strong> Always replace [Name], [Company], and [Position] with actual values
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Keep it Short:</strong> 3-4 paragraphs max for cold emails
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Be Professional:</strong> No typos or grammatical errors
            </p>
          </div>
          <div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              <strong>Add a Call-to-Action:</strong> Always end with what you want them to do
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
const { trackEmailTemplateCopied, trackFeatureView } = useAnalytics()

const selectedTemplate = ref(0)
const copyConfirmation = ref('')

const templates = ref([
  {
    name: 'Job Inquiry',
    emoji: '💼',
    description: 'Reach out to a hiring manager about a specific position',
    variables: ['[Hiring Manager Name]', '[Company]', '[Position]', '[Your Name]', '[Your LinkedIn]'],
    subject: 'Inquiry about [Position] at [Company]',
    body: `Dear [Hiring Manager Name],

I am interested in the [Position] role at [Company] and believe my background aligns well with your team's needs.

With my experience in [Your Skills/Background], I am confident I can contribute meaningfully to your organization. I would appreciate the opportunity to discuss how my expertise could benefit [Company].

Could we schedule a brief call at your convenience?

Best regards,
[Your Name]
[Your Phone]
[Your LinkedIn]`
  },
  {
    name: 'Follow-up After Application',
    emoji: '📨',
    description: 'Follow up after submitting an application',
    variables: ['[Hiring Manager Name]', '[Company]', '[Position]', '[Application Date]', '[Your Name]'],
    subject: 'Following up on [Position] Application at [Company]',
    body: `Hello [Hiring Manager Name],

I submitted my application for the [Position] position at [Company] on [Application Date]. I remain very interested in this opportunity and would love to provide any additional information you might need.

I am excited about the possibility of joining your team and contributing to [Company]'s mission.

Thank you for your consideration.

Best regards,
[Your Name]`
  },
  {
    name: 'Thank You After Interview',
    emoji: '🙏',
    description: 'Send after an interview to reiterate interest',
    variables: ['[Interviewer Name]', '[Company]', '[Position]', '[Specific Topic]', '[Your Name]'],
    subject: 'Thank You for the [Position] Interview - [Your Name]',
    body: `Dear [Interviewer Name],

Thank you for taking the time to speak with me today about the [Position] role at [Company]. I truly enjoyed our conversation about [Specific Topic] and learning more about your team.

I am impressed by [Company]'s commitment to [Something you learned] and am very interested in contributing to your organization.

I look forward to the next steps in the process.

Best regards,
[Your Name]`
  },
  {
    name: 'Networking Message',
    emoji: '🤝',
    description: 'Connect with industry professionals on LinkedIn or via email',
    variables: ['[Name]', '[Their Company/Title]', '[Common Connection/Interest]', '[Your Name]'],
    subject: 'Let\'s Connect - [Your Name] in [Your Field]',
    body: `Hi [Name],

I came across your profile and was impressed by your work at [Their Company/Title]. We share a common interest in [Common Connection/Interest], and I'd love to connect and learn from your experiences.

Would you be open to a brief coffee chat or call in the coming weeks?

Looking forward to connecting.

Best regards,
[Your Name]
[Your LinkedIn URL]`
  },
  {
    name: 'Offer Negotiation',
    emoji: '💰',
    description: 'Professional response to a job offer for negotiation',
    variables: ['[Hiring Manager Name]', '[Company]', '[Position]', '[Concern/Request]', '[Your Name]'],
    subject: '[Position] Offer - [Your Name]',
    body: `Dear [Hiring Manager Name],

Thank you for the offer for the [Position] role at [Company]. I am excited about the opportunity and appreciate your confidence in me.

Before I formally accept, I wanted to discuss [Concern/Request] to ensure we are aligned. I believe this would be beneficial for both parties.

Could we schedule a brief call to discuss this?

Best regards,
[Your Name]`
  },
  {
    name: 'Rejection Follow-up',
    emoji: '💪',
    description: 'Professional response to a rejection to stay on their radar',
    variables: ['[Hiring Manager Name]', '[Company]', '[Position]', '[Your Name]'],
    subject: 'Thank You for the Opportunity - [Position] at [Company]',
    body: `Dear [Hiring Manager Name],

Thank you for considering my application for the [Position] position at [Company]. While I was disappointed to hear the news, I truly appreciate the opportunity to interview with your team.

I remain interested in future opportunities at [Company] and would welcome the chance to stay connected. Please feel free to reach out if a suitable role aligns with my background in the future.

Best regards,
[Your Name]`
  }
])

const editingTemplate = ref({
  subject: templates.value[0].subject,
  body: templates.value[0].body
})

onMounted(async () => {
  await initializeAuth()
  if (!user.value) {
    router.push('/login')
  }
  
  // Track feature view
  trackFeatureView('email_templates')
})

const copyToClipboard = async (type: 'subject' | 'body' | 'both') => {
  let textToCopy = ''
  const templateName = templates.value[selectedTemplate.value]?.name || 'Unknown'
  
  if (type === 'subject') {
    textToCopy = editingTemplate.value.subject
    copyConfirmation.value = 'Subject copied to clipboard! 📋'
  } else if (type === 'body') {
    textToCopy = editingTemplate.value.body
    copyConfirmation.value = 'Email body copied to clipboard! ✉️'
  } else {
    textToCopy = `Subject: ${editingTemplate.value.subject}\n\n${editingTemplate.value.body}`
    copyConfirmation.value = 'Full email copied to clipboard! 📧'
  }
  
  await navigator.clipboard.writeText(textToCopy)
  
  // Track email template copy
  trackEmailTemplateCopied(templateName)
  
  setTimeout(() => {
    copyConfirmation.value = ''
  }, 3000)
}

const resetTemplate = () => {
  editingTemplate.value = {
    subject: templates.value[selectedTemplate.value].subject,
    body: templates.value[selectedTemplate.value].body
  }
  copyConfirmation.value = 'Template reset to original ✨'
  setTimeout(() => {
    copyConfirmation.value = ''
  }, 2000)
}
</script>
