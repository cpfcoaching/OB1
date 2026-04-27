/**
 * Ranking Engine
 *
 * Lightweight learned ranking for job recommendations.
 * Feature scoring, Firestore-backed weight persistence, and bounded weekly updates.
 * See .github/skills/jobspy-weekly-optimizer/references/ranking-features.md for the full spec.
 */

import { db } from '@/config/firebase'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import type { JobListing, RecommendationFilter } from '@/adapters/jobspyAdapter'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ResumeSignals {
  roles: string[]           // e.g. ['Software Engineer', 'Frontend Developer']
  skills: string[]          // e.g. ['TypeScript', 'Vue', 'Python']
  seniority: 'entry' | 'mid' | 'senior' | 'unknown'
  preferredLocations: string[]
  payMin: number | null
  payMax: number | null
}

export type FeatureKey =
  | 'roleMatchScore'
  | 'skillMatchScore'
  | 'locationMatchScore'
  | 'seniorityMatchScore'
  | 'recencyScore'
  | 'sourceReliabilityScore'
  | 'payInRangeScore'
  | 'userEngagementPrior'

export type FeatureWeights = Record<FeatureKey, number>

export interface RankingWeights extends FeatureWeights {
  version: number
  effectiveFrom: string     // ISO 8601
}

export interface ScoredListing {
  listing: JobListing
  score: number             // normalized to [0, 1] per batch
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FEATURE_KEYS: FeatureKey[] = [
  'roleMatchScore',
  'skillMatchScore',
  'locationMatchScore',
  'seniorityMatchScore',
  'recencyScore',
  'sourceReliabilityScore',
  'payInRangeScore',
  'userEngagementPrior',
]

const DEFAULT_FEATURE_WEIGHTS: FeatureWeights = {
  roleMatchScore: 1.0,
  skillMatchScore: 0.9,
  locationMatchScore: 0.8,
  seniorityMatchScore: 0.7,
  recencyScore: 0.6,
  sourceReliabilityScore: 0.5,
  payInRangeScore: 0.5,
  userEngagementPrior: 0.4,
}

const WEIGHT_CLAMP_MIN = 0.05
const WEIGHT_CLAMP_MAX = 2.0
const MAX_WEIGHT_DELTA = 0.2
const SOFTMAX_GUARD_THRESHOLD = 1.5
const MIN_INTERACTIONS_FOR_FULL_LR = 50
const LEARNING_RATE = 0.05

const SENIORITY_KEYWORDS: Record<'senior' | 'mid' | 'entry', string[]> = {
  senior: ['senior', 'sr', 'lead', 'principal', 'staff', 'director', 'vp', 'head'],
  mid: ['mid', 'ii', '2', 'intermediate'],
  entry: ['junior', 'jr', 'entry', 'associate', 'i', '1', 'new grad'],
}

// ─── Weight persistence ───────────────────────────────────────────────────────

export async function loadWeights(userId: string): Promise<RankingWeights> {
  const ref = doc(db, 'ranking_weights', userId)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return snap.data() as RankingWeights
  }
  return {
    ...DEFAULT_FEATURE_WEIGHTS,
    version: 1,
    effectiveFrom: new Date().toISOString(),
  }
}

export async function saveWeights(userId: string, weights: RankingWeights): Promise<void> {
  const ref = doc(db, 'ranking_weights', userId)
  await setDoc(ref, { ...weights, updatedAt: Timestamp.now() })
}

// ─── Text utilities ───────────────────────────────────────────────────────────

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1),
  )
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0
  let matches = 0
  for (const token of a) {
    if (b.has(token)) matches++
  }
  return matches / Math.min(a.size, b.size)
}

// ─── Individual feature scorers ───────────────────────────────────────────────

function scoreRecency(postedAt: string, recencyDays: number): number {
  const ageDays = (Date.now() - new Date(postedAt).getTime()) / 86_400_000
  return Math.max(0, 1 - ageDays / recencyDays)
}

function scoreSeniority(
  titleAndDesc: Set<string>,
  seniority: ResumeSignals['seniority'],
): number {
  if (seniority === 'unknown') return 0.5
  const matchKeywords = SENIORITY_KEYWORDS[seniority]
  const hasMatch = matchKeywords.some(k => titleAndDesc.has(k))
  if (hasMatch) return 0.9

  const hasOpposite = Object.entries(SENIORITY_KEYWORDS)
    .filter(([level]) => level !== seniority)
    .flatMap(([, kw]) => kw)
    .some(k => titleAndDesc.has(k))

  return hasOpposite ? 0.2 : 0.5
}

