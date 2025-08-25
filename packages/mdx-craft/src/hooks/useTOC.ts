'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { TOCItem, UseTOCOptions, UseTOCReturn } from '../types/toc.js'

/**
 * Hook to generate Table of Contents from DOM headings with active section tracking
 *
 * @example
 * ```tsx
 * const { items, activeId, scrollTo } = useTOC()
 *
 * return (
 *   <nav>
 *     {items.map(item => (
 *       <button
 *         key={item.id}
 *         onClick={() => scrollTo(item.id)}
 *         className={activeId === item.id ? 'active' : ''}
 *       >
 *         {item.text}
 *       </button>
 *     ))}
 *   </nav>
 * )
 * ```
 */
export const useTOC = (options: UseTOCOptions = {}): UseTOCReturn => {
  const {
    minLevel = 1,
    maxLevel = 6,
    selector = 'h1, h2, h3, h4, h5, h6',
    scrollOffset = 80,
    root = typeof document !== 'undefined' ? document : null,
  } = options

  const [items, setItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map())
  const mutationTimeoutRef = useRef<number | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Scroll to heading function
  const scrollTo = useCallback(
    (id: string) => {
      // Use cached element first, fallback to querySelector
      let element = elementsRef.current.get(id)
      if (!element && root) {
        const escapedId = CSS.escape(id)
        element = root.querySelector(`#${escapedId}`) as HTMLElement
      }

      if (element) {
        // Set flag to prevent observer updates during scroll
        isScrollingRef.current = true

        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }

        const elementTop = element.getBoundingClientRect().top + window.pageYOffset
        const offsetTop = elementTop - scrollOffset

        // Immediately set the active ID when clicking
        setActiveId(id)

        // Track initial scroll position to detect completion
        const initialScrollY = window.scrollY
        const targetScrollY = offsetTop

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        })

        // Use multiple methods to detect scroll completion
        let scrollEndTimer: NodeJS.Timeout
        let lastScrollY = initialScrollY
        let scrollStableCount = 0

        const checkScrollEnd = () => {
          const currentScrollY = window.scrollY

          // Check if scroll position is stable or reached target
          if (
            Math.abs(currentScrollY - lastScrollY) < 1 ||
            Math.abs(currentScrollY - targetScrollY) < 10
          ) {
            scrollStableCount++
          } else {
            scrollStableCount = 0
          }

          lastScrollY = currentScrollY

          // If position is stable for 2 checks or 1 second has passed, re-enable observer
          if (scrollStableCount >= 2) {
            isScrollingRef.current = false
            return
          }

          scrollEndTimer = setTimeout(checkScrollEnd, 50)
        }

        // Start monitoring scroll completion
        scrollEndTimer = setTimeout(checkScrollEnd, 50)

        // Fallback: reset after maximum time regardless
        scrollTimeoutRef.current = setTimeout(() => {
          clearTimeout(scrollEndTimer)
          isScrollingRef.current = false
        }, 1000)
      }
    },
    [root, scrollOffset]
  )

  // Initial setup and mutation observer
  useEffect(() => {
    if (!root) {
      setIsLoading(false)
      return
    }

    // Extract initial TOC items
    const extractItems = () => {
      if (!root) return []

      const headings = root.querySelectorAll(selector)
      const tocItems: TOCItem[] = []
      const newElementsMap = new Map<string, HTMLElement>()

      headings.forEach((heading) => {
        const element = heading as HTMLElement
        const level = parseInt(element.tagName.charAt(1), 10)

        if (level < minLevel || level > maxLevel) return

        const id = getOrGenerateId(element)
        element.id = id

        const text = element.textContent?.trim() || ''
        if (text) {
          tocItems.push({ id, text, level })
          newElementsMap.set(id, element)
        }
      })

      elementsRef.current = newElementsMap
      return tocItems
    }

    setIsLoading(true)
    const tocItems = extractItems()
    setItems(tocItems)
    setIsLoading(false)

    // Set up mutation observer with debouncing
    const debouncedUpdate = () => {
      if (mutationTimeoutRef.current) {
        window.cancelAnimationFrame(mutationTimeoutRef.current)
      }

      mutationTimeoutRef.current = window.requestAnimationFrame(() => {
        const updatedItems = extractItems()
        setItems(updatedItems)
      })
    }

    const mutationObserver = new MutationObserver(debouncedUpdate)
    mutationObserver.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id'],
    })

    return () => {
      mutationObserver.disconnect()
      if (mutationTimeoutRef.current) {
        window.cancelAnimationFrame(mutationTimeoutRef.current)
      }
    }
  }, [root, selector, minLevel, maxLevel])

  // Set up intersection observer for active tracking
  useEffect(() => {
    if (!root || items.length === 0) return

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const observerOptions: IntersectionObserverInit = {
      rootMargin: `-${scrollOffset}px 0px -70% 0px`,
      threshold: [0, 0.1, 0.9, 1],
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (isScrollingRef.current) return

      // Sort entries by their position in the document
      const sortedEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => {
          const aRect = a.boundingClientRect
          const bRect = b.boundingClientRect
          return aRect.top - bRect.top
        })

      if (sortedEntries.length > 0) {
        const topEntry = sortedEntries[0]
        const newActiveId = topEntry?.target.id || ''

        setActiveId((prev) => {
          if (prev !== newActiveId) {
            return newActiveId
          }
          return prev
        })
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    observerRef.current = observer

    // Observe all heading elements
    items.forEach((item) => {
      const element = elementsRef.current.get(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    // Set initial active item only if none is set
    if (!activeId && items.length > 0) {
      const scrollY = window.scrollY
      let closestItem = items[0]
      let minDistance = Infinity

      for (const item of items) {
        const element = elementsRef.current.get(item.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          const distance = Math.abs(rect.top + scrollY - scrollY - scrollOffset)

          if (distance < minDistance && rect.top <= scrollOffset + 100) {
            minDistance = distance
            closestItem = item
          }
        }
      }

      setActiveId(closestItem?.id || '')
    }

    return () => {
      observer.disconnect()
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [items, root, scrollOffset, activeId])

  return useMemo(
    () => ({
      items,
      activeId,
      scrollTo,
      isLoading,
    }),
    [items, activeId, scrollTo, isLoading]
  )
}

// Get or generate ID for an element
const getOrGenerateId = (element: HTMLElement) => {
  let id = element.id
  if (!id) {
    const text = element.textContent || ''
    id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Ensure ID doesn't start with a number
    if (/^\d/.test(id)) {
      id = `heading-${id}`
    }
  }

  return id
}
