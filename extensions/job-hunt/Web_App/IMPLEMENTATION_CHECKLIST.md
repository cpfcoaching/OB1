<!-- markdownlint-disable MD013 MD060 -->

# Implementation Checklist: Vercel PDF Parser

## Status Summary

✅ **Completed**: Assessment, Strategy, Parser Implementation, Testing Framework  
⏳ **Next**: Local testing, Vercel deployment, End-to-end validation

---

## Implementation Progress

### Phase 1: Assessment & Strategy ✅

- ✅ Created `VERCEL_IMPLEMENTATION_STRATEGY.md` with comprehensive approach
- ✅ Identified architectural mismatch (workspace Vue.js vs live Next.js/RSC)
- ✅ Documented Vercel constraints and serverless requirements
- ✅ Created risk mitigation matrix
- ✅ Designed dual runtime handler pattern

### Phase 2: API Implementation ✅

**File**: `api/parse-resume.ts`

**Features**:

- ✅ Dual runtime handlers (Node.js + Fetch API)
- ✅ pdfjs-dist integration with serverless config
- ✅ Base64 PDF input handling
- ✅ Text extraction with confidence scoring
- ✅ Error handling with graceful fallbacks
- ✅ Memory-efficient page iteration
- ✅ Timeout-aware processing (< 8s target)

**Code Quality**:

- ✅ TypeScript types (VercelRequest, VercelResponse)
- ✅ Comprehensive comments explaining serverless constraints
- ✅ Proper error responses with status codes
- ✅ Configuration constants for limits and timeouts

### Phase 3: Testing Framework ✅

**Files**:

- ✅ `scripts/test-pdf-parser.mjs` - Comprehensive test script
- ✅ `public/samples/resume.pdf` - Sample PDF for testing

**Test Coverage**:

- ✅ File validation
- ✅ Base64 encoding/decoding
- ✅ pdfjs-dist loading
- ✅ Text extraction from multiple pages
- ✅ Confidence score calculation
- ✅ Processing time measurement
- ✅ API payload validation

---

## Files Created/Modified

### New Files

```text
api/parse-resume.ts                          (220 lines - PDF parser endpoint)
scripts/test-pdf-parser.mjs                  (170 lines - Test harness)
public/samples/resume.pdf                    (Sample PDF)
VERCEL_IMPLEMENTATION_STRATEGY.md            (Comprehensive strategy doc)
```

### Modified Files

```text
None (only additions)
```

---

## Next Steps (One-by-One as Requested)

### Step 1: Local Test

```bash
cd /Volumes/Crucial\ X9\ Pro\ For\ Mac/Library/OpenBrain/OB1/extensions/job-hunt/Web_App
node scripts/test-pdf-parser.mjs public/samples/resume.pdf
```

**Expected Output**:

```text
✅ All tests passed!

PDF loaded: 1 page(s)
Total text: XXX characters
Readable: 95.0%
Processing time: XXXms
```

**Success Criteria**:

- ✅ No errors
- ✅ Text extracted from PDF
- ✅ Confidence > 80%
- ✅ Processing time < 1 second

---

### Step 2: Build Verification

```bash
npm run build
```

**Expected Output**:

- ✅ Build succeeds without errors
- ✅ `dist/` directory created
- ✅ API functions compiled

**Check**:

```bash
ls -la dist/ | grep -E '(parse-resume|api)'
```

---

### Step 3: Vercel Deployment

```bash
git add -A
git commit -m "feat: add Vercel-compatible PDF parser endpoint"
git push
```

**Vercel Dashboard**:

1. Check build logs → should pass
2. Check Functions tab → should show `/api/parse-resume`
3. Check API endpoint → should respond with 200 status

---

### Step 4: Manual API Test

```bash
curl -X POST https://cpfcoaching.us/api/parse-resume \
  -H "Content-Type: application/json" \
  -d '{"pdf":"'$(base64 -i public/samples/resume.pdf)'"}' | jq
```

**Expected Response**:

```json
{
  "success": true,
  "text": "SAMPLE RESUME...",
  "pageCount": 1,
  "confidence": 0.95,
  "processingTimeMs": 234
}
```

---

### Step 5: End-to-End on cpfcoaching.us

1. Navigate to <https://cpfcoaching.us>
2. Login with test account
3. Go to Resume section (if available)
4. Upload `public/samples/resume.pdf`
5. Verify extracted text appears and is readable
6. Test with invalid PDF → should show error message
7. Check browser DevTools for no errors

**Success Criteria**:

- ✅ Text extracted and displayed
- ✅ No "handler.fetch" errors
- ✅ Response time < 3 seconds
- ✅ All error cases handled

---

## Deployment Checklist

- [ ] **Local Testing**
  - [ ] `npm run build` succeeds
  - [ ] `node scripts/test-pdf-parser.mjs` passes
  - [ ] No TypeScript errors in `api/parse-resume.ts`

- [ ] **Code Review**
  - [ ] Dual runtime handlers present
  - [ ] pdfjs-dist config correct (no workers/eval)
  - [ ] Error handling comprehensive
  - [ ] Comments explain serverless constraints

