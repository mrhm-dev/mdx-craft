'use client'

import { FC, ImgHTMLAttributes, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../../utils/index.js'
import { CrossIcon, ImageIcon } from '../../icons/index.js'

type ImageProps = ImgHTMLAttributes<HTMLImageElement>

// Image Modal Component
const ImageModal: FC<{
  src: string
  alt?: string
  title?: string
  onClose: () => void
}> = ({ src, alt, title, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Close modal on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  return createPortal(
    <div
      ref={modalRef}
      className={cn(
        'fixed inset-0 z-50',
        'bg-black/75 backdrop-blur-sm',
        'flex items-center justify-center p-4 md:p-8',
        'transition-opacity duration-200'
      )}
      onClick={handleBackdropClick}
    >
      {/* Modal Image container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          title={title}
          className={cn('max-w-[95vw] max-h-[95vh]', 'object-contain', 'rounded-lg shadow-2xl')}
          loading="eager"
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            'absolute top-4 right-4 z-10',
            'w-10 h-10 rounded-full',
            'bg-black/50 hover:bg-black/70',
            'border border-white/20',
            'flex items-center justify-center',
            'text-white hover:text-white/90',
            'transition-all duration-200',
            'backdrop-blur-sm'
          )}
          aria-label="Close image"
        >
          <CrossIcon className="w-4 h-4" />
        </button>

        {/* Caption overlay */}
        {(alt || title) && (
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0',
              'bg-gradient-to-t from-black/80 to-transparent',
              'p-4 rounded-b-lg'
            )}
          >
            <p className="text-white text-sm font-medium">{title || alt}</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export const Image: FC<ImageProps> = ({ src, alt, title, width, height, className, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageClick = () => {
    if (src && !imageError) {
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <>
      <figure className="my-6">
        {/* Image container with border and 16:9 aspect ratio */}
        <div
          className={cn(
            'relative w-full bg-zinc-100 dark:bg-zinc-900/70',
            'aspect-video',
            'rounded-lg overflow-hidden',
            'border-4 border-zinc-200 dark:border-zinc-700',
            'shadow-sm',
            src && !imageError && 'cursor-zoom-in',
            className
          )}
          onClick={src && !imageError ? handleImageClick : undefined}
          role={src && !imageError ? 'button' : undefined}
          tabIndex={src && !imageError ? 0 : undefined}
          aria-label={
            src && !imageError ? `Click to view ${alt || 'image'} in full size` : undefined
          }
          onKeyDown={
            src && !imageError
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleImageClick()
                  }
                }
              : undefined
          }
        >
          {imageError ? (
            <div
              className={cn(
                'w-full h-full',
                'flex flex-col items-center justify-center',
                'bg-zinc-100 dark:bg-zinc-900/70',
                'text-zinc-500 dark:text-zinc-400'
              )}
            >
              <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">Image not found</p>
              <p className="text-xs mt-1 opacity-75">Unable to load the image</p>
            </div>
          ) : (
            <img
              {...props}
              src={src}
              alt={alt}
              title={title}
              width={width}
              height={height}
              className={cn(
                'w-full h-full',
                'object-contain',
                'transition-transform duration-300 ease-out',
                'hover:scale-105'
              )}
              loading="lazy"
              onError={handleImageError}
            />
          )}
        </div>

        {/* Caption */}
        {(alt || title) && (
          <figcaption
            className={cn(
              'mt-2 text-sm text-center',
              'text-zinc-600 dark:text-zinc-400',
              'italic',
              src &&
                !imageError &&
                'cursor-zoom-in hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors duration-200'
            )}
            onClick={src && !imageError ? handleImageClick : undefined}
            role={src && !imageError ? 'button' : undefined}
            tabIndex={src && !imageError ? 0 : undefined}
            aria-label={
              src && !imageError ? `Click to view ${alt || title} in full size` : undefined
            }
            onKeyDown={
              src && !imageError
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleImageClick()
                    }
                  }
                : undefined
            }
          >
            {title || alt}
          </figcaption>
        )}
      </figure>

      {/* Modal */}
      {isModalOpen && src && (
        <ImageModal src={src} alt={alt} title={title} onClose={handleCloseModal} />
      )}
    </>
  )
}
