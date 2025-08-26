'use client'

import {
  FC,
  ReactNode,
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from 'react'
import { cn } from '../../../utils/index.js'
import { ChevronIcon } from '../../icons/ChevronIcon.js'

// Context for managing accordion group state
const AccordionGroupContext = createContext<{
  openItems: Set<string>
  toggleItem: (id: string) => void
  allowMultiple: boolean
} | null>(null)

export interface AccordionProps {
  /**
   * The title/header text for the accordion
   */
  title: string

  /**
   * Optional icon to display before the title
   */
  icon?: ReactNode

  /**
   * Whether the accordion is initially open (only works when not in a group)
   */
  defaultOpen?: boolean

  /**
   * The content to display when expanded
   */
  children: ReactNode

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Unique identifier for the accordion (used in groups)
   */
  id?: string
}

export interface AccordionGroupProps {
  /**
   * Whether multiple accordions can be open at the same time
   */
  allowMultiple?: boolean

  /**
   * The accordions to group together
   */
  children: ReactNode

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Individual Accordion component
 *
 * @example
 * ```tsx
 * <Accordion title="What is MDX?" defaultOpen>
 *   MDX is a format that lets you seamlessly write JSX in your Markdown documents.
 * </Accordion>
 * ```
 */
export const Accordion: FC<AccordionProps> = ({
  title,
  icon,
  defaultOpen = false,
  children,
  className,
  id,
}) => {
  const groupContext = useContext(AccordionGroupContext)
  const [isStandaloneOpen, setIsStandaloneOpen] = useState(defaultOpen)
  const [height, setHeight] = useState<number | 'auto'>(0)
  const contentRef = useRef<HTMLDivElement>(null)

  // Generate stable ID with useRef to ensure it doesn't change
  const idRef = useRef<string>()
  if (!idRef.current) {
    idRef.current = id || `accordion-${Math.random().toString(36).substr(2, 9)}`
  }
  const accordionId = idRef.current

  // Determine if this accordion is open
  const isOpen = groupContext ? groupContext.openItems.has(accordionId) : isStandaloneOpen

  // Handle toggle
  const handleToggle = () => {
    if (groupContext) {
      console.log('Group toggle:', accordionId, 'current open items:', groupContext.openItems)
      groupContext.toggleItem(accordionId)
    } else {
      console.log('Standalone toggle:', accordionId, 'current state:', isStandaloneOpen)
      setIsStandaloneOpen((prev) => !prev)
    }
  }

  // Update height when open state changes
  useEffect(() => {
    if (!contentRef.current) return

    if (isOpen) {
      const scrollHeight = contentRef.current.scrollHeight
      setHeight(scrollHeight)
    } else {
      setHeight(0)
    }
  }, [isOpen, children])

  // Initialize height on mount if defaultOpen
  useEffect(() => {
    if (defaultOpen && !groupContext && contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [])

  return (
    <div
      className={cn(
        'border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden',
        'bg-white dark:bg-zinc-900/50',
        className
      )}
    >
      {/* Header */}
      <button
        onClick={handleToggle}
        className={cn(
          'w-full px-4 py-3 text-left',
          'bg-zinc-50/50 dark:bg-zinc-900/30',
          'hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30',
          'transition-all duration-200',
          'flex items-center justify-between',
          'focus:outline-none hover:scale-[1.01]',
          isOpen && 'bg-zinc-100/50 dark:bg-zinc-800/30'
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-zinc-600 dark:text-zinc-400">{icon}</div>}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{title}</span>
        </div>

        <ChevronIcon
          className={cn(
            'size-4 text-zinc-500 dark:text-zinc-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Content */}
      <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ height }}>
        <div ref={contentRef} className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * AccordionGroup component for managing multiple accordions
 *
 * @example
 * ```tsx
 * <AccordionGroup allowMultiple>
 *   <Accordion title="First Question">Answer 1</Accordion>
 *   <Accordion title="Second Question">Answer 2</Accordion>
 * </AccordionGroup>
 * ```
 */
export const AccordionGroup: FC<AccordionGroupProps> = ({
  allowMultiple = false,
  children,
  className,
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const newSet = new Set(prev)

        if (newSet.has(id)) {
          newSet.delete(id)
          console.log('Removed item:', id)
        } else {
          if (!allowMultiple) {
            newSet.clear()
            console.log('Cleared all items (single mode)')
          }
          newSet.add(id)
          console.log('Added item:', id)
        }

        console.log('New open items:', newSet)
        return newSet
      })
    },
    [allowMultiple]
  )

  const contextValue = useMemo(
    () => ({
      openItems,
      toggleItem,
      allowMultiple,
    }),
    [openItems, allowMultiple, toggleItem]
  )

  return (
    <AccordionGroupContext.Provider value={contextValue}>
      <div className={cn('space-y-3', className)}>{children}</div>
    </AccordionGroupContext.Provider>
  )
}
