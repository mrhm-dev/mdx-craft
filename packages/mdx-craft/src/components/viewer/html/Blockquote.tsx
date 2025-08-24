'use client'

import { FC, ReactNode, HTMLAttributes } from 'react'
import { cn } from '../../../utils/index.js'

type BlockquoteProps = HTMLAttributes<HTMLQuoteElement> & {
  children?: ReactNode
}

/**
 * Professional Blockquote component for MDX Viewer
 */
export const Blockquote: FC<BlockquoteProps> = ({ children, className, ...props }) => {
  return (
    <blockquote
      {...props}
      className={cn(
        'relative my-6 pl-6 pr-4 py-4',
        'border-l-4 border-blue-500 dark:border-blue-400',
        'bg-blue-50/50 dark:bg-blue-950/20',
        'text-slate-700 dark:text-slate-300',
        'italic',
        // Quote icon
        'before:content-["""] before:absolute before:left-2 before:top-0',
        'before:text-4xl before:text-blue-500 dark:before:text-blue-400',
        'before:font-serif before:leading-none',
        // Reset margins for nested elements
        '[&>p]:mb-3 [&>p:last-child]:mb-0',
        '[&>*:first-child]:mt-0',
        className
      )}
    >
      {children}
    </blockquote>
  )
}
