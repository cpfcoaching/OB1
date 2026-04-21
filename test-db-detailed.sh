#!/bin/bash

# Enhanced Database Connectivity Test
# Tests with proper request methods and headers

echo "🔍 Enhanced Database Connectivity Test"
echo "========================================"
echo ""

# Load .env.local
export $(cat .env.local | grep -v '^#' | xargs)

echo "📋 Configuration Check:"
echo "  ✓ Firebase API Key: ${VITE_FIREBASE_API_KEY:0:20}..."
echo "  ✓ Firebase Project: $VITE_FIREBASE_PROJECT_ID"
echo "  ✓ Supabase URL: https://rjezjfizizzbjuyhxrsj.supabase.co"
echo ""

# Test 1: Firebase Firestore with Authentication
echo "[1/4] Firebase Firestore (GET request)"
FIREBASE_RESPONSE=$(curl -s -i -X GET \
  "https://firestore.googleapis.com/v1/projects/${VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents/resumes?key=${VITE_FIREBASE_API_KEY}" \
  2>&1 | head -20)

FIREBASE_CODE=$(echo "$FIREBASE_RESPONSE" | grep "HTTP" | awk '{print $2}')
echo "Response: HTTP $FIREBASE_CODE"
if [[ "$FIREBASE_CODE" == "403" ]]; then
  echo "⚠️  403 Forbidden - Checking credentials..."
  echo "   This is expected if the API key doesn't have Firestore read permissions"
  echo "   Solution: Ensure Firebase API key has 'Cloud Firestore' enabled in Google Console"
elif [[ "$FIREBASE_CODE" == "401" ]]; then
  echo "❌ 401 Unauthorized - API key invalid"
elif [[ "$FIREBASE_CODE" == "200" ]] || [[ "$FIREBASE_CODE" == "404" ]]; then
  echo "✅ Firebase is reachable and responding"
else
  echo "⚠️  Unexpected response code: $FIREBASE_CODE"
fi
echo ""

# Test 2: Supabase Health Check (direct endpoint)
echo "[2/4] Supabase API Health Check"
SUPABASE_HEALTH=$(curl -s -i -X GET \
  "https://rjezjfizizzbjuyhxrsj.supabase.co/rest/v1/" \
  -H "apikey: ${VITE_JOB_HUNT_MCP_URL##*key=}" \
  2>&1 | head -5)

SUPABASE_HEALTH_CODE=$(echo "$SUPABASE_HEALTH" | grep "HTTP" | awk '{print $2}')
echo "Response: HTTP $SUPABASE_HEALTH_CODE"
if [[ "$SUPABASE_HEALTH_CODE" == "200" ]] || [[ "$SUPABASE_HEALTH_CODE" == "401" ]]; then
  echo "✅ Supabase API is reachable"
else
  echo "⚠️  Supabase API response: $SUPABASE_HEALTH_CODE"
fi
echo ""

# Test 3: Job Hunt MCP Function (POST with proper headers)
echo "[3/4] Supabase MCP - Job Hunt Function"
JOB_HUNT_KEY="${VITE_JOB_HUNT_MCP_URL##*key=}"
JOB_HUNT_RESPONSE=$(curl -s -i -X POST \
  "https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/job-hunt-mcp" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JOB_HUNT_KEY" \
  -d '{"test": true}' \
  2>&1 | head -10)

JOB_HUNT_CODE=$(echo "$JOB_HUNT_RESPONSE" | grep "HTTP" | awk '{print $2}')
echo "Response: HTTP $JOB_HUNT_CODE"
if [[ "$JOB_HUNT_CODE" == "200" ]] || [[ "$JOB_HUNT_CODE" == "201" ]]; then
  echo "✅ Job Hunt MCP function is working"
elif [[ "$JOB_HUNT_CODE" == "401" ]]; then
  echo "⚠️  401 - Auth issue, but function exists"
elif [[ "$JOB_HUNT_CODE" == "404" ]]; then
  echo "⚠️  404 - Function may not be deployed"
else
  echo "⚠️  Response code: $JOB_HUNT_CODE"
fi
echo ""

# Test 4: Open Brain MCP Function
echo "[4/4] Supabase MCP - Open Brain Function"
OPEN_BRAIN_KEY="${VITE_OPEN_BRAIN_MCP_URL##*key=}"
OPEN_BRAIN_RESPONSE=$(curl -s -i -X POST \
  "https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/open-brain-mcp" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPEN_BRAIN_KEY" \
  -d '{"test": true}' \
  2>&1 | head -10)

OPEN_BRAIN_CODE=$(echo "$OPEN_BRAIN_RESPONSE" | grep "HTTP" | awk '{print $2}')
echo "Response: HTTP $OPEN_BRAIN_CODE"
if [[ "$OPEN_BRAIN_CODE" == "200" ]] || [[ "$OPEN_BRAIN_CODE" == "201" ]]; then
  echo "✅ Open Brain MCP function is working"
elif [[ "$OPEN_BRAIN_CODE" == "401" ]]; then
  echo "⚠️  401 - Auth issue, but function exists"
elif [[ "$OPEN_BRAIN_CODE" == "404" ]]; then
  echo "⚠️  404 - Function may not be deployed"
else
  echo "⚠️  Response code: $OPEN_BRAIN_CODE"
fi
echo ""

echo "========================================"
echo "📝 Next Steps:"
echo ""
echo "If Firebase shows 403:"
echo "  1. Go to https://console.firebase.google.com/project/streamdeck-365513"
echo "  2. Verify the API key has Firestore permissions"
echo "  3. Check that the key is a 'Browser Key'"
echo ""
echo "If Supabase shows 401:"
echo "  1. Verify the rotated keys in .env.local are correct"
echo "  2. Check Supabase console for API key settings"
echo "  3. Ensure functions are deployed and published"
echo ""
echo "✅ If you see HTTP 200/201, the connection is working!"
echo "========================================"
