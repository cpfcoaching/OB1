import { db } from '@/config/firebase'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore'

export interface Company {
  id?: string
  userId: string
  name: string
  industry: string
  size: string
  location: string
  website?: string
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface JobPosting {
  id?: string
  userId: string
  companyId: string
  title: string
  level: string
  salary?: string
  location: string
  url?: string
  postedDate: Timestamp
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Application {
  id?: string
  userId: string
  postingId: string
  companyId: string
  appliedDate: Timestamp
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn'
  resumeVersion?: string
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Interview {
  id?: string
  userId: string
  applicationId: string
  companyId: string
  type: 'phone' | 'video' | 'in-person' | 'panel'
  scheduledAt: Timestamp
  notes?: string
  feedbackReceived?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface JobContact {
  id?: string
  userId: string
  companyId: string
  name: string
  title: string
  email: string
  phone?: string
  linkedIn?: string
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const useJobHuntFirestore = (userId: string) => {
  // Companies
  const addCompany = async (data: Omit<Company, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const docRef = await addDoc(collection(db, 'companies'), {
      ...data,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  }

  const updateCompany = async (companyId: string, data: Partial<Company>) => {
    const ref = doc(db, 'companies', companyId)
    await updateDoc(ref, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  }

  const getCompanies = async () => {
    const q = query(collection(db, 'companies'), where('userId', '==', userId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (Company & { id: string })[]
  }

  // Job Postings
  const addJobPosting = async (data: Omit<JobPosting, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const docRef = await addDoc(collection(db, 'job_postings'), {
      ...data,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  }

  const getJobPostings = async () => {
    const q = query(collection(db, 'job_postings'), where('userId', '==', userId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (JobPosting & { id: string })[]
  }

  // Applications
  const addApplication = async (data: Omit<Application, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const docRef = await addDoc(collection(db, 'applications'), {
      ...data,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  }

  const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    const ref = doc(db, 'applications', applicationId)
    await updateDoc(ref, {
      status,
      updatedAt: Timestamp.now(),
    })
  }

  const getApplications = async () => {
    const q = query(collection(db, 'applications'), where('userId', '==', userId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (Application & { id: string })[]
  }

  // Interviews
  const addInterview = async (data: Omit<Interview, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const docRef = await addDoc(collection(db, 'interviews'), {
      ...data,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  }

  const getInterviews = async () => {
    const q = query(collection(db, 'interviews'), where('userId', '==', userId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (Interview & { id: string })[]
  }

  // Job Contacts
  const addJobContact = async (data: Omit<JobContact, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const docRef = await addDoc(collection(db, 'job_contacts'), {
      ...data,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  }

  const getJobContacts = async (companyId?: string) => {
    let q
    if (companyId) {
      q = query(
        collection(db, 'job_contacts'),
        where('userId', '==', userId),
        where('companyId', '==', companyId)
      )
    } else {
      q = query(collection(db, 'job_contacts'), where('userId', '==', userId))
    }
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (JobContact & { id: string })[]
  }

  // Pipeline Overview
  const getPipelineOverview = async () => {
    const applications = await getApplications()
    const interviews = await getInterviews()
    
    const stats = {
      total: applications.length,
      applied: applications.filter(a => a.status === 'applied').length,
      interviewing: applications.filter(a => a.status === 'interviewing').length,
      offered: applications.filter(a => a.status === 'offered').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      upcomingInterviews: interviews.filter(i => i.scheduledAt > Timestamp.now()).length,
    }

    return stats
  }

  // ── Recommendation filter preferences ────────────────────────────────────
  type OutcomeType = 'saved' | 'ignored' | 'applied' | 'interview'

  const saveFilterPreferences = async (filters: Record<string, unknown>) => {
    const ref = doc(db, 'recommendation_filters', userId)
    await setDoc(ref, { overrides: filters, updatedAt: Timestamp.now() }, { merge: true })
  }

  const loadFilterPreferences = async (): Promise<Record<string, unknown> | null> => {
    const ref = doc(db, 'recommendation_filters', userId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return (snap.data()?.overrides as Record<string, unknown>) ?? null
  }

  // ── Recommendation outcomes ───────────────────────────────────────────────
  const saveRecommendationOutcome = async (listingId: string, outcome: OutcomeType) => {
    await addDoc(collection(db, 'recommendation_outcomes'), {
      userId,
      listingId,
      outcome,
      recordedAt: Timestamp.now(),
    })
  }

  const loadRecommendationOutcomes = async () => {
    const q = query(collection(db, 'recommendation_outcomes'), where('userId', '==', userId))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Array<{
      id: string; userId: string; listingId: string; outcome: OutcomeType; recordedAt: Timestamp
    }>
  }

  // ── Ranking weights ───────────────────────────────────────────────────────
  const saveRankingWeights = async (weights: Record<string, unknown>) => {
    const ref = doc(db, 'ranking_weights', userId)
    await setDoc(ref, { ...weights, updatedAt: Timestamp.now() }, { merge: true })
  }

  const loadRankingWeights = async (): Promise<Record<string, unknown> | null> => {
    const ref = doc(db, 'ranking_weights', userId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return snap.data() as Record<string, unknown>
  }

  // ── Resume storage ────────────────────────────────────────────────────────
  const saveResume = async (resumeData: Record<string, unknown>) => {
    const ref = doc(db, 'resumes', userId)
    await setDoc(ref, { ...resumeData, updatedAt: Timestamp.now() }, { merge: true })
  }

  const loadResume = async (): Promise<Record<string, unknown> | null> => {
    const ref = doc(db, 'resumes', userId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return snap.data() as Record<string, unknown>
  }

  return {
    saveFilterPreferences,
    loadFilterPreferences,
    saveRecommendationOutcome,
    loadRecommendationOutcomes,
    saveRankingWeights,
    loadRankingWeights,
    saveResume,
    loadResume,
    addCompany,
    updateCompany,
    getCompanies,
    addJobPosting,
    getJobPostings,
    addApplication,
    updateApplicationStatus,
    getApplications,
    addInterview,
    getInterviews,
    addJobContact,
    getJobContacts,
    getPipelineOverview,
  }
}
