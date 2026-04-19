# Analytics Setup Guide

This document explains how to set up Google Analytics and LinkedIn Insight Tag for the Job Hunt Pipeline application.

## Overview

The app now tracks user behavior across all features using:
- **Google Analytics 4 (GA4)** - For comprehensive event tracking and user insights
- **LinkedIn Insight Tag** - For conversion tracking and LinkedIn audience management

## What's Being Tracked

### Feature Views
- When users navigate to each feature page
  - Job Tracker
  - Resume Builder
  - Interview Prep
  - AI Matching
  - Job Scraper
  - Email Templates
  - Dashboard

### User Actions
- **Job Tracker**: Adding jobs, deleting jobs
- **Resume Builder**: Saving resume, building resume profile
- **Interview Prep**: Practicing interview questions, getting feedback
- **AI Matching**: Running job matching analysis
- **Job Scraper**: Importing jobs from various sources
- **Email Templates**: Copying email templates
- **Authentication**: Sign in (Google), Sign out
- **Theme**: Dark/Light mode toggle

### Event Data Captured
All events include:
- Event name
- Custom parameters (context-specific)
- Timestamp
- User ID (when authenticated)

## Setup Instructions

### Step 1: Set Up Google Analytics 4

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring"
4. Fill in property details:
   - **Property name**: "Job Hunt Pipeline"
   - **Reporting timezone**: Select your timezone
   - **Currency**: USD
5. Click "Create" → Select "Web"
6. Fill in web stream details:
   - **Website URL**: `http://localhost:5175` (for development) or your production domain
   - **Stream name**: "Job Hunt Web"
7. Click "Create stream"
8. **Copy your Measurement ID** (starts with `G-`)
   - Format: `G-XXXXXXXXXX`

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the following in `.env.local`:
   ```env
   # Paste your Google Analytics Measurement ID here
   VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

### Step 3: Verify Google Analytics is Working

1. Start the app: `npm run dev`
2. Navigate to `http://localhost:5175`
3. Sign in with your Google account
4. Go to **Google Analytics** → Your property → **Real-time** → **Overview**
5. You should see active users and events being tracked in real-time
6. Perform actions in the app and watch them appear in GA4

## LinkedIn Insight Tag Setup (Optional)

LinkedIn Insight Tag is useful for:
- Conversion tracking (job applications, resume builds, etc.)
- LinkedIn audience creation for retargeting
- Campaign performance attribution

### Step 1: Set Up LinkedIn Insight Tag

