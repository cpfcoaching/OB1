# Learnings

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
