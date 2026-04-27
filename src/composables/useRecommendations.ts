/**
 * useRecommendations
 *
 * Central orchestrator for resume-driven job recommendations.
 *
 * Flow:
 *   1. Load the user's default resume from Firestore
 *   2. Extract search signals (roles, skills, seniority, location, pay hints)
 *   3. Load user filter overrides from Firestore
 *   4. Merge: user overrides > resume-derived defaults > global defaults
 *   5. Fetch listings via the JobSpy adapter
 *   6. Load ranking weights from Firestore
 *   7. Score and rank listings
 *   8. Expose outcome recording (save, ignore, apply, interview)
 *      so that weekly weight updates can be driven by real signals
 */

import { ref } from 'vue'
import { fetchListings, GLOBAL_FILTER_DEFAULTS } from '@/adapters/jobspyAdapter'
import type { RecommendationFilter } from '@/adapters/jobspyAdapter'
import {
  scoreListings,
  loadWeights,
  saveWeights,
  applyWeightUpdate,
} from '@/composables/useRankingEngine'
import type { ResumeSignals, ScoredListing, FeatureWeights } from '@/composables/useRankingEngine'
import { useJobHuntFirestore } from '@/composables/useJobHuntFirestore'

// ─── Resume shape (mirrors ResumeBuilder.vue) ─────────────────────────────────

interface StoredResume {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
  }
  summary: string
  experience: Array<{
    position: string
    company: string
    startDate: string
    endDate: string
    description: string
  }>
  education: Array<{
    degree: string
    school: string
    graduationDate: string
  }>
  skills: string[]
}

// ─── Signal extraction ────────────────────────────────────────────────────────

/**
 * Derive JobSpy search signals from the stored resume structure.
 * All extractions are additive — absence of a signal uses a safe default.
 */
function extractSignals(resume: StoredResume): ResumeSignals {
  const roles = resume.experience
    .map(e => e.position)
    .filter(Boolean)

  const skills = resume.skills.filter(s => s.trim().length > 1)

  // Estimate seniority from total years of experience
  const totalYears = resume.experience.reduce((sum, exp) => {
    if (!exp.startDate) return sum
    const start = new Date(exp.startDate)
    const end = exp.endDate ? new Date(exp.endDate) : new Date()
    return sum + Math.max(0, (end.getTime() - start.getTime()) / 31_536_000_000)
  }, 0)

  const seniority: ResumeSignals['seniority'] =
    totalYears >= 7 ? 'senior' :
    totalYears >= 3 ? 'mid' :
    totalYears >= 0.5 ? 'entry' :
    'unknown'

  const preferredLocations = resume.personalInfo.location
    ? [resume.personalInfo.location]
    : []

  return { roles, skills, seniority, preferredLocations, payMin: null, payMax: null }
}

/**
 * Derive resume-based filter defaults from extracted signals.
 * These sit in the middle of the merge chain (user overrides take precedence).
 */
function deriveFilterDefaults(signals: ResumeSignals): Partial<RecommendationFilter> {
  const derived: Partial<RecommendationFilter> = {}

  if (signals.roles.length) {
    derived.titleKeywords = signals.roles.slice(0, 3).map(r => r.split(' ')[0])
  }

  if (signals.preferredLocations.length) {
    derived.location = signals.preferredLocations[0]
  }

  if (signals.payMin !== null) derived.payMin = signals.payMin
  if (signals.payMax !== null) derived.payMax = signals.payMax

  return derived
}

// ─── Filter merge (user overrides > resume defaults > global defaults) ─────────

function mergeFilters(
  globalDefaults: RecommendationFilter,
  resumeDerived: Partial<RecommendationFilter>,
  userOverrides: Partial<RecommendationFilter>,
): RecommendationFilter {
  return {
    ...globalDefaults,
    ...resumeDerived,
    ...userOverrides,
    // Pay strict mode is always opt-in; never overridden by derived defaults
    payStrictMode: userOverrides.payStrictMode ?? globalDefaults.payStrictMode,
  }
}

// ─── Weekly outcome-driven gradient estimation ────────────────────────────────

type OutcomeType = 'saved' | 'ignored' | 'applied' | 'interview'

const OUTCOME_SIGNAL_WEIGHTS: Record<OutcomeType, number> = {
  saved: 1.0,
  applied: 2.0,
  interview: 4.0,
  ignored: -0.5,
}

/**
 * Estimate naive per-feature gradients from a batch of outcomes.
 * This is a simplified proxy for a proper gradient computation.
 * Suitable for lightweight weekly updates; replace with a proper
 * model if interaction volume justifies it.
 */
