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
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { compressToUTF16, decompressFromUTF16 } from 'lz-string'

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

export interface UserContextProfile {
  id?: string
  userId: string
  backgroundSummary: string
  experienceSummary: string
  educationSummary: string
  skills: string[]
  competencies: string[]
  targetRolesInclude: string[]
  targetRolesExclude: string[]
  locationRequirements: string[]
  salaryRequirements: string
  additionalContext: string
  updatedAt: Timestamp
}

export type ResumeSnapshotSource =
  | 'manual-save'
  | 'doc-parse'
  | 'linkedin-import'
  | 'optimization'

export interface ResumeSnapshotRecord {
  id?: string
  userId: string
  source: ResumeSnapshotSource
  compressedResume: string
  compression: 'lz-string-utf16'
  sizeBytes: number
  createdAt: Timestamp
  expiresAt: Timestamp
}

const RESUME_SNAPSHOT_RETENTION_DAYS = 90

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

  // ── Resume snapshots (compressed, 90-day retention) ──────────────────────
  const saveResumeSnapshot = async (
    resumeData: Record<string, unknown>,
    source: ResumeSnapshotSource,
  ) => {
    const serialized = JSON.stringify(resumeData)
    const compressedResume = compressToUTF16(serialized)
    const nowMs = Date.now()
    const expiresAtMs = nowMs + RESUME_SNAPSHOT_RETENTION_DAYS * 24 * 60 * 60 * 1000

    const docRef = await addDoc(collection(db, 'resume_snapshots'), {
      userId,
      source,
      compressedResume,
      compression: 'lz-string-utf16',
      sizeBytes: serialized.length,
      createdAt: Timestamp.fromMillis(nowMs),
      expiresAt: Timestamp.fromMillis(expiresAtMs),
    })

    return docRef.id
  }

  const loadResumeSnapshots = async (maxItems = 30): Promise<Array<ResumeSnapshotRecord & { id: string }>> => {
    const q = query(
      collection(db, 'resume_snapshots'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    )

    const snap = await getDocs(q)
    const nowMs = Date.now()

    return snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as ResumeSnapshotRecord) }))
      .filter((item) => {
        const expires = item.expiresAt?.toMillis?.() ?? 0
        return expires > nowMs
      })
      .slice(0, maxItems) as Array<ResumeSnapshotRecord & { id: string }>
  }

  const loadDecompressedResumeSnapshots = async (maxItems = 10) => {
    const snapshots = await loadResumeSnapshots(maxItems)

    return snapshots.map((snapshot) => {
      const decompressed = decompressFromUTF16(snapshot.compressedResume) || '{}'
      let parsed: Record<string, unknown> = {}

      try {
        parsed = JSON.parse(decompressed) as Record<string, unknown>
      } catch {
        parsed = {}
      }

      return {
        ...snapshot,
        resume: parsed,
      }
    })
  }

  const pruneExpiredResumeSnapshots = async () => {
    const q = query(collection(db, 'resume_snapshots'), where('userId', '==', userId))
    const snap = await getDocs(q)
    const nowMs = Date.now()
    let deleted = 0

    for (const snapshotDoc of snap.docs) {
      const data = snapshotDoc.data() as { expiresAt?: Timestamp }
      const expires = data.expiresAt?.toMillis?.() ?? 0

      if (expires > 0 && expires <= nowMs) {
        await deleteDoc(doc(db, 'resume_snapshots', snapshotDoc.id))
        deleted += 1
      }
    }

    return deleted
  }

  // ── User context profile ──────────────────────────────────────────────────
  const saveUserContextProfile = async (context: Partial<UserContextProfile>) => {
    const ref = doc(db, 'user_context_profiles', userId)
    await setDoc(
      ref,
      {
        userId,
        ...context,
        updatedAt: Timestamp.now(),
      },
      { merge: true },
    )
  }

  const loadUserContextProfile = async (): Promise<UserContextProfile | null> => {
    const ref = doc(db, 'user_context_profiles', userId)
    const snap = await getDoc(ref)

    if (!snap.exists()) {
      return null
    }

    return snap.data() as UserContextProfile
  }

  const deriveAndSaveUserContextFromResume = async (
    resumeData: Record<string, unknown>,
    overrides: Partial<UserContextProfile> = {},
  ) => {
    const summary = String(resumeData.summary || '')
    const skills = Array.isArray(resumeData.skills)
      ? (resumeData.skills as unknown[]).map((s) => String(s).trim()).filter(Boolean)
      : []

    const experienceLines = Array.isArray(resumeData.experience)
      ? (resumeData.experience as Array<Record<string, unknown>>)
          .map((exp) => {
            const role = String(exp.position || '').trim()
            const company = String(exp.company || '').trim()
            if (!role && !company) return ''
            return `${role}${role && company ? ' at ' : ''}${company}`
          })
          .filter(Boolean)
      : []

    const educationLines = Array.isArray(resumeData.education)
      ? (resumeData.education as Array<Record<string, unknown>>)
          .map((edu) => {
            const degree = String(edu.degree || '').trim()
            const school = String(edu.school || '').trim()
            if (!degree && !school) return ''
            return `${degree}${degree && school ? ' - ' : ''}${school}`
          })
          .filter(Boolean)
      : []

    await saveUserContextProfile({
      backgroundSummary: summary,
      experienceSummary: experienceLines.slice(0, 8).join(' | '),
      educationSummary: educationLines.slice(0, 6).join(' | '),
      skills,
      competencies: skills.slice(0, 20),
      targetRolesInclude: [],
      targetRolesExclude: [],
      locationRequirements: [],
      salaryRequirements: '',
      additionalContext: '',
      ...overrides,
    })
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
    saveResumeSnapshot,
    loadResumeSnapshots,
    loadDecompressedResumeSnapshots,
    pruneExpiredResumeSnapshots,
    saveUserContextProfile,
    loadUserContextProfile,
    deriveAndSaveUserContextFromResume,
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
