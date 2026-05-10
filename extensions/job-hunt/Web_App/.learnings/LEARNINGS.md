# Learnings

<!-- markdownlint-disable MD024 -->

Corrections, insights, and best practices captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice

---

## [LRN-20260510-002] best_practice

**Logged**: 2026-05-10T00:00:00Z
**Priority**: high
**Status**: pending
**Area**: dataconnect

### Summary

Data Connect mutations that return `*_KeyOutput` should be treated as key acknowledgements, not full entities.

### Details

The current example operations attempted to select fields like `id` directly from `User_KeyOutput` and `Application_KeyOutput`. This breaks validation because those types expose no subfields by contract.

### Suggested Action

- Update example operations to avoid selection sets on key outputs.
- Standardize a two-step pattern: mutation -> follow-up query for entity fields.
- Add a schema-aware query validation check for Data Connect examples.

### Metadata

- Source: error
- Related Files: dataconnect/example/queries.gql
- Tags: dataconnect, graphql, schema-contract
- Pattern-Key: dataconnect.keyoutput_contract_mismatch
- Recurrence-Count: 1
- First-Seen: 2026-05-10
- Last-Seen: 2026-05-10

---

## [LRN-20260510-003] best_practice

**Logged**: 2026-05-10T00:00:00Z
**Priority**: medium
**Status**: pending
**Area**: documentation

### Summary

Implementation docs need lint-clean formatting to keep operational diagnostics readable and actionable.

### Details

Large volumes of markdownlint warnings across implementation docs reduce signal-to-noise during release checks. Formatting debt can hide real build/runtime errors and slows triage.

### Suggested Action

- Add a docs hygiene pass before release checkpoints.
- Enforce fenced code language and spacing conventions.
- Keep markdownlint enabled but with autofix in local workflow.

### Metadata

- Source: error
- Related Files: IMPLEMENTATION_CHECKLIST.md, VERCEL_IMPLEMENTATION_STRATEGY.md
- Tags: docs, lint, release-readiness
- Pattern-Key: docs.markdownlint_hygiene
- Recurrence-Count: 1
- First-Seen: 2026-05-10
- Last-Seen: 2026-05-10

---

## [LRN-20260510-004] best_practice

**Logged**: 2026-05-10T00:00:00Z
**Priority**: low
**Status**: pending
**Area**: tooling

### Summary

Enable TypeScript file-name casing checks early to prevent cross-platform import breakage.

### Details

When `forceConsistentCasingInFileNames` is disabled, incorrect import casing may pass locally on case-insensitive environments but fail in CI or deployment environments.

### Suggested Action

- Set `forceConsistentCasingInFileNames: true` in `web-app/tsconfig.json`.
- Run typecheck in CI on every PR.

### Metadata

- Source: error
- Related Files: web-app/tsconfig.json
- Tags: typescript, ci, portability
- Pattern-Key: typescript.casing_consistency
- Recurrence-Count: 1
- First-Seen: 2026-05-10
- Last-Seen: 2026-05-10

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

## [LRN-20260510-001] best_practice

**Logged**: 2026-05-10T00:00:00Z
**Priority**: high
**Status**: pending
**Area**: authentication

### Summary

For Firebase web auth, use browser referrer restrictions and always include the Firebase auth handler domain from `VITE_FIREBASE_AUTH_DOMAIN`.

### Details

Even when app domains are allowlisted, Google popup/redirect auth can still fail because part of the flow runs through `<project>.firebaseapp.com`. Missing this referrer produces `API_KEY_HTTP_REFERRER_BLOCKED` while missing Identity Toolkit access produces `API_KEY_SERVICE_BLOCKED`.

### Suggested Action

- Run `./scripts/firebase-auth-diagnose.sh` during release validation.
- Run `./scripts/firebase-auth-remediate.sh` for automated restriction repair.
- Keep both root domains and Vercel aliases in browser key restrictions.

### Metadata

- Source: error
- Related Files: scripts/firebase-auth-diagnose.sh, scripts/firebase-auth-remediate.sh, README.md
- Tags: firebase, auth, api-key, referrer, production
- Pattern-Key: auth.firebase_api_key_restrictions
- Recurrence-Count: 1
- First-Seen: 2026-05-10
- Last-Seen: 2026-05-10

---
