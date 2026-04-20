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

### Option 1: GitHub Actions (Recommended)

#### Step 1: Connect Repository

1. Push code to GitHub
2. In Cloudflare Pages, click "Create a project"
3. Connect your GitHub account
4. Select the job-hunt-frontend repository
5. Click "Begin setup"

#### Step 2: Configure Build

- **Framework preset:** None (Vue.js)
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/`

#### Step 3: Set Environment Variables

In Cloudflare Pages project settings:
1. Go to Settings > Environment variables
2. Add all variables from `.env.local`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# ... etc
```

#### Step 4: Deploy

Click "Save and deploy" - Cloudflare will automatically build and deploy on every push to main.

### Option 2: Manual CLI Deployment

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
npm run build
wrangler pages deploy dist --project-name job-hunt-frontend
```

### Option 3: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build and deploy:
```bash
docker build -t job-hunt-frontend .
docker run -p 3000:3000 job-hunt-frontend
```

---

## Domain Configuration

### Using cisoadvisor.us Domain

#### Step 1: Update DNS Records

If DNS is hosted elsewhere (not Cloudflare):

1. Add CNAME record:
   - **Name:** job-hunt
   - **Type:** CNAME
   - **Value:** job-hunt-frontend.pages.dev

2. Or use A records if required:
   - **Type:** A
   - **Value:** 192.0.2.1 (Cloudflare's edge IP)

#### Step 2: Add Custom Domain in Cloudflare

1. In Cloudflare Pages project
2. Go to "Custom domains"
3. Click "Set up custom domain"
4. Enter `job-hunt.cisoadvisor.us`
5. Verify DNS configuration
6. Activate

#### Step 3: SSL/TLS

1. In Cloudflare, go to SSL/TLS
2. Ensure "Flexible" or "Full" mode (Pages auto-manages)
3. Enable "Auto HTTPS Rewrites"
4. Enable "Always Use HTTPS"

#### Step 4: Firewall Rules (Optional)

Add security rules in Cloudflare:

```
(cf.country eq "CN" or cf.country eq "RU") -> Block
```

---

## Production Checklist

Before going live:

- [ ] Firebase project created and configured
- [ ] Firestore collections created with security rules
- [ ] Google Sign-In enabled
- [ ] Environment variables set in Cloudflare
- [ ] Build tested locally: `npm run build`
- [ ] Preview tested: `npm run preview`
- [ ] Deployed to Cloudflare Pages
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] MFA tested with user account
- [ ] Firestore data persistence verified
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

**Last Updated:** April 18, 2026
