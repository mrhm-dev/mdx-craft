'use client'

import React from 'react'
import type { FC, ReactNode } from 'react'
import { cn } from '../../../utils/index.js'

/**
 * Props for the Stack component
 */
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Child elements to stack */
  children: ReactNode
  /** Direction of the stack */
  direction?: 'vertical' | 'horizontal'
  /** Spacing between items */
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** Alignment of items along the main axis */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Justification of items along the cross axis */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  /** Whether to wrap items when they overflow */
  wrap?: boolean
  /** Whether the stack should take full width */
  fullWidth?: boolean
  /** Whether the stack should take full height */
  fullHeight?: boolean
  /** Additional CSS classes */
  className?: string
  /** Whether to add dividers between items */
  dividers?: boolean
  /** Custom gap value (overrides spacing) */
  gap?: string | number
}

/**
 * Spacing values mapping
 */
const spacingMap = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
}

/**
 * Alignment values mapping
 */
const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

/**
 * Justification values mapping
 */
const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

/**
 * Stack component for organizing child components with consistent spacing
 * @example
 * ```tsx
 * <Stack spacing="md" direction="vertical">
 *   <Card>Card 1</Card>
 *   <Card>Card 2</Card>
 *   <Accordion>Content</Accordion>
 * </Stack>
 * ```
 */
export const Stack: FC<StackProps> = ({
  children,
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  fullWidth = false,
  fullHeight = false,
  className,
  dividers = false,
  gap,
  style,
  ...props
}) => {
  const childrenArray = React.Children.toArray(children).filter(Boolean)

  return (
    <div
      className={cn(
        'flex',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        !gap && spacingMap[spacing],
        alignMap[align],
        justifyMap[justify],
        wrap && 'flex-wrap',
        fullWidth && 'w-full',
        fullHeight && 'h-full',
        className
      )}
      style={{
        gap: gap ? `${typeof gap === 'number' ? `${gap}px` : gap}` : undefined,
        ...style,
      }}
      {...props}
    >
      {dividers && direction === 'vertical'
        ? childrenArray.map((child, index) => (
            <React.Fragment key={index}>
              {child}
              {index < childrenArray.length - 1 && <div className="w-full h-px bg-border/50" />}
            </React.Fragment>
          ))
        : dividers && direction === 'horizontal'
          ? childrenArray.map((child, index) => (
              <React.Fragment key={index}>
                {child}
                {index < childrenArray.length - 1 && <div className="h-full w-px bg-border/50" />}
              </React.Fragment>
            ))
          : children}
    </div>
  )
}

/**
 * Vertical Stack component (convenience wrapper)
 * @example
 * ```tsx
 * <VStack spacing="lg">
 *   <Card>Card 1</Card>
 *   <Card>Card 2</Card>
 * </VStack>
 * ```
 */
export const VStack: FC<Omit<StackProps, 'direction'>> = (props) => {
  return <Stack {...props} direction="vertical" />
}

/**
 * Horizontal Stack component (convenience wrapper)
 * @example
 * ```tsx
 * <HStack spacing="lg">
 *   <Button>Button 1</Button>
 *   <Button>Button 2</Button>
 * </HStack>
 * ```
 */
export const HStack: FC<Omit<StackProps, 'direction'>> = (props) => {
  return <Stack {...props} direction="horizontal" />
}
