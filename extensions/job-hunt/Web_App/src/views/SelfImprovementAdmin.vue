<template>
  <div :class="isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'" class="min-h-screen p-4 sm:p-6">
    <!-- Header -->
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold flex items-center gap-2">
            <span>🔬</span> Self-Improvement Log
          </h1>
          <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm mt-1">
            Runtime events, errors, and learnings captured by the app
          </p>
        </div>
        <button
          @click="loadEvents"
          :disabled="loading"
          :class="isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {{ loading ? 'Loading…' : '↻ Refresh' }}
        </button>
      </div>

      <!-- Bucket tabs -->
      <div :class="isDark ? 'bg-gray-800' : 'bg-white'" class="rounded-xl shadow-sm border mb-4 p-1 flex gap-1 flex-wrap"
           :style="isDark ? 'border-color:#374151' : 'border-color:#e5e7eb'">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeBucket = tab.value"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition',
            activeBucket === tab.value
              ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700')
              : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'),
          ]"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span
            v-if="countFor(tab.value) > 0"
            :class="activeBucket === tab.value
              ? (isDark ? 'bg-indigo-500 text-white' : 'bg-indigo-200 text-indigo-800')
              : (isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600')"
            class="text-xs rounded-full px-2 py-0.5 font-mono"
          >{{ countFor(tab.value) }}</span>
        </button>
      </div>

      <!-- Severity filter -->
      <div class="flex flex-wrap gap-2 mb-4 items-center">
        <span :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-xs font-semibold uppercase tracking-wide">Severity:</span>
        <button
          v-for="sev in severities"
          :key="sev"
          @click="toggleSeverity(sev)"
          :class="[
            'px-3 py-1 rounded-full text-xs font-medium transition border',
            activeSeverities.has(sev)
              ? severityActiveClass(sev)
              : (isDark ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-white border-gray-300 text-gray-400'),
          ]"
        >
          {{ sev }}
        </button>
        <button
          v-if="activeSeverities.size < severities.length"
          @click="activeSeverities = new Set(severities)"
          :class="isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'"
          class="text-xs ml-1 underline"
        >show all</button>
      </div>

      <!-- Empty state -->
      <div
        v-if="!loading && filteredEvents.length === 0"
        :class="isDark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'"
        class="rounded-xl border p-10 text-center"
      >
        <div class="text-4xl mb-3">🎉</div>
        <p class="font-medium">No events in this bucket</p>
        <p class="text-sm mt-1">Events are captured automatically as you use the app.</p>
      </div>

      <!-- Event cards -->
      <div class="space-y-3">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          :class="[
            'rounded-xl border p-4 transition',
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
            event.severity === 'critical' ? (isDark ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-red-500') : '',
            event.severity === 'high' ? (isDark ? 'border-l-4 border-l-orange-500' : 'border-l-4 border-l-orange-400') : '',
          ]"
        >
          <!-- Card header row -->
          <div class="flex flex-wrap items-start gap-2 mb-2">
            <!-- Bucket badge -->
            <span :class="bucketBadgeClass(event.bucket)" class="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {{ event.bucket }}
            </span>
            <!-- Severity badge -->
            <span :class="severityBadgeClass(event.severity)" class="text-xs font-medium px-2 py-0.5 rounded-full capitalize">
              {{ event.severity }}
            </span>
            <!-- Area badge -->
            <span :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'" class="text-xs px-2 py-0.5 rounded-full">
              {{ event.area }}
            </span>
            <!-- Timestamp -->
            <span :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-xs ml-auto">
              {{ formatTs(event.createdAt) }}
            </span>
          </div>

          <!-- Summary -->
          <p class="font-semibold text-sm mb-1">{{ event.summary }}</p>

          <!-- Source & patternKey -->
          <div class="flex flex-wrap gap-3 text-xs mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            <span v-if="event.source"><span class="font-medium">source:</span> {{ event.source }}</span>
            <span v-if="event.patternKey"><span class="font-medium">pattern:</span> {{ event.patternKey }}</span>
          </div>

          <!-- Details (collapsible) -->
          <div v-if="event.details">
            <button
              @click="toggleDetails(event.id!)"
              :class="isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'"
              class="text-xs underline mb-1"
            >
              {{ expandedIds.has(event.id!) ? '▲ hide details' : '▼ show details' }}
            </button>
            <pre
              v-if="expandedIds.has(event.id!)"
              :class="isDark ? 'bg-gray-900 text-gray-300 border-gray-700' : 'bg-gray-50 text-gray-700 border-gray-200'"
              class="text-xs rounded-lg border p-3 whitespace-pre-wrap break-words mt-1 max-h-64 overflow-y-auto"
            >{{ event.details }}</pre>
          </div>
        </div>
      </div>

      <!-- Load error -->
      <div
        v-if="loadError"
        :class="isDark ? 'bg-red-900/40 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700'"
        class="rounded-xl border p-4 mt-4 text-sm"
      >
        Failed to load events: {{ loadError }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useJobHuntFirestore, type SelfImprovementEvent, type SelfImprovementBucket } from '@/composables/useJobHuntFirestore'
import type { Timestamp } from 'firebase/firestore'

const { user, isDark } = useAuth()

const events = ref<(SelfImprovementEvent & { id: string })[]>([])
const loading = ref(false)
const loadError = ref('')
const expandedIds = ref(new Set<string>())

type BucketFilter = SelfImprovementBucket | 'all'
const activeBucket = ref<BucketFilter>('all')

const severities = ['critical', 'high', 'medium', 'low'] as const
type Severity = typeof severities[number]
const activeSeverities = ref(new Set<Severity>(severities))

const tabs: { value: BucketFilter; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: '📋' },
  { value: 'errors', label: 'Errors', icon: '🔴' },
  { value: 'learnings', label: 'Learnings', icon: '💡' },
  { value: 'feature-requests', label: 'Feature Requests', icon: '✨' },
]

