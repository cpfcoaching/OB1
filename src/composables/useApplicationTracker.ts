/**Applications Tracker composable for managing application timeline in Firestore.*/

import { ref, computed } from 'vue'
import { db } from '@/config/firebase'
import {
  collection,
  query,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  Timestamp,
} from 'firebase/firestore'

export interface FollowUp {
  date: string
  type: 'email' | 'call' | 'linkedin' | 'other'
  notes: string
  completed: boolean
}

export interface Application {
  id?: string
  jobId: string
  company: string
  role: string
  appliedDate: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  notes?: string
  followUps: FollowUp[]
  created_at?: any
  updated_at?: any
}

export function useApplicationTracker() {
  const applications = ref<Application[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filterCompany = ref('')
  const searchQuery = ref('')

  // Computed properties
  const filteredApplications = computed(() => {
    return applications.value.filter(app => {
      const matchesCompany = !filterCompany.value || app.company === filterCompany.value
      const matchesSearch = 
        app.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        app.role.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchesCompany && matchesSearch
    })
  })

  const applicationStats = computed(() => ({
    total: applications.value.length,
    needsFollowUp: applications.value.filter(a => {
      const lastFollowUp = a.followUps[a.followUps.length - 1]
      if (!lastFollowUp) return true
      const lastDate = new Date(lastFollowUp.date)
      const daysSince = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysSince >= 7
    }).length,
    withFollowUps: applications.value.filter(a => a.followUps.length > 0).length,
    noContact: applications.value.filter(a => !a.contactEmail && !a.contactPhone).length,
  }))

  const loadApplications = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const appsRef = collection(db, 'resumes/personal/applications')
      const q = query(appsRef, orderBy('appliedDate', 'desc'))
      const snapshot = await getDocs(q)
      
      applications.value = snapshot.docs.map(doc => ({
        ...doc.data() as Application,
        id: doc.id
      }))
      
      return applications.value
    } catch (err: any) {
      error.value = err.message || 'Failed to load applications'
      console.error('Error loading applications:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addApplication = async (appData: Application) => {
    isLoading.value = true
    error.value = null
    
    try {
      const appId = `app_${Date.now()}`
      const app: any = {
        ...appData,
        followUps: appData.followUps || [],
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      }

      await setDoc(doc(db, 'resumes/personal/applications', appId), app)
      
      await loadApplications()
      return appId
    } catch (err: any) {
      error.value = err.message || 'Failed to add application'
      console.error('Error adding application:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateApplication = async (appId: string, updates: Partial<Application>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const appRef = doc(db, 'resumes/personal/applications', appId)
      await updateDoc(appRef, {
        ...updates,
        updated_at: serverTimestamp()
      })
      
      await loadApplications()
    } catch (err: any) {
      error.value = err.message || 'Failed to update application'
      console.error('Error updating application:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteApplication = async (appId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await deleteDoc(doc(db, 'resumes/personal/applications', appId))
      await loadApplications()
    } catch (err: any) {
      error.value = err.message || 'Failed to delete application'
      console.error('Error deleting application:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addFollowUp = async (appId: string, followUp: FollowUp) => {
    try {
      const app = applications.value.find(a => a.id === appId)
      if (!app) throw new Error('Application not found')

      const updatedFollowUps = [...(app.followUps || []), followUp]
      await updateApplication(appId, { followUps: updatedFollowUps })
    } catch (err: any) {
      error.value = err.message || 'Failed to add follow-up'
      console.error('Error adding follow-up:', err)
      throw err
    }
  }

  const updateFollowUp = async (appId: string, followUpIndex: number, updates: Partial<FollowUp>) => {
    try {
      const app = applications.value.find(a => a.id === appId)
      if (!app) throw new Error('Application not found')

      const updatedFollowUps = [...app.followUps]
      updatedFollowUps[followUpIndex] = { ...updatedFollowUps[followUpIndex], ...updates }
      await updateApplication(appId, { followUps: updatedFollowUps })
    } catch (err: any) {
      error.value = err.message || 'Failed to update follow-up'
      console.error('Error updating follow-up:', err)
      throw err
    }
  }

  const deleteFollowUp = async (appId: string, followUpIndex: number) => {
    try {
      const app = applications.value.find(a => a.id === appId)
      if (!app) throw new Error('Application not found')

      const updatedFollowUps = app.followUps.filter((_, i) => i !== followUpIndex)
      await updateApplication(appId, { followUps: updatedFollowUps })
    } catch (err: any) {
      error.value = err.message || 'Failed to delete follow-up'
      console.error('Error deleting follow-up:', err)
      throw err
    }
  }

  return {
    applications,
    filteredApplications,
    applicationStats,
    filterCompany,
    searchQuery,
    isLoading,
    error,
    loadApplications,
    addApplication,
    updateApplication,
    deleteApplication,
    addFollowUp,
    updateFollowUp,
    deleteFollowUp
  }
}
