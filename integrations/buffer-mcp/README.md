# Buffer MCP

> Connect Buffer's social media scheduling platform to Claude via the official Buffer MCP server.

## What It Does

Gives your AI client direct read/write access to your Buffer channels, queues, and scheduled posts via the official remote MCP server at `https://mcp.buffer.com/mcp`. No local server required — connects through Claude Desktop's custom connectors UI or Claude Code's `claude mcp add` command.

## Prerequisites

- A Buffer account with at least one connected social channel (LinkedIn, Twitter/X, Instagram, Facebook, etc.)
- Claude Desktop (v0.10+) or Claude Code (any recent version)
- Your Buffer OAuth credentials (handled automatically on first connect)

## Credential Tracker

```text
BUFFER MCP -- CREDENTIAL TRACKER
--------------------------------------

FROM BUFFER
  Account email:         ____________
  Connected channels:    ____________  (e.g. LinkedIn page, Twitter handle)

FROM SETUP
  MCP server URL:        https://mcp.buffer.com/mcp
  Claude connector name: buffer

--------------------------------------
```

## Steps

### Claude Code

1. Run the following command in your terminal:

   ```bash
   claude mcp add --transport http buffer https://mcp.buffer.com/mcp
   ```

2. On first use, Claude will surface an OAuth link. Open it, authorize Buffer, and return to Claude.

3. Verify by asking Claude: "List my Buffer channels." It should return your connected social profiles.

### Claude Desktop

1. Open Claude Desktop → **Settings** → **Connectors** → **Add custom connector**
2. Paste `https://mcp.buffer.com/mcp` and name it `buffer`
3. Save. On first use, complete the OAuth flow in the browser popup.
4. Verify by asking: "List my Buffer channels."

## Expected Outcome

Once connected, Claude can:

- List your Buffer channels and queues
- Draft and schedule posts to any connected channel
- Check your posting schedule and queue status
- Update or delete queued posts

## Tool Surface Area

The Buffer MCP exposes tools for channel listing, post creation, queue inspection, and post management. These tools add context weight — see the [MCP Tool Audit & Optimization Guide](../../docs/05-tool-audit.md) if you're managing a large tool count.

## Pairing with the Buffer Content Publisher Skill

Install the [`buffer-content-publisher`](../../skills/buffer-content-publisher/) skill to get a voice-aware publishing workflow that drafts platform-optimized content and queues it in one step.

## Troubleshooting

**Issue: OAuth never completes / loops back to authorization screen**
Solution: Make sure you're logged into the correct Buffer account in your browser. Clear cookies for buffer.com and retry.

**Issue: "No channels found" after connecting**
Solution: Log into buffer.com directly and confirm at least one social channel is connected under your account's channels tab.

**Issue: Posts queued but not publishing**
Solution: Check your Buffer queue in the app — Buffer requires a posting schedule set on each channel. Set a schedule or use "Share Now" mode.
