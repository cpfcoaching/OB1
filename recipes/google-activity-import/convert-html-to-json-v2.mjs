import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from "fs";
import { join, basename, dirname } from "path";

function stripHtml(html) {
  return html.replace(/<[^>]*>?/gm, "")
             .replace(/&nbsp;/g, " ")
             .replace(/&amp;/g, "&")
             .replace(/&#39;/g, "'")
             .replace(/\s+/g, " ")
             .trim();
}

function findHtmlFiles(dirPath) {
  const results = [];
  function walk(d) {
    try {
      const entries = readdirSync(d, { withFileTypes: true });
      for (const e of entries) {
        const full = join(d, e.name);
        if (e.isFile() && e.name.endsWith(".html")) {
          results.push(full);
        } else if (e.isDirectory()) {
          walk(full);
        }
      }
    } catch (err) {}
  }
  walk(dirPath);
  return results;
}

async function convertFile(htmlPath) {
  // Name output json after html, preserving uniqueness
  const base = basename(htmlPath, ".html");
  const jsonPath = join(dirname(htmlPath), `${base}.json`);
  
  console.log(`Converting ${basename(dirname(htmlPath))}/${base}.html...`);

  const html = readFileSync(htmlPath, "utf8");
  
  // Robust Match: Capture everything inside the content-cell div
  const regex = /<div class="content-cell mdl-cell mdl-cell--6-col mdl-typography--body-1">(.*?)<\/div>/gs;
  
  const records = [];
  let match;
  let count = 0;

  while ((match = regex.exec(html)) !== null) {
    const content = match[1];
    
    // Split content by <br> or <br />
    const segments = content.split(/<br\s*\/?>/i)
                            .map(s => s.trim())
                            .filter(s => s.length > 0);

    if (segments.length < 2) continue; // Malformed entry

    // The LAST component is practically ALWAYS the timestamp in Google's format
    const timeRaw = segments[segments.length - 1];
    
    // Combine ALL earlier components to form the full Title/Context
    const titleRaw = segments.slice(0, segments.length - 1).join(" — ");

    const title = stripHtml(titleRaw);
    const normalizedDateStr = stripHtml(timeRaw).replace(/\u202f/g, " ").trim();
    
    let isoTime = normalizedDateStr;
    try {
        const dateObj = new Date(normalizedDateStr);
        if (!isNaN(dateObj.getTime())) {
            isoTime = dateObj.toISOString();
        }
    } catch (e) {}

    records.push({
      title,
      time: isoTime
    });
    count++;
  }

  writeFileSync(jsonPath, JSON.stringify(records, null, 2));
  console.log(`  - Saved ${count} events to ${basename(jsonPath)}`);
  return count;
}

async function main() {
  const inputDir = process.argv[2];
  if (!inputDir) {
    console.error("Usage: node convert-html-to-json-v2.mjs <extracted-path>");
    process.exit(1);
  }

  console.log(`Scanning Batch 2 Directory: ${inputDir}`);
  const htmlFiles = findHtmlFiles(inputDir);
  console.log(`Found ${htmlFiles.length} HTML source files.\n`);

  let total = 0;
  for (const file of htmlFiles) {
    total += await convertFile(file);
  }

  console.log(`\nMaster conversion sequence complete! Total Events Processed: ${total}`);
}

main().catch(console.error);
