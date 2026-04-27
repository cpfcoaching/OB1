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
                <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-2">Profile Data (JSON)</label>
                <textarea
                  v-model="linkedinJsonData"
                  placeholder="Paste your LinkedIn profile data as JSON here..."
                  :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                  class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                  rows="8"
                ></textarea>
              </div>
              
              <div :class="isDark ? 'bg-gray-600 border-gray-500' : 'bg-blue-50 border-blue-200'" class="border rounded p-4 text-xs space-y-2">
                <p :class="isDark ? 'text-gray-200' : 'text-gray-700'" class="font-semibold mb-2">📋 How to Export LinkedIn Data:</p>
                <ol :class="isDark ? 'text-gray-300' : 'text-gray-600'" class="list-decimal list-inside space-y-1">
                  <li>Go to your LinkedIn profile: linkedin.com/in/yourprofile/</li>
                  <li>Click <strong>"More"</strong> (three dots) and select <strong>"Download your data"</strong></li>
                  <li>Or, open Developer Tools <code class="bg-gray-900 text-green-400 px-1">F12 → Console</code></li>
                  <li>Copy the profile data as JSON and paste it here</li>
                </ol>
                <p :class="isDark ? 'text-gray-300' : 'text-gray-600'" class="mt-3 text-xs">
                  <strong>Example format:</strong>
                  <code class="block bg-gray-900 text-green-400 px-2 py-1 rounded mt-1 overflow-x-auto">
{{ '{' }}"firstName":"John","lastName":"Doe","email":"john@example.com","skills":["JavaScript","React"]{{ '}' }}
                  </code>
                </p>
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
              <div>
                <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-2">Upload PDF or DOCX</label>
                <input
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  :disabled="isLoadingDocument"
                  :class="isDark ? 'bg-gray-600 text-white border-gray-500 file:bg-indigo-500 file:text-white' : 'bg-white text-gray-900 border-gray-300 file:bg-indigo-600 file:text-white'"
                  class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 file:border-0 file:rounded file:px-3 file:py-2 file:mr-3 file:cursor-pointer"
                  @change="handleResumeFileSelection"
                />
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="mt-2 text-xs">
                  Select a resume file and the app will extract text automatically before filling the form.
                </p>
                <p v-if="selectedResumeFileName" :class="isDark ? 'text-indigo-300' : 'text-indigo-700'" class="mt-1 text-xs font-medium">
                  Selected file: {{ selectedResumeFileName }}
                </p>
              </div>

              <div>
                <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-2">Paste Resume Content</label>
                <textarea
                  v-model="resumeText"
                  placeholder="Upload a PDF/DOCX above or paste your resume text here. The app will automatically extract sections like experience, education, and skills..."
                  :class="isDark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'"
                  class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                  rows="8"
                ></textarea>
              </div>
              
              <div :class="isDark ? 'bg-gray-600 border-gray-500' : 'bg-amber-50 border-amber-200'" class="border rounded p-4 text-xs space-y-2">
                <p :class="isDark ? 'text-gray-200' : 'text-gray-700'" class="font-semibold mb-2">📋 How to Export Your Resume:</p>
                <div :class="isDark ? 'text-gray-300' : 'text-gray-600'" class="space-y-2">
                  <div>
                    <p class="font-semibold">From PDF:</p>
                    <p>1. Select the PDF above, or paste the text manually if needed</p>
                    <p>2. The app extracts the text and maps it into resume fields automatically</p>
                  </div>
                  <div>
                    <p class="font-semibold">From Word (.docx):</p>
                    <p>1. Select the DOCX above, or paste the text manually if needed</p>
                    <p>2. The app extracts the text and maps it into resume fields automatically</p>
                  </div>
                  <div>
                    <p class="font-semibold">Fallback:</p>
                    <p>If a file is image-only or heavily formatted, paste the text manually and parse it below.</p>
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

              <div
                v-if="hasLinkedInContext(linkedInContext)"
                :class="isDark ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-700'"
                class="border rounded px-4 py-3 text-sm"
              >
                LinkedIn context is active and will enrich parsed resume data.
              </div>
              
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

          <!-- User Context Profile -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold">🧠 Resume Context Profile</h2>
              <button
                @click="saveUserContextProfileOnly"
                :disabled="isSavingContext"
                :class="isSavingContext ? 'bg-gray-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'"
                class="text-white px-3 py-1 rounded text-sm transition"
              >
                {{ isSavingContext ? 'Saving...' : 'Save Context' }}
              </button>
            </div>

            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs mb-4">
              This context is stored with your profile and used when generating or optimizing future resumes.
            </p>

            <div class="space-y-3">
              <textarea
                v-model="userContextDraft.targetRolesInclude"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                rows="2"
                placeholder="Target roles (comma or newline separated): e.g. Director of Security, vCISO"
              ></textarea>

              <textarea
                v-model="userContextDraft.targetRolesExclude"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                rows="2"
                placeholder="Roles to avoid: e.g. Individual contributor SOC analyst"
              ></textarea>

              <textarea
                v-model="userContextDraft.locationRequirements"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                rows="2"
                placeholder="Location requirements: remote only, NYC hybrid, travel limits"
              ></textarea>

              <input
                v-model="userContextDraft.salaryRequirements"
                type="text"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Salary requirements (optional): e.g. $230k+ base"
              />

              <textarea
                v-model="userContextDraft.competencies"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                rows="2"
                placeholder="Core competencies: zero trust, HIPAA, risk governance, board communication"
              ></textarea>

              <textarea
                v-model="userContextDraft.additionalContext"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
                placeholder="Additional context: role strategy, career direction, industries to prioritize"
              ></textarea>

              <div v-if="contextError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                ❌ {{ contextError }}
              </div>

              <div v-if="contextSuccess" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
                ✅ {{ contextSuccess }}
              </div>
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
import { useJobHuntFirestore, type ResumeSnapshotSource, type UserContextProfile } from '@/composables/useJobHuntFirestore'
import TopBanner from '@/components/TopBanner.vue'
import {
  enrichResumeWithLinkedInContext,
  hasLinkedInContext,
  linkedInContextStats,
  parseLinkedInData,
  summarizeMergeDelta,
  type ResumeData,
} from '@/utils/linkedinParser'
import { extractResumeSections, extractTextFromResumeFile } from '@/utils/documentParser'

