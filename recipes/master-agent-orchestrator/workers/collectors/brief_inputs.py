#!/usr/bin/env python3
"""Codex-lane collector: gather raw Chief of Staff brief inputs into one JSON bundle.

This is the deterministic, mechanical part of the morning brief, the work that
belongs in the Codex (build/run) lane. It does NOT make judgments. It reads
local sources, normalizes them, flags time-sensitive items by simple rules, and
emits a structured bundle that the Claude (reason/synthesize) lane consumes.

Lanes:
  - Codex (this script): parse memory.md, list recent content files, optionally
    pull last-24h news from a public feed, and produce a checklist of connector
    reads that still require the Claude lane (MCP) or a credentialed pull.
  - Claude (downstream): read this bundle + live connectors, then rank, decide,
    and write the brief.

Standard library only, so it runs under the default sandbox permission policy
(`python task.py`). Network is optional and degrades gracefully when egress is
blocked (e.g., inside the Cowork sandbox).

Usage:
  python3 brief_inputs.py --memory-file <path> --out <path> [--news-feed URL] [--now ISO]
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
import urllib.request

# Tokens that mark an item as time-sensitive or slipping. Pure pattern matching,
# no interpretation; the Claude lane decides what to do about them.
URGENT_TOKENS = ("HAPPENING TODAY", "SHIP TODAY", "TODAY", "TIMELY")
SLIP_TOKENS = ("SLIP", "STILL OWED", "OWED", "overdue", "slipped", "AWAITING")
RESOLVED_TOKENS = ("RESOLVED", "CLEARED", "Closed", "Drop", "Dropped")
DATE_RE = re.compile(r"(20\d{2}-\d{2}-\d{2})")
EMAIL_RE = re.compile(r"[\w.\-+]+@[\w.\-]+\.\w+")


def parse_sections(md_text: str) -> dict:
    """Split a markdown file into {h2_title: [bullet lines]}."""
    sections: dict[str, list[str]] = {}
    current = None
    for line in md_text.splitlines():
        h2 = re.match(r"^##\s+(.*)", line)
        if h2:
            current = h2.group(1).strip()
            sections[current] = []
            continue
        if current is not None and line.strip().startswith("- "):
            sections[current].append(line.strip()[2:].strip())
    return sections


def classify(item: str, today: str) -> dict:
    text = item
    dates = DATE_RE.findall(text)
    is_resolved = any(t in text for t in RESOLVED_TOKENS)
    return {
        "text": text,
        "dates": dates,
        "emails": EMAIL_RE.findall(text),
        "urgent": (not is_resolved) and any(t in text for t in URGENT_TOKENS),
        "slipping": (not is_resolved) and any(t in text for t in SLIP_TOKENS),
        "resolved": is_resolved,
        "mentions_today": today in text,
    }


def collect_memory(memory_file: str, today: str) -> dict:
    if not os.path.exists(memory_file):
        return {"error": f"memory file not found: {memory_file}"}
    with open(memory_file, "r", encoding="utf-8") as fh:
        text = fh.read()
    sections = parse_sections(text)
    out = {}
    for title, bullets in sections.items():
        out[title] = [classify(b, today) for b in bullets]
    return out


def summarize(memory: dict) -> dict:
    active = memory.get("Active Commitments", [])
    watched = memory.get("Watched Threads", [])
    vips = memory.get("VIPs Owed Response", [])
    flatten = active + watched + vips
    return {
        "active_commitments": len(active),
        "watched_threads": len(watched),
        "vips_owed": len(vips),
        "urgent_today": [i["text"] for i in active if i["urgent"]],
        "slipping": [i["text"] for i in flatten if i["slipping"] and not i["resolved"]],
        "open_emails_owed": sorted({e for i in flatten if not i["resolved"] for e in i["emails"]}),
    }


def list_recent_files(directory: str, limit: int = 12) -> list:
    if not os.path.isdir(directory):
        return []
    entries = []
    for name in os.listdir(directory):
        path = os.path.join(directory, name)
        try:
            st = os.stat(path)
        except OSError:
            continue
        entries.append({"name": name, "mtime": st.st_mtime, "bytes": st.st_size})
    entries.sort(key=lambda e: e["mtime"], reverse=True)
    for e in entries:
        e["modified"] = dt.datetime.fromtimestamp(e["mtime"]).isoformat(timespec="seconds")
        del e["mtime"]
    return entries[:limit]


def fetch_news(feed_url: str, since_hours: int = 24, limit: int = 8) -> dict:
    """Best-effort RSS pull. Degrades to a clear status when egress is blocked."""
    if not feed_url:
        return {"status": "skipped", "reason": "no feed configured", "items": []}
    try:
        req = urllib.request.Request(feed_url, headers={"User-Agent": "cpf-brief-collector/1.0"})
        with urllib.request.urlopen(req, timeout=8) as resp:
            raw = resp.read().decode("utf-8", "replace")
    except Exception as exc:  # noqa: BLE001 - report, never crash the collection
        return {"status": "unavailable", "reason": f"{type(exc).__name__}: {exc}", "items": []}
    titles = re.findall(r"<title>(.*?)</title>", raw, re.DOTALL)
    links = re.findall(r"<link>(.*?)</link>", raw, re.DOTALL)
    items = []
    for t, l in list(zip(titles, links))[1 : limit + 1]:  # skip channel title
        items.append({"title": re.sub(r"<.*?>", "", t).strip(), "link": l.strip()})
    return {"status": "ok", "count": len(items), "items": items}


# Reads that require the Claude (MCP) lane or a credentialed script. The collector
# names them explicitly so the split is auditable and nothing is silently dropped.
CONNECTOR_CHECKLIST = [
    {"source": "Google Calendar", "pull": "today's events + tomorrow's first", "lane": "claude-mcp"},
    {"source": "Gmail", "pull": "unread/flagged last 24h", "lane": "claude-mcp"},
    {"source": "Slack", "pull": "DMs, @mentions, #cpfcoaching-project last 24h", "lane": "claude-mcp"},
    {"source": "CRM/Apollo", "pull": "deal stage changes, VIP activity, dormant contacts", "lane": "claude-mcp"},
    {"source": "Notion", "pull": "Lead Pipeline, LinkedIn Post Queue, project pages", "lane": "claude-mcp"},
    {"source": "AI/cyber/risk news", "pull": "last-24h items (web search)", "lane": "claude-mcp-or-codex-feed"},
    {"source": "Later analytics", "pull": "weekly snapshot via Chrome MCP", "lane": "codex-credentialed"},
]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--memory-file", required=True)
    ap.add_argument("--out", default="")
    ap.add_argument("--news-feed", default=os.environ.get("CPF_NEWS_FEED", ""))
    ap.add_argument("--since-hours", type=int, default=24)
    ap.add_argument("--now", default="")
    args = ap.parse_args()

    now = dt.datetime.fromisoformat(args.now) if args.now else dt.datetime.now()
    today = now.date().isoformat()
    memory_dir = os.path.dirname(os.path.abspath(args.memory_file))

    memory = collect_memory(args.memory_file, today)
    bundle = {
        "schema": "cpf.brief_inputs.v1",
        "generated_at": now.isoformat(timespec="seconds"),
        "weekday": now.strftime("%A"),
        "today": today,
        "lane": "codex",
        "sources": {
            "memory": memory,
            "summary": summarize(memory) if "error" not in memory else memory,
            "recent_files": list_recent_files(memory_dir),
            "news": fetch_news(args.news_feed, args.since_hours),
        },
        "needs_claude_lane_pull": CONNECTOR_CHECKLIST,
    }

    text = json.dumps(bundle, indent=2)
    if args.out:
        os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(text)
        # Compact status line for the orchestrator console log.
        s = bundle["sources"]["summary"]
        print(json.dumps({
            "ok": True,
            "out": args.out,
            "weekday": bundle["weekday"],
            "active_commitments": s.get("active_commitments"),
            "urgent_today": len(s.get("urgent_today", [])),
            "slipping": len(s.get("slipping", [])),
            "news_status": bundle["sources"]["news"]["status"],
        }))
    else:
        print(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
