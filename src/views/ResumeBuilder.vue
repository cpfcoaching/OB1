<template>
  <div :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'" class="min-h-screen">
    <TopBanner />

    <!-- Page Header with Tabs -->
    <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border-b p-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h1 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-1">📝 Resume Builder</h1>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">Create, evaluate & optimize your professional resume</p>
          </div>
          <div class="flex gap-3">
            <button
              @click="autoPopulateFromWeb"
              :disabled="isCrawling"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition font-medium disabled:opacity-50"
            >
              {{ isCrawling ? crawlStatus || '⏳ Crawling...' : '🌐 Update from Web' }}
            </button>
            <button
              @click="downloadPDF"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition font-medium"
            >
              ⬇️ Download PDF
            </button>
          </div>
        </div>
        
        <!-- Tabs -->
        <div class="flex gap-4 border-t pt-4" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <button
            @click="activeTab = 'editor'"
            :class="activeTab === 'editor' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'"
            class="px-4 py-2 font-medium transition"
          >
            ✏️ Editor
          </button>
          <button
            @click="activeTab = 'linkedin'"
            :class="activeTab === 'linkedin' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'"
            class="px-4 py-2 font-medium transition"
          >
            💼 LinkedIn Sync
          </button>
          <button
            @click="activeTab = 'evaluate'"
            :class="activeTab === 'evaluate' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'"
            class="px-4 py-2 font-medium transition"
          >
            ⭐ Evaluate
          </button>
          <button
            @click="activeTab = 'history'"
            :class="activeTab === 'history' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'"
            class="px-4 py-2 font-medium transition"
          >
            📚 History
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto p-6">
      <!-- Editor Tab -->
      <div v-if="activeTab === 'editor'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <!-- Resume Name Input -->
          <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
            <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-bold mb-2">Resume Name (Optional)</label>
            <input v-model="resumenNameInput" type="text" placeholder="e.g., Software Engineer - April 2026"
              :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
              class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 mb-4" />
          </div>

          <!-- Save Button -->
          <button
            @click="handleSaveResume"
            :disabled="isLoading"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition font-medium disabled:opacity-50"
          >
            {{ isLoading ? '⏳ Saving...' : '💾 Save Resume' }}
          </button>
        </div>

        <!-- Preview Panel -->
        <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-8 sticky top-6 h-fit">
          <h2 class="text-xs font-bold uppercase tracking-wider mb-6 text-gray-500">Preview</h2>
          
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
                <p class="text-xs mt-1">{{ exp.description }}</p>
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
              <p class="text-xs">{{ resume.skills.filter(s => s).join(' • ') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- LinkedIn Sync Tab -->
      <div v-if="activeTab === 'linkedin'" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
        <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-6">💼 Import Resume Data</h2>
        
        <!-- Import Methods -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- LinkedIn Import -->
          <div class="space-y-4">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold">🔗 LinkedIn Profile</h3>
            
            <div>
              <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-bold mb-2">LinkedIn Profile URL</label>
              <input v-model="linkedinUrl" type="url" placeholder="https://linkedin.com/in/yourprofile"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            
            <div>
              <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-bold mb-2">Profile Data (JSON)</label>
              <textarea v-model="linkedinJsonData" placeholder="Paste your LinkedIn profile data as JSON..."
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" rows="6"></textarea>
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs mt-2">💡 Steps:
                <br/>1. Open linkedin.com/in/yourprofile
                <br/>2. Open Developer Tools (F12)
                <br/>3. In Console, paste: <code>copy(JSON.stringify({firstName: 'John', lastName: 'Doe'}))</code>
                <br/>4. Paste here
              </p>
            </div>

            <button @click="handleLinkedInImport" :disabled="isImporting || !linkedinJsonData.trim()"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50">
              {{ isImporting ? '⏳ Importing...' : '📥 Import from LinkedIn' }}
            </button>
          </div>

          <!-- Document Import -->
          <div class="space-y-4">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold">📄 Resume Document</h3>
            
            <div>
              <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-bold mb-2">Upload File</label>
              <input 
                ref="fileInput"
                @change="handleDocumentUpload"
                type="file" 
                accept=".txt,.pdf,.docx"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 outline-none" />
              <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-xs mt-2">
                📎 Supported: .txt, .pdf, .docx
              </p>
            </div>

            <div v-if="importError" :class="isDark ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-800'" class="border rounded p-3">
              <p class="text-sm">❌ {{ importError }}</p>
            </div>
          </div>
        </div>

        <!-- Imported Data Preview -->
        <div v-if="importedData" class="mt-8 space-y-4">
          <div :class="isDark ? 'bg-green-900 border-green-700 text-green-200' : 'bg-green-50 border-green-200 text-green-900'" class="border rounded-lg p-4">
            <p class="text-sm font-bold">✅ Successfully extracted resume data!</p>
          </div>

          <!-- Preview Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-if="importedData.personalInfo" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'" class="border rounded p-4">
              <p class="text-sm font-bold mb-2">👤 Personal Info</p>
              <p class="text-xs">{{ importedData.personalInfo.fullName }}</p>
              <p class="text-xs">{{ importedData.personalInfo.email }}</p>
              <p class="text-xs">{{ importedData.personalInfo.phone }}</p>
            </div>

            <div v-if="importedData.experience?.length" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-200'" class="border rounded p-4">
              <p class="text-sm font-bold mb-2">💼 Experience</p>
              <p class="text-xs">{{ importedData.experience.length }} position(s)</p>
              <p class="text-xs">{{ importedData.experience[0]?.company }}</p>
            </div>

            <div v-if="importedData.education?.length" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'" class="border rounded p-4">
              <p class="text-sm font-bold mb-2">🎓 Education</p>
              <p class="text-xs">{{ importedData.education.length }} degree(s)</p>
              <p class="text-xs">{{ importedData.education[0]?.school }}</p>
            </div>

            <div v-if="importedData.skills?.length" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'" class="border rounded p-4">
              <p class="text-sm font-bold mb-2">⚡ Skills</p>
              <p class="text-xs">{{ importedData.skills.length }} skill(s)</p>
              <div class="flex flex-wrap gap-1 mt-2">
                <span v-for="skill in importedData.skills.slice(0, 3)" :key="skill" class="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">{{ skill }}</span>
              </div>
            </div>
          </div>

          <!-- Populate Button -->
          <button @click="populateFromImport"
            class="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
            ✓ Populate Resume with Imported Data
          </button>

          <!-- Clear Button -->
          <button @click="clearImport" class="w-full text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100" :class="isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'">
            Clear
          </button>
        </div>

        <!-- LinkedIn Evaluation Results (Old) -->
        <div v-if="linkedinEvaluation && !importedData" class="mt-8 space-y-4">
          <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-lg font-bold">📊 Evaluation Results</h3>
          
          <div :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'" class="border rounded-lg p-4">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Overall:</span>
                <span class="font-bold">{{ linkedinEvaluation.scores.overall }}/100</span>
              </div>
              <div class="flex justify-between">
                <span>Completeness:</span>
                <span>{{ linkedinEvaluation.scores.completeness }}/100</span>
              </div>
              <div class="flex justify-between">
                <span>Content Quality:</span>
                <span>{{ linkedinEvaluation.scores.content_quality }}/100</span>
              </div>
            </div>
          </div>

          <div v-if="linkedinEvaluation.recommendations && linkedinEvaluation.recommendations.length > 0">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="font-bold mb-2">💡 Recommendations</h3>
            <div v-for="(rec, idx) in linkedinEvaluation.recommendations.slice(0, 3)" :key="idx"
              :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-yellow-50 border-yellow-200'" class="border rounded p-3 mb-2">
              <p class="text-sm font-bold">{{ rec.category }}</p>
              <p class="text-xs mt-1">{{ rec.suggestion }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Evaluate Tab -->
      <div v-if="activeTab === 'evaluate'" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
        <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-6">⭐ Resume Evaluation</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Evaluation Input -->
          <div class="space-y-4">
            <div>
              <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-bold mb-2">Role Type</label>
              <select v-model="roleType"
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="general">General</option>
                <option value="software_engineer">Software Engineer</option>
                <option value="data_scientist">Data Scientist</option>
                <option value="product_manager">Product Manager</option>
              </select>
            </div>

            <div>
              <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-bold mb-2">Target Job Description (Optional)</label>
              <textarea v-model="jobDescription" placeholder="Paste job description to match keywords..."
                :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
                class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" rows="6"></textarea>
            </div>

            <button @click="handleResumeEvaluation" :disabled="isEvaluatingResume"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50">
              {{ isEvaluatingResume ? '⏳ Evaluating...' : '🎯 Evaluate Resume' }}
            </button>
          </div>

          <!-- Evaluation Results -->
          <div v-if="resumeEvaluation" class="space-y-4">
            <div :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'" class="border rounded-lg p-4">
              <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="font-bold mb-3">📊 Resume Scores</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>Overall Score:</span>
                  <span class="font-bold text-lg">{{ resumeEvaluation.scores.overall }}/100</span>
                </div>
                <div class="grid grid-cols-2 gap-2 mt-3">
                  <div>Format: {{ resumeEvaluation.scores.format }}/100</div>
                  <div>Content: {{ resumeEvaluation.scores.content }}/100</div>
                  <div>ATS: {{ resumeEvaluation.scores.ats_optimization }}/100</div>
                  <div>Keywords: {{ resumeEvaluation.scores.keywords }}/100</div>
                </div>
              </div>
            </div>

            <div v-if="resumeEvaluation.recommendations && resumeEvaluation.recommendations.length > 0">
              <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="font-bold mb-2">💡 Top Recommendations</h3>
              <div v-for="(rec, idx) in resumeEvaluation.recommendations.slice(0, 2)" :key="idx"
                :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-orange-50 border-orange-200'" class="border rounded p-3 mb-2">
                <p class="text-sm font-bold">{{ rec.category }}</p>
                <p class="text-xs mt-1">{{ rec.suggestion }}</p>
              </div>
            </div>

            <div v-if="resumeEvaluation.ats_pass_likelihood">
              <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-sm"><strong>ATS Pass Likelihood:</strong> {{ resumeEvaluation.ats_pass_likelihood }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-lg shadow-sm p-6">
        <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-6">📚 Resume History</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Templates -->
          <div class="space-y-4">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="font-bold text-lg">Create from Template</h3>
            <div class="space-y-2">
              <button v-for="template in ['standard', 'technical', 'creative', 'minimal']" :key="template"
                @click="handleCreateFromTemplate(template)"
                :class="isDark ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-blue-50 hover:bg-blue-100 border-blue-200'"
                class="w-full border rounded-lg p-3 text-left font-medium transition capitalize">
                {{ template }}
              </button>
            </div>
          </div>

          <!-- History List -->
          <div class="lg:col-span-2">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="font-bold text-lg mb-4">Your Resumes</h3>
            <div v-if="resumeHistory.length === 0" :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="p-4 text-center">
              No saved resumes yet. Create one using the templates or save the current resume.
            </div>
            <div v-for="(version, idx) in resumeHistory" :key="idx"
              :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'" class="border rounded-lg p-4 mb-3">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-bold">{{ version.name }}</p>
                  <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">{{ formatDate(version.created_at) }}</p>
                  <p v-if="version.is_latest" class="text-xs text-green-600 mt-1">✓ Latest</p>
                </div>
                <div class="flex gap-2">
                  <button @click="handleLoadResume(version.version_id)"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm">Load</button>
                  <button @click="handleDeleteResume(version.version_id)"
                    class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Web Crawl Panel (modal overlay) -->
    <div v-if="showCrawlPanel" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 :class="isDark ? 'text-white' : 'text-gray-900'" class="text-xl font-bold">🌐 Update Resume from Web</h2>
            <button @click="closeCrawlPanel" :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'" class="text-2xl leading-none">×</button>
          </div>

          <!-- URL Input -->
          <div class="mb-4">
            <label :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-1">Profile URL</label>
            <input
              v-model="crawlUrl"
              type="url"
              placeholder="https://yourwebsite.com or https://christophefoulon.com"
              :class="isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
              class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
            />
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-xs mt-1">
              Enter your personal website or any public profile URL. LinkedIn may require authentication.
            </p>
          </div>

          <!-- Crawl Button -->
          <button
            @click="runWebCrawl"
            :disabled="isCrawling || !crawlUrl"
            class="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition mb-4"
          >
            {{ isCrawling ? crawlStatus || '⏳ Crawling...' : '🔍 Crawl & Extract' }}
          </button>

          <!-- Error -->
          <div v-if="crawlError" class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            ❌ {{ crawlError }}
          </div>

          <!-- Extracted Data Preview -->
          <div v-if="crawledData" class="space-y-4">
            <h3 :class="isDark ? 'text-white' : 'text-gray-900'" class="font-semibold">✅ Extracted Data Preview</h3>

            <!-- Personal Info -->
            <div :class="isDark ? 'bg-gray-700' : 'bg-gray-50'" class="rounded-lg p-4">
              <p class="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Personal Info</p>
              <p :class="isDark ? 'text-white' : 'text-gray-900'" class="font-medium">{{ crawledData.personalInfo?.fullName }}</p>
              <p :class="isDark ? 'text-gray-300' : 'text-gray-600'" class="text-sm">{{ crawledData.personalInfo?.email }} · {{ crawledData.personalInfo?.phone }}</p>
              <p :class="isDark ? 'text-gray-300' : 'text-gray-600'" class="text-sm">{{ crawledData.personalInfo?.location }}</p>
            </div>

            <!-- Experience count -->
            <div :class="isDark ? 'bg-gray-700' : 'bg-gray-50'" class="rounded-lg p-4">
              <p class="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Experience</p>
              <p :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="text-sm">{{ crawledData.experience?.length || 0 }} role(s) found</p>
              <ul v-if="crawledData.experience?.length" class="mt-2 space-y-1">
                <li v-for="exp in crawledData.experience" :key="exp.company + exp.position" :class="isDark ? 'text-gray-300' : 'text-gray-600'" class="text-sm">
                  • {{ exp.position }} @ {{ exp.company }} ({{ exp.startDate || '?' }} – {{ exp.endDate || 'present' }})
                </li>
              </ul>
            </div>

            <!-- Skills -->
            <div :class="isDark ? 'bg-gray-700' : 'bg-gray-50'" class="rounded-lg p-4">
              <p class="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Skills ({{ crawledData.skills?.length || 0 }})</p>
              <p :class="isDark ? 'text-gray-300' : 'text-gray-600'" class="text-sm">{{ crawledData.skills?.slice(0, 10).join(', ') }}{{ (crawledData.skills?.length || 0) > 10 ? ` +${(crawledData.skills?.length || 0) - 10} more` : '' }}</p>
            </div>

            <!-- Apply Button -->
            <div class="flex gap-3 pt-2">
              <button
                @click="applyWebCrawlData"
                class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition"
              >
                ✅ Apply to Resume
              </button>
              <button
                @click="closeCrawlPanel"
                :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
                class="flex-1 py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import TopBanner from '@/components/TopBanner.vue'
import { useResume } from '@/composables/useResume'
import { useResumeImport, type ExtractedResumeData } from '@/composables/useResumeImport'
import { useWebCrawl, type CrawledResumeData } from '@/composables/useWebCrawl'

const router = useRouter()
const { user, initializeAuth, isDark } = useAuth()
const {
  resume,
  resumeHistory,
  linkedinEvaluation,
  resumeEvaluation,
  isLoading,
  isEvaluatingLinkedIn,
  isEvaluatingResume,
  error,
  saveResume: apiSaveResume,
  loadResumeHistory,
  loadResume: apiLoadResume,
  deleteResume: apiDeleteResume,
  createFromTemplate: apiCreateTemplate,
  evaluateResumeAI: apiEvaluateResume,
  evaluateLinkedInProfileAI: apiEvaluateLinkedInProfile,
  loadLatestResume,
  addExperience,
  removeExperience,
  addEducation,
  removeEducation,
  addSkill,
  removeSkill
} = useResume()

const { isImporting, importError, extractedData, parseLinkedInData, parseDocumentText, importFromFile } = useResumeImport()
const { isCrawling, crawlError, crawlStatus, crawledData, crawlAndSave } = useWebCrawl()

const activeTab = ref('editor')
const linkedinUrl = ref('')
const linkedinJsonData = ref('')
const jobDescription = ref('')
const roleType = ref('general')
const resumenNameInput = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const importedData = ref<ExtractedResumeData | null>(null)
const isAutoPopulating = ref(false)

// Web crawl state
const showCrawlPanel = ref(false)
const crawlUrl = ref('')

const handleSaveResume = async () => {
  const name = resumenNameInput.value || `Resume - ${new Date().toLocaleDateString()}`
  try {
    await apiSaveResume(name)
    resumenNameInput.value = ''
    alert('✅ Resume saved successfully!')
  } catch (err) {
    alert('❌ Error saving resume: ' + error.value)
  }
}

const autoPopulateFromWeb = () => {
  showCrawlPanel.value = true
}

const runWebCrawl = async () => {
  try {
    await crawlAndSave(crawlUrl.value)
  } catch (err: any) {
    // error shown via crawlError ref
  }
}

const applyWebCrawlData = () => {
  if (!crawledData.value) return
  const data: CrawledResumeData = crawledData.value
  if (data.personalInfo) {
    Object.assign(resume.value.personalInfo, data.personalInfo)
  }
  if (data.summary) {
    resume.value.summary = data.summary
  }
  if (data.experience?.length) {
    resume.value.experience = data.experience.map(exp => ({
      position: exp.position,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description
    }))
  }
  if (data.education?.length) {
    resume.value.education = data.education.map(edu => ({
      degree: edu.degree,
      school: edu.school,
      graduationDate: edu.graduationDate
    }))
  }
  if (data.skills?.length) {
    resume.value.skills = data.skills
  }
  showCrawlPanel.value = false
  activeTab.value = 'editor'
}

const closeCrawlPanel = () => {
  showCrawlPanel.value = false
}

const handleLinkedInImport = async () => {
  try {
    const data = parseLinkedInData(linkedinJsonData.value)
    importedData.value = data
    importError.value = ''
  } catch (err: any) {
    importError.value = err.message
  }
}

const handleDocumentUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    importError.value = ''
    const data = await importFromFile(file)
    importedData.value = data
  } catch (err: any) {
    importError.value = err.message
  }
}

const populateFromImport = () => {
  if (!importedData.value) return

  // Populate personal info
  if (importedData.value.personalInfo) {
    Object.assign(resume.value.personalInfo, importedData.value.personalInfo)
  }

  // Populate summary
  if (importedData.value.summary) {
    resume.value.summary = importedData.value.summary
  }

  // Populate experience
  if (importedData.value.experience && importedData.value.experience.length > 0) {
    resume.value.experience = importedData.value.experience.map(exp => ({
      position: exp.position,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description
    }))
  }

  // Populate education
  if (importedData.value.education && importedData.value.education.length > 0) {
    resume.value.education = importedData.value.education.map(edu => ({
      degree: edu.degree,
      school: edu.school,
      graduationDate: edu.graduationDate
    }))
  }

  // Populate skills
  if (importedData.value.skills && importedData.value.skills.length > 0) {
    resume.value.skills = importedData.value.skills
  }

  alert('✅ Resume populated from imported data!')
  activeTab.value = 'editor'
  clearImport()
}

const clearImport = () => {
  importedData.value = null
  linkedinJsonData.value = ''
  linkedinUrl.value = ''
  importError.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleLinkedInEvaluation = async () => {
  try {
    const profileData = linkedinJsonData.value ? JSON.parse(linkedinJsonData.value) : {}
    await apiEvaluateLinkedInProfile(linkedinUrl.value, profileData)
    alert('✅ LinkedIn profile evaluated!')
  } catch (err) {
    alert('❌ Error evaluating LinkedIn profile: ' + error.value)
  }
}

const populateFromLinkedIn = () => {
  if (linkedinEvaluation.value?.resume_data) {
    Object.assign(resume.value, linkedinEvaluation.value.resume_data)
    alert('✅ Resume populated from LinkedIn!')
  }
}

const handleResumeEvaluation = async () => {
  try {
    await apiEvaluateResume(jobDescription.value, roleType.value)
    alert('✅ Resume evaluated!')
  } catch (err) {
    alert('❌ Error evaluating resume: ' + error.value)
  }
}

const handleLoadResume = async (versionId: string) => {
  try {
    await apiLoadResume(versionId)
    activeTab.value = 'editor'
    alert('✅ Resume loaded!')
  } catch (err) {
    alert('❌ Error loading resume: ' + error.value)
  }
}

const handleDeleteResume = async (versionId: string) => {
  if (confirm('Are you sure you want to delete this resume?')) {
    try {
      await apiDeleteResume(versionId)
      alert('✅ Resume deleted!')
    } catch (err) {
      alert('❌ Error deleting resume: ' + error.value)
    }
  }
}

const handleCreateFromTemplate = async (template: string) => {
  const name = prompt(`Enter name for new ${template} resume:`)
  if (name) {
    try {
      await apiCreateTemplate(name, template)
      activeTab.value = 'editor'
      alert('✅ Resume created from template!')
    } catch (err) {
      alert('❌ Error creating resume from template: ' + error.value)
    }
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}

const downloadPDF = () => {
  alert('📥 PDF download feature coming soon!')
}

onMounted(async () => {
  await initializeAuth()
  if (!user.value) {
    router.push('/login')
  } else {
    // Load latest resume and history from Firestore
    await loadLatestResume()
    await loadResumeHistory()
  }
})
</script>
