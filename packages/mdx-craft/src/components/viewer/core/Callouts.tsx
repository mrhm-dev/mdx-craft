'use client'

import { FC, ReactNode } from 'react'
import { cn } from '../../../utils/index.js'
import {
  InfoIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  LightbulbIcon,
  CheckCircleIcon,
  XCircleIcon,
} from 'lucide-react'

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
      container: 'bg-blue-50 dark:bg-blue-950/20 border-l-blue-500 dark:border-l-blue-400',
      header: 'text-blue-900 dark:text-blue-100',
      content: 'text-blue-600 dark:text-blue-400',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    warning: {
      container: 'bg-amber-50 dark:bg-amber-950/20 border-l-amber-500 dark:border-l-amber-400',
      header: 'text-amber-900 dark:text-amber-100',
      content: 'text-amber-600 dark:text-amber-400',
      icon: 'text-amber-600 dark:text-amber-400',
    },
    info: {
      container: 'bg-cyan-50 dark:bg-cyan-950/20 border-l-cyan-500 dark:border-l-cyan-400',
      header: 'text-cyan-900 dark:text-cyan-100',
      content: 'text-cyan-600 dark:text-cyan-400',
      icon: 'text-cyan-600 dark:text-cyan-400',
    },
    tip: {
      container: 'bg-green-50 dark:bg-green-950/20 border-l-green-500 dark:border-l-green-400',
      header: 'text-green-900 dark:text-green-100',
      content: 'text-green-600 dark:text-green-400',
      icon: 'text-green-600 dark:text-green-400',
    },
    check: {
      container:
        'bg-emerald-50 dark:bg-emerald-950/20 border-l-emerald-500 dark:border-l-emerald-400',
      header: 'text-emerald-900 dark:text-emerald-100',
      content: 'text-emerald-600 dark:text-emerald-400',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    danger: {
      container: 'bg-red-50 dark:bg-red-950/20 border-l-red-500 dark:border-l-red-400',
      header: 'text-red-900 dark:text-red-100',
      content: 'text-red-600 dark:text-red-400',
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
  <BaseCallout {...props} variant="note" icon={<InfoIcon className="w-5 h-5" />} />
)

export const Warning: FC<CalloutProps> = (props) => (
  <BaseCallout {...props} variant="warning" icon={<AlertTriangleIcon className="w-5 h-5" />} />
)

export const Info: FC<CalloutProps> = (props) => (
  <BaseCallout {...props} variant="info" icon={<AlertCircleIcon className="w-5 h-5" />} />
)

export const Tip: FC<CalloutProps> = (props) => (
  <BaseCallout {...props} variant="tip" icon={<LightbulbIcon className="w-5 h-5" />} />
)

export const Check: FC<CalloutProps> = (props) => (
  <BaseCallout {...props} variant="check" icon={<CheckCircleIcon className="w-5 h-5" />} />
)

export const Danger: FC<CalloutProps> = (props) => (
  <BaseCallout {...props} variant="danger" icon={<XCircleIcon className="w-5 h-5" />} />
)
