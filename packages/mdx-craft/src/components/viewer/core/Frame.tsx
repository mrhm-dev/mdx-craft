'use client'

import { FC, HTMLAttributes, useState, useRef } from 'react'
import { cn } from '../../../utils/index.js'

export interface FrameProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The source URL or embed code to display in the iframe
   */
  src?: string

  /**
   * Raw HTML embed code (for services like YouTube, CodePen, etc.)
   */
  embed?: string

  /**
   * Aspect ratio of the frame (e.g., "16:9", "4:3", "1:1", "21:9")
   */
  ratio?: '16:9' | '4:3' | '1:1' | '21:9' | '3:2' | '9:16' | string

  /**
   * Optional title for the iframe (for accessibility)
   */
  title?: string

  /**
   * Custom width (overrides responsive behavior)
   */
  width?: string | number

  /**
   * Custom height (overrides responsive behavior)
   */
  height?: string | number

  /**
   * Whether to show a loading state
   */
  showLoading?: boolean

  /**
   * Additional iframe attributes
   */
  iframeProps?: React.IframeHTMLAttributes<HTMLIFrameElement>
}

/**
 * Frame component for embedding external content with flexible aspect ratios
 *
 * @example
 * ```tsx
 * // YouTube video
 * <Frame
 *   src="https://www.youtube.com/embed/dQw4w9WgXcQ"
 *   ratio="16:9"
 *   title="YouTube Video"
 * />
 *
 * // Custom embed code
 * <Frame
 *   embed='<iframe src="https://codepen.io/..." width="100%" height="400"></iframe>'
 *   ratio="4:3"
 * />
 *
 * // Fixed dimensions (overrides responsive)
 * <Frame
 *   src="https://example.com"
 *   width={800}
 *   height={600}
 * />
 * ```
 */
export const Frame: FC<FrameProps> = ({
  src,
  embed,
  ratio = '16:9',
  title,
  width,
  height,
  showLoading = true,
  className,
  iframeProps,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(showLoading)
  const [hasError, setHasError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Convert ratio string to CSS aspect-ratio value
  const getAspectRatio = (ratioString: string) => {
    const predefinedRatios: Record<string, string> = {
      '16:9': '16/9',
      '4:3': '4/3',
      '1:1': '1/1',
      '21:9': '21/9',
      '3:2': '3/2',
      '9:16': '9/16', // Portrait/mobile
    }

    if (predefinedRatios[ratioString]) {
      return predefinedRatios[ratioString]
    }

    // Handle custom ratios like "4:5" or "2:1"
    if (ratioString.includes(':')) {
      const [w, h] = ratioString.split(':')
      return `${w}/${h}`
    }

    return ratioString
  }

  // Auto-detect and enhance common embed URLs
  const processEmbedUrl = (url: string): string => {
    // YouTube
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    // Vimeo
    if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }

    // CodePen
    if (url.includes('codepen.io/') && !url.includes('/embed/')) {
      return url.replace('/pen/', '/embed/')
    }

    // JSFiddle
    if (url.includes('jsfiddle.net/') && !url.includes('/embedded/')) {
      return `${url}/embedded/`
    }

    // Figma
    if (url.includes('figma.com/file/')) {
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`
    }

    return url
  }

  const containerStyle =
    width || height
      ? { width: width || '100%', height: height || '400px' }
      : { aspectRatio: getAspectRatio(ratio) }

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Render embed code if provided
  if (embed) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800',
          'bg-zinc-50 dark:bg-zinc-900/50',
          !(width || height) && 'w-full',
          className
        )}
        style={containerStyle}
        {...props}
      >
        <div
          className="absolute inset-0 w-full h-full"
          dangerouslySetInnerHTML={{ __html: embed }}
        />
      </div>
    )
  }

  // Render iframe with src
  if (src) {
    const processedSrc = processEmbedUrl(src)

    return (
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800',
          'bg-zinc-50 dark:bg-zinc-900/50',
          !(width || height) && 'w-full',
          className
        )}
        style={containerStyle}
        {...props}
      >
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 border-t-zinc-600 dark:border-t-zinc-300 rounded-full animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-zinc-500 dark:text-zinc-400">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.232 16.5C2.462 18.333 3.524 20 5.064 20z"
                />
              </svg>
              <div className="text-sm">Failed to load content</div>
              <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                Check the URL or try again later
              </div>
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          src={processedSrc}
          title={title || 'Embedded content'}
          className="absolute inset-0 w-full h-full border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          {...iframeProps}
        />
      </div>
    )
  }

  // Fallback: empty frame
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800',
        'bg-zinc-50 dark:bg-zinc-900/50',
        'flex items-center justify-center',
        !(width || height) && 'w-full',
        className
      )}
      style={containerStyle}
      {...props}
    >
      <div className="text-center text-zinc-500 dark:text-zinc-400">
        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <div className="text-sm">No content to display</div>
        <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          Provide a src URL or embed code
        </div>
      </div>
    </div>
  )
}
