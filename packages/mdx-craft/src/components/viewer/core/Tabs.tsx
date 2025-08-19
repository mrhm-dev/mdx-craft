'use client'

import React, { useState } from 'react'
import type { FC, ReactNode } from 'react'

/**
 * Tab item structure
 */
export type TabItem = {
  /**
   * Tab label
   */
  label: string

  /**
   * Tab value (unique identifier)
   */
  value: string

  /**
   * Tab content
   */
  content: ReactNode

  /**
   * Icon for the tab
   */
  icon?: string | ReactNode

  /**
   * Whether the tab is disabled
   */
  disabled?: boolean
}

/**
 * Tabs component props
 */
export type TabsProps = {
  /**
   * Tab items
   */
  items: TabItem[]

  /**
   * Default active tab value
   */
  defaultValue?: string

  /**
   * Controlled active tab value
   */
  value?: string

  /**
   * Callback when tab changes
   */
  onValueChange?: (value: string) => void

  /**
   * Tab orientation
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Mintlify-style Tabs component
 *
 * @example
 * ```mdx
 * <Tabs
 *   items={[
 *     { label: "JavaScript", value: "js", content: "console.log('Hello');" },
 *     { label: "Python", value: "py", content: "print('Hello')" },
 *     { label: "Rust", value: "rs", content: "println!(\"Hello\");" }
 *   ]}
 * />
 * ```
 */
export const Tabs: FC<TabsProps> = ({
  items,
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = 'horizontal',
  className = '',
}) => {
  const firstEnabledTab = items.find((item) => !item.disabled)
  const [activeValue, setActiveValue] = useState(
    controlledValue ?? defaultValue ?? firstEnabledTab?.value ?? ''
  )

  // Handle controlled state
  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setActiveValue(controlledValue)
    }
  }, [controlledValue])

  const handleTabClick = (value: string) => {
    const tab = items.find((item) => item.value === value)
    if (tab && !tab.disabled) {
      setActiveValue(value)
      onValueChange?.(value)
    }
  }

  // const activeTab = items.find(item => item.value === activeValue);

  return (
    <div
      className={`mdx-tabs mdx-tabs--${orientation} ${className}`.trim()}
      style={{
        marginTop: 'var(--mdx-spacing-md)',
        marginBottom: 'var(--mdx-spacing-md)',
        display: orientation === 'vertical' ? 'flex' : 'block',
        gap: orientation === 'vertical' ? 'var(--mdx-spacing-md)' : 0,
      }}
    >
      {/* Tab list */}
      <div
        className="mdx-tabs__list"
        role="tablist"
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          borderBottom:
            orientation === 'horizontal'
              ? `1px solid var(--mdx-tabs-borderColor, var(--mdx-color-border))`
              : 'none',
          borderRight:
            orientation === 'vertical'
              ? `1px solid var(--mdx-tabs-borderColor, var(--mdx-color-border))`
              : 'none',
          minWidth: orientation === 'vertical' ? '150px' : 'auto',
          gap: orientation === 'vertical' ? '0.25rem' : 0,
        }}
      >
        {items.map((item) => (
          <button
            key={item.value}
            role="tab"
            aria-selected={activeValue === item.value}
            disabled={item.disabled}
            onClick={() => handleTabClick(item.value)}
            className="mdx-tabs__trigger"
            style={{
              padding: 'var(--mdx-spacing-sm) var(--mdx-spacing-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--mdx-spacing-xs)',
              background: 'transparent',
              border: 'none',
              borderBottom:
                orientation === 'horizontal'
                  ? `2px solid ${
                      activeValue === item.value
                        ? 'var(--mdx-tabs-activeColor, var(--mdx-color-primary))'
                        : 'transparent'
                    }`
                  : 'none',
              borderLeft:
                orientation === 'vertical'
                  ? `2px solid ${
                      activeValue === item.value
                        ? 'var(--mdx-tabs-activeColor, var(--mdx-color-primary))'
                        : 'transparent'
                    }`
                  : 'none',
              marginBottom: orientation === 'horizontal' ? '-1px' : 0,
              marginRight: orientation === 'vertical' ? '-1px' : 0,
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              fontSize: 'var(--mdx-font-size-sm)',
              fontWeight:
                activeValue === item.value
                  ? 'var(--mdx-font-weight-semibold)'
                  : 'var(--mdx-font-weight-normal)',
              color: item.disabled
                ? 'var(--mdx-color-muted)'
                : activeValue === item.value
                  ? 'var(--mdx-tabs-activeColor, var(--mdx-color-primary))'
                  : 'var(--mdx-color-foreground)',
              opacity: item.disabled ? 0.5 : 1,
              transition: 'all 0.2s ease',
              outline: 'none',
              textAlign: 'left',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!item.disabled && activeValue !== item.value) {
                e.currentTarget.style.backgroundColor =
                  'var(--mdx-tabs-hoverBackground, rgba(0, 0, 0, 0.05))'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {item.icon && (
              <span
                className="mdx-tabs__icon"
                style={{
                  fontSize: '1rem',
                  lineHeight: 1,
                }}
              >
                {typeof item.icon === 'string' ? item.icon : item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div
        className="mdx-tabs__panels"
        style={{
          flex: 1,
          marginTop: orientation === 'horizontal' ? 'var(--mdx-spacing-md)' : 0,
          marginLeft: orientation === 'vertical' ? 'var(--mdx-spacing-md)' : 0,
        }}
      >
        {items.map((item) => (
          <div
            key={item.value}
            role="tabpanel"
            hidden={activeValue !== item.value}
            className="mdx-tabs__panel"
            style={{
              animation: activeValue === item.value ? 'fadeIn 0.2s ease' : 'none',
            }}
          >
            {activeValue === item.value && item.content}
          </div>
        ))}
      </div>
    </div>
  )
}