const router = useRouter()
const { user, initializeAuth, isDark } = useAuth()
const { trackResumeBuilt, trackResumeSaved, trackFeatureView } = useAnalytics()

// LinkedIn import state
const linkedinUrl = ref('')
const linkedinJsonData = ref('')
const isLoadingLinkedin = ref(false)
const linkedinError = ref('')
const linkedinSuccess = ref('')
const linkedInContext = ref<Partial<ResumeData> | null>(null)

// Document import state
const resumeText = ref('')
const selectedResumeFileName = ref('')
const isLoadingDocument = ref(false)
const documentError = ref('')
const documentSuccess = ref('')
const isSavingContext = ref(false)
const contextError = ref('')
const contextSuccess = ref('')

const userContextDraft = ref({
  targetRolesInclude: '',
  targetRolesExclude: '',
  locationRequirements: '',
  salaryRequirements: '',
  competencies: '',
  additionalContext: '',
})

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

const splitListInput = (value: string) =>
  value
    .split(/[\n,;|]/g)
    .map((item) => item.trim())
    .filter(Boolean)

const getFirestoreClient = () => {
  if (!user.value?.uid) {
    return null
  }

  return useJobHuntFirestore(user.value.uid)
}

const persistResumeMemory = async (source: ResumeSnapshotSource) => {
  const client = getFirestoreClient()

  if (!client) {
    return
  }

  const resumePayload = JSON.parse(JSON.stringify(resume.value)) as Record<string, unknown>

  await client.saveResume(resumePayload)
  await client.saveResumeSnapshot(resumePayload, source)
  await client.pruneExpiredResumeSnapshots()

  await client.deriveAndSaveUserContextFromResume(resumePayload, {
    targetRolesInclude: splitListInput(userContextDraft.value.targetRolesInclude),
    targetRolesExclude: splitListInput(userContextDraft.value.targetRolesExclude),
    locationRequirements: splitListInput(userContextDraft.value.locationRequirements),
    salaryRequirements: userContextDraft.value.salaryRequirements.trim(),
    competencies: splitListInput(userContextDraft.value.competencies),
    additionalContext: userContextDraft.value.additionalContext.trim(),
  })
}

const saveUserContextProfileOnly = async () => {
  contextError.value = ''
  contextSuccess.value = ''
  isSavingContext.value = true

  try {
    const client = getFirestoreClient()

    if (!client) {
      contextError.value = 'Sign in to save your context profile to cloud storage.'
      return
    }

    await client.saveUserContextProfile({
      targetRolesInclude: splitListInput(userContextDraft.value.targetRolesInclude),
      targetRolesExclude: splitListInput(userContextDraft.value.targetRolesExclude),
      locationRequirements: splitListInput(userContextDraft.value.locationRequirements),
      salaryRequirements: userContextDraft.value.salaryRequirements.trim(),
      competencies: splitListInput(userContextDraft.value.competencies),
      additionalContext: userContextDraft.value.additionalContext.trim(),
    })

    contextSuccess.value = 'Saved context profile preferences.'
  } catch (error) {
    contextError.value = error instanceof Error ? error.message : 'Unable to save context profile.'
  } finally {
    isSavingContext.value = false
  }
}

