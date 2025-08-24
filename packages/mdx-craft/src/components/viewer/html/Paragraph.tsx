'use client'

import { FC, ReactNode, HTMLAttributes } from 'react'
import { cn } from '../../../utils/index.js'

type ParagraphProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode
}

/**
 * Professional Paragraph component for MDX Viewer
 */
export const Paragraph: FC<ParagraphProps> = ({ children, className, ...props }) => {
  return (
    <p
      {...props}
      className={cn(
        'text-base md:text-lg leading-7 text-slate-700 dark:text-slate-300',
        'mb-6 last:mb-0',
        className
      )}
    >
      {children}
    </p>
  )
}
