# Job Hunt Pipeline Frontend

A modern Vue 3 + TypeScript web application for managing your job search pipeline with AI-powered insights, MFA authentication via Firebase, and Firestore data persistence.

## ✨ Features

- 🔐 Google OAuth authentication with TOTP 2FA
- 📊 Real-time job pipeline tracking (companies, postings, applications, interviews, contacts)
- 🤖 AI-powered insights using OpenBrain MCP integration
- 📈 Pipeline analytics (conversion rates, upcoming interviews, offer tracking)
- 🔄 Real-time Firestore synchronization
- 📱 Responsive design (mobile, tablet, desktop)

## 🛠️ Tech Stack

- Vue 3, TypeScript, Vite
- Firebase Authentication & Firestore
- Tailwind CSS
- Vercel Deployment (production)
- Cloudflare (DNS/domain)

## 📋 Prerequisites

- Node.js 16+
- Firebase project
- Cloudflare account
- OpenBrain Job Hunt Pipeline extension

## 🚀 Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in Firebase credentials
npm run dev
```

## 📦 Build & Deploy

```bash
npm run build
npx vercel deploy --prod --yes
```

### Vercel Project Configuration (Required)

This app is a Vite SPA with serverless APIs in `api/*.ts`. The Vercel project must not be configured as Next.js.

Required settings:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Repo config in `vercel.json` should include:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### API Runtime Compatibility Note

To avoid bridge/runtime mismatches on Vercel, each API handler under `api/` supports both:

- Node serverless signature (`req`, `res`)
- Fetch-style invocation (`handler.fetch`)

This prevents production failures such as:

```text
{"error":"Vercel Node Bridge Failure","message":"handler.fetch is not a function"}
```

## 🌐 Domain Setup

Configure `cpfcoaching.us` in Vercel Domains and point DNS through Cloudflare.

## 🔐 Firebase Auth Remediation (Automated)

If login shows errors like `API_KEY_SERVICE_BLOCKED`, `API_KEY_HTTP_REFERRER_BLOCKED`, or Identity Toolkit blocked requests, run:

```bash
./scripts/firebase-auth-diagnose.sh
./scripts/firebase-auth-remediate.sh --mode server-compatible
./scripts/firebase-auth-diagnose.sh
```

Remediation modes:

- `--mode server-compatible` (recommended): Uses API-target restrictions only, so backend calls without Referer (for example, token validation from serverless functions) do not fail with `<empty> are blocked`.
- `--mode browser`: Uses browser referrer restrictions for frontend-only usage patterns.

What these scripts do:

- Validate whether the configured web API key can call Identity Toolkit from your app domains.
- Auto-update API key browser referrer restrictions to include:
  - `https://app.cpfcoaching.us/*`
  - `https://cpfcoaching.us/*`
  - Firebase auth handler domain from `VITE_FIREBASE_AUTH_DOMAIN` (for popup/redirect flow)
  - Active Vercel aliases for this project
- Re-run diagnosis to confirm restrictions are no longer blocking auth.

Requirements:

- `gcloud` installed and authenticated
- `.env.local` contains `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, and `VITE_FIREBASE_AUTH_DOMAIN`

After each production deploy, use a hard refresh to avoid stale bundles:

- macOS Safari/Chrome: `Cmd + Shift + R`
- Or open with cache-buster: `https://cpfcoaching.us/?_cb=<timestamp>`

Quick verification checks:

```bash
curl -sS 'https://cpfcoaching.us/?_cb='"$(date +%s)" | head -n 5
curl -sS -X POST 'https://cpfcoaching.us/api/ai-match' \
  -H 'content-type: application/json' \
  -d '{"jobs":[{"title":"Test"}]}'
```

## 📚 Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup, MFA configuration, and troubleshooting.

## 🧠 Self-Improvement Logs

This repo includes structured learning logs under [.learnings/](./.learnings/):

- [.learnings/ERRORS.md](./.learnings/ERRORS.md): runtime and command failures
- [.learnings/LEARNINGS.md](./.learnings/LEARNINGS.md): corrected assumptions and hardened patterns
- [.learnings/FEATURE_REQUESTS.md](./.learnings/FEATURE_REQUESTS.md): requested capabilities and backlog-ready ideas

Guidelines:

- Keep entries concise and structured (ID, timestamp, priority, status, area, summary, suggested action).
- Use recurrence metadata for repeated failures (Pattern-Key, Recurrence-Count).
- Log redacted summaries only; do not store secrets or full personal data.
- Promote repeated learnings into permanent instructions/workflows.
