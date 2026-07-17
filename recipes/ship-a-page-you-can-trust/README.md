# Ship a Page You Can Trust

> Build, publish, and verify a page with a regression habit instead of relying on vibes.

Source inspiration: https://unlock-ai.natebjones.com/open-skills/runbooks

## What It Does

This runbook takes a finished page through production-quality checks: visual quality, publishing, browser QA, and a repo-local testing runbook so future changes can be verified quickly.

## Skill Chain

```text
Frontend Taste System -> Site Publisher -> Browser Automation QA -> Testing Runbook Creator
```

Local equivalents:

- frontend design and review skills when available
- `site-publisher`
- `agent-browser`
- repo-local testing runbook or `session-to-skill-extractor` for reusable test discoveries

## Guided Prompt

```text
Use the Ship a Page You Can Trust runbook.

Page:
- Local page or app path: <path>
- Intended URL or route: <route>
- Public or noindex: <public or noindex>
- Target viewports: <desktop, tablet, mobile>
- Critical user actions: <list>

Workflow:
1. Review the page against product and design intent.
2. Publish only if I explicitly ask to publish.
3. Verify the live or preview page with browser automation.
4. Capture screenshots across requested breakpoints.
5. Check console errors, network failures, core user actions, and basic performance signals.
6. Write or update a repo-local testing runbook with what should be checked next time.

Definition of done:
- The page loads at the expected URL or preview.
- Screenshots and checks show no blocking issues.
- Any known issue is listed with severity.
- The repo has a repeatable page QA note.
```

## Prerequisites

- Page or app ready for verification
- Browser automation available
- Publishing destination if live publish is requested

## Steps

1. Inspect the page locally.
2. Publish or create a preview when requested.
3. Run browser QA across breakpoints.
4. Verify critical user actions.
5. Record findings and screenshots.
6. Create or update the page testing runbook.

## Expected Outcome

A page is shipped or ready to ship with visible QA evidence and a reusable test checklist.

## Troubleshooting

**Issue: Browser automation is unavailable**
Solution: Leave a manual QA checklist and report the missing browser tool.

**Issue: The page publishes but fails QA**
Solution: Stop and report the defects. Do not call it shipped cleanly.

**Issue: The route should not be indexed**
Solution: Verify `noindex` or the repo's unlisted-page control before reporting completion.
