# Vercel Implementation Strategy: Self-Contained PDF Parsing

## Executive Summary

This document outlines how to implement PDF resume parsing as a self-contained Vercel serverless function, eliminating external dependencies and ensuring all functionality runs within Vercel's constraints.

**Key Principles:**
- ✅ Self-contained within Vercel serverless (no external APIs)
- ✅ Reduced complexity (use built-in capabilities)
- ✅ Proper testing before/during/after deployment
- ✅ End-to-end validation from live app

---

## Current Architecture Assessment

### What Exists
- **Frontend:** Vue.js application in root directory (src/, components/, views/)
- **API Layer:** Vercel serverless functions in api/ directory
- **Build:** Vite for frontend, Vercel for deployment
- **Dependencies:** pdfjs-dist@5.7.284 already installed
- **Firebase:** Auth working; resume storage location TBD

### What's Missing
1. **PDF Parsing Endpoint:** No /api/parse-resume.ts or equivalent
2. **Client Integration:** No resume upload handler
3. **Storage Handler:** Unclear how/where PDFs are stored
4. **Error Handling:** No fallback if parsing fails

### Vercel Constraints to Remember
- **Memory Limit:** ~512MB per function
- **Timeout:** ~10 seconds for billable execution
- **No File System:** Can't write to disk permanently
- **No External Services:** Must use libraries shipped with function
- **Stateless:** Each invocation is independent

---

## Solution Design: Vercel-Native PDF Parser

### Architecture

```
┌─────────────────────────────────────────┐
│       Frontend (Vue.js)                  │
│  - Resume Upload Component               │
│  - File Validation                       │
│  - Display Parsed Resume                 │
└─────────┬───────────────────────────────┘
          │ POST /api/parse-resume
          ▼
┌─────────────────────────────────────────┐
│   Vercel Serverless Function             │
│   /api/parse-resume.ts                   │
│  ┌─────────────────────────────────────┐ │
│  │ 1. Receive PDF buffer               │ │
│  │ 2. Extract text using pdfjs-dist    │ │
│  │ 3. Normalize whitespace             │ │
│  │ 4. Return structured JSON           │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
          │ Returns { extractedText, pageCount, confidence }
          ▼
┌─────────────────────────────────────────┐
│      Frontend Display                    │
│  - Show extracted text                   │
│  - Allow editing before save             │
│  - Store in Firebase                     │
└─────────────────────────────────────────┘
```

### Why This Works

1. **No External APIs:** All processing happens inside Vercel function
2. **Minimal Dependencies:** Only pdfjs-dist (already installed)
3. **Memory Safe:** pdfjs-dist v5.7.284 configured for serverless:
   - `useWorkerFetch: false` - No worker threads
   - `isEvalSupported: false` - No eval() calls
   - `disableFontFace: true` - No font loading
4. **Timeout Safe:** PDF parsing typically < 5 seconds for resumes
5. **Stateless:** PDF passed in request, text returned in response

---

## Implementation Plan

### Phase 1: Create PDF Parser Endpoint (30 min)

**File:** `/api/parse-resume.ts`

Requirements:
- Accept multipart form data with PDF file
- Extract text using pdfjs-dist with serverless config
- Return `{ text, pageCount, confidence }`
- Handle errors gracefully

Key Decisions:
- Accept file as base64 or multipart (base64 simpler for Vercel)
- Limit file size to 5MB (reasonable for resume)
- Extract all text; allow frontend to parse structure
- Return page count for verification

### Phase 2: Wire into Client (30 min)

**Files:** 
- `src/components/ResumeUpload.vue` (new or update existing)
- `src/composables/usePdfParser.ts` (new)

Requirements:
- File input with validation (PDF only, < 5MB)
- Call /api/parse-resume on upload
- Display extracted text
- Allow editing before save
- Show error messages for invalid files

### Phase 3: Local Testing (30 min)

**Test Coverage:**
- ✅ Valid PDF → extracted text
- ✅ Large PDF → handles without timeout
- ✅ Invalid PDF → graceful error
- ✅ Missing file → validation error
- ✅ Zero-byte file → rejects

**Test Data:** Sample resume.pdf in /public/samples/

### Phase 4: Vercel Deployment (20 min)

**Steps:**
1. `npm run build` locally (verify no errors)
2. `git push` to trigger Vercel deploy
3. Check Vercel build logs for function compilation
4. Verify Functions tab shows /api/parse-resume
5. Test endpoint from browser DevTools

### Phase 5: End-to-End Testing (30 min)

