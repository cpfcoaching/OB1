#!/bin/bash

# Database Connectivity Test Script
# Tests Firebase and Supabase connections with rotated credentials

echo "🔍 Database Connectivity Test"
echo "========================================"
echo ""

# Load .env.local
export $(cat .env.local | grep -v '^#' | xargs)

# Test counters
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
  local name=$1
  local url=$2
  local num=$3
  local total=$4
  
  echo "[$num/$total] Testing: $name"
  echo "    URL: ${url:0:80}..."
  echo ""
  
  # Test with curl
  http_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "$url")
  
  if [ "$http_code" -lt 400 ]; then
    echo "✅ $name: HTTP $http_code (Connected)"
    ((PASSED++))
  else
    echo "⚠️  $name: HTTP $http_code (Error)"
    if [ "$http_code" = "401" ]; then
      echo "   ⚠️  Authentication Failed - Check API Key"
    elif [ "$http_code" = "403" ]; then
      echo "   ⚠️  Permission Denied - Check Key Permissions"
    elif [ "$http_code" = "404" ]; then
      echo "   ℹ️  Resource Not Found (expected for empty collections)"
    fi
    ((FAILED++))
  fi
  echo ""
}

# Test Firebase Firestore
test_endpoint \
  "Firebase Firestore" \
  "https://firestore.googleapis.com/v1/projects/${VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents/resumes?key=${VITE_FIREBASE_API_KEY}" \
  1 3

# Test Supabase MCP - Job Hunt
test_endpoint \
  "Supabase MCP - Job Hunt" \
  "${VITE_JOB_HUNT_MCP_URL}" \
  2 3

# Test Supabase MCP - Open Brain
test_endpoint \
  "Supabase MCP - Open Brain" \
  "${VITE_OPEN_BRAIN_MCP_URL}" \
  3 3

# Summary
echo "========================================"
echo "📊 Summary"
echo ""
echo "Passed: $PASSED/3"
echo "Failed: $FAILED/3"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "✅ All connectivity tests passed!"
  echo ""
  exit 0
else
  echo "⚠️  Some tests failed. Check credentials."
  echo ""
  exit 1
fi