const filteredEvents = computed(() => {
  return events.value.filter((e) => {
    const bucketMatch = activeBucket.value === 'all' || e.bucket === activeBucket.value
    const severityMatch = activeSeverities.value.has(e.severity as Severity)
    return bucketMatch && severityMatch
  })
})

const countFor = (bucket: BucketFilter) => {
  if (bucket === 'all') return events.value.length
  return events.value.filter((e) => e.bucket === bucket).length
}

const loadEvents = async () => {
  if (!user.value?.uid) return
  loading.value = true
  loadError.value = ''
  try {
    const store = useJobHuntFirestore(user.value.uid)
    events.value = await store.loadSelfImprovementEvents()
  } catch (err: unknown) {
    loadError.value = err instanceof Error ? err.message : String(err)
  } finally {
    loading.value = false
  }
}

const toggleDetails = (id: string) => {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
  // trigger reactivity
  expandedIds.value = new Set(expandedIds.value)
}

const toggleSeverity = (sev: Severity) => {
  const next = new Set(activeSeverities.value)
  if (next.has(sev)) {
    if (next.size > 1) next.delete(sev)
  } else {
    next.add(sev)
  }
  activeSeverities.value = next
}

const formatTs = (ts: Timestamp | undefined) => {
  if (!ts) return ''
  try {
    return ts.toDate().toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return ''
  }
}

const bucketBadgeClass = (bucket: SelfImprovementBucket) => {
  const map: Record<SelfImprovementBucket, string> = {
    errors: 'bg-red-100 text-red-700',
    learnings: 'bg-blue-100 text-blue-700',
    'feature-requests': 'bg-purple-100 text-purple-700',
  }
  return map[bucket] ?? 'bg-gray-100 text-gray-600'
}

const severityBadgeClass = (severity: string) => {
  const map: Record<string, string> = {
    critical: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  }
  return map[severity] ?? 'bg-gray-100 text-gray-600'
}

const severityActiveClass = (sev: Severity) => {
  const map: Record<Severity, string> = {
    critical: 'bg-red-100 border-red-400 text-red-700',
    high: 'bg-orange-100 border-orange-400 text-orange-700',
    medium: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    low: 'bg-green-100 border-green-400 text-green-700',
  }
  return map[sev]
}

onMounted(loadEvents)
</script>
