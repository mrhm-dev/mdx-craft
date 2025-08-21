'use client'

import { FC, ReactNode } from 'react'
import { cn } from '../../../theme/utils.js'

type ListProps = {
  children: ReactNode
  className?: string
}

type ListItemProps = {
  children: ReactNode
  className?: string
}

/**
 * Professional Unordered List component for MDX Viewer
 */
export const UnorderedList: FC<ListProps> = ({ children, className }) => {
  return (
    <ul
      className={cn(
        'list-disc list-outside ml-6 mb-6 space-y-2',
        'text-slate-700 dark:text-slate-300',
        '[&>li]:pl-1',
        className
      )}
    >
      {children}
    </ul>
  )
}

/**
 * Professional Ordered List component for MDX Viewer
 */
export const OrderedList: FC<ListProps> = ({ children, className }) => {
  return (
    <ol
      className={cn(
        'list-decimal list-outside ml-6 mb-6 space-y-2',
        'text-slate-700 dark:text-slate-300',
        '[&>li]:pl-1',
        className
      )}
    >
      {children}
    </ol>
  )
}

/**
 * Professional List Item component for MDX Viewer
 */
export const ListItem: FC<ListItemProps> = ({ children, className }) => {
  return (
    <li
      className={cn(
        'text-base md:text-lg leading-7',
        'marker:text-slate-500 dark:marker:text-slate-400',
        // Handle nested lists
        '[&>ul]:mt-2 [&>ul]:mb-0',
        '[&>ol]:mt-2 [&>ol]:mb-0',
        className
      )}
    >
      {children}
    </li>
  )
}
