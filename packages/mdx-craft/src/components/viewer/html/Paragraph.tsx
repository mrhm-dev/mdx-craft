'use client'

import { FC, ReactNode, HTMLAttributes } from 'react'
import { cn } from '../../../utils/index.js'

type TextProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode
}
/**
 * Paragraph component for MDX Viewer
 */
export const Paragraph: FC<TextProps> = ({ children, className, ...props }) => {
  return (
    <span
      {...props}
      className={cn(
        'text-base font-sans font-normal leading-6 mb-6 text-zinc-900/80 dark:text-zinc-100/70 block',
        className
      )}
    >
      {children}
    </span>
  )
}

/**
 * Strong (bold) component for MDX Viewer
 */
export const Strong: FC<TextProps> = ({ children, className, ...props }) => {
  return (
    <strong
      {...props}
      className={cn('font-semibold text-zinc-900! dark:text-zinc-100!', className)}
    >
      {children}
    </strong>
  )
}

/**
 * Emphasis (italic) component for MDX Viewer
 */
export const Emphasis: FC<TextProps> = ({ children, className, ...props }) => {
  return (
    <em {...props} className={cn('italic', className)}>
      {children}
    </em>
  )
}

/**
 * Professional Delete (strikethrough) component for MDX Viewer
 */
export const Delete: FC<TextProps> = ({ children, className, ...props }) => {
  return (
    <del
      {...props}
      className={cn('line-through text-zinc-900/50 dark:text-zinc-100/50', className)}
    >
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
        'text-zinc-900 dark:text-zinc-100',
        'px-1 py-0.5 rounded',
        className
      )}
    >
      {children}
    </mark>
  )
}

export const Superscript: FC<TextProps> = ({ children, className, ...props }) => {
  return (
    <sup {...props} className={cn('text-sm', className)}>
      {children}
    </sup>
  )
}

export const Subscript: FC<TextProps> = ({ children, className, ...props }) => {
  return (
    <sub {...props} className={cn('text-sm', className)}>
      {children}
    </sub>
  )
}

/**
 * Professional Blockquote component for MDX Viewer
 */
export const Blockquote: FC<TextProps> = ({ children, className, ...props }) => {
  return (
    <blockquote
      {...props}
      className={cn(
        'border-l-4 border-zinc-300 dark:border-zinc-700 pl-6 my-6 text-zinc-900/80 dark:text-zinc-100/70',
        className
      )}
    >
      {children}
    </blockquote>
  )
}
