---
name: buffer-content-publisher
description: >
  Draft and publish CPF Coaching voice content to Buffer. Use when the user
  wants to turn a topic, idea, or rough notes into a platform-ready social post
  and queue it to Buffer. Applies the CPF Coaching vCISO advisory voice:
  authoritative, data-led, SMB-focused, solutions-oriented. Supports LinkedIn
  posts, Twitter/X threads, and multi-channel scheduling. Activate when the user
  says "post to Buffer", "draft a LinkedIn post", "queue content", "schedule this
  for Buffer", or provides a topic and asks to publish it.
author: CPF-Coaching
version: 1.0.0
---

# Buffer Content Publisher

## Purpose

Turn a topic, idea, or rough notes into a polished, platform-optimized post and
queue it to Buffer in one workflow. Every post is written in the CPF Coaching
voice: advisory, data-grounded, SMB-facing, zero fear-mongering, zero em dashes.

---

## Required Tools

Before doing anything, confirm these tools are available:

- A Buffer MCP tool for listing channels (usually `list_channels` or similar)
- A Buffer MCP tool for creating/queuing posts
- Optionally: a Buffer MCP tool for checking queue status

If Buffer tools are missing, stop and say:
> "The Buffer MCP isn't connected. Run: `claude mcp add --transport http buffer https://mcp.buffer.com/mcp` — then reload and try again."

Do not proceed without Buffer tools present.

---

## CPF Coaching Voice: Non-Negotiable Rules

Every post written by this skill must follow these rules. No exceptions.

**Tone:**
- Authoritative and measured: grounded in real practitioner experience
- Solutions-oriented: every problem framed has a path forward
- Executive-facing: the reader is a decision-maker, not a student
- Data-led: cite real statistics or real-world developments when opening

**What to always include:**
- SMB context: write for organizations without dedicated security teams
- A clear point of view or recommendation
- A specific, value-anchored CTA (no vague outcomes)

**What to never do:**
- Never use em dashes in any form
- Never fear-monger without a solution path
- Never write for an enterprise audience without translating for SMBs
- Never overpromise ("this will protect you from every attack")
- Never use jargon without a brief plain-English translation on first use

**Opening patterns that work:**
1. Data anchor: open with a real statistic from DBIR, CISA, IBM, or NIST
2. Consequence frame: "Most SMBs discover their security gap during a breach"
3. Landscape shift: "The threat environment for SMBs has changed"
4. Resource reality: "You don't have a 12-person security team"

---

## Workflow

### Step 1: Understand what the user wants to post

Ask for:
- **Topic or idea**: what is this post about? (or accept raw notes/a brief they paste)
- **Platform**: LinkedIn, Twitter/X, or "queue to all"? (default: LinkedIn if unspecified)
- **Post type**: thought leadership, advisory tip, stat spotlight, product/service CTA?
- **Urgency**: queue for next available slot, or "share now"?

If the user gives enough context in their initial message, skip questions you can infer. Don't interrogate — default to LinkedIn + next available slot when intent is clear.

### Step 2: Draft the post

Apply the CPF Coaching voice to produce platform-optimized copy.

**LinkedIn format:**
- Open with a data point, landscape observation, or consequence frame — no preamble
- 3–5 short paragraphs with line breaks (LinkedIn rewards white space)
- Numbered framework or clear takeaway in the body
- Close with a specific, value-anchored CTA or a sharp point of view question
- Length: 150–300 words for regular posts; up to 500 for thought-leadership pieces
- No em dashes

**Twitter/X format:**
- Lead tweet: 1 punchy sentence with the core insight (under 240 chars)
- Thread of 3–6 tweets if the topic needs development
- Each tweet can stand alone: no "1/" without payoff
- CTA in the final tweet: link, reply prompt, or direct action
- No em dashes

Present the draft clearly. Ask: "Want to adjust the tone, add a stat, or change the CTA before I queue it?"

### Step 3: Select the channel

If the user hasn't specified a channel, list their Buffer channels:

```
[call Buffer list-channels tool]
```

Present the channels as a numbered list and ask which one(s) to post to. If only one channel exists, skip the question and confirm it.

### Step 4: Queue or publish

Once the draft is approved and the channel is confirmed:

```
[call Buffer create-post tool with the approved copy and selected channel]
```

After queuing, confirm:
- Which channel it was posted to
- Whether it's queued (next slot) or published immediately
- The scheduled time if available

### Step 5: Optional — log to Open Brain

If the user has Open Brain connected (`capture_thought` available), offer to log the post:

> "Want me to save this post to your Open Brain memory for future reference or content auditing?"

If yes, capture a concise summary thought with the platform, topic, and date.

---

## Trigger Phrases

This skill fires on:
- "Post to Buffer [topic]"
- "Draft a LinkedIn post about [topic]"
- "Queue [topic] for Buffer"
- "Schedule [content] to my socials"
- "Write a Twitter thread on [topic]"
- "Publish this to LinkedIn" (followed by notes or a brief)
- "Help me draft content for Buffer"

---

## Pre-Publish Checklist

Before queueing, verify internally:

- [ ] Opening is a data point, landscape shift, consequence frame, or resource reality — not a preamble
- [ ] SMB context is explicit (not written for enterprise)
- [ ] Technical terms are translated for a business decision-maker
- [ ] Every problem framed has a path to a solution
- [ ] CTA is specific and tied to a concrete outcome
- [ ] Zero em dashes anywhere in the copy
- [ ] Would a CFO or COO of a 50-person company understand and act on this?

---

## Error Handling

**Buffer returns an auth error:**
> "Buffer needs to re-authorize. Run `claude mcp add --transport http buffer https://mcp.buffer.com/mcp` again and complete the OAuth flow."

**No channels available:**
> "Buffer connected but no channels are listed. Log into buffer.com and confirm at least one social channel is connected under your account."

**Post fails to queue:**
> "The post didn't queue. Check that your Buffer channel has a posting schedule set, or ask me to try 'share now' mode instead."
