#!/usr/bin/env node
/**
 * Open Brain — LinkedIn Data Import
 *
 * Reads LinkedIn Data Export CSVs (specifically Positions and Recommendations),
 * distills entries via LLM into standalone thoughts, and loads
 * them into your Open Brain with vector embeddings and metadata.
 *
 * Usage:
 *   node import-linkedin-data.mjs /path/to/linkedin/export [options]
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

// ─── Summarization Prompts ───────────────────────────────────────────────────

const PROMPT_POSITIONS = `You are distilling a specific professional job role into standalone knowledge records for a personal knowledge base. 
Extract 1-3 high-value statements that articulate core expertise, key methodologies, or significant outcomes achieved during this tenure.

CAPTURE:
- Unique methodologies or technical approaches executed
- Concrete leadership strategies or frameworks developed
- Major repeatable outcomes or business capabilities unlocked

SKIP:
- Boilerplate introductory fluff
- List of software names alone

FORMAT:
- Clear, standalone statements in first-person present or past tense ("I developed a...", "I specialize in...")
- Concise (1-2 sentences each)

Return JSON: {"thoughts": ["thought1", "thought2"]}
If there is no special insight, return {"thoughts": []}.`;

const PROMPT_RECOMMENDATIONS = `You are extracting validated superpowers and character traits from a peer recommendation received on LinkedIn. 
Distill the text into 1-2 concise statements summarizing how this peer observed and quantified my value.

CAPTURE:
- Direct quotes of praise or specific reputation markers ("X described me as an innovative leader who...")
- Specific high-value skills validated by the Recommender
- The emotional or strategic impact left on colleagues/clients

FORMAT:
- Mention who made the observation ("According to [Name], I am...", or "[Name] noted that my ability to...")
- Concise (1-2 sentences each)

Return JSON: {"thoughts": ["thought1", "thought2"]}`;

// ─── Custom Robust CSV Parser ──────────────────────────────────────────────

/**
 * Parses raw CSV text into an array of string arrays.
 * Handles quoted values containing newlines and double-quote escapes ("").
 */
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
        field += '"'; // Escaped quote
        i++;
      } else {
        inQuotes = !inQuotes; // Toggle quotes
      }
    } else if (char === "," && !inQuotes) {
      row.push(field.trim());
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++; // Handle CRLF
      // Only push row if we have gathered any data
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
  // Push remaining
  if (field || row.length > 0) {
    row.push(field.trim());
    result.push(row);
  }
  return result;
}

// Map an array-of-arrays into an array of objects using the first row as headers
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

// ─── CLI Parsing ────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    inputPath: null,
    dryRun: false,
    limit: 0,
    verbose: false,
    skipPositions: false,
    skipRecommendations: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--dry-run":
        config.dryRun = true;
        break;
      case "--limit":
        config.limit = parseInt(args[++i], 10);
        break;
      case "--verbose":
        config.verbose = true;
        break;
      case "--skip-positions":
        config.skipPositions = true;
        break;
      case "--skip-recommendations":
        config.skipRecommendations = true;
        break;
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
        break;
      default:
        if (!args[i].startsWith("--") && !config.inputPath) {
          config.inputPath = args[i];
        } else {
          console.error(`Unknown option: ${args[i]}`);
          process.exit(1);
        }
    }
  }

  if (!config.inputPath) {
    printUsage();
    process.exit(1);
  }

  return config;
}

function printUsage() {
  console.log(`
Open Brain — LinkedIn Data Import

Usage:
  node import-linkedin-data.mjs <export-folder> [options]

Arguments:
  export-folder          Path to your extracted LinkedIn Basic Data Archive folder

Options:
  --dry-run              Parse, distill — don't write to database
  --limit N              Max total source entries to process
  --skip-positions       Exclude Positions.csv
  --skip-recommendations Exclude Recommendations_Received.csv
  --verbose              Show full thought text
  --help                 Show usage info

Examples:
  node import-linkedin-data.mjs ./Basic_LinkedInDataExport --dry-run
  node import-linkedin-data.mjs ./Basic_LinkedInDataExport --limit 5
  `);
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

// ─── Network Transport ──────────────────────────────────────────────────────

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

// ─── LLM Functions ──────────────────────────────────────────────────────────

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
    const status = resp ? resp.status : "no response";
    console.log(`   Warning: Distillation failed (${status}), skipping record.`);
    return [];
  }

  try {
    const data = await resp.json();
    const result = JSON.parse(data.choices[0].message.content);
    const thoughts = result.thoughts || [];
    return thoughts.filter(t => typeof t === "string" && t.trim());
  } catch (e) {
    console.log(`   Warning: Failed to parse distilled response: ${e.message}`);
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

  if (!resp || !resp.ok) {
    return null;
  }

  try {
    const data = await resp.json();
    return data.data[0].embedding;
  } catch (e) {
    return null;
  }
}

