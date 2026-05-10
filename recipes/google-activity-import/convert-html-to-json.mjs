import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, basename } from "path";

function stripHtml(html) {
  return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

function findHtmlFiles(dirPath) {
  const results = [];
  function walk(d) {
    try {
      const entries = readdirSync(d, { withFileTypes: true });
      for (const e of entries) {
        const full = join(d, e.name);
        if (e.isFile() && e.name === "MyActivity.html") {
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
  const jsonPath = join(htmlPath.replace("MyActivity.html", "MyActivity.json"));
  console.log(`Converting ${basename(htmlPath.replace("/MyActivity.html", ""))}...`);

  const html = readFileSync(htmlPath, "utf8");
  
  // Match the standard Google Activity entry block
  const regex = /class="content-cell mdl-cell mdl-cell--6-col mdl-typography--body-1">(.*?)<br>(.*?)<br>/gs;
  
  const records = [];
  let match;
  let count = 0;

  while ((match = regex.exec(html)) !== null) {
    const titleRaw = match[1];
    const timeRaw = match[2];

    const title = stripHtml(titleRaw);
    
    // Normalize the date string (sometimes Google inserts non-breaking spaces or weird spacing)
    const normalizedDateStr = stripHtml(timeRaw).replace(/\u202f/g, " ").replace(/,/g, ",");
    let isoTime = normalizedDateStr;

    try {
        const dateObj = new Date(normalizedDateStr);
        if (!isNaN(dateObj.getTime())) {
            isoTime = dateObj.toISOString();
        }
    } catch (e) {
        // Fallback to original string if parsing fails
    }

    records.push({
      title,
      time: isoTime
    });
    count++;
  }

  writeFileSync(jsonPath, JSON.stringify(records, null, 2));
  console.log(`  - Successfully saved ${count} records to ${basename(jsonPath)}`);
}

async function main() {
  const inputDir = process.argv[2];
  if (!inputDir) {
    console.error("Usage: node convert-html-to-json.mjs <extracted-path>");
    process.exit(1);
  }

  console.log(`Scanning directory: ${inputDir}`);
  const htmlFiles = findHtmlFiles(inputDir);
  console.log(`Found ${htmlFiles.length} HTML activity files.\n`);

  for (const file of htmlFiles) {
    await convertFile(file);
  }

  console.log("\nAll conversions complete!");
}

main().catch(console.error);
