# Errors

<!-- markdownlint-disable MD024 -->

Command failures and runtime/integration errors. Keep entries redacted; never include secrets or full personal data.

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