1. Go to [LinkedIn Campaign Manager](https://business.linkedin.com/marketing-solutions/marketing-suite)
2. Navigate to **Account assets** → **Insight Tags**
3. Click **Create tag**
4. Select **Website** as the tag type
5. Enter your website URL
6. Click **Create**
7. **Copy your Partner ID** (10-digit number)

### Step 2: Configure LinkedIn in Your App

1. Update `.env.local`:
   ```env
   VITE_LINKEDIN_PARTNER_ID=1234567890
   ```

2. Restart the dev server

### Step 3: Verify LinkedIn Tag is Working

1. Install the [LinkedIn Insight Tag Helper](https://chrome.google.com/webstore/detail/linkedin-insight-tag-helpe/) browser extension
2. Open your app
3. The extension should show the LinkedIn tag is loaded
4. Perform actions to generate conversion events
5. Check LinkedIn Campaign Manager → **Analytics** → **Insight Tag** to see tracked events

## Event Tracking Details

### Event Structure

All analytics events follow this structure:

```typescript
{
  eventName: string,           // e.g., "job_added", "resume_saved"
  eventData: {
    feature_name?: string,     // Which feature triggered the event
    timestamp: string,         // ISO 8601 timestamp
    // Additional context-specific data...
  }
}
```

### Available Events

#### Job Tracker
- `job_added` - User adds a new job
  - Includes: company, position, status
- `job_deleted` - User removes a job
  - Includes: company, position
- `view_feature` - User views Job Tracker page
  - Includes: feature_name = "job_tracker"

#### Resume Builder
- `resume_saved` - User saves their resume
- `resume_built` - Resume profile completed
  - Includes: skill_count, experience_count
- `view_feature` - User views Resume Builder page

#### Interview Prep
- `interview_practice` - User practices a question
  - Includes: category, difficulty, answered (boolean)
- `view_feature` - User views Interview Prep page

#### AI Matching
- `ai_matching_run` - User runs AI matching analysis
  - Includes: total_jobs_analyzed, high_match_count, average_match_score
- `view_feature` - User views AI Matching page

#### Job Scraper
- `jobs_imported` - User imports jobs
  - Includes: job_count, source (linkedin/indeed/glassdoor/custom)
- `view_feature` - User views Job Scraper page

#### Email Templates
- `email_template_copied` - User copies email template
  - Includes: template_name
- `view_feature` - User views Email Templates page

#### Authentication & Settings
- `user_signin` - User signs in
  - Includes: provider (google)
- `user_signout` - User signs out
- `theme_toggle` - User changes theme
  - Includes: theme (light/dark)

## Using Analytics Data

### In Google Analytics

1. **Real-time Overview**: See active users and current events
   - Path: Analytics → Real-time → Overview

2. **Events Report**: Analyze specific events
   - Path: Analytics → Reports → Engagement → Events
   - Filter by event name to see usage patterns

3. **User Insights**: Understand user behavior
   - Path: Analytics → Reports → User insights
   - See user flow and conversion paths

4. **Custom Reports**: Create custom analysis
   - Path: Analytics → Explore (Advanced reports)

### In LinkedIn Campaign Manager

1. Navigate to **Analytics** → **Insight Tag**
2. View conversion events and attribution
3. Create audiences based on tracked events
4. Set up campaigns targeting users who took specific actions

## Dashboard URL

After setup, access your analytics:
- **Google Analytics 4**: https://analytics.google.com/
- **LinkedIn Campaign Manager**: https://business.linkedin.com/marketing-solutions/marketing-suite

## Troubleshooting

### Google Analytics Not Tracking Events

1. **Check Environment Variable**
   ```bash
   # Verify VITE_GOOGLE_ANALYTICS_ID is set
   echo $VITE_GOOGLE_ANALYTICS_ID
   ```

2. **Check Browser Console**
   - Open DevTools → Console
   - Look for any errors from `gtag` or `vue-gtag`

3. **Verify GA4 Property**
   - Ensure Measurement ID starts with `G-`
   - Double-check ID is correct in `.env.local`

4. **Check Real-time in GA4**
   - Give it 30 seconds to appear
   - Ensure you're signed in with the correct Google account

### LinkedIn Tag Not Working

1. **Install the Helper Extension**
   - Use LinkedIn Insight Tag Helper to debug
   - Check if tag is being loaded

2. **Verify Partner ID**
   - Ensure it's a 10-digit number
   - Check LinkedIn Campaign Manager for correct ID

3. **Check Network Tab**
   - Open DevTools → Network
   - Look for `snap.licdn.com` requests
   - Should show successful (200) responses

## Development vs Production

### Development
- Set `VITE_ENV=development` in `.env.local`
- Analytics tracks in development by default
- Events may be delayed by a few seconds

### Production
- Use production GA4 property (recommended)
- LinkedIn tag works automatically
- Events track in real-time
- Set appropriate CORS headers

## Best Practices

1. **User Privacy**
   - Comply with GDPR, CCPA, and other privacy laws
   - Inform users about analytics tracking
   - Provide opt-out option if required

2. **Data Accuracy**
   - Wait 24-48 hours after setup for data to populate
   - Use GA4 debugging view for immediate verification
   - Regularly check event accuracy

3. **Custom Events**
   - Maintain consistent event naming
   - Include relevant context in event parameters
   - Document all custom events

4. **Goals & Conversions**
   - Define key user actions as goals
   - Set up conversion tracking for important milestones
   - Use analytics to optimize user experience

## Additional Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [LinkedIn Insight Tag Guide](https://business.linkedin.com/marketing-solutions/linkedin-insight-tag)
- [vue-gtag Documentation](https://matteo-gabriele.gitbook.io/vue-gtag/v/v2/)
- [Analytics Event Naming Conventions](https://support.google.com/analytics/answer/13316687)

## Support

For issues with:
- **Google Analytics**: Check GA4 documentation or contact Google Support
- **LinkedIn Insight Tag**: Contact LinkedIn support
- **Vue-gtag Integration**: Check GitHub issues or documentation
- **App-specific Tracking**: Review the useAnalytics composable in `src/composables/useAnalytics.ts`
