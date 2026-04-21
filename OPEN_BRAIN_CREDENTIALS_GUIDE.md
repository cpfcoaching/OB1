# Open Brain MCP - Credential Requirements Analysis

Based on `/Volumes/Crucial X9 Pro For Mac/Library/OpenBrain/OB1/server/index.ts`

## What Your Open Brain Server NEEDS (deployed on Supabase)

The MCP server deployed as a Supabase Edge Function requires these environment variables:

```typescript
SUPABASE_URL              = "https://rjezjfizizzbjuyhxrsj.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "[SERVICE ROLE KEY - NOT ANON KEY]"
OPENROUTER_API_KEY        = "sk-or-v1-..."
MCP_ACCESS_KEY            = "[Your generated 64-char hex key]"
```

## What Your App SHOULD Have (client-side in .env.local)

For your **job-hunt-frontend** to connect to Open Brain, you have two options:

### Option A: Direct Function URLs (Current Approach)
```bash
# These are public Edge Function URLs with inline API keys
VITE_OPEN_BRAIN_MCP_URL=https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/open-brain-mcp?key=YOUR_ANON_KEY_HERE
VITE_JOB_HUNT_MCP_URL=https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/job-hunt-mcp?key=YOUR_ANON_KEY_HERE
```

**Type of keys needed:** Anon keys (safe to expose publicly)  
**Format:** `sb_something_base64encoded...`

### Option B: MCP Protocol Connection (Recommended)
```bash
# Point to the local/remote MCP server
VITE_OPEN_BRAIN_MCP_URL=https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/open-brain-mcp
VITE_OPEN_BRAIN_MCP_ACCESS_KEY=YOUR_MCP_ACCESS_KEY_HERE
```

---

## 🔍 Your Current Configuration Check

**Location:** `/Users/MacAttack/Projects/job-hunt-frontend/.env.local`

```bash
VITE_JOB_HUNT_MCP_URL=https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/job-hunt-mcp?key=[REDACTED_SUPABASE_KEY]
VITE_OPEN_BRAIN_MCP_URL=https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/open-brain-mcp?key=[REDACTED_SUPABASE_KEY]
```

**Issue:** The keys have `sb_secret_` prefix which indicates **SERVICE ROLE keys**, not ANON keys.

**Why 401 error on connectivity test:**
- The functions expect ANON keys in the `?key=` parameter
- You're providing SERVICE ROLE keys
- Supabase is correctly rejecting them (401 = Unauthorized)

---

## ✅ What You Need To Do

### Step 1: Get the Correct ANON Key
1. Go to: https://supabase.com/dashboard/project/rjezjfizizzbjuyhxrsj/settings/api
2. Under **"Project API Keys"** tab
3. Find **"Anon"** key (starts with `eyJh...` - JWT format)
   - **OR** check for **"Publishable key"** (starts with `sb_publishable_...`)
4. Copy it

### Step 2: Update Your URLs in `.env.local`

Replace:
```bash
VITE_JOB_HUNT_MCP_URL=https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/job-hunt-mcp?key=[YOUR_ANON_KEY]
VITE_OPEN_BRAIN_MCP_URL=https://rjezjfizizzbjuyhxrsj.supabase.co/functions/v1/open-brain-mcp?key=[YOUR_ANON_KEY]
```

### Step 3: Verify the Format
- Anon key format: `eyJhbGc...` (JWT) OR `sb_publishable_...`
- Service role format: `sb_secret_...` (WRONG for client)
- Never expose SERVICE ROLE keys in frontend code ❌

---

## 🎯 Summary

| Credential | Type | Format | Where Used | Exposure |
|-----------|------|--------|-----------|----------|
| Service Role Key | SECRET | `sb_secret_...` | Server/Edge Functions only | ❌ NEVER expose |
| Anon Key | PUBLIC | `eyJhbGc...` OR `sb_publishable_...` | Frontend `.env.local` | ✅ Safe to expose |
| MCP Access Key | SECRET | 64-char hex | Server header validation | ❌ NEVER expose |
| OpenRouter Key | SECRET | `sk-or-v1-...` | Server only | ❌ NEVER expose |

---

## Next Action

1. Get your **ANON key** from Supabase console
2. Tell me the format (JWT or sb_publishable_...) so I can update your config
3. I'll test connectivity again with the correct keys
