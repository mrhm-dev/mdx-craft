'use client'

import React, {
  useState,
  useMemo,
  Children,
  cloneElement,
  isValidElement,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import type { FC, ReactNode, ReactElement } from 'react'
import { cn } from '../../../utils/index.js'
import type { CodeBlockProps } from './CodeBlock.js'
import { WindowControlDecoration } from '../../common/WindowControlDecoration.js'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

/**
 * Props for the CodeBlockGroup component
 */
export type CodeBlockGroupProps = {
  /** CodeBlock components to display as tabs */
  children: ReactNode

  /** Index of the initially active tab (default: 0) */
  defaultActiveTab?: number

  /** Additional CSS classes for the container */
  className?: string

  /** Custom labels for tabs (overrides filename/title from CodeBlocks) */
  labels?: string[]

  /** Whether to persist the active tab selection in localStorage */
  persist?: boolean

  /** localStorage key for persisting tab selection */
  persistKey?: string

  /** Show window decoration buttons (default: true) */
  showDecorations?: boolean
}

/**
 * Tab button component for switching between code blocks
 */
const TabButton: FC<{
  label: string
  isActive: boolean
  onClick: () => void
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'relative px-4 py-2.5 font-medium text-sm transition-all duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      'select-none cursor-pointer whitespace-nowrap border-b-2',
      isActive
        ? 'border-primary text-primary dark:text-primary'
        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
    )}
    role="tab"
    aria-selected={isActive}
    tabIndex={isActive ? 0 : -1}
  >
    {label}
  </button>
)

/**
 * Scroll button for navigating tabs when they overflow
 */
const ScrollButton: FC<{
  direction: 'left' | 'right'
  onClick: () => void
  'aria-label': string
}> = ({ direction, onClick, 'aria-label': ariaLabel }) => (
  <button
    onClick={onClick}
    className={cn(
      'absolute top-0 bottom-0 z-10 px-2 transition-colors duration-200',
      direction === 'left'
        ? 'left-0 bg-gradient-to-r from-card via-card/95 to-transparent hover:from-secondary'
        : 'right-0 bg-gradient-to-l from-card via-card/95 to-transparent hover:from-secondary'
    )}
    aria-label={ariaLabel}
  >
    {direction === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
  </button>
)

/**
 * Navigation keyboard button component
 */
const NavigationKbd: FC<{
  direction: 'left' | 'right'
  onClick: () => void
  disabled: boolean
}> = ({ direction, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'px-2 py-1 text-[10px] font-semibold rounded transition-all duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
      disabled
        ? 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
        : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer active:scale-95'
    )}
    aria-label={`${direction === 'left' ? 'Previous' : 'Next'} tab`}
  >
    {direction === 'left' ? '←' : '→'}
  </button>
)

/**
 * Tab header component containing decorations, tabs, and scroll controls
 */
