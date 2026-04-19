import { ref, computed } from 'vue'
import type { User } from 'firebase/auth'
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { auth, googleProvider, db } from '@/config/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export interface AuthUser extends User {
  mfaEnabled?: boolean
  mfaVerified?: boolean
}

const user = ref<AuthUser | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const isAuthenticated = computed(() => !!user.value)
const isDark = ref(false)

export const useAuth = () => {
  const initializeAuth = async () => {
    loading.value = true
    try {
      await setPersistence(auth, browserLocalPersistence)
      
      return new Promise<void>((resolve) => {
        onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            try {
              const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
              const userData = userDoc.data()
              user.value = {
                ...currentUser,
                mfaEnabled: userData?.mfaEnabled || false,
                mfaVerified: userData?.mfaVerified || false,
              }
            } catch (err) {
              // Firestore not ready yet - just set user without extra data
              user.value = currentUser
              console.warn('Firestore not available during auth init:', err)
            }
          } else {
            user.value = null
          }
          loading.value = false
          resolve()
        })
      })
    } catch (err) {
      error.value = String(err)
      loading.value = false
    }
  }

  const signInWithGoogle = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await signInWithPopup(auth, googleProvider)
      
      // Try to create user document, but don't fail if Firestore isn't ready
      try {
        const userRef = doc(db, 'users', result.user.uid)
        const userDoc = await getDoc(userRef)
        
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            createdAt: new Date(),
            mfaEnabled: false,
            mfaVerified: false,
          })
        }
      } catch (firestoreErr) {
        // Firestore not ready - continue anyway with auth
        console.warn('Could not save user to Firestore:', firestoreErr)
      }
      
      user.value = result.user
      loading.value = false
      return result.user
    } catch (err) {
      error.value = String(err)
      loading.value = false
      throw err
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await signOut(auth)
      user.value = null
      loading.value = false
    } catch (err) {
      error.value = String(err)
      loading.value = false
    }
  }

  // MFA/TOTP Functions (MVP - simplified)
  const generateMFASecret = async (email: string) => {
    // For MVP, return placeholder data
    // Full implementation uses speakeasy (requires backend)
    return {
      secret: 'JBSWY3DPEBLW64TMMQ======',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      backupCodes: ['BACKUP-001', 'BACKUP-002', 'BACKUP-003'],
    }
  }

  const verifyMFAToken = (token: string): boolean => {
    // For MVP, accept any 6-digit code
    // Full implementation uses speakeasy.totp.verify
    return token.length === 6 && /^\d+$/.test(token)
  }

  const enableMFA = async () => {
    if (!user.value) throw new Error('User not authenticated')
    
    try {
      const userRef = doc(db, 'users', user.value.uid)
      await setDoc(
        userRef,
        {
          mfaEnabled: true,
          mfaEnabledAt: new Date(),
        },
        { merge: true }
      )
      
      if (user.value) {
        user.value.mfaEnabled = true
      }
    } catch (err) {
      console.warn('Could not update MFA settings:', err)
      // Continue anyway - don't block on Firestore errors
    }
  }

  const disableMFA = async () => {
    if (!user.value) throw new Error('User not authenticated')
    
    try {
      const userRef = doc(db, 'users', user.value.uid)
      await setDoc(
        userRef,
        {
          mfaEnabled: false,
          mfaVerified: false,
        },
        { merge: true }
      )
      
      if (user.value) {
        user.value.mfaEnabled = false
        user.value.mfaVerified = false
      }
    } catch (err) {
      console.warn('Could not update MFA settings:', err)
      // Continue anyway - don't block on Firestore errors
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isDark,
    initializeAuth,
    signInWithGoogle,
    logout,
    generateMFASecret,
    verifyMFAToken,
    enableMFA,
    disableMFA,
  }
}