const saveResume = async () => {
  localStorage.setItem('resume', JSON.stringify(resume.value))

  try {
    await persistResumeMemory('manual-save')
  } catch (error) {
    console.warn('Unable to persist resume memory to Firestore:', error)
  }
  
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

// LinkedIn import handler
const importFromLinkedIn = async () => {
  linkedinError.value = ''
  linkedinSuccess.value = ''
  isLoadingLinkedin.value = true
  
  try {
    const parsedData = parseLinkedInData(linkedinJsonData.value)
    
    if (!parsedData) {
      linkedinError.value = 'Failed to parse LinkedIn data. Please check the JSON format and try again.'
      return
    }

    linkedInContext.value = parsedData
    const beforeMerge = JSON.parse(JSON.stringify(resume.value)) as ResumeData
    const mergedResume = enrichResumeWithLinkedInContext(resume.value as ResumeData, parsedData)
    const delta = summarizeMergeDelta(beforeMerge, mergedResume)
    
    // Merge the parsed data with current resume
    resume.value = mergedResume
    
    const stats = linkedInContextStats(parsedData)
    linkedinSuccess.value = `✅ LinkedIn context loaded (${stats.skillCount} skills, ${stats.experienceCount} experiences, ${stats.educationCount} education). Merge added ${delta.skillsAdded} skills, ${delta.experienceAdded} experiences, and ${delta.educationAdded} education entries.`

    try {
      await persistResumeMemory('linkedin-import')
    } catch (persistError) {
      console.warn('Unable to persist LinkedIn context snapshot:', persistError)
    }
    
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

const handleResumeFileSelection = async (event: Event) => {
  documentError.value = ''
  documentSuccess.value = ''

  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    selectedResumeFileName.value = ''
    return
  }

  selectedResumeFileName.value = file.name
  isLoadingDocument.value = true

  try {
    const extractedText = await extractTextFromResumeFile(file)

    if (!extractedText) {
      throw new Error('No readable text was found in that file.')
    }

    resumeText.value = extractedText
    documentSuccess.value = `Extracted text from ${file.name}. Review or parse it below.`
  } catch (error) {
    documentError.value = error instanceof Error ? error.message : 'Error extracting resume file'
    selectedResumeFileName.value = ''
  } finally {
    input.value = ''
    isLoadingDocument.value = false
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
    const parsedResume = JSON.parse(JSON.stringify(resume.value)) as ResumeData
    
    // Update resume with extracted data
    if (sections.summary) {
      parsedResume.summary = sections.summary
    }
    
    if (sections.experience && sections.experience.length > 0) {
      parsedResume.experience = sections.experience.map((exp) => ({
        position: exp.position || '',
        company: exp.company || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || ''
      }))
    }
    
    if (sections.education && sections.education.length > 0) {
      parsedResume.education = sections.education.map((edu) => ({
        degree: edu.degree || '',
        school: edu.school || '',
        graduationDate: edu.graduationDate || ''
      }))
    }
    
    if (sections.skills && sections.skills.length > 0) {
      parsedResume.skills = sections.skills
    }

    const finalResume = hasLinkedInContext(linkedInContext.value)
      ? enrichResumeWithLinkedInContext(parsedResume, linkedInContext.value || {})
      : parsedResume

    const delta = summarizeMergeDelta(parsedResume, finalResume)
    resume.value = finalResume
    
    const skillCount = sections.skills?.length || 0
    const expCount = sections.experience?.length || 0
    const eduCount = sections.education?.length || 0
    
    documentSuccess.value = hasLinkedInContext(linkedInContext.value)
      ? `✅ Parsed base resume and applied LinkedIn context. Found ${skillCount} skills, ${expCount} experiences, ${eduCount} education entries. Context added ${delta.skillsAdded} skills, ${delta.experienceAdded} experiences, and ${delta.educationAdded} education entries.`
      : `✅ Successfully parsed! Found ${skillCount} skills, ${expCount} experiences, ${eduCount} education entries.`

    try {
      await persistResumeMemory('doc-parse')
    } catch (persistError) {
      console.warn('Unable to persist parsed resume snapshot:', persistError)
    }
    
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

  const client = getFirestoreClient()
  if (client) {
    try {
      const cloudResume = await client.loadResume()
      if (cloudResume) {
        resume.value = {
          ...resume.value,
          ...cloudResume,
        } as typeof resume.value
      }

      const contextProfile = await client.loadUserContextProfile()
      if (contextProfile) {
        userContextDraft.value = {
          targetRolesInclude: (contextProfile.targetRolesInclude || []).join('\n'),
          targetRolesExclude: (contextProfile.targetRolesExclude || []).join('\n'),
          locationRequirements: (contextProfile.locationRequirements || []).join('\n'),
          salaryRequirements: contextProfile.salaryRequirements || '',
          competencies: (contextProfile.competencies || []).join('\n'),
          additionalContext: contextProfile.additionalContext || '',
        }
      }
    } catch (error) {
      console.warn('Unable to load cloud resume/context profile:', error)
    }
  }
  
  // Track feature view
  trackFeatureView('resume_builder')
})
</script>
