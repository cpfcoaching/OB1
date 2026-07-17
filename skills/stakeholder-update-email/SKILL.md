---
name: stakeholder-update-email
description: Draft or send short truthful stakeholder update emails after work ships with stakeholder-visible impact. Use when work merges, ships, deploys, publishes, or otherwise changes something a stakeholder can see or use, or when the user asks for an update email, launch note, stakeholder note, shipped-work summary, or delivery email.
---

# Stakeholder Update Email

## Purpose

Create concise stakeholder updates that explain shipped behavior in the recipient's vocabulary, not implementation detail. Send nothing when nothing stakeholder-visible changed.

## Defaults

Priority recipient addresses:

- `chris@cpf-coaching.com`
- `christophefoulon@gmail.com`

Style:

- Professional.
- Low jargon.
- Pareto principle: focus on the 20 percent that matters most.
- Pyramid principle: lead with the point, then give only the necessary support.

Delivery:

- Draft by default.
- Local draft is acceptable for Outlook.
- Gmail draft in Chrome is acceptable when browser access is available and the user asks for that path.
- Sending requires explicit confirmation from the user every time.
- CC `chris@cpf-coaching.com` only when sending from one of the user's other addresses.

## Trigger Conditions

Use this skill when:

- Work merges or ships with stakeholder-visible impact.
- A deployment, publication, automation, report, feature, fix, or content package is ready for a stakeholder to know about.
- The user asks for an update email, stakeholder note, launch note, shipped-work email, or delivery email.
- A session wraps after work that affects someone outside the implementation session.

## Visibility Gate

Before drafting, ask:

- What changed that the stakeholder can see, use, approve, or act on?
- Was it verified?
- Who cares and why?

If nothing stakeholder-visible changed:

```text
No stakeholder update needed: nothing stakeholder-visible shipped or changed.
```

Do not draft or send an email for internal-only setup, refactors, partial work, failed attempts, or unverified claims unless the user explicitly wants a status note.

## Recipient Selection

Choose the recipient based on the shipped impact:

- Use `chris@cpf-coaching.com` for professional CPF Coaching, client-facing, product, or operational updates.
- Use `christophefoulon@gmail.com` for personal, cross-account, or non-CPF updates when that is the intended inbox.
- If the right stakeholder is unclear, draft with `To: TBD` and ask before sending.

When recurring stakeholder details are unavailable, infer only from verified project context and keep the recipient generic.

## Writing Rules

Always:

- Lead with the outcome.
- Describe behavior in the recipient's vocabulary.
- Say what was verified.
- Say what is next.
- Keep it short.
- Use concrete dates, links, paths, or IDs when they help the recipient act.

Never:

- Call something done if it was not verified.
- Hide partial delivery.
- Over-explain implementation details.
- Mention internal tool noise unless it affects the stakeholder.
- Send without explicit confirmation.

For partial work, state the shipped part and the remaining part plainly.

## Email Format

Use this short format:

```text
Subject: <short outcome>

Hi <name>,

<One-sentence lead: what changed.>

What changed:
- <1 to 3 bullets in stakeholder language>

What it means for you:
- <1 to 2 bullets about impact, decision, or action>

What's next:
- <1 to 2 bullets, including owner or timing if known>

Best,
<sender>
```

Trim sections when they add no value. For very small updates, use three short paragraphs with the same structure.

## Draft Mechanics

Default local draft:

- Create a Markdown draft under a repo or workspace draft folder, such as:

```text
outputs/stakeholder-updates/YYYY-MM-DD-<short-topic>.md
```

- Include `To`, optional `CC`, `Subject`, and `Body`.
- Report the draft path.

Outlook local draft:

- Prepare the same fields for copy into Outlook.
- If an Outlook connector or local automation is available and the user asks for it, create a draft rather than sending.

Gmail in Chrome:

- Use Chrome only when browser control is available and the user asks for a Gmail Drafts path.
- Create the draft in Gmail Drafts.
- Stop before sending unless the user explicitly confirms.

## Send Mechanics

Sending requires explicit confirmation after showing the final draft.

Before sending, report:

- From account.
- To.
- CC.
- Subject.
- Body.
- Whether the work was fully or partially verified.

If sending from an address other than `chris@cpf-coaching.com`, CC `chris@cpf-coaching.com`.

If using an API or connector, never print secrets. If the configured send mechanism is unavailable, leave a draft and report the blocker.

## Final Report

Report:

- Whether the visibility gate passed.
- Recipient selected and why.
- Draft path or draft destination.
- Verification facts included.
- Whether anything was partial or omitted.
- If sent, send mechanism and confirmation source.