const TabHeader: FC<{
  showDecorations: boolean
  canScrollLeft: boolean
  canScrollRight: boolean
  onScroll: (direction: 'left' | 'right') => void
  tabLabels: string[]
  activeTab: number
  onTabChange: (index: number) => void
  tabListRef: React.RefObject<HTMLDivElement>
  onScrollCheck: () => void
}> = ({
  showDecorations,
  canScrollLeft,
  canScrollRight,
  onScroll,
  tabLabels,
  activeTab,
  onTabChange,
  tabListRef,
  onScrollCheck,
}) => (
  <div className="relative border-b border-border">
    <div className="flex items-center justify-between">
      {showDecorations && (
        <div className="px-3">
          <WindowControlDecoration />
        </div>
      )}

      <div className="flex-1 relative flex items-center">
        {canScrollLeft && (
          <ScrollButton
            direction="left"
            onClick={() => onScroll('left')}
            aria-label="Scroll tabs left"
          />
        )}

        {canScrollRight && (
          <ScrollButton
            direction="right"
            onClick={() => onScroll('right')}
            aria-label="Scroll tabs right"
          />
        )}

        <div
          ref={tabListRef}
          className={cn(
            'flex overflow-x-auto scrollbar-none',
            '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
            canScrollLeft && 'pl-8',
            canScrollRight && 'pr-8'
          )}
          role="tablist"
          onScroll={onScrollCheck}
        >
          {tabLabels.map((label, index) => (
            <TabButton
              key={index}
              label={label}
              isActive={index === activeTab}
              onClick={() => onTabChange(index)}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
)

/**
 * Tab content panel component
 */
const TabContent: FC<{
  codeBlocks: ReactElement<CodeBlockProps>[]
  activeTab: number
}> = ({ codeBlocks, activeTab }) => (
  <div className="relative">
    {codeBlocks.map((block, index) => (
      <div
        key={index}
        role="tabpanel"
        aria-labelledby={`tab-${index}`}
        className={cn(
          'transition-all duration-300',
          index === activeTab
            ? 'opacity-100 visible'
            : 'opacity-0 invisible absolute inset-0 pointer-events-none'
        )}
      >
        {cloneElement(block, {
          ...block.props,
          isTab: true,
          showDecorations: false,
          className: cn('rounded-none border-0 shadow-none', block.props.className),
        })}
      </div>
    ))}
  </div>
)

/**
 * Footer navigation component with tab counter and navigation controls
 */
const TabFooter: FC<{
  activeTab: number
  totalTabs: number
  onNavigatePrevious: () => void
  onNavigateNext: () => void
  canNavigatePrevious: boolean
  canNavigateNext: boolean
}> = ({
  activeTab,
  totalTabs,
  onNavigatePrevious,
  onNavigateNext,
  canNavigatePrevious,
  canNavigateNext,
}) => (
  <div className="px-4 py-2 border-t border-border bg-card">
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>
        Tab {activeTab + 1} of {totalTabs}
      </span>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <NavigationKbd
            direction="left"
            onClick={onNavigatePrevious}
            disabled={!canNavigatePrevious}
          />
          <NavigationKbd direction="right" onClick={onNavigateNext} disabled={!canNavigateNext} />
          <span className="ml-1 text-[10px]">Navigate</span>
        </div>
      </div>
    </div>
  </div>
)

/**
 * Custom hook for managing tab navigation and persistence
 */
const useTabNavigation = (
  codeBlocks: ReactElement<CodeBlockProps>[],
  defaultActiveTab: number,
  persist: boolean,
  persistKey: string
) => {
  const getInitialTab = (): number => {
    if (persist && typeof window !== 'undefined') {
      const stored = localStorage.getItem(persistKey)
      if (stored) {
        const index = parseInt(stored, 10)
        if (!isNaN(index) && index >= 0 && index < codeBlocks.length) {
          return index
        }
      }
    }
    return Math.min(defaultActiveTab, codeBlocks.length - 1)
  }

  const [activeTab, setActiveTab] = useState(getInitialTab)

  const handleTabChange = useCallback(
    (index: number) => {
      setActiveTab(index)
      if (persist && typeof window !== 'undefined') {
        localStorage.setItem(persistKey, index.toString())
      }
    },
    [persist, persistKey]
  )

  const navigateToPrevious = useCallback(() => {
    if (activeTab > 0) handleTabChange(activeTab - 1)
  }, [activeTab, handleTabChange])

  const navigateToNext = useCallback(() => {
    if (activeTab < codeBlocks.length - 1) handleTabChange(activeTab + 1)
  }, [activeTab, codeBlocks.length, handleTabChange])

  return {
    activeTab,
    handleTabChange,
    navigateToPrevious,
    navigateToNext,
    canNavigatePrevious: activeTab > 0,
    canNavigateNext: activeTab < codeBlocks.length - 1,
  }
}

/**
 * Custom hook for managing horizontal scroll behavior of tabs
 */
const useTabScroll = () => {
  const tabListRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollAvailability = useCallback(() => {
    if (tabListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabListRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
    }
  }, [])

  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (!tabListRef.current) return

    const scrollAmount = 200
    const currentScroll = tabListRef.current.scrollLeft
    const newScroll =
      direction === 'left'
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount

    tabListRef.current.scrollTo({ left: newScroll, behavior: 'smooth' })
  }, [])

  const scrollActiveTabIntoView = useCallback((index: number) => {
    if (!tabListRef.current) return

    const tabButtons = tabListRef.current.querySelectorAll('button[role="tab"]')
    const activeButton = tabButtons[index] as HTMLElement
    if (!activeButton) return

    const { scrollLeft, clientWidth } = tabListRef.current
    const { offsetLeft: buttonLeft, offsetWidth: buttonWidth } = activeButton

    if (buttonLeft < scrollLeft) {
      tabListRef.current.scrollTo({ left: buttonLeft - 20, behavior: 'smooth' })
    } else if (buttonLeft + buttonWidth > scrollLeft + clientWidth) {
      tabListRef.current.scrollTo({
        left: buttonLeft + buttonWidth - clientWidth + 20,
        behavior: 'smooth',
      })
    }
  }, [])

  return {
    tabListRef,
    canScrollLeft,
    canScrollRight,
    handleScroll,
    scrollActiveTabIntoView,
    checkScrollAvailability,
  }
}

/**
 * Custom hook for extracting and processing CodeBlock children
 */
const useCodeBlocks = (children: ReactNode, labels?: string[]) => {
  const codeBlocks = useMemo(() => {
    const blocks: ReactElement<CodeBlockProps>[] = []
    Children.forEach(children, (child) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (isValidElement(child) && child.type && (child.type as any).displayName === 'CodeBlock') {
        blocks.push(child as ReactElement<CodeBlockProps>)
      }
    })
    return blocks
  }, [children])

  const tabLabels = useMemo(
    () =>
      codeBlocks.map((block, index) => {
        if (labels?.[index]) return labels[index]
        const { title, filename } = block.props
        return title || filename || `Code ${index + 1}`
      }),
    [codeBlocks, labels]
  )

  return { codeBlocks, tabLabels }
}

