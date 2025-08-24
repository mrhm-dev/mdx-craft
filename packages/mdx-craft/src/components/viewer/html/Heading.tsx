'use client'

import { FC, ReactNode, HTMLAttributes, useState, useCallback } from 'react'
import { cn } from '../../../utils/index.js'
import { Link2, Check } from 'lucide-react'

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  children?: ReactNode
}

/**
 * Base heading component with copy functionality
 */
const HeadingWithAnchor: FC<{
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: ReactNode
  className?: string
  id?: string
  props?: HTMLAttributes<HTMLHeadingElement>
}> = ({ as: Component, children, className, id, props }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!id) return

      const url = `${window.location.origin}${window.location.pathname}#${id}`

      try {
        await navigator.clipboard.writeText(url)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    },
    [id]
  )

  return (
    <Component {...props} id={id} className={cn('group relative', className)}>
      {children}
      {id && (
        <button
          onClick={handleCopy}
          className={cn(
            'absolute inline-flex items-center justify-center',
            'ml-2 p-1.5 rounded-md',
            'text-zinc-300 dark:text-zinc-600 hover:text-zinc-400 dark:hover:text-zinc-500',
            'hover:bg-zinc-100 dark:hover:bg-zinc-800',
            'transition-all duration-200',
            'opacity-0 group-hover:opacity-100',
            '-translate-y-[50%] top-[50%]'
          )}
          aria-label={isCopied ? 'Link copied!' : 'Copy link to section'}
          title={isCopied ? 'Link copied!' : 'Copy link to section'}
        >
          {isCopied ? (
            <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
        </button>
      )}
    </Component>
  )
}

/**
 * Professional H1 component for MDX Viewer
 */
export const H1: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <HeadingWithAnchor
      as="h1"
      className={cn(
        'text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans',
        'mb-6 scroll-mt-16',
        className
      )}
      id={props.id}
      props={props}
    >
      {children}
    </HeadingWithAnchor>
  )
}

/**
 * Professional H2 component for MDX Viewer
 */
export const H2: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <HeadingWithAnchor
      as="h2"
      className={cn(
        'text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100',
        'mb-4 scroll-mt-16',
        className
      )}
      id={props.id}
      props={props}
    >
      {children}
    </HeadingWithAnchor>
  )
}

/**
 * Professional H3 component for MDX Viewer
 */
export const H3: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <HeadingWithAnchor
      as="h3"
      className={cn(
        'text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100',
        'mb-3 scroll-mt-16',
        className
      )}
      id={props.id}
      props={props}
    >
      {children}
    </HeadingWithAnchor>
  )
}

/**
 * Professional H4 component for MDX Viewer
 */
export const H4: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <HeadingWithAnchor
      as="h4"
      className={cn(
        'text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100',
        'mb-3 scroll-mt-16',
        className
      )}
      id={props.id}
      props={props}
    >
      {children}
    </HeadingWithAnchor>
  )
}

/**
 * Professional H5 component for MDX Viewer
 */
export const H5: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <HeadingWithAnchor
      as="h5"
      className={cn(
        'text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100',
        'mb-2 scroll-mt-16',
        className
      )}
      id={props.id}
      props={props}
    >
      {children}
    </HeadingWithAnchor>
  )
}

/**
 * Professional H6 component for MDX Viewer
 */
export const H6: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <HeadingWithAnchor
      as="h6"
      className={cn(
        'text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-300',
        'mb-2 scroll-mt-16',
        className
      )}
      id={props.id}
      props={props}
    >
      {children}
    </HeadingWithAnchor>
  )
}
