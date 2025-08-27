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
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-border border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {hasError ? (
        <div className="w-full h-48 sm:h-56 md:h-64 bg-secondary flex items-center justify-center">
          <div className="text-muted-foreground text-center">
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
        'bg-card backdrop-blur-sm',
        'border border-border',

        // Shadow system
        'shadow-sm hover:shadow-lg',

        className
      )}
      {...props}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
          {icon && <div className="flex-shrink-0 mt-1 text-muted-foreground">{icon}</div>}
          <h4 className={cn('font-semibold text-card-foreground leading-tight', currentSize.title)}>
            {title}
          </h4>
        </div>

        {/* Description content */}
        {children && (
          <div className={cn('text-muted-foreground leading-relaxed', currentSize.content)}>
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
                'bg-secondary',
                'hover:bg-accent',
                'border border-border',
                'hover:border-primary',
                'text-sm font-medium',
                'text-secondary-foreground',
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