/**
 * CodeBlockGroup Component
 *
 * Groups multiple CodeBlock components into a tabbed interface with
 * navigation controls and optional persistence.
 *
 * Features:
 * - Tab-based navigation between code blocks
 * - Automatic tab labels from filename/title
 * - Custom tab labels support
 * - Horizontal scroll for overflow tabs
 * - Keyboard navigation controls
 * - localStorage persistence for active tab
 * - Window decorations for desktop feel
 * - Responsive design
 *
 * @example
 * ```tsx
 * // Basic usage with multiple code blocks
 * <CodeBlockGroup>
 *   <CodeBlock language="javascript" filename="index.js">
 *     {jsCode}
 *   </CodeBlock>
 *   <CodeBlock language="css" filename="styles.css">
 *     {cssCode}
 *   </CodeBlock>
 * </CodeBlockGroup>
 *
 * // With custom labels and persistence
 * <CodeBlockGroup
 *   labels={['JavaScript', 'Styles']}
 *   persist
 *   persistKey="my-code-tabs"
 * >
 *   <CodeBlock language="javascript">{jsCode}</CodeBlock>
 *   <CodeBlock language="css">{cssCode}</CodeBlock>
 * </CodeBlockGroup>
 *
 * // Without decorations
 * <CodeBlockGroup showDecorations={false}>
 *   <CodeBlock terminal>npm install</CodeBlock>
 *   <CodeBlock terminal>npm run dev</CodeBlock>
 * </CodeBlockGroup>
 * ```
 */
export const CodeBlockGroup: FC<CodeBlockGroupProps> = ({
  children,
  defaultActiveTab = 0,
  className,
  labels,
  persist = false,
  persistKey = 'codeblock-tab',
  showDecorations = true,
}) => {
  // Extract and process CodeBlock children
  const { codeBlocks, tabLabels } = useCodeBlocks(children, labels)

  // Handle tab navigation and persistence
  const {
    activeTab,
    handleTabChange,
    navigateToPrevious,
    navigateToNext,
    canNavigatePrevious,
    canNavigateNext,
  } = useTabNavigation(codeBlocks, defaultActiveTab, persist, persistKey)

  // Handle tab scrolling behavior
  const {
    tabListRef,
    canScrollLeft,
    canScrollRight,
    handleScroll,
    scrollActiveTabIntoView,
    checkScrollAvailability,
  } = useTabScroll()

  // Enhanced tab change handler with scroll behavior
  const handleTabChangeWithScroll = useCallback(
    (index: number) => {
      handleTabChange(index)
      scrollActiveTabIntoView(index)
    },
    [handleTabChange, scrollActiveTabIntoView]
  )

  // Setup scroll monitoring
  useEffect(() => {
    checkScrollAvailability()
    const handleResize = () => checkScrollAvailability()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [codeBlocks, checkScrollAvailability])

  // Early return for empty state
  if (codeBlocks.length === 0) {
    return (
      <div className={cn('p-8 text-center text-muted-foreground', className)}>
        No code blocks to display
      </div>
    )
  }

  return (
    <div
      className={cn(
        'code-block-group w-full',
        'bg-card rounded-xl border border-border',
        'shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden',
        className
      )}
    >
      <TabHeader
        showDecorations={showDecorations}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        onScroll={handleScroll}
        tabLabels={tabLabels}
        activeTab={activeTab}
        onTabChange={handleTabChangeWithScroll}
        tabListRef={tabListRef}
        onScrollCheck={checkScrollAvailability}
      />

      <TabContent codeBlocks={codeBlocks} activeTab={activeTab} />

      <TabFooter
        activeTab={activeTab}
        totalTabs={codeBlocks.length}
        onNavigatePrevious={navigateToPrevious}
        onNavigateNext={navigateToNext}
        canNavigatePrevious={canNavigatePrevious}
        canNavigateNext={canNavigateNext}
      />
    </div>
  )
}

// Display name for React DevTools
CodeBlockGroup.displayName = 'CodeBlockGroup'
