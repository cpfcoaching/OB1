# Cloudflare Pages Environment Variables Setup

The application requires Firebase credentials to load properly in production. Follow these steps to configure them:

## ✅ Step 1: Verify Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create one)
3. Go to **Project Settings** (gear icon)
4. Click the **"Your apps"** section
5. Find your Web app config

## ✅ Step 2: Get Firebase Credentials

Copy these values from your Firebase project:

- **API Key**: `VITE_FIREBASE_API_KEY`
- **Auth Domain**: `VITE_FIREBASE_AUTH_DOMAIN`
- **Project ID**: `VITE_FIREBASE_PROJECT_ID`
- **Storage Bucket**: `VITE_FIREBASE_STORAGE_BUCKET`
- **Messaging Sender ID**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **App ID**: `VITE_FIREBASE_APP_ID`
- **Measurement ID**: `VITE_FIREBASE_MEASUREMENT_ID` (optional)

Example:
```javascript
{
  apiKey: "AIzaSyD...",
  authDomain: "job-hunt.firebaseapp.com",
  projectId: "job-hunt-project",
  storageBucket: "job-hunt-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123...",
  measurementId: "G-XXXXX"
}
```

## ✅ Step 3: Configure Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **job-hunt-app**
3. Click **Settings** → **Environment variables**
4. Add the following variables:

### Production Environment
```
VITE_FIREBASE_API_KEY = AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN = job-hunt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = job-hunt-project
VITE_FIREBASE_STORAGE_BUCKET = job-hunt-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = 123456789012
VITE_FIREBASE_APP_ID = 1:123456789012:web:abc123...
VITE_FIREBASE_MEASUREMENT_ID = G-XXXXX
VITE_ENV = production
VITE_DOMAIN = cisoadvisor.us
VITE_API_BASE_URL = https://api.cisoadvisor.us
```

5. Click **Save** for each variable
6. Once all variables are added, click **Deployments** and **Redeploy** the latest deployment

## ✅ Step 4: Enable Firebase Services

In your Firebase Console:

1. **Authentication**
   - Go to **Authentication** → **Sign-in method**
   - Enable **Google** (required for app login)

2. **Firestore Database**
   - Go to **Firestore Database**
   - Create database in your preferred region
   - Add security rules (see DEPLOYMENT.md)

3. **Google Analytics (Optional)**
   - Enable for better insights

## ✅ Step 5: Verify Deployment

After setting environment variables:

1. In Cloudflare Pages, click the latest deployment
2. Click **Redeploy**
3. Wait for deployment to complete (1-2 minutes)
4. Visit the live URL and test:
   - App loads without errors
   - Resume Builder page displays
   - LinkedIn import section visible
   - No console errors in browser DevTools

## 🔧 Troubleshooting

### "Firebase API Key not configured"
- Check that all Firebase variables are set in Cloudflare
- Redeploy after changing variables
- Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Delete)

### Page shows but functionality doesn't work
- Check browser Console (F12 → Console tab)
- Verify Firebase project is active
- Ensure Google Sign-In is enabled
- Check Firestore security rules

### White screen on load
- Open DevTools (F12)
- Check Console for JavaScript errors
- Verify environment variables are set
- Check Network tab for failed requests

## 📱 Test the App

Once configured:
1. Visit: https://128bfd5f.job-hunt-app.pages.dev (or your custom domain)
2. Click "Sign in with Google"
3. Log in with your Google account
4. Navigate to Resume Builder
5. Test LinkedIn import and document parser

## 🆘 Need Help?

- **Firebase Setup**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Local Development**: Run `npm install && npm run dev`
- **Build Issues**: Check `npm run build` output

---

**Status**: ✅ Application deployed and ready for Firebase configuration