**On cpfcoaching.us:**
1. Upload valid resume PDF
2. Verify text extracted correctly
3. Verify no gibberish/binary text
4. Test with invalid file
5. Test with large file
6. Monitor Vercel function logs for errors

**Success Criteria:**
- Text is readable English (not binary)
- Page count matches actual PDF
- Response time < 3 seconds
- No "handler.fetch is not a function" errors
- Memory usage < 512MB

---

## Code Requirements

### Dual Runtime Handler Pattern

All Vercel functions must export both patterns:

```typescript
// Node.js runtime (for Vercel API routes)
export default async (req: VercelRequest, res: VercelResponse) => { ... }

// Fetch API runtime (for Edge Functions, middlewares)
export const handler = async (request: Request) => { ... }

// Export both
handler.fetch = handler
```

### PDF Parser Implementation

```typescript
import { getDocument } from 'pdfjs-dist'

export async function parsePdf(pdfBuffer: Buffer) {
  const loadingTask = getDocument({
    data: pdfBuffer,
    useWorkerFetch: false,      // No workers in serverless
    isEvalSupported: false,      // No eval() in Vercel
    disableFontFace: true       // No font loading
  })

  const pdf = await loadingTask.promise
  const pages = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items.map(item => item.str).join('')
    pages.push(text)
  }

  return {
    text: pages.join('\n--- PAGE BREAK ---\n'),
    pageCount: pdf.numPages,
    confidence: 0.9 // Indicates extracted text quality
  }
}
```

### Configuration Details

**Vercel Requirements:**
- Function timeout: 10 seconds (default, sufficient for resumes)
- Memory: 512MB default (sufficient for pdfjs-dist)
- Runtime: Node.js 18+ (already deployed)

**File Limits:**
- Max upload: 5MB (Firebase Cloud Storage standard)
- Max parsing time: < 3 seconds for typical resume

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| PDF too large | Limit upload to 5MB in client; reject in API |
| Parser timeout | Test with 100+ page PDF; set timeout alert at 8s |
| Memory pressure | Use serverless config; avoid workers/eval |
| Network failure | Add retry logic in client (3 retries) |
| Binary output | Validate text contains printable ASCII; reject if < 50% |
| User confusion | Show progress during upload; clear error messages |

---

## Success Criteria

### Build Phase
- ✅ `npm run build` completes without errors
- ✅ TypeScript type-checks pass
- ✅ No missing dependencies

### Local Test Phase
- ✅ PDF parsing works with sample resume
- ✅ Extracted text is readable
- ✅ No "handler.fetch" errors in tests
- ✅ Response time < 1 second (local)

### Vercel Deployment
- ✅ Build completes successfully
- ✅ Function appears in Vercel Functions dashboard
- ✅ No deployment errors in logs
- ✅ Function endpoint responds with 200 status

### End-to-End on cpfcoaching.us
- ✅ Upload form accepts PDF
- ✅ Extracted text displayed correctly
- ✅ No gibberish/binary characters
- ✅ Response time < 3 seconds (production)
- ✅ Page count matches PDF
- ✅ No Sentry/error tracking alerts

---

## Rollback Plan

If deployment causes issues:

1. **Immediate:** Revert to previous Vercel deployment via dashboard
2. **Files to Watch:** api/parse-resume.ts (new file - easy to remove)
3. **Client Fallback:** If endpoint unavailable, show "Upload disabled temporarily"
4. **Verify:** Test login flow still works before re-attempting

---

## Documentation for Maintenance

After implementation, update:
1. README.md - Add "Resume Upload" to features list
2. API.md (new) - Document /api/parse-resume endpoint
3. DEPLOYMENT.md - Add "Vercel PDF Parsing" section
4. This file - Mark sections as "IMPLEMENTED" with date

---

## Timeline

| Phase | Duration | Owner | Status |
|-------|----------|-------|--------|
| Assessment | 15 min | Agent | ✅ Now |
| Endpoint | 30 min | Agent | ⏳ Next |
| Client Integration | 30 min | Agent | ⏳ After endpoint |
| Local Testing | 30 min | Agent + User | ⏳ Before deploy |
| Vercel Deploy | 20 min | Agent | ⏳ After testing |
| E2E Testing | 30 min | User | ⏳ Final step |
| **Total** | **~2 hours** | | |

---

## References

- [pdfjs-dist Documentation](https://mozilla.github.io/pdf.js/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Firebase Cloud Storage](https://firebase.google.com/docs/storage)
