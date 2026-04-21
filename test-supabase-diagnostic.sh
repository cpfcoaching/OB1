#!/bin/bash

# Detailed Supabase API Key Diagnostic

echo "🔍 Supabase API Key Diagnostic Test"
echo "========================================"
echo ""

# Load .env.local
export $(cat .env.local | grep -v '^#' | xargs)

echo "📋 Current Configuration:"
echo "  URL: https://rjezjfizizzbjuyhxrsj.supabase.co"
echo "  MCP URL (Job Hunt): ${VITE_JOB_HUNT_MCP_URL}"
echo "  MCP URL (Open Brain): ${VITE_OPEN_BRAIN_MCP_URL}"
echo ""

# Extract key from URL
JOB_HUNT_KEY="${VITE_JOB_HUNT_MCP_URL##*key=}"
OPEN_BRAIN_KEY="${VITE_OPEN_BRAIN_MCP_URL##*key=}"

echo "🔑 Extracted Keys:"
echo "  Job Hunt Key: ${JOB_HUNT_KEY:0:30}..."
echo "  Open Brain Key: ${OPEN_BRAIN_KEY:0:30}..."
echo ""

# Test 1: Direct function call with key in URL
echo "[1] Testing Job Hunt MCP with key in URL:"
curl -v -X GET "${VITE_JOB_HUNT_MCP_URL}" 2>&1 | grep -E "HTTP|<|{" | head -20
echo ""
echo ""

# Test 2: Function with Authorization header
echo "[2] Testing Job Hunt MCP with Authorization header:"
curl -v -X POST \
  "https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/job-hunt-mcp" \
  -H "Authorization: Bearer $JOB_HUNT_KEY" \
  -H "Content-Type: application/json" \
  -d '{}' 2>&1 | grep -E "HTTP|Authorization|{|error" | head -20
echo ""
echo ""

# Test 3: Check if function exists (OPTIONS)
echo "[3] Checking if MCP function exists (OPTIONS):"
curl -v -X OPTIONS \
  "${VITE_JOB_HUNT_MCP_URL}" 2>&1 | grep -E "HTTP|Allow|error" | head -10
echo ""
echo ""

# Test 4: Simple health check to Supabase
echo "[4] Supabase REST API health check:"
curl -s -i "https://rjezjfizizzbjuyhxrsj.supabase.co/rest/v1/" \
  -H "apikey: ${JOB_HUNT_KEY}" | head -15
echo ""

echo "========================================"
echo "✅ Check the responses above:"
echo "  - HTTP 200/201: Connection working!"
echo "  - HTTP 401: Authentication failed - verify key"
echo "  - HTTP 404: Function not found/not deployed"
echo "  - HTTP 405: Method not allowed (try POST)"
echo "========================================"
