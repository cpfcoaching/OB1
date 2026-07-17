---
name: gemini-multimodal-transcription-tips
description: |
  Handle Gemini API errors during multimodal transcription and SEO optimization. 
  Fixes: (1) 413 Request Entity Too Large (use audio extraction), 
  (2) 429 Resource Exhausted (model refactoring), 
  (3) BlockedReason.PROHIBITED_CONTENT (safety filter tuning and segment selection).
author: Antigravity
version: 1.0.0
---

# Gemini Multimodal Transcription Tips

## Problem
Processing large video files for transcription or SEO optimization can trigger various API failures related to file size, rate limits, or safety filtering.

## Context / Trigger Conditions
- **413 Request Entity Too Large**: Occurs when uploading large video files (typically >1.5GB) to the Gemini API.
- **429 Resource Exhausted**: Persistent rate limits on specific models (e.g., `gemini-2.0-flash-lite`).
- **BlockedReason.PROHIBITED_CONTENT**: Safety filters blocking cybersecurity discussions (e.g., identity theft, data breaches) even when legitimate.

## Solution

### 1. Handling 413 (File Size)
Extract the audio from the video to create a much smaller file for transcription.
```bash
ffmpeg -i input_video.mp4 -vn -acodec libmp3lame -q:a 2 output_audio.mp3
```
Then use the `.mp3` file for the `client.files.upload` call.

### 2. Handling 429 (Rate Limits)
Switch to the `google-genai` SDK and use `gemini-flash-latest` (1.5 Flash) which often has more stable quotas than preview/lite models.
```python
from google import genai
client = genai.Client(api_key=API_KEY)
response = client.models.generate_content(
    model="gemini-flash-latest",
    contents=prompt
)
```

### 3. Handling Safety Blocks
Disable safety filters in the SDK configuration and select safer transcript segments if necessary.
```python
response = client.models.generate_content(
    model="gemini-flash-latest",
    contents=prompt,
    config={
        'safety_settings': [
            {'category': 'HARM_CATEGORY_HATE_SPEECH', 'threshold': 'OFF'},
            {'category': 'HARM_CATEGORY_HARASSMENT', 'threshold': 'OFF'},
            {'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold': 'OFF'},
            {'category': 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold': 'OFF'}
        ]
    }
)
```
If `PROHIBITED_CONTENT` persists, check the transcript snippet for keywords like "violence", "blood", "assault", or "identity theft" and select a different time range (e.g., `transcript[5000:7000]`).

## Verification
- Run the transcription script with the extracted MP3.
- Run the SEO generator and verify that `response.text` is populated and not blocked.

## References
- [Google GenAI Python SDK Docs](https://github.com/google/generative-ai-python)
- [Gemini Safety Settings](https://ai.google.dev/gemini-api/docs/safety-settings)
