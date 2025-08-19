'use client'

import React from 'react'
import type { FC, ReactNode } from 'react'
import { useMDXViewer } from '../../../hooks/useMDXViewer.js'
import { cn } from '../../../theme/utils.js'

/**
 * Card component props
 */
export type CardProps = {
  /**
   * Card title
   */
  title?: string

  /**
   * Icon to display (can be emoji or component)
   */
  icon?: string | ReactNode

  /**
   * Link URL
   */
  href?: string

  /**
   * Horizontal layout
   */
  horizontal?: boolean

  /**
   * Card content
   */
  children: ReactNode

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Click handler
   */
  onClick?: () => void

  /**
   * Target for link (when href is provided)
   */
  target?: '_blank' | '_self' | '_parent' | '_top'

  /**
   * Rel attribute for link (when href is provided)
   */
  rel?: string
}

/**
 * Card component
 *
 * Features:
 * - Interactive hover effects
 * - Horizontal and vertical layouts
 * - Support for icons and links
 * - Fully responsive design
 * - Typography integration
 * - Accessibility features
 *
 * @example
 * ```mdx
 * <Card title="Getting Started" icon="🚀" href="/docs/quickstart">
 *   Learn how to set up your first project
 * </Card>
 *
 * <Card title="API Reference" icon="📖" href="/docs/api" horizontal>
 *   Complete documentation of all components
 * </Card>
 * ```
 */
export const Card: FC<CardProps> = ({
  title,
  icon,
  href,
  horizontal = false,
  children,
  className,
  onClick,
  target,
  rel,
}) => {
  const { getComponentClasses } = useMDXViewer()

  // Get base card classes from theme
  const cardClasses = getComponentClasses('card')

  // Determine if card is interactive
  const isInteractive = Boolean(href || onClick)

  // Build final class name
  const finalClassName = cn(
    cardClasses,
    // Layout classes
    horizontal ? 'flex flex-row items-center' : 'flex flex-col',
    // Interactive states
    isInteractive &&
      'cursor-pointer transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-800/50 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
    className
  )

  // Create the content
  const content = (
    <>
      {/* Icon */}
      {icon && (
        <div className={cn('flex-shrink-0', horizontal ? 'mr-4' : 'mb-3', 'text-2xl leading-none')}>
          {typeof icon === 'string' ? (
            <span role="img" aria-hidden="true">
              {icon}
            </span>
          ) : (
            icon
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-grow min-w-0">
        {title && (
          <h3
            className={cn(
              'font-semibold text-slate-900 dark:text-slate-100',
              'text-lg leading-tight',
              children ? 'mb-2' : 'mb-0'
            )}
          >
            {title}
          </h3>
        )}

        {children && (
          <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {children}
          </div>
        )}
      </div>

      {/* Arrow for links */}
      {href && (
        <div
          className={cn(
            'flex-shrink-0 text-emerald-600 dark:text-emerald-400',
            'transition-transform duration-200 group-hover:translate-x-1',
            horizontal ? 'ml-4' : 'mt-3 self-end'
          )}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </>
  )

  // Handle click
  const handleClick = () => {
    onClick?.()
  }

  // Render as link if href is provided
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        className={cn(finalClassName, 'group', 'no-underline')}
        onClick={handleClick}
      >
        {content}
      </a>
    )
  }

  // Render as button if onClick is provided
  if (onClick) {
    return (
      <button
        type="button"
        className={cn(finalClassName, 'group', 'text-left w-full')}
        onClick={handleClick}
      >
        {content}
      </button>
    )
  }

  // Render as div for non-interactive cards
  return <div className={finalClassName}>{content}</div>
}
