# Errors

<!-- markdownlint-disable MD024 -->

Command failures and runtime/integration errors. Keep entries redacted; never include secrets or full personal data.

---

## [ERR-20260510-002] dataconnect-keyoutput-selection-mismatch

**Logged**: 2026-05-10T00:00:00Z
**Priority**: high
**Status**: open
**Area**: dataconnect

### Summary

Data Connect GraphQL operations in example queries are selecting subfields from `*_KeyOutput` mutation results, which do not expose selectable fields.

### Error

```text
Field "user_insert" must not have a selection since type "User_KeyOutput" has no subfields.
Cannot query field "id" on type "User_KeyOutput".
Field "application_update" must not have a selection since type "Application_KeyOutput" has no subfields.
Cannot query field "id" on type "Application_KeyOutput".
```

### Context

- Operation: Validate Data Connect example operations.
- Root cause: Query/mutation expectations were authored against a richer output model than the generated key output contract.
- Impact: GraphQL validation fails; example operations are not executable.

### Suggested Fix

- Remove field selections from `user_insert` and `application_update` when return type is `*_KeyOutput`.
- If IDs are needed, run a follow-up query by key or update schema/connector to return a selectable payload type.
- Add schema-contract validation in CI for `dataconnect/example/queries.gql`.

### Metadata

- Reproducible: yes
- Related Files: dataconnect/example/queries.gql
- Pattern-Key: dataconnect.keyoutput_contract_mismatch
- Recurrence-Count: 1
- First-Seen: 2026-05-10
- Last-Seen: 2026-05-10

---

## [ERR-20260510-003] markdownlint-implementation-doc-debt

**Logged**: 2026-05-10T00:00:00Z
**Priority**: medium
**Status**: open
**Area**: documentation

### Summary

Implementation planning documents are accumulating markdownlint violations (heading spacing, list spacing, fenced code language, table spacing, trailing whitespace).

### Error

```text
MD022, MD032, MD031, MD040, MD060, MD009, MD034 across IMPLEMENTATION_CHECKLIST.md and VERCEL_IMPLEMENTATION_STRATEGY.md
```

### Context

- Operation: Markdown linting / diagnostics scan.
- Root cause: Rapid iterative updates without formatting normalization.
- Impact: High warning noise obscures important diagnostics and slows review.

### Suggested Fix

- Run a markdown formatting pass with strict lint autofix where safe.
- Add language tags to all fenced blocks.
- Normalize heading/list blank lines and table spacing.

### Metadata

- Reproducible: yes
- Related Files: IMPLEMENTATION_CHECKLIST.md, VERCEL_IMPLEMENTATION_STRATEGY.md
- Pattern-Key: docs.markdownlint_hygiene
- Recurrence-Count: 1
- First-Seen: 2026-05-10
- Last-Seen: 2026-05-10

---

## [ERR-20260510-004] tsconfig-missing-casing-consistency

**Logged**: 2026-05-10T00:00:00Z
**Priority**: low
**Status**: open
**Area**: tooling

### Summary

TypeScript config for web-app is missing `forceConsistentCasingInFileNames`, increasing cross-OS path-case risk.

### Error

```text
The compiler option "forceConsistentCasingInFileNames" should be enabled to reduce issues when working with different OSes.
```

### Context

- Operation: TS config diagnostics.
- Root cause: Compiler safety option not set in `web-app/tsconfig.json`.
- Impact: Mac/Windows/Linux case sensitivity mismatches can escape local checks and fail in CI/prod.

### Suggested Fix

- Enable `forceConsistentCasingInFileNames: true` in `web-app/tsconfig.json`.
- Add a CI typecheck gate for web-app.

### Metadata

- Reproducible: yes
- Related Files: web-app/tsconfig.json
- Pattern-Key: typescript.casing_consistency
- Recurrence-Count: 1
- First-Seen: 2026-05-10
- Last-Seen: 2026-05-10

