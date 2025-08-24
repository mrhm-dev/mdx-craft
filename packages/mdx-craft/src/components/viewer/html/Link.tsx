import { AnchorHTMLAttributes, ReactNode, useState, useRef, useEffect, FC } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../../utils/index.js'
import { Strong } from './Paragraph.js'
import { useLinkPreview } from '../../../hooks/useLinkPreview.js'
import { ExternalLinkIcon } from '../../icons/ExternalLinkIcon.js'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode
}

type PopoverProps = {
  anchorRef: React.RefObject<HTMLElement>
  href?: string
  open: boolean
  onClose: () => void
}

// Enhanced skeleton component that matches the actual preview layout
const PreviewLinkSkeleton: FC = () => (
  <div className="p-5 animate-pulse">
    <div className="flex items-start gap-4">
      {/* Image skeleton */}
      <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 border border-zinc-200 dark:border-zinc-600"></div>

      {/* Content skeleton */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Favicon and site name skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-zinc-300 dark:bg-zinc-600"></div>
          <div className="h-3 bg-zinc-300 dark:bg-zinc-600 rounded w-24"></div>
        </div>

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-zinc-300 dark:bg-zinc-600 rounded w-3/4"></div>
          <div className="h-3 bg-zinc-300 dark:bg-zinc-600 rounded w-full"></div>
        </div>
      </div>
    </div>
  </div>
)

const Popover: FC<PopoverProps> = ({ href, open, onClose, anchorRef }) => {
  const [shouldLoad, setShouldLoad] = useState(false)
  const loadTimer = useRef<number | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  const handleMouseEnter = () => {
    // Clear any pending close timers when hovering over popover
    if (loadTimer.current) {
      clearTimeout(loadTimer.current)
      loadTimer.current = null
    }
  }

  const handleMouseLeave = () => {
    onClose()
  }

  // Only load preview data when popover is actually shown
  useEffect(() => {
    if (open && href) {
      loadTimer.current = window.setTimeout(() => {
        setShouldLoad(true)
      }, 100)
    } else {
      setShouldLoad(false)
    }

    return () => {
      if (loadTimer.current) {
        clearTimeout(loadTimer.current)
        loadTimer.current = null
      }
    }
  }, [open, href])

  if (!open || !href) return null

  // Calculate position for portal
  const getPopoverPosition = () => {
    if (!anchorRef.current) return { top: 0, left: 0 }

    const anchorRect = anchorRef.current.getBoundingClientRect()
    const popoverWidth = 320
    const margin = 16
    const viewportWidth = window.innerWidth

    // Calculate center position
    const centerX = anchorRect.left + anchorRect.width / 2
    let left = centerX - popoverWidth / 2

    // Adjust if would overflow left
    if (left < margin) {
      left = margin
    }
    // Adjust if would overflow right
    else if (left + popoverWidth > viewportWidth - margin) {
      left = viewportWidth - margin - popoverWidth
    }

    return {
      top: anchorRect.bottom + 12, // 12px gap
      left: left,
    }
  }

  const popoverPosition = getPopoverPosition()

  const popoverContent = (
    <div
      ref={popoverRef}
      id="popover-preview"
      className={cn(
        'fixed z-50 min-w-[320px] max-w-sm',
        'rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-700/50',
        'bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl',
        'animate-in fade-in-0 zoom-in-95 duration-200'
      )}
      style={{
        top: popoverPosition.top,
        left: popoverPosition.left,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Arrow pointer */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 dark:bg-zinc-900/95 border-l border-t border-zinc-200/50 dark:border-zinc-700/50 transform rotate-45"></div>

      {shouldLoad ? (
        <LinkPreviewContent url={href} />
      ) : (
        <div className="p-5 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <span className="text-sm font-medium">Loading preview...</span>
          </div>
        </div>
      )}
    </div>
  )

  // Render using portal to avoid container overflow issues
  return createPortal(popoverContent, document.body)
}

// Book icon component
const BookIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    width="32"
    height="32"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={cn('text-zinc-400', className)}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
)

// Image/Favicon component with error handling
const PreviewImage: FC<{
  imageUrl?: string
  faviconUrl?: string
  title?: string
  url: string
}> = ({ imageUrl, faviconUrl, title, url }) => {
  const [imageState, setImageState] = useState<'image' | 'favicon' | 'fallback'>(
    imageUrl ? 'image' : faviconUrl ? 'favicon' : 'fallback'
  )

  const handleImageError = () => {
    if (imageState === 'image' && faviconUrl) {
      setImageState('favicon')
    } else {
      setImageState('fallback')
    }
  }

  const handleFaviconError = () => {
    setImageState('fallback')
  }

  if (imageState === 'fallback') {
    return <BookIcon />
  }

  if (imageState === 'image' && imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={title || url}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={handleImageError}
      />
    )
  }

  if (imageState === 'favicon' && faviconUrl) {
    return (
      <img
        src={faviconUrl}
        alt="favicon"
        className="w-10 h-10 object-contain"
        onError={handleFaviconError}
      />
    )
  }

  return <BookIcon />
}

// Site name component
const SiteName: FC<{ url: string; siteName?: string }> = ({ url, siteName }) => {
  const getHostname = () => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  return (
    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">
      {siteName || getHostname()}
    </span>
  )
}

// Favicon component
const Favicon: FC<{ faviconUrl?: string }> = ({ faviconUrl }) => {
  const [showFavicon, setShowFavicon] = useState(!!faviconUrl)

  if (!showFavicon) return null

  return (
    <img
      src={faviconUrl}
      alt="favicon"
      className="w-3 h-3 rounded-sm shadow-sm"
      onError={() => setShowFavicon(false)}
    />
  )
}

// Separate component for the actual preview content
const LinkPreviewContent: FC<{ url: string }> = ({ url }) => {
  const { loading, error, preview, getFaviconUrl, getBasicSiteInfo } = useLinkPreview(url)

  if (loading) return <PreviewLinkSkeleton />

  // Use fallback data if preview failed
  const displayData = error ? getBasicSiteInfo(url) : preview
  const faviconUrl = displayData.favicon || getFaviconUrl(url)

  return (
    <div className="relative group">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-5 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors rounded-2xl"
      >
        <div className="flex items-start gap-4">
          {/* Image/Favicon area */}
          <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden shadow-sm">
            <PreviewImage
              imageUrl={displayData.image}
              faviconUrl={faviconUrl}
              title={displayData.title}
              url={url}
            />
          </div>

          {/* Content area */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Favicon and site name */}
            <div className="flex items-center gap-2">
              <Favicon faviconUrl={faviconUrl} />
              <SiteName url={url} siteName={displayData.siteName} />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight group-hover:underline line-clamp-2">
                {displayData.title || url}
              </h3>

              {/* Description */}
              {displayData.description && (
                <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2">
                  {displayData.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* External link indicator */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <ExternalLinkIcon className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
          </div>
        </div>
      </a>
    </div>
  )
}

export const Link = ({ children, href, title, target, rel, className, ...props }: LinkProps) => {
  const [showPopover, setShowPopover] = useState(false)
  const timerRef = useRef<number | null>(null)
  const linkRef = useRef<HTMLAnchorElement | null>(null)

  const isExternal = href?.startsWith('http') || href?.startsWith('//')

  const handleMouseEnter = () => {
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    // Show popover for all links (both internal and external)
    timerRef.current = window.setTimeout(() => {
      setShowPopover(true)
    }, 300)
  }

  const handleMouseLeave = () => {
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    // Add a small delay to allow moving to the popover
    timerRef.current = window.setTimeout(() => {
      setShowPopover(false)
    }, 150)
  }

  return (
    <span className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <a
        {...props}
        ref={linkRef}
        href={href}
        title={title}
        target={target || (isExternal ? '_blank' : undefined)}
        rel={rel || (isExternal ? 'noopener noreferrer' : undefined)}
        className={cn('underline underline-offset-3 font-semibold cursor-pointer', className)}
        tabIndex={0}
        aria-describedby={showPopover ? 'popover-preview' : undefined}
      >
        <Strong>{children}</Strong>
      </a>
      <Popover
        anchorRef={linkRef}
        href={href}
        open={showPopover}
        onClose={() => setShowPopover(false)}
      />
    </span>
  )
}
