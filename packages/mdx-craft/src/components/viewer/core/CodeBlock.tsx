/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useMemo } from 'react'
import type { FC, ReactNode } from 'react'

// Type is now defined locally since shiki is optional
type BundledTheme = string
import { cn, getCodeBlockStyles } from '../../../utils/index.js'
import { CopyButton } from '../../common/CopyButton.js'
import { CopyIcon } from '../../icons/CopyIcon.js'
import { WindowControlDecoration } from '../../common/WindowControlDecoration.js'
import { LanguageBadge } from '../../common/LanguageBadge.js'
import { useCodeHighlighting } from '../../../hooks/index.js'

/**
 * Props for the CodeBlock component
 */
export type CodeBlockProps = {
  /** The code content to display - can be a string or React children */
  children: string | ReactNode

  /** Programming language for syntax highlighting (e.g., 'javascript', 'python', 'bash') */
  language?: string

  /** Optional filename to display in the header */
  filename?: string

  /** Whether to show line numbers on the left side (default: true) */
  showLineNumbers?: boolean

  /** Lines to highlight (e.g., "1-3,5,7-9") */
  highlightLines?: string

  /** Starting line number for display (default: 1) */
  startingLineNumber?: number

  /** Enable word wrapping for long lines (default: false) */
  wordWrap?: boolean

  /** Additional CSS classes to apply to the container */
  className?: string

  /** Show copy button for code (default: true) */
  showCopy?: boolean

  /** Shiki theme to use for highlighting */
  theme?: BundledTheme

  /** Whether this code block is rendered inside a tab component */
  isTab?: boolean

  /** Optional title to display instead of filename */
  title?: string

  /** Show window decoration buttons (default: true) */
  showDecorations?: boolean

  /** Render as terminal/console output (default: false) */
  terminal?: boolean

  /** Maximum height of the code block (default: 500px) */
  maxHeight?: string | number
}

/**
 * Loading skeleton displayed while code is being highlighted
 */
const CodeSkeleton: FC<{ lines?: number }> = ({ lines = 6 }) => (
  <div className="p-6 space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="w-6 h-3.5 bg-muted rounded animate-pulse opacity-30" />
        <div
          className={cn(
            'h-3.5 bg-muted rounded animate-pulse',
            i % 3 === 0 ? 'w-3/4' : i % 2 === 0 ? 'w-5/6' : 'w-2/3'
          )}
        />
      </div>
    ))}
  </div>
)

/**
 * Utility function to extract text content from React children
 * Enhanced to handle MDX-generated content and various child types
 */
const extractTextContent = (children: ReactNode): string => {
  if (typeof children === 'string') {
    return children
  }

  if (Array.isArray(children)) {
    return children.map(extractTextContent).join('')
  }

  if (React.isValidElement(children)) {
    // If it's a code element, extract its children
    if (children.type === 'code') {
      return extractTextContent((children.props as any).children)
    }
    // For other elements, extract their children
    return extractTextContent((children.props as any).children)
  }

  // Handle numbers, booleans, null, undefined
  if (children == null) {
    return ''
  }

  return String(children)
}

/**
 * Header component for code blocks
 * Displays filename/title, language badge, and copy button
 */
const CodeBlockHeader: FC<{
  filename?: string
  title?: string
  language?: string
  showDecorations: boolean
  isTerminal: boolean
  showCopy: boolean
  codeContent: string
  isLoading: boolean
}> = ({
  filename,
  title,
  language,
  showDecorations,
  isTerminal,
  showCopy,
  codeContent,
  isLoading,
}) => (
  <div
    className={cn(
      'flex items-center justify-between px-4 py-3 border-b',
      'transition-all duration-200',
      isTerminal ? 'bg-black/90 border-border' : 'bg-card border-border'
    )}
  >
    <div className="flex items-center gap-3">
      {showDecorations && !isTerminal && <WindowControlDecoration />}

      {isTerminal && <span className="text-green-400 font-bold select-none">❯</span>}

      {(filename || title) && (
        <span
          className={cn(
            'font-medium',
            isTerminal ? 'text-green-400 text-sm' : 'text-card-foreground text-sm font-mono'
          )}
        >
          {title || filename}
        </span>
      )}

      {language !== 'text' && !isTerminal && (
        <LanguageBadge
          language={language as BundledTheme}
          variant={isTerminal ? 'terminal' : 'default'}
        />
      )}
    </div>

    {showCopy && !isLoading && (
      <CopyButton
        value={codeContent}
        standbyIcon={CopyIcon}
        className="p-1.5 rounded-md transition-all duration-200"
      />
    )}
  </div>
)

