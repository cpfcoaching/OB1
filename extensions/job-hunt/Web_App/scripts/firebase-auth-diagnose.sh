#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.local"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} not found"
  exit 1
fi

KEY="$(grep '^VITE_FIREBASE_API_KEY=' "${ENV_FILE}" | cut -d= -f2- || true)"
PROJECT_ID="$(grep '^VITE_FIREBASE_PROJECT_ID=' "${ENV_FILE}" | cut -d= -f2- || true)"
AUTH_DOMAIN="$(grep '^VITE_FIREBASE_AUTH_DOMAIN=' "${ENV_FILE}" | cut -d= -f2- || true)"

if [[ -z "${KEY}" || -z "${PROJECT_ID}" ]]; then
  echo "ERROR: Missing VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID in .env.local"
  exit 1
fi

AUTH_HANDLER_REF="https://${AUTH_DOMAIN}"
APP_REF_1="https://app.cpfcoaching.us/"
APP_REF_2="https://cpfcoaching.us/"

check_referrer() {
  local ref="$1"
  local body_file
  body_file="$(mktemp)"

  curl -sS \
    "https://identitytoolkit.googleapis.com/v2/projects/${PROJECT_ID}/config?key=${KEY}" \
    -H "referer: ${ref}" \
    -o "${body_file}" || true

  if grep -q 'API_KEY_SERVICE_BLOCKED' "${body_file}"; then
    echo "FAIL (${ref}): API_KEY_SERVICE_BLOCKED"
    cat "${body_file}"
    rm -f "${body_file}"
    return 1
  fi

  if grep -q 'API_KEY_HTTP_REFERRER_BLOCKED' "${body_file}"; then
    echo "FAIL (${ref}): API_KEY_HTTP_REFERRER_BLOCKED"
    cat "${body_file}"
    rm -f "${body_file}"
    return 1
  fi

  if grep -q 'INSUFFICIENT_PERMISSION' "${body_file}"; then
    echo "PASS (${ref}): key is accepted (endpoint now requires authenticated admin caller)"
    rm -f "${body_file}"
    return 0
  fi

  echo "INFO (${ref}): unexpected response"
  cat "${body_file}"
  rm -f "${body_file}"
}

echo "Diagnosing Firebase Auth API key restrictions"
echo "Project: ${PROJECT_ID}"
echo "Auth domain: ${AUTH_DOMAIN}"

a=0
check_referrer "${APP_REF_1}" || a=1
check_referrer "${APP_REF_2}" || a=1
if [[ -n "${AUTH_DOMAIN}" ]]; then
  check_referrer "${AUTH_HANDLER_REF}/" || a=1
fi

# Validate server-side token-validation compatibility where Referer may be empty.
if grep -q 'API_KEY_HTTP_REFERRER_BLOCKED' <(
  curl -sS "https://identitytoolkit.googleapis.com/v2/projects/${PROJECT_ID}/config?key=${KEY}" || true
); then
  echo "FAIL (<empty referer>): API_KEY_HTTP_REFERRER_BLOCKED"
  a=1
fi

if [[ "$a" -eq 0 ]]; then
  echo "RESULT: OK - no API key restriction blockers detected for browser and empty-referrer paths."
else
  echo "RESULT: BLOCKED - run scripts/firebase-auth-remediate.sh"
  echo "Tip: use './scripts/firebase-auth-remediate.sh --mode server-compatible' when backend calls can have empty referer."
  exit 2
fi
