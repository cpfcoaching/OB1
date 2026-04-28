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
import type { UserContextProfile } from '@/composables/useJobHuntFirestore'

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

export interface PersonalizedRecommendation extends ScoredListing {
  roleFamily: string
  matchReasons: string[]
  resumeTweaks: string[]
  relatedRoleSuggestions: string[]
}

const ROLE_RELATED_KEYWORDS: Array<{ family: string; test: RegExp; related: string[] }> = [
  { family: 'software-engineering', test: /(software|full\s*stack|backend|frontend)\s+engineer/i, related: ['application engineer', 'platform engineer', 'product engineer'] },
  { family: 'security', test: /(security|cyber|ciso)/i, related: ['security architect', 'governance risk and compliance', 'application security engineer'] },
  { family: 'data-ai', test: /(data\s+scientist|ml|ai\s+engineer)/i, related: ['machine learning engineer', 'analytics engineer', 'data engineer'] },
  { family: 'devops-sre', test: /(devops|sre|site reliability)/i, related: ['cloud engineer', 'platform reliability engineer', 'infrastructure engineer'] },
  { family: 'product', test: /(product\s+manager|pm)/i, related: ['technical product manager', 'program manager', 'product operations manager'] },
]

export interface OptimizerRunResult {
  applied: boolean
  reason: string
  interactionCount: number
  previousVersion: number
  nextVersion: number
  updatedWeightKeys: string[]
}

// ─── Signal extraction ────────────────────────────────────────────────────────

/**
 * Derive JobSpy search signals from the stored resume structure.
 * All extractions are additive — absence of a signal uses a safe default.
 */
function extractSignals(resume: StoredResume, context: UserContextProfile | null): ResumeSignals {
  const rolesFromResume = resume.experience
    .map(e => e.position)
    .filter(Boolean)

  const rolesFromContext = Array.isArray(context?.targetRolesInclude)
    ? context!.targetRolesInclude.filter(Boolean)
    : []

  const roles = Array.from(new Set([...rolesFromResume, ...rolesFromContext]))

  const skills = Array.from(
    new Set([
      ...resume.skills.filter(s => s.trim().length > 1),
      ...(Array.isArray(context?.skills) ? context!.skills : []),
      ...(Array.isArray(context?.competencies) ? context!.competencies : []),
    ]),
  )

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

  const preferredLocations = Array.from(
    new Set([
      ...(resume.personalInfo.location ? [resume.personalInfo.location] : []),
      ...(Array.isArray(context?.locationRequirements) ? context!.locationRequirements.filter(Boolean) : []),
    ]),
  )

  const { payMin, payMax } = parseSalaryRange(context?.salaryRequirements || '')

  return { roles, skills, seniority, preferredLocations, payMin, payMax }
}

/**
 * Derive resume-based filter defaults from extracted signals.
 * These sit in the middle of the merge chain (user overrides take precedence).
 */
function deriveFilterDefaults(signals: ResumeSignals): Partial<RecommendationFilter> {
  const derived: Partial<RecommendationFilter> = {}

  if (signals.roles.length) {
    const roleKeywords = signals.roles
      .slice(0, 4)
      .flatMap((r) => roleKeywordCandidates(r))
    derived.titleKeywords = Array.from(new Set(roleKeywords)).slice(0, 8)
  }

  if (signals.preferredLocations.length) {
    derived.location = signals.preferredLocations[0]
  }

  if (signals.payMin !== null) derived.payMin = signals.payMin
  if (signals.payMax !== null) derived.payMax = signals.payMax

  return derived
}

function roleKeywordCandidates(role: string): string[] {
  const base = role
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2)
    .slice(0, 3)

  const related = ROLE_RELATED_KEYWORDS
    .filter((entry) => entry.test.test(role))
    .flatMap((entry) => entry.related)
    .flatMap((relatedRole) => relatedRole.split(/\s+/).filter((t) => t.length > 2).slice(0, 2))

  return [...base, ...related]
}

function deriveRoleFamily(title: string): string {
  const hit = ROLE_RELATED_KEYWORDS.find((entry) => entry.test.test(title))
  return hit?.family ?? 'general'
}

function parseSalaryRange(input: string): { payMin: number | null; payMax: number | null } {
  if (!input.trim()) return { payMin: null, payMax: null }

  const nums = Array.from(input.matchAll(/\$?\s*(\d{2,3})(?:\s*[kK])?/g)).map((m) => Number(m[1]) * 1000)
  if (nums.length === 0) return { payMin: null, payMax: null }
  if (nums.length === 1) return { payMin: nums[0], payMax: null }

  const sorted = nums.sort((a, b) => a - b)
  return { payMin: sorted[0], payMax: sorted[sorted.length - 1] }
}

