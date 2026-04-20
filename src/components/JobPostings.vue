<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Job Postings</h2>
      <button @click="showNewForm = true" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
        Add Job Posting
      </button>
    </div>

    <div v-if="showNewForm" class="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
      <h3 class="text-lg font-semibold mb-4">Add New Job Posting</h3>
      <form @submit.prevent="handleAddJobPosting" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input v-model="form.title" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <select v-model="form.level" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">Select level</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>
        <div class="flex space-x-4">
          <button type="submit" class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Save
          </button>
          <button @click="showNewForm = false" type="button" class="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <div v-if="jobPostings.length > 0" class="space-y-4">
      <div v-for="posting in jobPostings" :key="posting.id" class="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-lg transition">
        <h3 class="font-semibold text-gray-900">{{ posting.title }}</h3>
        <p class="text-gray-600 text-sm">{{ posting.level }} • Posted {{ formatDate(posting.postedDate) }}</p>
        <p v-if="posting.salary" class="text-blue-600 text-sm font-medium">{{ posting.salary }}</p>
      </div>
    </div>
    <div v-else class="text-center py-8 text-gray-500">
      No job postings yet. Add one to get started!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/composables/useAuth'
import { useJobHuntFirestore, type JobPosting } from '@/composables/useJobHuntFirestore'

const { user } = useAuth()
const showNewForm = ref(false)
const jobPostings = ref<(JobPosting & { id: string })[]>([])
const form = ref({
  title: '',
  level: '',
  salary: '',
  companyId: '',
})

const formatDate = (timestamp: any) => {
  return formatDistanceToNow(new Date(timestamp.seconds * 1000), { addSuffix: true })
}

const handleAddJobPosting = async () => {
  if (!user.value) return
  
  const firestore = useJobHuntFirestore(user.value.uid)
  await firestore.addJobPosting({
    companyId: form.value.companyId,
    title: form.value.title,
    level: form.value.level,
    salary: form.value.salary,
    location: '',
    postedDate: new Date() as any,
  })

  form.value = { title: '', level: '', salary: '', companyId: '' }
  showNewForm.value = false
  loadJobPostings()
}

const loadJobPostings = async () => {
  if (!user.value) return
  const firestore = useJobHuntFirestore(user.value.uid)
  jobPostings.value = await firestore.getJobPostings()
}

onMounted(loadJobPostings)
</script>
