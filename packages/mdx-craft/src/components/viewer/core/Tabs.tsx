'use client'

import React, { useState, useEffect, Children, isValidElement } from 'react'
import type { FC, ReactNode, ReactElement } from 'react'
import { cn } from '../../../utils/index.js'

/**
 * Props for individual Tab component
 */
interface TabProps extends React.HTMLAttributes<HTMLButtonElement> {
  /** The title displayed in the tab header */
  title: string
  /** Optional icon to display alongside the title */
  icon?: ReactNode
  /** The content to display when this tab is active */
  children: ReactNode
  /** Whether this tab should be disabled */
  disabled?: boolean
}

/**
 * Individual Tab component (used as child of Tabs)
 * @example
 * ```tsx
 * <Tab title="JavaScript" icon={<JsIcon />}>
 *   console.log('Hello World')
 * </Tab>
 * ```
 */
export const Tab: FC<TabProps> = ({ children }) => {
  // Tab component just holds the data, rendering is handled by Tabs
  return <>{children}</>
}

/**
 * Props for the Tabs container component
 */
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tab components as children */
  children: ReactNode
  /** Default active tab index */
  defaultIndex?: number
  /** Controlled active tab index */
  activeIndex?: number
  /** Callback when tab changes */
  onTabChange?: (index: number) => void
  /** Tab list alignment */
  align?: 'left' | 'center' | 'right'
  /** Whether tabs should take full width */
  fullWidth?: boolean
}

/**
 * Tabs component with flat underline style
 * @example
 * ```tsx
 * <Tabs>
 *   <Tab title="First">First tab content</Tab>
 *   <Tab title="Second" icon={<Icon />}>Second tab content</Tab>
 * </Tabs>
 * ```
 */
export const Tabs: FC<TabsProps> = ({
  children,
  defaultIndex = 0,
  activeIndex: controlledIndex,
  onTabChange,
  className,
  align = 'left',
  fullWidth = false,
  ...props
}) => {
  // Extract tab data from children
  const tabs = Children.toArray(children)
    .filter((child) => isValidElement(child) && child.type === Tab)
    .map((child) => {
      const tabElement = child as ReactElement<TabProps>
      return {
        title: tabElement.props.title,
        icon: tabElement.props.icon,
        content: tabElement.props.children,
        disabled: tabElement.props.disabled || false,
      }
    })

  // Find first non-disabled tab
  const firstEnabledIndex = tabs.findIndex((tab) => !tab.disabled)
  const initialIndex = defaultIndex >= 0 ? defaultIndex : firstEnabledIndex

  const [activeTab, setActiveTab] = useState(initialIndex)

  // Handle controlled state
  useEffect(() => {
    if (controlledIndex !== undefined && controlledIndex >= 0) {
      setActiveTab(controlledIndex)
    }
  }, [controlledIndex])

  const handleTabClick = (index: number) => {
    if (!tabs[index]?.disabled) {
      setActiveTab(index)
      onTabChange?.(index)
    }
  }

  if (tabs.length === 0) {
    return null
  }

  return (
    <div className={cn('w-full', className)} {...props}>
      {/* Tab List */}
      <div
        className={cn(
          'relative border-b border-border',
          align === 'center' && 'flex justify-center',
          align === 'right' && 'flex justify-end'
        )}
        role="tablist"
      >
        <div
          className={cn(
            'flex',
            fullWidth && 'w-full',
            fullWidth && tabs.length > 0 && 'justify-between'
          )}
        >
          {tabs.map((tab, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={activeTab === index}
              disabled={tab.disabled}
              onClick={() => handleTabClick(index)}
              className={cn(
                'relative px-4 py-2.5 text-sm transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                'select-none whitespace-nowrap border-b-2 -mb-[1px]',
                fullWidth && 'flex-1',
                activeTab === index
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted font-medium',
                tab.disabled &&
                  'cursor-not-allowed opacity-40 hover:text-muted-foreground hover:border-transparent'
              )}
            >
              <span className="flex items-center gap-2">
                {tab.icon && (
                  <span className="inline-flex items-center justify-center">{tab.icon}</span>
                )}
                <span>{tab.title}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {tabs.map((tab, index) => (
          <div
            key={index}
            role="tabpanel"
            hidden={activeTab !== index}
            className={cn(
              'animate-in fade-in-0 duration-200',
              activeTab === index ? 'block' : 'hidden'
            )}
          >
            {activeTab === index && tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}