function excludedByRole(title: string, context: UserContextProfile | null): boolean {
  const excludes = Array.isArray(context?.targetRolesExclude) ? context!.targetRolesExclude : []
  if (excludes.length === 0) return false
  const lowerTitle = title.toLowerCase()
  return excludes.some((role) => lowerTitle.includes(role.toLowerCase()))
}

function buildMatchReasons(listing: ScoredListing, signals: ResumeSignals): string[] {
  const reasons: string[] = []
  const text = `${listing.listing.title} ${listing.listing.description}`.toLowerCase()
  const matchedSkills = signals.skills.filter((s) => text.includes(s.toLowerCase())).slice(0, 3)

  if (matchedSkills.length > 0) {
    reasons.push(`Your profile overlaps with ${matchedSkills.join(', ')}.`)
  }

  if (signals.preferredLocations.length > 0 && listing.listing.location) {
    const locationHit = signals.preferredLocations.some((loc) => listing.listing.location.toLowerCase().includes(loc.toLowerCase()))
    if (locationHit || listing.listing.remoteType === 'remote') {
      reasons.push('Location preference is aligned with this role.')
    }
  }

  if (listing.score >= 0.85) {
    reasons.push('High overall fit score based on your resume and preferences.')
  }

  return reasons.slice(0, 3)
}

function buildResumeTweaks(listing: ScoredListing, signals: ResumeSignals, savedTemplates: string[] = []): string[] {
  const tweaks: string[] = []
  const postingText = `${listing.listing.title} ${listing.listing.description}`.toLowerCase()
  const profileSkills = signals.skills.map((s) => s.toLowerCase())
  const missing = ['leadership', 'mentoring', 'architecture', 'automation', 'stakeholder']
    .filter((token) => postingText.includes(token) && !profileSkills.some((skill) => skill.includes(token)))

  tweaks.push(`Tailor your summary headline to include "${listing.listing.title}" language.`)

  for (const template of savedTemplates.slice(0, 2)) {
    tweaks.push(template)
  }

  if (missing.length > 0) {
    tweaks.push(`Add one bullet proving ${missing.slice(0, 2).join(' and ')} impact with measurable outcomes.`)
  }

  tweaks.push('Mirror 3-5 exact keywords from the posting in your top experience bullets for ATS alignment.')
  return tweaks.slice(0, 3)
}

