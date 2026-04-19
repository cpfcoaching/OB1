<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Job Contacts</h2>
      <button @click="showNewForm = true" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
        Add Contact
      </button>
    </div>

    <div v-if="showNewForm" class="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
      <h3 class="text-lg font-semibold mb-4">Add New Contact</h3>
      <form @submit.prevent="handleAddContact" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input v-model="form.name" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input v-model="form.title" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
          <input v-model="form.linkedIn" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
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

    <div v-if="contacts.length > 0" class="space-y-3">
      <div v-for="contact in contacts" :key="contact.id" class="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-lg transition">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-gray-900">{{ contact.name }}</h3>
            <p class="text-gray-600 text-sm">{{ contact.title }}</p>
            <div class="mt-2 space-y-1">
              <a :href="`mailto:${contact.email}`" class="text-blue-600 text-sm hover:underline block">
                {{ contact.email }}
              </a>
              <a v-if="contact.linkedIn" :href="contact.linkedIn" target="_blank" class="text-blue-600 text-sm hover:underline block">
                View LinkedIn
              </a>
            </div>
          </div>
          <button @click="deleteContact(contact.id!)" class="text-red-600 hover:text-red-700 text-sm font-medium">
            Delete
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-8 text-gray-500">
      No contacts yet. Build your network!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useJobHuntFirestore, type JobContact } from '@/composables/useJobHuntFirestore'

const { user } = useAuth()
const showNewForm = ref(false)
const contacts = ref<(JobContact & { id: string })[]>([])
const form = ref({
  name: '',
  title: '',
  email: '',
  phone: '',
  linkedIn: '',
  companyId: '',
})

const handleAddContact = async () => {
  if (!user.value) return
  
  const firestore = useJobHuntFirestore(user.value.uid)
  await firestore.addJobContact({
    companyId: form.value.companyId,
    name: form.value.name,
    title: form.value.title,
    email: form.value.email,
    phone: form.value.phone,
    linkedIn: form.value.linkedIn,
  })

  form.value = { name: '', title: '', email: '', phone: '', linkedIn: '', companyId: '' }
  showNewForm.value = false
  loadContacts()
}

const deleteContact = async (contactId: string) => {
  if (!user.value) return
  // TODO: Implement delete in Firestore service
  loadContacts()
}

const loadContacts = async () => {
  if (!user.value) return
  const firestore = useJobHuntFirestore(user.value.uid)
  contacts.value = await firestore.getJobContacts()
}

onMounted(loadContacts)
</script>
