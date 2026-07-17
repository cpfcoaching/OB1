---
name: html-artifacts
description: Use when output would be dense, visual, interactive, worth keeping, or worth sharing, including plans, reports, research explainers, review summaries, comparisons, diagrams, timelines, dashboards, walkthroughs, and status briefs. Produce or offer a single self-contained offline HTML file using CPF dark executive dashboard styling instead of a long chat response.
---

# HTML Artifacts

## Core Rule

For dense or reusable output, offer or produce a standalone HTML artifact instead of a long chat response. The artifact must be a single `.html` file with inline CSS and inline JavaScript only. It must work offline and must not load fonts, scripts, stylesheets, images, analytics, CDNs, or other external dependencies.

Default output folder:

`/Volumes/Crucial X9 Pro For Mac/Library/OpenBrain/outputs/html-artifacts/`

Use a descriptive dated filename such as `2026-06-28-open-engine-status.html`.

## Trigger Conditions

Use this skill when the answer includes any of these:

- A report, plan, roadmap, research explainer, review summary, or executive brief.
- A comparison table, scoring matrix, decision memo, vendor review, or tradeoff analysis.
- A timeline, workflow, checklist, diagram, walkthrough, or dashboard.
- Enough structure that the user may want to keep, share, print, or revisit it.
- Visual hierarchy, expandable detail, filters, tabs, counters, or status cards would improve comprehension.

If the user did not explicitly ask for HTML, say briefly that the output is dense enough to warrant an HTML artifact and create it when useful.

## Hard Rules

- Create exactly one `.html` file for the artifact.
- Put all CSS in a single `<style>` block.
- Put all JavaScript in a single `<script>` block when JS is needed.
- Use no external network calls or dependencies.
- Use semantic HTML first: `header`, `main`, `section`, `article`, `nav`, `table`, `details`, `summary`, `figure`.
- Keep the artifact readable without JavaScript. Use JS only for optional controls such as filters, tabs, theme toggles, or copy buttons.
- Do not include secrets, credentials, private tokens, or raw personal contact/payment data.
- Avoid em dashes in visible copy and comments.

## CPF House Style Tokens

Define these tokens once at the top of the CSS under `:root` and use them throughout:

```css
:root {
  color-scheme: dark;
  --bg: #08110d;
  --surface: #101c16;
  --surface-2: #16271f;
  --line: #294438;
  --text: #edf7f1;
  --muted: #a9bcb2;
  --green: #0e7a4f;
  --green-bright: #19a66a;
  --gold: #d6a642;
  --gold-soft: #f0d28a;
  --danger: #f87171;
  --radius: 8px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --font: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}
```

Style direction:

- Dark executive dashboard by default.
- Green and gold are accents for highlights, status, calls to action, and chart emphasis.
- Use quiet surfaces, clear borders, compact spacing, and restrained shadows.
- Prefer dense but readable executive information design over marketing hero layouts.
- Keep typography system-font based so the artifact works offline.

## Layout Patterns

### Report

Use a top header with title, date, status, and key metrics. Follow with short sections in this order: executive summary, findings, evidence, risks, next actions. Use cards only for repeated findings or metrics.

### Comparison Table

Use a responsive table with sticky header if useful. Include a score or status column, concise evidence cells, and a clear recommended option. Add simple JS filters only if there are more than about 10 rows.

### Timeline

Use an ordered list or vertical timeline. Each event should include date, label, owner or system, status, and evidence. Use gold for milestones and green for completed states.

### Diagram

Use HTML and CSS boxes, grids, connectors, or inline SVG inside the same file. Keep labels short. Provide a text summary near the diagram so the artifact remains accessible.

### Dashboard

Use compact metric cards, status bands, and one or more tables. Include a source/evidence section. Prefer native HTML tables and CSS bars over canvas unless interactivity is necessary.

## Build Workflow

1. Determine whether HTML is warranted by density, visual value, or reuse value.
2. Choose the closest layout pattern.
3. Create the artifact under the default output folder unless the user gave another path.
4. Write one complete HTML file with:
   - `<!doctype html>`
   - `<meta charset="utf-8">`
   - responsive viewport meta
   - title
   - one CSS block with the CPF tokens
   - semantic body content
   - one optional JS block
5. Include a small footer with generation date, source scope, and any verification caveats.
6. Open or screenshot the result and verify it renders before declaring done.

## Verification

Before final response:

- Open the file in a browser or render it with a local screenshot tool.
- Verify the page is not blank.
- Verify text is readable on desktop width.
- Verify no visible overlap or clipped critical text.
- Verify the file does not reference `http://`, `https://`, external CSS, external JS, or remote images.
- Report the artifact path and the verification method.
