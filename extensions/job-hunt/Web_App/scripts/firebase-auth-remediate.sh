#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.local"
GCLOUD_BIN="${GCLOUD_BIN:-/Users/MacAttack/google-cloud-sdk/bin/gcloud}"

if [[ ! -x "${GCLOUD_BIN}" ]]; then
  echo "ERROR: gcloud binary not found at ${GCLOUD_BIN}"
  echo "Set GCLOUD_BIN or install Google Cloud SDK."
  exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} not found"
  exit 1
fi

KEY="$(grep '^VITE_FIREBASE_API_KEY=' "${ENV_FILE}" | cut -d= -f2- || true)"
PROJECT_ID="$(grep '^VITE_FIREBASE_PROJECT_ID=' "${ENV_FILE}" | cut -d= -f2- || true)"
AUTH_DOMAIN="$(grep '^VITE_FIREBASE_AUTH_DOMAIN=' "${ENV_FILE}" | cut -d= -f2- || true)"

if [[ -z "${KEY}" || -z "${PROJECT_ID}" || -z "${AUTH_DOMAIN}" ]]; then
  echo "ERROR: Missing VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, or VITE_FIREBASE_AUTH_DOMAIN in .env.local"
  exit 1
fi

KEY_NAME="$(${GCLOUD_BIN} services api-keys lookup "${KEY}" --project="${PROJECT_ID}" --format='value(name)')"
if [[ -z "${KEY_NAME}" ]]; then
  echo "ERROR: Could not look up API key resource name for configured key"
  exit 1
fi

echo "Using key resource: ${KEY_NAME}"

BASE_REFS=(
  "https://app.cpfcoaching.us/*"
  "https://cpfcoaching.us/*"
  "https://${AUTH_DOMAIN}/*"
)

# Include active Vercel aliases used in this project.
VERCEL_REFS=(
  "https://jobhunter-cpf-coaching.vercel.app/*"
  "https://jobhunter-cpf-coaching-cpfcoachings-projects.vercel.app/*"
  "https://jobhunter-cpf-coaching-cpfcoaching-cpfcoachings-projects.vercel.app/*"
)

ALL_REFS="$(printf '%s\n' "${BASE_REFS[@]}" "${VERCEL_REFS[@]}" | sed '/^$/d' | sort -u | paste -sd, -)"

echo "Applying browser referrer restrictions with required auth handler domains"
${GCLOUD_BIN} services api-keys update "${KEY_NAME}" --clear-restrictions --project="${PROJECT_ID}" --quiet
${GCLOUD_BIN} services api-keys update "${KEY_NAME}" --allowed-referrers="${ALL_REFS}" --project="${PROJECT_ID}" --quiet

echo "Updated restrictions:"
${GCLOUD_BIN} services api-keys describe "${KEY_NAME}" --project="${PROJECT_ID}" --format='yaml(restrictions.browserKeyRestrictions.allowedReferrers)'

echo "Running post-fix diagnosis"
"${ROOT_DIR}/scripts/firebase-auth-diagnose.sh"

echo "Remediation complete."
