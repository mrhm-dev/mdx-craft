import { useState, useEffect, useMemo } from 'react'
import { getShikiHighlighter, type HighlightOptions } from '../plugins/shiki-highlighter.js'
import { useMDXViewer } from './useMDXViewer.js'

// Type is now defined locally since shiki is optional
type BundledTheme = string

/**
 * Configuration options for the useCodeHighlighting hook
 */
export interface UseCodeHighlightingOptions {
  /** The code content to highlight */
  codeContent: string

  /** Programming language for syntax highlighting */
  language: string

  /** Whether to show line numbers */
  showLineNumbers?: boolean

  /** Whether this is terminal/console output */
  isTerminal?: boolean

  /** Starting line number for display */
  startingLineNumber?: number

  /** Enable word wrapping for long lines */
  wordWrap?: boolean

  /** Custom theme override */
  theme?: BundledTheme

  /** Whether to automatically detect and respond to theme changes */
  autoDetectTheme?: boolean
}

/**
 * Return type for the useCodeHighlighting hook
 */
export interface UseCodeHighlightingReturn {
  /** The highlighted HTML code */
  highlightedCode: string

  /** Whether highlighting is in progress */
  isLoading: boolean

  /** Error message if highlighting failed */
  error: string | null

  /** Manual rehighlight function */
  rehighlight: () => Promise<void>
}

/**
 * useCodeHighlighting Hook
 *
 * A reusable hook for syntax highlighting code content using Shiki.
 * Provides loading states, error handling, and automatic theme change detection.
 *
 * Features:
 * - Syntax highlighting with Shiki
 * - Automatic theme detection (light/dark mode)
 * - Loading and error states
 * - Theme change listener with automatic re-highlighting
 * - Configurable options for different use cases
 * - Error fallback with escaped HTML
 *
 * @param options - Configuration options for highlighting
 * @returns Object containing highlighted code, loading state, error, and utilities
 *
 * @example
 * ```tsx
 * const { highlightedCode, isLoading, error } = useCodeHighlighting({
 *   codeContent: 'console.log("Hello, World!");',
 *   language: 'javascript',
 *   showLineNumbers: true
 * })
 *
 * if (isLoading) return <div>Loading...</div>
 * if (error) return <div>Error: {error}</div>
 *
 * return (
 *   <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
 * )
 * ```
 */
export const useCodeHighlighting = ({
  codeContent,
  language,
  showLineNumbers = true,
  isTerminal = false,
  startingLineNumber = 1,
  wordWrap = false,
  theme,
  autoDetectTheme = true,
}: UseCodeHighlightingOptions): UseCodeHighlightingReturn => {
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get shikiConfig from context
  const { shikiConfig } = useMDXViewer()

  // Memoized highlight function to prevent unnecessary re-renders
  const performHighlight = useMemo(
    () => async () => {
      // Handle empty content
      if (!codeContent.trim()) {
        setHighlightedCode('')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Auto-detect theme if enabled
        const isDark = autoDetectTheme ? document.documentElement.classList.contains('dark') : false

        // Build highlighting options
        const options: HighlightOptions = {
          language: language || 'text',
          showLineNumbers: showLineNumbers && !isTerminal,
          wordWrap,
          startingLineNumber,
          theme: theme || ((isDark ? 'github-dark' : 'github-light') as BundledTheme),
        }

        // Get highlighter with context config
        const highlighter = getShikiHighlighter(shikiConfig)
        const result = await highlighter.highlight(codeContent, options)
        setHighlightedCode(result.html)
      } catch (err) {
        console.error('Failed to highlight code:', err)
        setError('Failed to highlight code')

        // Fallback: escape HTML and wrap in basic pre/code tags
        const escapedCode = codeContent
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        setHighlightedCode(`<pre><code>${escapedCode}</code></pre>`)
      } finally {
        setIsLoading(false)
      }
    },
    [
      codeContent,
      language,
      showLineNumbers,
      isTerminal,
      startingLineNumber,
      wordWrap,
      theme,
      autoDetectTheme,
    ]
  )

  // Perform initial highlighting
  useEffect(() => {
    performHighlight()
  }, [performHighlight])

  // Theme change listener (only if auto-detect is enabled)
  useEffect(() => {
    if (!autoDetectTheme) return

    const handleThemeChange = () => {
      if (codeContent.trim() && !isLoading) {
        performHighlight()
      }
    }

    // Watch for theme changes in document element class
    const observer = new MutationObserver(handleThemeChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [codeContent, isLoading, performHighlight, autoDetectTheme])

  return {
    highlightedCode,
    isLoading,
    error,
    rehighlight: performHighlight,
  }
}
