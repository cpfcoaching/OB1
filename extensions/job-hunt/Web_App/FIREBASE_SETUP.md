# Firebase Configuration Checklist

## 1. Create Firebase Project

- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Click "Create a project"
- [ ] Name: "job-hunt-pipeline"
- [ ] Enable Google Analytics (optional)

## 2. Enable Authentication

- [ ] In Firebase console, go to "Authentication"
- [ ] Click "Get started"
- [ ] Click "Sign-in method"
- [ ] Enable "Google"
- [ ] Set up your project support email
- [ ] Add a project name

## 3. Configure OAuth Consent Screen

- [ ] Go to Google Cloud Console
- [ ] Select your project
- [ ] Navigate to "OAuth consent screen"
- [ ] Choose "External" for user type
- [ ] Fill in required information:
  - App name: "Job Hunt Pipeline"
  - User support email: your-email@example.com
  - Developer contact: your-email@example.com
- [ ] Add "email" scope

## 4. Add Authorized Redirect URIs

In Firebase Authentication settings:

- [ ] Authorized domains:
  - `localhost:5173` (development)
  - `localhost:3000` (alternative dev)
  - Your production domain (e.g., `jobbuntpipeline.com`)

## 5. Get Firebase Config

In Firebase console:
- [ ] Go to Project Settings (gear icon)
- [ ] Scroll down to "Your apps"
- [ ] Click the web icon (</> )
- [ ] Copy the config object

## 6. Create `.env.local` File

Create file in project root:

```env
VITE_FIREBASE_API_KEY=xxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxx
VITE_FIREBASE_PROJECT_ID=xxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxx
VITE_FIREBASE_APP_ID=xxxxx
VITE_FIREBASE_MEASUREMENT_ID=xxxxx
```

## 7. Enable Firestore Database

- [ ] Go to Firestore Database
- [ ] Click "Create database"
- [ ] Start in "Production mode"
- [ ] Choose region (default is fine)
- [ ] Create database

## 8. Configure Firestore Security Rules

In Firestore, go to "Rules" and update:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /users/{userId}/jobs/{jobId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

Click "Publish"

## 9. Test Authentication

```bash
npm run dev
```

Visit `http://localhost:5173`
- [ ] Click "Sign in with Google"
- [ ] Verify redirect to dashboard
- [ ] Check Firebase console for new user
- [ ] Test sign out

## Common Issues

### "popup closed by user" error
- Check browser popup blocker
- Ensure domain is in authorized list

### "Missing or insufficient permissions" error
- Verify Firestore rules are published
- Ensure user UID matches in security rules

### ".env.local not being read"
- Restart dev server
- Ensure file is in project root, not src/

## Production Deployment

For deploying to production:

1. **Update authorized domains:**
   - Add your production domain to Firebase

2. **Update Redirect URIs:**
   - Add production URL to OAuth configuration

3. **Environment variables:**
   - Set up in your hosting platform (Vercel, Netlify, etc.)

4. **Build and deploy:**
   ```bash
   npm run build
   npm run preview  # Test production build locally
   ```

## Testing the Setup

### Using Firebase Emulator (Optional)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start emulator
firebase emulators:start
```

This allows local testing without hitting Firebase cloud.

## Reference Files

- Firebase Config: `src/config/firebase.ts`
- Auth Composable: `src/composables/useAuth.ts`
- Router Config: `src/router/index.ts`
- Environment Variables: `.env.local` (create this file)

## Support

For issues:
1. Check [Firebase Documentation](https://firebase.google.com/docs)
2. Review [Vue Firebase Integration](https://firebase.google.com/docs/firestore/quickstart)
3. Check browser console for detailed error messages
