#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

function usage() {
  console.log('Usage: node scripts/extract-pdf-text.mjs <input.pdf> [output.txt]')
}

function normalizeWhitespace(text) {
  return text
    .replace(/[\t\f\v\u00A0]+/g, ' ')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ +\n/g, '\n')
    .trim()
}

async function extractPdfText(pdfPath) {
  const bytes = await fs.readFile(pdfPath)
  const loadingTask = getDocument({
    data: bytes,
    useWorkerFetch: false,
    isEvalSupported: false,
    disableFontFace: true
  })

  const pdf = await loadingTask.promise
  const pages = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()

    // Reconstruct page text with simple line-break heuristics.
    let currentY = null
    let line = []
    const lines = []

    for (const item of content.items) {
      const text = item.str || ''
      const y = Array.isArray(item.transform) ? item.transform[5] : null

      if (currentY !== null && y !== null && Math.abs(y - currentY) > 2.5) {
        lines.push(line.join(' '))
        line = []
      }

      if (text) {
        line.push(text)
      }

      if (y !== null) {
        currentY = y
      }
    }

    if (line.length) {
      lines.push(line.join(' '))
    }

    pages.push(lines.join('\n'))
  }

  await loadingTask.destroy()
  return normalizeWhitespace(pages.join('\n\n--- PAGE BREAK ---\n\n'))
}

async function main() {
  const [, , inputArg, outputArg] = process.argv
  if (!inputArg || inputArg === '--help' || inputArg === '-h') {
    usage()
    process.exit(inputArg ? 0 : 1)
  }

  const inputPath = path.resolve(process.cwd(), inputArg)
  const outputPath = outputArg
    ? path.resolve(process.cwd(), outputArg)
    : inputPath.replace(/\.pdf$/i, '.txt')

  try {
    const text = await extractPdfText(inputPath)
    await fs.writeFile(outputPath, `${text}\n`, 'utf8')
    console.log(`Extracted text written to: ${outputPath}`)
  } catch (err) {
    console.error('Failed to extract PDF text:', err?.message || err)
    process.exit(1)
  }
}

main()