/**
 * CodeBlock Component
 *
 * A professional code block component with syntax highlighting, line numbers,
 * copy functionality, and terminal mode support.
 *
 * Features:
 * - Syntax highlighting using Shiki
 * - Line numbers with custom starting point
 * - Copy to clipboard functionality
 * - Terminal/console mode for command output
 * - Custom themes and styling
 * - Loading states with skeleton
 * - Error handling
 * - Window decorations for desktop feel
 * - Responsive design with scrollable content
 *
 * @example
 * // Basic usage
 * <CodeBlock language="javascript">
 *   {`console.log('Hello, World!');`}
 * </CodeBlock>
 *
 * // With filename and line numbers
 * <CodeBlock
 *   language="typescript"
 *   filename="app.ts"
 *   showLineNumbers
 * >
 *   {code}
 * </CodeBlock>
 *
 * // Terminal mode
 * <CodeBlock terminal>
 *   $ npm install mdx-craft
 *   $ npm run dev
 * </CodeBlock>
 *
 * // With custom title and no decorations
 * <CodeBlock
 *   language="python"
 *   title="Python Example"
 *   showDecorations={false}
 *   maxHeight={400}
 * >
 *   {pythonCode}
 * </CodeBlock>
 */
export const CodeBlock: FC<CodeBlockProps> = React.memo(
  ({
    children,
    language = 'text',
    filename,
    showLineNumbers = true,
    highlightLines: _highlightLines,
    startingLineNumber = 1,
    wordWrap = false,
    className,
    showCopy = true,
    theme,
    isTab = false,
    title,
    showDecorations = true,
    terminal = false,
    maxHeight = 500,
  }) => {
    // Extract and memoize the code content from children
    const codeContent = useMemo(() => extractTextContent(children).trim(), [children])

    // Determine if this should be rendered as a terminal
    const isTerminal = terminal || language === 'bash' || language === 'shell'

    // Perform syntax highlighting using shared hook
    const { highlightedCode, isLoading, error } = useCodeHighlighting({
      codeContent,
      language,
      showLineNumbers,
      isTerminal,
      startingLineNumber,
      wordWrap,
      theme,
      autoDetectTheme: true,
    })

    // Build container styles based on props
    const containerStyles = cn(
      'relative w-full overflow-hidden transition-all duration-300',
      !isTab && 'rounded-xl border shadow-sm hover:shadow-md',
      !isTab && (isTerminal ? 'bg-black/90 border-border' : 'bg-card border-border'),
      className
    )

    // Convert maxHeight to CSS value
    const maxHeightStyle = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight

    // Render loading state
    if (isLoading) {
      return (
        <div className={containerStyles}>
          {!isTab && (filename || title || language !== 'text' || showDecorations) && (
            <CodeBlockHeader
              filename={filename}
              title={title}
              language={language}
              showDecorations={showDecorations}
              isTerminal={isTerminal}
              showCopy={false}
              codeContent=""
              isLoading={true}
            />
          )}
          <div className={cn('p-6', isTerminal ? 'bg-black/90' : 'bg-card')}>
            <CodeSkeleton lines={8} />
          </div>
        </div>
      )
    }

    return (
      <div className={containerStyles}>
        {!isTab && (filename || title || language !== 'text' || showDecorations) && (
          <CodeBlockHeader
            filename={filename}
            title={title}
            language={language}
            showDecorations={showDecorations}
            isTerminal={isTerminal}
            showCopy={showCopy}
            codeContent={codeContent}
            isLoading={isLoading}
          />
        )}

        <div className="relative overflow-hidden">
          {error ? (
            <div className="p-6 text-danger text-sm font-medium">⚠️ {error}</div>
          ) : (
            <>
              <div
                className={cn(
                  'overflow-x-auto overflow-y-auto',
                  '[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2',
                  '[&::-webkit-scrollbar-track]:bg-transparent',
                  '[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full',
                  '[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/50',
                  'text-sm font-mono'
                )}
                style={{ maxHeight: maxHeightStyle }}
              >
                <div
                  className="shiki-code-block"
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
              </div>

              <style dangerouslySetInnerHTML={{ __html: getCodeBlockStyles(isTerminal) }} />
            </>
          )}

          {isTab && showCopy && !isLoading && (
            <div className="absolute top-4 right-4 z-10">
              <CopyButton value={codeContent} standbyIcon={CopyIcon} />
            </div>
          )}
        </div>
      </div>
    )
  }
)

// Display name for React DevTools
CodeBlock.displayName = 'CodeBlock'