- [ ] **Vercel Deployment**
  - [ ] Git changes pushed
  - [ ] Build completes on Vercel
  - [ ] Functions appear in dashboard
  - [ ] No deployment errors in logs

- [ ] **API Validation**
  - [ ] Endpoint responds with 200
  - [ ] Sample PDF parses correctly
  - [ ] Invalid input returns 400 status
  - [ ] Response time < 3 seconds

- [ ] **End-to-End Testing**
  - [ ] Upload form accepts PDF
  - [ ] Text extracted and displayed
  - [ ] No gibberish/binary in output
  - [ ] Error messages clear and helpful

---

## Configuration Details

### Vercel Function Settings

- **Runtime**: Node.js 18+ (default)
- **Memory**: 512MB (default, sufficient)
- **Timeout**: 10 seconds (default, using < 8s)
- **Environment**: Automatic from `vercel.json`

### pdfjs-dist Configuration

```typescript
{
  data: pdfBuffer,
  useWorkerFetch: false,      // No worker threads
  isEvalSupported: false,      // No eval() calls
  disableFontFace: true        // No font loading
}
```

**Why These Settings**:

- ✅ Workers would require additional threads (not available)
- ✅ eval() forbidden in Vercel for security
- ✅ Font loading adds overhead/complexity

### File Size Limits

- **Max PDF**: 5MB (Firebase Cloud Storage default)
- **Max Pages**: 100 (resume reasonable upper bound)
- **Max Base64**: ~6.7MB encoded (5MB × 1.33)

---

## Rollback Plan

If deployment causes issues:

**Immediate**:

```bash
git revert HEAD
git push
# Vercel auto-redeploys previous commit
```

**Verify Rollback**:

```bash
curl https://cpfcoaching.us/api/parse-resume
# Should return 404 (endpoint removed)
```

**Client Fallback** (if resume upload component exists):

- Show "Upload unavailable - try again later"
- Redirect to alternative upload method

---

## Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Local test pass rate | 100% | ⏳ Pending |
| Build success | 100% | ⏳ Pending |
| API response time | < 3s | ⏳ Pending |
| Error handling | All cases | ✅ Implemented |
| Memory usage | < 512MB | ✅ Designed for |
| Code coverage | > 80% | ⏳ Pending |

---

## Documentation Updates Needed

After successful deployment, update:

1. **README.md**
   - Add "Resume Upload & PDF Parsing" to features

2. **API.md** (new file)
   - Add endpoint docs for `POST /api/parse-resume`.
   - Include request example:

     ```json
     { "pdf": "base64-encoded-pdf-bytes" }
     ```

   - Include response example:

     ```json
     {
       "success": true,
       "text": "extracted text...",
       "pageCount": 1,
       "confidence": 0.95,
       "processingTimeMs": 234
     }
     ```

3. **DEPLOYMENT.md**
   - Add "Vercel PDF Parsing" section
   - Document base64 encoding requirement
   - List supported file types and limits

---

## Known Limitations

1. **Max File Size**: 5MB (Vercel function timeout/memory)
2. **No Worker Threads**: pdfjs-dist can't use workers in Vercel
3. **Stateless**: Each invocation independent (no caching)
4. **Text-Only**: Returns extracted text, not OCR for scanned docs
5. **No Formatting**: Loses original document formatting

---

## Future Enhancements

- [ ] Add OCR support for image-based PDFs (Tesseract)
- [ ] Implement client-side caching to reduce Vercel calls
- [ ] Add file upload directly to Vercel API (multipart)
- [ ] Cache parser results in Firestore
- [ ] Add progress tracking for large files
- [ ] Implement retry logic for transient failures

---

## Questions / Clarifications

1. **Should `/api/parse-resume` be called from resume upload form?**
   - Yes, when file is selected
   - Show progress spinner during extraction
   - Display extracted text for user review

2. **Should extracted text be saved to database?**
   - Yes, to Firebase Firestore with user's resume
   - Timestamp extraction attempt
   - Store confidence score for debugging

3. **Should we support image-based PDFs (OCR)?**
   - Not in this phase (add later if needed)
   - Focus on text-based PDFs (common case)

---

## Support & Troubleshooting

### Issue: "handler.fetch is not a function"

**Cause**: Function missing dual runtime handlers  
**Solution**: Verify both `export default` and `handler.fetch` present in `api/parse-resume.ts`

### Issue: "PDF exceeds maximum size"

**Cause**: User uploading > 5MB file  
**Solution**: Validate file size in client before upload

### Issue: "No readable text was found"

**Cause**: PDF is image-based (scanned document)  
**Solution**: Show message "Scanned PDFs not supported - please upload digital resume"

### Issue: Timeout (> 10s)

**Cause**: Very large PDF or slow network  
**Solution**: Increase max pages limit or optimize extraction

---

## References

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [pdfjs-dist API](https://mozilla.github.io/pdf.js/)
- [Dual Runtime Handler Pattern](https://vercel.com/docs/functions/runtimes/node#dual-handler-pattern)
