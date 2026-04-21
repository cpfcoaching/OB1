# Secret Exposure Mitigation Strategy

**Date:** April 20, 2026  
**Status:** IN PROGRESS  
**Risk Level:** 🔴 HIGH

---

## Executive Summary

Your `.env.local` file containing critical API credentials was accidentally committed and pushed to the public GitHub repository. This file is now visible in git history and accessible to anyone with the repo URL.

**Exposed Secrets:**
1. Cloudflare API Token (CRITICAL - deploy access)
2. Supabase API Keys (HIGH - database access)
3. Firebase API Key (MEDIUM - public by design but refresh recommended)
4. MCP Server URLs with embedded credentials (HIGH)

---

## Mitigation Plan (One-by-One)

### Phase 1: Immediate - Disable & Rotate Critical Credentials

#### Step 1: Cloudflare API Token
**Risk Level:** 🔴 CRITICAL (can deploy, delete, modify everything)  
**Exposed Token:** `[REDACTED_CLOUDFLARE_TOKEN]`

**Actions:**
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Find the exposed token
3. Click **"Delete"**
4. Click **"Create Token"** → use template "Edit Cloudflare Workers"
5. Grant: `Account:Cloudflare Pages:Edit`
6. **Copy the new token**
7. Go to: https://github.com/cpfcoaching/job-hunt-frontend/settings/secrets/actions
8. Click on `CLOUDFLARE_API_TOKEN`
9. Click **"Update"**
10. Paste new token
11. Click **"Update secret"** ✓
12. **Status:** ✅ NEW TOKEN READY

---

#### Step 2: Supabase API Keys
**Risk Level:** 🔴 HIGH (database & function access)  
**Exposed Keys:**
- Publishable: `[REDACTED_SUPABASE_PUBLISHABLE_KEY]`
- Private: `[REDACTED_SUPABASE_PUBLISHABLE_KEY]`

**Actions:**
1. Go to: https://supabase.com/dashboard/projects
2. Select your project
3. Go to **Settings → API**
4. Under "Project API Keys" section
5. Click **"Rotate"** on the exposed key(s)
6. **Copy new keys**
7. Update `.env.local`:
   ```bash
   VITE_JOB_HUNT_MCP_URL=https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/job-hunt-mcp?key=YOUR_NEW_KEY_HERE
   VITE_OPEN_BRAIN_MCP_URL=https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/open-brain-mcp?key=YOUR_NEW_KEY_HERE
   ```
8. Do NOT commit yet (wait for Phase 2)
9. **Status:** ⏳ WAITING FOR NEW KEYS

---

#### Step 3: Firebase API Key
**Risk Level:** 🟡 MEDIUM (public by design, but rotate for safety)  
**Exposed Key:** `[REDACTED_FIREBASE_KEY]`

**Actions:**
1. Go to: https://console.firebase.google.com/project/streamdeck-365513/settings/general
2. Click **"App credentials"** → **"Web"**
3. Copy the new API key shown in the config snippet
4. Update `.env.local`:
   ```bash
   VITE_FIREBASE_API_KEY=YOUR_NEW_KEY_HERE
   ```
5. Do NOT commit yet (wait for Phase 2)
6. **Status:** ⏳ WAITING FOR NEW KEY

---

### Phase 2: Clean Git History

Once all credentials are rotated and new ones stored locally:

```bash
cd /Users/MacAttack/Projects/job-hunt-frontend

# Step 1: Remove from tracking
git rm --cached .env.local

# Step 2: Add to gitignore
echo ".env.local" >> .gitignore

# Step 3: Commit
git add .gitignore
git commit -m "Security: Remove .env.local from git tracking and add to .gitignore"

# Step 4: Push
git push origin main

# Step 5: OPTIONAL - Clean git history (requires force push)
# git filter-repo --path .env.local --invert-paths
# git push origin main --force
```

---

### Phase 3: Secure .env.local Locally

Update your local `.env.local` with NEW credentials only:

```bash
# DO NOT COMMIT THIS FILE
# ~/.gitignore is set to ignore .env.local
# This file stays local only
```

**Current .env.local location:** `/Users/MacAttack/Projects/job-hunt-frontend/.env.local`

---

## Checklist

### ✅ To-Do List

- [ ] **Cloudflare API Token**
  - [ ] Delete old token from Cloudflare dashboard
  - [ ] Create new token
  - [ ] Update GitHub secret: `CLOUDFLARE_API_TOKEN`
  - [ ] Test deployment works with new token

- [ ] **Supabase API Keys**
  - [ ] Rotate publishable key in Supabase console
  - [ ] Rotate private key in Supabase console
  - [ ] Update both URLs in `.env.local`
  - [ ] Test MCP endpoints work

- [ ] **Firebase API Key**
  - [ ] Copy new key from Firebase console
  - [ ] Update `VITE_FIREBASE_API_KEY` in `.env.local`
  - [ ] Test app loads without errors

- [ ] **Git Cleanup**
  - [ ] Remove `.env.local` from git tracking
  - [ ] Add `.env.local` to `.gitignore`
  - [ ] Commit and push
  - [ ] Verify file no longer in git history

- [ ] **Verification**
  - [ ] Verify `.env.local` not in new commits
  - [ ] Test GitHub Actions deployment with new Cloudflare token
  - [ ] Confirm app works at both URLs
  - [ ] Check no errors in browser console

---

## Automated Script (Optional)

Once you have new credentials, I can run this script to automate the cleanup:

```bash
#!/bin/bash

# Step 1: Update .env.local with new credentials (manually do this first)
# Edit: /Users/MacAttack/Projects/job-hunt-frontend/.env.local

# Step 2: Remove from git tracking
cd /Users/MacAttack/Projects/job-hunt-frontend
git rm --cached .env.local

# Step 3: Create/update .gitignore
cat >> .gitignore << 'EOF'
.env.local
.env.*.local
EOF

# Step 4: Commit
git add .gitignore
git commit -m "Security: Remove .env.local from version control and add to .gitignore"

# Step 5: Push
git push origin main

# Step 6: Verify removal
echo "Verifying .env.local is no longer tracked..."
git ls-files | grep ".env.local" && echo "❌ FAILED - File still tracked" || echo "✅ SUCCESS - File removed from tracking"
```

---

## Risk Assessment

| Credential | Risk Level | Exposure Time | Impact | Status |
|-----------|-----------|---------------|--------|--------|
| Cloudflare API Token | 🔴 CRITICAL | Unknown | Full deployment access | PENDING |
| Supabase Keys | 🔴 HIGH | Unknown | Database + functions | PENDING |
| Firebase API Key | 🟡 MEDIUM | Unknown | App data access | PENDING |
| MCP URLs | 🔴 HIGH | Unknown | MCP service hijack | PENDING |

---

## After Mitigation

**Long-term Security:**
1. ✅ Never commit `.env.local`
2. ✅ Always use GitHub Secrets for CI/CD tokens
3. ✅ Rotate credentials quarterly
4. ✅ Use `.env.example` with placeholder values
5. ✅ Enable branch protection rules
6. ✅ Enable secret scanning on GitHub

---

## Next Steps

**You Should Do:**
1. Generate new Cloudflare API token
2. Rotate Supabase keys
3. Get new Firebase key
4. Tell me when ready to clean git history

**I Can Help With:**
1. Running the git cleanup script
2. Rebuilding and pushing with new credentials
3. Testing the deployment
4. Verifying file removed from history

---

**Timeline:** Complete by EOD to minimize exposure window  
**Contact:** Escalate if any issues during rotation process
