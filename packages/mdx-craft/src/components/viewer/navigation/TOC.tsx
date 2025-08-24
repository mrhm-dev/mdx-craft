'use client'

import { FC } from 'react'
import { useTOC } from '../../../hooks/useTOC.js'
import type { UseTOCOptions } from '../../../types/toc.js'
import { cn } from '../../../utils/index.js'

export interface TOCProps extends UseTOCOptions {
  /** Additional CSS class for the container */
  className?: string
  /** Show loading state */
  showLoading?: boolean
}

/**
 * Table of Contents component with clean, professional design
 * Features vertical line indicator and active section highlighting
 */
export const TOC: FC<TOCProps> = ({ className = '', showLoading = false, ...tocOptions }) => {
  const { items, activeId, scrollTo, isLoading } = useTOC(tocOptions)

  if (!isLoading && !items.length) {
    return null
  }

  const getIndentLevel = (level: number) => {
    const minLevel = Math.min(...items.map((item) => item.level))
    return (level - minLevel) * 16 // 16px per level
  }

  return (
    <>
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100/75 mb-4">
        On this page
      </div>

      {isLoading && showLoading ? (
        <TOCSkeleton className={className} />
      ) : (
        <nav className={cn('toc', className)} aria-label="Table of contents">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 top-2 bottom-2 w-px bg-zinc-200 dark:bg-zinc-700" />

            {/* Active indicator */}
            {activeId && (
              <div
                className="absolute left-0 w-0.5 bg-emerald-500 dark:bg-emerald-400 transition-all duration-200 ease-out"
                style={{
                  top: `${items.findIndex((item) => item.id === activeId) * 2.25}rem`,
                  height: '2rem',
                }}
              />
            )}

            <ul className="space-y-1 pl-4">
              {items.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${getIndentLevel(item.level)}px` }}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className={cn(
                      'group flex items-start text-left w-full py-1.5 px-2 -ml-2 rounded-md',
                      'text-sm leading-5 transition-colors duration-150 ease-in-out',
                      'hover:bg-zinc-100 hover:text-zinc-900',
                      'dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
                      'focus:outline-none',
                      activeId === item.id
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-zinc-600 dark:text-zinc-400'
                    )}
                    aria-current={activeId === item.id ? 'location' : undefined}
                  >
                    <span className="flex-1 truncate">{item.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </>
  )
}

const TOCSkeleton: FC<{ className?: string }> = ({ className }) => {
  const skeletonItems = [
    { width: '75%', indent: 0 },
    { width: '60%', indent: 16 },
    { width: '85%', indent: 16 },
    { width: '65%', indent: 0 },
    { width: '70%', indent: 16 },
  ]

  return (
    <div className={cn('toc-loading', className)}>
      <div className="relative">
        {/* Vertical line skeleton */}
        <div className="absolute left-0 top-2 bottom-2 w-px bg-zinc-200 dark:bg-zinc-700" />

        <ul className="space-y-1 pl-4">
          {/* Skeleton items */}
          {skeletonItems.map((item, i) => (
            <li key={i} style={{ paddingLeft: `${item.indent}px` }}>
              <div className="flex items-center py-1.5 px-2 -ml-2">
                <div
                  className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"
                  style={{ width: item.width }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
