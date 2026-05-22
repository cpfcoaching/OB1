# Buffer Content Publisher

> Draft and queue CPF Coaching voice content to Buffer in one step.

## What It Does

This skill turns a topic, rough idea, or pasted notes into a polished, platform-optimized social post and queues it to Buffer without leaving your AI client. Every post is written in the CPF Coaching advisory voice: authoritative, data-grounded, SMB-focused, and zero fear-mongering.

Supports LinkedIn posts, Twitter/X threads, and multi-channel queuing. Works with the official [Buffer MCP integration](../../integrations/buffer-mcp/).

## Supported Clients

- Claude Code
- Claude Desktop
- Any client that supports reusable skills plus MCP tool access

## Prerequisites

- Buffer account with at least one connected social channel
- Buffer MCP connected: `claude mcp add --transport http buffer https://mcp.buffer.com/mcp`
- AI client that supports reusable skills or custom instructions
- Optionally: Open Brain connected for post logging (`capture_thought` available)

## Installation

1. Copy `SKILL.md` into your client's reusable-instructions location.

   For Claude Code:
   ```bash
   mkdir -p ~/.claude/skills/buffer-content-publisher
   cp skills/buffer-content-publisher/SKILL.md ~/.claude/skills/buffer-content-publisher/SKILL.md
   ```

2. Add the Buffer MCP server if you haven't already:
   ```bash
   claude mcp add --transport http buffer https://mcp.buffer.com/mcp
   ```

3. Reload or restart your client.

4. Verify by saying: "Draft a LinkedIn post about why SMBs are the top ransomware target this year and queue it to Buffer."

## Trigger Conditions

- "Post to Buffer [topic]"
- "Draft a LinkedIn post about [topic]"
- "Queue [topic] for Buffer"
- "Write a Twitter thread on [topic]"
- "Publish this to LinkedIn" (followed by notes or a brief)
- Any request to create and schedule social content

## Expected Outcome

The skill asks for the topic and platform (defaults to LinkedIn), drafts a CPF Coaching voice post, shows you the draft for approval, selects or confirms the Buffer channel, then queues the post. You get a confirmation with channel name and scheduled time.

Optional: if Open Brain is connected, the skill offers to log the post for content auditing or future reference.

## Voice Reference

The CPF Coaching voice is defined in the [`cpf-coaching-voice`](../cpf-coaching-voice/) skill. This skill embeds the critical rules inline (no em dashes, no fear-mongering without solutions, SMB audience, data-anchored openings) and does not require the voice skill to be loaded separately.

## Troubleshooting

**Issue: "The Buffer MCP isn't connected"**
Solution: Run `claude mcp add --transport http buffer https://mcp.buffer.com/mcp` and complete the OAuth flow on first use.

**Issue: Posts queue but don't publish**
Solution: Log into buffer.com and confirm a posting schedule is set on your channel, or request "share now" mode.

**Issue: Voice sounds off / generic**
Solution: Make sure `SKILL.md` is in the correct skills folder for your client and the client was reloaded after install.
