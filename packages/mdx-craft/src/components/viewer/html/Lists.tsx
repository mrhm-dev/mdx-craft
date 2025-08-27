'use client'

import { FC, ReactNode } from 'react'
import { cn } from '../../../utils/index.js'

type ListProps = {
  children: ReactNode
  className?: string
}

type ListItemProps = {
  children: ReactNode
  className?: string
}

/**
 * Checkbox component for unchecked todo items
 */
const UncheckedCheckbox: FC = () => (
  <div className="inline-flex items-center justify-center w-4 h-4 mr-3 mt-0.5 flex-shrink-0">
    <div className="w-4 h-4 border-2 border-muted-foreground rounded-sm bg-background" />
  </div>
)

/**
 * Checkbox component for checked todo items
 */
const CheckedCheckbox: FC = () => (
  <div className="inline-flex items-center justify-center w-4 h-4 mr-3 mt-0.5 flex-shrink-0">
    <div className="w-4 h-4 border-2 border-green-500 bg-green-500 rounded-sm flex items-center justify-center">
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  </div>
)

/**
 * Helper function to detect and parse todo items from MDX-processed content
 */
const parseTodoContent = (
  children: ReactNode
): { isTodo: boolean; isChecked: boolean; content: ReactNode } => {
  // Check if children is an array and first element is a checkbox input
  if (Array.isArray(children) && children.length > 0) {
    const firstChild = children[0]

    // Check if first child is a React element with type 'input' and type='checkbox'
    if (
      firstChild &&
      typeof firstChild === 'object' &&
      'type' in firstChild &&
      firstChild.type === 'input' &&
      'props' in firstChild &&
      firstChild.props?.type === 'checkbox'
    ) {
      // This is a todo item! MDX has already processed it
      const isChecked =
        firstChild.props?.checked === true || firstChild.props?.defaultChecked === true

      // Extract the content (skip the checkbox and any whitespace)
      const contentChildren = children.slice(1).filter((child) => {
        // Filter out pure whitespace
        return !(typeof child === 'string' && child.trim() === '')
      })

      return {
        isTodo: true,
        isChecked,
        content: contentChildren.length === 1 ? contentChildren[0] : contentChildren,
      }
    }
  }

  return { isTodo: false, isChecked: false, content: children }
}

/**
 * Professional Unordered List component for MDX Viewer
 */
export const UnorderedList: FC<ListProps> = ({ children, className }) => {
  return (
    <ul
      className={cn(
        'list-disc list-outside ml-6 mb-6 space-y-2',
        'text-muted-foreground',
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
        'text-muted-foreground',
        '[&>li]:pl-1',
        className
      )}
    >
      {children}
    </ol>
  )
}

/**
 * Professional List Item component for MDX Viewer with todo checkbox support
 */
export const ListItem: FC<ListItemProps> = ({ children, className }) => {
  const { isTodo, isChecked, content } = parseTodoContent(children)

  if (isTodo) {
    return (
      <li
        className={cn(
          'text-base leading-6 flex items-start',
          'list-none -ml-6', // Remove default list styling and cancel parent margin for todos
          '[&>ul]:mt-2 [&>ul]:mb-0 [&>ul]:ml-7',
          '[&>ol]:mt-2 [&>ol]:mb-0 [&>ol]:ml-7',
          className
        )}
      >
        {isChecked ? <CheckedCheckbox /> : <UncheckedCheckbox />}
        <span className={cn('flex-1', isChecked && 'line-through text-muted-foreground')}>
          {content}
        </span>
      </li>
    )
  }

  return (
    <li
      className={cn(
        'text-base leading-6',
        'marker:text-muted-foreground',
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
