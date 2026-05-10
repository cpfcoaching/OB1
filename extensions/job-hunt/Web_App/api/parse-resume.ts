/**
 * Vercel Serverless Function: Parse Resume PDF
 * 
 * Purpose:
 *   Extract text from PDF resumes using pdfjs-dist
 *   Designed to run within Vercel's serverless constraints
 *   No external APIs, no file system access, no workers
 * 
 * Constraints Handled:
 *   - Memory: ~512MB per execution
 *   - Timeout: ~10 seconds
 *   - No persistent storage
 *   - Stateless operation
 *   - Dual runtime handlers (Node.js + Fetch API)
 * 
 * Usage:
 *   POST /api/parse-resume
 *   Content-Type: application/json
 *   Body: { pdf: "base64-encoded-pdf-bytes" }
 * 
 * Response:
 *   {
 *     "success": true,
 *     "text": "extracted text content...",
 *     "pageCount": 1,
 *     "confidence": 0.9,
 *     "processingTimeMs": 234
 *   }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDocument } from 'pdfjs-dist'

// ============================================================================
// Configuration for Serverless Environment
// ============================================================================

const CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_PAGES: 100, // Reasonable limit for resume
  TIMEOUT_MS: 8000, // Leave 2s buffer before Vercel timeout
  // pdfjs-dist config for serverless
  PDFJS_CONFIG: {
    useWorkerFetch: false, // No worker threads in serverless
    isEvalSupported: false, // No eval() in Vercel
    disableFontFace: true, // No font loading
  },
}

// ============================================================================
// PDF Text Extraction
// ============================================================================

async function extractPdfText(pdfBuffer: Buffer): Promise<{
  text: string
  pageCount: number
  confidence: number
  processingTimeMs: number
}> {
  const startTime = Date.now()

  try {
    // Validate input
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error('Empty PDF buffer')
    }

    if (pdfBuffer.length > CONFIG.MAX_FILE_SIZE) {
      throw new Error(`PDF exceeds maximum size of ${CONFIG.MAX_FILE_SIZE} bytes`)
    }

    // Load PDF with serverless configuration
    const loadingTask = getDocument({
      data: new Uint8Array(pdfBuffer),
      ...CONFIG.PDFJS_CONFIG,
    })

    const pdf = await loadingTask.promise

    // Validate page count
    if (pdf.numPages > CONFIG.MAX_PAGES) {
      throw new Error(`PDF exceeds maximum pages (${CONFIG.MAX_PAGES})`)
    }

    // Extract text from each page
    const pages: string[] = []
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      // Build text from items
      const pageText = textContent.items
        .map((item: any) => {
          // Handle both string and object items
          return typeof item.str === 'string' ? item.str : ''
        })
        .join('')

      pages.push(pageText)
    }

    // Combine pages
    const fullText = pages.join('\n--- PAGE BREAK ---\n')

    // Calculate confidence (simple heuristic)
    const readableCharCount = fullText.match(/[a-zA-Z0-9\s]/g)?.length || 0
    const totalCharCount = fullText.length
    const confidence = totalCharCount > 0 ? readableCharCount / totalCharCount : 0

    const processingTimeMs = Date.now() - startTime

    return {
      text: fullText,
      pageCount: pdf.numPages,
      confidence: Math.round(confidence * 100) / 100,
      processingTimeMs,
    }
  } catch (error) {
    const processingTimeMs = Date.now() - startTime
    throw {
      message: error instanceof Error ? error.message : String(error),
      processingTimeMs,
    }
  }
}

// ============================================================================
// Node.js Runtime Handler (for Vercel API Routes)
// ============================================================================

async function nodeHandler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    // Extract PDF from request
    const { pdf: pdfBase64 } = req.body

    if (!pdfBase64) {
      res.status(400).json({
        success: false,
        error: 'Missing "pdf" parameter (base64-encoded PDF)',
      })
      return
    }

    if (typeof pdfBase64 !== 'string') {
      res.status(400).json({
        success: false,
        error: '"pdf" must be a base64-encoded string',
      })
      return
    }

    // Decode base64 to buffer
    let pdfBuffer: Buffer
    try {
      pdfBuffer = Buffer.from(pdfBase64, 'base64')
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Invalid base64 encoding',
      })
      return
    }

    // Extract text
    const result = await extractPdfText(pdfBuffer)

    // Success response
    res.status(200).json({
      success: true,
      ...result,
    })
  } catch (error: any) {
    console.error('[parse-resume] Error:', error)

    res.status(400).json({
      success: false,
      error: error.message || 'Failed to parse PDF',
      processingTimeMs: error.processingTimeMs,
    })
  }
}

// ============================================================================
// Fetch API Runtime Handler (for Edge Functions)
// ============================================================================

async function fetchHandler(request: Request): Promise<Response> {
  // Only accept POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body = await request.json()
    const { pdf: pdfBase64 } = body

    if (!pdfBase64) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing "pdf" parameter (base64-encoded PDF)',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (typeof pdfBase64 !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: '"pdf" must be a base64-encoded string',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Decode base64 to buffer
    let pdfBuffer: Buffer
    try {
      const binaryString = atob(pdfBase64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      pdfBuffer = Buffer.from(bytes)
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid base64 encoding',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Extract text
    const result = await extractPdfText(pdfBuffer)

    return new Response(
      JSON.stringify({
        success: true,
        ...result,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('[parse-resume] Error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to parse PDF',
        processingTimeMs: error.processingTimeMs,
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// ============================================================================
// Exports for Vercel
// ============================================================================

// Default export for Node.js runtime
export default nodeHandler

// Named export for Fetch API compatibility
export const handler = fetchHandler

// Attach fetch method for dual runtime support
Object.defineProperty(handler, 'fetch', {
  value: fetchHandler,
  writable: false,
})
