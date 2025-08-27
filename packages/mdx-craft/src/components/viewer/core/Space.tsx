'use client'

import { FC, HTMLAttributes } from 'react'
import { cn } from '../../../utils/index.js'

/**
 * Props for the Space component
 */
interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Vertical space size using Tailwind spacing scale (e.g., '4', '8', '16') */
  y?: string

  /** Horizontal space size using Tailwind spacing scale (e.g., '4', '8', '16') */
  x?: string

  /** Shorthand for both x and y spacing (overridden by specific x/y props) */
  size?: string

  /** Additional CSS classes */
  className?: string
}

/**
 * Space component for adding consistent spacing in MDX content
 *
 * A simple utility component to add vertical or horizontal space between elements
 * without the need for custom CSS or margin/padding utilities.
 *
 * Features:
 * - Uses Tailwind spacing scale for consistency
 * - Supports both vertical and horizontal spacing
 * - Simple API with intuitive prop names
 * - Responsive and theme-aware
 *
 * @param y - Vertical space (height) using Tailwind scale
 * @param x - Horizontal space (width) using Tailwind scale
 * @param size - Apply same spacing to both x and y directions
 * @param className - Additional CSS classes for customization
 *
 * @example
 * ```tsx
 * // Add vertical space between sections
 * <Space y="8" />
 *
 * // Add horizontal space between inline elements
 * <Space x="4" />
 *
 * // Add both vertical and horizontal space
 * <Space x="4" y="8" />
 *
 * // Quick shorthand for equal spacing
 * <Space size="6" />
 *
 * // Large section divider
 * <Space y="16" />
 *
 * // Small inline spacer
 * <Space x="2" />
 * ```
 *
 * Common spacing values:
 * - `2` = 0.5rem (8px)
 * - `4` = 1rem (16px)
 * - `6` = 1.5rem (24px)
 * - `8` = 2rem (32px)
 * - `12` = 3rem (48px)
 * - `16` = 4rem (64px)
 */
export const Space: FC<SpaceProps> = ({ y, x, size, className, ...props }) => {
  // Use size as fallback for both x and y if they're not specified
  const verticalSpace = y || size
  const horizontalSpace = x || size

  // Build height and width classes
  const heightClass = verticalSpace ? `h-${verticalSpace}` : undefined
  const widthClass = horizontalSpace ? `w-${horizontalSpace}` : undefined

  return (
    <div
      className={cn('block', heightClass, widthClass, className)}
      aria-hidden="true"
      {...props}
    />
  )
}

Space.displayName = 'Space'
