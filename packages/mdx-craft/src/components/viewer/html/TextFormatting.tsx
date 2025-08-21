'use client'

import { FC, ReactNode, HTMLAttributes } from 'react'
import { cn } from '../../../theme/utils.js'

type TextProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode
}

/**
 * Professional Strong (bold) component for MDX Viewer
 */
export const Strong: FC<TextProps> = ({ children, className, ...props }) => {
  return (
    <strong
      {...props}
      className={cn('font-semibold text-slate-900 dark:text-slate-100', className)}
    >
      {children}
    </strong>
  )
}

/**
 * Professional Emphasis (italic) component for MDX Viewer
 */
export const Emphasis: FC<TextProps> = ({ children, className, ...props }) => {
  return (
    <em {...props} className={cn('italic text-slate-700 dark:text-slate-300', className)}>
      {children}
    </em>
  )
}

/**
 * Professional Inline Code component for MDX Viewer
 */
export const InlineCode: FC<TextProps> = ({ children, className, ...props }) => {
  return (
    <code
      {...props}
      className={cn(
        'inline-block px-1.5 py-0.5 text-sm font-mono',
        'bg-slate-100 dark:bg-slate-800',
        'text-slate-900 dark:text-slate-100',
        'border border-slate-200 dark:border-slate-700',
        'rounded-md',
        'before:content-none after:content-none',
        className
      )}
    >
      {children}
    </code>
  )
}

/**
 * Professional Delete (strikethrough) component for MDX Viewer
 */
export const Delete: FC<TextProps> = ({ children, className, ...props }) => {
  return (
    <del {...props} className={cn('line-through text-slate-500 dark:text-slate-400', className)}>
      {children}
    </del>
  )
}

/**
 * Professional Mark (highlight) component for MDX Viewer
 */
export const Mark: FC<TextProps> = ({ children, className, ...props }) => {
  return (
    <mark
      {...props}
      className={cn(
        'bg-yellow-200 dark:bg-yellow-800/30',
        'text-slate-900 dark:text-slate-100',
        'px-1 py-0.5 rounded',
        className
      )}
    >
      {children}
    </mark>
  )
}