function buildRelatedRoleSuggestions(signals: ResumeSignals): string[] {
  const related = signals.roles
    .flatMap((role) => ROLE_RELATED_KEYWORDS.filter((entry) => entry.test.test(role)).flatMap((entry) => entry.related))

  return Array.from(new Set(related)).slice(0, 5)
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
  const recommendations = ref<PersonalizedRecommendation[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const resolvedFilters = ref<RecommendationFilter | null>(null)
  const resumeNotice = ref<string | null>(null)  // surfaces default-resume change notifications
  const personalizationSummary = ref<string | null>(null)
  const optimizationNotice = ref<string | null>(null)
  const isOptimizing = ref(false)

  const firestore = useJobHuntFirestore(userId)

  const logRecommendationError = async (
    source: string,
    summary: string,
    err: unknown,
    patternKey?: string,
  ) => {
    const details = (err instanceof Error ? err.message : String(err ?? '')).slice(0, 300)
    try {
      await firestore.saveSelfImprovementEvent({
        bucket: 'errors',
        area: 'frontend',
        source,
        summary,
        details,
        patternKey,
        severity: 'medium',
      })
    } catch (logErr) {
      console.warn('Unable to write self-improvement event:', logErr)
    }
  }

  /**
   * Fetch and rank recommendations for this user.
   * Uses the default resume, merges filters, scores via the ranking engine.
   */
  async function refresh(): Promise<void> {
    isLoading.value = true
    error.value = null
    resumeNotice.value = null
    personalizationSummary.value = null
    optimizationNotice.value = null

    try {
      // 1. Load resume
      const raw = await firestore.loadResume()
      if (!raw) {
        error.value = 'No resume found. Please build your resume first.'
        return
      }
      const resume = raw as unknown as StoredResume

      // 2. Extract signals
      const context = await firestore.loadUserContextProfile()
      const signals = extractSignals(resume, context)

      // 3. Load user filter overrides
      const savedOverrides = await firestore.loadFilterPreferences()
      const userOverrides = (savedOverrides ?? {}) as Partial<RecommendationFilter>

      // 4. Merge filters
      const resumeDerived = deriveFilterDefaults(signals)
      const filters = mergeFilters(GLOBAL_FILTER_DEFAULTS, resumeDerived, userOverrides)
      resolvedFilters.value = filters

      if (context?.targetRolesInclude?.length || context?.skills?.length || context?.locationRequirements?.length) {
        personalizationSummary.value = 'Recommendations are personalized using your saved role, skills, and location preferences.'
      }

      // 5. Fetch listings (throws on total fetch failure — preserves last good batch)
      const listings = await fetchListings(filters, userId)

      // 6. Load ranking weights
      const weights = await loadWeights(userId)
      const templates = await firestore.loadResumeTweakTemplates()
      const templatesByRole = templates.reduce<Record<string, string[]>>((acc, tpl) => {
        if (!acc[tpl.roleFamily]) acc[tpl.roleFamily] = []
        acc[tpl.roleFamily].push(tpl.tweakText)
        return acc
      }, {})

      // 7. Score and rank
      const scored = scoreListings(listings, signals, filters, weights)
        .filter((item) => !excludedByRole(item.listing.title, context))

      const relatedRoleSuggestions = buildRelatedRoleSuggestions(signals)
      recommendations.value = scored.map((item) => ({
        roleFamily: deriveRoleFamily(item.listing.title),
        ...item,
        matchReasons: buildMatchReasons(item, signals),
        resumeTweaks: buildResumeTweaks(item, signals, templatesByRole[deriveRoleFamily(item.listing.title)] || []),
        relatedRoleSuggestions,
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch recommendations'
      await logRecommendationError(
        'recommendations-refresh',
        'Failed to refresh recommendation feed.',
        err,
        'resilience.fetch_fallback',
      )
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

  async function recordTweakFeedback(
    listingId: string,
    roleFamily: string,
    tweakText: string,
    helpful: boolean,
  ): Promise<void> {
    await firestore.saveRecommendationTweakFeedback(listingId, tweakText, helpful, roleFamily)

    if (helpful) {
      await firestore.saveResumeTweakTemplate(roleFamily, tweakText)
    }
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
  async function runWeeklyWeightUpdate(): Promise<OptimizerRunResult> {
    isOptimizing.value = true
    optimizationNotice.value = null

    try {
      const outcomes = await firestore.loadRecommendationOutcomes()
      const weights = await loadWeights(userId)

      if (outcomes.length < 10) {
        const result: OptimizerRunResult = {
          applied: false,
          reason: 'Not enough interactions yet (minimum 10 required).',
          interactionCount: outcomes.length,
          previousVersion: weights.version,
          nextVersion: weights.version,
          updatedWeightKeys: [],
        }
        await firestore.saveRecommendationOptimizerRun(result)
        optimizationNotice.value = result.reason
        return result
      }

      const gradients = estimateGradients(outcomes, recommendations.value)
      const updated = applyWeightUpdate(weights, gradients, outcomes.length)
      await saveWeights(userId, updated)

      const updatedWeightKeys = Object.entries(gradients)
        .filter(([, value]) => Math.abs(value || 0) > 0)
        .map(([key]) => key)

      const result: OptimizerRunResult = {
        applied: true,
        reason: `Optimization applied using ${outcomes.length} interactions.`,
        interactionCount: outcomes.length,
        previousVersion: weights.version,
        nextVersion: updated.version,
        updatedWeightKeys,
      }

      await firestore.saveRecommendationOptimizerRun(result)
      optimizationNotice.value = `Updated ranking model v${weights.version} -> v${updated.version}.`
      return result
    } catch (err) {
      await logRecommendationError(
        'recommendations-optimizer',
        'Failed to run recommendation optimizer update.',
        err,
        'resilience.optimizer_failure',
      )

      const fallback: OptimizerRunResult = {
        applied: false,
        reason: 'Optimizer failed. Try again after refreshing recommendations.',
        interactionCount: 0,
        previousVersion: 0,
        nextVersion: 0,
        updatedWeightKeys: [],
      }
      optimizationNotice.value = fallback.reason
      return fallback
    } finally {
      isOptimizing.value = false
    }
  }

  return {
    recommendations,
    isLoading,
    error,
    resolvedFilters,
    resumeNotice,
    personalizationSummary,
    optimizationNotice,
    isOptimizing,
    refresh,
    recordOutcome,
    recordTweakFeedback,
    updateFilters,
    runWeeklyWeightUpdate,
  }
}
