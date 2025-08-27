'use client'

import { FC, ReactNode, HTMLAttributes, useCallback } from 'react'
import { cn } from '../../../utils/index.js'
import { LinkIcon } from '../../icons/index.js'
import { CopyButton } from '../../common/CopyButton.js'

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
  const getCopyValue = useCallback(() => {
    if (!id) return ''
    return `${window.location.origin}${window.location.pathname}#${id}`
  }, [id])

  return (
    <Component {...props} id={id} className={cn('group relative', className)}>
      {children}
      {id && (
        <CopyButton
          value={getCopyValue}
          standbyIcon={LinkIcon}
          className="p-1.5 rounded-md transition-all duration-200 absolute top-1 right-0 opacity-100 md:opacity-0 md:group-hover:opacity-100"
        />
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
        'text-3xl font-semibold tracking-tight text-foreground font-sans',
        'mb-6 mt-12 scroll-mt-16 leading-tight',
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
        'text-2xl font-semibold tracking-tight text-foreground',
        'mb-4 mt-12 scroll-mt-16',
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
        'text-xl font-semibold tracking-tight text-foreground',
        'mb-3 mt-12 scroll-mt-16',
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
        'text-lg font-semibold tracking-tight text-foreground',
        'mb-2 mt-12 scroll-mt-16',
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
        'text-base font-semibold tracking-tight text-foreground',
        'mb-2 mt-12 scroll-mt-16',
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
        'text-sm font-semibold tracking-tight text-muted-foreground',
        'mb-2 mt-12 scroll-mt-16',
        className
      )}
      id={props.id}
      props={props}
    >
      {children}
    </HeadingWithAnchor>
  )
}
