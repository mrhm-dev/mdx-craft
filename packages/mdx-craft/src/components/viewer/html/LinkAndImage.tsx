'use client'

import { FC, ReactNode } from 'react'
import { cn } from '../../../theme/utils.js'

type LinkProps = {
  children: ReactNode
  href?: string
  title?: string
  target?: string
  rel?: string
  className?: string
}

type ImageProps = {
  src?: string
  alt?: string
  title?: string
  width?: number | string
  height?: number | string
  className?: string
}

type HorizontalRuleProps = {
  className?: string
}

/**
 * Professional Link component for MDX Viewer
 */
export const Link: FC<LinkProps> = ({ children, href, title, target, rel, className }) => {
  const isExternal = href?.startsWith('http') || href?.startsWith('//')

  return (
    <a
      href={href}
      title={title}
      target={target || (isExternal ? '_blank' : undefined)}
      rel={rel || (isExternal ? 'noopener noreferrer' : undefined)}
      className={cn(
        'text-blue-600 dark:text-blue-400',
        'hover:text-blue-800 dark:hover:text-blue-300',
        'underline underline-offset-2',
        'decoration-blue-600/30 dark:decoration-blue-400/30',
        'hover:decoration-blue-600 dark:hover:decoration-blue-400',
        'transition-colors duration-150',
        'font-medium',
        className
      )}
    >
      {children}
      {isExternal && (
        <svg
          className="inline-block w-3 h-3 ml-1 opacity-70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </a>
  )
}

/**
 * Professional Image component for MDX Viewer
 */
export const Image: FC<ImageProps> = ({ src, alt, title, width, height, className }) => {
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt}
        title={title}
        width={width}
        height={height}
        className={cn(
          'max-w-full h-auto',
          'rounded-lg shadow-sm',
          'border border-slate-200 dark:border-slate-700',
          className
        )}
        loading="lazy"
      />
      {alt && (
        <figcaption
          className={cn('mt-2 text-sm text-center', 'text-slate-600 dark:text-slate-400', 'italic')}
        >
          {alt}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Professional Horizontal Rule component for MDX Viewer
 */
export const HorizontalRule: FC<HorizontalRuleProps> = ({ className }) => {
  return (
    <hr
      className={cn(
        'my-8 border-0 h-px',
        'bg-gradient-to-r from-transparent via-slate-300 to-transparent',
        'dark:via-slate-600',
        className
      )}
    />
  )
}
