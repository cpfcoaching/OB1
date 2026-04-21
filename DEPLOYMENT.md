# Job Hunt Pipeline Frontend - Complete Deployment Guide

This guide covers setup, Firebase configuration, Firestore security, MFA setup, and Cloudflare Pages deployment.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Firebase Configuration](#firebase-configuration)
3. [Firestore Setup](#firestore-setup)
4. [MFA Configuration](#mfa-configuration)
5. [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
6. [Domain Configuration](#domain-configuration)
7. [Troubleshooting](#troubleshooting)

---

## Development Setup

### 1. Install Dependencies

```bash
cd ~/Projects/job-hunt-frontend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Firebase credentials:

```env
# Get these from Firebase Console > Project Settings
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
VITE_FIREBASE_MEASUREMENT_ID=G-XXXX

# OpenBrain MCP Integration
VITE_JOB_HUNT_MCP_URL=https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/job-hunt-mcp?key=[REDACTED_SUPABASE_PUBLISHABLE_KEY]
VITE_OPEN_BRAIN_MCP_URL=https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/open-brain-mcp?key=[REDACTED_SUPABASE_PUBLISHABLE_KEY]

# Domain Configuration
VITE_DOMAIN=cisoadvisor.us
VITE_API_BASE_URL=https://api.cisoadvisor.us
VITE_ENV=development
```

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:5173

---

## Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name it "job-hunt-pipeline" or similar
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Get Firebase Credentials

1. Go to Project Settings (gear icon)
2. Under "Your apps", click "Web" to create web app
3. Register app as "job-hunt-frontend"
4. Copy the config object - these are your env vars

Example config:
```javascript
{
  apiKey: "AIzaSyD...",
  authDomain: "job-hunt-ai.firebaseapp.com",
  projectId: "job-hunt-ai",
  storageBucket: "job-hunt-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123...",
  measurementId: "G-XXXX"
}
```

### Step 3: Enable Google Sign-In

1. In Firebase Console, go to Authentication
2. Click "Sign-in method"
3. Click "Google"
4. Enable it
5. Set project support email

### Step 4: Enable Firestore Database

1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select region (us-central1 recommended)
5. Create database

---

## Firestore Setup

### Step 1: Create Collections

In Firestore Console, create these collections:

#### Collection: `users`

Structure:
```json
{
  "email": "user@example.com",
  "displayName": "Full Name",
  "photoURL": "https://lh3.googleusercontent.com/...",
  "mfaEnabled": false,
  "mfaSecret": null,
  "mfaVerified": false,
  "mfaEnabledAt": null,
  "createdAt": "2024-04-18T12:00:00Z"
}
```

#### Collection: `companies`

Structure:
```json
{
  "userId": "auth_uid",
  "name": "TechCorp Inc",
  "industry": "Software",
  "size": "100-500",
  "location": "San Francisco, CA",
  "website": "https://techcorp.com",
  "notes": "Remote-first, strong engineering culture",
  "createdAt": "2024-04-18T12:00:00Z",
  "updatedAt": "2024-04-18T12:00:00Z"
}
```

#### Collection: `job_postings`

Structure:
```json
{
  "userId": "auth_uid",
  "companyId": "companies/doc_id",
  "title": "Senior AI Engineer",
  "level": "senior",
  "salary": "$150,000 - $200,000",
  "location": "Remote",
  "url": "https://linkedin.com/jobs/...",
  "postedDate": "2024-04-15T00:00:00Z",
  "notes": "Found via LinkedIn",
  "createdAt": "2024-04-18T12:00:00Z",
  "updatedAt": "2024-04-18T12:00:00Z"
}
```

#### Collection: `applications`

Structure:
```json
{
  "userId": "auth_uid",
  "postingId": "job_postings/doc_id",
  "companyId": "companies/doc_id",
  "appliedDate": "2024-04-18T12:00:00Z",
  "status": "applied",
  "resumeVersion": "v3",
  "notes": "Applied via company website",
  "createdAt": "2024-04-18T12:00:00Z",
  "updatedAt": "2024-04-18T12:00:00Z"
}
```

**Status values:** `applied` | `interviewing` | `offered` | `rejected` | `withdrawn`

#### Collection: `interviews`

Structure:
```json
{
  "userId": "auth_uid",
  "applicationId": "applications/doc_id",
  "companyId": "companies/doc_id",
  "type": "phone",
  "scheduledAt": "2024-04-20T14:00:00Z",
  "notes": "Phone screen with recruiter",
  "feedbackReceived": null,
  "createdAt": "2024-04-18T12:00:00Z",
  "updatedAt": "2024-04-18T12:00:00Z"
}
```

**Type values:** `phone` | `video` | `in-person` | `panel`

#### Collection: `job_contacts`

Structure:
```json
{
  "userId": "auth_uid",
  "companyId": "companies/doc_id",
  "name": "Sarah Chen",
  "title": "Senior Recruiter",
  "email": "sarah@techcorp.com",
  "phone": "+1 (555) 123-4567",
  "linkedIn": "https://linkedin.com/in/sarahchen",
  "notes": "Referred by John, warm lead",
  "createdAt": "2024-04-18T12:00:00Z",
  "updatedAt": "2024-04-18T12:00:00Z"
}
```

### Step 2: Create Indexes

Firestore will suggest indexes as you query. Recommended indexes:

```
Collection: applications
- Fields: userId (Ascending), status (Ascending)
- Fields: userId (Ascending), appliedDate (Descending)

Collection: interviews
- Fields: userId (Ascending), scheduledAt (Ascending)
- Fields: userId (Ascending), type (Ascending)

Collection: job_postings
- Fields: userId (Ascending), postedDate (Descending)

Collection: job_contacts
- Fields: userId (Ascending), companyId (Ascending)
```

### Step 3: Enable Firestore Security Rules

Go to Firestore > Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Users can read/write their own document
    match /users/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read, update: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own company records
    match /companies/{companyId} {
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && 
                                     resource.data.userId == request.auth.uid;
    }
    
    // Similar rules for other collections
    match /job_postings/{postingId} {
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && 
                                     resource.data.userId == request.auth.uid;
    }
    
    match /applications/{appId} {
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && 
                                     resource.data.userId == request.auth.uid;
    }
    
    match /interviews/{interviewId} {
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && 
                                     resource.data.userId == request.auth.uid;
    }
    
    match /job_contacts/{contactId} {
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && 
                                     resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## MFA Configuration

### User Flow

1. **First Login:** User signs in with Google
2. **MFA Setup:** System generates TOTP secret and QR code
3. **Authenticator:** User scans QR with authenticator app (Google Authenticator, Authy, etc.)
4. **Verification:** User enters 6-digit code to verify
5. **Backup Codes:** System generates 10 backup codes for account recovery

### Implementation Details

The MFA system uses:
- **TOTP Standard:** RFC 6238 (Time-based One-Time Password)
- **Library:** Speakeasy.js for token generation
- **QR Code:** QRCode.js for QR generation
- **Storage:** Firestore (MFA secret encrypted at rest)

### Enable MFA for Users

Users can enable MFA in the app settings:

1. Sign in
2. Go to Account Settings (top right)
3. Click "Enable Two-Factor Authentication"
4. Scan QR code with authenticator app
5. Enter verification code
6. Save backup codes securely

### Backup Codes

If user loses access to authenticator:
1. Click "I can't access my authenticator"
2. Enter a backup code instead
3. Set up new authenticator on next login

---

## Cloudflare Pages Deployment

The project uses **GitHub Actions + Wrangler** as the single CI/CD pipeline. Do **not** enable Cloudflare's built-in Git integration for this repository — it would create a duplicate pipeline and double-bill build minutes.

### Cloudflare Pages project details

| Setting | Value |
|---------|-------|
| Project name | `job-hunt-app` |
| Build output directory | `dist` |
| Production URL | `https://app.cpfcoaching.us` |
| Pages default URL | `https://job-hunt-app.pages.dev` |

### GitHub Actions auto-deploy (recommended)

Every push to `main` triggers `.github/workflows/deploy.yml`, which:

1. Checks out code
2. Installs dependencies (`npm ci`)
3. Builds the app (`npm run build`) with all `VITE_*` env vars baked in
4. Deploys `dist/` to Cloudflare Pages via Wrangler

**Required GitHub repository secrets** (Settings → Secrets → Actions):

| Secret | Where to get it |
|--------|----------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens (Pages: Edit permission) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right-hand sidebar |
| `VITE_FIREBASE_API_KEY` | Firebase Console → Project Settings → Your apps |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Console → Project Settings → Your apps |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Console → Project Settings → Your apps |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Console → Project Settings → Your apps |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Project Settings → Your apps |
| `VITE_FIREBASE_APP_ID` | Firebase Console → Project Settings → Your apps |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Console → Project Settings → Your apps |
| `VITE_JOB_HUNT_MCP_URL` | Supabase project → Functions → job-hunt-mcp |
| `VITE_OPEN_BRAIN_MCP_URL` | Supabase project → Functions → open-brain-mcp |
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics → Admin → Data Streams |
| `VITE_LINKEDIN_PARTNER_ID` | LinkedIn Campaign Manager → Insight Tag |
| `VITE_DOMAIN` | `cpfcoaching.us` |
| `VITE_API_BASE_URL` | `https://api.cpfcoaching.us` |

> **Note:** `VITE_ENV` is automatically set to `production` by the workflow and does not need to be added as a secret.

### Manual CLI deployment (when Actions is unavailable)

```bash
# Install Wrangler
npm install -g wrangler

# Authenticate
wrangler login

# Build and deploy
npm run build
wrangler pages deploy dist --project-name=job-hunt-app
```

---

## Domain Configuration

### Using app.cpfcoaching.us

#### Step 1: Add CNAME in Cloudflare DNS

In **Cloudflare Dashboard → cpfcoaching.us → DNS**:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `app` | `job-hunt-app.pages.dev` | Proxied (orange cloud) |

#### Step 2: Add Custom Domain in Cloudflare Pages

1. Open Cloudflare Pages → `job-hunt-app` project
2. Go to **Custom domains**
3. Click **Set up a custom domain**
4. Enter `app.cpfcoaching.us`
5. Confirm — Cloudflare will auto-issue and renew the SSL certificate

#### Step 3: SSL/TLS

Cloudflare Pages manages TLS automatically. In **SSL/TLS** settings for `cpfcoaching.us`:

1. Set encryption mode to **Full (strict)**
2. Enable **Always Use HTTPS**
3. Enable **Automatic HTTPS Rewrites**

#### Step 4: Firewall Rules (Optional)

Add a WAF custom rule in Cloudflare if geo-blocking is required:

```
(ip.geoip.country in {"CN" "RU"}) -> Block
```

---

## Production Checklist

Before going live:

- [ ] Firebase project created and configured
- [ ] Firestore collections created with security rules deployed (`firebase deploy --only firestore:rules`)
- [ ] Google Sign-In enabled in Firebase Authentication
- [ ] All GitHub repository secrets added (see table above)
- [ ] Build passes locally: `npm run build`
- [ ] Preview works locally: `npm run preview`
- [ ] GitHub Actions workflow succeeds on push to `main`
- [ ] `app.cpfcoaching.us` CNAME set to `job-hunt-app.pages.dev` (proxied)
- [ ] Custom domain `app.cpfcoaching.us` added in Cloudflare Pages and SSL active
- [ ] Login flow verified at https://app.cpfcoaching.us
- [ ] Firestore reads/writes verified (create a test job entry)
- [ ] Deep-link refresh works (navigate to a route, refresh — should not 404)
- [ ] Google Analytics events firing (check GA4 Realtime report)
- [ ] OpenBrain MCP integration tested

---

## Monitoring & Logging

### Firebase Console

Monitor:
- Authentication usage
- Firestore read/write operations
- Real-time database activity
- Storage usage

### Cloudflare Analytics

Monitor:
- Page load times
- Error rates
- Traffic geography
- Caching performance

### Browser DevTools

Check:
- Network tab for API calls
- Console for JavaScript errors
- Application tab for localStorage/auth tokens

---

## Troubleshooting

### Firebase Auth Not Working

**Problem:** "Cannot find module 'firebase'"

**Solution:**
```bash
npm install firebase
```

**Problem:** "API key invalid" error

**Solution:**
- Verify Firebase credentials in .env.local
- Check Firebase project settings
- Ensure web app is registered in Firebase

### Google Sign-In Failing

**Problem:** "Popup blocked" or "Sign-in failed"

**Solution:**
- Enable Google Sign-In in Firebase Authentication
- Add domain to OAuth consent screen
- Test on localhost first

### Firestore Errors

**Problem:** "Permission denied" errors

**Solution:**
- Check Firestore security rules
- Verify user is authenticated (check auth.uid)
- Ensure userId matches in Firestore documents

**Problem:** "Collection not found"

**Solution:**
- Create collections manually in Firestore Console
- Or use SDK to create on first write

### Cloudflare Pages Deployment

**Problem:** "Build failed"

**Solution:**
```bash
# Test build locally
npm run build
# Check for TypeScript errors
npm run type-check
```

**Problem:** "404 on refresh"

**Solution:**
- Ensure `_redirects` file exists in public directory
- Cloudflare Pages automatically handles SPA routing

**Problem:** "Environment variables not loading"

**Solution:**
- Verify variables are set in Cloudflare Pages settings
- Restart deployment after adding variables
- Use prefix `VITE_` for client-side vars

### MFA Issues

**Problem:** "Cannot scan QR code"

**Solution:**
- Try different authenticator apps (Google Authenticator, Authy)
- Check QR code generation is working

**Problem:** "Token always invalid"

**Solution:**
- Ensure device time is synced (TOTP is time-dependent)
- Try backup code instead
- Regenerate secret and try again

---

## Support & Resources

- **Vue 3 Docs:** https://vuejs.org
- **Firebase Docs:** https://firebase.google.com/docs
- **Vite Docs:** https://vitejs.dev
- **Cloudflare Pages:** https://pages.cloudflare.com
- **Job Hunt Pipeline:** https://github.com/NateBJones-Projects/OB1/tree/main/extensions/job-hunt

---

**Last Updated:** April 20, 2026
