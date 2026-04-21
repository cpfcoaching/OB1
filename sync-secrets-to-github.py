#!/usr/bin/env python3
"""
Sync secrets from .env.local to GitHub repository secrets
Requires: GitHub Personal Access Token with 'repo' and 'admin:repo_hook' scopes
"""

import os
import sys
import json
import base64
import requests
from pathlib import Path
from typing import Dict, Tuple

def get_env_vars() -> Dict[str, str]:
    """Read and parse .env.local file"""
    env_file = Path('.env.local')
    if not env_file.exists():
        print("❌ Error: .env.local not found")
        sys.exit(1)
    
    env_vars = {}
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            # Skip comments and empty lines
            if line.startswith('#') or not line or '=' not in line:
                continue
            key, value = line.split('=', 1)
            env_vars[key.strip()] = value.strip()
    
    return env_vars

def get_github_token() -> str:
    """Get GitHub token from environment or prompt user"""
    token = os.environ.get('GITHUB_TOKEN')
    if not token:
        print("⚠️  GitHub token not found in GITHUB_TOKEN environment variable")
        token = input("🔑 Paste your GitHub Personal Access Token (keep it secret!): ").strip()
        if not token:
            print("❌ Token is required")
            sys.exit(1)
    return token

def get_repo_public_key(owner: str, repo: str, token: str) -> Tuple[str, str]:
    """Fetch repository's public key for secret encryption"""
    url = f"https://api.github.com/repos/{owner}/{repo}/actions/secrets/public-key"
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"❌ Failed to fetch public key: {response.text}")
        sys.exit(1)
    
    data = response.json()
    return data['key'], data['key_id']

def encrypt_secret(public_key: str, secret_value: str) -> str:
    """Encrypt secret using the repository's public key"""
    from nacl import pynacl
    import nacl.bindings
    
    # Decode the public key
    public_key_bytes = base64.b64decode(public_key)
    
    # Encode the secret
    secret_bytes = secret_value.encode('utf-8')
    
    # Encrypt using libsodium
    encrypted = nacl.bindings.crypto_box_seal(secret_bytes, public_key_bytes)
    
    # Return base64 encoded encrypted value
    return base64.b64encode(encrypted).decode('utf-8')

def create_or_update_secret(owner: str, repo: str, key: str, value: str, token: str, public_key: str, key_id: str):
    """Create or update a secret in GitHub"""
    url = f"https://api.github.com/repos/{owner}/{repo}/actions/secrets/{key}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    try:
        encrypted_value = encrypt_secret(public_key, value)
    except ImportError:
        print("❌ Error: 'nacl' library not installed. Install with: pip install pynacl")
        print("   Or use GitHub CLI instead: gh secret set KEY < value")
        return False
    
    payload = {
        "encrypted_value": encrypted_value,
        "key_id": key_id
    }
    
    response = requests.put(url, json=payload, headers=headers)
    
    if response.status_code not in (201, 204):
        print(f"❌ Failed to update {key}: {response.status_code} - {response.text}")
        return False
    
    return True

def main():
    print("🔐 GitHub Secrets Sync Tool")
    print("=" * 50)
    
    # Get configuration
    owner = "cpfcoaching"
    repo = "job-hunt-frontend"
    
    # Load environment variables
    env_vars = get_env_vars()
    print(f"✅ Loaded {len(env_vars)} variables from .env.local\n")
    
    # Get GitHub token
    token = get_github_token()
    
    # Get public key for encryption
    print("🔑 Fetching repository public key...")
    public_key, key_id = get_repo_public_key(owner, repo, token)
    print("✅ Public key fetched\n")
    
    # Sync secrets
    print("📤 Syncing secrets to GitHub...\n")
    success_count = 0
    failed_count = 0
    
    for key, value in sorted(env_vars.items()):
        # Only sync VITE_ and certain other secrets
        if key.startswith(('VITE_', 'CLOUDFLARE_', 'OPENROUTER_')):
            try:
                if create_or_update_secret(owner, repo, key, value, token, public_key, key_id):
                    print(f"  ✅ {key}")
                    success_count += 1
                else:
                    failed_count += 1
            except Exception as e:
                print(f"  ❌ {key}: {str(e)}")
                failed_count += 1
    
    # Summary
    print("\n" + "=" * 50)
    print(f"✅ Success: {success_count} secrets synced")
    if failed_count > 0:
        print(f"❌ Failed: {failed_count} secrets")
    
    if success_count > 0:
        print("\n🚀 Next steps:")
        print(f"  1. Go to: https://github.com/{owner}/{repo}/actions")
        print("  2. Re-run the latest workflow or push a new commit")
        print("  3. Check deployment status")

if __name__ == '__main__':
    main()
