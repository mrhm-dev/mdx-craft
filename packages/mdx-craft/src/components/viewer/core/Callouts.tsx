'use client'

import { FC, ReactNode } from 'react'
import { cn } from '../../../utils/index.js'

interface CalloutProps {
  children: ReactNode
  className?: string
  title?: string
}

// Base callout component
const BaseCallout: FC<
  CalloutProps & {
    variant: 'note' | 'warning' | 'info' | 'tip' | 'check' | 'danger'
    icon: ReactNode
  }
> = ({ children, className, title, variant, icon }) => {
  const variantStyles = {
    note: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/60',
      header: 'text-blue-900 dark:text-blue-200',
      content: 'text-blue-800 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/60',
      header: 'text-yellow-900 dark:text-yellow-200',
      content: 'text-yellow-800 dark:text-yellow-300',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
    info: {
      container: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-700/60',
      header: 'text-cyan-900 dark:text-cyan-200',
      content: 'text-cyan-800 dark:text-cyan-300',
      icon: 'text-cyan-600 dark:text-cyan-400',
    },
    tip: {
      container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/60',
      header: 'text-green-900 dark:text-green-200',
      content: 'text-green-800 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400',
    },
    check: {
      container:
        'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/60',
      header: 'text-emerald-900 dark:text-emerald-200',
      content: 'text-emerald-800 dark:text-emerald-300',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    danger: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/60',
      header: 'text-red-900 dark:text-red-200',
      content: 'text-red-800 dark:text-red-300',
      icon: 'text-red-600 dark:text-red-400',
    },
  }

  const styles = variantStyles[variant]
  const defaultTitles = {
    note: 'Note',
    warning: 'Warning',
    info: 'Info',
    tip: 'Tip',
    check: 'Success',
    danger: 'Danger',
  }

  return (
    <div className={cn('rounded-lg border-l-4 p-4 my-4', styles.container, className)}>
      <div className="flex items-start gap-3">
        <div className={cn('flex-shrink-0 mt-0.5', styles.icon)}>{icon}</div>
        <div className="flex-1 min-w-0">
          {(title || defaultTitles[variant]) && (
            <div className={cn('font-semibold text-sm mb-2', styles.header)}>
              {title || defaultTitles[variant]}
            </div>
          )}
          <div className={cn('text-sm leading-relaxed', styles.content)}>{children}</div>
        </div>
      </div>
    </div>
  )
}

// Individual callout components
export const Note: FC<CalloutProps> = (props) => (
  <BaseCallout
    {...props}
    variant="note"
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    }
  />
)

export const Warning: FC<CalloutProps> = (props) => (
  <BaseCallout
    {...props}
    variant="warning"
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    }
  />
)

export const Info: FC<CalloutProps> = (props) => (
  <BaseCallout
    {...props}
    variant="info"
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m11.25 11.25.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
    }
  />
)

export const Tip: FC<CalloutProps> = (props) => (
  <BaseCallout
    {...props}
    variant="tip"
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75-7.478a12.06 12.06 0 014.5 0m-7.5 0a11.964 11.964 0 00-3.5-.189m3.5.189V12m0 6v2.25m0-2.25a6.01 6.01 0 001.5.189"
        />
      </svg>
    }
  />
)

export const Check: FC<CalloutProps> = (props) => (
  <BaseCallout
    {...props}
    variant="check"
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    }
  />
)

export const Danger: FC<CalloutProps> = (props) => (
  <BaseCallout
    {...props}
    variant="danger"
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    }
  />
)
