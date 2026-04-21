import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") || "";
const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function parseArgs() {
  const args = new Map<string, string>();
  for (const arg of Deno.args) {
    if (!arg.startsWith("--")) continue;
    const [k, v] = arg.slice(2).split("=", 2);
    args.set(k, v ?? "true");
  }
  return args;
}

async function getEmbedding(text: string): Promise<number[] | null> {
  if (!OPENROUTER_API_KEY) return null;

  const r = await fetch(`${OPENROUTER_BASE}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/text-embedding-3-small",
      input: text,
    }),
  });

  if (!r.ok) {
    const msg = await r.text().catch(() => "");
    console.warn(`Embedding request failed: ${r.status} ${msg}`);
    return null;
  }

  const d = await r.json();
  return d.data?.[0]?.embedding ?? null;
}

function normalize(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

async function main() {
  const args = parseArgs();
  const dryRun = args.get("dry-run") === "true" || Deno.env.get("CONSOLIDATE_DRY_RUN") === "true";
  const limit = Number(args.get("limit") ?? Deno.env.get("CONSOLIDATE_LIMIT") ?? "20");

  const { data: archives, error } = await supabase
    .from("session_archives")
    .select("id, session_key, summary, wins, next_actions, metadata")
    .is("consolidated_at", null)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch session archives: ${error.message}`);
  }

  if (!archives || archives.length === 0) {
    console.log("No un-consolidated session archives found.");
    return;
  }

  console.log(`Found ${archives.length} archive(s) to consolidate${dryRun ? " (dry run)" : ""}.`);

  for (const archive of archives) {
    const wins = normalize(archive.wins);
    const nextActions = normalize(archive.next_actions);

    // Skip low-signal sessions by default.
    if (!wins.length && !nextActions.length) {
      console.log(`Skipping ${archive.session_key}: no wins/next actions`);
      continue;
    }

    const title = `Session Playbook: ${archive.session_key}`;
    const stepCandidates = nextActions.length ? nextActions : wins;
    const summary = archive.summary;
    const tags = ["session-archive", "auto-consolidated"];

    console.log(`Consolidating ${archive.session_key} -> ${title}`);

    if (dryRun) continue;

    const { data: skillId, error: upsertSkillError } = await supabase.rpc("upsert_brain_skill", {
      p_title: title,
      p_summary: summary,
      p_sop_steps: stepCandidates,
      p_tags: tags,
      p_metadata: {
        source: "consolidate-script",
        archive_id: archive.id,
      },
      p_source_session_key: archive.session_key,
    });

    if (upsertSkillError || !skillId) {
      console.warn(`Failed skill upsert for ${archive.session_key}: ${upsertSkillError?.message || "unknown error"}`);
      continue;
    }

    const embeddingInput = [title, summary, ...stepCandidates].join("\n");
    const embedding = await getEmbedding(embeddingInput);
    if (embedding) {
      const { error: embError } = await supabase
        .from("brain_skills")
        .update({ embedding })
        .eq("id", skillId);

      if (embError) {
        console.warn(`Embedding update failed for skill ${skillId}: ${embError.message}`);
      }
    }

    const { error: archiveUpdateError } = await supabase
      .from("session_archives")
      .update({
        consolidated_at: new Date().toISOString(),
        consolidated_skill_id: skillId,
      })
      .eq("id", archive.id);

    if (archiveUpdateError) {
      console.warn(`Failed to mark archive consolidated (${archive.session_key}): ${archiveUpdateError.message}`);
    }
  }

  console.log("Consolidation run complete.");
}

main().catch((err) => {
  console.error(err.message);
  Deno.exit(1);
});