# ⚡ Quick Fix: Get Your App Running in 2 Minutes

If you want to see the app working **immediately** while you get your Firebase keys:

## Option A: Use a Test Firebase Project (Fastest)

1. **Go to:** https://console.firebase.google.com
2. **Create project** called "job-hunt-test"
3. **Settings** → Copy your web config (all 7 values)
4. **Paste values** into Cloudflare environment variables:
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID
   - VITE_FIREBASE_MEASUREMENT_ID

5. **Enable Google Sign-In** in Firebase (Authentication → Sign-in method)
6. **Redeploy** on Cloudflare Pages

**Result:** App fully functional ✅

---

## Option B: Mock Data (Demo Only - No Login)

If you want to bypass Firebase temporarily:

Edit: `src/composables/useAuth.ts`

Replace:
```typescript
const initializeAuth = async () => {
  // Firebase init
}
```

With:
```typescript
const initializeAuth = async () => {
  // Demo mode - skip Firebase
  user.value = {
    uid: 'demo-user-123',
    email: 'demo@example.com',
    displayName: 'Demo User'
  }
}
```

Then rebuild: `npm run build && wrangler pages deploy dist --project-name job-hunt-app`

---

## Recommended: Go with Option A

It's the fastest and proper way. Just:
1. 5 min: Create free Firebase project
2. 2 min: Copy 7 keys
3. 5 min: Paste in Cloudflare
4. Done! ✅

**See FIREBASE_KEYS_SETUP.md for step-by-step guide**
