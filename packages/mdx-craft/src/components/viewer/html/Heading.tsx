'use client'

import { FC, ReactNode, HTMLAttributes } from 'react'
import { cn } from '../../../utils/index.js'

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  children?: ReactNode
}

/**
 * Professional H1 component for MDX Viewer
 */
export const H1: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <h1
      {...props}
      className={cn(
        'text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans',
        'mb-8 mt-10 pb-4 border-b border-slate-200 dark:border-slate-700',
        'scroll-mt-16',
        className
      )}
    >
      {children}
    </h1>
  )
}

/**
 * Professional H2 component for MDX Viewer
 */
export const H2: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <h2
      {...props}
      className={cn(
        'text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100',
        'mb-6 mt-8 pb-2 border-b border-slate-200 dark:border-slate-700',
        'scroll-mt-16',
        className
      )}
    >
      {children}
    </h2>
  )
}

/**
 * Professional H3 component for MDX Viewer
 */
export const H3: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <h3
      {...props}
      className={cn(
        'text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100',
        'mb-4 mt-6',
        'scroll-mt-16',
        className
      )}
    >
      {children}
    </h3>
  )
}

/**
 * Professional H4 component for MDX Viewer
 */
export const H4: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <h4
      {...props}
      className={cn(
        'text-xl md:text-2xl font-medium tracking-tight text-slate-900 dark:text-slate-100',
        'mb-3 mt-5',
        'scroll-mt-16',
        className
      )}
    >
      {children}
    </h4>
  )
}

/**
 * Professional H5 component for MDX Viewer
 */
export const H5: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <h5
      {...props}
      className={cn(
        'text-lg md:text-xl font-medium tracking-tight text-slate-900 dark:text-slate-100',
        'mb-2 mt-4',
        'scroll-mt-16',
        className
      )}
    >
      {children}
    </h5>
  )
}

/**
 * Professional H6 component for MDX Viewer
 */
export const H6: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <h6
      {...props}
      className={cn(
        'text-base md:text-lg font-medium tracking-tight text-slate-700 dark:text-slate-300',
        'mb-2 mt-3',
        'scroll-mt-16',
        className
      )}
    >
      {children}
    </h6>
  )
}
