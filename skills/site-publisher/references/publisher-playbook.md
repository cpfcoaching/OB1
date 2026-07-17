# Site Publisher Playbook

## Current CPF Context

Known local candidate repo:

`/Volumes/Crucial X9 Pro For Mac/Library/CPF Agent/GAI-CPF-Agent-HUB-POC`

Observed stack:

- Vite, React, TypeScript, Tailwind, Express.
- Main frontend entry: `src/App.tsx`.
- Build: `npm run build`.
- Preview: `npm run preview`.
- Backend and frontend dev notes mention `npm run start` and `npm run dev`.
- Cloud Run deploy script exists at `cloud-run-deploy.sh`, but user preference is Vercel for static or app artifacts.

Do not assume this is the public CPF marketing site. Re-check the current source of truth for each publishing task.

## Vercel Lane

Use for static pages, HTML artifacts, reports, landing pages, and full apps unless the user routes the work elsewhere.

Preflight:

```bash
git remote get-url origin 2>/dev/null
cat .vercel/project.json 2>/dev/null || cat .vercel/repo.json 2>/dev/null
command -v vercel && vercel whoami
npm run build
```

If the Vercel CLI is absent, use the Vercel connector when available. If no Vercel path is authenticated, stop and report the exact blocker.

Static output caution:

- If a static project contains a `public/` folder and no framework is detected, Vercel may choose `public` as the output directory.
- In that case, place `index.html` and all referenced public assets inside `public/`, or add explicit project configuration before deploying.
- Always verify the deployed root route after the first deploy because a ready deployment can still serve `404`.

Default deployment posture:

- Preview deploy, not production.
- Private GitHub repo by default.
- `noindex` unlisted by default.
- Ask before pushing to a repo that is already linked to Vercel.

Local verification checklist:

- Route returns `200`.
- Page title is correct.
- Meta description is present.
- Robots tag is `noindex,nofollow` unless public SEO was requested.
- OG title, description, URL, and image are present.
- OG image renders at `1200x630` or equivalent.
- Layout is visually checked in desktop width.

Post-publish checklist:

```bash
curl -I "<live-url>"
curl -L "<live-url>" | rg -n "og:title|og:description|og:image|robots|canonical|<title"
curl -I "<og-image-url>"
```

Also open or screenshot the live URL when browser access is available.

Protected preview handling:

- If live checks return Vercel SSO redirects, use the Vercel temporary access URL tool when available.
- For disposable unlisted test projects, it is acceptable to disable SSO protection only for that test project after confirming the page has `noindex` controls.
- CLI pattern: `vercel project protection disable <project-name> --sso --scope <team-slug>`.
- Report that SSO was changed, because cleanup may need to remove the project or re-enable protection.

## Base44 Lane

Use for AI application POCs where the user wants a fast testable app surface.

Procedure:

1. Search for the Base44 connector or tools.
2. Inspect the target app's data model, pages, and existing design language.
3. Create or update the app as a POC.
4. Add share metadata and image if the platform supports it.
5. Default to unlisted or non-indexed where the platform supports it.
6. Verify the public or preview URL directly. Editor success is not proof.

If Base44 cannot provide private GitHub backing, report that gap and offer a parallel private repo export or source snapshot.

## GitHub Private Repo

Default to a private GitHub repo for every publishable standalone artifact.

Use an existing repo when the artifact belongs to an existing app. Create a new private repo for standalone share pages or apps.

CLI pattern:

```bash
gh auth status
gh repo create "<repo-name>" --private --source . --remote origin --push
```

If a repo already exists:

```bash
git status --short
git remote -v
git add <changed-files>
git commit -m "publish: <slug>"
git push
```

Never commit secrets, `.env`, local browser sessions, build caches, or generated dependency folders.

## Page Metadata

For unlisted pages:

```html
<meta name="robots" content="noindex,nofollow">
<meta property="og:title" content="Specific Share Title">
<meta property="og:description" content="One or two sentence summary.">
<meta property="og:image" content="https://example.com/path/og-image.png">
<meta property="og:type" content="website">
```

For public SEO pages, add a canonical URL and use `index,follow` only when the user explicitly requested public indexing.

## Open Graph Image

Create a page-specific `1200x630` image. If using `image-gateway`:

```bash
/Users/MacAttack/.codex/skills/image-gateway/image-gateway.sh -a 1200:630 -r 1K -o "<repo-static-assets-dir>" "<prompt>"
```

If the gateway rejects `1200:630`, use `-a 16:9` and crop or export to `1200x630` with an available image tool.

Use CPF executive dashboard styling when the page complements CPF or a CPF solution:

- Dark surface.
- Green and gold highlights.
- Clean executive dashboard feel.
- Minimal on-image text.

For new unbranded solutions, choose a fresh palette that fits the product.

## Cleanup Or Keep

After a test publish, offer two concrete paths:

- Keep: leave the repo and deployment in place, optionally rename the slug or make it public.
- Cleanup: remove the test route or repo, delete the Vercel project or deployment if available, and verify the URL no longer serves the test page.
