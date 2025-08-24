import type { FC, ReactNode } from 'react'
import { cn } from '../../utils/index.js'

export type BadgeVariant =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'primary'
  | 'secondary'

export interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
  danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
  neutral: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200',
  primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
  secondary: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/60 dark:text-fuchsia-300',
} as const

export const Badge: FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  return (
    <span
      className={cn('px-2 py-0.5 text-xs font-medium rounded', variantClasses[variant], className)}
    >
      {children}
    </span>
  )
}
