'use client'

import { FC, HTMLAttributes, useState } from 'react'
import { cn } from '../../../utils/index.js'
import { ExternalLinkIcon } from '../../icons/index.js'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The main title/heading of the card
   */
  title: string

  /**
   * Optional image URL to display at the top of the card
   */
  image?: string

  /**
   * Optional URL to link to when CTA is clicked
   */
  href?: string

  /**
   * Call-to-action text (e.g., "Read More", "Learn More", "View Details")
   * Only displayed if href is also provided
   */
  cta?: string

  /**
   * Optional icon to display next to the title
   */
  icon?: React.ReactNode

  /**
   * Card size variant
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * Whether the image should have rounded corners
   */
  imageRounded?: boolean
}

const ImageWithLoader: FC<{
  src: string
  alt: string
  className: string
  imageRounded?: boolean
}> = ({ src, alt, className, imageRounded }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-zinc-400 dark:border-zinc-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {hasError ? (
        <div className="w-full h-48 sm:h-56 md:h-64 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <div className="text-zinc-400 dark:text-zinc-500 text-center">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Image not available</span>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn(
            className,
            imageRounded && 'rounded-lg m-2',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
      )}
    </div>
  )
}

/**
 * Professional Card component for displaying content with optional image, title, description, and call-to-action
 *
 * Features:
 * - Responsive design with mobile-first approach
 * - Image loading states with error handling
 * - Smooth hover animations and transitions
 * - Accessible link handling with proper ARIA attributes
 * - Dark mode support
 * - Flexible content area for any React children
 *
 * @example
 * ```tsx
 * <Card
 *   title="Amazing Article"
 *   image="/path/to/image.jpg"
 *   href="https://example.com"
 *   cta="Read More"
 *   size="md"
 * >
 *   This is the card description content.
 * </Card>
 * ```
 */
export const Card: FC<CardProps> = ({
  title,
  image,
  href,
  cta,
  icon,
  size = 'md',
  imageRounded = false,
  children,
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: {
      container: 'p-3 sm:p-4',
      title: 'text-base sm:text-lg',
      content: 'text-sm',
      image: 'h-32 sm:h-40',
    },
    md: {
      container: 'p-3 sm:p-5 md:p-6',
      title: 'text-lg sm:text-xl',
      content: 'text-sm sm:text-base',
      image: 'h-48 sm:h-56 md:h-64',
    },
    lg: {
      container: 'p-5 sm:p-6 md:p-8',
      title: 'text-xl',
      content: 'text-base',
      image: 'h-56 sm:h-64 md:h-80',
    },
  }

  const currentSize = sizeStyles[size]

  return (
    <article
      className={cn(
        // Base styles
        'group relative rounded-xl overflow-hidden',
        'bg-white dark:bg-zinc-900/90 backdrop-blur-sm',
        'border border-zinc-200/60 dark:border-zinc-800/60',

        // Shadow system
        'shadow-sm hover:shadow-lg dark:shadow-zinc-900/10',
        'hover:shadow-zinc-200/60 dark:hover:shadow-zinc-900/30',

        // Transitions
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:scale-[1.02]',

        // Focus styles
        'focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:ring-offset-2',

        // Margin
        'mt-6',

        className
      )}
      {...props}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-zinc-50/30 dark:to-zinc-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Image section */}
      {image && (
        <div className={cn('relative', imageRounded && 'p-2')}>
          <ImageWithLoader
            src={image}
            alt={`${title} preview image`}
            className={cn(
              'w-full object-cover transition-all duration-500',
              'group-hover:scale-105',
              currentSize.image
            )}
            imageRounded={imageRounded}
          />

          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Content section */}
      <div className={cn('relative z-10 flex flex-col gap-3', currentSize.container)}>
        {/* Title and Icon */}
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0 mt-1 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-200">
              {icon}
            </div>
          )}
          <h4
            className={cn(
              'font-semibold text-zinc-900 dark:text-zinc-100 leading-tight',
              'group-hover:text-blue-600 dark:group-hover:text-blue-400',
              'transition-colors duration-200',
              currentSize.title
            )}
          >
            {title}
          </h4>
        </div>

        {/* Description content */}
        {children && (
          <div
            className={cn(
              'text-zinc-600 dark:text-zinc-400 leading-relaxed',
              'group-hover:text-zinc-700 dark:group-hover:text-zinc-300',
              'transition-colors duration-200',
              currentSize.content
            )}
          >
            {children}
          </div>
        )}

        {/* Call-to-action */}
        {cta && href && (
          <div className="mt-auto pt-3 flex justify-end">
            <a
              href={href}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                'bg-zinc-100 dark:bg-zinc-800/50',
                'hover:bg-blue-50 dark:hover:bg-blue-900/20',
                'border border-zinc-200 dark:border-zinc-700',
                'hover:border-blue-200 dark:hover:border-blue-800',
                'text-sm font-medium',
                'text-zinc-700 dark:text-zinc-300',
                'hover:text-blue-600 dark:hover:text-blue-400',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2',
                'group/cta'
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${cta}: ${title}`}
            >
              <span>{cta}</span>
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </article>
  )
}
