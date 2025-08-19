'use client'

import React, { useState, useRef, useEffect } from 'react'
import type { FC, ReactNode } from 'react'

/**
 * Accordion component props
 */
export type AccordionProps = {
  /**
   * Accordion title
   */
  title: string

  /**
   * Icon to display (optional)
   */
  icon?: string | ReactNode

  /**
   * Whether the accordion is open by default
   */
  defaultOpen?: boolean

  /**
   * Controlled open state
   */
  open?: boolean

  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void

  /**
   * Accordion content
   */
  children: ReactNode

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * AccordionGroup component props
 */
export type AccordionGroupProps = {
  /**
   * Allow multiple accordions to be open
   */
  allowMultiple?: boolean

  /**
   * Default open accordion indices
   */
  defaultOpen?: number[]

  /**
   * Children accordions
   */
  children: ReactNode

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Accordion component
 *
 * @example
 * ```mdx
 * <Accordion title="What is MDX?" defaultOpen>
 *   MDX is a format that lets you seamlessly write JSX in your Markdown documents.
 * </Accordion>
 * ```
 */
export const Accordion: FC<AccordionProps> = ({
  title,
  icon,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(controlledOpen ?? defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto')

  // Handle controlled state
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen)
    }
  }, [controlledOpen])

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setContentHeight(contentRef.current.scrollHeight)
        // After animation, set to auto for dynamic content
        const timer = setTimeout(() => {
          setContentHeight('auto')
        }, 300)
        return () => clearTimeout(timer)
      } else {
        setContentHeight(contentRef.current.scrollHeight)
        // Force reflow
        contentRef.current.offsetHeight // eslint-disable-line @typescript-eslint/no-unused-expressions
        setContentHeight(0)
      }
    }
    return undefined
  }, [isOpen])

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onOpenChange?.(newState)
  }

  return (
    <div
      className={`mdx-accordion ${className}`.trim()}
      style={{
        marginTop: 'var(--mdx-spacing-sm)',
        marginBottom: 'var(--mdx-spacing-sm)',
        backgroundColor: 'var(--mdx-accordion-background, var(--mdx-color-background))',
        border: '1px solid var(--mdx-accordion-border, var(--mdx-color-border))',
        borderRadius: 'var(--mdx-radius-md)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={handleToggle}
        className="mdx-accordion__trigger"
        style={{
          width: '100%',
          padding: 'var(--mdx-spacing-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--mdx-spacing-md)',
          backgroundColor: isOpen
            ? 'var(--mdx-accordion-activeBackground, transparent)'
            : 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--mdx-font-size-base)',
          fontWeight: 'var(--mdx-font-weight-medium)',
          color: 'var(--mdx-color-foreground)',
          textAlign: 'left',
          transition: 'background-color 0.2s ease',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor =
              'var(--mdx-accordion-activeBackground, rgba(0, 0, 0, 0.02))'
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mdx-spacing-sm)' }}>
          {icon && (
            <span
              className="mdx-accordion__icon"
              style={{
                fontSize: '1.25rem',
                lineHeight: 1,
              }}
            >
              {typeof icon === 'string' ? icon : icon}
            </span>
          )}
          <span>{title}</span>
        </div>

        <svg
          className="mdx-accordion__chevron"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        ref={contentRef}
        className="mdx-accordion__content"
        style={{
          height: contentHeight,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}
      >
        <div
          style={{
            padding: 'var(--mdx-spacing-md)',
            paddingTop: 0,
            fontSize: 'var(--mdx-font-size-base)',
            color: 'var(--mdx-color-muted)',
            lineHeight: 'var(--mdx-line-height-normal)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * AccordionGroup component for managing multiple accordions
 *
 * @example
 * ```mdx
 * <AccordionGroup>
 *   <Accordion title="First">Content 1</Accordion>
 *   <Accordion title="Second">Content 2</Accordion>
 * </AccordionGroup>
 * ```
 */
export const AccordionGroup: FC<AccordionGroupProps> = ({
  allowMultiple = false,
  defaultOpen = [],
  children,
  className = '',
}) => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set(defaultOpen))

  const handleAccordionChange = (index: number, open: boolean): void => {
    if (allowMultiple) {
      const newIndices = new Set(openIndices)
      if (open) {
        newIndices.add(index)
      } else {
        newIndices.delete(index)
      }
      setOpenIndices(newIndices)
    } else {
      setOpenIndices(open ? new Set([index]) : new Set())
    }
  }

  return (
    <div
      className={`mdx-accordion-group ${className}`.trim()}
      style={{
        marginTop: 'var(--mdx-spacing-md)',
        marginBottom: 'var(--mdx-spacing-md)',
      }}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === Accordion) {
          return React.cloneElement(child as React.ReactElement<AccordionProps>, {
            open: openIndices.has(index),
            onOpenChange: (open: boolean) => handleAccordionChange(index, open),
          })
        }
        return child
      })}
    </div>
  )
}
