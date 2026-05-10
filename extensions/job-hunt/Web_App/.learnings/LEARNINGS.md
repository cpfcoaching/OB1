# Learnings

<!-- markdownlint-disable MD024 -->

Corrections, insights, and best practices captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice

---

## [LRN-20260428-001] best_practice

**Logged**: 2026-04-28T00:00:00Z
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary

Any external JSON input must be shape-coerced before merge/spread operations.

### Details

LinkedIn payloads are not structurally consistent across manual exports, custom scripts, and profile scrapes. Runtime assumptions about arrays caused failures in recommendation and import logic.

### Suggested Action

- Always coerce unknown input using typed guards (`coerceStringArray`, `coerceExperienceArray`, `coerceEducationArray`).
- Keep parser fallbacks for alternate key names and simple key:value input.
- Add unit tests for malformed/non-canonical payload shapes.

### Metadata

- Source: error
- Related Files: src/utils/linkedinParser.ts
- Tags: parsing, validation, resilience
- Pattern-Key: harden.input_shape_validation
- Recurrence-Count: 1
- First-Seen: 2026-04-28
- Last-Seen: 2026-04-28

---

## [LRN-20260428-002] best_practice

**Logged**: 2026-04-28T00:00:00Z
**Priority**: medium
**Status**: pending
**Area**: frontend

### Summary

User-facing recommendation quality improves when profile preferences are blended with resume signals, not treated separately.

### Details

Role include/exclude, location requirements, salary hints, and competency context materially improve recommendation precision and reduce user frustration.

### Suggested Action

- Continue feeding saved outcomes into ranking updates.
- Persist user feedback on tweak quality and reuse accepted tweaks by role family.

### Metadata

- Source: conversation
- Related Files: src/composables/useRecommendations.ts
- Tags: personalization, recommendations, optimization
- Pattern-Key: personalize.context_blending
- Recurrence-Count: 1
- First-Seen: 2026-04-28
- Last-Seen: 2026-04-28

---

## [LRN-20260509-001] best_practice

**Logged**: 2026-05-09T00:00:00Z
**Priority**: high
**Status**: pending
**Area**: deployment

### Summary

For Vite + serverless API projects on Vercel, framework preset must be pinned to `vite` and API handlers should remain runtime-agnostic.

### Details

Relying on inherited project settings caused Vercel to treat this app as Next.js, then bridge behavior expected a `fetch` surface. Dual-compatible handlers and explicit framework config prevented this class of outage.

### Suggested Action

- Keep `framework: "vite"` in `vercel.json`.
- Verify project settings after linking/cloning (`npx vercel project inspect`).
- Preserve dual-mode API handler pattern for endpoints in `api/*.ts`.
- Add post-deploy health checks for root HTML + one API endpoint.

### Metadata

- Source: error
- Related Files: vercel.json, README.md, api/ai-match.ts, api/apply-job.ts, api/scrape-jobs.ts
- Tags: vercel, vite, runtime, deployment
- Pattern-Key: deploy.runtime_framework_mismatch
- Recurrence-Count: 1
- First-Seen: 2026-05-09
- Last-Seen: 2026-05-09

---
