# OpenRouter Integration Guide

## Overview
The Resume Builder now uses **OpenRouter** to power AI-driven resume evaluations. This unified API connects you to 300+ AI models (GPT-4, Claude, Gemini, etc.) through a single interface.

## Setup Steps

### 1. Get Your API Key
1. Go to [https://openrouter.ai/settings/keys](https://openrouter.ai/settings/keys)
2. Sign up or log in
3. Copy your API key
4. Update `.env.local`:
```env
VITE_OPENROUTER_API_KEY=your_api_key_here
```

### 2. Package Installation ✅
The OpenRouter SDK is already installed:
```bash
npm install @openrouter/sdk
```

### 3. Start the Dev Server
```bash
npm run dev
```

## Features Implemented

### Resume Evaluation
- **File**: `src/lib/openrouter.ts` → `evaluateResume()`
- **Metrics**: Overall score, format, content, ATS optimization, keywords
- **Output**: Recommendations with priority levels
- **Model**: `openai/gpt-4-mini` (configurable)

### LinkedIn Profile Analysis
- **File**: `src/lib/openrouter.ts` → `evaluateLinkedInProfile()`
- **Extracts**: Resume-ready data from LinkedIn profiles
- **Scores**: Completeness, content quality
- **Returns**: Structured resume data for auto-import

### Resume Comparison
- **File**: `src/lib/openrouter.ts` → `compareResumes()`
- **Compares**: Two resume versions
- **Identifies**: Skills added/removed, experience changes, improvements

## Component Integration

### ResumeBuilder.vue
- ✅ Evaluate Tab: AI-powered resume scoring against job descriptions
- ✅ LinkedIn Sync: Import profile data via AI analysis
- ✅ History Tab: Compare versions to see improvements

### Composable: useResume.ts
- `evaluateResumeAI(jobDescription, roleType)` - Real resume evaluation
- `evaluateLinkedInProfileAI(url, profileData)` - LinkedIn analysis
- `compareResumesAI(versionId1, versionId2)` - Version comparison
- All results cached in Firestore under `resumes/personal/evaluations/`

## Model Selection

### Current
- **Model**: `openai/gpt-4-mini`
- **Speed**: Fast (suitable for evaluation tasks)
- **Cost**: Low (~$0.0003-0.0006 per evaluation)

### Options
Edit `src/lib/openrouter.ts` to change models:
```typescript
// High quality (slower, costlier)
model: 'openai/gpt-4-turbo'

// Balanced (fast & good quality)
model: 'anthropic/claude-3-haiku'

// Budget friendly (fastest)
model: 'google/gemini-pro'
```

See all [available models on OpenRouter](https://openrouter.ai/models)

## API Response Flow

```
Resume Input
    ↓
OpenRouter API (callModel)
    ↓
Claude/GPT processes with custom prompt
    ↓
JSON structured response
    ↓
Save to Firestore evaluations collection
    ↓
Display in UI with scores & recommendations
```

## Environment Variables
- **VITE_OPENROUTER_API_KEY**: Your OpenRouter API key (required)
- Auto-imported in `src/lib/openrouter.ts` via `import.meta.env`

## Testing the Integration

### Manual Test in ResumeBuilder
1. Fill in resume data
2. Go to **Evaluate** tab
3. Add job description (optional)
4. Click "Analyze with AI"
5. View scores and recommendations

### Via Console
```javascript
import { evaluateResume } from '@/lib/openrouter'
const result = await evaluateResume(resumeData, 'Software Engineer')
console.log(result)
```

## Firestore Structure
Evaluations saved to:
```
resumes/
  personal/
    evaluations/
      eval_${timestamp}
        - scores: { overall, format, content, ats_optimization, keywords }
        - recommendations: { category, suggestion, priority }
        - ats_pass_likelihood: "72%"
        - job_description: "..."
        - role_type: "..."
```

## Cost Estimation
- **Per evaluation**: ~$0.0003-0.0006 (with gpt-4-mini)
- **100 evaluations**: ~$0.05
- **1000 evaluations**: ~$0.50

For budget concerns, switch to `google/gemini-pro` (~50% cheaper)

## Troubleshooting

### "Module '/@openrouter/sdk' has no default export"
✅ Fixed - using named import: `import { OpenRouter }`

### API Key Not Found
- Check `.env.local` has `VITE_OPENROUTER_API_KEY`
- Restart dev server after updating `.env.local`
- Verify key is copied exactly (no spaces)

### Evaluation Returns Error
- Ensure API key is valid
- Check OpenRouter dashboard for rate limits
- Review console for detailed error message

### Slow Response Times
- Try `google/gemini-pro` model (faster)
- Add timeout handling (currently: no timeout)
- Consider caching evaluations

## Next Steps

1. ✅ Add your OpenRouter API key to `.env.local`
2. ✅ Run `npm run dev`
3. ✅ Test the Evaluate tab in ResumeBuilder
4. Consider: Export evaluation history to PDF
5. Consider: Batch evaluate multiple resume versions
6. Consider: A/B test resume changes against job postings

## References
- OpenRouter Docs: https://openrouter.ai/docs
- SDK GitHub: https://github.com/OpenRouter/sdk-js
- Resume Evaluation Prompts: `src/lib/openrouter.ts`