function scorePayInRange(listing: JobListing, filters: RecommendationFilter): number {
  const hasPay = listing.payMin !== null || listing.payMax !== null
  if (!hasPay) return filters.payStrictMode ? 0.5 : 1.0
  if (filters.payMin === null && filters.payMax === null) return 1.0

  const lMin = listing.payMin ?? listing.payMax!
  const lMax = listing.payMax ?? listing.payMin!
  const uMin = filters.payMin ?? lMin
  const uMax = filters.payMax ?? lMax

  const overlapLow = Math.max(lMin, uMin)
  const overlapHigh = Math.min(lMax, uMax)
  if (overlapLow > overlapHigh) return 0.2

  const span = uMax - uMin
  return span > 0 ? Math.min(1.0, (overlapHigh - overlapLow) / span) : 1.0
}

// ─── Batch scoring ────────────────────────────────────────────────────────────

export function scoreListings(
  listings: JobListing[],
  signals: ResumeSignals,
  filters: RecommendationFilter,
  weights: RankingWeights,
): ScoredListing[] {
  const roleTokens = new Set(signals.roles.flatMap(r => [...tokenize(r)]))
  const skillTokens = new Set(signals.skills.flatMap(s => [...tokenize(s)]))
  const locationTokens = tokenize(filters.location)

  const raw = listings.map(listing => {
    const titleAndDesc = tokenize(`${listing.title} ${listing.description}`)

    const features: FeatureWeights = {
      roleMatchScore: overlapScore(roleTokens, titleAndDesc),
      skillMatchScore: overlapScore(skillTokens, titleAndDesc),
      locationMatchScore:
        filters.location
          ? listing.remoteType === 'remote'
            ? 1.0
            : overlapScore(locationTokens, tokenize(listing.location))
          : 0.5,
      seniorityMatchScore: scoreSeniority(titleAndDesc, signals.seniority),
      recencyScore: scoreRecency(listing.postedAt, filters.recencyDays),
      sourceReliabilityScore: 0.7,    // static until per-source precision tracking is live
      payInRangeScore: scorePayInRange(listing, filters),
      userEngagementPrior: 0.5,       // neutral prior until interaction history accumulates
    }

    const score = FEATURE_KEYS.reduce(
      (sum, key) => sum + weights[key] * features[key],
      0,
    )

    return { listing, score }
  })

  // Normalize per batch to [0, 1]
  const maxScore = Math.max(...raw.map(s => s.score), 1)
  return raw
    .map(s => ({ listing: s.listing, score: s.score / maxScore }))
    .sort((a, b) => b.score - a.score)
}

// ─── Weekly weight update ─────────────────────────────────────────────────────

/**
 * Apply a bounded gradient step to the current weight vector.
 * Caller is responsible for computing gradients from outcome signals.
 * Minimum 50 interactions for full learning rate; fewer uses lr/2.
 */
export function applyWeightUpdate(
  current: RankingWeights,
  gradients: Partial<FeatureWeights>,
  interactionCount: number,
): RankingWeights {
  const lr = interactionCount >= MIN_INTERACTIONS_FOR_FULL_LR ? LEARNING_RATE : LEARNING_RATE / 2

  const updated = { ...current }

  for (const key of FEATURE_KEYS) {
    const grad = gradients[key] ?? 0
    const delta = Math.max(-MAX_WEIGHT_DELTA, Math.min(MAX_WEIGHT_DELTA, lr * grad))
    const next = current[key] + delta
    updated[key] = Math.max(WEIGHT_CLAMP_MIN, Math.min(WEIGHT_CLAMP_MAX, next))
  }

  // Softmax normalization guard: proportionally scale all weights if top exceeds threshold
  const maxW = Math.max(...FEATURE_KEYS.map(k => updated[k]))
  if (maxW > SOFTMAX_GUARD_THRESHOLD) {
    const scale = SOFTMAX_GUARD_THRESHOLD / maxW
    for (const key of FEATURE_KEYS) {
      updated[key] = updated[key] * scale
    }
  }

  return {
    ...updated,
    version: current.version + 1,
    effectiveFrom: new Date().toISOString(),
  }
}
