/**Job Tracker composable for managing job applications in Firestore.*/

import { ref, computed } from 'vue'
import { db } from '@/config/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  Query,
} from 'firebase/firestore'

export interface Job {
  id?: string
  company: string
  role: string
  dateApplied: string
  status: 'Applied' | 'Interviewed' | 'Offer' | 'Rejected'
  link?: string
  notes?: string
  salary?: string
  location?: string
  created_at?: any
  updated_at?: any
}

export function useJobTracker() {
  const jobs = ref<Job[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filterStatus = ref<'All' | 'Applied' | 'Interviewed' | 'Offer' | 'Rejected'>('All')
  const searchQuery = ref('')

  // Computed properties
  const filteredJobs = computed(() => {
    return jobs.value.filter(job => {
      const matchesStatus = filterStatus.value === 'All' || job.status === filterStatus.value
      const matchesSearch = 
        job.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        job.role.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchesStatus && matchesSearch
    })
  })

  const jobStats = computed(() => ({
    total: jobs.value.length,
    applied: jobs.value.filter(j => j.status === 'Applied').length,
    interviewed: jobs.value.filter(j => j.status === 'Interviewed').length,
    offers: jobs.value.filter(j => j.status === 'Offer').length,
    rejected: jobs.value.filter(j => j.status === 'Rejected').length,
  }))

  const loadJobs = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const jobsRef = collection(db, 'resumes/personal/jobs')
      const q = query(jobsRef, orderBy('dateApplied', 'desc'))
      const snapshot = await getDocs(q)
      
      jobs.value = snapshot.docs.map(doc => ({
        ...doc.data() as Job,
        id: doc.id
      }))
      
      return jobs.value
    } catch (err: any) {
      error.value = err.message || 'Failed to load jobs'
      console.error('Error loading jobs:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addJob = async (jobData: Job) => {
    isLoading.value = true
    error.value = null
    
    try {
      const jobId = `job_${Date.now()}`
      const job: any = {
        ...jobData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      }

      await setDoc(doc(db, 'resumes/personal/jobs', jobId), job)
      
      await loadJobs()
      return jobId
    } catch (err: any) {
      error.value = err.message || 'Failed to add job'
      console.error('Error adding job:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateJob = async (jobId: string, updates: Partial<Job>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const jobRef = doc(db, 'resumes/personal/jobs', jobId)
      await updateDoc(jobRef, {
        ...updates,
        updated_at: serverTimestamp()
      })
      
      await loadJobs()
    } catch (err: any) {
      error.value = err.message || 'Failed to update job'
      console.error('Error updating job:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteJob = async (jobId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await deleteDoc(doc(db, 'resumes/personal/jobs', jobId))
      await loadJobs()
    } catch (err: any) {
      error.value = err.message || 'Failed to delete job'
      console.error('Error deleting job:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateJobStatus = async (jobId: string, newStatus: Job['status']) => {
    return updateJob(jobId, { status: newStatus })
  }

  return {
    jobs,
    filteredJobs,
    jobStats,
    filterStatus,
    searchQuery,
    isLoading,
    error,
    loadJobs,
    addJob,
    updateJob,
    deleteJob,
    updateJobStatus
  }
}
