---
name: branded-image-prompting
description: Create CPF-branded image prompts, reusable image templates, and drift-correction guidance, then route actual generation through image-gateway.
---

# Branded Image Prompting

## When To Use

Use this skill for any branded or recurring CPF image request, including:

- Substack headers, social images, briefing thumbnails, product promos, mockups, diagrams, infographics, checklist graphics, and executive summary visuals.
- Requests to make an image feel like CPF Coaching, Chris Foulon, CFP, or the established green and gold executive dashboard style.
- Requests to correct image drift, such as wrong colors, weak layout, too much text, generic stock-art feel, poor contrast, or off-brand typography.
- Any image request that should become a reusable prompt pattern.

## Brand Defaults

Apply these defaults unless the user overrides them:

- Brand: CPF Coaching.
- Primary colors: deep green `#0E7A4F`, bright green `#19A66A`, gold `#D6A642`, soft gold `#F0D28A`, dark background `#08110D`.
- Typography direction: clean executive sans-serif, system-font feel, crisp labels, no decorative display type.
- Visual style: dark executive dashboard, editorial cyber-risk briefing, strong information grouping, precise gold highlights, clean green accents, high contrast, premium but practical.
- Text handling: use minimal on-image text because image models often distort typography. Prefer 2 to 5 short labels. Use `cpf-coaching.com` as a small footer only when useful.
- Composition: clear focal hierarchy, visible sections, simple shapes, concise labels, no generic stock-photo metaphors, no cluttered collage.

Common aspect ratios:

- Substack header: `16:9`, target `1376x768`.
- LinkedIn landscape: `16:9` or `1.91:1`.
- LinkedIn square: `1:1`.
- Executive thumbnail: `16:9`.
- Diagram or checklist: `16:9` for articles, `1:1` for social.

## Workflow

1. Identify the format, audience, destination, and aspect ratio.
2. Load `references/prompt-library.md` and pick the closest template.
3. Produce a final natural-language prompt or JSON-structured prompt.
4. Route generation through image-gateway when the user asks for an actual image.
5. Inspect the generated file before reporting success.
6. If the user approves the result, append the winning prompt to `references/prompt-library.md` under successful prompts.

Actual generation must use:

```bash
/Users/MacAttack/.codex/skills/image-gateway/image-gateway.sh -a 16:9 -o "/Volumes/Crucial X9 Pro For Mac/Library/OpenBrain/ai-images" "<prompt>"
```

Do not write direct image API code in this skill. Do not expose API keys in prompts, logs, artifacts, or examples.

## Prompt Patterns

Natural-language prompts work best for fast ideation, simple thumbnails, and one-off editorial images.

Use this shape:

```text
Create a CPF Coaching branded [format] for [topic]. Use a dark executive dashboard style with deep green #0E7A4F, bright green #19A66A, gold #D6A642, soft gold #F0D28A, and dark background #08110D. Composition: [layout]. Include only these short labels: [labels]. Use clean executive sans-serif typography, crisp spacing, strong contrast, and a small cpf-coaching.com footer if readable. Avoid stock-photo cliches, clutter, blurry text, and colors outside the CPF palette.
```

JSON-structured prompts work best for recurring formats, strict layout, prompt libraries, and drift correction.

Use this shape:

```json
{
  "brand": "CPF Coaching",
  "format": "Substack header",
  "aspect_ratio": "16:9",
  "style": "dark executive dashboard, editorial cyber-risk briefing",
  "palette": {
    "deep_green": "#0E7A4F",
    "bright_green": "#19A66A",
    "gold": "#D6A642",
    "soft_gold": "#F0D28A",
    "background": "#08110D"
  },
  "composition": "left-aligned title zone, right-side risk map, subtle grid, gold highlight path",
  "labels": ["Signal", "Exposure", "Action"],
  "typography": "clean executive sans-serif, minimal readable labels",
  "footer": "cpf-coaching.com",
  "avoid": ["generic stock art", "dense paragraphs", "purple palette", "blurred text", "busy collage"]
}
```

## Drift Correction

- Wrong colors: restate exact hex codes and say "use only this palette except neutral white and charcoal."
- Too generic: specify "editorial cyber-risk briefing, not stock photography, not abstract business clip art."
- Mangled text: reduce labels to 2 to 5 words total, or remove text and place labels in the surrounding post.
- Cluttered layout: request one focal object, three grouped zones maximum, large negative space, and clear hierarchy.
- Poor contrast: require dark background, white or soft-gold labels, and gold accent lines only for emphasis.
- Wrong aspect ratio: restate the exact ratio and destination in the first sentence.
- Off-style typography: request clean executive sans-serif, system-font feel, no decorative fonts, no warped lettering.

## Reporting

When generation completes, report:

- The exact prompt used.
- The output file path.
- The aspect ratio.
- Any image-gateway cost or token details shown by the tool.
- Whether the result was inspected.

If generation fails, report the exact error and stop without pretending an image exists.
