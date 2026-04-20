/**Interview Prep composable for managing interview preparation.*/

import { ref, computed, onMounted } from 'vue'
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuth } from './useAuth'

export interface InterviewQuestion {
  id?: string
  text: string
  answer?: string
  difficulty?: 'easy' | 'medium' | 'hard' | ''
  category?: string
}

export interface InterviewPrep {
  id?: string
  jobId: string
  company: string
  role: string
  interviewDate?: string
  interviewType?: 'phone' | 'technical' | 'behavioral' | 'panel' | 'other'
  questions: InterviewQuestion[]
  notes?: string
  prepStrategies?: string[]
  companyResearch?: string
  salaryExpectations?: string
  created_at?: Timestamp
  updated_at?: Timestamp
}

export function useInterviewPrep() {
  const { user } = useAuth()

  const interviews = ref<InterviewPrep[]>([])
  const isLoading = ref(false)
  const error = ref('')
  const searchQuery = ref('')

  const loadInterviews = async () => {
    if (!user.value?.uid) return

    try {
      isLoading.value = true
      error.value = ''

      const q = query(
        collection(db, `resumes/personal/interviews`),
        orderBy('created_at', 'desc')
      )

      const snapshot = await getDocs(q)
      interviews.value = snapshot.docs.map(doc => ({
        ...doc.data() as InterviewPrep,
        id: doc.id
      }))
    } catch (err: any) {
      error.value = err.message
      console.error('Error loading interviews:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addInterview = async (interviewData: InterviewPrep) => {
    if (!user.value?.uid) throw new Error('Not authenticated')

    try {
      isLoading.value = true
      error.value = ''

      const docRef = await addDoc(collection(db, 'resumes/personal/interviews'), {
        ...interviewData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      })

      const newInterview = {
        ...interviewData,
        id: docRef.id,
        created_at: new Date() as any,
        updated_at: new Date() as any
      }

      interviews.value.unshift(newInterview)
      return docRef.id
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateInterview = async (interviewId: string, updates: Partial<InterviewPrep>) => {
    if (!user.value?.uid) throw new Error('Not authenticated')

    try {
      isLoading.value = true
      error.value = ''

      const interviewRef = doc(db, 'resumes/personal/interviews', interviewId)
      await updateDoc(interviewRef, {
        ...updates,
        updated_at: serverTimestamp()
      })

      const index = interviews.value.findIndex(i => i.id === interviewId)
      if (index !== -1) {
        interviews.value[index] = { ...interviews.value[index], ...updates }
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteInterview = async (interviewId: string) => {
    if (!user.value?.uid) throw new Error('Not authenticated')

    try {
      isLoading.value = true
      error.value = ''

      await deleteDoc(doc(db, 'resumes/personal/interviews', interviewId))
      interviews.value = interviews.value.filter(i => i.id !== interviewId)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addQuestion = async (interviewId: string, question: InterviewQuestion) => {
    if (!user.value?.uid) throw new Error('Not authenticated')

    try {
      const interviewRef = doc(db, 'resumes/personal/interviews', interviewId)
      const questionWithId = {
        ...question,
        id: `q_${Date.now()}`
      }

      await updateDoc(interviewRef, {
        questions: arrayUnion(questionWithId),
        updated_at: serverTimestamp()
      })

      const index = interviews.value.findIndex(i => i.id === interviewId)
      if (index !== -1) {
        interviews.value[index].questions.push(questionWithId)
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const updateQuestion = async (
    interviewId: string,
    questionId: string,
    updates: Partial<InterviewQuestion>
  ) => {
    if (!user.value?.uid) throw new Error('Not authenticated')

    try {
      const interview = interviews.value.find(i => i.id === interviewId)
      if (!interview) throw new Error('Interview not found')

      const questionIndex = interview.questions.findIndex(q => q.id === questionId)
      if (questionIndex === -1) throw new Error('Question not found')

      const oldQuestion = interview.questions[questionIndex]
      const newQuestion = { ...oldQuestion, ...updates }

      const interviewRef = doc(db, 'resumes/personal/interviews', interviewId)
      await updateDoc(interviewRef, {
        questions: arrayRemove(oldQuestion),
        updated_at: serverTimestamp()
      })

      await updateDoc(interviewRef, {
        questions: arrayUnion(newQuestion)
      })

      interview.questions[questionIndex] = newQuestion
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const deleteQuestion = async (interviewId: string, questionId: string) => {
    if (!user.value?.uid) throw new Error('Not authenticated')

    try {
      const interview = interviews.value.find(i => i.id === interviewId)
      if (!interview) throw new Error('Interview not found')

      const question = interview.questions.find(q => q.id === questionId)
      if (!question) throw new Error('Question not found')

      const interviewRef = doc(db, 'resumes/personal/interviews', interviewId)
      await updateDoc(interviewRef, {
        questions: arrayRemove(question),
        updated_at: serverTimestamp()
      })

      interview.questions = interview.questions.filter(q => q.id !== questionId)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const filteredInterviews = computed(() => {
    if (!searchQuery.value) return interviews.value

    return interviews.value.filter(
      interview =>
        interview.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        interview.role.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  const interviewStats = computed(() => {
    return {
      total: interviews.value.length,
      upcoming: interviews.value.filter(
        i => i.interviewDate && new Date(i.interviewDate) > new Date()
      ).length,
      past: interviews.value.filter(
        i => i.interviewDate && new Date(i.interviewDate) <= new Date()
      ).length,
      withQuestions: interviews.value.filter(i => i.questions && i.questions.length > 0)
        .length,
      totalQuestions: interviews.value.reduce(
        (sum, i) => sum + (i.questions ? i.questions.length : 0),
        0
      )
    }
  })

  return {
    interviews,
    isLoading,
    error,
    searchQuery,
    filteredInterviews,
    interviewStats,
    loadInterviews,
    addInterview,
    updateInterview,
    deleteInterview,
    addQuestion,
    updateQuestion,
    deleteQuestion
  }
}
