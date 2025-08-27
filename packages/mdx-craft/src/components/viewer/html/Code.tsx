'use client'

import { FC, ReactNode, HTMLAttributes, useRef } from 'react'
import { cn, getCodeBlockStyles } from '../../../utils/index.js'
import React from 'react'
import { CopyIcon } from '../../icons/CopyIcon.js'
import { CopyButton } from '../../common/CopyButton.js'
import { WindowControlDecoration } from '../../common/WindowControlDecoration.js'
import { LanguageBadge } from '../../common/LanguageBadge.js'
import { useCodeHighlighting } from '../../../hooks/index.js'

/**
 * Props for the Code component
 */
type CodeProps = HTMLAttributes<HTMLElement> & {
  /** The code content to display */
  children?: ReactNode

  /** Additional CSS classes for styling */
  className?: string
}

/**
 * Helper function to extract text content from React children
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
      return extractTextContent(children.props.children)
    }
    // For other elements, extract their children
    return extractTextContent(children.props.children)
  }

  return String(children || '')
}

/**
 * Code Component
 *
 * A code block component specifically designed for MDX/Markdown content.
 * Automatically detects language from className and provides syntax highlighting.
 *
 * Features:
 * - Automatic language detection from className
 * - Syntax highlighting using Shiki
 * - Copy to clipboard functionality
 * - Window decorations for desktop feel
 * - Loading state with skeleton
 * - Theme-aware highlighting
 * - Responsive design with scrollable content
 *
 * @example
 * ```tsx
 * // Used automatically by MDX for code blocks
 * <Code className="language-javascript">
 *   console.log('Hello, World!');
 * </Code>
 *
 * // With nested code element (common in markdown)
 * <Code>
 *   <code className="language-typescript">
 *     const greeting: string = 'Hello';
 *   </code>
 * </Code>
 * ```
 */
export const Code: FC<CodeProps> = ({ children, className, ...props }) => {
  const codeRef = useRef<string>('')

  // Extract language from className (supports both language-* and lang-* formats)
  let detectedLanguage =
    className?.match(/language-(\w+)/)?.[1] || className?.match(/lang-(\w+)/)?.[1]

  // Fallback: check nested code elements for language class
  if (!detectedLanguage && React.isValidElement(children)) {
    const codeElement = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === 'code'
    )
    if (React.isValidElement(codeElement)) {
      const codeClassName = codeElement.props.className as string | undefined
      detectedLanguage =
        codeClassName?.match(/language-(\w+)/)?.[1] || codeClassName?.match(/lang-(\w+)/)?.[1]
    }
  }

  // Default to 'text' if no language detected
  detectedLanguage = detectedLanguage || 'text'

  // Extract and store code content
  const codeString = extractTextContent(children)
  codeRef.current = codeString // Store reference for copy functionality

  // Use shared highlighting hook
  const { highlightedCode, isLoading, error } = useCodeHighlighting({
    codeContent: codeString,
    language: detectedLanguage,
    showLineNumbers: true,
    isTerminal: false,
    startingLineNumber: 1,
    wordWrap: false,
    autoDetectTheme: true,
  })

  if (isLoading) {
    return (
      <div
        className={cn(
          'relative w-full rounded-xl border border-border',
          'bg-card',
          'my-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300',
          className
        )}
        {...props}
      >
        <div className="px-4 py-3 bg-card border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-muted animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-muted animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative w-full rounded-lg border border-border',
        'bg-card',
        'my-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300',
        'group',
        className
      )}
      {...props}
    >
      {/* Header with language and copy button */}
      <div className="px-4 py-2.5 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Window controls decoration */}
            <WindowControlDecoration />
            {/* Language badge with green accent */}
            <LanguageBadge language={detectedLanguage} />
          </div>

          {/* Copy button - always visible, icon only */}
          <CopyButton
            value={codeRef.current}
            standbyIcon={CopyIcon}
            className="p-1.5 rounded-md transition-all duration-200"
          />
        </div>
      </div>

      {/* Code content with proper padding */}
      <div className="relative overflow-hidden">
        {error ? (
          <div className="p-6 text-danger text-sm font-medium">⚠️ {error}</div>
        ) : (
          <div
            className={cn(
              'overflow-x-auto overflow-y-auto max-h-[350px] md:max-h-[400px]',
              '[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2',
              '[&::-webkit-scrollbar-track]:bg-transparent',
              '[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded',
              '[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/50',
              'text-sm font-mono'
            )}
          >
            <div
              className="shiki-code-block"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
            {/* Add custom styles for Shiki output */}
            <style
              dangerouslySetInnerHTML={{
                __html: getCodeBlockStyles(false),
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * InlineCode Component
 *
 * A styled inline code component for single-line code snippets within text.
 * Automatically used by MDX for `code` elements.
 *
 * @example
 * ```tsx
 * <InlineCode>const greeting = 'Hello';</InlineCode>
 * ```
 */
export const InlineCode: FC<HTMLAttributes<HTMLElement> & { children?: ReactNode }> = ({
  children,
  className,
  ...props
}) => {
  return (
    <code
      {...props}
      className={cn(
        'inline-block px-1.5 py-0.5 text-sm font-mono font-medium rounded-md',
        'bg-muted text-muted-foreground',
        'border border-border',
        'before:content-none after:content-none',
        className
      )}
    >
      {children}
    </code>
  )
}
