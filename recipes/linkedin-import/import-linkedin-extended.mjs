#!/usr/bin/env node
/**
 * Open Brain — LinkedIn Data Import Extended
 *
 * Extends the base LinkedIn ingestion to include:
 * 1. Profile Headline & Summary (Profile.csv)
 * 2. High-Level active Certifications (Certifications.csv)
 * 3. Recent high-value professional posts (Shares.csv)
 *
 * Environment variables:
 *   SUPABASE_URL              Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY Supabase service role key
 *   OPENROUTER_API_KEY        OpenRouter API key (for summarization + embeddings)
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

// ─── Configuration ──────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const SYNC_LOG_PATH = "linkedin-import-sync-log.json";

// ─── Prompts ─────────────────────────────────────────────────────────────────

const PROMPT_PROFILE = `You are extracting definitive professional positioning statements from a LinkedIn summary and headline.
Extract 1-3 clear, powerful, first-person statements that encapsulate the core professional identity, primary value proposition, and target audience.

CAPTURE:
- Core business impact philosophy (e.g., turning security into a revenue driver).
- Primary target organization type (e.g., Series C/D regulated B2B SaaS).
- Highest-level expertise vectors (AI Governance, Compliance as Code).

FORMAT:
- Clear standalone statements in first person ("I build...", "My methodology revolves around...")
- Concise (1-2 sentences each)
- High density of substance, zero boilerplate.

Return JSON: {"thoughts": ["thought1", "thought2"]}`;

const PROMPT_SHARE = `You are distilling an evergreen professional insight, framework, or tactical recommendation from a thought-leadership LinkedIn post.
Extract 1-2 concise, high-value statements that express a distinct point of view or deployable strategy.

CAPTURE:
- Specific strategic mental models (e.g., "Zero Trust is a decision architecture, not a product").
- Actionable directives for leaders (e.g., "To manage vendor risk, tier vendors by AI exposure").
- Tangible metrics or operational patterns (e.g., "Treating compliance as code can reduce DevOps overhead by 25%").

SKIP:
- Event announcements, newsletter subscription promos, generic external links, hashtags, or "podcast live tomorrow" conversational fluff.
- Call-to-actions like "Drop a comment below" or "DM me".

FORMAT:
- First person ("I advise clients to...", "In my experience...", "I recommend...")
- 1-2 standalone sentences.
- Highly evergreen and actionable.

Return JSON: {"thoughts": ["thought1", "thought2"]}
If the post contains only promos or has no substantial advice/insight, return {"thoughts": []}.`;

const PROMPT_CERTS = `You are synthesizing a list of professional certifications and thought-leadership honors into 1-2 concise validation statements for a personal AI memory.
Review the list, identify the most prestigious/senior credentials (e.g., CISSP, GSLC, CRISC, AWS Security Specialty) and notable thought-leadership rankings (e.g., Top 10 Thought Leader).
Synthesize these into a powerful statement of verified credibility.

FORMAT:
- First person ("I hold senior professional credentials validating my expertise, including...")
- Concise, non-repetitive, highly impactful.

Return JSON: {"thoughts": ["thought1", "thought2"]}`;

// ─── CSV Parsing ────────────────────────────────────────────────────────────

function parseCSV(text) {
  const result = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"'; 
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(field.trim());
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++; 
      if (field || row.length > 0) {
        row.push(field.trim());
        result.push(row);
      }
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length > 0) {
    row.push(field.trim());
    result.push(row);
  }
  return result;
}

function csvToObjects(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0];
  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const obj = {};
    headers.forEach((h, index) => {
      obj[h] = r[index] || "";
    });
    data.push(obj);
  }
  return data;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function loadSyncLog() {
  try {
    return JSON.parse(readFileSync(SYNC_LOG_PATH, "utf8"));
  } catch {
    return { ingested_ids: {}, last_sync: "" };
  }
}

function saveSyncLog(log) {
  log.last_sync = new Date().toISOString();
  writeFileSync(SYNC_LOG_PATH, JSON.stringify(log, null, 2));
}

function hashText(text) {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Network ────────────────────────────────────────────────────────────────

async function httpPost(url, headers, body, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (resp.status >= 500 && attempt < retries) {
        await sleep(1000 * (attempt + 1));
        continue;
      }
      return resp;
    } catch (err) {
      if (attempt < retries) {
        await sleep(1000 * (attempt + 1));
        continue;
      }
      throw err;
    }
  }
}

async function distillRecord(prompt, rawText) {
  const truncated = rawText.slice(0, 6000);
  const resp = await httpPost(
    `${OPENROUTER_BASE}/chat/completions`,
    {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    {
      model: "openai/gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: truncated },
      ],
      temperature: 0.1,
    }
  );

  if (!resp || !resp.ok) {
    console.log(`   Warning: Distillation failed (${resp ? resp.status : "no resp"}), skipping.`);
    return [];
  }

  try {
    const data = await resp.json();
    const result = JSON.parse(data.choices[0].message.content);
    const thoughts = result.thoughts || [];
    return thoughts.filter(t => typeof t === "string" && t.trim());
  } catch (e) {
    console.log(`   Warning: Failed to parse response: ${e.message}`);
    return [];
  }
}

async function generateEmbedding(text) {
  const truncated = text.slice(0, 8000);
  const resp = await httpPost(
    `${OPENROUTER_BASE}/embeddings`,
    {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    {
      model: "openai/text-embedding-3-small",
      input: truncated,
    }
  );

  if (!resp || !resp.ok) return null;

  try {
    const data = await resp.json();
    return data.data[0].embedding;
  } catch (e) {
    return null;
  }
}

async function ingestThought(content, metadata) {
  const embedding = await generateEmbedding(content);
  if (!embedding) return { ok: false, error: "Failed embedding" };

  const resp = await httpPost(
    `${SUPABASE_URL}/rest/v1/thoughts`,
    {
      "Content-Type": "application/json",
      "apikey": SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Prefer": "return=minimal",
    },
    {
      content,
      embedding,
      metadata,
    }
  );

  if (!resp) return { ok: false, error: "No response from Supabase" };
  if (resp.status !== 200 && resp.status !== 201) {
    let detail;
    try { detail = await resp.json(); } catch { detail = await resp.text(); }
    return { ok: false, error: `HTTP ${resp.status}: ${JSON.stringify(detail)}` };
  }

  return { ok: true };
}

// ─── Main Loop ───────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  let inputPath = null;
  let dryRun = false;
  let sharesLimit = 25;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--shares-limit") sharesLimit = parseInt(args[++i], 10);
    else if (!args[i].startsWith("--") && !inputPath) inputPath = args[i];
  }

  if (!inputPath) {
    console.log("Usage: node import-linkedin-extended.mjs <folder-path> [--dry-run] [--shares-limit N]");
    process.exit(1);
  }

  if (!dryRun) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENROUTER_API_KEY) {
      console.error("Error: Missing env variables.");
      process.exit(1);
    }
  } else if (!OPENROUTER_API_KEY) {
    console.error("Error: OPENROUTER_API_KEY required.");
    process.exit(1);
  }

  console.log(`\n🚀 Starting Extended LinkedIn Import Pipeline [${dryRun ? 'DRY RUN' : 'LIVE'}]`);

  const syncLog = loadSyncLog();
  const finalStats = { processed: 0, distilled: 0, ingested: 0, errors: 0 };

  // ─── JOB 1: Profile.csv ────────────────────────────────────────────────────
  const profilePath = join(inputPath, "Profile.csv");
  if (existsSync(profilePath)) {
    console.log("\n📄 Processing Profile.csv...");
    const text = readFileSync(profilePath, "utf8");
    const rows = parseCSV(text);
    const items = csvToObjects(rows);

    if (items.length > 0) {
      const profile = items[0];
      const signature = hashText(JSON.stringify(profile));
      const cacheKey = `profile:${signature}`;

      if (dryRun || !syncLog.ingested_ids[cacheKey]) {
        console.log("   Distilling core profile branding...");
        const inputStr = `Headline: ${profile.Headline}\nSummary: ${profile.Summary}`;
        const thoughts = await distillRecord(PROMPT_PROFILE, inputStr);

        for (let j = 0; j < thoughts.length; j++) {
          const tText = thoughts[j];
          finalStats.distilled++;
          if (dryRun) {
            console.log(`     👉 Thought: ${tText}`);
          } else {
            const res = await ingestThought(`[Professional Core] ${tText}`, { source: "linkedin_profile_summary" });
            if (res.ok) {
              finalStats.ingested++;
              console.log(`     ✅ Ingested thought ${j + 1}`);
            } else {
              finalStats.errors++;
              console.log(`     ❌ Error: ${res.error}`);
            }
          }
        }
        if (!dryRun) {
          syncLog.ingested_ids[cacheKey] = true;
          saveSyncLog(syncLog);
        }
        finalStats.processed++;
      } else {
        console.log("   Skipping already ingested profile.");
      }
    }
  }

  // ─── JOB 2: Certifications.csv ─────────────────────────────────────────────
  const certsPath = join(inputPath, "Certifications.csv");
  if (existsSync(certsPath)) {
    console.log("\n📄 Processing Certifications.csv...");
    const text = readFileSync(certsPath, "utf8");
    const rows = parseCSV(text);
    const items = csvToObjects(rows);

    if (items.length > 0) {
      const signature = hashText(JSON.stringify(items));
      const cacheKey = `certs:${signature}`;

      if (dryRun || !syncLog.ingested_ids[cacheKey]) {
        console.log(`   Synthesizing ${items.length} certifications/honors...`);
        const inputStr = items.map(c => `- ${c.Name} (${c.Authority || ''})`).join("\n");
        const thoughts = await distillRecord(PROMPT_CERTS, inputStr);

        for (let j = 0; j < thoughts.length; j++) {
          const tText = thoughts[j];
          finalStats.distilled++;
          if (dryRun) {
            console.log(`     👉 Thought: ${tText}`);
          } else {
            const res = await ingestThought(`[Verified Expertise] ${tText}`, { source: "linkedin_certifications" });
            if (res.ok) {
              finalStats.ingested++;
              console.log(`     ✅ Ingested thought ${j + 1}`);
            } else {
              finalStats.errors++;
              console.log(`     ❌ Error: ${res.error}`);
            }
          }
        }
        if (!dryRun) {
          syncLog.ingested_ids[cacheKey] = true;
          saveSyncLog(syncLog);
        }
        finalStats.processed++;
      } else {
        console.log("   Skipping already ingested certifications.");
      }
    }
  }

  // ─── JOB 3: Shares.csv (Recent High-Value Posts) ────────────────────────────
  const sharesPath = join(inputPath, "Shares.csv");
  if (existsSync(sharesPath)) {
    console.log("\n📄 Processing Shares.csv...");
    const text = readFileSync(sharesPath, "utf8");
    const rows = parseCSV(text);
    const items = csvToObjects(rows);
    console.log(`   Found ${items.length} total historical posts.`);

    // Filter for items with substantial text (likely to be thought leadership articles, not simple replies or short comments)
    const qualifiedShares = items
      .filter(s => s.ShareCommentary && s.ShareCommentary.length > 150)
      .slice(0, sharesLimit);

    console.log(`   Scanning top ${qualifiedShares.length} qualified posts for ingestion...`);

    for (let i = 0; i < qualifiedShares.length; i++) {
      const share = qualifiedShares[i];
      const signature = hashText(JSON.stringify(share));
      const cacheKey = `share:${signature}`;

      if (!dryRun && syncLog.ingested_ids[cacheKey]) {
        continue; // Dedup
      }

      console.log(`   [Post ${i+1}/${qualifiedShares.length}] Distilling share from ${share.Date}...`);
      const inputStr = `Date: ${share.Date}\nContent:\n${share.ShareCommentary}`;
      const thoughts = await distillRecord(PROMPT_SHARE, inputStr);

      if (thoughts.length === 0) {
        console.log("     -> No evergreen thoughts extracted.");
        if (!dryRun) {
          syncLog.ingested_ids[cacheKey] = true;
          saveSyncLog(syncLog);
        }
        continue;
      }

      for (let j = 0; j < thoughts.length; j++) {
        const tText = thoughts[j];
        finalStats.distilled++;
        if (dryRun) {
          console.log(`     👉 Thought: ${tText}`);
        } else {
          const res = await ingestThought(`[Professional Insight] ${tText}`, {
            source: "linkedin_shares",
            published: share.Date,
            url: share.ShareLink
          });
          if (res.ok) {
            finalStats.ingested++;
            console.log(`     ✅ Ingested thought ${j+1}`);
          } else {
            finalStats.errors++;
            console.log(`     ❌ Error: ${res.error}`);
          }
        }
      }
      if (!dryRun) {
        syncLog.ingested_ids[cacheKey] = true;
        saveSyncLog(syncLog);
      }
      finalStats.processed++;
      await sleep(300);
    }
  }

  console.log("\n" + "═".repeat(50));
  console.log("🏁  Summary:");
  console.log(`   Source Items Processed: ${finalStats.processed}`);
  console.log(`   Generated Thoughts:     ${finalStats.distilled}`);
  if (!dryRun) {
    console.log(`   Ingested to Supabase:   ${finalStats.ingested}`);
    console.log(`   Errors encountered:     ${finalStats.errors}`);
  }
  console.log("═".repeat(50) + "\n");
}

main().catch(err => {
  console.error("\nFatal run error:", err);
  process.exit(1);
});
