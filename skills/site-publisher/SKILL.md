---
name: site-publisher
description: Publish finished pages, HTML artifacts, static apps, or AI application POCs to a real shareable website URL only when the user explicitly asks to publish, ship, deploy, put it on the site, make it live, or create a shareable URL. Never use this skill for drafting, previewing, local-only artifacts, or ordinary page creation unless live publishing is explicitly requested.
---

# Site Publisher

## Non-Negotiable Trigger Rule

Use this skill only after an explicit publishing request. Do not infer publishing from finished work, a nice artifact, or a request to create a page. If the user asks only to build, draft, render, or preview, stop at local output.

## Routing Decision

Choose the publishing lane before editing files:

- Static HTML artifact, report, explainer, landing page, or small app: publish on Vercel.
- Finished app with backend, API routes, or durable product surface: publish on Vercel unless the repo or user says another host.
- POC of an AI application meant to be tested quickly: push to Base44.
- Existing CPF Coaching site repair or update: match the current source of truth for that route before changing anything.

Every publishable artifact should have a private GitHub repo or be committed to an existing private repo unless the user explicitly chooses otherwise.

Default indexing: `noindex` and unlisted. Use public indexing only when the user explicitly says the page should be public for SEO, discovery, or permanent marketing use.

## Required Inputs

Before publishing, identify or ask for:

- Source artifact or finished page path.
- Intended public title, audience, and URL slug.
- Publishing lane: Vercel, Base44, or existing site repo.
- GitHub repo choice: existing private repo or new private repo.
- Indexing preference: default `noindex` unlisted, or explicit public SEO.
- Design language: match CPF executive dashboard when it complements the solution; use a fresh design direction for a new unbranded solution.

## Core Procedure

1. Create a clean slug.
   - Lowercase words.
   - Use hyphens.
   - Remove dates unless useful.
   - Avoid secrets, client names, drafts, or internal codenames unless approved.

2. Create the page using site conventions.
   - Read the repo entry points, route system, build scripts, and existing page patterns first.
   - For static artifacts, preserve the artifact as one self-contained page when possible.
   - For React or app pages, use existing components, metadata patterns, and routing conventions.
   - Do not refactor unrelated app structure.

3. Add share metadata.
   - Title: page-specific, concise, and human-readable.
   - Description: 1 to 2 sentences that explain the value of the page.
   - Canonical URL only for public indexed pages.
   - Robots: default `noindex,nofollow` for unlisted pages.

4. Create a page-specific Open Graph image.
   - Target `1200x630`.
   - Use `image-gateway` for generation when an image does not already exist.
   - Store the image in the repo using the site's normal static asset path.
   - Verify the image path used by metadata resolves locally and after deploy.

5. Verify locally before deploy.
   - Run install only if dependencies are missing.
   - Run the build command.
   - Start the local preview or app server.
   - Open the page in a browser or fetch the route.
   - Check title, description, robots, OG tags, image URL, and visible layout.

6. Deploy.
   - Use Vercel for static or app artifacts.
   - Use Base44 for AI application POCs.
   - Prefer preview deploys unless the user explicitly requests production.
   - If the repo is Vercel-linked and deploys from GitHub, ask before pushing.
   - If creating a new repo, make it private by default.

7. Post-publish checks.
   - Confirm the live URL loads.
   - Confirm the expected route does not redirect unexpectedly.
   - Confirm the metadata and OG image are reachable from the live URL.
   - Use an OG preview checker when available, or fetch the live HTML and image directly.
   - Report the final URL, repo, deploy method, indexing state, and cleanup path.

## References

Read `references/publisher-playbook.md` when executing a publish. It contains lane-specific procedures for Vercel, Base44, GitHub private repos, metadata, and cleanup.
