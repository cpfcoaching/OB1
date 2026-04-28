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
- Cloudflare Pages Deployment

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
wrangler pages deploy dist --project-name job-hunt-frontend
```

## 🌐 Domain Setup

Configure `job-hunt.cisoadvisor.us` in Cloudflare Pages custom domains settings.

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
