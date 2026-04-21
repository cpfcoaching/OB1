/**Composable for crawling web profiles (christophefoulon.com, LinkedIn) via Firecrawl
 * and parsing the result into structured resume data using AI.*/

import { ref } from 'vue'
import axios from 'axios'
import { parseScrapedProfile } from '@/lib/openrouter'
import { auth, db } from '@/config/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export interface CrawledResumeData {
  personalInfo: { fullName: string; email: string; phone: string; location: string }
  summary: string
  experience: Array<{ position: string; company: string; startDate: string; endDate: string; description: string }>
  education: Array<{ degree: string; school: string; graduationDate: string }>
  skills: string[]
}

const FIRECRAWL_API = 'https://api.firecrawl.dev/v1/scrape'

export function useWebCrawl() {
  const isCrawling = ref(false)
  const crawlError = ref('')
  const crawlStatus = ref('')
  const crawledData = ref<CrawledResumeData | null>(null)

  /**Crawl a public profile URL and extract structured resume data.*/
  const crawlProfile = async (url: string): Promise<CrawledResumeData> => {
    isCrawling.value = true
    crawlError.value = ''
    crawledData.value = null

    try {
      const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY
      if (!apiKey) {
        throw new Error('Firecrawl API key not configured. Add VITE_FIRECRAWL_API_KEY to your environment.')
      }

      // Step 1: Scrape the page via Firecrawl REST API
      crawlStatus.value = '🔍 Crawling page...'
      const response = await axios.post(
        FIRECRAWL_API,
        { url, formats: ['markdown'] },
        { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
      )

      const markdown: string = response.data?.data?.markdown || ''
      if (!markdown.trim()) {
        throw new Error('No content found at the provided URL.')
      }

      // Step 2: Parse with AI
      crawlStatus.value = '🤖 Extracting resume data with AI...'
      const parsed = await parseScrapedProfile(markdown)

      crawledData.value = parsed
      crawlStatus.value = '✅ Done'
      return parsed
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || 'Crawl failed'
      crawlError.value = msg
      crawlStatus.value = ''
      throw new Error(msg)
    } finally {
      isCrawling.value = false
    }
  }

  /**Save crawled data to Firestore under the authenticated user's document.*/
  const crawlAndSave = async (url: string): Promise<CrawledResumeData> => {
    const data = await crawlProfile(url)

    try {
      crawlStatus.value = '💾 Saving to database...'
      const uid = auth.currentUser?.uid
      const docPath = uid ? `resumes/${uid}` : 'resumes/personal'
      await setDoc(
        doc(db, docPath),
        {
          latest_data: data,
          crawled_from: url,
          crawled_at: serverTimestamp(),
        },
        { merge: true }
      )
      crawlStatus.value = '✅ Saved'
    } catch (err: any) {
      // Non-fatal: data was still extracted, just not persisted
      console.warn('Could not save crawled data to Firestore:', err.message)
    }

    return data
  }

  return {
    isCrawling,
    crawlError,
    crawlStatus,
    crawledData,
    crawlProfile,
    crawlAndSave,
  }
}
