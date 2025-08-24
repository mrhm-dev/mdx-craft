'use client'

import { FC, ReactNode, HTMLAttributes, useEffect, useState, useRef } from 'react'
import { cn } from '../../../utils/index.js'
import React from 'react'
import { highlightCode, type HighlightOptions } from '../../../plugins/shiki-highlighter.js'
import { CopyIcon } from '../../icons/CopyIcon.js'
import { CopyButton } from '../../common/CopyButton.js'
import { Badge } from '../../common/Badge.js'
import { WindowControlDecoration } from '../../common/WindowControlDecoration.js'

type CodeProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode
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
 * Code component for multi-line code blocks from markdown files
 * Uses shiki-highlighter for syntax highlighting with copy functionality
 */
export const Code: FC<CodeProps> = ({ children, className, ...props }) => {
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const codeRef = useRef<string>('')

  // Extract language from className on either the pre element or nested code element
  let detectedLanguage =
    className?.match(/language-(\w+)/)?.[1] || className?.match(/lang-(\w+)/)?.[1]

  // If not found on pre, check if there's a code element child with the class
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

  detectedLanguage = detectedLanguage || 'text'

  // Extract the actual code content from children
  const codeString = extractTextContent(children)
  codeRef.current = codeString // Store for copy functionality

  useEffect(() => {
    const highlightCodeContent = async () => {
      if (!codeString.trim()) {
        setHighlightedCode('')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)

        // Check if dark mode is active (Tailwind v4)
        const isDark = document.documentElement.classList.contains('dark')

        const options: HighlightOptions = {
          language: detectedLanguage,
          showLineNumbers: true,
          wordWrap: false,
          startingLineNumber: 1,
          theme: isDark ? 'github-dark' : 'github-light',
        }

        const result = await highlightCode(codeString, options)
        setHighlightedCode(result.html)
      } catch (err) {
        console.error('Failed to highlight code:', err)
        // Fallback to plain text
        setHighlightedCode(`<pre><code>${codeString}</code></pre>`)
      } finally {
        setIsLoading(false)
      }
    }

    highlightCodeContent()
  }, [codeString, detectedLanguage])

  // Re-highlight when theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      // Force re-highlight with new theme
      if (codeString.trim()) {
        const reHighlight = async () => {
          // Check if dark mode is active (Tailwind v4)
          const isDark = document.documentElement.classList.contains('dark')

          const options: HighlightOptions = {
            language: detectedLanguage,
            showLineNumbers: true,
            wordWrap: false,
            startingLineNumber: 1,
            theme: isDark ? 'github-dark' : 'github-light',
          }
          const result = await highlightCode(codeString, options)
          setHighlightedCode(result.html)
        }
        reHighlight()
      }
    }

    // Listen for theme changes
    const observer = new MutationObserver(handleThemeChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [codeString, detectedLanguage])

  if (isLoading) {
    return (
      <div
        className={cn(
          'relative w-full rounded-xl border border-zinc-200 dark:border-zinc-800',
          'bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950',
          'my-6 overflow-hidden shadow-lg',
          className
        )}
        {...props}
      >
        <div className="px-4 py-3 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative w-full rounded-lg border border-zinc-200 dark:border-zinc-800',
        'bg-white dark:bg-zinc-900',
        'my-6 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300',
        'group',
        className
      )}
      {...props}
    >
      {/* Header with language and copy button */}
      <div className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Window controls decoration */}
            <WindowControlDecoration />
            {/* Language badge with green accent */}
            <Badge variant="success" className="capitalize">
              {detectedLanguage}
            </Badge>
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
        <div
          className={cn(
            'overflow-x-auto overflow-y-auto max-h-[350px] md:max-h-[400px]',
            '[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2',
            '[&::-webkit-scrollbar-track]:bg-transparent',
            '[&::-webkit-scrollbar-thumb]:bg-zinc-400/30 [&::-webkit-scrollbar-thumb]:rounded',
            '[&::-webkit-scrollbar-thumb:hover]:bg-zinc-400/50',
            'text-sm font-mono'
          )}
        >
          <div className="shiki-code-block" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          {/* Add custom styles for Shiki output */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .shiki-code-block pre {
              background: transparent !important;
              padding: 1rem !important;
              margin: 0 !important;
              overflow-x: auto;
              font-family: 'Fira Code', 'Monaco', 'Consolas', 'Courier New', monospace;
            }
            .shiki-code-block code {
              background: transparent !important;
              display: block;
              font-family: inherit;
              line-height: 0.5;
            }
            .shiki-code-block .line {
              display: block;
              padding: 0.125rem 1rem;
              line-height: 1.2;
              min-height: 1.2em;
            }
            .shiki-code-block .line:empty::before {
              content: '\\200B';
            }
            .shiki-code-block .line[data-line] {
              position: relative;
              padding-left: 3.5rem;
            }
            .shiki-code-block .line[data-line]::before {
              content: attr(data-line);
              position: absolute;
              left: 0;
              width: 1.5rem;
              color: rgb(113 113 122 / 0.4);
              text-align: right;
              font-size: 0.75rem;
              user-select: none;
              line-height: 1.5;

            }
            .shiki-code-block .highlighted-line {
              background-color: rgb(59 130 246 / 0.1);
              border-left: 3px solid rgb(59 130 246);
              margin-left: -3px;
              padding-left: calc(3.5rem - 3px);
            }
          `,
            }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Inline code component for single-line code snippets
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
        'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100',
        'border border-zinc-200 dark:border-zinc-700',
        'before:content-none after:content-none',
        className
      )}
    >
      {children}
    </code>
  )
}
