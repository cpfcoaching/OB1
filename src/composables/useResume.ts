/**Frontend composable for resume management using Firestore.*/

import { ref, computed } from 'vue'
import { db } from '@/config/firebase'
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore'
import { evaluateResume, evaluateLinkedInProfile, compareResumes, type ResumeEvaluation, type LinkedInEvaluation } from '@/lib/openrouter'

export function useResume() {
  // State
  const resume = ref({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: ''
    },
    summary: '',
    experience: [] as Array<{ position: string; company: string; startDate: string; endDate: string; description: string }>,
    education: [] as Array<{ degree: string; school: string; graduationDate: string }>,
    skills: [] as string[]
  })

  const resumeHistory = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // LinkedIn evaluation
  const linkedinData = ref<any>(null)
  const linkedinEvaluation = ref<LinkedInEvaluation | null>(null)
  const isEvaluatingLinkedIn = ref(false)
  
  // Resume evaluation
  const resumeEvaluation = ref<ResumeEvaluation | null>(null)
  const isEvaluatingResume = ref(false)
  
  // Comparison
  const selectedVersions = ref({ v1: null, v2: null })
  const comparisonResult = ref<any>(null)

  // Computed properties
  const hasResume = computed(() => resume.value.personalInfo.fullName?.length > 0)
  const totalSkills = computed(() => resume.value.skills.filter(s => s).length)

  // Save resume
  const saveResume = async (resumeName: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const versionId = `v_${Date.now()}`
      const resumeData = {
        ...resume.value,
        name: resumeName,
        version_id: versionId,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        is_latest: true
      }

      // Save to versions subcollection
      await setDoc(
        doc(db, 'resumes/personal/versions', versionId),
        resumeData
      )

      // Update latest reference
      await setDoc(
        doc(db, 'resumes/personal'),
        {
          latest_version_id: versionId,
          latest_data: resume.value,
          updated_at: serverTimestamp()
        },
        { merge: true }
      )

      await loadResumeHistory()
      return { success: true, versionId }
    } catch (err: any) {
      error.value = err.message || 'Failed to save resume'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Load resume history
  const loadResumeHistory = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const versionsRef = collection(db, 'resumes/personal/versions')
      const q = query(versionsRef, orderBy('created_at', 'desc'))
      const snapshot = await getDocs(q)
      
      resumeHistory.value = snapshot.docs.map(doc => ({
        ...doc.data(),
        version_id: doc.id
      }))
      
      return resumeHistory.value
    } catch (err: any) {
      error.value = err.message || 'Failed to load resume history'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Load specific resume version
  const loadResume = async (versionId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, 'resumes/personal/versions', versionId)
      const snapshot = await getDoc(docRef)
      
      if (snapshot.exists()) {
        const data = snapshot.data()
        resume.value = {
          personalInfo: data.personalInfo,
          summary: data.summary,
          experience: data.experience,
          education: data.education,
          skills: data.skills
        }
        return resume.value
      } else {
        throw new Error('Resume version not found')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load resume'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete resume
  const deleteResume = async (versionId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await deleteDoc(doc(db, 'resumes/personal/versions', versionId))
      await loadResumeHistory()
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete resume'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Create resume from template
  const createFromTemplate = async (name: string, templateType: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const templates: Record<string, any> = {
        standard: {
          personalInfo: { fullName: '', email: '', phone: '', location: '' },
          summary: '',
          experience: [{ position: '', company: '', startDate: '', endDate: '', description: '' }],
          education: [{ degree: '', school: '', graduationDate: '' }],
          skills: ['']
        },
        technical: {
          personalInfo: { fullName: '', email: '', phone: '', location: '' },
          summary: 'Results-driven technical professional with expertise in...',
          experience: [
            { position: 'Senior Developer', company: '', startDate: '', endDate: '', description: 'Led technical initiatives...' }
          ],
          education: [{ degree: 'B.S. Computer Science', school: '', graduationDate: '' }],
          skills: ['JavaScript', 'TypeScript', 'React', 'Python', 'SQL']
        },
        creative: {
          personalInfo: { fullName: '', email: '', phone: '', location: '' },
          summary: 'Creative professional with a passion for innovation...',
          experience: [{ position: '', company: '', startDate: '', endDate: '', description: '' }],
          education: [{ degree: '', school: '', graduationDate: '' }],
          skills: ['Creative Direction', 'Design', 'Communication']
        },
        minimal: {
          personalInfo: { fullName: '', email: '', phone: '', location: '' },
          summary: '',
          experience: [],
          education: [],
          skills: []
        }
      }

      resume.value = templates[templateType] || templates.standard

      // Auto-save template
      await saveResume(`${templateType} - ${name}`)
      return { success: true, data: resume.value }
    } catch (err: any) {
      error.value = err.message || 'Failed to create resume'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Evaluate resume (using OpenRouter AI)
  const evaluateResumeAI = async (jobDescription?: string, roleType: string = 'general') => {
    isEvaluatingResume.value = true
    error.value = null
    
    try {
      const evaluation = await evaluateResume(resume.value, jobDescription || '', roleType)
      resumeEvaluation.value = evaluation

      // Save evaluation to Firestore
      await setDoc(
        doc(db, 'resumes/personal/evaluations', `eval_${Date.now()}`),
        {
          ...evaluation,
          job_description: jobDescription,
          role_type: roleType,
          created_at: serverTimestamp()
        }
      )

      return evaluation
    } catch (err: any) {
      error.value = err.message || 'Failed to evaluate resume'
      console.error('Resume evaluation error:', err)
      throw err
    } finally {
      isEvaluatingResume.value = false
    }
  }

  // Evaluate LinkedIn profile (using OpenRouter AI)
  const evaluateLinkedInProfileAI = async (linkedinUrl: string, profileData: any) => {
    isEvaluatingLinkedIn.value = true
    error.value = null
    
    try {
      const evaluation = await evaluateLinkedInProfile(linkedinUrl, profileData)
      linkedinEvaluation.value = evaluation
      linkedinData.value = profileData

      // Save to Firestore
      await setDoc(
        doc(db, 'resumes/personal/linkedin_evaluations', `linkedin_${Date.now()}`),
        {
          url: linkedinUrl,
          ...evaluation,
          created_at: serverTimestamp()
        }
      )

      return evaluation
    } catch (err: any) {
      error.value = err.message || 'Failed to evaluate LinkedIn profile'
      console.error('LinkedIn evaluation error:', err)
      throw err
    } finally {
      isEvaluatingLinkedIn.value = false
    }
  }

  // Compare resume versions
  const compareResumesAI = async (versionId1: string, versionId2: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const doc1 = await getDoc(doc(db, 'resumes/personal/versions', versionId1))
      const doc2 = await getDoc(doc(db, 'resumes/personal/versions', versionId2))

      if (!doc1.exists() || !doc2.exists()) {
        throw new Error('One or both resume versions not found')
      }

      const data1 = doc1.data()
      const data2 = doc2.data()

      // Use AI to compare
      const comparison = await compareResumes(
        {
          name: data1.name,
          personalInfo: data1.personalInfo,
          summary: data1.summary,
          experience: data1.experience,
          education: data1.education,
          skills: data1.skills
        },
        {
          name: data2.name,
          personalInfo: data2.personalInfo,
          summary: data2.summary,
          experience: data2.experience,
          education: data2.education,
          skills: data2.skills
        }
      )

      comparisonResult.value = {
        version1: { id: versionId1, ...data1 },
        version2: { id: versionId2, ...data2 },
        ...comparison
      }

      return comparisonResult.value
    } catch (err: any) {
      error.value = err.message || 'Failed to compare resumes'
      console.error('Resume comparison error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Helper methods for resume editing
  const addExperience = () => {
    resume.value.experience.push({
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    })
  }

  const removeExperience = (index: number) => {
    resume.value.experience.splice(index, 1)
  }

  const addEducation = () => {
    resume.value.education.push({
      degree: '',
      school: '',
      graduationDate: ''
    })
  }

  const removeEducation = (index: number) => {
    resume.value.education.splice(index, 1)
  }

  const addSkill = () => {
    resume.value.skills.push('')
  }

  const removeSkill = (index: number) => {
    resume.value.skills.splice(index, 1)
  }

  // Load latest resume on mount
  const loadLatestResume = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, 'resumes/personal')
      const snapshot = await getDoc(docRef)
      
      if (snapshot.exists() && snapshot.data().latest_data) {
        resume.value = snapshot.data().latest_data
        return resume.value
      }
      return null
    } catch (err: any) {
      error.value = err.message || 'Failed to load latest resume'
      console.error('Error loading latest resume:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    resume,
    resumeHistory,
    linkedinData,
    linkedinEvaluation,
    resumeEvaluation,
    selectedVersions,
    comparisonResult,
    isLoading,
    isEvaluatingLinkedIn,
    isEvaluatingResume,
    error,
    
    // Computed
    hasResume,
    totalSkills,
    
    // Methods
    saveResume,
    loadResumeHistory,
    loadResume,
    deleteResume,
    createFromTemplate,
    evaluateResumeAI,
    evaluateLinkedInProfileAI,
    compareResumesAI,
    loadLatestResume,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    addSkill,
    removeSkill
  }
}
