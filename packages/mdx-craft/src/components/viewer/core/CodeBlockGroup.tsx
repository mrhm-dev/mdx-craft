'use client'

import React, {
  useState,
  useMemo,
  Children,
  cloneElement,
  isValidElement,
  useRef,
  useEffect,
} from 'react'
import type { FC, ReactNode, ReactElement } from 'react'
import { cn } from '../../../utils/index.js'
import type { CodeBlockProps } from './CodeBlock.js'

export type CodeBlockGroupProps = {
  children: ReactNode
  defaultActiveTab?: number
  className?: string
  labels?: string[]
  persist?: boolean
  persistKey?: string
}

const TabButton: FC<{
  label: string
  isActive: boolean
  onClick: () => void
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'relative px-4 py-2.5 font-medium text-sm transition-all duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
      'select-none cursor-pointer whitespace-nowrap border-b-2',
      isActive
        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
        : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-600'
    )}
    role="tab"
    aria-selected={isActive}
    tabIndex={isActive ? 0 : -1}
  >
    {label}
  </button>
)

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
        ? 'left-0 bg-gradient-to-r from-white via-white/95 to-transparent dark:from-zinc-900 dark:via-zinc-900/95 hover:from-zinc-50 dark:hover:from-zinc-800'
        : 'right-0 bg-gradient-to-l from-white via-white/95 to-transparent dark:from-zinc-900 dark:via-zinc-900/95 hover:from-zinc-50 dark:hover:from-zinc-800'
    )}
    aria-label={ariaLabel}
  >
    <svg
      className="w-4 h-4 text-zinc-600 dark:text-zinc-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
      />
    </svg>
  </button>
)

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
      'px-1 text-[10px] font-semibold rounded transition-all duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
      disabled
        ? 'bg-zinc-200/50 dark:bg-zinc-700/50 text-zinc-400 cursor-not-allowed'
        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 cursor-pointer active:scale-95'
    )}
    aria-label={`${direction === 'left' ? 'Previous' : 'Next'} tab`}
  >
    {direction === 'left' ? '←' : '→'}
  </button>
)

export const CodeBlockGroup: FC<CodeBlockGroupProps> = ({
  children,
  defaultActiveTab = 0,
  className,
  labels,
  persist = false,
  persistKey = 'codeblock-tab',
}) => {
  const tabListRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

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
    return defaultActiveTab
  }

  const [activeTab, setActiveTab] = useState(getInitialTab)

  const tabLabels = useMemo(
    () =>
      codeBlocks.map((block, index) => {
        if (labels?.[index]) return labels[index]
        const { title, filename } = block.props
        return title || filename || `Code ${index + 1}`
      }),
    [codeBlocks, labels]
  )

  const checkScrollAvailability = () => {
    if (tabListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabListRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
    }
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (!tabListRef.current) return

    const scrollAmount = 200
    const currentScroll = tabListRef.current.scrollLeft
    const newScroll =
      direction === 'left'
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount

    tabListRef.current.scrollTo({ left: newScroll, behavior: 'smooth' })
  }

  const scrollActiveTabIntoView = (index: number) => {
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
  }

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    if (persist && typeof window !== 'undefined') {
      localStorage.setItem(persistKey, index.toString())
    }

    scrollActiveTabIntoView(index)
  }

  const navigateToPrevious = () => {
    if (activeTab > 0) handleTabChange(activeTab - 1)
  }

  const navigateToNext = () => {
    if (activeTab < codeBlocks.length - 1) handleTabChange(activeTab + 1)
  }

  useEffect(() => {
    checkScrollAvailability()
    const handleResize = () => checkScrollAvailability()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [codeBlocks])

  if (codeBlocks.length === 0) {
    return (
      <div className={cn('p-8 text-center text-zinc-500 dark:text-zinc-400', className)}>
        No code blocks to display
      </div>
    )
  }

  const canNavigatePrevious = activeTab > 0
  const canNavigateNext = activeTab < codeBlocks.length - 1

  return (
    <div
      className={cn(
        'code-block-group w-full',
        'bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800',
        'shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden',
        className
      )}
    >
      {/* Tab Navigation */}
      <div className="relative border-b border-zinc-200 dark:border-zinc-800">
        {canScrollLeft && (
          <ScrollButton
            direction="left"
            onClick={() => handleScroll('left')}
            aria-label="Scroll tabs left"
          />
        )}

        {canScrollRight && (
          <ScrollButton
            direction="right"
            onClick={() => handleScroll('right')}
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
          onScroll={checkScrollAvailability}
        >
          {tabLabels.map((label, index) => (
            <TabButton
              key={index}
              label={label}
              isActive={index === activeTab}
              onClick={() => handleTabChange(index)}
            />
          ))}
        </div>
      </div>

      {/* Tab Content */}
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

      {/* Footer Navigation */}
      <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            Tab {activeTab + 1} of {codeBlocks.length}
          </span>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <NavigationKbd
                direction="left"
                onClick={navigateToPrevious}
                disabled={!canNavigatePrevious}
              />
              <NavigationKbd
                direction="right"
                onClick={navigateToNext}
                disabled={!canNavigateNext}
              />
              <span className="ml-1 text-[10px]">Navigate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

CodeBlockGroup.displayName = 'CodeBlockGroup'
