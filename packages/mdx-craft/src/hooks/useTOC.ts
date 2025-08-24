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

  // Extract TOC items from DOM and cache elements
  const extractTOCItems = useCallback(() => {
    if (!root) return []

    const headings = root.querySelectorAll(selector)
    const tocItems: TOCItem[] = []
    const newElementsMap = new Map<string, HTMLElement>()

    headings.forEach((heading) => {
      const element = heading as HTMLElement
      const level = parseInt(element.tagName.charAt(1), 10)

      // Filter by level
      if (level < minLevel || level > maxLevel) return

      // Get or generate ID
      const id = getOrGenerateId(element)
      element.id = id

      const text = element.textContent?.trim() || ''
      if (text) {
        tocItems.push({ id, text, level })
        // Cache the element for later use
        newElementsMap.set(id, element)
      }
    })

    // Update the elements cache
    elementsRef.current = newElementsMap

    return tocItems
  }, [root, selector, minLevel, maxLevel])

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

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        })

        // Reset the flag after smooth scroll completes (roughly 600ms)
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false
        }, 700)
      }
    },
    [root, scrollOffset]
  )

  // Combined effect for extraction, mutation observer, and initial setup
  useEffect(() => {
    if (!root) {
      setIsLoading(false)
      return
    }

    // Extract initial TOC items
    setIsLoading(true)
    const tocItems = extractTOCItems()
    setItems(tocItems)
    setIsLoading(false)

    // Set up mutation observer with debouncing
    const debouncedUpdate = () => {
      if (mutationTimeoutRef.current) {
        window.cancelAnimationFrame(mutationTimeoutRef.current)
      }

      // Extract TOC items
      mutationTimeoutRef.current = window.requestAnimationFrame(() => {
        const updatedItems = extractTOCItems()
        setItems(updatedItems)
      })
    }

    // Set up mutation observer to update TOC items when DOM changes
    const mutationObserver = new MutationObserver(debouncedUpdate)
    mutationObserver.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id'],
    })

    // Clean up
    return () => {
      mutationObserver.disconnect()
      if (mutationTimeoutRef.current) {
        window.cancelAnimationFrame(mutationTimeoutRef.current)
      }
    }
  }, [extractTOCItems, root])

  // Memoize observer options for stability
  const observerOptions = useMemo<IntersectionObserverInit>(
    () => ({
      rootMargin: `-${scrollOffset}px 0px -70% 0px`,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }),
    [scrollOffset]
  )

  // Memoize observer callback for stability
  const observerCallback = useCallback<IntersectionObserverCallback>(
    (entries) => {
      // Skip updates if we're currently scrolling programmatically
      if (isScrollingRef.current) return

      // Find the topmost intersecting heading
      let topMostEntry: IntersectionObserverEntry | null = null
      let minTop = Infinity

      for (const entry of entries) {
        if (entry.isIntersecting && entry.boundingClientRect.top < minTop) {
          minTop = entry.boundingClientRect.top
          topMostEntry = entry
        }
      }

      if (topMostEntry) {
        setActiveId(topMostEntry.target.id || null)
        return
      }
      // Fallback: find the closest heading above the viewport using cached elements
      const scrollY = window.scrollY
      let closestId = items[0]?.id || null

      for (const item of items) {
        const element = elementsRef.current.get(item.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          const absoluteTop = rect.top + scrollY

          if (absoluteTop <= scrollY + scrollOffset + 10) {
            closestId = item.id
          } else {
            break
          }
        }
      }

      if (closestId) {
        setActiveId(closestId)
      }
    },
    [items, scrollOffset]
  )

  // Set up intersection observer for active tracking
  useEffect(() => {
    if (!root || items.length === 0) return

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all heading elements using cached elements
    items.forEach((item) => {
      const element = elementsRef.current.get(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    // Set initial active item based on scroll position using cached elements
    let initialActive = null

    for (const item of items) {
      const element = elementsRef.current.get(item.id)
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.top >= -100 && rect.top <= window.innerHeight * 0.3) {
          initialActive = item.id
          break
        }
      }
    }

    if (initialActive) {
      setActiveId(initialActive)
    } else if (items.length > 0) {
      // If nothing is specifically visible, activate the first item
      setActiveId(items[0]?.id || null)
    }

    return () => {
      observer.disconnect()
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [items, root, observerCallback, observerOptions])

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