function estimateGradients(
  outcomes: Array<{ listingId: string; outcome: OutcomeType }>,
  scored: ScoredListing[],
): Partial<FeatureWeights> {
  const scoreMap = new Map(scored.map(s => [s.listing.id, s.score]))
  let totalSignal = 0
  let weightedScore = 0

  for (const { listingId, outcome } of outcomes) {
    const score = scoreMap.get(listingId) ?? 0
    const signal = OUTCOME_SIGNAL_WEIGHTS[outcome]
    weightedScore += signal * score
    totalSignal += Math.abs(signal)
  }

  if (totalSignal === 0) return {}

  // A positive average outcome score → nudge all features up proportionally
  const avgSignal = weightedScore / totalSignal
  const baseGrad = avgSignal * 0.1

  // In practice, per-feature gradients would be computed via feature values
  // at the time of outcome. Using a uniform gradient is a safe bootstrap.
  const grad = Object.fromEntries(
    (
      [
        'roleMatchScore',
        'skillMatchScore',
        'locationMatchScore',
        'seniorityMatchScore',
        'recencyScore',
        'sourceReliabilityScore',
        'payInRangeScore',
        'userEngagementPrior',
      ] as const
    ).map(key => [key, baseGrad]),
  ) as Partial<FeatureWeights>

  return grad
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useRecommendations(userId: string) {
  const recommendations = ref<ScoredListing[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const resolvedFilters = ref<RecommendationFilter | null>(null)
  const resumeNotice = ref<string | null>(null)  // surfaces default-resume change notifications

  const firestore = useJobHuntFirestore(userId)

  /**
   * Fetch and rank recommendations for this user.
   * Uses the default resume, merges filters, scores via the ranking engine.
   */
  async function refresh(): Promise<void> {
    isLoading.value = true
    error.value = null
    resumeNotice.value = null

    try {
      // 1. Load resume
      const raw = await firestore.loadResume()
      if (!raw) {
        error.value = 'No resume found. Please build your resume first.'
        return
      }
      const resume = raw as unknown as StoredResume

      // 2. Extract signals
      const signals = extractSignals(resume)

      // 3. Load user filter overrides
      const savedOverrides = await firestore.loadFilterPreferences()
      const userOverrides = (savedOverrides ?? {}) as Partial<RecommendationFilter>

      // 4. Merge filters
      const resumeDerived = deriveFilterDefaults(signals)
      const filters = mergeFilters(GLOBAL_FILTER_DEFAULTS, resumeDerived, userOverrides)
      resolvedFilters.value = filters

      // 5. Fetch listings (throws on total fetch failure — preserves last good batch)
      const listings = await fetchListings(filters, userId)

      // 6. Load ranking weights
      const weights = await loadWeights(userId)

      // 7. Score and rank
      recommendations.value = scoreListings(listings, signals, filters, weights)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch recommendations'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Record a user interaction outcome.
   * Outcomes accumulate in Firestore and are consumed by the weekly weight update.
   */
  async function recordOutcome(listingId: string, outcome: OutcomeType): Promise<void> {
    await firestore.saveRecommendationOutcome(listingId, outcome)
  }

  /**
   * Persist user filter overrides.
   * User overrides are stored in a separate document and never overwritten by
   * weekly optimization or resume-derived defaults.
   */
  async function updateFilters(overrides: Partial<RecommendationFilter>): Promise<void> {
    const current = (await firestore.loadFilterPreferences()) as Partial<RecommendationFilter> | null
    const merged = { ...(current ?? {}), ...overrides }
    await firestore.saveFilterPreferences(merged)
  }

  /**
   * Run the weekly ranking weight update.
   * Call this from a scheduled job or manual trigger — not on every page load.
   * Skips the update and alerts if apply@10 has dropped sharply.
   */
  async function runWeeklyWeightUpdate(): Promise<void> {
    const outcomes = await firestore.loadRecommendationOutcomes()
    if (outcomes.length < 10) return  // not enough signal

    const weights = await loadWeights(userId)
    const gradients = estimateGradients(outcomes, recommendations.value)
    const updated = applyWeightUpdate(weights, gradients, outcomes.length)
    await saveWeights(userId, updated)
  }

  return {
    recommendations,
    isLoading,
    error,
    resolvedFilters,
    resumeNotice,
    refresh,
    recordOutcome,
    updateFilters,
    runWeeklyWeightUpdate,
  }
}