async function ingestThought(content, metadata) {
  const embedding = await generateEmbedding(content);
  if (!embedding) {
    return { ok: false, error: "Failed to generate embedding" };
  }

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
  const config = parseArgs();

  if (!config.dryRun) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENROUTER_API_KEY) {
      console.error("Error: Missing required environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENROUTER_API_KEY).");
      process.exit(1);
    }
  } else if (!OPENROUTER_API_KEY) {
    console.error("Error: OPENROUTER_API_KEY required for LLM dry-run summaries.");
    process.exit(1);
  }

  console.log(`\n🚀 Starting LinkedIn Import Pipeline [${config.dryRun ? 'DRY RUN' : 'LIVE'}]`);

  const syncLog = loadSyncLog();
  const finalStats = { totalParsed: 0, distilled: 0, ingested: 0, errors: 0 };

  // List of jobs (files to parse)
  const jobs = [];
  if (!config.skipPositions) {
    jobs.push({
      file: "Positions.csv",
      type: "position",
      prompt: PROMPT_POSITIONS,
      summarizer: (item) => `Company: ${item['Company Name']}\nTitle: ${item['Title']}\nPeriod: ${item['Started On']} - ${item['Finished On']}\nDescription: ${item['Description']}`,
      metadataGenerator: (item) => ({
        source: "linkedin_positions",
        company: item['Company Name'],
        title: item['Title'],
        started: item['Started On']
      })
    });
  }
  if (!config.skipRecommendations) {
    jobs.push({
      file: "Recommendations_Received.csv",
      type: "recommendation",
      prompt: PROMPT_RECOMMENDATIONS,
      summarizer: (item) => `From: ${item['First Name']} ${item['Last Name']} (${item['Job Title']} at ${item['Company']})\nRecommendation text: ${item['Text']}`,
      metadataGenerator: (item) => ({
        source: "linkedin_recommendations",
        referrer: `${item['First Name']} ${item['Last Name']}`,
        referrer_company: item['Company']
      })
    });
  }

  for (const job of jobs) {
    const fullPath = join(config.inputPath, job.file);
    if (!existsSync(fullPath)) {
      console.log(`⚠️ Skipping ${job.file}: File not found at ${fullPath}`);
      continue;
    }

    console.log(`\n📄 Processing ${job.file}...`);
    const fileText = readFileSync(fullPath, "utf8");
    const rawRows = parseCSV(fileText);
    const objects = csvToObjects(rawRows);
    console.log(`   Found ${objects.length} records.`);

    for (let i = 0; i < objects.length; i++) {
      if (config.limit && finalStats.totalParsed >= config.limit) break;
      
      const record = objects[i];
      const recordString = JSON.stringify(record);
      const signature = hashText(recordString);
      const cacheKey = `${job.type}:${signature}`;

      if (!config.dryRun && syncLog.ingested_ids[cacheKey]) {
        continue; // Deduplicate already ingested record
      }

      const distillationInput = job.summarizer(record);
      if (!distillationInput || distillationInput.length < 20) continue; // skip empty

      console.log(`   [${job.type}] Processing record ${i + 1} of ${objects.length}...`);
      
      const thoughts = await distillRecord(job.prompt, distillationInput);
      finalStats.distilled += thoughts.length;
      finalStats.totalParsed++;

      if (thoughts.length === 0) {
        console.log(`     -> No useful thoughts extracted.`);
        if (!config.dryRun) {
          syncLog.ingested_ids[cacheKey] = true;
          saveSyncLog(syncLog);
        }
        continue;
      }

      for (let j = 0; j < thoughts.length; j++) {
        const thoughtText = thoughts[j];
        
        if (config.verbose || config.dryRun) {
          console.log(`     👉 Thought ${j+1}: ${thoughtText}`);
        }

        if (!config.dryRun) {
          const prefix = job.type === 'position' ? `[Career History]` : `[Validation]`;
          const finalContent = `${prefix} ${thoughtText}`;
          const metadata = job.metadataGenerator(record);
          
          const res = await ingestThought(finalContent, metadata);
          if (res.ok) {
            finalStats.ingested++;
            console.log(`     ✅ Ingested thought ${j+1}`);
          } else {
            finalStats.errors++;
            console.log(`     ❌ Error ingesting: ${res.error}`);
          }
        }
      }

      if (!config.dryRun) {
        syncLog.ingested_ids[cacheKey] = true;
        saveSyncLog(syncLog);
      }
      
      await sleep(300); // Gentle spacing between records
    }
  }

  console.log("\n" + "═".repeat(50));
  console.log("🏁  Summary:");
  console.log(`   Processed:   ${finalStats.totalParsed} source records`);
  console.log(`   Generated:   ${finalStats.distilled} total thoughts`);
  if (!config.dryRun) {
    console.log(`   Ingested:    ${finalStats.ingested} to Supabase`);
    console.log(`   Errors:      ${finalStats.errors}`);
  }
  console.log("═".repeat(50) + "\n");
}

main().catch(err => {
  console.error("\nFatal run error:", err);
  process.exit(1);
});