---

## [ERR-20260428-001] linkedin-import-runtime-not-iterable

**Logged**: 2026-04-28T00:00:00Z
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary

LinkedIn import failed at runtime with `t is not iterable` when full-profile JSON shapes did not match expected arrays.

### Error

```text
TypeError: t is not iterable
```

### Context

- Operation: Import LinkedIn profile JSON in Resume Builder.
- Root cause: Merge and stats paths assumed iterable arrays (`skills`, `experience`, `education`, bullets/tags) from external payloads.
- Impact: Import blocked for valid but differently shaped LinkedIn payloads.

### Suggested Fix

- Coerce external data shapes before spread/loop operations.
- Guard all merge paths with safe array coercion helpers.
- Keep parser tolerant for alternative field names and nested object forms.

### Metadata

- Reproducible: yes
- Related Files: src/utils/linkedinParser.ts
- Pattern-Key: harden.input_shape_validation
- Recurrence-Count: 1
- First-Seen: 2026-04-28
- Last-Seen: 2026-04-28

---

## [ERR-20260509-001] vercel-node-bridge-handler-fetch

**Logged**: 2026-05-09T00:00:00Z
**Priority**: high
**Status**: resolved
**Area**: deployment

### Summary

Production root returned JSON error with `Vercel Node Bridge Failure` and `handler.fetch is not a function`.

### Error

```text
{"error":"Vercel Node Bridge Failure","message":"handler.fetch is not a function"}
```

### Context

- Operation: Open production domain after deploy.
- Root cause 1: Vercel project framework preset was `nextjs` for a Vite project.
- Root cause 2: API functions were Node-only handlers; bridge expected fetch-compatible surface.
- Impact: Root route and/or API invocation failed in production.

### Suggested Fix

- Set Vercel framework preset to `vite`.
- Keep `vercel.json` with `framework`, `buildCommand`, `outputDirectory`, and SPA rewrites.
- Implement dual-compatible API handlers that support both Node req/res and fetch-style calls.

### Metadata

- Reproducible: yes
- Related Files: vercel.json, api/ai-match.ts, api/apply-job.ts, api/scrape-jobs.ts
- Pattern-Key: deploy.runtime_framework_mismatch
- Recurrence-Count: 1
- First-Seen: 2026-05-09
- Last-Seen: 2026-05-09

---

## [ERR-20260510-001] firebase-auth-api-key-blocked

**Logged**: 2026-05-10T00:00:00Z
**Priority**: high
**Status**: resolved
**Area**: authentication

### Summary

Google sign-in failed because Firebase Identity Toolkit calls were blocked by API key restrictions.

### Error

```text
Requests to this API identitytoolkit method ... are blocked.
API_KEY_SERVICE_BLOCKED
API_KEY_HTTP_REFERRER_BLOCKED
```

### Context

- Operation: User login at `https://app.cpfcoaching.us/login`.
- Root cause 1: Web API key restrictions excluded `identitytoolkit.googleapis.com`.
- Root cause 2: Browser referrer restrictions omitted Firebase auth handler domain (`https://streamdeck-365513.firebaseapp.com/*`).
- Impact: Sign-in flow failed before token exchange completed.

### Suggested Fix

- Replace API-target restrictions on the web key with browser referrer restrictions for production domains and Firebase auth handler domain.
- Validate with a project config preflight call and confirm no `API_KEY_SERVICE_BLOCKED` / `API_KEY_HTTP_REFERRER_BLOCKED` errors.
- Keep scripts for repeatable diagnosis and remediation.

### Metadata

- Reproducible: yes
- Related Files: scripts/firebase-auth-diagnose.sh, scripts/firebase-auth-remediate.sh, README.md
- Pattern-Key: auth.firebase_api_key_restrictions
- Recurrence-Count: 1
- First-Seen: 2026-05-10
- Last-Seen: 2026-05-10

---
