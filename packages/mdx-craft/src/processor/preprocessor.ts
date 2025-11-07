/**
 * MDX Source Preprocessor
 *
 * Preprocesses raw MDX source to escape special characters that could cause
 * compilation errors. This runs BEFORE MDX parsing.
 *
 * The preprocessor escapes < > { } in plain text while preserving:
 * - Code blocks (fenced ``` and inline `)
 * - Valid JSX/HTML elements
 * - Markdown syntax
 */

/**
 * Preprocess MDX source to escape problematic characters
 *
 * @param source - Raw MDX source string
 * @returns Preprocessed source with escaped characters
 */
export function preprocessMDXSource(source: string): string {
  const lines = source.split('\n')
  const result: string[] = []
  let inCodeFence = false
  let codeFenceMarker = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!

    // Check for code fence (``` or ~~~)
    const codeFenceMatch = line.match(/^(\s*)(```+|~~~+)/)
    if (codeFenceMatch) {
      const marker = codeFenceMatch[2]!
      if (!inCodeFence) {
        // Entering code fence
        inCodeFence = true
        codeFenceMarker = marker
        result.push(line)
        continue
      } else if (marker.startsWith(codeFenceMarker)) {
        // Exiting code fence
        inCodeFence = false
        codeFenceMarker = ''
        result.push(line)
        continue
      }
    }

    // If in code fence, don't escape
    if (inCodeFence) {
      result.push(line)
      continue
    }

    // Process line for inline code and escape special chars
    const processedLine = processLineWithInlineCode(line)
    result.push(processedLine)
  }

  return result.join('\n')
}

/**
 * Process a single line, preserving inline code while escaping special chars elsewhere
 */
function processLineWithInlineCode(line: string): string {
  const parts: string[] = []
  let currentPos = 0
  let inBackticks = false
  let backTickStart = -1

  for (let i = 0; i < line.length; i++) {
    const char = line[i]!

    if (char === '`') {
      if (!inBackticks) {
        // Start of inline code
        // Escape the text before this backtick
        const textBefore = line.substring(currentPos, i)
        parts.push(escapeTextContent(textBefore))

        // Mark start of inline code
        inBackticks = true
        backTickStart = i
      } else {
        // End of inline code
        // Add the inline code as-is (including backticks)
        const inlineCode = line.substring(backTickStart, i + 1)
        parts.push(inlineCode)

        // Update position
        currentPos = i + 1
        inBackticks = false
        backTickStart = -1
      }
    }
  }

  // Handle remaining text
  if (currentPos < line.length) {
    const remaining = line.substring(currentPos)
    if (inBackticks) {
      // Unclosed backtick, treat as regular text
      parts.push(escapeTextContent(remaining))
    } else {
      parts.push(escapeTextContent(remaining))
    }
  }

  return parts.join('')
}

/**
 * Escape special characters in text content
 * This preserves valid JSX/HTML tags while escaping problematic chars
 */
function escapeTextContent(text: string): string {
  if (!text) return text

  // Don't escape if the text looks like it's inside a JSX tag
  // This is a simple heuristic - could be improved
  if (isLikelyJSXContext(text)) {
    return text
  }

  let result = text

  // Escape angle brackets that are NOT part of valid JSX/HTML tags
  result = escapeAngleBrackets(result)

  // Escape curly braces that are NOT part of valid JSX expressions
  result = escapeCurlyBraces(result)

  return result
}

/**
 * Check if text is likely inside a JSX context
 */
function isLikelyJSXContext(text: string): boolean {
  // If text starts with < followed by capital letter or lowercase tag name, it's likely JSX
  // Examples: <Component, <div, <button
  const jsxTagPattern = /^<[A-Z][a-zA-Z0-9]*|^<[a-z]+/
  if (jsxTagPattern.test(text.trim())) {
    return true
  }

  // If text ends with /> or >, might be closing a tag
  if (/[/>]$/.test(text.trim())) {
    return true
  }

  return false
}

/**
 * Escape angle brackets in text while preserving valid JSX/HTML
 */
function escapeAngleBrackets(text: string): string {
  let result = text

  // Escape < that are NOT followed by a valid tag name or closing /
  // Valid tag names start with letter and can contain letters, numbers, hyphens
  result = result.replace(/<(?![A-Za-z/])/g, '&lt;')

  // Escape > that are NOT preceded by tag name, /, or "
  // This is a simple heuristic
  result = result.replace(/(?<![A-Za-z0-9\-"'/])>/g, '&gt;')

  return result
}

/**
 * Escape curly braces that are NOT part of valid JSX expressions
 */
function escapeCurlyBraces(text: string): string {
  let result = text

  // For now, escape all curly braces in text
  // A more sophisticated approach would check for valid JSX expression context
  // But this is safer to avoid over-escaping
  result = result.replace(/\{/g, '&#123;')
  result = result.replace(/\}/g, '&#125;')

  return result
}
