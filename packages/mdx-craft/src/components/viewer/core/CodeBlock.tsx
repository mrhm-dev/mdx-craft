'use client'

import React, { useState, useEffect, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import { useMDXViewer } from '../../../hooks/useMDXViewer.js'
import { useShiki, type HighlightOptions } from '../../../plugins/shiki-highlighter.js'
import { cn } from '../../../theme/utils.js'
import { BundledTheme } from 'shiki'

/**
 * CodeBlock component props
 */
export type CodeBlockProps = {
  /**
   * Code content
   */
  children: string | ReactNode

  /**
   * Programming language for syntax highlighting
   */
  language?: string

  /**
   * File name to display
   */
  filename?: string

  /**
   * Show line numbers
   */
  showLineNumbers?: boolean

  /**
   * Highlighted line numbers (e.g., "1,3-5,8")
   */
  highlightLines?: string

  /**
   * Starting line number
   */
  startingLineNumber?: number

  /**
   * Whether to enable word wrap
   */
  wordWrap?: boolean

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Whether to show copy button
   */
  showCopy?: boolean

  /**
   * Syntax highlighting theme override
   */
  theme?: string
}

/**
 * Copy button component
 */
const CopyButton: FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'absolute top-3 right-3 z-10',
        'px-3 py-1.5 text-xs font-medium rounded-md',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800',
        copied
          ? 'bg-emerald-600 text-white'
          : 'bg-slate-800/50 dark:bg-slate-700/50 text-slate-300 hover:bg-slate-700/50 dark:hover:bg-slate-600/50 hover:text-white'
      )}
      aria-label={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy
        </span>
      )}
    </button>
  )
}

/**
 * Loading skeleton for code content
 */
const CodeSkeleton: FC = () => (
  <div className="p-4 space-y-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'h-4 bg-slate-300 dark:bg-slate-600 rounded animate-pulse',
          i % 3 === 0 ? 'w-3/4' : i % 2 === 0 ? 'w-5/6' : 'w-4/5'
        )}
      />
    ))}
  </div>
)

/**
 * Enhanced CodeBlock component with Shiki syntax highlighting and Tailwind CSS
 *
 * Features:
 * - Advanced syntax highlighting with Shiki
 * - 20+ programming languages support
 * - Line numbers and highlighting
 * - Copy to clipboard functionality
 * - Responsive design
 * - Dark mode support
 * - Loading states
 * - Accessibility features
 *
 * @example
 * ```mdx
 * <CodeBlock language="typescript" filename="example.ts" showLineNumbers highlightLines="3,8-12">
 * {`interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * const createUser = (userData: Omit<User, 'id'>): User => {
 *   return {
 *     id: crypto.randomUUID(),
 *     ...userData,
 *   };
 * };`}
 * </CodeBlock>
 * ```
 */
export const CodeBlock: FC<CodeBlockProps> = React.memo(
  ({
    children,
    language = 'text',
    filename,
    showLineNumbers = false,
    highlightLines,
    startingLineNumber = 1,
    wordWrap = false,
    className,
    showCopy = true,
    theme,
  }) => {
    const { getComponentClasses } = useMDXViewer()
    const { highlight } = useShiki()

    const [highlightedCode, setHighlightedCode] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Memoize code content to prevent unnecessary recalculations
    const codeContent = useMemo(() => {
      return typeof children === 'string' ? children.trim() : children?.toString()?.trim() || ''
    }, [children])

    // Get base code block classes from theme
    const codeBlockClasses = getComponentClasses('codeBlock')

    // Memoize highlight options to prevent unnecessary re-highlighting
    const highlightOptions = useMemo(
      (): HighlightOptions => ({
        language,
        theme: theme as BundledTheme | undefined,
        showLineNumbers,
        highlightLines,
        startingLineNumber,
        wordWrap,
      }),
      [language, theme, showLineNumbers, highlightLines, startingLineNumber, wordWrap]
    )

    // Highlight code with Shiki
    useEffect(() => {
      if (!codeContent) {
        setIsLoading(false)
        return
      }

      const highlightCode = async () => {
        setIsLoading(true)
        setError(null)

        try {
          const result = await highlight(codeContent, highlightOptions)
          setHighlightedCode(result.html)
        } catch {
          setError('Failed to highlight code')

          // Fallback to plain text
          const escapedCode = codeContent
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
          setHighlightedCode(`<pre><code>${escapedCode}</code></pre>`)
        } finally {
          setIsLoading(false)
        }
      }

      highlightCode()
    }, [codeContent, highlightOptions, highlight])

    return (
      <div className={cn(codeBlockClasses, 'relative', className)}>
        {/* Header with filename and language */}
        {(filename || language !== 'text') && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              {filename && (
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-mono">
                  {filename}
                </span>
              )}
              {language !== 'text' && (
                <span className="px-2 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded">
                  {language}
                </span>
              )}
            </div>

            {/* Copy button in header for better visibility */}
            {showCopy && !isLoading && <CopyButton code={codeContent} />}
          </div>
        )}

        {/* Code content */}
        <div className="relative">
          {isLoading ? (
            <CodeSkeleton />
          ) : error ? (
            <div className="p-4 text-red-600 dark:text-red-400 text-sm">{error}</div>
          ) : (
            <div
              className={cn(
                'overflow-x-auto',
                '[&_pre]:m-0 [&_pre]:p-4 [&_pre]:bg-transparent',
                '[&_code]:font-mono [&_code]:text-sm',
                '[&_.line]:block',
                showLineNumbers &&
                  '[&_.line]:pl-12 [&_.line]:relative [&_.line]:before:absolute [&_.line]:before:left-0 [&_.line]:before:w-8 [&_.line]:before:text-right [&_.line]:before:text-slate-400 [&_.line]:before:text-xs [&_.line]:before:content-[attr(data-line)] [&_.line]:before:pr-4 [&_.line]:before:select-none',
                '[&_.highlighted-line]:bg-yellow-200/20 dark:[&_.highlighted-line]:bg-yellow-500/10',
                '[&_.highlighted-line]:border-l-2 [&_.highlighted-line]:border-yellow-500 [&_.highlighted-line]:pl-3 [&_.highlighted-line]:ml-1'
              )}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          )}

          {/* Copy button for blocks without header */}
          {showCopy && !filename && language === 'text' && !isLoading && (
            <CopyButton code={codeContent} />
          )}
        </div>
      </div>
    )
  }
)

CodeBlock.displayName = 'CodeBlock'
