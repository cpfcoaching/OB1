#!/bin/bash
# Sync secrets from .env.local to GitHub using GitHub CLI
# Install: brew install gh
# Authenticate: gh auth login

set -e

OWNER="cpfcoaching"
REPO="job-hunt-frontend"

echo "🔐 GitHub Secrets Sync Tool (using GitHub CLI)"
echo "=================================================="

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not installed"
    echo "   Install with: brew install gh"
    echo "   Then authenticate with: gh auth login"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated to GitHub"
    echo "   Run: gh auth login"
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found"
    exit 1
fi

echo "✅ Authenticated to GitHub\n"

# Parse .env.local and sync secrets
success=0
failed=0

while IFS='=' read -r key value; do
    # Skip comments, empty lines, and malformed lines
    [[ "$key" =~ ^# ]] && continue
    [[ -z "$key" ]] && continue
    
    # Only sync VITE_ and certain other secrets
    if [[ "$key" == VITE_* ]] || [[ "$key" == CLOUDFLARE_* ]] || [[ "$key" == OPENROUTER_* ]]; then
        echo -n "  Setting $key... "
        
        # Trim whitespace
        key=$(echo "$key" | xargs)
        value=$(echo "$value" | xargs)
        
        # Set the secret
        if echo "$value" | gh secret set "$key" --repo "$OWNER/$REPO" 2>/dev/null; then
            echo "✅"
            ((success++))
        else
            echo "❌"
            ((failed++))
        fi
    fi
done < .env.local

echo "\n=================================================="
echo "✅ Success: $success secrets synced"
if [ $failed -gt 0 ]; then
    echo "❌ Failed: $failed secrets"
fi

echo "\n🚀 Next steps:"
echo "  1. Verify secrets: gh secret list --repo $OWNER/$REPO"
echo "  2. Trigger deployment: git commit --allow-empty -m 'chore: deploy' && git push"
echo "  3. Check: https://github.com/$OWNER/$REPO/actions"
