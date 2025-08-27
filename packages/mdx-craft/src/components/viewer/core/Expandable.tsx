'use client'

import { FC, HTMLAttributes, ReactNode, useState, useRef, useEffect } from 'react'
import { cn } from '../../../utils/index.js'
import { ChevronIcon } from '../../icons/ChevronIcon.js'

export interface ExpandableProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The title/header text for the expandable section
   */
  title: string

  /**
   * Optional icon to display before the title
   */
  icon?: ReactNode

  /**
   * Whether the expandable is initially expanded
   */
  defaultExpanded?: boolean

  /**
   * The content to display when expanded
   */
  children: ReactNode
}

/**
 * Expandable component for collapsible content sections
 *
 * @example
 * ```tsx
 * <Expandable title="Click to expand">
 *   <p>This content is hidden by default</p>
 * </Expandable>
 * ```
 */
export const Expandable: FC<ExpandableProps> = ({
  title,
  icon,
  defaultExpanded = false,
  children,
  className,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [height, setHeight] = useState<number | 'auto'>(defaultExpanded ? 'auto' : 0)
  const contentRef = useRef<HTMLDivElement>(null)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  useEffect(() => {
    if (!contentRef.current) return

    if (isExpanded) {
      const scrollHeight = contentRef.current.scrollHeight
      setHeight(scrollHeight)
    } else {
      setHeight(0)
    }
  }, [isExpanded, children])

  return (
    <div
      className={cn('border border-border rounded-lg overflow-hidden bg-card shadow-sm', className)}
      {...props}
    >
      {/* Header */}
      <button
        onClick={toggleExpanded}
        className={cn(
          'w-full px-4 py-3 text-left',
          'bg-card',
          'hover:bg-secondary',
          'transition-colors duration-200',
          'flex items-center justify-between',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          isExpanded && 'bg-secondary'
        )}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <span className="font-medium text-foreground line-clamp-1">{title}</span>
        </div>

        {/* Chevron icon */}
        <ChevronIcon
          className={cn(
            'size-4 transition-transform text-muted-foreground',
            isExpanded ? 'rotate-180' : ''
          )}
        />
      </button>

      {/* Content */}
      <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ height }}>
        <div
          ref={contentRef}
          className="px-4 py-3 border-t border-border bg-background/50 backdrop-blur-sm"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
