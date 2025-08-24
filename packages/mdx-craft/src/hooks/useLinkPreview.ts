'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

export type Preview = {
  title?: string
  description?: string
  image?: string
  siteName?: string
  favicon?: string
}

// CORS proxy services - we'll try them in order
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://thingproxy.freeboard.io/fetch/',
  'https://cors-anywhere.herokuapp.com/',
  'https://corsproxy.io/?',
]

// Cache for storing successful previews
const previewCache = new Map<string, Preview>()

// Utility function to parse URL and handle both absolute and relative URLs
const parseUrl = (url: string): URL => {
  try {
    return new URL(url)
  } catch {
    // If it's a relative URL, construct absolute URL
    return new URL(url, window.location.origin)
  }
}

// Utility function to get favicon URL
const getFaviconUrl = (url: string): string | undefined => {
  try {
    const urlObj = parseUrl(url)
    return `${urlObj.origin}/favicon.ico`
  } catch {
    return undefined
  }
}

// Extract preview data from HTML content
const extractPreviewData = (html: string, url: string): Preview => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Helper function to get meta content
  const getMetaContent = (name: string, property?: string): string | null => {
    if (property) {
      return (
        doc.querySelector(`meta[property="${property}"]`)?.getAttribute('content') ||
        doc.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ||
        null
      )
    }
    return doc.querySelector(`meta[name="${name}"]`)?.getAttribute('content') || null
  }

  // Extract favicon from various link tags
  const extractFavicon = (): string | undefined => {
    const favicon =
      doc.querySelector('link[rel="icon"]')?.getAttribute('href') ||
      doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
      doc.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href') ||
      undefined

    if (favicon) {
      try {
        // Convert relative favicon URLs to absolute
        const faviconUrl = new URL(favicon, url)
        return faviconUrl.href
      } catch {
        return favicon
      }
    }
    return undefined
  }

  return {
    title:
      getMetaContent('og:title', 'og:title') ||
      getMetaContent('twitter:title', 'twitter:title') ||
      doc.querySelector('title')?.textContent?.trim() ||
      undefined,

    description:
      getMetaContent('og:description', 'og:description') ||
      getMetaContent('twitter:description', 'twitter:description') ||
      getMetaContent('description') ||
      undefined,

    image:
      getMetaContent('og:image', 'og:image') ||
      getMetaContent('twitter:image', 'twitter:image') ||
      undefined,

    siteName:
      getMetaContent('og:site_name', 'og:site_name') ||
      getMetaContent('application-name') ||
      undefined,

    favicon: extractFavicon(),
  }
}

// Fetch HTML content using CORS proxies with timeout
const fetchHtmlWithProxy = async (url: string, signal: AbortSignal): Promise<string> => {
  const timeout = 10000 // 10 second timeout

  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(proxyUrl, {
        signal: AbortSignal.any([signal, controller.signal]),
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const html = await response.text()

      // Basic validation that we got HTML content
      if (html && (html.includes('<html') || html.includes('<head') || html.includes('<title'))) {
        return html
      } else {
        throw new Error('Invalid HTML content')
      }
    } catch {
      // Continue to next proxy if this one fails
      continue
    }
  }

  throw new Error('All proxies failed')
}

// Generate basic site info when preview fails
const generateBasicSiteInfo = (url: string): Preview => {
  try {
    const urlObj = parseUrl(url)
    return {
      title: urlObj.hostname,
      siteName: urlObj.hostname,
      favicon: getFaviconUrl(url),
      image: undefined,
      description: undefined,
    }
  } catch {
    // If URL parsing fails, return a basic fallback
    return {
      title: url,
      siteName: url,
      image: undefined,
      description: undefined,
      favicon: undefined,
    }
  }
}

export const useLinkPreview = (url: string) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [preview, setPreview] = useState<Preview>({})
  const abortControllerRef = useRef<AbortController | null>(null)

  // Memoized favicon URL getter
  const getFaviconUrlMemo = useCallback((url: string) => getFaviconUrl(url), [])

  // Memoized basic site info getter
  const getBasicSiteInfo = useCallback((url: string): Preview => generateBasicSiteInfo(url), [])

  useEffect(() => {
    // Reset state
    setLoading(true)
    setError(false)
    setPreview({})

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    const fetchPreview = async () => {
      try {
        // Check cache first
        if (previewCache.has(url)) {
          setPreview(previewCache.get(url)!)
          setLoading(false)
          return
        }

        // Validate URL
        if (!url || typeof url !== 'string') {
          throw new Error('Invalid URL')
        }

        const urlObj = parseUrl(url)

        // Validate protocol
        if (!urlObj.protocol.startsWith('http')) {
          throw new Error('Invalid URL protocol')
        }

        // Fetch HTML content
        const html = await fetchHtmlWithProxy(url, abortControllerRef.current!.signal)

        // Extract preview data
        const previewData = extractPreviewData(html, url)

        // Validate that we got some useful data
        if (!previewData.title && !previewData.description && !previewData.image) {
          throw new Error('No preview data found')
        }

        // Cache the result
        previewCache.set(url, previewData)

        setPreview(previewData)
        setLoading(false)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return // Request was cancelled
        }

        console.warn('Link preview failed:', error)
        setError(true)
        setLoading(false)
      }
    }

    // Add a small delay to avoid too many requests
    const timeoutId = setTimeout(fetchPreview, 100)

    return () => {
      clearTimeout(timeoutId)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [url])

  return {
    loading,
    error,
    preview,
    getFaviconUrl: getFaviconUrlMemo,
    getBasicSiteInfo,
  }
}
