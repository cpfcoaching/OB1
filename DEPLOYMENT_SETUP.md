# Job Hunt Frontend - Deployment Architecture

## Current Setup (April 20, 2026)

### Frontend Deployment
- **Repository**: cpfcoaching/job-hunt-frontend (GitHub)
- **Build**: Vue 3 + TypeScript + Vite
- **Frontend Hosting**: Cloudflare Pages
  - Primary: `job-hunt-app` project
  - Domain 1: `job-hunt-frontend.pages.dev` ✓ (auto-generated)
  - Domain 2: `app.cpfcoaching.us` (via DNS CNAME)

### Backend Services
- **Database**: Firebase Firestore (resumes collection)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Realtime DB**: Firebase Realtime Database

### CI/CD Pipeline
**GitHub → Cloudflare Pages (Auto-Deploy)**
1. Push to `main` branch on GitHub
2. GitHub Actions workflow triggered (`.github/workflows/deploy.yml`)
3. Install dependencies: `npm ci`
4. Build: `npm run build` → outputs to `dist/`
5. Deploy: `wrangler pages deploy dist --project-name=job-hunt-app`
6. Live at both URLs instantly

### Resume Features
**All 8 Companies Active:**
- ✅ CPF Coaching LLC (Founder & Executive Cyber Advisor)
- ✅ Quisitive (Cyber Security Advisor)
- ✅ Belleve (Cyber Risk Consultant)
- ✅ GRIMM (Security Strategy Advisor)
- ✅ CTCA (Cybersecurity Leadership)
- ✅ Capital One (Senior Manager)
- ✅ Avanade (Manager)
- ✅ ConQuest Federal (Lead Consultant)

**Resume Features:**
- 🌐 Auto-populate from web button
- 📝 Edit & tweak all fields
- 🔗 LinkedIn sync tab (ready for future)
- 💾 Save to Firestore
- 📄 Download PDF

---

## Next Steps

### ✅ What's Done
1. GitHub Actions workflow created (`.github/workflows/deploy.yml`)
2. Wrangler config updated (`wrangler.toml`)
3. Resume built with all 8 companies
4. Cloudflare Pages project created (`job-hunt-app`)

### ⏳ What You Need To Do

**1. Add GitHub Secret (5 min)**
   - Go: https://github.com/cpfcoaching/job-hunt-frontend/settings/secrets/actions
   - New secret: `CLOUDFLARE_API_TOKEN` = `[REDACTED - See .env.local]` *(Token rotated on April 20, 2026)*

**2. Update DNS Record (5 min)**
   - Go: Cloudflare Dashboard → cpfcoaching.us → DNS
   - Find/Create CNAME: `app` → `job-hunt-app.pages.dev`
   - Mark as "Proxied" (orange cloud)
   - Save

**3. Test Auto-Deploy (1 min)**
   - Make small change (e.g., add comment to README)
   - Commit & push to main
   - Check GitHub Actions: github.com/cpfcoaching/job-hunt-frontend/actions
   - Wait ~2 minutes for build
   - Visit: https://app.cpfcoaching.us/resume-builder
   - Should see your changes live

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        GITHUB REPOSITORY                        │
│              cpfcoaching/job-hunt-frontend (main)               │
│                                                                 │
│  Files:                                                         │
│  • src/ (Vue components + composables)                         │
│  • .github/workflows/deploy.yml (← NEW AUTO-DEPLOY)            │
│  • wrangler.toml (← UPDATED with route config)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │ (push to main)
                             ↓
        ┌────────────────────────────────────────┐
        │    GITHUB ACTIONS WORKFLOW             │
        │  (triggers on every push to main)      │
        │                                        │
        │  1. Checkout code                      │
        │  2. npm ci (install deps)              │
        │  3. npm run build (→ dist/)            │
        │  4. wrangler deploy (→ Cloudflare)     │
        └────────────────────────────────────────┘
                             │
                             ↓
        ┌────────────────────────────────────────┐
        │    CLOUDFLARE PAGES                    │
        │    Project: job-hunt-app               │
        │                                        │
        │  URLs:                                 │
        │  ✓ job-hunt-frontend.pages.dev        │
        │  ✓ app.cpfcoaching.us (DNS CNAME)     │
        └────────────────────────────────────────┘
                             ↓
        ┌────────────────────────────────────────┐
        │    USERS ACCESS                        │
        │                                        │
        │  https://app.cpfcoaching.us            │
        │  https://job-hunt-frontend.pages.dev   │
        └────────────────────────────────────────┘
                             │
                             ↓
        ┌────────────────────────────────────────┐
        │    FIREBASE (Backend)                  │
        │                                        │
        │  • Firestore (Resumes DB)              │
        │  • Auth (Login)                        │
        │  • Storage (Files)                     │
        │  • Realtime DB                         │
        └────────────────────────────────────────┘
```

---

## Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| Frontend Code | ✅ Ready | GitHub |
| Auto-Deploy CI/CD | ✅ Configured | GitHub Actions |
| Cloudflare Pages | ✅ Live | job-hunt-app |
| app.cpfcoaching.us | ⏳ Awaiting DNS | Need CNAME |
| Resume Data | ✅ All 8 Companies | Firestore |
| Backend API | ✅ Live | Firebase |

---

## Commands Reference

**Local Development:**
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

**Firebase:**
```bash
firebase deploy      # Deploy backend & rules
firebase deploy --only firestore:rules  # Deploy rules only
```

**Manual Cloudflare Deploy (if needed):**
```bash
npm run build
wrangler pages deploy dist --project-name=job-hunt-app
```

---

## Troubleshooting

**GitHub Actions not running?**
- Check: https://github.com/cpfcoaching/job-hunt-frontend/settings/secrets/actions
- Verify: `CLOUDFLARE_API_TOKEN` secret exists

**app.cpfcoaching.us still showing error?**
- Check DNS propagation: https://dns.google.com (search "app.cpfcoaching.us")
- Should point to `job-hunt-app.pages.dev`
- May take 5-30 minutes

**Deploy failed in Actions?**
- Check: GitHub repo → Actions tab → failed workflow
- Look for error in logs (usually npm or wrangler issue)

---

Generated: April 20, 2026
