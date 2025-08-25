'use client'

import React, { useState, useEffect, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import { highlightCode, type HighlightOptions } from '../../../plugins/shiki-highlighter.js'
import type { BundledTheme } from 'shiki'
import { cn, getCodeBlockStyles } from '../../../utils/index.js'
import { CopyButton } from '../../common/CopyButton.js'
import { CopyIcon } from '../../icons/CopyIcon.js'
import { WindowControlDecoration } from '../../common/WindowControlDecoration.js'

export type CodeBlockProps = {
  children: string | ReactNode
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: string
  startingLineNumber?: number
  wordWrap?: boolean
  className?: string
  showCopy?: boolean
  theme?: BundledTheme
  isTab?: boolean
  title?: string
  showDecorations?: boolean
  terminal?: boolean
  maxHeight?: string | number
}

const LanguageBadge: FC<{ language: string; variant?: 'default' | 'terminal' }> = ({
  language,
  variant = 'default',
}) => {
  const isTerminal = variant === 'terminal' || language === 'bash' || language === 'shell'

  return (
    <span
      className={cn(
        'px-2.5 py-1 text-xs font-semibold rounded-md capitalize select-none',
        'transition-all duration-200',
        isTerminal
          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
          : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30'
      )}
    >
      {language === 'js' ? 'javascript' : language === 'ts' ? 'typescript' : language}
    </span>
  )
}

const CodeSkeleton: FC<{ lines?: number }> = ({ lines = 6 }) => (
  <div className="p-6 space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="w-6 h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse opacity-30" />
        <div
          className={cn(
            'h-3.5 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse',
            i % 3 === 0 ? 'w-3/4' : i % 2 === 0 ? 'w-5/6' : 'w-2/3'
          )}
        />
      </div>
    ))}
  </div>
)

const extractTextContent = (children: ReactNode): string => {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(extractTextContent).join('')
  if (React.isValidElement(children)) return extractTextContent(children.props.children)
  return String(children || '')
}

const useCodeHighlighting = (
  codeContent: string,
  language: string,
  showLineNumbers: boolean,
  isTerminal: boolean,
  startingLineNumber: number,
  wordWrap: boolean,
  theme?: BundledTheme
) => {
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const performHighlight = useMemo(
    () => async () => {
      if (!codeContent.trim()) {
        setHighlightedCode('')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const isDark = document.documentElement.classList.contains('dark')
        const options: HighlightOptions = {
          language: language || 'text',
          showLineNumbers: showLineNumbers && !isTerminal,
          wordWrap,
          startingLineNumber,
          theme: theme || ((isDark ? 'github-dark' : 'github-light') as BundledTheme),
        }

        const result = await highlightCode(codeContent, options)
        setHighlightedCode(result.html)
      } catch (err) {
        console.error('Failed to highlight code:', err)
        setError('Failed to highlight code')

        const escapedCode = codeContent
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        setHighlightedCode(`<pre><code>${escapedCode}</code></pre>`)
      } finally {
        setIsLoading(false)
      }
    },
    [codeContent, language, showLineNumbers, isTerminal, startingLineNumber, wordWrap, theme]
  )

  useEffect(() => {
    performHighlight()
  }, [performHighlight])

  // Theme change handler
  useEffect(() => {
    const handleThemeChange = () => {
      if (codeContent.trim() && !isLoading) {
        performHighlight()
      }
    }

    const observer = new MutationObserver(handleThemeChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [codeContent, isLoading, performHighlight])

  return { highlightedCode, isLoading, error }
}

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
      isTerminal
        ? 'bg-zinc-900 border-zinc-800 dark:border-zinc-700'
        : 'bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800/50 dark:to-zinc-900/50 border-zinc-200 dark:border-zinc-800'
    )}
  >
    <div className="flex items-center gap-3">
      {showDecorations && !isTerminal && <WindowControlDecoration />}

      {isTerminal && <span className="text-green-400 font-bold select-none">❯</span>}

      {(filename || title) && (
        <span
          className={cn(
            'font-medium',
            isTerminal
              ? 'text-green-400 text-sm'
              : 'text-zinc-700 dark:text-zinc-300 text-sm font-mono'
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
    const codeContent = useMemo(() => extractTextContent(children).trim(), [children])
    const isTerminal = terminal || language === 'bash' || language === 'shell'

    const { highlightedCode, isLoading, error } = useCodeHighlighting(
      codeContent,
      language,
      showLineNumbers,
      isTerminal,
      startingLineNumber,
      wordWrap,
      theme
    )

    const containerStyles = cn(
      'relative w-full overflow-hidden transition-all duration-300',
      !isTab && 'rounded-xl border shadow-sm hover:shadow-md',
      !isTab &&
        (isTerminal
          ? 'bg-zinc-950 border-zinc-800 dark:border-zinc-700'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'),
      className
    )

    const maxHeightStyle = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight

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
          <div className={cn('p-6', isTerminal ? 'bg-zinc-950' : 'bg-white dark:bg-zinc-900')}>
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
            <div className="p-6 text-red-500 dark:text-red-400 text-sm font-medium">⚠️ {error}</div>
          ) : (
            <>
              <div
                className={cn(
                  'overflow-x-auto overflow-y-auto',
                  '[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2',
                  '[&::-webkit-scrollbar-track]:bg-transparent',
                  '[&::-webkit-scrollbar-thumb]:bg-zinc-400/30 [&::-webkit-scrollbar-thumb]:rounded-full',
                  '[&::-webkit-scrollbar-thumb:hover]:bg-zinc-400/50',
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
              <CopyButton
                value={codeContent}
                standbyIcon={CopyIcon}
                className={cn(
                  'p-2 rounded-lg backdrop-blur-sm',
                  'bg-white/80 dark:bg-zinc-800/80',
                  'border border-zinc-200 dark:border-zinc-700',
                  'shadow-sm hover:shadow-md'
                )}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
)

CodeBlock.displayName = 'CodeBlock'
