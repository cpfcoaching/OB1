# 🔑 Firebase Setup - Get Your Keys & Configure Cloudflare

## ⏱️ This takes 5-10 minutes

---

## STEP 1: Get Your Firebase Credentials
**Location:** https://console.firebase.google.com

### A. Create or Select Firebase Project
1. Go to https://console.firebase.google.com
2. Click **+ Add project** OR select existing project
3. Name it (e.g., "job-hunt" or "cisoadvisor")
4. Click **Create project** (2-3 minutes to initialize)

### B. Get Your Web App Config
1. In Firebase Console, click ⚙️ **Project Settings** (top left area)
2. Click the **"Your apps"** tab
3. Look for a **Web** app icon
4. If no web app exists:
   - Click **Web** icon (looks like `</>`): 
   - Register as "job-hunt-frontend"
   - Copy your config
5. If web app exists, click it to view config

### C. Copy These 7 Values

Your config will look like this. **COPY each value**:

```
apiKey: "AIzaSyD..."                          → VITE_FIREBASE_API_KEY
authDomain: "job-hunt.firebaseapp.com"       → VITE_FIREBASE_AUTH_DOMAIN  
projectId: "job-hunt-12345"                  → VITE_FIREBASE_PROJECT_ID
storageBucket: "job-hunt-12345.appspot.com"  → VITE_FIREBASE_STORAGE_BUCKET
messagingSenderId: "123456789012"            → VITE_FIREBASE_MESSAGING_SENDER_ID
appId: "1:123456789012:web:abc123def456"    → VITE_FIREBASE_APP_ID
measurementId: "G-ABC123XYZ"                 → VITE_FIREBASE_MEASUREMENT_ID
```

---

## STEP 2: Set Environment Variables in Cloudflare

**Location:** https://dash.cloudflare.com → Pages → job-hunt-app

### A. Open Cloudflare Pages Settings
1. Go to https://dash.cloudflare.com
2. Click **Pages** (left sidebar)
3. Click **job-hunt-app** project
4. Click **Settings** (top menu)
5. Click **Environment variables** (left sidebar)

### B. Add Each Variable

For **Production** environment, click **Add variable** for each:

| Variable Name | Value |
|---|---|
| VITE_FIREBASE_API_KEY | `AIzaSyD...` (from Step 1) |
| VITE_FIREBASE_AUTH_DOMAIN | `job-hunt.firebaseapp.com` |
| VITE_FIREBASE_PROJECT_ID | `job-hunt-12345` |
| VITE_FIREBASE_STORAGE_BUCKET | `job-hunt-12345.appspot.com` |
| VITE_FIREBASE_MESSAGING_SENDER_ID | `123456789012` |
| VITE_FIREBASE_APP_ID | `1:123456789012:web:abc123def456` |
| VITE_FIREBASE_MEASUREMENT_ID | `G-ABC123XYZ` |

**Each time:**
1. Click **Add variable**
2. Paste variable name (e.g., `VITE_FIREBASE_API_KEY`)
3. Paste value from Firebase
4. Click **Save**
5. Repeat for all 7 variables

---

## STEP 3: Redeploy App

1. In Cloudflare Pages → **job-hunt-app**
2. Click **Deployments** tab
3. Find latest deployment
4. Click **...** (three dots)
5. Click **Redeploy**
6. Wait 1-2 minutes for deployment to complete ✅

---

## STEP 4: Enable Firebase Services

Go back to https://console.firebase.google.com

### A. Enable Google Sign-In
1. Click **Authentication** (left menu)
2. Click **Sign-in method**
3. Find **Google** and click it
4. Toggle **Enable** ✅
5. Set support email
6. Click **Save**

### B. Create Firestore Database
1. Click **Firestore Database** (left menu)
2. Click **Create Database**
3. Choose **Start in test mode** (for now)
4. Select region: **us-central1** (recommended)
5. Click **Create**

---

## ✅ VERIFY APP IS WORKING

1. Visit your app: https://app.cpfcoaching.us/login
2. You should see **Sign in with Google** button
3. **NO ERROR MESSAGES** ✅
4. Click button and test login
5. After login, go to **Resume Builder** page
6. Test LinkedIn import or document parser

---

## 🆘 TROUBLESHOOTING

### Still seeing "Firebase: Error (auth/api-key-not-valid)"
- **Solution:** Double-check all 7 variables are entered correctly in Cloudflare
- Typos in keys will cause this error
- Make sure you're editing **Production** environment
- After saving, click **Redeploy** deployment

### White screen / nothing loads
- Press **F12** to open DevTools
- Click **Console** tab
- Look for error messages
- Screenshot any errors and share

### App loads but buttons don't work
- Firebase variables are set but services (Google Sign-In, Firestore) not enabled
- Follow **STEP 4** above to enable them

---

## 📋 Checklist

- [ ] Firebase project created/selected
- [ ] 7 credentials copied from Firebase
- [ ] All 7 environment variables added to Cloudflare
- [ ] App redeployed
- [ ] Google Sign-In enabled in Firebase
- [ ] Firestore Database created in Firebase
- [ ] App loads without errors at app.cpfcoaching.us/login
- [ ] Can click "Sign in with Google"

---

## 💡 DO NOT SKIP

The app **cannot work** without Firebase credentials. These are required for:
- ✅ Google login
- ✅ User data storage
- ✅ Resume data persistence
- ✅ All app features

If you have any questions, check the error in DevTools Console (F12).
